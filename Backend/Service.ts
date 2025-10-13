import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

// ✅ Gemini stream function (SSE compatible)
export async function callGeminiStream(prompt: string, res: any) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  console.log(response.body);

  if (!response.ok || !response.body) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: "Gemini stream failed" })}\n\n`);
    res.end();
    return;
  }

  const reader = response.body.getReader();
  console.log("Reader: ",reader)
  const decoder = new TextDecoder();
  let buffer = '';
  while(true){
    const {done ,value} = await reader.read();
    if(done) break;
    buffer = JSON.stringify(decoder.decode(value,{stream:true}));
    // console.log(buffer)
      // console.log("Buffer: ",buffer)```
 
    try{
      let parsed = JSON.parse(buffer);
         
      // console.log("Parsed: ",content)
      console.log(parsed)
      res.write(`data: ${JSON.stringify({ content:parsed})}\n\n`);


     }
     catch(e){
      console.log("In the catch: ", e)
     }
     
    
    

  }
  res.write(`event: end\ndata: done\n\n`); 
  res.end();

}
