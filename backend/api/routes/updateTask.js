const express = require("express");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task"); // Assuming you have the Task model
const router = express.Router();

// Your JWT secret key
const JWT_SECRET = "your_jwt_secret"; // Replace with your secret key

router.put("/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  const token = req.body.token;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const updatedBy = decoded.email;

    const task = await Task.findOne({ taskId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updateHistory = {
      updatedBy,
      status,
      updatedAt: Date.now(),
    };

    task.status = status;
    task.updateHistory.push(updateHistory);
    await task.save();

    // Emit the updated task to all connected clients
    const io = req.app.get("socketio");
    io.emit("taskUpdated", task);

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
