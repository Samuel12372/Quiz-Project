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
const User = require('./Models/UserModel');


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
  let answer = "";
  let answerOrder = {}; // Tracks answer times for each quiz
  const answerSubmissions = {}; // Tracks answer submissions for each quiz

  
io.on("connection", (socket) => {
    //console.log("A user connected");

    socket.on("join_quiz", ({ quizId, playerName, userId }) => {
        if (!quizId || !playerName) return;

        console.log(userId);

        if (!players[quizId]) {
            players[quizId] = {};
        }

        players[quizId][playerName] = { score: 0, userId: userId || null }; // Initialize player with a score of 0
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

    socket.on("next_question", ({ quizId, newIndex, correctAnswer }) => {
        console.log(newIndex);
        console.log(correctAnswer);
        answer = correctAnswer;
        io.emit("next_question", {newIndex});
    });


    socket.on("end_quiz", async ({quizId}) => {
        io.emit("end_quiz", { quizId });

        if (players[quizId]) {
            // Sort players by score
            const sortedPlayers = Object.entries(players[quizId]).map(([playerName, playerData]) => {
                return {
                    playerName,
                    userId: playerData.userId,
                    score: scores[quizId][playerName] || 0 // Get score from scores object
                };
            }).sort((a, b) => b.score - a.score);
            console.log(sortedPlayers);

            // Award points based on place
            const numPlayers = sortedPlayers.length; // 1st, 2nd, 3rd place points
            for (let i = 0; i < sortedPlayers.length; i++) {
                const { playerName, userId, score } = sortedPlayers[i]; // ✅ Fix applied
                const point = numPlayers - i; // Default to 1 point if not in top 3

                if (userId) {
                    try {
                        await User.findByIdAndUpdate(userId, { $inc: { points: point } });
                        console.log(`Updated user ${userId} with ${point} points.`);
                    } catch (error) {
                        console.error("Error updating user points:", error);
                    }
                }
            }

            delete players[quizId];
        }
        if (scores[quizId]) delete scores[quizId];

        console.log(`Quiz ${quizId} ended. Players and scores removed.`);
        io.emit("update_players", { quizId, players: {} });
    });

    socket.on("request_players", (quizId) => {
        if (players[quizId]) {
            socket.emit("update_players", { quizId, players: players[quizId] });
        }
    });

    socket.on("submit_answer", ({ quizId, playerName, option }) => {
        if (!quizId || !playerName || !option) return;
    
        console.log(`Answer received from ${playerName}: ${option}`);
    
        if (!answerSubmissions[quizId]) {
            answerSubmissions[quizId] = {};
        }
        
        if (!scores[quizId]) {
            scores[quizId] = {};
        }
        if (!scores[quizId][playerName]) {
            scores[quizId][playerName] = 0;
        }
    
        // Store the submission time and option
        answerSubmissions[quizId][playerName] = { option, time: Date.now() };
    
        // Check if all players have submitted
        const playersCount = Object.keys(players[quizId] || {}).length;
        const submissionsCount = Object.keys(answerSubmissions[quizId]).length;
    
        if (submissionsCount >= playersCount) {
            // Process all answers at once
            let answerOrder = [];
    
            Object.entries(answerSubmissions[quizId]).forEach(([player, { option, time }]) => {
                if (option === answer) {
                    scores[quizId][player] += 10; // Base points
                    answerOrder.push({ playerName: player, time }); // Track speed for bonus
                }
            });
    
            // Sort players by response time
            answerOrder.sort((a, b) => a.time - b.time);
    
            // Award bonus points to the 3 fastest correct players
            const bonusPoints = [5, 3, 1];
            for (let i = 0; i < 3; i++) {
                if (answerOrder[i]) {
                    const fastestPlayer = answerOrder[i].playerName;
                    scores[quizId][fastestPlayer] += bonusPoints[i];
                }
            }
    
            // Emit final scores and fastest players
            io.emit("update_scores", { quizId, scores: scores[quizId] });
            io.emit("fastest_players", { quizId, fastestPlayers: answerOrder.slice(0, 3).map(entry => entry.playerName) });
    
            // Reset submissions for the next question
            delete answerSubmissions[quizId];
        }
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