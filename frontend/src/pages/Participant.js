import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import{ Button, QRCode} from 'antd';
import { io } from "socket.io-client";

import HostView from "../components/quizView/HostView";
import PlayerView from "../components/quizView/PlayerView";
import "../CSS/Participant.css";

const socket = io("http://localhost:8080");

function Participant() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [playerAnswers, setPlayerAnswers] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);

 
  
  useEffect(() => {
    fetchData();
    checkHost();
    //const playerName = localStorage.getItem("playerName");
  
    socket.emit("join_quiz", { quizId, playerName: localStorage.getItem("playerName") });

  socket.on("update_players", (updatedPlayers) => {
    setPlayers(updatedPlayers);
  });

  socket.on("next_question", (newIndex) => {
    setCurrentQuestionIndex(newIndex);
  });
  
  socket.on("start_quiz", () => {
    setIsStarted(true); 
  });

  socket.on("update_scores", (newScores) => {
    setLeaderboard(newScores);
  });

  return () => {
    socket.off("update_players");
    socket.off("next_question");
    socket.off("update_scores");
    socket.off("start_quiz");
  };

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


  const handleLeaveClick = () => {
    localStorage.removeItem("playerName");
    navigate("/");
  };
  const handleEndClick = () => {};

  const quizJoinLink = `http://localhost:3000/join/${quizId}`; 

  return (
    <div className="participant">
      {isHost ? (
        <>
        <HostView
          quiz={quiz}
          questions={questions}
          isStarted={isStarted}
          setIsStarted={setIsStarted}
          handleEndClick={handleEndClick}
          socket={socket}
        />
          
        </>
      ) : (
        <PlayerView
          quiz={quiz}
          // isStarted={isStarted}
          
          handleLeaveClick={handleLeaveClick}
          socket={socket}
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
        />
      )}
    </div>
  );
}

export default Participant;