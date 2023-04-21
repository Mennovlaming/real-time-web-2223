const express = require('express');
const path = require('path');
const app = express();
const http = require("http").createServer(app);
const port = process.env.PORT || 3000;
const io = require('socket.io')(http);
//met path maak je de path 'universeel' voor elk besturingsysteem

const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// io.on('connection', (socket) => {
//     console.log('a user connected');
//   });

io.on("connection", (socket) => {
    console.log("a user connected");
  
    socket.on('typing', (data)=>{
      if(data.typing==true)
         io.emit('display', data)
      else
         io.emit('display', data)
    })
  
    socket.on("message", (message) => {
  
      io.emit("message", message);
    });
  
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

http.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

