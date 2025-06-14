import mongoose from "mongoose";
 const connectDB = async () =>{
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("mongoDB connected Successfully");
    }
    catch(error){
        console.log(error);
        
    }
 }
export default connectDB;