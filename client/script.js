//const SERVER = "http://localhost:8080";
const SERVER = "https://my-chatarena.herokuapp.com";

const socket = io(SERVER, {
	autoConnect: false,
});

const mainDoc = document.querySelector("#main-doc");

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

window.onload = () => {
	//hide the loader
	main()
}
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
			logUserIn(username);
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

async function logUserIn(username){
	if (username.length === 0){
		flash("Username cannot be empty");
		return;
	}
	const userExists = await authenticateUser(username)
	console.log(userExists);
	if (userExists) {
		loadPage('chat')
		socket.connect()
		flash(`Logged in as ${userExists.username}`)
	} else {
		loadPage('login')
		flash(`User ${username} does not exist`)
	}
}

function flash(message){
	const flashBox = document.querySelector("#flash-box");
	flashBox.innerHTML = message;
	/* const el = document.createElement('div')
	el.className = "flash-message"
	el.innerHTML = message
	flashBox.appendChild(el)
	console.log(flashBox); */
	setTimeout(() => flashBox.innerHTML = "", 3000)
}

async function fetchUser(username){
	const res = await fetch(SERVER + "/api/users/" + username)
	try {
		if (res.ok) {
			console.log("fetch Successful, returning user");
			const user = await res.json()
			return user
		} else if (res.status == 400) {
			console.log(await res.json());
			return false
		} else {
			return await res.json()
		}		
	} catch (error) {
		console.log(error);
	}
}

/**
 * @param {string} username
 */
function createUser(username) {
	console.log("creating a new user with name:", username);
	//=>for now I'll use the sockets to create the user

	//check that the username is valid
	if (username.length === 0){
		flash("Username cannot be empty");
		return;
	}
	if (!username || username == "null" || username == "undefined") {
		console.log("Invalid/Empty Username");
		loadPage("register");
		flash("Invalid Username")
	} else {
		//open the socket -> which also creates a new user
		loadPage("chat");
		socket.connect();
		flash(`Welcome ${username}!` );
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
		if (pageName === page) mainDoc.innerHTML = pages[pageName];
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