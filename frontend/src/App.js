
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './CSS/index.css';
import Participant from './pages/Participant';
import QuizJoiner from './components/QuizJoiner';
import Navbar from './components/Navbar';
import Create from './pages/Create';
import Title from './components/Title';

const App = () => {
  const location = useLocation();
  const showTitle = location.pathname === '/' || location.pathname === '/view';
  const showNavbar = location.pathname === '/' || location.pathname === '/view';

  return (
    <>
      {showNavbar && <Navbar />}
      {showTitle && <Title />}
      <Routes>
        <Route path="/" element={<QuizJoiner />} />
        <Route path="/view/:quizId" element={<Participant />} />
        <Route path="/create/:quizId" element={<Create />} />
      </Routes>
    </>
  );
};

export default App;