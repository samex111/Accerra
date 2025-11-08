import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, Paperclip } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const GeminiStream: React.FC = () => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [prompt, setPrompt] = useState("");
  const [onPrompt, setOnPrompt] = useState("");
  const [isAnalyze, setIsAnalyze] = useState(false);
  const [file, setFile] = useState<null | File>(null);
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isFileUrl, setIsFileUrl] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // File Upload
  const handleFileChange = async (e: any) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    const res = await fetch("http://localhost:3000/api/v1/user/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setFileUrl(data.imageUrl);
    } else {
      alert("Upload failed " + data.error);
    }
  };

  // Streaming
  useEffect(() => {
    if (!prompt) return;

    // Add user message first
    setMessages((prev) => [...prev, { role: "user", content: onPrompt }]);

    // Add placeholder for AI response
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    if (fileUrl) setIsFileUrl(fileUrl);
    else setIsFileUrl("");

    const eventSource = new EventSource(
      `http://localhost:3000/api/v1/user/stream?prompt=${encodeURIComponent(
        prompt + isFileUrl
      )}`
    );

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        if (parsedData?.content) {
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMsg = newMessages[newMessages.length - 1];
            if (lastMsg.role === "assistant") {
              lastMsg.content += parsedData.content;
            }
            return newMessages;
          });
        }
      } catch {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === "assistant") {
            lastMsg.content += event.data;
          }
          return newMessages;
        });
      }
    };

    eventSource.addEventListener("end", () => {
      eventSource.close();
      setPrompt("");
      setOnPrompt("");
      setFileUrl(null);
    });

    return () => {
      eventSource.close();
    };
  }, [prompt]);

  const sendMessage = () => {
    if (!onPrompt.trim()) return;
    setPrompt(onPrompt);
  };

  return (
    <div className="flex flex-col bg-[#FFFF] text-gray-100 h-screen relative left-[16vw] w-[84vw] overflow-hidden">
      {/* Header */}
      <header className="p-4 text-center border-b border-gray-700 text-2xl font-semibold text-blue-400">
        Ace AI
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-600">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-md ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black dark:bg-gray-800 dark:text-gray-100"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: ({ node, inline, className, children, ...props }) => {
                    return inline ? (
                      <code className="bg-gray-300 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-medium" {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm my-2">
                        <code>{children}</code>
                      </pre>
                    );
                  },
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
                }}
              >
                {msg.role === "assistant" && msg.content === ""
                  ? "Thinking"
                  : msg.content}
              </ReactMarkdown>

              {/* Typing cursor */}
              {msg.role === "assistant" && index === messages.length - 1 && msg.content && (
                <span className="inline-block w-2 h-5 bg-gray-600 animate-pulse ml-1 align-middle">▍</span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t border-gray-700 bg-[#1A1A1A]/80 backdrop-blur-md p-4 flex items-center gap-3 fixed bottom-0 w-[84vw] left-[16vw]">
        <label className="cursor-pointer hover:scale-105 transition-transform">
          <Paperclip className="text-gray-300 hover:text-white" />
          <Input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>

        <textarea
          rows={1}
          value={onPrompt}
          onChange={(e) => setOnPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
          placeholder="Send a message..."
          className="flex-1 resize-none rounded-2xl bg-[#2A2A2A] text-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
        />

        <Button
          size="icon"
          className="rounded-full bg-blue-600 hover:bg-blue-700 transition-transform hover:scale-105"
          onClick={sendMessage}
        >
          <ArrowUp className="text-white" />
        </Button>

        <Button
          onClick={() => setIsAnalyze((prev) => !prev)}
          className={`rounded-full ml-2 ${
            isAnalyze
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Analyze
        </Button>
      </div>
    </div>
  );
};

export default GeminiStream;