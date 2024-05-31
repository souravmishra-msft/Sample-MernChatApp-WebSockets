const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require("cors");


const app = express();
const server = http.createServer(app);

/** Middlewares */
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
});

/** Store connected clients */
const connectedClients = {};

/** Listen to events */
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Store the socket connection
    connectedClients[socket.id] = socket;

    /** Listen to event "send_message"  */
    socket.on("send_message", (data) => {
        console.log(data);
        /** send the data to the frontend */
        socket.broadcast.emit("receive_message", { message: data.message, id: socket.id });
    });

    // Handle disconnection
    socket.on("disconnect", (reason) => {
        console.log(`User Disconnected: ${socket.id} - Reason: ${reason}`);
        // Remove the socket connection from the stored list
        delete connectedClients[socket.id];
    });

    // Handle connection errors and timeouts
    socket.on("connect_error", (error) => {
        console.log(`Connection Error: ${error.message}`);
    });

    socket.on("connect_timeout", () => {
        console.log(`Connection Timeout for: ${socket.id}`);
    })
});

server.listen(3001, () => {
    console.log(`Server is running.....`);
});