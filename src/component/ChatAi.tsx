import { useState } from "react";
import GeminiStream from "./SSE"

export function ChatWithAi(){
        const [prompt , setPrompt] = useState('How to become best dev')
        const [op, setOp] = useState('');
    const handleCLick = ()=>{
    
        return <>
  console.log(prompt)
   
           <GeminiStream prompt = {prompt} />
           <textarea       
           placeholder="Ask something....."
           onChange={(e)=>{setOp(e.target.value)}}
           className="border-4 w-1/2 mx-2 mt-2 h-1/2 scroll-smooth"
           
           >
            </textarea>
            <button onClick={()=>{setPrompt(op)}} >Send</button>
        </>
    }
    return(
        <>
        <button onClick={handleCLick}>
        Chat with ai    
        </button></>
    )
}