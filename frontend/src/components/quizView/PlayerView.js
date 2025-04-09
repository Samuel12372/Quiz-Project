import React, { useEffect, useState } from "react";
import { Button, Modal, Input, Form, Card } from 'antd';
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import BASE_URL from "../../context/quizContext";

import useTimer from "../../hooks/useTimer";
import MCQ from '../MCQ'; // Import the MCQ component
import TrueFalse from '../TF'; // Import the TrueFalse component
import '../../CSS/Participant.css';

const socket = io(`${BASE_URL}` , {
  transports: ["websocket"], // Prevents polling issues
  withCredentials: true
});
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
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [quizEnded, setQuizEnded] = useState(false);
  const [scores , setScores] = useState([]);
  


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

    socket.on("next_question", ({ newIndex, time }) => {
      setIsStarted(true);
      console.log("questions[newIndex]:", questions[newIndex])
      //console.log(questions[newIndex].answer);
      setSelectedOption(null);
      setCurrentQuestion(questions[newIndex]);
      setAnswer(questions[newIndex].correctAnswer);
      setTimeLeft(time);
      setIsMidQuestion(true);
      setFeedbackMessage("Wrong! ❌");
    });

    socket.on("quiz_started", () => {
      console.log("Quiz started");
      setIsStarted(true);
    });

    socket.on("end_quiz", () => {
      setQuizEnded(true);
      setIsStarted(false);
      
      // localStorage.removeItem("playerName");
      // setPlayerName();
      // navigate("/");
    });

    
    socket.on("final_scores", ({ quizId, scores }) => {
      console.log("Final scores received:", scores);
      setScores(scores);
    });


    return () => {
      socket.off("next_question");
      socket.off("quiz_started");
      socket.off("end_quiz");
      socket.off("final_scores");
    };
  }, [socket, questions]);

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     socket.emit("leave_quiz", { quizId: quiz._id, playerName });
  //     localStorage.removeItem("playerName");
  //     event.preventDefault();
  //     event.returnValue = '';
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [quiz._id, playerName]);

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
      const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage when logged in
      if (userId) {
        socket.emit("join_quiz", { quizId: quiz._id, playerName, userId });
      } else {
        socket.emit("join_quiz", { quizId: quiz._id, playerName });
      }
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
      case 'T/F':
        return <TrueFalse question={question} onAnswerSelected={onAnswerSelected} />;
      // case 'ShortAnswer':
      //   return <ShortAnswer question={question} />;
      default:
        return <p>Unknown question type</p>;
    }
  };



  useEffect(() => {
    if (isMidQuestion && timeLeft === 0) {
      // Timer has ended, submit the selected answer or null
      const optionToSubmit = selectedOption || null;
      console.log("Submitting answer after timer ends:", optionToSubmit);
      socket.emit("submit_answer", { quizId: quiz._id, playerName, option: optionToSubmit });
  
      // Provide feedback if no answer was selected
      if (!selectedOption) {
        setFeedbackMessage("No answer selected! ❌");
      }
  
      // Reset the selected option for the next question
      setSelectedOption(null);
      setIsMidQuestion(false);
    }
  }, [timeLeft, isMidQuestion, selectedOption, quiz._id, playerName]);
  
  const onAnswerSelected = (option) => {
    console.log("Selected option:", option);
    setSelectedOption(option); // Store the selected option
  };

  const endQuiz = () => {
    setQuizEnded(false);
    setIsStarted(false);
    localStorage.removeItem("playerName");
    setPlayerName();
    navigate("/");
  }


  return (
    <div>
      {!quizEnded && <Button onClick={handleLeaveClick} type="primary" id="leaveButton">Leave Quiz</Button>}
      <h1>{quiz.title}</h1>
      {quizEnded ? ( // Check if the quiz has ended
      <div className="quiz-ended">
        
        <Card  id="results-card">
          <h2>Final Results</h2>
        {scores.map((player, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                color: index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : "black",
                marginRight: "10px",
              }}
            >
              {index + 1}.
            </span>
            <span style={{ flex: 1 }}>{player.playerName}</span>
            <span style={{ fontWeight: "bold", color: "#4caf50" }}>{player.score} pts</span>
          </div>
        ))}
        </Card>

        <Button onClick={endQuiz} type="primary" id="homeButton">Home</Button>
      </div>
    ) : isStarted ? (
        isMidQuestion ? (
          <div className="quiz-mid-question">

            {!selectedOption && renderQuestionComponent(currentQuestion)}

            <p>Time left: {timeLeft} seconds</p>  
        
          </div>
        ) : (
          <div className="quiz-started-participant">
          
            <h2>{feedbackMessage}</h2>       
            {selectedOption && <h2> You Selected: {selectedOption}</h2>}
            {answer && <h2>Answer: {answer}</h2>}
            {!answer && <h2>Loading Question...</h2>}
        
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
        className="playerNameModal"
        title="Player Name"
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