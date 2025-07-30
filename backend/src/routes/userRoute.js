const express= require("express")
const router= express.Router()
const {createUser,getSpecificUser,getAllUser,loginUser,logoutUser,getUsersData,addProfile,getStory,getAllStories,createStories,followUser,unfollowUser,editProfile,deleteStory}= require("../controllers/userController")
const middleware= require("../middlewares/userMiddleware")

router.get("/all",getAllUser)
router.put("/story/delete",middleware.verifytoken,deleteStory)
router.patch("/create/story",middleware.verifytoken,createStories)
router.get("/story",middleware.verifytoken,getStory)
router.get("/stories",getAllStories)
router.get("/me",middleware.verifytoken,getSpecificUser)
router.get("/data",middleware.verifytoken,getUsersData)
router.post("/signup",createUser)
router.post("/login",loginUser)
router.patch("/profile/data-update/:id",middleware.verifytoken,editProfile)
router.get("/logout",logoutUser)
router.patch("/profile/update/:id",addProfile)
router.patch("/follow/:id", middleware.verifytoken,followUser)
router.patch("/unfollow/:id", middleware.verifytoken,unfollowUser)


module.exports= router