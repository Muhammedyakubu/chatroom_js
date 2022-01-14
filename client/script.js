const socket = io('http://localhost:8080');

const messageContainer = document.querySelector('.messages-container')

let username = prompt('What is your name?')
while (!username) username = prompt('What is your name?')

/*window.onload = () => {
    const auth = checkIfLoggedIn()
    if (!auth) {
        setUsername()
    }
} */



function alertAction (user, action) {
    const el = document.createElement('h5')
    el.innerHTML = (user == username? "You" : user) + " " + action;
    console.log(el.innerHTML)
    el.classList.add('alert','new-user')
    messageContainer.append(el)
    el.scrollIntoView()
}

function appendMessage(chat) {
    const el = document.createElement('div')
    el.innerHTML = 
    `<h5>${chat.sentBy == username? "You": chat.sentBy}</h5>
    <p>${chat.content}</p>
    <h6>${chat.timeSent}</h6>`
    el.classList.add("message")
    el.classList.add( chat.sentBy === username ? "sent": "received")
    messageContainer.appendChild(el)
    el.scrollIntoView()
}

socket.on("connect", () => {
    console.log(socket.id, username); 
    socket.emit('new-user', username)
  });

socket.on('message', packet => {
    const chat = JSON.parse(packet)
    appendMessage(chat)
});

socket.on('user-connected', user => {
    alertAction(user, 'joined')
})

socket.on('user-disconnected', user => {
    alertAction(user, 'left')
})

document.querySelector('#send-button').onclick = (e) => {
    e.preventDefault()
    const input = document.querySelector('#message-input');
    const chat = {
        content: input.value,
        sentBy: username,
        timeSent: new Date
    }
    socket.emit('message', JSON.stringify(chat))
    input.value = ""
}

