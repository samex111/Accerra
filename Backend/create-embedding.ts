import { connectDB } from './db.ts';
import { getEmbedding } from './get-embeddings.ts';
import { QuestionModel } from './Schema.ts';

async function run() {
    try {
        //  await connectDB();
        const batchSize = 2;
        const documents = await QuestionModel.find({ embedding: { $exists: false } }).limit(batchSize);

        console.log(`Processing ${documents.length} questions...`);

        const updateDocuments: any[] = [];

        await Promise.all(
            documents.map(async (doc) => {
                const tags = Array.isArray(doc.tags) ? doc.tags.join(" ") : "";
                const text = `${doc.question || ""} ${tags} Difficulty: ${doc.difficulty || "Medium"} Year: ${doc.year || "Unknown"}`;

                try {
                    const embedding = await getEmbedding(text);

                    updateDocuments.push({
                        updateOne: {
                            filter: { _id: doc._id },
                            update: { $set: { embedding } },
                        },
                    });
                } catch (err: any) {
                    console.log(`❌ Embedding failed for ${doc._id}: ${err.message}`);
                }
            })
        );

        if (updateDocuments.length > 0) {
            const collection = QuestionModel.collection;
            const result = await collection.bulkWrite(updateDocuments, { ordered: false });
            console.log("✅ Documents updated:", result.modifiedCount);
        } else {
            console.log("No documents to update.");
        }

    } catch (err: any) {
        console.error("Main error:", err.stack);
    }
}

run().catch(console.dir);
