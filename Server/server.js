//run server - cd Server - node index.js
//open browser - http://localhost:8080/
//ctrl + c to stop server


require("dotenv").config(); 
const express = require('express');
const cors = require('cors');

const connectDB = require('./DB/connection');
const quizzes = require('./Routes/Quizzes');
const PORT = process.env.PORT;  
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use('/', quizzes); 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 