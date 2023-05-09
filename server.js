const express = require('express');
const path = require('path');
const app = express();
const http = require("http").createServer(app);
const port = process.env.PORT || 3000;
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

  //Als er een user connect, fetch een quote van de api.
  fetch('https://api.kanye.rest/')
    .then(response => response.json())
    .then(data => {
      // vervolgens stuur je die quote met emit naar je gebruikers.
      io.emit('kanye-quote', data.quote);
    })
    .catch(error => console.error(error))


  socket.on('chat message', message => {
    // If the message is "!nextquote", fetch a new quote and emit it to all clients
    if (message === '!nextquote') {
      fetch('https://api.kanye.rest/')
        .then(response => response.json())
        .then(data => {
          io.emit('kanye-quote', data.quote);
        })
        .catch(error => console.error(error));
    }
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

