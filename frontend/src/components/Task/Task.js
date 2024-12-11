import React from "react";
import styles from "./Task.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Task = ({
  title,
  description,
  status,
  assignedTo,
  createdAt,
  taskId,
}) => {
  const navigate = useNavigate();
  const url = process.env.REACT_APP_URL;
  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent navigation on delete button click

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not authorized. Please log in.");
      return;
    }

    try {
      const response = await axios.delete(`${url}/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message);
      navigate("/"); // Navigate back to the task list or another page after deletion
    } catch (error) {
      console.error("Error deleting task:", error);
      alert(error.response?.data?.message || "Failed to delete the task.");
    }
  };

  const date = new Date(createdAt);
  const readableDate = date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const truncateDescription = (description, wordLimit) => {
    if (!description) return ""; // Handle undefined or null values
    const words = description.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : description;
  };

  return (
    <div
      className={styles.main}
      style={{
        border:
          status === "Completed"
            ? "3px solid green"
            : status === "In Progress"
            ? "3px solid yellow"
            : status === "Pending"
            ? "3px solid red"
            : "inherit",
      }}
    >
      <Link to={`/taskDetail/${taskId}`}>
        <div className={styles.titleBox}>{title}</div>
        <div className={styles.descBox}>
          {truncateDescription(description, 20)}
        </div>
        <div
          className={styles.status}
          style={{
            color:
              status === "Completed"
                ? "green"
                : status === "In Progress"
                ? "yellow"
                : status === "Pending"
                ? "red"
                : "inherit",
          }}
        >
          {status}
        </div>
        <div className={styles.assignBox}>
          {"Assigned to " + assignedTo + " on " + readableDate}
        </div>
      </Link>
      <div className={styles.buttonContainer}>
        <button className={styles.deleteButton} onClick={handleDelete}>
          Delete
        </button>
        <button
          className={styles.updateButton}
          onClick={() => navigate(`/tasks/${taskId}/update`)}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default Task;
