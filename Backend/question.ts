import { QuestionModel } from "./Schema.ts";
import { Router } from "express";
import type { Request, Response } from "express";

export const  questionRouter = Router();

questionRouter.get("/preview" ,  async (req:Request, res:Response) => {
    const showQuestions = await QuestionModel.find({});
    console.log(showQuestions)
    res.json({
        showQuestions
    })
})
