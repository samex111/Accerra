import { connectDB } from './db';
import { getEmbedding } from './get-embeddings';
import { attemtQuestionsModel, QuestionModel } from './Schema';

async function run() {
    try {
         await connectDB();
        const batchSize = 2;
        const documents = await attemtQuestionsModel.find({ embedding: { $exists: false } }).limit(batchSize);

        console.log(`Processing ${documents.length} questions...`);

        const updateDocuments: any[] = [];

        await Promise.all(
            documents.map(async (doc:any) => {
                const tags = Array.isArray(doc.tags) ? doc.tags.join(" ") : "";
                const text = `question:${doc.question } ,tags:${tags}, Status: ${doc.status } user answer: ${doc.userAnswer} .`;

                try {
                    const embedding = await getEmbedding(text);

                    updateDocuments.push({
                        updateOne: {
                            filter: { _id: doc._id },
                            update: { $set: { embedding } },
                        },
                    });
                } catch (err: any) {
                    console.log(` Embedding failed for ${doc._id}: ${err.message}`);
                }
            })
        );

        if (updateDocuments.length > 0) {
            const collection = attemtQuestionsModel.collection;
            const result = await collection.bulkWrite(updateDocuments, { ordered: false });
            console.log(" Documents updated:", result.modifiedCount);
        } else {
            console.log("No documents to update.");
        }

    } catch (err: any) {
        console.error("Main error:", err.stack);
    }
}

setInterval(()=>{run().catch(console.dir)},60000);
