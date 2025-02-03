//run server - cd Server - node index.js
//open browser - http://localhost:8080/
//ctrl + c to stop server


require("dotenv").config(); 
const express = require('express');
const cors = require('cors');
const { Server } = require("socket.io");
const connectDB = require('./connection');

const app = express();
const http = require('http').Server(app);
app.use(cors());
app.use(express.json());

//const PORT = process.env.PORT;  

connectDB();

app.listen( () => {
    console.log(`Server is running on http://localhost:8080`);
}); 