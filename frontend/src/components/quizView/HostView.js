import React, { useState, useEffect } from "react";
import { Button, QRCode } from 'antd';

function HostView({ quiz, questions, isStarted, setIsStarted, handleEndClick, socket }) {
  const quizJoinLink = `http://localhost:3000/join/${quiz.id}`;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isMidQuestion, setIsMidQuestion] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (isMidQuestion && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [isMidQuestion, timeLeft]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsMidQuestion(false);
      setTimeLeft(5);
    } else {
      // Handle end of quiz scenario
      setIsMidQuestion(false);
    }
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
            
            {/* current question */}
            <p>next question</p>
            <p>{questions[currentQuestionIndex]?.questionText}</p>

            {/* quesion number */}
            <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>

            <Button onClick={() => setIsMidQuestion(true)} type="primary" id="NextButton">Next Question</Button>
            
            {/* leaderboard */}
            

          </div>
        )
      ) : (
        <div className="host-preQuiz">
          <h2>Join Quiz</h2>
          <div className="qr-code">
            <QRCode value={quizJoinLink} size={200} />
          </div>
          <Button type='primary' onClick={() => setIsStarted(true)}>Start Quiz</Button>
        </div>
      )}
    </div>
  );
}

export default HostView;