import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

interface GeminiStreamProps {
  prompt: string;
}

const GeminiStream: React.FC<GeminiStreamProps> = ({ prompt }) => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // 1️⃣ SSE connection
    const eventSource = new EventSource(
      `http://localhost:3000/api/v1/user/stream?prompt=${encodeURIComponent(prompt)}`
    );

    // 2️⃣ Incoming messages
    eventSource.onmessage = (event) => {
      try {
        // Parse only if valid JSON
        const parsedData = JSON.parse(event.data);
        if (parsedData?.content) {
          setMessages((prev) => [...prev, parsedData.content]);
        }
      } catch (error) {
        console.error("Failed to parse SSE data:", event.data, error);
        // Agar plain text hai, toh directly append kar sakte ho
        setMessages((prev) => [...prev, event.data]);
      }
    };

    // 3️⃣ Stream end
    eventSource.addEventListener("end", () => {
      console.log("Stream ended.");
      eventSource.close();
    });

    // 4️⃣ Cleanup
    return () => {
      eventSource.close();
    };
  }, [prompt]);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center">Gemini SSE Stream</h2>

      <div className="bg-white shadow-md h-[70vh] overflow-y-auto rounded-lg p-6 max-w-4xl mx-auto my-6 overflow-x-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-4">
            <ReactMarkdown>{msg}</ReactMarkdown>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeminiStream;
