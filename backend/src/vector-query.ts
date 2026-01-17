import { getEmbedding } from './get-embeddings';
import { connectDB } from './db';
import { attemtQuestionsModel } from './Schema';

// MongoDB connection URI and options

async function run(prompt:string) {
    try {
        // Connect to the MongoDB client
        await connectDB();


        // Specify the database and collection
        const collection = attemtQuestionsModel.collection

        // Generate embedding for the search query
        const queryEmbedding = await getEmbedding(prompt);

        // Define the sample vector search pipeline
        const pipeline = [
            {
                $vectorSearch: {
                    index: "vector_index",
                    queryVector: queryEmbedding,
                    path: "embedding",
                    exact: true,
                    limit: 5
                }
            },
            {
                $project: {
                    _id: 0,
                    question: 1,
                    tags: 1,
                    score: { $meta: "vectorSearchScore" }
                }
            }
        ];

        // run pipeline
        const result = collection.aggregate(pipeline);

        // print results
        for await (const doc of result) {
            console.log("doc: ",doc);
        }
        
    } finally {
        console.log("finally ")
    }
}
// run("find my preformance in electrostactic").catch(console.dir)