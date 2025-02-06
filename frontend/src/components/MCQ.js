import { Button, Card } from "antd";
import { useEffect, useState } from "react";
import '../CSS/Questions.css';

function MultipleChoice() {
    useEffect(() => {
        
    }, []);

    const handleChoiceClick = () => {};

  return (
    <div className="multiplechoice">
        <Card title= "question" id="MCQCard">
            <Button onClick={handleChoiceClick} type="primary" id="ChoiceButton">{}</Button>
            <Button onClick={handleChoiceClick} type="primary" id="ChoiceButton">{}</Button>
            <Button onClick={handleChoiceClick} type="primary" id="ChoiceButton">{}</Button>
        </Card>
    </div>
  );
}

export default MultipleChoice;