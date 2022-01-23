//const SERVER = "http://localhost:8080";
const SERVER = "https://my-chatarena.herokuapp.com";

const socket = io(SERVER, {
	autoConnect: false,
});

const main_doc = document.querySelector("#main-doc");

const pages = {
	login: `
	<h1 class="header">Welcome to Chat<span>Room!</span></h1>
	<div id="flash-box"></div>
	<form id="login" class="container center-modal">
		<label for="name-input">Name</label><br>
		<input type="text" id="name-input" placeholder="your name here..."><br>
		<button id="login-button">Login</button><br/>
		<a href="#" onclick="loadPage('register')">Register</a>
	</form>
	`,
	register: `
	<h1 class="header">Welcome to Chat<span>Room!</span></h1>
	<div id="flash-box"></div>
	<form id="register" class="container center-modal">
		<label for="name-input">Name</label><br>
		<input type="text" id="name-input" placeholder="your name here..."><br>
		<button id="register-button">Register</button><br/>
        <a href="#" onclick="loadPage('login')">Login</a>
	</form>
	`,
	home: `
	<h1 class="header">Welcome to Chat<span>Room!</span></h1>
	<div id="flash-box"></div>
	<form id="home" class="container center-modal">
		<button onclick="loadPage('login')">Login</button>
		<button onclick="loadPage('register')">Register</button>
	</form>	
	`,
	chat: `
	<div class="content">
		<nav>
			<h1 class="header">Chat<span>Room</span></h1>
			<button id="sign-out">Sign Out</button>
		</nav>
		
		<div class="messages-container">
			
		</div>

		<form id="send-container">
			<input type="text" id="message-input" placeholder="new message...">
			<button id="send-button">send</button>
		</form>
	</div>`,
	err503: `
  <p class="error">I'm sorry, something went wrong :( </p><br/>
  <button onclick="loadPage('login')">Login</button>`,
};

//===========MAIN==============//

let username;

async function main(){
	username = localStorage.getItem("username");
	const auth = await authenticateUser(username)
	if (auth) {
		console.log(auth)
		loadPage('chat')
		socket.connect()
	} else {
		loadPage('home')
	}
}

window.onload = main

//===========EVENT LISTENERS=============//

document.addEventListener("click", e => {
	let input;
	e.preventDefault();
	switch (e.target.id) {
		case "register-button": //login button
			input = document.querySelector("#name-input");
			username = input.value;
			createUser(username);
			break;

		case "login-button": //login button
			input = document.querySelector("#name-input");
			username = input.value;
			signUserIn(username);
			break;

		case "sign-out":
			username = null;
			localStorage.setItem("username", username);
			socket.disconnect();
			loadPage("home");
			break;

		case "send-button":
			input = document.querySelector("#message-input");
			const chat = {
				content: input.value,
				sentBy: username,
				timeSent: Date.now(),
			};
			socket.emit("message", JSON.stringify(chat));
			input.value = "";
			break;
	}
});

//=================HELPER FUNCTIONS=================//
/**
 * @param {string} username
 */
async function authenticateUser(username) {
	if (!username || username == "null" || username == "undefined") {
		console.log("returning false");
		return false;
	} else {
		const user = await fetchUser(username)
		return user
	}
}

async function signUserIn(username){
	const legit = await authenticateUser(username)
	console.log(legit);
	if (legit) {
		loadPage('chat')
		socket.connect()
		alertAction(null, "Logged in as " + username)
	} else {
		loadPage('login')
		flash(`User ${username} does not exist`)
	}
}

function flash(message){
	const el = document.createElement("div")
	el.innerHTML = message
	document.querySelector("#flash-box").appendChild(el)
	setTimeout(() => el.remove(), 4000)
}

async function fetchUser(username){
	const res = await fetch(SERVER + "/api/users/" + username)
	if (res.ok) {
		console.log("fetch Successful, returning user");
		const user = await res.json()
		return user
	} else if (res.status == 400) {
		console.log(await res.json());
		return false
	}
	res.catch(err => {
		console.log(err)
	});
}

/**
 * @param {string} username
 */
function createUser(username) {
	console.log("This is going to create a new user with name:", username);
	//=>for now I'll use the sockets to create the user

	//check that the username is valid
	if (!username || username == "null" || username == "undefined") {
		console.log("Invalid/Empty Username");
		loadPage("register");
		flash("Invalid Username")
	} else {
		//open the socket -> which also creates a new user
		loadPage("chat");
		socket.connect();
		flash("Welcome " + username);
	}

	//=>later I'll change to using a post method

	//create a new user with a post request. If there is, connect
	//then resirect to chats page
}


/**
 * @param {string} pageName
 */
function loadPage(pageName) {
	for (const page in pages) {
		if (pageName === page) main_doc.innerHTML = pages[pageName];
	}
}

function alertAction(user, action) {
	const el = document.createElement("h5");
	if (user) {
		el.innerHTML = (user == username ? "You" : user) + " " + action;
	} else {
		el.innerHTML = action;
	}
	console.log(el.innerHTML);
	el.classList.add("alert");
	document.querySelector(".messages-container").append(el);
	el.scrollIntoView();
}

function appendMessage(chat) {
	const el = document.createElement("div");
	el.innerHTML = `<h6>${chat.sentBy == username ? "You" : chat.sentBy}</h6>
    <p>${chat.content}</p>
    <h6>${new Date(chat.timeSent).toLocaleTimeString()}</h6>`;
	el.classList.add("message");
	el.classList.add(chat.sentBy === username ? "sent" : "received");
	document.querySelector(".messages-container").appendChild(el);
	el.scrollIntoView();
}

//==========SOCKET CONTROLLERS=========//

socket.on("connect", () => {
	console.log(socket.id, username);
	localStorage.setItem("username", username);
	socket.emit("new-user", username);
});

socket.on("load-messages", chats => {
	chats.forEach(message => appendMessage(message));
});

socket.on("message", packet => {
	const chat = JSON.parse(packet);
	appendMessage(chat);
});

socket.on("user-connected", user => {
	alertAction(user, "joined");
});

socket.on("user-disconnected", user => {
	alertAction(JSON.parse(user).username, "left");
});