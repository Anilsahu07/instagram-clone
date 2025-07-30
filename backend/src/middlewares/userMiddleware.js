const jwt= require("jsonwebtoken")


module.exports.verifytoken=async(req,res,next)=>{
    try {
        const token= req.cookies.token
        if (!token) {
            res.status(403).json({message:"Token not provided"})
        }
        const decoded= jwt.verify(token, "insta-key07")
        req.user=decoded._id
        next()
    } catch (error) {
        res.status(404).json({message:"Expired or Invalid token"})
    }
}