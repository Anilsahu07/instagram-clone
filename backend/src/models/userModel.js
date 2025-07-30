const mongoose= require("mongoose")


const userSchema= new mongoose.Schema({
    username:String,
    email:String,
    number:Number,
    password:String,
    profile: {
        fullName:  { type: String },
        bio:       { type: String },
        avatar:    { type: String },
        website:   { type: String },
        gender:    { type: String, enum: ["male", "female", "Other"] },
        birthday:  { type: Date },
        location:  { type: String }
    }, 
    isProfileComplete: {
        type: Boolean,
        default: false
    },
    followers:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    following:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    stories:[{
        image:{type:String,required:true},
        uploadedBy:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    }]
})


const userModel= mongoose.model("User", userSchema)
module.exports= userModel