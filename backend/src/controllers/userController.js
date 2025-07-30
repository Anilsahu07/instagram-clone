const usermodel= require("../models/userModel")
const jwt= require("jsonwebtoken")
const bcrypt= require("bcryptjs")


module.exports.getAllUser=async(req,res)=>{
    try {
        const users= await usermodel.find()
        res.status(200).json({message:"All User fetched",users})
        
    } catch (error) {
        res.status(404).json({message:"Users not fetched", error})
    }
}


module.exports.getSpecificUser=async(req,res)=>{
    try {
        const user= await usermodel.findById(req.user)
        res.status(200).json({message:"User fetched",user})
    } catch (error) {
        res.status(404).json({message:"User not fetched", error})
    }
}


module.exports.getUsersData=async(req,res)=>{
    try {
        const user= await usermodel.findById(req.user).populate("followers", "username profile.avatar").populate("following", "username profile.avatar")
        // const allUsers = await User.find().select('username profile avatar followers');
        res.status(200).json({message:"Users data fetched",
            followers:user.followers,
            following:user.following,
            // users:allUsers
        }) 
    } catch (error) {
        res.status(404).json({message:"Users data not fetched", error})
    }
}



module.exports.followUser= async(req,res)=>{
    try {
        const userToFollow= await usermodel.findById(req.params.id)
        const currentUser= await usermodel.findById(req.user)
        if (!userToFollow || !currentUser) {
        return res.status(404).json({ message: "User not found" });
        }

        if (!userToFollow.followers.includes(req.user)) {
            userToFollow.followers.push(req.user)
            await userToFollow.save();
        }
        if (!currentUser.following.includes(req.params.id)) {
            currentUser.following.push(req.params.id)
             await currentUser.save();
        }
        res.status(200).json({ message: "User followed successfully",userToFollow,currentUser })
    } catch (error) {
        res.status(500).json({ message: "Error following user", error });
        console.log(error);
        
    }
}


module.exports.unfollowUser=async(req,res)=>{
    try {
        const userToUnfollow= await usermodel.findById(req.params.id)
        const currentUser= await usermodel.findById(req.user)
        
        
        if (!userToUnfollow || !currentUser) {
        return res.status(404).json({ message: "User not found" });
        }

        userToUnfollow.followers= userToUnfollow.followers.filter((id)=>
            id.toString()!== req.user.toString()
        )
         await userToUnfollow.save();

        currentUser.following= currentUser.following.filter((id)=>
            id.toString()!== req.params.id.toString()
        )
         await currentUser.save();
         res.status(200).json({ message: "User unfollowed successfully"});

    } catch (error) {
        res.status(500).json({ message: "Error unfollowing user", error });
        console.log(error);
        
    }
}


module.exports.createUser=async(req,res)=>{
    try {
        const {email,username,password,number,image}= req.body
        
        const findByEmail= await usermodel.findOne({email})
        if (findByEmail) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashPassword= await bcrypt.hash(password,10)
        const user= await usermodel.create({
            email,
            username,
            password:hashPassword,
            number,
            image,
        })

        const token= jwt.sign({
            _id:user._id,
            email:user.email
        },"insta-key07")

        if (!token) {
            res.status(403).json({message:"Token not generated"})
        }
        res.cookie("token", token)
        res.status(200).json({message:"User created", user})
    } catch (error) {
        res.status(404).json({message:"User not created"})
    }

}


module.exports.loginUser=async(req,res)=>{

    try {
        const {email,password}= req.body
        const user= await usermodel.findOne({email})

        if (!user) {
          return  res.status(400).json({message:"User not found"})
        }

        const isMatched= await bcrypt.compare(password,user.password)

        if (!isMatched) {
           return res.status(401).json({message:"Invalid Credientials"})
        }

        const token= jwt.sign({
            _id:user._id,
            email:user.email
        },"insta-key07")

        res.cookie("token", token,
            {
             httpOnly: true,
             secure: true,           
             sameSite: "None",       
             maxAge: 1000 * 60 * 60
            }
        )
        res.cookie("token",token)
        res.status(200).json({message:"Login Successful",user})

    } catch (error) {
        res.status(404).json({message:"Login not successful"})
    }

}


module.exports.logoutUser=async(req,res)=>{
    res.clearCookie("token")
    res.status(200).json({ message: "Logged out successfully"});
}


module.exports.addProfile=async(req,res)=>{
    try {
        const profile=  await usermodel.findByIdAndUpdate(req.params.id,{profile:req.body,isProfileComplete: true},{new:true})
        res.json({ message: "Profile updated successfully", user:profile });
    } catch (error) {
         res.status(500).json({ message: "Error updating profile", error});
    }
}


module.exports.createStories=async(req,res)=>{
    try {
        const {image}= req.body

        const story= await usermodel.findByIdAndUpdate(req.user,{
            
        $push: {
          stories: {
            image,
            uploadedBy: req.user
          }
        
      },
        }, {new:true})
        res.status(201).json({message:"Story uploaded",stories:story.stories})
    } catch (error) {
        res.status(403).json({message:"Story not uploaded"})
    }
}


module.exports.getAllStories=async(req,res)=>{
    try {
        const stories= await usermodel.find().populate("stories.uploadedBy")
        res.status(200).json({message:"All Stories fetched",stories})
        
    } catch (error) {
        res.status(404).json({message:"Stories not fetched", error})
    }
}

module.exports.getStory=async(req,res)=>{
    try {
        const story= await usermodel.findById(req.user).populate("stories.uploadedBy")
        res.status(200).json({message:"Story fetched",story:story.stories})
    } catch (error) {
        res.status(404).json({message:"Story not fetched", error})
    }
}


module.exports.editProfile=async(req,res)=>{

    try {
        const edit= await usermodel.findByIdAndUpdate(req.params.id,{profile:req.body},{new:true})
        res.status(200).json({message:"Profile Updated", edit})
    } catch (error) {
        res.status(401).json({message:"Profile not updated"})
    }
}


// DELETE a specific story from user's stories array
module.exports.deleteStory = async (req, res) => {
  try {
    const userId = req.user; // from verifytoken middleware
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    // Pull the story that matches the given image URL
    const updatedUser = await usermodel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          stories: { image: image }
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser.stories); // return updated stories
  } catch (err) {
    console.error("Error deleting story:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
