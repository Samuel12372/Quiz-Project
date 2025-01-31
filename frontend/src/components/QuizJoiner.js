import React, {useState} from "react";
import { Button, Input, Card} from "antd";
import '../CSS/QuizJoiner.css';

function QuizJoiner() {

  const [code, setCode] = useState(''); //stores the code entered by the user
  
  const handleJoinClick = () => {
    console.log(code); // You can replace this with any action you want to perform with the code
    setCode(''); // This will clear the input field after the code is used
  };

  
  return (
    <div className="quizjoiner">
      <Card title="Join Quiz" id="joinCard">
        <Input 
          type="text" 
          placeholder="Enter Code" 
          id = "codeInput"
          value ={code} 
          onChange={(e) => setCode(e.target.value)}
        />
        <Button onClick={handleJoinClick} type ="primary" id = "joinButton">Enter</Button>
      </Card>
    </div>
  );
}

export default QuizJoiner;