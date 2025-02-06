const mongoose = require('mongoose');

//code for db not to disconnect if its connect to the slected db

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri)
    .then(() => {
        const dbName = mongoose.connection.name;
        console.log(`Connected to MongoDB database: ${dbName}`);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1); // Exit process with failure
  }); 
};

module.exports = connectDB;