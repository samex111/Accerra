import { Pinecone } from "@pinecone-database/pinecone";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// init pinecone
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

// HuggingFace embedding function
async function getEmbedding(text: string) {
  const response = await fetch(
    "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    }
  );

  if (!response.ok) {
    throw new Error(`HF API Error: ${response.statusText}`);
  }

  const embedding = await response.json()  as any
  return embedding[0]; // array of floats
}

async function run() {
  // 1. Get vector
  const vector = await getEmbedding("AI will change education forever!");

  // 2. Insert into Pinecone
  const index = pc.index("study-app"); // make sure this index exists in pinecone dashboard

  await index.upsert([
    {
      id: "note-1",
      values: vector,
      metadata: { type: "note", user: "student-123" },
    },
  ]);

  console.log("✅ Data inserted into Pinecone!");
}

run().catch(console.error);
