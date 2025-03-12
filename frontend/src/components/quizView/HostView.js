import React, { useState, useEffect } from "react";
import { Button, QRCode } from 'antd';


function HostView({ quiz, questions, isStarted, setIsStarted, handleEndClick, socket }) {
  const quizJoinLink = `http://localhost:3000/join/${quiz.id}`;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [isMidQuestion, setIsMidQuestion] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [leaderboard, setLeaderboard] = useState({}); 

  //put timer in particpant.js
  useEffect(() => {
    if (isMidQuestion && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      //handleNextQuestion();
      setTimeLeft(5);
      setIsMidQuestion(false);
    }
  }, [isMidQuestion, timeLeft]);

  useEffect(() => {
    socket.on("update_scores", (updatedScores) => {
      setLeaderboard(updatedScores);
    });

    return () => {
      socket.off("update_scores");
    };
  }, [socket]);
  
  //change this logic 
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      
      // Emit the next question first
      console.log("Sending next question:", questions[newIndex]);
      socket.emit("next_question", { quizId: quiz.id, newIndex });
  
      // Update the state for the new question
      setCurrentQuestionIndex(newIndex);
      setIsMidQuestion(true); // Start the timer phase
      setTimeLeft(5); // Reset timer
    } else {
      socket.emit("end_quiz", { quizId: quiz.id });
    }
    
  };
  

  const startQuiz = () => {
    setIsStarted(true);
    socket.emit("start_quiz", { quizId: quiz.id }); 
  };




  return (
    <div>
      <h1>{quiz.title}</h1>
      {isStarted ? (
        isMidQuestion ? (
          <div className="quiz-started-host">
            <Button onClick={handleEndClick} type="primary" id="LeaveButton">End Quiz</Button>

            <p>{questions[currentQuestionIndex]?.questionText}</p>
            
            {/* timer */}
            <p>Time left: {timeLeft} seconds</p>

          </div>
        ) : (
          <div className="quiz-started-host">
            <Button onClick={handleEndClick} type="primary" id="LeaveButton">End Quiz</Button>

            <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>

            <p>{questions[currentQuestionIndex]?.questionText}</p>

            <Button onClick={handleNextQuestion} type="primary" id="NextButton">Next Question</Button>

          
            {/* leaderboard */}
            

          </div>
        )
      ) : (
        <div className="host-preQuiz">
          <h2>Join Quiz</h2>
          <div className="qr-code">
            <QRCode value={quizJoinLink} size={200} />
          </div>
          <Button type='primary' onClick={startQuiz}>Start Quiz</Button>
        </div>
      )}
    </div>
  );
}

export default HostView;