import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './CSS/index.css';
import { BackgroundProvider } from './context/BackgroundContext';
// import Participant from './pages/Participant';
// import QuizJoiner from './components/QuizJoiner';
// import Navbar from './components/Navbar';
// import Create from './pages/Create';
// import Title from './components/Title';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BackgroundProvider>
      <Router>
        <App />
      </Router>
    </BackgroundProvider>
  </React.StrictMode>
);


