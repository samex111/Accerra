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
  let a  = ''
  while(true){
    const {done ,value} = await reader.read();
    if(done) break;
    buffer = decoder.decode(value,{stream:true});
    // let str = JSON.stringify(buffer)
    // let parsed = JSON.parse(str)
    while(true){
      const lineEnd = buffer.indexOf('\n');
      console.log(lineEnd)
      if(lineEnd===-1){
        console.log("max token iteration")
        break;
      }
      const line = buffer.slice(0,lineEnd).trim();
      console.log(line)
      buffer = buffer.slice(lineEnd+1); 

      if(line.startsWith('')){
        const data = line.slice(6);
         if(data==='[DONE]') break;
          try {
            console.log("DAta:  ",data) 
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    console.log("Content: ",content)
                    if (content) {
                    a+=content;
                    res.write(`data: ${JSON.stringify({ content:a})}\n\n`);

                    }
                  } catch (e) {
                    // Ignore invalid JSON - this is common in SSE streams
                    console.warn("Failed to parse SSE data:", data, e);
                  }
      }
    }
    

  }
  res.write(`event: end\ndata: done\n\n`); 
  res.end();

}
