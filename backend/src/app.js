const express= require("express")
const app= express()
const cors= require("cors")
const cookieParser= require("cookie-parser")
const http= require("http")
const {Server}= require("socket.io")
const server= http.createServer(app)

const userRouter= require("./routes/userRoute")
const postRouter= require("./routes/postRoute")
const messageRouter= require("./routes/messageRoute")

const io= new Server(server, {
    cors:{
        origin: "https://creative-pegasus-72ef3b.netlify.app",
        methods:["GET", "POST"],
        credentials:true
    }
})

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"https://creative-pegasus-72ef3b.netlify.app",
    credentials:true
}))


app.use("/users", userRouter)
app.use("/posts", postRouter)
app.use("/messages",messageRouter)

// Socket Logic h yha pr
io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  // Join personal room (userId)
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });

  socket.on("sendMessage", ({ sender, receiver, text }) => {
    io.to(receiver).emit("receiveMessage", {
      sender,
      text,
      createdAt: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

module.exports=app