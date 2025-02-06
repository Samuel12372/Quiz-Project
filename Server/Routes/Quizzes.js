const express = require('express');
const router = express.Router();

const QuizController = require('../Controllers/QuizController');

//Get all quizzes
router.get('/quizzes', QuizController.getAllQuizzes);
//Get quiz by ID
router.get('/quiz/:id', QuizController.getQuizById);

module.exports = router;