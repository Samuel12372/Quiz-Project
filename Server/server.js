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
        if (!players[quizId]) players[quizId] = [];
        if (!scores[quizId]) scores[quizId] = {};

        players[quizId].push(playerName);
        scores[quizId][playerName] = 0;

        io.emit("update_players", players[quizId]);
    });

    socket.on("start_quiz", (quizId) => {
        io.emit("quiz_started", quizId);
    });

    socket.on("next_question", ({ quizId, newIndex }) => {
        console.log(newIndex);
        io.emit("next_question", {newIndex});
    });

    socket.on("submit_answer", ({ quizId, playerName, answer, questionIndex }) => {
        // Validate answer and update score
        const correctAnswer = getCorrectAnswer(quizId, questionIndex);
        if (answer === correctAnswer) {
        scores[quizId][playerName] += 10; // Add points for correct answer
        }

        io.emit("update_scores", scores[quizId]);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

connectDB();

app.use(cors());
app.use(express.json());
app.use('/', quizzes, users); 




server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 