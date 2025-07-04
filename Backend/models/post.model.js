import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption:{type:String, default:''},
    image:{type:String, require:true},
    author:{type:mongoose.Schema.Types.ObjectId, ref:'User', require:true}, 
    likes:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}], 
    comments:[{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}], 
},{timestamps:true});

export const Post = mongoose.model('Post',postSchema);