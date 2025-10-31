import dotenv from 'dotenv'
import { VoyageAIClient } from 'voyageai';
dotenv.config();
// Set up Voyage AI configuration
const client = new VoyageAIClient({apiKey: process.env.VOYAGE_API_KEY});

export async function getEmbedding(text:string) {
    const results = await client.embed({
        input: text,
        model: "voyage-3"
    });

    // @ts-ignore
    return results.data[0].embedding;
}

const ans  = await getEmbedding("Hello");
console.log("Embedding : ",ans);
