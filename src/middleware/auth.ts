import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { config } from "dotenv";

config();

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {

    try {

        let token = req.header("Authorization");

        if (!token)
            return res.status(403).send("Access Denied")

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimStart();
        }

        const verified = jwt.verify(token, process.env.JWT_TOKEN!);
        req.body.user = verified;
        next();
        
    } catch (error) {
        return res.status(500).send(error);
    }

}