import { Router } from "express";
import {register, login, logout} from "../controllers/authController.js";
import {postProfile, getProfile, changeProfile, getUsersForSidebar} from "../controllers/user.Controller.js";
import { verifyToken } from "../middleware/verifytoken.js";

 const router = Router();

 /*Auth Routes*/
router.post('/register',register);
router.post('/login', login);
router.post('/logout', verifyToken, logout);

/*User Routes*/
router.post('/profile',verifyToken, postProfile);
router.get('/profile', getProfile);
router.put('/profile',verifyToken, changeProfile);
router.get('/getUsers', getUsersForSidebar);

export default router;