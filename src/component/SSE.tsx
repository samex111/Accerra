import { useEffect, useState } from "react";

const GeminiStream = ({ prompt }: { prompt: string }) => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(
      `http://localhost:3000/api/v1/user/stream?prompt=${encodeURIComponent(prompt)}`
    );

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.content) {
          setMessages((prev) => [...prev, parsed.content]);
        } else if (parsed.error) {
          console.error("Server se error aaya:", parsed.error);
        }
      } catch (e) {
        console.error("SSE data parse karne mein error:", e);
      }
    };

    eventSource.addEventListener("end", () => {
      console.log("Stream khatam hua.");
      eventSource.close();
    });

    return () => {
      eventSource.close();
    };
  }, [prompt]);

  return (
    <div>
      <h2>Gemini SSE Stream</h2>
      <div style={{ border: "1px solid #ccc", padding: "10px", minHeight: "100px" }}>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default GeminiStream;