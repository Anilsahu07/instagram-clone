const express= require("express")
const router= express.Router()
const {sendMessage,receiveMessage,deleteChats}= require("../controllers/messageController")

router.post("/send", sendMessage)
router.get("/:user1/:user2", receiveMessage)
router.delete("/delete/:user1/:user2",deleteChats)

module.exports=router