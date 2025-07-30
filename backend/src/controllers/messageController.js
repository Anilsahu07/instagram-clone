const messageModel= require("../models/messageModel")



module.exports.sendMessage=async(req,res)=>{
    const {sender,receiver,text}= req.body
    try {
        const message= await messageModel.create({sender,receiver,text})
        res.status(201).json(message)
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}


module.exports.receiveMessage=async(req,res)=>{
    try {
        const {user1,user2}= req.params
        const messages= await messageModel.find({
            $or:[
                {sender:user1, receiver:user2},
                {sender:user2, receiver:user1},
            ]
        }).sort({createdAt:1})
        res.status(201).json(messages)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

module.exports.deleteChats=async(req,res)=>{
    try {
        const {user1,user2} = req.params
        await messageModel.deleteMany({
            $or:[
                {sender:user1,receiver:user2},
                {sender:user2,receiver:user1},
            ]
        })   
        res.status(200).json({ message: "Chat deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}