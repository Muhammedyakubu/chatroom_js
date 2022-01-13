const socket = io('http://localhost:8080');

socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });

socket.on('message', packet => {
    const recv = JSON.parse(packet)
    const el = document.createElement('li');
    el.classList.add("message")
    el.classList.add( socket.id === recv.id ? "sent": "received")
    el.innerHTML = recv.id.substr(0,2) + ": " + recv.message;
    document.querySelector('.messages-container').appendChild(el)

});

document.querySelector('#send-button').onclick = (e) => {
    e.preventDefault()
    const input = document.querySelector('#message-input');
    socket.emit('message', input.value)
    input.value = ""
}

/* document.querySelector("#set-name").onclick = (e) => {
    e.preventDefault()
    const input = document.querySelector('#name-input')
    socket.username = input.value
} */