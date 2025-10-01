import type { Request, Response } from "express";
import { attemtQuestionsModel, NoteModel, QuestionModel, TodoModel, UserModel } from "./Schema.ts";
import { Router } from "express";
import z, { number } from 'zod';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import {  userMiddleware } from "./auth.ts";
import noadmailer from 'nodemailer';
import crypto from 'crypto';
import mongoose from "mongoose";

dotenv.config();

const JWT_USER = process.env.JWT_USER as string;

export const userRouter = Router();



// app password ---  gqjd idzo bzww jpbf

const transporter =  noadmailer.createTransport({
    service:'gmail',
    auth:{
        user:'samxpatel2@gmail.com',
        pass:'gqjd idzo bzww jpbf'
    }

});


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

    const otp = crypto.randomInt(100000,999999).toString();

    

    try {
        await UserModel.create({
            email: email,
            username: username,
            password: hassedPassword,
            otp,
            otpExpiry: Date.now() + 5 * 60 * 1000
        })

    } catch (e) {
        res.status(403).json({
            msg: "user already exists",

        })
        console.log("error is --: ", e)
    }

     await transporter.sendMail({
    from: "samxpatel2@gmail.com",
    to: email,
    subject: "Verify your Email",
    text: `Your OTP is ${otp}`
  });
  
    res.status(200).json({
        msg: "User created successfully!"
    })

});
userRouter.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  if (user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
 // @ts-ignore
  if (Date.now() > user.otpExpiry) {
    return res.status(400).json({ message: "OTP expired" });
  }

  user.isVerified = true;
  user.otp = null; // OTP clear
  user.otpExpiry = null;
  await user.save();

  res.json({ message: "Email verified successfully!" });
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


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

userRouter.post("/gemini", async (req, res) => {
    try {
        const { prompt } = req.body;
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
            questionDiagram: z.string().optional(),
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

    const {question,questionDiagram, status,userAnswer,answer,tags,subject,timeTaken} = parseData.data;

    try{
        await attemtQuestionsModel.create({
            question,
            questionDiagram,
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

userRouter.post("/todo", userMiddleware, async (req,res)=>{
    const requireBody = z.object({
        todo:z.string()
    })
   const parseData = requireBody.safeParse(req.body);

    if(!parseData.success){
           console.log(parseData.error)
       return res.status(400).json({msg:"Invaild cred"});
    
    }
    const {todo} = parseData.data;

    try{
        await TodoModel.create({
            todo,
            student:req.userId
        })
        res.status(200).json({
            msg: "todo created"
        })
    }catch(e:any){
            console.log(e)
        res.status(400).json({
            msg: "error" + e.message
        })
    }
})
userRouter.post("/notes",userMiddleware,async (req,res)=>{
    

    const requireBody = z.object({
        note:z.string()
    })
   const parseData = requireBody.safeParse(req.body);

    if(!parseData.success){
           console.log(parseData.error)
       return res.status(400).json({msg:"Invaild cred"});
    
    }
    const {note} = parseData.data;


    try{
        await NoteModel.create({
            note,
            student:req.userId
        })
        res.status(200).json({
            msg: "note created"
        })
    }catch(e:any){
        res.status(400).json({
            msg: "error" + e.message
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

userRouter.get('/question', userMiddleware, async (req:Request,res:Response)=>{
    const {subject} = req.query;
    try{
        const importQuestions = await QuestionModel.find({subject:subject});
        if(!importQuestions){
           return res.status(400).json({
                msg:"Questions not found"
            })
        }
        console.log(importQuestions)
        res.status(200).json({
            importQuestions
        })
    }catch(e){
        res.json({error:"Some error: "+e})
    }
})

// userRouter.get('/attempt', userMiddleware, async (req:Request,res:Response)=>{
//     // const {status} = req.query;
//     try{
//         const importQuestions = await attemtQuestionsModel.find({});
//         if(!importQuestions){
//            return res.status(400).json({
//                 msg:"Questions not found"
//             })
//         }
//         console.log(importQuestions)
//         res.status(200).json({
//             importQuestions
//         })
//     }catch(e){
//         res.json({error:"Some error: "+e})
//     }
// })


// API to get daily solved counts for a student
userRouter.get("/solved/daily/:studentId",userMiddleware, async (req:Request, res:Response) => {
  try {
    const studentId = req.params.studentId;

    const result = await attemtQuestionsModel.aggregate([
      // Step 1: Filter by student (convert string to ObjectId)
      { $match: { student: new mongoose.Types.ObjectId(studentId) } },

      // Step 2: Extract only the date part from createdAt
      {
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
        }
      },

      // Step 3: Group by date and count
      {
        $group: {
          _id: "$date",
          totalSolved: { $sum: 1 }
        }
      },

      // Step 4: Sort by date ascending
      { $sort: { _id: 1 } }
    ]);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

