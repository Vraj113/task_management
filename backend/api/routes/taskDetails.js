const express = require("express");
const Task = require("../models/Task"); // Assuming you have the Task model
const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const task = await Task.findOne({ taskId: id });
  return res.status(201).json(task);
});

module.exports = router;
