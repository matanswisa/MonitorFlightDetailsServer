const express = require('express');
const prompt = require('prompt');
const FlightCords = require('./classes/FlightCords');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const PORT = 8080;
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    },
});

var schema = {
    properties: {
        Altitude: {
            conform: function(input) {
                return input >= 0 && input <= 3000;
            },
            message: "Altitude must be in range of 0 to 3000",
            required: true
        },
        HIS: {
            conform: function(input) {
                return input >= 0 && input <= 360;
            },
            message: "HIS must be in range of 0 to 360",
            required: true
        },
        ADI: {
            conform: function(input) {
                return input >= -100 && input <= 100;
            }, 
            message: "ADI must be in range of -100 to 100",
            required: true
        }
    }
}; 

prompt.start();

/**
 * Asking input from the command line.
 * After the given input , the function will create a FlightCords instance and return it from promise resolve.
 */
const getFlightCordsByInput = () => {
    return new Promise((resolve, reject) => {
        prompt.get(schema, function (err, result) {
            if (err) {
                console.log(err);
                reject();
            }
            else {
                resolve(new FlightCords(result.Altitude, result.HIS, result.ADI));
            }
        });
    })
}

/**
 * Waiting for client connection.
 * Responsible to run the input function when a client is connected.
 */
io.on("connection", async (socket) => {
    console.log(`new client: ${socket.client.id}`);
    socket.on("disconnect", (reason) => {
        console.log(`socket disconnected: ${socket.client.id} , reason: ${reason}`);
    });
    while (true) {
        let flightCords = await getFlightCordsByInput();
        socket.emit('sendCordsToClient',flightCords);
    }
});


server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

