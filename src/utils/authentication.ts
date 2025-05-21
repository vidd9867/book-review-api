import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./encrpyt";
import { BookReviewBLL } from "../bll/book-review.bll";

// This is the middleware function that will be used to protect routes
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  
  try {
    const decoded = verifyToken(authHeader);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    if ((decoded as any)?.userdetails) {
        if(req?.body){
            req.body.userId = (decoded as any)?.userdetails?.id;
        }else{
            req.body = {
                userId: (decoded as any)?.userdetails?.id
            }
        }
    }
    
    next(); // Proceed to the next middleware or controller
  } catch (error: any) {
    if (error.message === "jwt expired") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    return res.status(401).json({ message: `Invalid token: ${error.message}` });
  }
};