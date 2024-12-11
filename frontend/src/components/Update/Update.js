import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // To get the taskId from the URL
import styles from "./Update.module.css";
import { useNavigate } from "react-router-dom";

const Update = () => {
  let url = process.env.REACT_APP_URL;

  // State to hold the current status and error message
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Extract taskId from URL params
  const { taskId } = useParams();

  // Handle status change
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  // Submit the form to update the task
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check if the user has selected a status
    if (!status) {
      setError("Please update the task status.");
      setLoading(false);
      return;
    }

    // Get the JWT token (Assumed to be stored in localStorage or cookies)
    const token = localStorage.getItem("token"); // You can replace this with your token management strategy

    if (!token) {
      setError("No token provided. Please log in.");
      setLoading(false);
      return;
    }

    try {
      // Send PUT request to update the task
      const response = await axios.put(
        `${url}/updateTask/${taskId}`,
        { status, token } // Send the new status
      );
      navigate("/");

      alert("Task updated successfully!");
    } catch (error) {
      // Handle error
      console.error(error);
      setError(
        error.response?.data?.message ||
          "An error occurred while updating the task."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.main}>
      <h2>Update Task</h2>
      <div className={styles.id}>id:{taskId}</div>
      <form onSubmit={handleSubmit}>
        <div className={styles.status}>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={handleStatusChange}
            required
          >
            <option value="" disabled>
              Select a status
            </option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Task"}
        </button>
      </form>
    </div>
  );
};

export default Update;
