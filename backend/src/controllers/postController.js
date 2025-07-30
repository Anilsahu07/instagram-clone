const postmodel= require("../models/postModel")
const commentModel= require("../models/commentModel")
const userModel= require("../models/userModel")

module.exports.getAllPosts=async(req,res)=>{
    try {
        const posts= await postmodel.find().populate("createdBy")
        res.status(200).json({message:"All Posts fetched",posts})
    } catch (error) {
        res.status(404).json({message:"All Posts not fetched!!"})
    }
}


module.exports.getPosts=async(req,res)=>{
    
    try {
        const posts=await postmodel.find({createdBy:req.user}).populate("createdBy")
        res.status(200).json({message:"Posts fetched",posts})
    } catch (error) {
        res.status(404).json({message:"Posts not fetched"})
    }
}


module.exports.createPosts=async(req,res)=>{

    try {
        const {post,caption}= req.body
        const createPost= await postmodel.create({
            post,
            caption,
            createdBy:req.user
        })

        res.status(200).json({message:"Post Created Successfull", createPost})
    } catch (error) {
        res.status(403).json({message:"Post not created"})
    }
}


module.exports.deletePost=async(req,res)=>{

    try {
        await postmodel.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"Post deleted"})
    } catch (error) {
        res.status(402).json({message:"Post not deleted"})
    }
}


module.exports.updatePost=async(req,res)=>{
    
    try {
        const post= await postmodel.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(200).json({message:"Post Updated",post})
    } catch (error) {
        res.status(402).json({message:"Post not Updated"})
    }
}


module.exports.deleteComment=async(req,res)=>{
    try {
        const comment= await commentModel.findById(req.params.id)
        if(!comment) return res.status(404).json({message:"comment not found"})

        const currentUser = await userModel.findById(req.user)
        if (!currentUser) return res.status(401).json({ message: "Unauthorized" });

        if (comment.user !== currentUser.username) {
        return res.status(403).json({ message: "Unauthorized" });
        }

        await commentModel.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"Comment deleted"})
    } catch (error) {
        res.status(400).json({message:"comment not Deleted"})
    }
}


module.exports.addComment=async(req,res)=>{
    try {
        const {text,postId,user}=req.body
        const addComment= await commentModel.create({
            text,
            postId,
            user
        })
        res.status(200).json({message:"Comment has been made",addComment})
    } catch (error) {
         console.error("Add Comment Error:", error);
         res.status(500).json({ message: "Internal Server Error" });
    }
}


module.exports.likePost=async(req,res)=>{

    try {
    const post = await postmodel.findById(req.params.id);
    const userId = req.user;

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Toggle like
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

   const updatedPost = await postmodel.findById(post._id).populate("createdBy");
    res.status(200).json(updatedPost);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }

}