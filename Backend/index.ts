import express from "express";
import { connectDB } from "./db.ts"; 
import {userRouter} from './user.ts'

const app = express();
app.use(express.json());
const PORT = 3000;

// MongoDB connect
connectDB();

app.use('/api/v1/user' , userRouter)



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
