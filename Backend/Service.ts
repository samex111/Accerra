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
  let fullText = '';

  while(true){
    const {done ,value} = await reader.read();
    const chunk = decoder.decode(value,{stream:true});
    console.log("Chunk: ",chunk)
    if(done) break;
    const lines = chunk.split('\n');
    // lines.splice("{")
    for(const line of lines){
       if (line.trim() === '') continue; // skip empty lines
      console.log("Line",line)
    try {
      // parse JSON if valid
      const json = JSON.parse(line)
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log("TEXT: ",text)

      // if (text) {
      //    fullText =   new TextDecoder().decode(text);
      //   console.log("Full text: ",fullText); // ✅ print only text part live
      // }

    } catch (err) {
      // Ignore incomplete JSON fragments
      console.log("Error in catch:  ",err)
    }
    }
     res.write(`data: ${JSON.stringify({ content: chunk})}\n\n`);

  }
  res.write(`event: end\ndata: done\n\n`); 
  res.end();

}
