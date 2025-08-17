import { UserModel } from "./Schema.ts";
import  type { Request , Response}  from "express";
import { Router } from "express";
import z from 'zod';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_USER  = process.env.JWT_USER as string;

export const userRouter = Router();

userRouter.post('/signup', async (req:Request , res:Response) =>{
    const  requireBody = z.object({
        email:z.string().min(3).max(100).email(),
        password:z.string().min(8).max(20),
        username:z.string().min(1).max(50)
    });

    const parseData = requireBody.safeParse(req.body);

    if(!parseData.success){
        return res.status(400).json({
              message: "Incorrect Format",
              error: parseData.error
        })
    }

    const {email , password , username} = req.body;

    const hassedPassword = await bcrypt.hash(password,5);

    try{
        await UserModel.create({
            email,
            username,
            password: hassedPassword
        })

    }catch(e){
        res.status(403).json({
            msg:"user already exists",
           
        })
         console.log("error is --: " ,e)
    }
    res.status(200).json({
        msg:"User created successfully!"
    })

});

userRouter.post('/signin', async (req:Request, res:Response) =>{

        const  requireBody = z.object({
        email:z.string().min(3).max(100).email(),
        password:z.string().min(8).max(20),
        username:z.string().min(1).max(50)
    });

    const parseData = requireBody.safeParse(req.body);

    if(!parseData.success){
        return res.status(400).json({
              message: "Incorrect Format",
              error: parseData.error
        })
    }


    const {email, password, username} = req.body;
    
   const user = await UserModel.findOne({email:email});
     if(!user || !user.password){
        return res.status(403).json({
            message:"Incorrect Credentials !"
        });
    }
   
     const passwordMatch = await bcrypt.compare(password, user.password);

     if(passwordMatch){
      const token =   jwt.sign({
         id: user._id
      } , JWT_USER)
      
      res.status(200).json({
        token:token
      })
     }
     else{
        // If the password does not match, return a error indicating the invalid credentials
        res.status(403).json({
            // Error message for failed password comparison
            message:"Invalid credentials!"
        })
    }
})

