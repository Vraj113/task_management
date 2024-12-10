const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = "your_jwt_secret"; // Replace with a strong secret key

router.post(
  "/",
  // Validation middleware
  // [
  //   body("email").isEmail().withMessage("Enter a valid email"),
  //   body("password")
  //     .isLength({ min: 6 })
  //     .withMessage("Password must be at least 6 characters long"),
  //   body("confirmPassword").custom((value, { req }) => {
  //     if (value !== req.body.password) {
  //       throw new Error("Passwords do not match");
  //     }
  //     return true;
  //   }),
  // ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save the user
      const newUser = new User({
        email,
        password: hashedPassword,
      });
      await newUser.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        JWT_SECRET
      );

      res
        .status(201)
        .json({ message: "User registered successfully", token: token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
