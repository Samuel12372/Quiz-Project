const express = require('express');
const router = express.Router();

const UserController = require('../Controllers/UserController');

// Create a new user
router.post('/user/create', UserController.registerUser);
// Get a user by username and password
router.post('user/login', UserController.loginUser);


module.exports = router;