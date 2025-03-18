import React, { useState, useEffect } from "react";
import { Button, QRCode, Card, List } from 'antd';
import useTimer from "../../hooks/useTimer";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");



function HostView({ quiz, questions,}) {
  const quizJoinLink = `http://localhost:3000/join/${quiz.id}`;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [isMidQuestion, setIsMidQuestion] = useState(false);
  const [timeLeft, setTimeLeft] = useTimer(5, () => setIsMidQuestion(false));
  const [isStarted, setIsStarted] = useState(false);
  
  const [players, setPlayers] = useState([]); 
  


  useEffect(() => {
    socket.on("update_players", ({ quizId, players }) => {
      
      // Format player data into an array
      const formattedPlayers = Object.entries(players || {}).map(([name, score]) => ({
        name: name,
        score: score || 0
      }));

      setPlayers(formattedPlayers);
      console.log("Updated players state:", formattedPlayers);
    });
    socket.on("end_quiz", () => {
      setPlayers([]); // Reset players on quiz end
      setCurrentQuestionIndex(-1);
      setIsStarted(false);
    });
    
    
  
    return () => {
      socket.off("update_players");
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
      socket.emit("next_question", { quizId: quiz._id, newIndex });
  
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
            <Button onClick={handleEndClick} type="primary" id="EndButton">End Quiz</Button>
            <Button onClick={handleNextQuestion} type="primary" id="NextButton">Next Question</Button>
            <h1>{quiz.title}</h1>

            <h2>Question {currentQuestionIndex + 2} of {questions.length}</h2>

            <p>{questions[currentQuestionIndex + 1]?.questionText}</p>


          
            {/* leaderboard */}
            <Card id="leaderboardCard" title="Leaderboard">
            {players.length > 0 ? (
              <List
                dataSource={players}
                renderItem={(player) => (
                  <List.Item >
                    <strong>{player.name}</strong> - {player.score} points
                  </List.Item>
                )}
              />
            ) : (
              <p>No players have joined.</p>
            )}
            </Card>
            

          </div>
        )
      ) : (
        <div className="host-preQuiz">
          <h1>{quiz.title}</h1>
          <h2>Quiz Code - {/* quiz code logic */}</h2>
          <div className="qr-code">
            <QRCode value={quizJoinLink} size={200} />
          </div>
          <Button type='primary' onClick={startQuiz}>Start Quiz</Button>

          <Card id="playersCard" title="Current Players">
            {players.length > 0 ? (
              <List
                dataSource={players}
                renderItem={(player) => (
                  <List.Item key={player.id}>
                    <strong>{player.name}</strong>
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