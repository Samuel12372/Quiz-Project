import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './CSS/index.css';
import Participant from './pages/Participant';
import QuizJoiner from './components/QuizJoiner';
import Navbar from './components/Navbar';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element = {<QuizJoiner/>} />
        <Route path="/view" element = {<Participant/>}  />
      </Routes>
    </Router>
  </React.StrictMode>
);


