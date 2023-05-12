# Real time web

## Inhoudsopgave
- Opdracht
- Omschrijving
- Data model
- Proces/Code
- Could haves/ toekomstige ideeen

## Opdracht
Bij het vak Real time web van de minor web design en development kregen wij de opracht; maak een online
chatomgeving d.m.v. websockets. De bedoeling hiervan is een chatroom waar meerdere gebruikers met elkaar kunnen
chatten, je hebt dus een open verbinding met eklaar. Dit kan je doen met het gebruik van socket.io.

## Omschrijving
Mijn idee was als volgt: een chatroom waar gebruikers met elkaar kunnen praten, en als toevoeging kunnen gebruikers
enkele comando's typen die effect hebben op de styling, denk bijvoorbeeld aan het veranderen van de achtergrond
en of font kleur. 

Uiteindelijk heb ik alleen het idee met de achtergrondkleur verwerkt, en heb ik een quote API toegevoegd. 
Het is de bedoeling dat de gebruikers allemaal deze quotes te zien krijgen en ook naar een volgende quote kunnen 
gaan als er een bepaald commando word ingetypt. 

## Data model 
<img width="691" alt="image" src="https://github.com/Mennovlaming/real-time-web-2223/assets/24406793/dac4a9d9-78e3-4d1d-8c80-3be811344156">

## Proces
### Week 1
Zelf had ik nog nooit met een soortgelijk iets gewerkt, dus was het voor mij best wel een sprong in het diepe,
wel had ik meteen een paar leuke ideeen die ik wou implementeren in mijn project. 

Om stapsgewijs te beginnen, (iets wat ik heb geleerd bij een vorig vak ;))ben ik begonnen met het maken van de 
chatfunctie zelf. Dus eerst kijken hoe het werkt, de dia's van de les nog een keer bekijken en wat meer informatie zoeken
over socket.io. 

Het voor elkaar krijgen van een simpele chatfunctie was opzich makkelijker dan ik dacht,en al snel begon mijn chatroom
vorm te krijgen, al zag het er nog wel erg simpel uit.
![image](https://github.com/Mennovlaming/real-time-web-2223/assets/24406793/36c8bdd6-d3d4-4319-8430-a1aba642aef3)

Hierna ben ik begonnen met mijn tweede functionaliteit, namelijk het veranderen van een achtergrondkleur. 
Ik wou dat een gebruiker '!color red' kan typen, en dat dan de achtergrondkleur veranderd van alle gebruikers.
Dit heb ik in het begin zo aanpakt: 
```Javascript
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
```
Dit werkte natuurlijk nog niet voor elke gebruiker, maar dan had ik wel even iets op mijn idee te laten testen bij 
de eerste testronde. 

### Eerste feedbackronde
De feedback die ik kreeg waar ik het meeste aan had was dat ik nu alleen nog maar een beperkt aantal
kleuren kon typen en dat deze ook alleen met kleine letter werkte, ik zou dus iets aan de code moeten doen om deze
uit te breiden. 
Ook een punt die ik kreeg was het maken dat je kon zien of iemand aan het typen was, dit wou ik na deze functie uit gaan werken.

## Week 2
Week 2 was een korte week i.v.m. koningsdag.
Ik was hard aan de slag gegaan met het verbeteren van mijn functie van het kleur veranderen. Uiteindelijk is het dit geworden:
Ik heb geleerd dat je met socket.emit data kan versturen naar de server, en vanaf daar weer terug naar de gebruikers, 
op deze manier kan je dus data heen en weer sturen, zoals een achtergrondkleur.
```Javascript
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
```
Mijn kleurfunctie werkte nu naar behoren en het chatten werkte ook nog.

## Week 3 meivakantie
Week 3 was meivakantie, niet erg veel aan de opdracht gedaan, wel even goed nagedacht over wat voor functionaliteiten 
ik nog meer toe zou willen voegen. 

Ik kwam met het idee om een quote API te gebruiken, en dan ervoor zorgen dat alle gebruikers dezelfde quotes te 
zien krijgen, en ook eentje kunnen skippen als ze dat willen. 
Ik ben tijdens een project in het verleden ooit de Kanye Rest API tegengekomen, een quote API met quotes van Kanye West.
Dit is bedoelt voor de grap en er zitten in hoop hilarische quotes tussen, het leek mij erg leuk deze toe te voegen.

Laatste weekend van de vakantie ben ik hier nog even mee gaan knutselen en ik had het alsnog vrij snel voor elkaar. (dacht ik)
```Javascript
io.on('connection', socket => {
  console.log('a user connected');

  fetch('https://api.kanye.rest/')
    .then(response => response.json())
    .then(data => {

      io.emit('kanye-quote', data.quote);
    })
    .catch(error => console.error(error))

```
Hiermee word elke keer een fetch uitgevoerd als er een user connect, ook word deze meteen doorgestuurd.
## Week 4 afronding
De laatste week was al weer aangebroken en ik ging mijn app deployen om het te testen. Tot nu toe had ik: 
- de kleurenfunctie
- De Kanye API
- met !nextquote konden gebruikers naar de volgende quote.

```Javascript
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
```
Ik dacht dat ik hiermee de quote functie zou hebben in de serverside.

Toen ik de app ging deployen, werkte helemaal niks.
Na een ochtend en middag ruzie ben ik er achter gekomen dat ik niet kan/mag fetchen in mijn server.js. en dat
dit allemaal client side moet gebeuren.

Uiteindelijk heb ik de kleur- en de quotefunctie in de client samengevoegd: 
```Javascript
if (input.value) {
    if (message.startsWith('!color ')) {
      // Als het bericht begint met '!color ', stuur dan een 'color' event naar de server met de nieuwe kleurwaarde
      const newColor = message.substring(7);
      socket.emit('color', newColor);
    } else if (message === '!nextquote') {
      // Als het bericht '!nextquote' is, vraag dan een nieuwe quote op en stuur deze naar de server
      fetch('https://api.kanye.rest/')
        .then(response => response.json())
        .then(data => {
          const quote = data.quote;
          socket.emit('nextQuote', quote);
        })
        .catch(error => console.error(error));
    } else {
      // Stuur het bericht naar de server
      socket.emit('message', input.value);
    }
    input.value = '';
```
server: 
```Javascript
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
  
  socket.on('color', newColor => {
    // Verstuur de nieuwe kleur naar alle clients
    io.emit('color', newColor);
  });
```

Als laatste heb ik nog toe kunnen voegen dat je kan zien of een andere gebruiker aan het typen is: 
Server: 
```Javascript
io.on('connection', socket => {
  console.log('a user connected');

  socket.on('typing', (data)=>{
    if(data.typing==true)
       io.emit('display', data)
    else
       io.emit('display', data)
  })
```
Client: 
```Javascript
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

//niet aan het typen
function typingTimeout() {
  console.log('notyping')
  typing = false
  socket.emit('typing', {typing: false})
}
```

## Toekomstige ideeen
Ik had graag nog meer tijd gehad voor dit vak, ik heb erorm veel geleerd en ben achter een hoop nieuwe leuke
dingen gekomen. Ik ga zeker verder met dit project, als ik meer tijd had gehad had ik graag nog dit toe willen voegen:
- Username systeem, dat gebruikers hun naam in kunnen vullen en dat je kan zien wie iets zegt of wie wat gedaan heeft.
- Zien we er online is, haakt in op de vorige.
- Opties tussen verschillende artiesten m.b.t. de quotes (blijkbaar bestaat dit) 
- Meer visuele effecten met commando's.
- Bestanden versturen.
- Database linken en chats opslaan in bijvoorbeeld local storage met een service worker.

Al met al ben ik tevreden met de uitkomst, ik heb veel geleerd en heb ook weer een hoop inspiratie opgedaan om 
verder te gaan.
