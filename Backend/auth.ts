import jwt  from 'jsonwebtoken';
import dotenv from "dotenv";
import express from 'express';
import type { Request, Response, NextFunction } from 'express';


dotenv.config();

const JWT_USER = process.env.JWT_USER as string;
const JWT_ADMIN = process.env.JWT_USER as string;

// interface MyJwtPayload extends JwtPayload {
//   id: string;
// }
declare global {
  namespace Express {
    interface Request {
      adminId?: string; // ya number agar tumhe number store karna hai
      userId?: string; // ya number agar tumhe number store karna hai
      
    }
  }
}

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    

    const token = req.headers.token;
    try {
         const decoded = jwt.verify(token as string,JWT_USER) as {id : string} ;
      
         req.userId  = decoded.id;

         next();
         
    }
    catch(e){
        res.status(400).json({
         error:"your are not signed in "
        })
    }
   
}

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // const token = req.headers.token;
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token as string, JWT_ADMIN) as { id: string };
        req.adminId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
