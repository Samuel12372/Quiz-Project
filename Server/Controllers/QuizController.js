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

    //Create a quiz
    async createQuiz(req, res) {
        const newQuiz = new QuizModel({
            title: req.body.title,
            description: req.body.description,
            questions: req.body.questions
        });

        await newQuiz.save()
        .then(quiz => res.json({ _id: quiz._id, ...quiz._doc }))
        .catch(err => console.log(err));
    },

    //get multiple quizzes by id
    async getQuizzesById(req, res) {
        try {
            const { ids } = req.body;
            const quizzes = await QuizModel.find({ _id: { $in: ids } });
            res.json(quizzes);
        } catch (error) {
            console.error("❌ Server Error in getQuizzesById:", error);
            res.status(500).json({ message: "❌ Server error", error });
        }
    },

    //delete a quiz 
    async deleteQuiz(req, res) {
        await QuizModel.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: 'Quiz deleted successfully' }))
        .catch(err => console.log(err));
    },

    //save a question
    async createQuestion(req, res) {
        

        const newQuestion = {
            questionText: req.body.questionText,
            options: req.body.options,
            correctAnswer: req.body.correctAnswer,
            questionType: req.body.questionType
        };

        await QuizModel.findByIdAndUpdate(req.params.quizId, { $push: { questions: newQuestion } }, { new: true })
        .then(quiz => {res.json(quiz)})
        .catch(err => console.log(err));
    },

    //delete a question
    async deleteQuestion(req, res) {
        await QuizModel.findByIdAndUpdate(req.params.quizId, { $pull: { questions: { _id: req.params.questionId } } }, { new: true })
        .then(quiz => res.json(quiz))
        .catch(err => console.log(err));
    },

    
    

};