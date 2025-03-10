//run server - cd Server - node index.js
//open browser - http://localhost:8080/
//ctrl + c to stop server


require("dotenv").config(); 
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./DB/connection');
const quizzes = require('./Routes/Quizzes');
const users = require('./Routes/User');


const PORT = process.env.PORT;  
const app = express();
const server = http.createServer(app);

// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000", // Allow requests from any origin (change this in production)
//         methods: ["GET", "POST"]
//     }
// });

// // Handle socket connections
// io.on('connection', (socket) => {
//     //console.log(`User connected: ${socket.id}`);

//     // Example: Handle a custom event
//     socket.on('message', (data) => {
//         console.log(`Message received: ${data}`);
//         io.emit('message', data); // Broadcast message to all connected clients
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log(`User disconnected: ${socket.id}`);
//     });
// });

connectDB();

app.use(cors());
app.use(express.json());
app.use('/', quizzes, users); 



server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 