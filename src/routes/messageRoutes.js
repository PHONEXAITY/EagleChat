import { Router } from "express";
import { getMessage, sendMessage } from "../controllers/messageController.js";
import { verifyToken } from "../middleware/verifytoken.js";
const router = Router();

router.post('/send/:id',verifyToken, sendMessage);
router.get('/:id', verifyToken, getMessage)

export default router;