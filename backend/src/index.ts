import express from "express";
import { connectDB } from "./db"; 
import {userRouter} from './user' 
import cookieParser from "cookie-parser";
import { adminRouter } from "./admin";
import cors from "cors";
const PORT = process.env.PORT || 3000;
 
const app = express();
app.use(express.json());
app.use(cors({
   origin: ["http://localhost:5173", "https://accerra-sameer.vercel.app"] , // frontend ka exact origin
  credentials: true  ,
  methods: ["GET","DELETE","POST","PUT"],
   allowedHeaders: ["Content-Type"]
}))
app.use(cookieParser());



// MongoDB connect 
connectDB();

app.use('/api/v1/user' , userRouter);
app.use('/api/v1/admin' , adminRouter);




app.listen(PORT, () => {
  
  console.log(`Server running on port ${PORT}`);

});


