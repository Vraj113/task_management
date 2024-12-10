const express = require("express");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task"); // Assuming you have the Task model
const router = express.Router();

// Your JWT secret key
const JWT_SECRET = "your_jwt_secret"; // Replace with your secret key

router.delete("/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email; // Extract email from the decoded token

    const task = await Task.findOne({ taskId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the user deleting the task is the creator
    if (task.createdBy !== userEmail) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this task" });
    }

    // Delete the task
    await Task.deleteOne({ taskId });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
