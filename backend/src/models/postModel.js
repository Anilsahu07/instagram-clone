const mongoose= require("mongoose")


const postSchema= new mongoose.Schema({
    post:String,
    caption:String,
    createdBy:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    likes: [{type:mongoose.Schema.Types.ObjectId, ref:"User"}]
})


const postModel= mongoose.model("Post", postSchema)
module.exports= postModel