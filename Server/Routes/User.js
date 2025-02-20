const express = require('express');
const router = express.Router();

const UserController = require('../Controllers/UserController');

// register a new user
router.post('/user/register', UserController.registerUser);
// Get a user by username and password
router.post('/user/login', UserController.loginUser);
// add quiz id to user
router.post('/user/addQuizId/:userId', UserController.addQuizId);
//get user quizzes
router.post('/user/getQuizzes/:userId', UserController.getQuizzes);


module.exports = router;