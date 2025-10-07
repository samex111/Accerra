import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

// SSE compatible stream function
export async function callGeminiStream(prompt: string, res: any) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${GEMINI_API_KEY}`;

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

  // Stream chunks as SSE messages
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    res.write(`data: ${chunk}\n\n`);
  }

  res.write(`event: end\ndata: done\n\n`);
  res.end();
}
