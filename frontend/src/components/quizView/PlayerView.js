import React, { useEffect, useState } from "react";
import { Button, Modal, Input } from 'antd';
import MCQ from '../MCQ'; // Import the MCQ component

function PlayerView({ quiz,  handleLeaveClick, questions, currentQuestionIndex, socket }) {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [playerName, setPlayerName] = useState(quiz.playerName || `player${Math.floor(Math.random() * 1000)}`);
  const [currentQuestion, setCurrentQuestion] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isMidQuestion, setIsMidQuestion] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);


  useEffect(() => {
    console.log("questions:", questions);
    console.log("currentQuestionIndex:", currentQuestionIndex);
    setCurrentQuestion(questions[currentQuestionIndex] || null);
  }, [questions, currentQuestionIndex]);

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

  useEffect(() => {
      if (isMidQuestion && timeLeft > 0) {
        const timer = setInterval(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearInterval(timer);
      } else if (timeLeft === 0) {
        setTimeLeft(5);
        setIsMidQuestion(false);
      }
    }, [isMidQuestion, timeLeft]);

  // Listen for the next question event from the host
  useEffect(() => {
    socket.on("next_question", ({ newIndex }) => {
      //console.log("Next question received");
      //console.log("newIndex:", newIndex);
      //console.log("questions:", questions);
      console.log("questions[newIndex]:", questions[newIndex])
      setCurrentQuestion(questions[newIndex]);
      setIsAnswered(false);
      setSelectedAnswer(null);
      setIsMidQuestion(true);
    });

    socket.on("quiz_started", () => {
      console.log("Quiz started");
      setIsStarted(true);
    });

    socket.on("end_quiz", () => {
      setIsStarted(false);
    });

    return () => {
      socket.off("next_question");
      socket.off("quiz_started");
      socket.off("end_quiz");
    };
  }, [socket, questions,]);

  const handleOk = () => {
    if (playerName.trim()) {
      setIsModalVisible(false);
      // Update the player name in the quiz object or handle it as needed
      quiz.playerName = playerName;
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
      {renderQuestionComponent(currentQuestion)}
      {isStarted ? (
       isMidQuestion ? (
        <div className="quiz-mid-question">

          <h2>mid question</h2>

          <p>Time left: {timeLeft} seconds</p>
          
          
        </div>
      ) : (
        <div className="quiz-started-participant">
          
          <h2>Loading Question...</h2>
        
        </div>
      )
      ) : (
        <div className="participant">
          <Button onClick={handleLeaveClick} type="primary" id="LeaveButton">Leave Quiz</Button>
          <h2>waiting for quiz to start</h2>
          {/* Add participant-specific content here */}
        </div>
      )}
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