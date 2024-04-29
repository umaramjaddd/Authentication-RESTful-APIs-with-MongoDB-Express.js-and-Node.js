import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import route from "./Routers/userRouters.js";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGOURL = process.env.MONGOURL;

mongoose.connect(MONGOURL).then(()=>{
    console.log("DB Connected successfully");

    app.listen(PORT, ()=>{
        console.log(`App is running on port: ${PORT}`);
    })
}).catch(error=>console.log(error));

app.use("/api/users", route);