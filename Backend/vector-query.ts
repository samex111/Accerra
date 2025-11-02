import { getEmbedding } from './get-embeddings.ts';
import { connectDB } from './db.ts';
import { QuestionModel } from './Schema.ts';

// MongoDB connection URI and options

async function run() {
    try {
        // Connect to the MongoDB client
        await connectDB();


        // Specify the database and collection
        const collection = QuestionModel.collection

        // Generate embedding for the search query
        const queryEmbedding = await getEmbedding("find question on electrostatic");

        // Define the sample vector search pipeline
        const pipeline = [
            {
                $vectorSearch: {
                    index: "vector_index",
                    queryVector: queryEmbedding,
                    path: "embedding",
                    exact: true,
                    limit: 2
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
            console.log(doc);
        }

    } finally {
        console.log("finally ")
    }
}
run().catch(console.dir);