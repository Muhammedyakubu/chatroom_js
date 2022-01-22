//const SERVER = "http://localhost:8080";
const SERVER = "https://my-chatarena.herokuapp.com";

const socket = io(SERVER, {
	autoConnect: false,
});

const main = document.querySelector("#main-doc");

const pages = {
	login: `
	<h1 class="header">Welcome to Chat<span>Room!</span></h1>
        <div id="flash-box"></div>
        <form id="login" class="container">
            <label for="name-input">Name</label><br>
            <input type="text" id="name-input" placeholder="your name here..."><br>
            <button id="set-name">set username</button>
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

//===========EVENT LISTENERS=============//

let username;

window.onload = () => {
	username = localStorage.getItem("username");
	authenticateUser(username);
};

document.addEventListener("click", e => {
	let input;
	e.preventDefault();
	switch (e.target.id) {
		case "set-name": //login button
			input = document.querySelector("#name-input");
			username = input.value;
			createUser(username);
			break;

		case "sign-out":
			localStorage.setItem("username", null);
			username = "";
			socket.disconnect();
			loadPage("login");
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
function authenticateUser(username) {
	if (!username || username == "null" || username == "undefined") {
		loadPage("login");
	} else {
		fetch(SERVER + "/api/users/" + username)
			.then(res => {
				if (res.ok) {
					console.log("fetch Successful");
					loadPage("chat");
				} else {
					console.log("fetch not successful");
					loadPage("login");
				}
				console.log("res:", res);
				return res.json();
			})
			.then(data => {
				console.log("data:", data);
				data ? socket.connect() : loadPage("login");
			})
			.catch(err => {
				console.log(err);
				loadPage("err503");
			});
	}
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
		loadPage("login");
	} else {
		//open the socket -> which also creates a new user
		loadPage("chat");
		socket.connect();
	}

	//=>later I'll change to using a post method

	//create a new user with a post request. If there is, connect
	//then resirect to chats page
}

//=> This us an unused function
function verifyUser(username) {
	if (!username || username == "null" || username == "undefined") {
		//load login page
		loadPage("login");

		//could move all this logic to the backend
		let message;
		if (users.includes(username)) {
			//change this to an api call that checks for the user
			message = "Username exsists!! Please choose something else";
		} else if (username == "null") {
			message = "Invalid username!! Please choose something else";
		} else {
			message = "Hey there! Please select your username";
		}
		localStorage.setItem("username", username);
	}
}

function loadPage(pageName) {
	for (const page in pages) {
		if (pageName === page) main.innerHTML = pages[pageName];
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