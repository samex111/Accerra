import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

export async function callGeminiStream(prompt: string, res: any) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok || !response.body) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: "Gemini stream failed" })}\n\n`);
    res.end();
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Chunk ko decode karke buffer mein add karo
    buffer += decoder.decode(value, { stream: true });

    // Buffer mein se complete JSON object nikalo
    let boundary;
    while ((boundary = buffer.indexOf('\n')) !== -1 || buffer.length > 0) {
      if (boundary === -1 && !done) break;

      const chunk = boundary !== -1 ? buffer.slice(0, boundary) : buffer;
      buffer = boundary !== -1 ? buffer.slice(boundary + 1) : '';

      if (chunk.trim()) {
        try {
          const parsed = JSON.parse(chunk);
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (text) {
            res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
          }
        } catch (e) {
          console.error("Parsing error:", e);
        }
      }
    }
  }

  res.write(`event: end\ndata: done\n\n`);
  res.end();
}