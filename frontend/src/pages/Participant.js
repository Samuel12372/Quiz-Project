import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import{ Button, QRCode} from 'antd';
import HostView from "../components/quizView/HostView";
import PlayerView from "../components/quizView/PlayerView";
import "../CSS/Participant.css";


function Participant() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    fetchData();
    checkHost();

  }, [quizId]);
  
  const fetchData = async () => {
    await axios.get(`http://localhost:8080/quiz/${quizId}`)
      .then((response) => {
        setQuiz(response.data);
        setQuestions(response.data.questions);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const checkHost = async () => {
    const userId = localStorage.getItem("userId");
    await axios.post(`http://localhost:8080/user/host`, { userId, quizId })  
    .then((res) => {
      console.log(res.data);
      if (res.data.isHost) {
        setIsHost(true);
      }
      else {
        setIsHost(false);
      }
    })
    .catch((error) => {
      console.log(error);
      setIsHost(false);
    });
  };


  const handleLeaveClick = () => {};
  const handleEndClick = () => {};

  const quizJoinLink = `http://localhost:3000/join/${quizId}`; 

  return (
    <div>
      {isHost ? (
        <HostView
          quiz={quiz}
          questions={questions}
          isStarted={isStarted}
          setIsStarted={setIsStarted}
          handleEndClick={handleEndClick}
        />
      ) : (
        <PlayerView
          quiz={quiz}
          isStarted={isStarted}
          handleLeaveClick={handleLeaveClick}
        />
      )}
    </div>
  );
}

export default Participant;