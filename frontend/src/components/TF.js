import { Button } from "antd";
import '../CSS/Participant.css';



function TrueFalse({ question, onAnswerSelected }) {

  
  if (!question) {
    return <p>Waiting for the question...</p>;
  }

  return (
    <>
      <h2>{question.questionText}</h2>
        <Button onClick={() => onAnswerSelected("true")} type="primary" id="ChoiceButton">True</Button>
        <Button onClick={() => onAnswerSelected("false")}type="primary" id="ChoiceButton">False</Button>
    </>
  );
}

export default TrueFalse;