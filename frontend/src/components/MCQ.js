import { Button, Card } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import '../CSS/Questions.css';



function MultipleChoice() {
   
  const [quiz , setQuiz] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
      axios.get(`http://localhost:8080/quiz/67a49e674c58fb1b231ea574`)
      .then((response) => {
          setQuiz(response.data);
          setQuestions(response.data.questions);
          setCurrentQuestion(0);
      })
      .catch((error) => {
          console.error('Error fetching data: ', error);
      });
  }, []);


  const handleChoiceClick = () => {
    console.log('Choice Clicked');
    //setCurrentQuestion(currentQuestion + 1);
  };

  return (
    <div className="multiplechoice">
      {questions.length > 0 && (
        <Card title={questions[currentQuestion].questionText} id="MCQCard">

            <Button onClick={handleChoiceClick} type="primary" id="ChoiceButton">{questions[currentQuestion].options[0]}</Button>
            <Button onClick={handleChoiceClick} type="primary" id="ChoiceButton">{questions[currentQuestion].options[1]}</Button>
            <Button onClick={handleChoiceClick} type="primary" id="ChoiceButton">{questions[currentQuestion].options[2]}</Button>
            <Button onClick={handleChoiceClick} type="primary" id="ChoiceButton">{questions[currentQuestion].options[3]}</Button>
        </Card>
      )}
    </div>
  );
}

export default MultipleChoice;