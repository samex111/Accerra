import type { Request, Response } from "express";
import { attemtQuestionsModel, NoteModel, QuestionModel, TodoModel, UserModel } from "./Schema.ts";
import { Router } from "express";
import z from 'zod';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { adminMiddleware, userMiddleware } from "./auth.ts";

dotenv.config();

const JWT_USER = process.env.JWT_USER as string;

export const userRouter = Router();

userRouter.post('/signup', async (req: Request, res: Response) => {
    const requireBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(8).max(20),
        username: z.string().min(1).max(50)
    });

    const parseData = requireBody.safeParse(req.body);

    if (!parseData.success) {
        return res.status(400).json({
            message: "Incorrect Format",
            error: parseData.error
        })
    }

    const { email, password, username } = req.body;

    const hassedPassword = await bcrypt.hash(password, 5);

    try {
        await UserModel.create({
            email: email,
            username: username,
            password: hassedPassword
        })

    } catch (e) {
        res.status(403).json({
            msg: "user already exists",

        })
        console.log("error is --: ", e)
    }
    res.status(200).json({
        msg: "User created successfully!"
    })

});

userRouter.post('/signin', async (req: Request, res: Response) => {

    const requireBody = z.object({
        identifire: z.string(),
        password: z.string().min(8)
    });

    const parseData = requireBody.safeParse(req.body);

    if (!parseData.success) {
        return res.status(400).json({
            message: "Incorrect Format",
            error: parseData.error
        });
    }


    const { identifire, password } = req.body;

    const user = await UserModel.findOne({ $or: [{ username: identifire }, { email: identifire }] });
    if (!user || !user.password) {
        return res.status(403).json({
            message: "Incorrect Credentials !"
        });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
        const token = jwt.sign({
            id: user._id
        }, JWT_USER)

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24
        })
        console.log("cookie: ", token)
        res.status(200).json({
            token: token
        })
    }
    else {
        // If the password does not match, return a error indicating the invalid credentials
        res.status(403).json({
            // Error message for failed password comparison
            message: "Invalid credentials!"
        })
    }
})
// userRouter.get("/preview" ,adminMiddleware,  async (req:Request, res:Response) => {
//     const showQuestions = await QuestionModel.find({});
//     console.log(showQuestions)
//     res.json({
//         showQuestions
//     })
// })
userRouter.get("/preview", userMiddleware, async (req: Request, res: Response) => {
    const showQuestions = await QuestionModel.find({});
    console.log(showQuestions)
    res.json({
        showQuestions
    })
})

// userRouter.post('/ask', async (req, res) => {
//   try {
//     const messages: AIMessage[] = req.body.messages; // client se messages array milega
//     const answer = await callGemini(messages, 500); // maxTokens optional
//     res.json({ answer });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

userRouter.post("/gemini", async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log(GEMINI_API_KEY)
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        );

        const data = await response.json();
        console.log(data);

        res.json({ text: data.candidates[0].content.parts[0].text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

userRouter.post('/attempt/question',userMiddleware, async (req, res) => {


    const requireBody = z.object({
        question: z.string(),  
        status: z.string(),
        userAnswer:z.array(z.string()),
        answer: z.array(z.string()),
        tags: z.array(z.string()).optional(),
        subject:z.string(),
        timeTaken: z.string().optional(),
    });
    
    const parseData = requireBody.safeParse(req.body);

    if(!parseData.success){
           console.log(parseData.error)
       return res.status(400).json({msg:"Invaild cred"});
    
    }

    const {question, status,userAnswer,answer,tags,subject,timeTaken} = parseData.data;

    try{
        await attemtQuestionsModel.create({
            question,
            status,
            userAnswer,
            answer,
            tags,
            subject,
            timeTaken,
            student: req.userId 
        })

        res.status(200).json({
            msg:"question created succefully"
        })

    } catch (err) {
  res.status(500).json({ error: "Server error" + err});
}
    

})

userRouter.post("/todo", async (req,res)=>{
    const requireBody = z.object({
        todo:z.string()
    })
    const parseData = requireBody.safeParse(req.body);

    if(!parseData.success){
        res.status(400).json({
            msg: "Invaild cred"
        })
    }
    const todo = parseData.data;

    try{
        await TodoModel.create({
            todo,
            student:req.userId
        })
        res.status(200).json({
            msg: "todo created"
        })
    }catch(e){
        res.status(400).json({
            msg: "error" + e
        })
    }
})
userRouter.post("/notes", async (req,res)=>{
    const requireBody = z.object({
        todo:z.string()
    })
    const parseData = requireBody.safeParse(req.body);

    if(!parseData.success){
        res.status(400).json({
            msg: "Invaild cred"
        })
    }
    const todo = parseData.data;

    try{
        await NoteModel.create({
            todo,
            student:req.userId
        })
        res.status(200).json({
            msg: "note created"
        })
    }catch(e){
        res.status(400).json({
            msg: "error" + e
        })
    }
})
userRouter.delete("/todo/delete/:id", async (req , res) =>{
    const {id} = req.params; 
    try{
    const deleteTodo = await TodoModel.findByIdAndDelete(id);
    if(!deleteTodo){
        res.status(400).json({msg:"todo not found "})
    }
    res.status(200).json({msg:"todo delete sucessfully"});

   }catch(e){
    res.status(400).json({
        msg:"error: " +e
    })
   }

})
userRouter.delete("/note/delete/:id", async (req , res) =>{
    const {id} = req.params; 
    try{
    const deleteTodo = await NoteModel.findByIdAndDelete(id);
    if(!deleteTodo){
        res.status(400).json({msg:"note not found "})
    }
    res.status(200).json({msg:"note delete sucessfully"});

   }catch(e){
    res.status(400).json({
        msg:"error: " +e
    })
   }

})
userRouter.put("/note/update/:id", async (req , res) =>{
    const {id} = req.params; 
    const updateNote = req.body.updateNote;
    try{
    const updateData = await NoteModel.findByIdAndUpdate(id, updateNote , {new:true});
    if(!updateData){
        res.status(400).json({msg:"note not found "})
    }
    res.status(200).json({msg:"note update sucessfully"});

   }catch(e){
    res.status(400).json({
        msg:"error: " +e
    })
   }

})
userRouter.put("/todo/update/:id", async (req , res) =>{
    const {id} = req.params; 
    const updateTodo = req.body.updateTodo;
    try{
    const updateData = await TodoModel.findByIdAndUpdate(id, updateTodo , {new:true});
    if(!updateData){
        res.status(400).json({msg:"todo not found "})
    }
    res.status(200).json({msg:"todo update sucessfully"});

   }catch(e){
    res.status(400).json({
        msg:"error: " +e
    })
   }

})