const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Your JWT secret
const JWT_SECRET = "your_jwt_secret";

// Middleware to authenticate and get user info
router.get("/", async (req, res) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, JWT_SECRET);

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    return res.json({ email: decoded.email });
  } catch (err) {
    // Handle errors during token verification
    return res.status(403).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
