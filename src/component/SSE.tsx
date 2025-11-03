import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";


const GeminiStream: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [prompt , setPrompt] = useState('')
  const [onPrompt , setOnPrompt] = useState('')

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
    <div className="absolute left-[16vw]  bg-gray-100 w-[84vw] h-screen">
      <h2 className="text-2xl font-mono p-1 text-blue-500 ">Ace Ai</h2>

      <div  className="   absolute left-[15vw]  w-[50vw] h-screen overflow-y-auto rounded-lg  overflow-x-auto">

        {messages.map((msg, index) => (
          <div key={index} className="mb-4 left-[100%] ">  
            <ReactMarkdown>{msg}</ReactMarkdown>
          </div>
        ))}
       <div className="fixed bottom-[2vh] left-[30vw] items-center flex">   
      <textarea onChange={(e)=>setOnPrompt(e.target.value)} className= " border-[2px] px-2 py-1  rounded-3xl z-20  w-[60vw]  items-center" placeholder="Solve doubt "></textarea>
      <ArrowUp onClick={()=>{setPrompt(onPrompt)}} className="absolute text-bl-500 left-[57vw] rounded-full text-blue-500 z-50  bg-gray-900 mt-1 hover:bg-black hover:rounded-full"  size={35} />
      </div>
      </div>
    
    </div>
  );
};

export default GeminiStream;
