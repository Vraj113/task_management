const express = require("express");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");
const router = express.Router();

let io; // Placeholder for the Socket.IO instance

const setSocketInstance = (socketInstance) => {
  io = socketInstance;
};

// JWT secret key
const JWT_SECRET = "your_jwt_secret";

// Task creation endpoint
router.post("/", async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const createdBy = decoded.email;

    const { title, description, assignedTo } = req.body;
    const newTask = new Task({
      taskId: generateTaskId(),
      title,
      description,
      assignedTo,
      createdBy,
    });

    await newTask.save();

    // Emit the new task to all connected clients
    if (io) {
      io.emit("taskUpdated", newTask);
    }

    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

function generateTaskId() {
  return "task-" + Math.random().toString(36).substr(2, 9);
}

module.exports = { router, setSocketInstance };
