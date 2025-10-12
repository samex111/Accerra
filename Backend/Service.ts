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
  // ❌ Error if no response or body
  if (!response.ok || !response.body) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: "Gemini stream failed" })}\n\n`);
    res.end();
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");


  while(true){
    const {done ,value} = await reader.read();
    const chunk = decoder.decode(value,{stream:true});

    if(done) break;
     res  .write(`data: ${JSON.stringify({ content: chunk})}\n\n`);

  }
  res.write(`event: end\ndata: done\n\n`);
res.end();


}
