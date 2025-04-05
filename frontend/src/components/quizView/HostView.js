import React, { useState, useEffect } from "react";
import { Button, QRCode, Card, List } from 'antd';
import useTimer from "../../hooks/useTimer";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import {CloseCircleOutlined} from '@ant-design/icons';
import '../../CSS/Participant.css';
import BASE_URL from "../../context/quizContext";


const socket = io(`${BASE_URL}` , {
  transports: ["websocket"], // Prevents polling issues
  withCredentials: true
});



function HostView({ quiz, questions, quizCode }) {
  const quizJoinLink = `https://quiz-project-frontend-dyul.onrender.com/view/${quiz._id}`;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [isMidQuestion, setIsMidQuestion] = useState(false);
  const [timeLeft, setTimeLeft] = useTimer(5, () => setIsMidQuestion(false));
  const [isStarted, setIsStarted] = useState(false);
  const navigate = useNavigate();
  
  const [players, setPlayers] = useState([]); 
  const [fastestPlayers, setFastestPlayers] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(true); 
  const [adjustableTime, setAdjustableTime] = useState(5);
  

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
  
  const handleTimeChange = (amount) => {
    setAdjustableTime((prevTime) => Math.max(1, prevTime + amount)); // Ensure time doesn't go below 1
  };

  //change this logic 
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      //logic for last question
      
      // Emit the next question first
      console.log("Sending next question:", questions[newIndex]);
      console.log("Correct answer:", questions[newIndex].correctAnswer);
      socket.emit("next_question", { quizId: quiz._id, newIndex, correctAnswer: questions[newIndex].correctAnswer, time: adjustableTime });
  
      // Update the state for the new question
      setCurrentQuestionIndex(newIndex);
      setIsMidQuestion(true); // Start the timer phase
      setTimeLeft(adjustableTime); // Reset timer
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

  const exitQuiz = () => {
    // socket.emit("end_quiz", { quizId: quiz._id });
    // setPlayers([]);
    // setCurrentQuestionIndex(-1);
    // setIsStarted(false);
    navigate("/");
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

            <h2>
              {currentQuestionIndex + 1 === questions.length
                ? "Quiz Completed"
                : `Question ${currentQuestionIndex + 2} of ${questions.length}`}
            </h2>
            
            <p>
              {currentQuestionIndex + 1 === questions.length
                ? null
                : `Current Question: ${questions[currentQuestionIndex + 1]?.questionText}`}
            </p>

            <div className="time-adjustment">
              <Button id="plusButton" onClick={() => handleTimeChange(-1)}>-</Button>
              <p>Time: {adjustableTime} seconds</p>
              <Button id="minusButton" onClick={() => handleTimeChange(1)}>+</Button>
            </div>
          
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
                    renderItem={(player, index) => (
                      <List.Item>
                        <List.Item.Meta
                          title={<span style={{ color: "white" }}>{index+1}. {player.name}</span>}
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
                    renderItem={(player, index) => (
                      <List.Item>
                        <List.Item.Meta title={<span style={{ color: "white" }}>{index+1}. {player}</span>}/>
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
            <div className="exitButtonContainer">
              <Button id="ExitButton" onClick={exitQuiz} icon={<CloseCircleOutlined />} />
            </div>
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
