const UserModel = require('../Models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {

    // Create a new user
    registerUser: async (req, res) => {
        try {
            console.log("📥 Received Registration Data:", req.body);
    
            const { username, email, password } = req.body;
    
            if (!username || !email || !password) {
                return res.status(400).json({ message: "❌ All fields are required!" });
            }
    
            let userExists = await UserModel.findOne({ email });
            if (userExists) {
                console.log("⚠️ User already exists:", email);
                return res.status(400).json({ message: "❌ Email already in use!" });
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({ username, email, password: hashedPassword });
    
            await newUser.save();
            console.log("✅ User saved successfully:", newUser);
    
            res.status(201).json({ message: "✅ Registration successful!", user: newUser });
        } catch (error) {
            console.error("❌ Registration error:", error);
            res.status(500).json({ message: "❌ Server error", error });
        }
    },

    //get a user by username and password
    loginUser: async (req, res) => {
        try {
            const { username, password } = req.body;
            console.log("📥 Received Login Data:", req.body);
            const user = await UserModel.findOne({ username });
    
            if (!user) {
                return res.status(400).json({ message: "❌ User not found!" });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "❌ Invalid credentials!" });
            }
    
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
    
    
            res.json({ message: "✅ Login successful!", token, username: user.username, role: user.role });
    
        } catch (error) {
            console.error("❌ Server Error in loginUser:", error);
            res.status(500).json({ message: "❌ Server error", error });
        }
    },

    //add quizid to user
    addQuizId: async (req, res) => {
        
    },
    
};