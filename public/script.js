let socket = io();
let messages = document.querySelector('section ul')
let input = document.querySelector('input')



document.querySelector('form').addEventListener('submit', event => {
  const message = input.value;
  event.preventDefault()
  if (input.value) {
    if (message.startsWith('!color ')) {
      // Als het bericht begint met '!color ', stuur dan een 'color' event naar de server met de nieuwe kleurwaarde
      const newColor = message.substring(7);
      socket.emit('color', newColor);
    } else {
      // Stuur het bericht naar de server
      socket.emit('message', input.value);
    }
    input.value = ''
  }
});

socket.on('message', message => {
  messages.appendChild(Object.assign(document.createElement('li'), { textContent: message }))
  messages.scrollTop = messages.scrollHeight
});

socket.on('color', newColor => {
  // Verander de achtergrondkleur
  document.body.style.backgroundColor = newColor;
});


// // Make a request to the API endpoint
// fetch('https://api.kanye.rest/')
//   .then(response => response.json())
//   .then(data => {
//     // Retrieve the quote from the response data
//     const quote = data.quote;
//     // Display the quote on your webpage
//     document.getElementById('quote').innerHTML = quote;
//   })
//   .catch(error => console.error(error));


// When a new Kanye West quote is received
socket.on('kanye-quote', (quote) => {
  // Display the quote on the webpage
  document.getElementById('kanye-quote').innerHTML = quote;
});

  
