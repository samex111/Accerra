import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

const MONGO_URL = process.env.MONGO_URL as string;
// console.log(MONGO_URL)
if(!MONGO_URL){ 
    throw new Error('MongoDB connection string is missing in .env file ')
}

export  const  connectDB = async () =>{
    try{
        await mongoose.connect(MONGO_URL)
        console.log("✅ MongoDB Connected Successfully");
    }catch(err){
        console.error('mongo db connection failed \n', err)
        process.exit(1);
    }

}

