const express = require('express');
const path = require('path');
const app = express();
const http = require("http").createServer(app);
const port = process.env.PORT || 3000;
const io = require('socket.io')(http);
//met path maak je de path 'universeel' voor elk besturingsysteem

const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));


// io.on('connection', socket => {
//   // Wanneer er een nieuw chat-bericht binnenkomt
//   socket.on('message', data => {
//     const message = data.message;
//     const color = data.color;
    
//     // Als de kleur is veranderd, sla deze op en stuur naar alle clients
//     if (color !== currentColor) {
//       currentColor = color;
//       io.emit('message', { message: 'Achtergrondkleur is veranderd', color: currentColor });
//     }
    
//     // Stuur het bericht naar alle clients
//     io.emit('message', { message: message, color: currentColor });
//   });
// });
  

io.on('connection', socket => {
  console.log('a user connected');

  fetch('https://api.kanye.rest/')
    .then(response => response.json())
    .then(data => {

      io.emit('kanye-quote', data.quote);
    })
    .catch(error => console.error(error))

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

