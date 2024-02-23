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
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(  "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization" );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });
const PORT = process.env.PORT;

server.listen(PORT, ()=>{
    console.log(`Server is Running on http://localhost:${PORT}`);
});
