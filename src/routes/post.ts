import { Router } from "express";
import {
    getFeedPosts,
    getUserPosts,
    likePost,
} from "../controllers/post"

import { verifyToken } from "../middleware/auth";

const router = Router();

router.use(verifyToken);

router.get("/", getFeedPosts);
router.get("/:userId/posts", getUserPosts);
router.patch("/:id/like", likePost);

export default router;