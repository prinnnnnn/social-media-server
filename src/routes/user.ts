import { Router } from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend
} from "../controllers/user"

import { verifyToken } from "../middleware/auth";

const router = Router();

router.use(verifyToken);

router.get("/:id", getUser);
router.get("/friends/:id", getUserFriends);
router.patch("/:id/:friendId", addRemoveFriend);

export default router;