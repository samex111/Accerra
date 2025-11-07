import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, Paperclip } from "lucide-react";
import { use, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";


const GeminiStream: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('')
  const [onPrompt, setOnPrompt] = useState('')
  const [isAnlyze, setIsAnylyze] = useState(false)
  const [file, setFile] = useState<null | any>(null)
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);

  const handleFileChange = async (e: any) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    const res = await fetch("http://localhost:3000/api/v1/user/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setFileUrl(data.imageUrl);
    } else {
      alert("Upload failed");
    }
  };
  useEffect(() => {
    // 1️⃣ SSE connection


    const eventSource = new EventSource(
      `http://localhost:3000/api/v1/user/stream?prompt=${encodeURIComponent(prompt+fileUrl)}`
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
    // const handleUpload = async () => {
    //   const formData = new FormData();
    //   formData.append('file', file);

    //   const res = await fetch('http://localhost:3000/api/v1/user/upload', {
    //     method: "POST",
    //     body: formData
    //   })

    //   const data = res.json();
    //   console.log(data)
    // }

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
  const [buttonBg, setButtonBg] = useState('blue-300');
  return (
    <div className="absolute left-[16vw]  bg-gray-100 w-[84vw] h-screen">
      <h2 className="text-2xl font-mono p-1 text-blue-500 ">Ace Ai</h2>

      <div className="   absolute left-[15vw]  w-[50vw] h-screen overflow-y-auto rounded-lg  overflow-x-auto">

        {messages.map((msg, index) => (
          <div key={index} className="mb-4 left-[100%] ">
            <ReactMarkdown>{msg}</ReactMarkdown>
          </div>
        ))}
        <div className="fixed bottom-[2vh] left-[30vw] items-center flex">
          <Button onClick={() => { if (isAnlyze) { setButtonBg('blue-500') } else setButtonBg('blue-300'); setIsAnylyze(!isAnlyze) }} size={'lg'} className={`fixed bg-${buttonBg} rounded-full hover:${buttonBg === 'bg-blue-300' ? 'bg-blue-500' : 'bg-blue-300'}  z-90 bottom-[12vh]`}>Anylze</Button>
          <textarea onChange={(e) => setOnPrompt(e.target.value)} className="focus:outline-none focus:ring-0 shadow-md border-[2px] px-2 py-1  rounded-3xl z-20  w-[60vw]  items-center" placeholder="Solve doubt "></textarea>
          <div className="fixed w-fit flex left-[39vw] items-center bottom-[12vh] border rounded-full"><Paperclip /><Input id="choose-file" className="border-0" accept="images/*" onChange={handleFileChange} type="file" /></div>
          <ArrowUp onClick={() => { setPrompt(onPrompt) }} className="absolute text-bl-500 left-[57vw] rounded-full text-blue-500 z-50  bg-gray-900 mt-1 hover:bg-black hover:rounded-full" size={35} />
        </div>
      </div>

    </div>
  );
};

export default GeminiStream;
