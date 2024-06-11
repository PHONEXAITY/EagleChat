 import express from "express";
 import bodyParser from "body-parser";
 import cookieParser from "cookie-parser";
 import dotenv from "dotenv";
 import connectDB from "./config/condb.js";
 import userRouter from "./routes/userRoutes.js";
 import messageRouter from "./routes/messageRoutes.js";
 import cors from "cors";
 import {app, server} from "./socket/socket.js";
 dotenv.config();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(express.static('public'));

//Connect TO DB
connectDB();

//Routes
app.use('/user',userRouter);
app.use('/user/messages', messageRouter);
const PORT = process.env.PORT;

server.listen(PORT, ()=>{
    console.log(`Server is Running on http://localhost:${PORT}`);
});
