const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        questions: [
        {
            questionType: {
                type: String,
                required: false
            },
            questionText: {
                type: String,
                required: false
            },
            options: [
            {
                type: String,
                required: false
            }
            ],
            correctAnswer: {
                type: String,
                required: false
            }
        }
        ]
    },
    { versionKey: false }
);

const QuizModel = mongoose.model('quizzes', quizSchema);
module.exports = QuizModel;   