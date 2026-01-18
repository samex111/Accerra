import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { API_URL } from "@/config/env";

type option = {
  prompt:string,
  
}
function GeminiHint({prompt}:option) {
//   const [prompt, setPrompt] = useState("");
  const [responseText, setResponseText] = useState("");

  const handleSend = async () => {
    const res = await fetch(`${API_URL}/api/v1/user/gemini`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setResponseText(data.text); // text contains **bold** from API
  };

  return (
    <div className="p-4">
     
      <button onClick={handleSend} className="mt-2 p-2 bg-blue-500 text-white">
       hint
      </button>
      
      <p className="mt-4 p-2 border">
        <ReactMarkdown>{responseText}</ReactMarkdown>
      </p>
    </div>
  );
}


export default GeminiHint;
