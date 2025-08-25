import express from "express";
import { connectDB } from "./db.ts"; 
import {userRouter} from './user.ts'
import cookieParser from "cookie-parser";
import { adminRouter } from "./admin.ts";
import {questionRouter} from "./question.ts"
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
   origin: "http://localhost:5173",   // frontend ka exact origin
  credentials: true  
}))
app.use(cookieParser());

const PORT = 3000;

// MongoDB connect
connectDB();

app.use('/api/v1/user' , userRouter);
app.use('/api/v1/admin' , adminRouter);
app.use('/api/v1/questions' , questionRouter);




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
export { questionRouter };

