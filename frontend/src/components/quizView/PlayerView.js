import React, { useEffect, useState } from "react";
import { Button, Modal, Input, Form } from 'antd';
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

import useTimer from "../../hooks/useTimer";
import MCQ from '../MCQ'; // Import the MCQ component
import '../../CSS/Participant.css';

const socket = io("http://localhost:8080");

function PlayerView({ quiz, questions }) {

  const navigate = useNavigate();
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [playerName, setPlayerName] = useState();

  const [currentQuestion, setCurrentQuestion] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isMidQuestion, setIsMidQuestion] = useState(false);
  const [timeLeft, setTimeLeft] = useTimer(5, () => setIsMidQuestion(false));
  const [selectedOption, setSelectedOption] = useState(null);
  const [answer, setAnswer] = useState("");
  


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
      //console.log(questions[newIndex].answer);
      setSelectedOption(null);
      setCurrentQuestion(questions[newIndex]);
      setAnswer(questions[newIndex].correctAnswer);
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
    
    socket.on()

    return () => {
      socket.off("next_question");
      socket.off("quiz_started");
      socket.off("end_quiz");
    };
  }, [socket, questions]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      socket.emit("leave_quiz", { quizId: quiz._id, playerName });
      localStorage.removeItem("playerName");
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [quiz._id, playerName]);

  useEffect(() => {
    const handleRouteChange = () => {
      if (location.pathname !== `/quiz/${quiz._id}`) {
        socket.emit("leave_quiz", { quizId: quiz._id, playerName });
        localStorage.removeItem("playerName");
      }
    };

    handleRouteChange(); // Check on initial render
    return () => {
      handleRouteChange(); // Check on cleanup
    };
  }, [location.pathname, quiz._id, playerName]);

  const handleOk = () => {
    if (playerName.trim()) {
      setIsModalVisible(false);
      // Update the player name in the quiz object or handle it as needed
      localStorage.removeItem("playerName");
      localStorage.setItem("playerName", playerName);
      socket.emit("join_quiz", { quizId: quiz._id, playerName });
    } 
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
        return <MCQ question={question} onAnswerSelected={onAnswerSelected} />;
      // case 'TrueFalse':
      //   return <TrueFalse question={question} />;
      // case 'ShortAnswer':
      //   return <ShortAnswer question={question} />;
      default:
        return <p>Unknown question type</p>;
    }
  };

  const onAnswerSelected = (option) => {
    console.log("Selected option:", option);
    setSelectedOption(option);
    socket.emit("submit_answer", { quizId: quiz._id, playerName, option });
  };



  return (
    <div>
      <h1>{quiz.title}</h1>
      <Button onClick={handleLeaveClick} type="primary" id="LeaveButton">Leave Quiz</Button>
      {isStarted ? (
        isMidQuestion ? (
          <div className="quiz-mid-question">

            {!selectedOption && renderQuestionComponent(currentQuestion)}

            <p>Time left: {timeLeft} seconds</p>  
            {selectedOption && <p>Option selected: {selectedOption}</p>}        
        
          </div>
        ) : (
          <div className="quiz-started-participant">
          

            <h2>{answer}</h2>
        
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
        title="Quiz Name"
        visible={isModalVisible}
        onOk={handleOk}       
        closable={false}
        maskClosable={false}
        footer={null}
      >
        <Form
          name="playerNameForm"
          initialValues={{ playerName: playerName }}
          onFinish={handleOk}
        >
          <Form.Item
            name="playerName"
            rules={[
              {
                required: true,
                message: 'Enter a name to Join the Quiz',
              },
            ]}
          >
            <Input
              //placeholder=""
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button id="okButton" type="primary" htmlType="submit">
              OK
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PlayerView;