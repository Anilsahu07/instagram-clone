const mongoose= require("mongoose")
const dotenv= require("dotenv")
dotenv.config()

const connect=()=>{
    // mongoose.connect(process.env.MONGO_URI,{
        
    // })
    mongoose.connect(`mongodb://localhost:27017/instagram`)
    .then(()=>{
        console.log("Database is connected");
        
    }).catch((error)=>{
        console.log(error);
    })
}

module.exports=connect