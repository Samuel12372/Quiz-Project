import React, {useState} from "react";
import { Button, Input, Card} from "antd";
import '../CSS/QuizJoiner.css';

function QuizJoiner() {

  const [code, setCode] = useState(''); //stores the code entered by the user
  const [name, setName] = useState(''); //stores the name entered by the user
  const [info, setInfo] = useState(false); //stores the information entered by the user
  
  const handleJoinClick = () => {
    console.log(code); 
    console.log(name);
    if(name && code){
      setInfo(true);
    }


    //if code is correct, then redirect to the quiz page
    //if code is incorrect, then show
    


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
        <Input 
          type="text" 
          placeholder="Enter Name" 
          id = "nameInput"
          value ={name} 
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={handleJoinClick} type ="primary" id = "joinButton">Enter</Button>
      </Card>
    </div>
  );
}

export default QuizJoiner;