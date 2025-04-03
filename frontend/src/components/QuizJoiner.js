import React, {useState} from "react";
import { Button, Input, Card} from "antd";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import '../CSS/QuizJoiner.css';
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

function QuizJoiner() {

  const [code, setCode] = useState(''); //stores the code entered by the user
  const [name, setName] = useState(''); //stores the name entered by the user
  const [info, setInfo] = useState(false); //stores the information entered by the user
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(''); //stores the error message if the code is incorrect
  
  const handleJoinClick = async() => {
    console.log(code); 
    console.log(name);
    if(code){
      setInfo(true);
      await axios.post(`http://localhost:8080/quiz/join`, {code, name})
      .then((res) => {
        //console.log(res.data);
        const quizId = res.data.quizId;
        const userId = localStorage.getItem("userId");
        localStorage.setItem("playerName", name);
        socket.emit("join_quiz", { quizId: quizId, playerName: name, userId: userId });
        navigate(`/view/${quizId}`);
        
      })
      .catch((error) => {
        console.log(error);
        setCode('');
        setErrorMessage("Invalid Code"); //set error message if code is incorrect
      }); 
    }
  };

  
  return (
    <div className="quizjoiner">
      <Card  id="joinCard">
        <Input 
          type="text" 
          placeholder={errorMessage || "Enter Quiz Code"}
          id = "codeInput"
          value ={code} 
          onChange={(e) => {
            setCode(e.target.value);
            setErrorMessage(""); // Clear error message when user starts typing
          }}
          style={{
            borderColor: errorMessage ? "red" : undefined, // Highlight border in red if there's an error
          }}
          className={errorMessage ? "error-placeholder" : ""}
        />
        <Button onClick={handleJoinClick} type ="primary" id = "joinButton">Join Quiz</Button>
         {/*display error message if code is incorrect*/}
      </Card>
    </div>
  );
}

export default QuizJoiner;