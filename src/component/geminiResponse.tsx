import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, Paperclip, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = { role: "user" | "assistant"; content: string };

const GeminiStream: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🌀 Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📁 File Upload with Progress
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
      xhr.open("POST", "http://localhost:3000/api/v1/user/upload");
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

    const query = encodeURIComponent(currentPrompt + (fileUrl || ""));
    const eventSource = new EventSource(
      `http://localhost:3000/api/v1/user/stream?prompt=${query}`
    );

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const chunk = parsed?.content || event.data;

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

  // ✉️ Send message
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

  return (
    <div className="flex flex-col bg-white h-screen w-[84vw] left-[16vw] text-gray-100 relative overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b border-gray-700 text-center text-2xl font-semibold text-blue-500">
        Ace AI
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-500">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-md ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-black dark:bg-gray-800 dark:text-gray-100"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: ({ inline, children, ...props }) =>
                    inline ? (
                      <code
                        className="bg-gray-300 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-medium"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-sm my-2">
                        <code>{children}</code>
                      </pre>
                    ),
                  p: ({ children }) => <p className="mb-2">{children}</p>,
                }}
              >
                {msg.role === "assistant" && !msg.content
                  ? "Thinking..."
                  : msg.content}
              </ReactMarkdown>

              {msg.role === "assistant" &&
                i === messages.length - 1 &&
                msg.content && (
                  <span className="inline-block w-2 h-5 bg-gray-600 animate-pulse ml-1 align-middle">
                    ▍
                  </span>
                )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview + Upload Progress */}
      {(file || fileUrl || isUploading) && (
        <div className="fixed bottom-24 left-[16vw] w-[84vw] bg-gray-100 dark:bg-gray-800 p-3 flex items-center gap-3 shadow-lg border-t border-gray-700">
          {fileUrl && (
            <div className="relative">
              <img
                src={fileUrl}
                alt="Preview"
                className="h-20 w-20 object-cover rounded-lg border"
              />
              <button
                onClick={removeImage}
                className="absolute top-1 right-1 bg-black/70 p-1 rounded-full text-white hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          )}
          {isUploading && (
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
                Uploading {uploadProgress}%
              </p>
              <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Bar */}
      <div className="border-t border-gray-700 p-4 flex items-center gap-3 fixed bottom-0 w-[84vw] left-[16vw] bg-white dark:bg-gray-900">
        <label className="cursor-pointer hover:scale-105 transition-transform">
          <Paperclip className="text-gray-500 hover:text-blue-500" />
          <Input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
        </label>

        <Button
          onClick={() => setIsAnalyzing((prev) => !prev)}
          className={`rounded-full ml-2 ${
            isAnalyzing
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </Button>

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
          placeholder="Send a message..."
          className="flex-1 resize-none rounded-2xl bg-[#2A2A2A] text-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Button
          size="icon"
          onClick={handleSend}
          disabled={isUploading}
          className="rounded-full bg-blue-600 hover:bg-blue-700 transition-transform hover:scale-105"
        >
          <ArrowUp className="text-white" />
        </Button>
      </div>
    </div>
  );
};

export default GeminiStream;
