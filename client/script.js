const SERVER = "http://localhost:8080";
const socket = io(SERVER, {
	autoConnect: false,
});

const messageContainer = document.querySelector(".messages-container");
const loginModal = document.querySelector("#login");
const main = document.querySelector("#main-doc");
const signOut = document.querySelector("#sign-out");

pages = {
	login: `
	<form id="login" class="container">
        <label for="name-input">Name</label><br>
        <input type="text" id="name-input" placeholder="your name here..."><br>
        <button id="set-name">set username</button>
    </form>
	`,
	chat: `
	<div class="content">
            <div class="messages-container">
                <button id="sign-out">Sign Out</button>
            </div>
    
            <form id="send-container">
                <input type="text" id="message-input" placeholder="new message...">
                <button id="send-button">send</button>
            </form>
	</div>`,
};

document.addEventListener('click', (e) => {
  let input;
  e.preventDefault();
  switch (e.target.id) {
    case "set-name":
      input = document.querySelector("#name-input");
      username = input.value;
      break;

    case "sign-out":
      localStorage.setItem("username", null);
	    //location.reload();  
      break;

    case "send-button":
      input = document.querySelector("#message-input");
      const chat = {
        content: input.value,
        sentBy: username,
        timeSent: Date.now().toString(),
      };
      socket.emit("message", JSON.stringify(chat));
      input.value = "";
      break;
  }
})

loadPage("chat");

let username;
/* window.onload = () => {
	username = JSON.parse(localStorage.getItem("username"));
	while (!username || username == "null") {
		//check username
		if (users.includes(username)) {
			//change this to an api call that checks for the user
			username = prompt(
				"Username exsists!! Please choose something else"
			);
		} else if (username == "null") {
			username = prompt(
				"Invalid username!! Please choose something else"
			);
		} else {
			username = prompt("Hey there! Please select your username");
		}
		localStorage.setItem("username", JSON.stringify(username));
	}
	socket.connect();
}; */

function loadPage(page) {
	switch (page) {
		case "login":
      console.log( `loaded ${page} page`);
			main.innerHTML = pages.login;
			break;
		case "chat":
      console.log( `loaded ${page} page`);
			main.innerHTML = pages.chat;
			break;
		default:
      //console.log(page);
			main.innerHTML = pages.login;
	}
}

function alertAction(user, action) {
	const el = document.createElement("h5");
	el.innerHTML = (user == username ? "You" : user) + " " + action;
	console.log(el.innerHTML);
	el.classList.add("alert");
	messageContainer.append(el);
	el.scrollIntoView();
}

function appendMessage(chat) {
	const el = document.createElement("div");
	el.innerHTML = `<h5>${chat.sentBy == username ? "You" : chat.sentBy}</h5>
    <p>${chat.content}</p>
    <h6>${new Date(chat.timeSent).toLocaleTimeString()}</h6>`;
	el.classList.add("message");
	el.classList.add(chat.sentBy === username ? "sent" : "received");
	messageContainer.appendChild(el);
	el.scrollIntoView();
}

function loadMessages() {
  //query api endpoint 
  chats.forEach( chat => appendMessage(chat));
}

socket.on("connect", () => {
	console.log(socket.id, username);
	socket.emit("new-user", username);
});

socket.on("message", (packet) => {
	const chat = JSON.parse(packet);
	appendMessage(chat);
});

socket.on("user-connected", (user) => {
	alertAction(user, "joined");
});

socket.on("user-disconnected", (user) => {
	alertAction(user, "left");
});

/* document.querySelector("#send-button").onclick = (e) => {
	e.preventDefault();
	const input = document.querySelector("#message-input");
	const chat = {
		content: input.value,
		sentBy: username,
		timeSent: Date.now().toString(),
	};
	socket.emit("message", JSON.stringify(chat));
	input.value = "";
}; */


