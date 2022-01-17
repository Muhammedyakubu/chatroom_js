const SERVER = "http://localhost:8080"
const socket = io(SERVER);

const messageContainer = document.querySelector(".messages-container");
const loginModal = document.querySelector("#login");
const content = document.querySelector(".content");
const signOut = document.querySelector("#sign-out");


let users = [];

let username;
window.onload = () => {
	username = JSON.parse(localStorage.getItem("username"));
	while (!username || username == "null") {
		//check username
		if (users.includes(username)) {
			username = prompt(
				"Username exsists!! Please choose something else"
			);
		} else if (username == "null") {
			username = prompt(
				"Invalid username!! Please choose something else"
			);
		} else {
			username = prompt("Hey there! What's your name");
		}
		localStorage.setItem("username", JSON.stringify(username));
	}
};

signOut.addEventListener("click", () => {
	localStorage.setItem("username", null);
	location.reload();
});

loginModal.addEventListener("submit", (e) => {
	e.preventDefault();
	const input = document.querySelector("#name-input");
	username = input.value;
	loginModal.classList.toggle("hidden");
	content.classList.toggle("hidden");
});

function login() {
	loginModal.classList.toggle("hidden");
	content.classList.add("hidden");
}

function alertAction(user, action) {
	const el = document.createElement("h5");
	el.innerHTML = (user == username ? "You" : user) + " " + action;
	console.log(el.innerHTML);
	el.classList.add("alert", "new-user");
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

document.querySelector("#send-button").onclick = (e) => {
	e.preventDefault();
	const input = document.querySelector("#message-input");
	const chat = {
		content: input.value,
		sentBy: username,
		timeSent: Date.now().toString(),
	};
	socket.emit("message", JSON.stringify(chat));
	input.value = "";
};
