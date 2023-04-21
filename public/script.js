let socket = io();
let messages = document.querySelector('section ul')
let input = document.querySelector('input')

document.querySelector('form').addEventListener('submit', event => {
    const message = input.value;
  event.preventDefault()
  if (input.value) {
    socket.emit('message', input.value)
    input.value = ''
  }
  if (message.includes('rood')) {
    document.body.style.backgroundColor = 'red';
  } else if (message.includes('blauw')){
    document.body.style.backgroundColor = 'blue';
  } else if (message.includes('groen')) {
    document.body.style.backgroundColor = 'green';
  } else {
    document.body.style.backgroundColor = '';
  }
});

socket.on('message', message => {
//appendChild maakt een childelement aan, voegt die toe aan 'messages' ul, content van die li is de message
  messages.appendChild(Object.assign(document.createElement('li'), { textContent: message }))
  //zorgt ervoor dat de interface scrollt naar het onderste bericht
  messages.scrollTop = messages.scrollHeight
});
