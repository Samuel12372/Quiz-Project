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

const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
});
  
  let players = {};
  let scores = {};

  
io.on("connection", (socket) => {
    //console.log("A user connected");

    socket.on("join_quiz", ({ quizId, playerName }) => {
        if (!quizId || !playerName) return;

        if (!players[quizId]) {
            players[quizId] = {};
        }

        players[quizId][playerName] = { score: 0 }; // Initialize player with a score of 0
        io.emit("update_players", { quizId, players: players[quizId] });
       
    });
    socket.on("leave_quiz", ({ quizId, playerName }) => {
        if (players[quizId]) {
            delete players[quizId][playerName]; // Remove player from list
        }
        if (scores[quizId]) {
            delete scores[quizId][playerName]; // Remove score
        }
    
        console.log(`Player ${playerName} left quiz ${quizId}`);
    
        io.emit("update_players", { quizId, players: players[quizId] || {} });
    });

    socket.on("start_quiz", (quizId) => {
        io.emit("quiz_started", quizId);
    });

    socket.on("next_question", ({ quizId, newIndex }) => {
        console.log(newIndex);
        io.emit("next_question", {newIndex});
    });


    socket.on("end_quiz", ({quizId}) => {
        io.emit("end_quiz", { quizId });

        if (players[quizId]) delete players[quizId];
        if (scores[quizId]) delete scores[quizId];

        console.log(`Quiz ${quizId} ended. Players and scores removed.`);
        
        io.emit("update_players", { quizId, players: {} });
    });

    socket.on("request_players", (quizId) => {
        if (players[quizId]) {
            socket.emit("update_players", { quizId, players: players[quizId] });
        }
    });

    socket.on("submit_answer", ({ }) => {

    });

    socket.on("disconnect", () => {
        
    });
});

connectDB();

app.use(cors());
app.use(express.json());
app.use('/', quizzes, users); 




server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 