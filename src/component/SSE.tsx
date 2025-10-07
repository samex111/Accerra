import { useEffect, useState } from "react";

const GeminiStream = ({prompt}:{prompt:string}) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // 1️⃣ EventSource connection open
    const eventSource = new EventSource(
      `http://localhost:3000/api/v1/user/stream?prompt=${encodeURIComponent(prompt)}`
    );

    // 2️⃣ Listen to incoming messages
    eventSource.onmessage = (event) => {
        // @ts-ignore
      setMessages((prev) => [...prev, event.data]); // append new chunk
    };

    // 3️⃣ Listen to end event
    eventSource.addEventListener("end", () => {
      console.log("Stream ended.");
      eventSource.close();
    });

    // 4️⃣ Cleanup on component unmount
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
