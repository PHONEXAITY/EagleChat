import { Router } from "express";
import {register, login, postProfile, getProfile, changeProfile} from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifytoken.js";

 const router = Router();

router.post('/register',register);
router.post('/login', login);
router.post('/profile',verifyToken, postProfile);
router.get('/profile',verifyToken, getProfile);
router.put('/profile',verifyToken, changeProfile);

export default router;