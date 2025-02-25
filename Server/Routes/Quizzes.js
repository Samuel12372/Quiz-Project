const express = require('express');
const router = express.Router();

const QuizController = require('../Controllers/QuizController');

//Get all quizzes
router.get('/quizzes', QuizController.getAllQuizzes);
//Get quiz by ID
router.get('/quiz/:id', QuizController.getQuizById);
//get multiple quizzes by id
router.post('/quizzes/multiple', QuizController.getQuizzesById);
//Create a quiz
router.post('/quiz/create', QuizController.createQuiz);
//delete a quiz
router.delete('/quiz/delete/:id', QuizController.deleteQuiz);
//save a question
router.post('/:quizId/question', QuizController.createQuestion);
//delete a question
router.delete('/:quizId/question/:questionId', QuizController.deleteQuestion);

module.exports = router;