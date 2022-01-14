
/* const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: { origin: "*" }
}); */

const http = require('http').createServer();
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

const users = {}

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('message', (chat) =>     {
        console.log(JSON.parse(chat));
        io.emit('message', chat);   
    });

    socket.on('new-user', user => {
        io.emit('user-connected', user);
        users[socket.id] = user
        console.log("new user: ", user)
    })

    socket.on('disconnect', () => {
        io.emit('user-disconnected', users[socket.id])
    })
});

http.listen(8080, () => console.log('listening on http://localhost:8080') );

//creating storing chats
/* const mongoose = require('mongoose')
const chatSchema = new mongoose.Schema({
    content: String,
    sentBy: String,
    timeSent: String
}); */