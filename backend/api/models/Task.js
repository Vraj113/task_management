const mongoose = require("mongoose");

// Define the Task schema
const taskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      required: true,
      unique: true, // Ensures taskId is unique
    },
    title: {
      type: String,
      required: true, // Title is mandatory
      trim: true, // Removes whitespace
    },
    description: {
      type: String,
      required: true, // Description is mandatory
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"], // Enum for status values
      default: "Pending", // Default status is "Pending"
    },
    assignedTo: {
      type: String,
      required: true, // Email is mandatory
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validates email format
    },
    createdBy: {
      type: String, // Email of the user who created the task
      required: true,
    },
    updateHistory: [
      {
        updatedBy: String, // Email of the user who made the update
        status: String, // The new status
        updatedAt: { type: Date, default: Date.now }, // Timestamp of the update
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Task model
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
