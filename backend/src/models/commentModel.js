const mongoose=require("mongoose")


const commentSchema= new mongoose.Schema({
        text:String,
        postId:{type:mongoose.Schema.Types.ObjectId, ref:"Post"},
        user:String
})


const commentModel= mongoose.model("Comment",commentSchema);
module.exports=commentModel