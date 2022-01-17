
/* 
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: { origin: "*" }
}); */
const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require("socket.io")(http, {
    cors: {
      origin: "*"
    }
  });
const port = process.env.PORT || 8080
const path = require('path')

app.set('view engine', 'ejs')

const users = {}
const activeUsers = ["Jay", "Shash", "Foo", "Bar"]

/* app.get('/api/chat', (req, res) => {
    res.status(200).send("Hello")
    res.send(chats)
}) */

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/../client', '/index.html'));
});

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
        delete users[socket.id]
    })
});

http.listen(port, () => console.log('listening on http://localhost:' + port) );

//creating storing chats
/* const mongoose = require('mongoose')
const chatSchema = new mongoose.Schema({
    content: String,
    sentBy: String,
    timeSent: String
}); */