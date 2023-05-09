let socket = io();

let messages = document.querySelector('#messages');
let input = document.querySelector('input');

let userName = '';


function getKanyeQuote() {
  fetch('https://api.kanye.rest/')
    .then(response => response.json())
    .then(data => {
      const kanyeQuote = document.getElementById('kanye-quote');
      kanyeQuote.innerText = data.quote;
    })
    .catch(error => console.error(error));
}

// Call the function to get the initial quote
getKanyeQuote();

document.querySelector('form').addEventListener('submit', event => {
  const message = input.value;
  event.preventDefault()
  if (input.value) {
    if (message.startsWith('!color ')) {
      // Als het bericht begint met '!color ', stuur dan een 'color' event naar de server met de nieuwe kleurwaarde
      const newColor = message.substring(7);
      socket.emit('color', newColor);
    } else if (message === '!nextquote'){
      socket.emit('chat message', message);
    } else {
      // Stuur het bericht naar de server
      socket.emit('message', input.value);
    }
    input.value = ''
  }
});

document.querySelector('form').addEventListener('keypress', e => {
  if(e.witch!=13) {
      typing = true
      socket.emit('typing', {typing:true})
      setTimeout(typingTimeout, 1500)
  } else {
      setTimeout(typingTimeout, 1500)
      typingTimeout()
  }
})

function typingTimeout() {
  console.log('notyping')
  typing = false
  socket.emit('typing', {typing: false})
}

messages.addEventListener('submit', event => {
  event.preventDefault();
  const message = input.value.trim();

  if (message === '!nextquote') {
    socket.emit('chat message', message);
  } else {
    // If the message is not "!nextquote", send it to the server as a regular chat message
    socket.emit('chat message', chatInput.value);
  }

  input.value = '';
});

socket.on('message', message => {
  messages.appendChild(Object.assign(document.createElement('li'), { textContent: message }))
  messages.scrollTop = messages.scrollHeight
});

socket.on('color', newColor => {
  // Verander de achtergrondkleur
  document.body.style.backgroundColor = newColor;
});


// When a new Kanye West quote is received
socket.on('kanye-quote', (quote) => {
  // Display the quote on the webpage
  document.getElementById('kanye-quote').innerHTML = quote;
});

socket.on('display', (data)=>{
  if(data.typing==true)
  document.querySelector('.typing').innerHTML = "iemand is aan het typen ..."
  else
  document.querySelector('.typing').innerHTML = ""
})


