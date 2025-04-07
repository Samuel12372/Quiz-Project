import { Button, Card } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import '../CSS/Participant.css';



function MCQ({ question, onAnswerSelected }) {

  

  if (!question) {
    return <p>Waiting for the question...</p>;
  }

  return (
    <div className="multiplechoice">
      <h2 className="question-text">{question.questionText}</h2>
        {question.options.map((option, index) => (
          <Button 
            key={index} 
            onClick={() => onAnswerSelected(option)} 
            type="primary" 
            id="ChoiceButton"
          >
            <h2>{option}</h2>
          </Button>
        ))}
      
    </div>
  );
}

export default MCQ;

