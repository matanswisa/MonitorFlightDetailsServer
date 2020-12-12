const express = require('express');
const prompt = require('prompt-sync')({ sigint: true });
const pressAnyKey = require('press-any-key');
const FlightCords = require('./classes/FlightCords');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const PORT = 8080;
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});





function sendHeartbeat(){
    setTimeout(sendHeartbeat, 8000);
    io.sockets.emit('ping', { beat : 1 });
}




io.on("connection",  socket => {
    console.log(`new client: ${socket.client.id}`);


      socket.on('requestingCords', () => {
        console.log('requesting data for:' + socket.client.id);
        inputFlightCords(socket);
    });

    socket.on('disconnect', () => {
        console.log(`socket disconnected:${socket.client.id}`);
    })
});



server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})


const inputFlightCords = async (socket) => {

    let altitude = prompt('altitude:');
    let his = prompt('his:');
    let adi = prompt('adi:');

    let flightCords = new FlightCords(altitude, his, adi);
    await pressAnyKey("Press any key", {
        ctrlC: "reject"
    }).then(() => {
        console.log('Sending data');
        socket.emit('cords', flightCords , {beat:1});
    })
        .catch(() => {
            console.log('You pressed CTRL+C')
        })
}