const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
        title: {
        type: String,
        required: true
        },
        description: {
        type: String,
        required: true
        },
        category: {
        type: String,
        required: false
        },
        difficulty: {
        type: String,
        required: false
        },
        questions: [
        {
            questionText: {
            type: String,
            required: true
            },
            options: [
            {
                type: String,
                required: true
            }
            ],
            correctAnswer: {
            type: String,
            required: true
            }
        }
        ]
    });

const QuizModel = mongoose.model('quizzes', quizSchema);
module.exports = QuizModel;   