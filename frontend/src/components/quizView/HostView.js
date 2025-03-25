import React, { useState, useEffect } from "react";
import { Button, QRCode, Card, List } from 'antd';
import useTimer from "../../hooks/useTimer";
import { io } from "socket.io-client";
import '../../CSS/Participant.css';

const socket = io("http://localhost:8080");



function HostView({ quiz, questions, quizCode }) {
  const quizJoinLink = `http://localhost:3000/join/${quiz.id}`;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [isMidQuestion, setIsMidQuestion] = useState(false);
  const [timeLeft, setTimeLeft] = useTimer(5, () => setIsMidQuestion(false));
  const [isStarted, setIsStarted] = useState(false);
  
  const [players, setPlayers] = useState([]); 
  const [fastestPlayers, setFastestPlayers] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(true); 
  

  useEffect(() => {
    socket.on("update_players", ({ quizId, players }) => {
      
      // Format player data into an array
      const formattedPlayers = Object.entries(players || {}).map(([name, details]) => ({
        name: name,
        score: details.score || 0
      }));

      setPlayers(formattedPlayers);
      console.log("Updated players state:", formattedPlayers);
    });

    socket.on("end_quiz", () => {
      setPlayers([]); // Reset players on quiz end
      setCurrentQuestionIndex(-1);
      setIsStarted(false);
    });

    socket.on("update_scores", ({ quizId, scores }) => {
      console.log("Received updated scores:", scores);
      // Update the players state with the new scores
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => ({
          ...player,
          score: scores[player.name] || player.score,
        }))
      );
    });

    socket.on("fastest_players", ({ quizId, fastestPlayers }) => {
      console.log("Received fastest players:", fastestPlayers);
      setFastestPlayers(fastestPlayers);
      
    });
    
    return () => {
      socket.off("update_players");
      socket.off("end_quiz");
      socket.off("fastest_players");
      socket.off("end_quiz");
    };
  }, []);

  useEffect(() => {
    socket.emit("request_players", quiz._id);
  }, [quiz._id]);
  
  //change this logic 
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      //logic for last question
      
      // Emit the next question first
      console.log("Sending next question:", questions[newIndex]);
      console.log("Correct answer:", questions[newIndex].correctAnswer);
      socket.emit("next_question", { quizId: quiz._id, newIndex, correctAnswer: questions[newIndex].correctAnswer });
  
      // Update the state for the new question
      setCurrentQuestionIndex(newIndex);
      setIsMidQuestion(true); // Start the timer phase
      setTimeLeft(5); // Reset timer
    } else {
      socket.emit("end_quiz", { quizId: quiz._id });
      setPlayers([]);
      setCurrentQuestionIndex(-1);
      setIsStarted(false);
    }
    
  };
  

  const startQuiz = () => {
    setIsStarted(true);
    setFastestPlayers([]);
    socket.emit("start_quiz", { quizId: quiz._id }); 
    console.log(players);
  };

  const handleEndClick = () => {
    socket.emit("end_quiz", { quizId: quiz._id });
    setPlayers([]);
    setCurrentQuestionIndex(-1);
    setIsStarted(false);
  };




  return (
    <div className="hostView">
      {isStarted ? (
        isMidQuestion ? (
          <div className="quiz-started-host">
            <Button onClick={handleEndClick} type="primary" id="EndButton">End Quiz</Button>
            <h1>{quiz.title}</h1>

            <p>{questions[currentQuestionIndex]?.questionText}</p>
            
            {/* timer */}
            <p>Time left: {timeLeft} seconds</p>

          </div>
        ) : (
          <div className="quiz-started-host">
            <Button onClick={handleEndClick} type="primary" id="EndButton"><h2>End Quiz</h2></Button>
            <Button onClick={handleNextQuestion} type="primary" id="NextButton"><h2>Continue</h2></Button>
            <h1>{quiz.title}</h1>

            <h2>Question {currentQuestionIndex + 2} of {questions.length}</h2>
            
            <p>Current Question: {questions[currentQuestionIndex + 1]?.questionText}</p>


          
            {/* Merged Leaderboard and Fastest Players Card */}
            <Card className="leaderboardCard"> 
            <Button 
              type="primary" 
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              id="leaderboardButton"
            >
              <h2>{showLeaderboard ? "Leaderboard" : "Fastest Teams"}</h2>
            </Button>
              

              {showLeaderboard ? (
                players.length > 0 ? (
                  <List
                    className="leaderboardList"
                    dataSource={players.sort((a, b) => b.score - a.score)}
                    renderItem={(player) => (
                      <List.Item>
                        <List.Item.Meta
                          title={<span style={{ color: "white" }}>{player.name}</span>}
                          description={<span style={{ color: "white" }}>Score: {player.score}</span>}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <p>No players have joined.</p>
                )
              ) : (
                fastestPlayers.length > 0 ? (
                  <List
                    dataSource={fastestPlayers}
                    renderItem={(player) => (
                      <List.Item>
                        <List.Item.Meta title={<span style={{ color: "white" }}>{player}</span>}/>
                      </List.Item>
                    )}
                  />
                ) : (
                  <p>No fastest teams recorded.</p>
                )
              )}
            </Card>
            

          </div>
        )
      ) : (
        <div className="host-preQuiz">
          <h1>{quiz.title}</h1>

          <Card className="startCard" >
            <h2>Quiz Code - {quizCode}</h2>
            <div className="qr-code">
              <QRCode value={quizJoinLink} size={200} className="QR" fgColor="#000000" bgColor="#ffffff" />
            </div>
            <Button id="StartButton" type='primary' onClick={startQuiz}><h2>Start Quiz</h2></Button>
            <h2>Current Players</h2>
            {players.length > 0 ? (
              <List
                className="playerList"
                dataSource={players}
                
                renderItem={(player) => (
                  <List.Item key={player.id}>
                    <strong className="playerName">{player.name}</strong>
                  </List.Item>
                )}
              />
            ) : (
              <p>No players have joined.</p>
            )}
            </Card>
        </div>
      )}
    </div>
  );
}

export default HostView;