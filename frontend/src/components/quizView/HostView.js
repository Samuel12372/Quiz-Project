import React from "react";
import { Button, QRCode } from 'antd';

function HostView({ quiz, questions, isStarted, setIsStarted, handleEndClick }) {
  const quizJoinLink = `http://localhost:3000/join/${quiz.id}`;

  return (
    <div>
      <h1>{quiz.title}</h1>
      {isStarted ? (
        <div className="quiz-started-host">
          <Button onClick={handleEndClick} type="primary" id="LeaveButton">End Quiz</Button>
          <p id="quizQuestion">{questions.questionText}</p>
        </div>
      ) : (
        <div className="host-preQuiz">
          <h2>Host Controls</h2>
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