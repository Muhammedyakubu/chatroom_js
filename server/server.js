const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
	cors: {
		origin: "*",
	},
});
const port = process.env.PORT || 8080;
const cors = require("cors");

const { mock_users, mock_chats, mock_active_users } = require("./mock_data");
const { Socket } = require("socket.io-client");

app.use(cors());

//==================API ENDPOINTS================//

app.get("/api/chats/", (req, res) => {
	res.json(mock_chats);
});

app.post("/api/users/", (req, res) => {
	//this will not exist for MVP because there are no passwords
	let user = getUserByName(req.body.username);
	if (!user) {
		//if a corresponsing user is found in the database
		res.status(400).json({ error: "User already exists" });
	} else {
		user = {
			id: Date.now(),
			username: req.body.username,
		};
		mock_users.push(user);
		res.status(202).json({ success: "User added successfully" });
	}
});

app.get("/api/users/:username", (req, res) => {
	console.log("query made for", req.params.username);
	const user = getUserByName(req.params.username);
	if (user) {
		console.log(user.username + "exists");
		res.status(201).json(user);
	} else {
		console.log(`${req.params.username} does not exist`);
		res.status(400).json({ error: "No user found" });
	}
});

//TODO: Implement the following endpoints
app.post("api/login/");
app.post("api/users/:username/"); //to modify username data
app.post("api/register/");

//=================IO CONTROLLER===================//

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);
	socket.emit("load-messages", mock_chats);

	socket.on("new-user", (username) => {
		io.emit("user-connected", username);

		user = getUserByName(username);
		if (!user) {
			user = {
				user_id: Date.now(),
				username: username,
			};
			mock_users.push(user);
		}

		mock_active_users[socket.id] = user;
		console.log("new user in chat: ", user);
	});

	socket.on("message", (chat) => {
		console.log(JSON.parse(chat));
		mock_chats.push(JSON.parse(chat)); //this will be updated to a database that stores the chat after each message event
		io.emit("message", chat);
	});

	socket.on("disconnect", () => {
		io.emit(
			"user-disconnected",
			JSON.stringify(mock_active_users[socket.id])
		);
		delete mock_active_users[socket.id];
	});
});

//==================HELPER FUNCTIONS====================//

function getUserByName(username) {
	const user = mock_users.find((e) => e.username === username);
	if (user == -1) return false;
	else return user;
}

http.listen(port, () => console.log("listening on http://localhost:" + port));

// storing chats in DB - to be implemented
/* const mongoose = require('mongoose')
const chatSchema = new mongoose.Schema({
    content: String,
    sentBy: String,
    timeSent: String
}); */
