const QuizModel = require('../Models/QuizModel');

module.exports = {

    //Get all quizzes
    async getAllQuizzes(req, res) {
       await QuizModel.find()
       .then(quizzes => res.json(quizzes))
       .catch(error => console.log(error));     
    },

    //Get quiz by ID
    async getQuizById(req, res) {
        await QuizModel.findById(req.params.id)
        .then(quiz => res.json(quiz))
        .catch(err => console.log(err));
    },
};