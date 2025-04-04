import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import BASE_URL from "../context/quizContext";

import HostView from "../components/quizView/HostView";
import PlayerView from "../components/quizView/PlayerView";
import "../CSS/Participant.css";

const socket = io(`${BASE_URL}`);

function Participant() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quiz, setQuiz] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [quizCode, setQuizCode] = useState(location.state?.quizCode || "");
  

  useEffect(() => {
    fetchData();
    checkHost();
    socket.emit("join_quiz", { quizId, playerName: localStorage.getItem("playerName") });
  }, [quizId]);
  
  const fetchData = async () => {
    await axios.get(`${BASE_URL}/quiz/${quizId}`)
      .then((response) => {
        setQuiz(response.data);
        setQuestions(response.data.questions);
        //console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const checkHost = async () => {
    const userId = localStorage.getItem("userId");
    await axios.post(`${BASE_URL}/user/host`, { userId, quizId })  
    .then((res) => {
      //console.log(res.data);
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

  return (
    <div className="participant">
      {isHost ? ( 
        <HostView quiz={quiz} questions={questions} quizCode={quizCode}/>  
      ) : (
        <PlayerView quiz={quiz} questions={questions}/>
      )}
    </div>
  );
}

export default Participant;