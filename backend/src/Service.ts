import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

export async function callGeminiStream(prompt: string, fileUrl: string, 
  res: any) {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  let imagePart = null;
  console.log("File url: ",fileUrl)
  if (fileUrl && fileUrl !== "null") {
    const base64 = await urlToBase64(fileUrl);
    // console.log("Base 64; ",base64)
    imagePart = {
      inlineData: {
        mimeType: "image/png",
        data: base64,
      },
    };
  }

  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",

    systemInstruction: {
      role: "system",
      parts: [
        {
          text: `
You are an expert JEE/NEET mentor and senior subject analyst.
Explain Physics, Chemistry, and Maths in deep conceptual clarity but in simple, exam-friendly language.
Always provide:
1. Step-by-step solution  
2. Key concepts used  
3. Tricks/shortcuts (if applicable)  
4. Mistakes to avoid  
5. Final answer clearly  
If an image is provided, analyze it carefully.  
Never hallucinate. Be supportive and motivating.`
        }
      ],
    },

    contents: [
      {
        // @ts-ignore
        role: "user" ,
        parts: imagePart
          ? [
              { text: prompt },
              imagePart,    // <-- now valid
            ]
          : [{ text: prompt }],
      },
    ],
  });

  for await (const chunk of response) {
    res.write(`data: ${JSON.stringify({ content: chunk.text })}\n\n`);
  }

  res.write(`event: end\ndata: done\n\n`);
  res.end();
}

async function urlToBase64(url: string) {
  if(url===null){
   return console.error("Url null hai ")
  }
  const res = await fetch(url);

  const buffer = await res.arrayBuffer();
  console.log("BUffer: ", buffer)

  // console.log("BAse 64: ",  Buffer.from(buffer).toString("base64"))
  return Buffer.from(buffer).toString("base64");
}
