import { Button, Card } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import '../CSS/Questions.css';



function MCQ({ question, onAnswerSelected }) {
  if (!question) {
    return <p>Waiting for the question...</p>;
  }

  return (
    <div className="multiplechoice">
      <Card title={question.questionText} id="MCQCard">
        {question.options.map((option, index) => (
          <Button 
            key={index} 
            onClick={() => onAnswerSelected(option)} 
            type="primary" 
            id="ChoiceButton"
          >
            {option}
          </Button>
        ))}
      </Card>
    </div>
  );
}

export default MCQ;

