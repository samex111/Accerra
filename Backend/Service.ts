import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import {  DataContext } from "./src/component/StudentContext";
import { useContext } from "react";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

export async function callGeminiStream(prompt: string, res: any) {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash", 
    contents: prompt, 
  });
  const dataContext = useContext(DataContext)


    for await (const chunk of response) {
      console.log(chunk.text);
      res.write(`data: ${JSON.stringify({ content: chunk.text })}\n\n`);
            dataContext?.setmessages(chunk.text);


    }

  res.write(`event: end\ndata: done\n\n`);
  res.end();
}