import type { Request, Response } from "express";
import { attemtQuestionsModel, BookMarkModel, NoteModel, QuestionModel, TodoModel, UserModel } from "./Schema.ts";
import { Router } from "express";
import z, { number } from 'zod';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { userMiddleware } from "./auth.ts";
import noadmailer from 'nodemailer';
import crypto from 'crypto';
import mongoose from "mongoose";
import { callGeminiStream } from './Service.ts'
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ObjectId } from "mongodb";



dotenv.config();

const JWT_USER = process.env.JWT_USER as string;

export const userRouter = Router();




const transporter = noadmailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'samxpatel2@gmail.com',
        pass: 'gqjd idzo bzww jpbf'
    }

});


userRouter.post('/signup', async (req: Request, res: Response) => {
    const requireBody = z.object({
        email: z.email(),
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

    const otp = crypto.randomInt(100000, 999999).toString();



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
    //   if(user.isVerified === false){
    //     return res.status(400).json({ message: "User not varified" });
    //   }
    if (user.otp !== otp) {
        await user.deleteOne();
        return res.status(400).json({ message: "Invalid OTP" });
    }
    // @ts-ignore
    if (Date.now() > user.otpExpiry) {
        user.deleteOne(email);
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
    if (user.isVerified == false) {
        return res.status(403).json({
            message: "user not varified !"
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
        res.json({ studentId: user._id });
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
console.log(GEMINI_API_KEY)
const a = process.env.GEMINI_API_KEY;
console.log(a)
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

userRouter.post('/attempt/question', userMiddleware, async (req, res) => {
    const id = req.userId;
    const requireBody = z.object({
        question: z.string(),
        questionDiagram: z.string().optional(),
        status: z.string(),
        userAnswer: z.array(z.string()),
        answer: z.array(z.string()),
        tags: z.array(z.string()).optional(),
        subject: z.string(),
        timeTaken: z.string().optional(),
    });

    const parseData = requireBody.safeParse(req.body);

    if (!parseData.success) {
        console.log(parseData.error)
        return res.status(400).json({ msg: "Invaild cred" });

    }

    const { question, questionDiagram, status, userAnswer, answer, tags, subject, timeTaken } = parseData.data;

    try {
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
            msg: "question created succefully"
        })

    } catch (err) {
        res.status(500).json({ error: "Server error" + err });
    }


})

userRouter.post("/todo", userMiddleware, async (req, res) => {
    const requireBody = z.object({
        todo: z.string()
    })
    const parseData = requireBody.safeParse(req.body);

    if (!parseData.success) {
        console.log(parseData.error)
        return res.status(400).json({ msg: "Invaild cred" });

    }
    const { todo } = parseData.data;
    //  if(todo.trim()===""){
    //     return
    //  }
    try {
        await TodoModel.create({
            todo,
            student: req.userId
        })
        res.status(200).json({
            msg: "todo created"
        })
    } catch (e: any) {
        console.log(e)
        res.status(400).json({
            msg: "error" + e.message
        })
    }
})
userRouter.post("/notes", userMiddleware, async (req, res) => {


    const requireBody = z.object({
        note: z.string()
    })
    const parseData = requireBody.safeParse(req.body);

    if (!parseData.success) {
        console.log(parseData.error)
        return res.status(400).json({ msg: "Invaild cred" });

    }
    const { note } = parseData.data;


    try {
        await NoteModel.create({
            note,
            student: req.userId
        })
        res.status(200).json({
            msg: "note created"
        })
    } catch (e: any) {
        res.status(400).json({
            msg: "error" + e.message
        })
    }
})
userRouter.get('/todo', userMiddleware, async (req: Request, res: Response) => {
    const userId = req.userId;
    // hame ye karna hai ki date wise todo show karna hai 
    try {
        const response = await TodoModel.aggregate([
            // Step 1: Filter by student (convert string to ObjectId)         
            { $match: { student: new mongoose.Types.ObjectId(userId) } },

            {
                $project: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    todoss: { $toString: "$todo" },
                    id: { $toString: "$_id" }
                }
            },

            // Step 3: Group by date and count
            {
                $group: {
                    _id: "$date",
                    todoss: { $push: "$todoss" },
                    id: { $push: "$id" }
                }
            },

            // Step 4: Sort by date ascending
            { $sort: { _id: 1 } }
        ])
        console.log(response);
        res.status(200).json(response)
    } catch (e) {
        console.log(e)
        res.status(400).json("Todo not found: " + e)
    }
})
userRouter.delete("/todo/:id", userMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const deleteTodo = await TodoModel.findByIdAndDelete(id);
        if (!deleteTodo) {
            res.status(400).json({ msg: "todo not found " })
        }
        res.status(200).json({ msg: "todo delete sucessfully" });

    } catch (e) {
        res.status(400).json({
            msg: "error: " + e
        })
    }

})
userRouter.delete("/note/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deleteTodo = await NoteModel.findByIdAndDelete(id);
        if (!deleteTodo) {
            res.status(400).json({ msg: "note not found " })
        }
        res.status(200).json({ msg: "note delete sucessfully" });

    } catch (e) {
        res.status(400).json({
            msg: "error: " + e
        })
    }

})
userRouter.put("/note/update/:id", async (req, res) => {
    const { id } = req.params;
    const updateNote = req.body.updateNote;
    try {
        const updateData = await NoteModel.findByIdAndUpdate(id, updateNote, { new: true });
        if (!updateData) {
            res.status(400).json({ msg: "note not found " })
        }
        res.status(200).json({ msg: "note update sucessfully" });

    } catch (e) {
        res.status(400).json({
            msg: "error: " + e
        })
    }

})
userRouter.put("/todo/:id", async (req, res) => {
    const { id } = req.params;
    const todo = req.body.todo;
    try {
        const updateData = await TodoModel.findByIdAndUpdate(id, { todo: todo }, { new: true });
        if (!updateData) {
            res.status(400).json({ msg: "todo not found " })
        }
        console.log(updateData)
        console.log(todo)
        res.status(200).json({ msg: "todo update sucessfully", updateData });

    } catch (e) {
        res.status(400).json({
            msg: "error: " + e
        })
    }

})

userRouter.get('/question', userMiddleware, async (req: Request, res: Response) => {
    const { subject } = req.query;
    try {
        const importQuestions = await QuestionModel.find({ subject: subject });
        if (!importQuestions) {
            return res.status(400).json({
                msg: "Questions not found"
            })
        }
        console.log(importQuestions)
        res.status(200).json({
            importQuestions
        })
    } catch (e) {
        res.json({ error: "Some error: " + e })
    }
})
userRouter.get('/questions', userMiddleware, async (req: Request, res: Response) => {
    try {
        const importQuestions = await QuestionModel.find({});
        if (!importQuestions) {
            return res.status(400).json({
                msg: "Questions not found"
            })
        }
        console.log(importQuestions)
        res.status(200).json({
            importQuestions
        })
    } catch (e) {
        res.json({ error: "Some error: " + e })
    }
})


userRouter.get("/stream", async (req, res) => {
    // 🧠 Required SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders()
    const prompt = req.query.prompt as string;
    // console.log(res)

    // ❌ If no prompt → send proper JSON
    if (!prompt) {
        res.write(`event: error\ndata: ${JSON.stringify({ error: "Prompt missing" })}\n\n`);
        res.end();
        return;
    }

    // ✅ Call streaming function
    await callGeminiStream(prompt, res);
});
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);

userRouter.post('/chat1', async (req: Request, res: Response) => {
    try {
        const { messages } = req.body; // Expect array of {role: 'user'|'model', parts: [{text: 'message'}]}
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders(); // Ensure headers are sent

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const chat = model.startChat({ history: messages.slice(0, -1) }); // History without last user message
        const lastMessage = messages[messages.length - 1].parts[0].text;

        const stream = await chat.sendMessageStream(lastMessage);

        for await (const chunk of stream.stream) {
            const chunkText = await chunk.text();
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        }

        res.write('event: done\ndata: {}\n\n'); // Signal end of stream
        res.end();
    } catch (error) {
        console.error('Error in /chat:', error);
        res.write(`data: ${JSON.stringify({ error: 'An error occurred' })}\n\n`);
        res.end();
    }
});
userRouter.post('/add/bookmark/question/:questionId', userMiddleware, async (req: Request, res: Response) => {
    const student = req.userId;
    const questionId = req.params.questionId;
    console.log("Student: ", student)
    const requireBody = z.object({
        student: z.string(),
        questionId: z.string()
    });
    const parseSucess = requireBody.safeParse(req.body);
    if (!parseSucess.success) {
        return res.status(403).json({
            massage: "error : " + parseSucess.error
        })
    }
    try {
        await BookMarkModel.create({
            student,
            questionId
        })
        res.status(200).json({
            massage: 'question bookmarked'
        })
    } catch (e) {
        return res.status(403).json({
            massage: "error in catch 1: " + e 
        })
    }
})

userRouter.delete('/delete/bookmark/:questionId', userMiddleware , async (req: Request, res: Response) => {
    const questionId  = req.params.questionId
    try {
        const deleteBookmark = await BookMarkModel.findOneAndDelete({ questionId:questionId , student: req.userId });
        if (!deleteBookmark) {
            res.status(400).json({ msg: "Bookmark not found " })
        }
        res.status(200).json({ msg: "Bookmark delete sucessfully" });

    } catch (e) {
        res.status(400).json({
            msg: "error in catch: " + e
        })
    }

})




userRouter.get('/questions/bookmarked/:studentId', userMiddleware, async (req: Request, res: Response) => {
    try {
        const studentId = req.params.studentId;
        const result = await BookMarkModel.aggregate([
            { $match: { student: new mongoose.Types.ObjectId(studentId) } },
            {
                $project: {
                    question: { $toString: "$questionId" }
                }
            },
            {
                $group: {
                    _id: "$question"
                }
            },
            { $sort: { _id: 1 } }
        ])

        res.json(result)
    }
    catch (e) {
        res.status(400).json({
            msg: "err: " + e
        })
    }
})

// API to get daily solved counts for a student
userRouter.get("/solved/daily/:studentId", userMiddleware, async (req: Request, res: Response) => {
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


