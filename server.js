const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const http = require("http").createServer(app);
const io = require('socket.io')(http);
//met path maak je de path 'universeel' voor elk besturingsysteem

const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));
  

io.on('connection', socket => {
  console.log('a user connected');

  socket.on('typing', (data)=>{
    if(data.typing==true)
       io.emit('display', data)
    else
       io.emit('display', data)
  })

  let currentQuote = '';

  io.on('connection', (socket) => {
    // Stuur de huidige quote naar de nieuwe gebruiker
    socket.emit('currentQuote', currentQuote);
  
    // Luister naar het getCurrentQuote-event om de huidige quote naar de client te sturen
    socket.on('getCurrentQuote', () => {
      socket.emit('currentQuote', currentQuote);
    });
  
    // Luister naar nieuwe quotes van de clients
    socket.on('nextQuote', (quote) => {
      currentQuote = quote;
      io.emit('currentQuote', currentQuote);
    });
  });
  
  

  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('message', data => {
    io.emit('message', data);
  });

  socket.on('color', newColor => {
    // Verstuur de nieuwe kleur naar alle clients
    io.emit('color', newColor);
  });
  
});

http.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

