import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './CSS/index.css';
import Participant from './pages/Participant';
import QuizJoiner from './components/QuizJoiner';
import Navbar from './components/Navbar';
import App from './App';
import Create from './pages/Create';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element = {<QuizJoiner/>} />
        <Route path="/view" element = {<Participant/>}  />
        <Route path="/create" element = {<Create/>} />
        {/* <Route path="/host" element = {} /> */}
      </Routes>
    </Router>
  </React.StrictMode>
);


