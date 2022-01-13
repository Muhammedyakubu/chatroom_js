const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('message', (message) =>     {
        console.log(message);
        const send = JSON.stringify({
            id: socket.id,
            message
        })
        io.emit('message', send);   
    });
});

http.listen(8080, () => console.log('listening on http://localhost:8080') );