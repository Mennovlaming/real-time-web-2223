let socket = io();

let messages = document.querySelector('#messages');
let input = document.querySelector('input');

const kanyequote = document.querySelector('#kanye-quote');

socket.emit('getCurrentQuote');

socket.on('currentQuote', (quote) => {
  //update de quote op de pagina
  kanyequote.innerHTML = quote;
});

document.querySelector('form').addEventListener('submit', event => {
  const message = input.value;
  event.preventDefault();

  if (input.value) {
    if (message.startsWith('!color ')) {
      //als het bericht begint met '!color ', stuur dan een 'color' naar de server met de nieuwe kleurcode
      const newColor = message.substring(7);
      socket.emit('color', newColor);
    } else if (message === '!nextquote') {
      //als het bericht '!nextquote' is, vraag dan een nieuwe quote op en stuur deze naar de server
      fetch('https://api.kanye.rest/')
        .then(response => response.json())
        .then(data => {
          const quote = data.quote;
          socket.emit('nextQuote', quote);
        })
        .catch(error => console.error(error));
    } else {
      //stuurt het bericht naar de server
      socket.emit('message', input.value);
    }
    input.value = '';
  }
});



//aan het typen
document.querySelector('form').addEventListener('keypress', e => {
  if(e.witch!=13) {
    //als het niet keycode 13 is (dat is enter)
      typing = true
      socket.emit('typing', {typing:true})
      setTimeout(typingTimeout, 1500)
  } else {
    //als het wel enter is. voer de functie uit.
      setTimeout(typingTimeout, 1500)
      typingTimeout()
  }
})

//niet aan het typen
function typingTimeout() {
  console.log('notyping')
  typing = false
  socket.emit('typing', {typing: false})
}

//message versturen
socket.on('message', message => {
  //maak een child aan 'li' met de content van de message
  messages.appendChild(Object.assign(document.createElement('li'), { textContent: message }))
  messages.scrollTop = messages.scrollHeight
});


 //verander de achtergrondkleur
socket.on('color', newColor => {
  document.body.style.backgroundColor = newColor;
});

//aan het typen
socket.on('display', (data)=>{
  if(data.typing==true)
  document.querySelector('.typing').innerHTML = "iemand is aan het typen ..."
  else
  document.querySelector('.typing').innerHTML = ""
});







