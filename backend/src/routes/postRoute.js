const express= require("express")
const router= express.Router()
const {verifytoken}= require("../middlewares/userMiddleware")
const {getAllPosts,getPosts,createPosts,deletePost,updatePost,deleteComment,addComment,likePost}=require("../controllers/postController")

router.get("/all",getAllPosts)
router.post("/comment",addComment)
router.put("/like/:id",verifytoken,likePost)
router.delete("/comment/:id",verifytoken,deleteComment)
router.get("/",verifytoken,getPosts)
router.post("/create",verifytoken,createPosts)
router.delete("/:id",verifytoken, deletePost)
router.patch("/update/:id",verifytoken,updatePost)



module.exports= router