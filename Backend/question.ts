import { QuestionModel } from "./Schema.ts";
import { Router } from "express";
import type { Request, Response } from "express";
import { userMiddleware } from "./auth.ts";

export const  questionRouter = Router();


