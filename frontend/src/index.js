import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './CSS/index.css';
import Participant from './pages/Participant';
import QuizJoiner from './components/QuizJoiner';
import Navbar from './components/Navbar';
import Create from './pages/Create';
import Title from './components/Title';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Navbar /> 
      <Title />
      <Routes>
        <Route path="/" element = {<QuizJoiner/>} />
        <Route path="/view" element = {<Participant/>}  />
        <Route path="/create/:quizId" element = {<Create/>} />
        {/* <Route path="/host" element = {} /> */}
      </Routes>
    </Router>
  </React.StrictMode>
);


