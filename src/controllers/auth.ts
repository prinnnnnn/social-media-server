import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Request, Response } from 'express';
import User from "../models/user";
import { config } from "dotenv";

config();

/* REGISTER USER */
export const register = async (req: Request, res: Response) => {

    try {
        const { password } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            ...req.body,
            password: passwordHash,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        })

        const savedUser = await newUser.save();

        return res.status(201).send(savedUser.toJSON());

    } catch (error) {
        res.status(500).json({ error })
    }

}

/* LOGGING IN */
export const login = async (req: Request, res: Response) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email: email })

        if (!user) 
            return res.status(404).send({ msg: "User does not exist. "});
        
        const isMatch = await bcrypt.compare(user.password, password);

        if (!isMatch) 
            return res.status(400).send({ msg: "Invalid Credential"});

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET!);

        const copiedUser = user.toJSON();

        delete copiedUser.password;

        return res.status(200).send({ token, copiedUser });
        
    } catch (error) {
        return res.status(400).send(error)
    }

}