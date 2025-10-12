import React, { useState } from "react";

interface MessagePart {
  text: string;
}

interface Message {
  role: "user" | "model";
  parts: MessagePart[];
}

const ChatWithAi: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async (): Promise<void> => {
    if (!input.trim() || isLoading) return;

    const newUserMessage: Message = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsLoading(true);

    // prepare full history in Gemini format
    const history = [...messages, newUserMessage];

    try {
      const response = await fetch("http://localhost:3000/api/v1/user/chat1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Network or response error");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";

      const newAIMessage: Message = { role: "model", parts: [{ text: "" }] };
      setMessages((prev) => [...prev, newAIMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (!data) continue;

            try {
              const parsed = JSON.parse(data);

              if (parsed.error) {
                throw new Error(parsed.error);
              } else if (parsed.text) {
                aiResponse += parsed.text;

                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {       
                    ...updated[updated.length - 1],
                    parts: [{ text: aiResponse }],
                  };
                  return updated;
                });
              }
            } catch (err) {
              console.error("Parse error:", err);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "Error: " + error.message }] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>AI Chat App 🤖</h1>

      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.role === "user" ? "user" : "ai"}
            style={{
              background: msg.role === "user" ? "#DCF8C6" : "#E8EAF6",
              padding: "8px",
              borderRadius: "8px",
              margin: "6px 0",
              maxWidth: "80%",
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.parts[0].text}
          </div>
        ))}
        {isLoading && <div className="loading">AI is thinking...</div>}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder="Ask something..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={isLoading}
          className="chat-input"
        />
        <button onClick={sendMessage} disabled={isLoading} className="send-btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWithAi;
