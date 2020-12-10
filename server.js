const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const PORT = 8080;
const server = http.createServer(app);
const io = socketIo(server,{
    cors:{
        origin:'*',
    }
});

io.on("connection", socket=>{
    console.log(`new client: ${socket.client.id}`);


    socket.emit('output',{data:'hello'});

    socket.on('disconnect' , ()=>{
        console.log(`socket disconnected:${socket.client.id}`);
    })
})


server.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})
