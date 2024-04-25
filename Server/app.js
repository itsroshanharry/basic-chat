const http = require("http");
const express = require('express');
const {Server} = require('socket.io');
const cors = require('cors');

const port = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin:"http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(cors());

app.get('/', function(req, res) {
    res.send("Hello world");
})

io.on("connection", (socket) => {
    console.log("A new user has connected", socket.id);
   
    socket.on("message", ({message, room})=>{
        console.log({message, room});
        io.to(room).emit("receive-message", message);
       
    })
    
    socket.on("join-room", (room)=>{
       socket.join(room);
       console.log(`User joined room ${room}`);
    })

    socket.on("disconnected", ()=> {
        console.log("User disconnected", socket.id);
    })
})


server.listen(port, () => {
    console.log(`Server started on port: ${port}`);
})
