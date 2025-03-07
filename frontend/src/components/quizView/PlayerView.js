import React from "react";
import { Button } from 'antd';

function PlayerView({ quiz, isStarted, handleLeaveClick }) {
  return (
    <div>
      <h1>{quiz.title}</h1>
      {isStarted ? (
        <div className="quiz-started-participant">
          <h2>Quiz in Progress (Participant View)</h2>
          {/* Add participant-specific content for the quiz in progress here */}
        </div>
      ) : (
        <div className="participant">
          <Button onClick={handleLeaveClick} type="primary" id="LeaveButton">Leave Quiz</Button>
          <h2>Participant View</h2>
          {/* Add participant-specific content here */}
        </div>
      )}
    </div>
  );
}

export default PlayerView;