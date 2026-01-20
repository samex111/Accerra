import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, Paperclip, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { API_URL } from "@/config/env";


type Message = { role: "user" | "assistant"; content: string };
interface conversationProps {
  conversationId: string;
  sender: 'student' | 'ai';
  message: string;
  createdAt: Date;
}
interface handleAddMessageProps {
  conversationId: string,
  sender: 'user' | 'ai',
  message: string
}
const GeminiStream: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [conversation, setConvesation] = useState<conversationProps[]>([])
  const [conversationId, setConvesationId] = useState<string>('')
  const [allConversationId, setAllConvesationId] = useState<string>('')
  let fullResponse = '';

  const messagesEndRef = useRef<HTMLDivElement>(null);
  console.log("massage1: ", messages)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setUploadProgress(0);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selected);

    try {
      // ✅ Use XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_URL}/api/v1/user/upload`);
      xhr.withCredentials = true;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        const data = JSON.parse(xhr.responseText);
        if (data.success) {
          setFileUrl(data.imageUrl);
        } else {
          alert("Upload failed: " + data.error);
        }
        setIsUploading(false);
      };

      xhr.onerror = () => {
        alert("Upload failed due to network error");
        setIsUploading(false);
      };

      xhr.send(formData);
    } catch (err: any) {
      alert("Upload error: " + err.message);
      setIsUploading(false);
    }
  };

  // 🚀 AI Streaming Handler
  useEffect(() => {
    if (!currentPrompt) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userInput },
      { role: "assistant", content: "" },
    ]);
    if (!conversationId) {
      handleCreateConversationId()
    }

    const query = encodeURIComponent(currentPrompt);
    const eventSource = new EventSource(
      `${API_URL}/api/v1/user/stream?prompt=${query}&fileUrl=${fileUrl}&isAnlyze=${isAnalyzing}`
    );
    handleAddMessage(conversationId!, 'student', query)
    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const chunk = parsed?.content || event.data;
        console.log("Chunk: ", chunk)
        fullResponse = fullResponse + chunk;
        console.log("Full response: ", fullResponse)
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last.role === "assistant") {
            return [
              ...prev.slice(0, -1),
              { ...last, content: last.content + chunk },
            ];
          }
          return [...prev, { role: "assistant", content: chunk }];
        });
      } catch {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last.role === "assistant") {
            return [
              ...prev.slice(0, -1),
              { ...last, content: last.content + event.data },
            ];
          }
          return [...prev, { role: "assistant", content: event.data }];
        });
      }
    };
    eventSource.addEventListener("end", () => {
      handleAddMessage(conversationId!, 'ai', fullResponse)

      console.log('end')
      eventSource.close();
      setCurrentPrompt("");
      setUserInput("");
      setFileUrl(null);
      setFile(null);
      setUploadProgress(0);
    });

    eventSource.onerror = () => eventSource.close();

    return () => eventSource.close();
  }, [currentPrompt]);

  const handleSend = () => {
    if (!userInput.trim()) return;
    setCurrentPrompt(userInput);
  };

  // 🧹 Remove selected image
  const removeImage = () => {
    setFile(null);
    setFileUrl(null);
    setUploadProgress(0);
  };

  const [bottom, setBottom] = useState(false)
  useEffect(() => {
    if (currentPrompt == '' && messages.length == 0) {
      setBottom(true);
    } else { setBottom(false) }
  }, [currentPrompt, messages]);

  useEffect(() => {
    async function fetchConvesations() {
      await fetch(`${API_URL}/api/v1/user/get/conversation/${conversationId}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include"
      })
        .then((res) => res.json())
        .then((data) => setConvesation(data)) 
        .catch((err) => console.error("IN setcONVERSATION: ", err));
      console.log("conversations: ", conversation);
    }
    fetchConvesations();
  }, [userInput, messages])

  useEffect(()=>{
    try{
      fetch(`${API_URL}/api/v1/user/get/all/conversation`,{
        method:'GET',
        headers:{'Content-Type':"application/json"},
        credentials:"include"
      })
      .then((res)=>res.json())
      .then((data)=>{
        setAllConvesationId(data)
        console.log(data)
      })  
      
    }
    catch(e){
      console.error("Error in get All convessatinID: ", e)
    }
  },[])

  const  handleAddMessage = async (conversationId: string, sender: 'student' | 'ai', message: string) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/user/create/massage/conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          conversationId: conversationId,
          sender: sender,
          message: message
        })
      });
      const data = await res.json();
      console.log("Data: ", data)

    } catch (e) {
      console.error("In the handleAddMessage Catch: ", e)
    }
  }
  async function handleCreateConversationId() {
    try {
      const res = await fetch(`${API_URL}/api/v1/user/create/conversationId`, {
        method: "POST",
        credentials: "include"
      })
      const data = await res.json();
      console.log('conversationID: ', data)
      setConvesationId(data)
    } catch (e) {
      console.error("Error in the creating conversation id: ", e)
    }
  }
return (
  <div className="flex h-full flex-col bg-background text-foreground">
    {/* Header */}
    

    {/* Messages */}
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";

        return (
          <div
            key={i}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow
                ${isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
                }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: ({ inline, children }) =>
                    inline ? (
                      <code className="rounded bg-black/10 px-1 py-0.5 text-xs">
                        {children}
                      </code>
                    ) : (
                      <pre className="rounded-lg bg-black p-3 text-xs text-white overflow-x-auto">
                        <code>{children}</code>
                      </pre>
                    ),
                  p: ({ children }) => (
                    <p className="mb-2 last:mb-0">{children}</p>
                  ),
                }}
              >
                {msg.role === "assistant" && !msg.content
                  ? "Thinking…"
                  : msg.content}
              </ReactMarkdown>

              {msg.role === "assistant" &&
                i === messages.length - 1 &&
                msg.content && (
                  <span className="inline-block w-2 h-4 bg-muted-foreground animate-pulse ml-1 align-middle">
                    ▍
                  </span>
                )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>

    {/* File preview / upload */}
    {(file || fileUrl || isUploading) && (
      <div className="border-t bg-muted/50 px-6 py-3">
        <div className="flex items-center gap-4">
          {fileUrl && (
            <div className="relative">
              <img
                src={fileUrl}
                alt="Preview"
                className="h-16 w-16 rounded-md object-cover border"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-white"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {isUploading && (
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">
                Uploading {uploadProgress}%
              </p>
              <div className="h-2 w-full rounded bg-muted">
                <div
                  className="h-2 rounded bg-primary transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Input Bar */}
    <div className="sticky bottom-0 border-t bg-background px-6 py-4">
      <div className="flex items-end gap-3">
        <label className="cursor-pointer flex">
          <Paperclip className="text-muted-foreground mt-1 hover:text-primary" />
           <Button
          onClick={() => setIsAnalyzing((prev) => !prev)}
          className={`rounded-full ml-2 ${isAnalyzing
            ? "bg-gray-800 hover:bg-gray-600"
            : "bg-gray-600 hover:bg-gray-500"
            }`}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </Button>
          <Input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
        </label>

        <textarea
          rows={1}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Message Accerra AI…"
          className="flex-1 resize-none rounded-xl bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <Button
          size="icon"
          onClick={handleSend}
          disabled={isUploading}
          className="rounded-full"
        >
          <ArrowUp />
        </Button>
      </div>
    </div>
  </div>
);

};

export default GeminiStream;
