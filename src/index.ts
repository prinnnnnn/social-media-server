import express from "express";
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path"
import { register } from "./controllers/auth"
import authRouter from "./routes/auth"
import userRouter from "./routes/user"
import postRouter from "./routes/post"
import { verifyToken } from "./middleware/auth";
import { createPost } from "./controllers/post";
import User from "./models/user";
import Post from "./models/post";
import { users, posts } from "./data/toyData";

/* CONFIGURATIONS */

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

console.log(`Directory: ${__dirname}\nFilename: ${__filename}`);

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, '/public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/posts", postRouter);

/* MONGOOSE SETUP */
const PORT = process.env.port || 5000;

const dbUrl = process.env.MONGO_URL;

// console.log(`DB url: ${dbUrl}`);

// if (!dbUrl && typeof dbUrl !== "undefined")
    mongoose.connect(dbUrl!)
        .then(() => {
            console.log(`Connected to ${dbUrl}`);
            app.listen(PORT, () => console.log(`Server is succesfully running at port ${PORT}`));
            
            /* ADD DATA ONE TIME */
            // User.insertMany(users);
            // Post.insertMany(posts);

        })
        .catch((error) => console.error(`${error} did not connect`));