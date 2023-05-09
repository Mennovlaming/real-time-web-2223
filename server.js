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
  //Als iemand connect.
  console.log('a user connected');

  //als iemand aan het typen is.
  socket.on('typing', (data)=>{
    if(data.typing==true)
       io.emit('display', data)
    else
       io.emit('display', data)
  })

  let currentQuote = '';

  io.on('connection', (socket) => {
    //stuurt de huidige quote naar de nieuwe gebruiker met emit
    socket.emit('currentQuote', currentQuote);
  
    //luistert naar het getCurrentQuote-event om de huidige quote naar de client te sturen
    socket.on('getCurrentQuote', () => {
      socket.emit('currentQuote', currentQuote);
    });
  
    // Luister naar nieuwe quotes van de clients
    socket.on('nextQuote', (quote) => {
      currentQuote = quote;
      //stuurt dit door met emit
      io.emit('currentQuote', currentQuote);
    });
  });
  
  

  
  socket.on('disconnect', () => {
    //als iemand disconnect
    console.log('user disconnected');
  });

  socket.on('message', data => {
    //bij een bericht, word dit doorgestuurd met emit.
    io.emit('message', data);
  });

  socket.on('color', newColor => {
    // Verstuur de nieuwe kleur naar alle clients, zelfde als hierboven.
    io.emit('color', newColor);
  });
  
});

http.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

