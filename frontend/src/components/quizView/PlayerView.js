import React, { useEffect, useState } from "react";
import { Button, Modal, Input } from 'antd';
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import useTimer from "../../hooks/useTimer";
import MCQ from '../MCQ'; // Import the MCQ component
import '../../CSS/Participant.css';

const socket = io("http://localhost:8080");

function PlayerView({ quiz, questions }) {

  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [playerName, setPlayerName] = useState();

  const [currentQuestion, setCurrentQuestion] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isMidQuestion, setIsMidQuestion] = useState(false);
  const [timeLeft, setTimeLeft] = useTimer(5, () => setIsMidQuestion(false));


  useEffect(() => {
    const playerName = localStorage.getItem("playerName");
    
    if (playerName) {
      setPlayerName(playerName);
      setIsModalVisible(false);

    }
    else {
      setIsModalVisible(true);
    }
  }, []);

  

  // Listen for the next question event from the host
  useEffect(() => {

    socket.on("next_question", ({ newIndex }) => {
      console.log("questions[newIndex]:", questions[newIndex])
      setCurrentQuestion(questions[newIndex]);
      setTimeLeft(5);
      setIsMidQuestion(true);
    });

    socket.on("quiz_started", () => {
      console.log("Quiz started");
      setIsStarted(true);
    });

    socket.on("end_quiz", () => {
      setIsStarted(false);
      localStorage.removeItem("playerName");
      setPlayerName();
      navigate("/");
    });

    return () => {
      socket.off("next_question");
      socket.off("quiz_started");
      socket.off("end_quiz");
    };
  }, [socket, questions]);

  const handleOk = () => {
    if (playerName.trim()) {
      setIsModalVisible(false);
      // Update the player name in the quiz object or handle it as needed
      localStorage.removeItem("playerName");
      localStorage.setItem("playerName", playerName);
      socket.emit("join_quiz", { quizId: quiz._id, playerName });
      
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleLeaveClick = () => {
    socket.emit("leave_quiz", { quizId: quiz._id , playerName });
    navigate("/");
    localStorage.removeItem("playerName");
  };

  const renderQuestionComponent = (question) => {
    if (!question) return <p>Waiting for the host to start the next question...</p>;
    switch (question.questionType) {
      case 'MCQ':
        return <MCQ question={question} />;
      // case 'TrueFalse':
      //   return <TrueFalse question={question} />;
      // case 'ShortAnswer':
      //   return <ShortAnswer question={question} />;
      default:
        return <p>Unknown question type</p>;
    }
  };



  return (
    <div>
      <h1>{quiz.title}</h1>
      <Button onClick={handleLeaveClick} type="primary" id="LeaveButton">Leave Quiz</Button>
      {isStarted ? (
        isMidQuestion ? (
          <div className="quiz-mid-question">

            {renderQuestionComponent(currentQuestion)}

            <p>Time left: {timeLeft} seconds</p>          
        
          </div>
        ) : (
          <div className="quiz-started-participant">
          
            <h2>Loading Question...</h2>
        
          </div>
        )
      ) : (
        <div className="participant">
          <h2>waiting for quiz to start</h2>
          {/* Add participant-specific content here */}
        </div>
      )}
      
      {/* player name modal */}
      <Modal
        title="Enter Your Name"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default PlayerView;