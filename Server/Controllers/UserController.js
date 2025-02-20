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
    
    
            res.status(200).json({ userId: user._id, token });
    
        } catch (error) {
            console.error("❌ Server Error in loginUser:", error);
            res.status(500).json({ message: "❌ Server error", error });
        }
    },

    //add quizid to user
    addQuizId: async (req, res) => {
        try {
            const { userId } = req.params;
            const { quizzesId } = req.body;
            console.log("📥 Received Quiz ID:", req.body);
    
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "❌ User not found!" });
            }
    
            user.quizzesId.push(quizzesId);
            await user.save();
    
            res.json({ message: "✅ Quiz ID added to user!", user });
        } catch (error) {
            console.error("❌ Server Error in addQuizId:", error);
            res.status(500).json({ message: "❌ Server error", error });
        }
    },

    //get user quizzes
    getQuizzes: async (req, res) => {
        try {
            const { userId } = req.params;
            // console.log("📥 Received User ID:", req.params);
    
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "❌ User not found!" });
            }
    
            res.json({ quizzesId: user.quizzesId });
        } catch (error) {
            console.error("❌ Server Error in getQuizzes:", error);
            res.status(500).json({ message: "❌ Server error", error });
        }
    }
    
};