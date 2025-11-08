import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, Paperclip } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

const GeminiStream: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [onPrompt, setOnPrompt] = useState("");
  const [isAnalyze, setIsAnalyze] = useState(false);
  const [file, setFile] = useState<null | File>(null);
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isFileUrl, setIsFileUrl] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔄 Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📂 Handle File Upload
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

  // 🔁 Stream Setup
  useEffect(() => {
    if (!prompt) return;

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
          setMessages((prev) => [...prev, parsedData.content]);
        }
      } catch {
        setMessages((prev) => [...prev, event.data]);
      }
    };

    eventSource.addEventListener("end", () => {
      eventSource.close();
    });

    return () => {
      eventSource.close();
    };
  }, [prompt]);

  return (
    <div className="flex flex-col bg-[#FFFF] text-gray-100 h-screen relative left-[16vw] w-[84vw] overflow-hidden">
      {/* Header */}
      <header className="p-4 text-center border-b border-gray-700 text-2xl font-semibold text-blue-400">
        Ace AI 💫
      </header>

      {/* Chat Section */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6  scrollbar-thin scrollbar-thumb-gray-600">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={``}
          >
            <div
              className={`relative bottom-[20vh] max-w-[70%] px-4 py-2 rounded-2xl text-black`}
            >
              <ReactMarkdown>{msg}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-700 bg-[#1A1A1A]/80 backdrop-blur-md  p-4 flex items-center gap-3 fixed bottom-0 w-[84vw]">
        {/* File Upload */}
        <label className="cursor-pointer hover:scale-105 transition-transform">
          <Paperclip className="text-gray-300 hover:text-white" />
          <Input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>

        {/* Textarea */}
        <textarea
          rows={1}
          value={onPrompt}
          onChange={(e) => setOnPrompt(e.target.value)}
          placeholder="Send a message..."
          className="flex-1 resize-none rounded-2xl bg-[#2A2A2A] text-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
        />

        {/* Send Button */}
        <Button
          size="icon"
          className="rounded-full bg-blue-600 hover:bg-blue-700 transition-transform hover:scale-105"
          onClick={() => setPrompt(onPrompt)}
        >
          <ArrowUp className="text-white" />
        </Button>

        {/* Analyze Toggle */}
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
