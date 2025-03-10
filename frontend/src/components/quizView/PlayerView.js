import React, { useState } from "react";
import { Button, Modal, Input } from 'antd';

function PlayerView({ quiz, isStarted, handleLeaveClick }) {

  const [isModalVisible, setIsModalVisible] = useState(!quiz.playerName);
  const [playerName, setPlayerName] = useState(quiz.playerName || `player${Math.floor(Math.random() * 1000)}`);


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