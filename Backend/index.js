import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app,server } from "./socket/socket.js";
import path from "path";

dotenv.config({});


const PORT = process.env.PORT;

const __dirname = path.resolve();

// app.get("/",(req,res)=>{
    
//      return res.status(200).json({
//         message: "from Back to front",
//         success: true
//      });
     
// });
// Configure CORS properly
const corsOptions = {
    origin: [process.env.URL, 'http://192.168.131.4:5173/'],
    credentials: true,
    optionsSuccessStatus: 200
  }
app.use(cors(corsOptions));


app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public"))); 


//api
app.use("/api/v2/user", userRoute);
app.use("/api/v2/post", postRoute);
app.use("/api/v2/message", messageRoute);

app.use(express.static(path.join(__dirname, "/Frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Frontend","dist","index.html"));
  }); 

server.listen(PORT, ()=>{
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});