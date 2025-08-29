import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIMessage } from './AIMassage.ts';
import dotenv from "dotenv";
dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

function mapRole(role: string): "user" | "model" | "system" {
  if (role === "assistant") return "model";
  return role as "user" | "model" | "system";
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);


export async function callGemini(messages: AIMessage[]): Promise<string> {
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL! });

  const chat = model.startChat({
    history: messages.slice(0, -1).map((msg) => ({
       role: mapRole(msg.role),
      parts: [{ text: msg.content }],
    })),
  });

  const userMessage = messages[messages.length - 1].content;
  const result = await chat.sendMessage(userMessage);
  const response = await result.response;
  return response.text(); 
} 