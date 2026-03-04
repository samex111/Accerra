import React, { useEffect, useState, useCallback } from "react";
import { API_URL } from "@/config/env";

import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import FilePreview from "./FilePreview";

type Message = { role: "user" | "assistant"; content: string };

interface conversationProps {
  conversationId: string;
  sender: "student" | "ai";
  message: string;
  createdAt: Date;
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

  const [conversation, setConvesation] = useState<conversationProps[]>([]);
  const [conversationId, setConvesationId] = useState<string>("");
  const [allConversationId, setAllConvesationId] = useState<string>("");

  let fullResponse = "";

  console.log("messages:", messages);

  // 🚀 FILE UPLOAD
  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (!selected) return;

      setFile(selected);
      setUploadProgress(0);
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", selected);

      try {
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
    },
    []
  );

  // 🚀 STREAMING
  useEffect(() => {
    if (!currentPrompt) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userInput },
      { role: "assistant", content: "" },
    ]);

    if (!conversationId) {
      handleCreateConversationId();
    }

    const query = encodeURIComponent(currentPrompt);

    const eventSource = new EventSource(
      `${API_URL}/api/v1/user/stream?prompt=${query}&fileUrl=${fileUrl}&isAnlyze=${isAnalyzing}`
    );

    handleAddMessage(conversationId!, "student", query);

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const chunk = parsed?.content || event.data;

        fullResponse = fullResponse + chunk;

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
      handleAddMessage(conversationId!, "ai", fullResponse);

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

  // 🚀 SEND MESSAGE
  const handleSend = useCallback(() => {
    if (!userInput.trim()) return;
    setCurrentPrompt(userInput);
  }, [userInput]);

  // 🧹 REMOVE IMAGE
  const removeImage = useCallback(() => {
    setFile(null);
    setFileUrl(null);
    setUploadProgress(0);
  }, []);

  // 🚀 FETCH CONVERSATION
  useEffect(() => {
    async function fetchConvesations() {
      await fetch(
        `${API_URL}/api/v1/user/get/conversation/${conversationId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((data) => setConvesation(data))
        .catch((err) =>
          console.error("IN setConversation:", err)
        );
    }
 if(!conversationId) return;
    fetchConvesations();
  }, [userInput, messages]);

  // 🚀 FETCH ALL CONVERSATION IDS
  useEffect(() => {
    try {
      fetch(`${API_URL}/api/v1/user/get/all/conversation`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setAllConvesationId(data);
          console.log(data);
        });
    } catch (e) {
      console.error("Error fetching all conversation IDs:", e);
    }
  }, []);
 console.log("GeminiStream render")
  // 🚀 ADD MESSAGE TO DB
  const handleAddMessage = async (
    conversationId: string,
    sender: "student" | "ai",
    message: string
  ) => {
    try {
      const res = await fetch(
        `${API_URL}/api/v1/user/create/massage/conversation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            conversationId,
            sender,
            message,
          }),
        }
      );

      const data = await res.json();

      console.log("Data:", data);
    } catch (e) {
      console.error("Error in handleAddMessage:", e);
    }
  };

  // 🚀 CREATE CONVERSATION ID
  async function handleCreateConversationId() {
    try {
      const res = await fetch(
        `${API_URL}/api/v1/user/create/conversationId`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();

      console.log("conversationID:", data);

      setConvesationId(data);
    } catch (e) {
      console.error("Error creating conversation id:", e);
    }
  }

  return (
    <div className="flex h-full pb-2 md:pb-0 w-full flex-col bg-background text-foreground">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0">
      <ChatMessages messages={messages} />
     </div>
      {/* File Preview */}
      <FilePreview
        file={file}
        fileUrl={fileUrl}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        removeImage={removeImage}
      />

      {/* Input */}
      <ChatInput
        userInput={userInput}
        setUserInput={setUserInput}
        handleSend={handleSend}
        handleFileUpload={handleFileUpload}
        isUploading={isUploading}
        isAnalyzing={isAnalyzing}
        setIsAnalyzing={setIsAnalyzing}
      />

    </div>
  );
};

export default GeminiStream;