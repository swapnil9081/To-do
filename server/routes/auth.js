const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

// Register
router.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email or username"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const user = new User({
            email,
            username,
            password: hashedPassword
        });
        await user.save();

        // Return success
        const { password: hiddenPassword, ...userData } = user._doc;
        res.status(200).json(userData);
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Sign In
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found. Please sign up first."
            });
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // Return user without password
        const { password: hiddenPassword, ...userData } = user._doc;
        res.status(200).json(userData);
    } catch (error) {
        console.error("Error in signin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
