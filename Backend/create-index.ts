    import { QuestionModel } from './Schema.ts';
    import { connectDB } from './db.ts';

    async function run() {
    try {
        await connectDB();
        
        

        // Define your MongoDB Vector Search index
        const index = {
            name: "vector_index",
            type: "vectorSearch",
            definition: {
            "fields": [
                {
                "type": "vector",
                "path": "embedding",
                "similarity": "dotProduct",
                "numDimensions": 1024
                }
            ]
            }
        }

        // Call the method to create the index
        const result = await QuestionModel.createSearchIndex(index);
        

        console.log("result ",result);
    

    } catch(e){
        console.log(e)
    }
    }
    run().catch(console.dir);
