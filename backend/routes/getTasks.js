const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// GET /tasks
router.get("/", async (req, res) => {
  try {
    const { status, assignedTo } = req.query;

    // Build the query dynamically based on query parameters
    const query = {};
    if (status) {
      query.status = status; // Filter by status if provided
    }
    if (assignedTo) {
      query.assignedTo = assignedTo; // Filter by assignedTo if provided
    }

    // Fetch tasks from the database
    const tasks = await Task.find(query);

    // Respond with the tasks
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
