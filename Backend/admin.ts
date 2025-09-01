import { adminModel, QuestionModel } from "./Schema.ts";
import type { Request, Response } from "express";
import { Router } from "express";
import z from 'zod';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { adminMiddleware } from "./auth.ts";

dotenv.config();

const JWT_ADMIN = process.env.JWT_USER as string;

export const adminRouter = Router();

adminRouter.post('/signup', async (req: Request, res: Response) => {
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
    await adminModel.create({
      email,
      username,
      password: hassedPassword
    })

  } catch (e) {
    res.status(403).json({
      msg: "user already exists",
    })
    console.log("error is --: ", e);
  }
  res.status(200).json({
    msg: "User created successfully!"
  })
});

adminRouter.post('/signin', async (req: Request, res: Response) => {

  const requireBody = z.object({
    identifire: z.string(),
    password: z.string().min(8).max(20)

  });

  const parseData = requireBody.safeParse(req.body);

  if (!parseData.success) {
    return res.status(400).json({
      message: "Incorrect Format",
      error: parseData.error
    })
  }


  const { identifire, password } = parseData.data;

  const admin = await adminModel.findOne({ $or: [{ username: identifire }, { email: identifire }] });
  if (!admin || !admin.password) {
    return res.status(403).json({
      message: "Incorrect Credentials !"
    });
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);

  if (passwordMatch) {
    const token = jwt.sign({
      id: admin._id
    }, JWT_ADMIN)

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24
    })

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
adminRouter.post('/add/question', adminMiddleware, async (req: Request, res: Response) => {

  const adminId = req.adminId;
  const requireBody = z.object({
    question: z.string(),
    option: z.array(z.string()),         // multiple options allowed
    answer: z.array(z.string()),
    subject: z.enum(['PHYSICS', 'MATHS', 'CHEMISTRY']),
    year: z.number().int().min(2000).max(2025),
    examType: z.enum(['JEE', 'NEET', 'OTHER']),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
    tags: z.array(z.string())            // multiple tags allowed
  });

  const parseDataSuccess = requireBody.safeParse(req.body);

  if (!parseDataSuccess.success) {
    return res.status(400).json({
      msg: "incorrect formate",
      error: parseDataSuccess.error
    })
  }

  const { question, option, answer, subject, year, examType, difficulty, tags } = parseDataSuccess.data;


  try {
    await QuestionModel.create({
      question,
      option,
      answer,
      subject,
      year,
      examType,
      difficulty,
      tags,
      creatorId: adminId
    })
  } catch (e) {
    res.status(400).json({
      msg: 'admin not loggin',
      error: e
    })
  }

  res.json({
    msg: "question created!"
  })
});


adminRouter.put("/question/:id", adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;   // URL se questionId le rahe hain
    const updateData = req.body; // Jo fields admin update karna chahta hai

    // { new: true } return karega updated document
    const updatedQuestion = await QuestionModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({
      message: "Question updated successfully",
      data: updatedQuestion
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
adminRouter.delete("/question/:id", adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;   // URL se questionId le rahe hain

    const deleteQuestion = await QuestionModel.findByIdAndDelete(id);

    if (!deleteQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({
      message: "Question delete successfully",

    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

