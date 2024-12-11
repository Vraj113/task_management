import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import styles from "./TaskDetail.module.css";
let socket_url = process.env.REACT_APP_BACKEND_URL;
const socket = io(socket_url);

const TaskDetail = () => {
  let url = process.env.REACT_APP_URL;
  const { id } = useParams();
  const [data, setData] = useState({});

  // Fetch the task details
  const getTask = async () => {
    try {
      const res = await axios.get(`${url}/taskDetails/${id}`);
      console.log(res.data);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  useEffect(() => {
    // Fetch the initial task data
    getTask();

    // Listen for real-time updates to the specific task
    socket.on("taskUpdated", (updatedTask) => {
      if (updatedTask.taskId === id) {
        console.log("Task updated:", updatedTask);
        setData(updatedTask); // Update the state with the new task data
      }
    });

    // Cleanup the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [id, socket]);

  return (
    <div className={styles.main}>
      <h2>Task Details</h2>
      <div>
        <strong>Task ID:</strong> {id}
      </div>
      <div>
        <strong>Title:</strong> {data.title}
      </div>
      <div>
        <strong>Description:</strong> {data.description}
      </div>
      <div>
        <strong>Status:</strong> {data.status}
      </div>
      <div>
        <strong>Assigned To:</strong> {data.assignedTo}
      </div>
      <div>
        <strong>Created At:</strong>{" "}
        {data.createdAt && new Date(data.createdAt).toLocaleString()}
      </div>

      <h3>Task History</h3>
      <div>
        {data.updateHistory && data.updateHistory.length > 0 ? (
          <ul>
            {data.updateHistory.map((historyItem) => (
              <li key={historyItem._id}>
                <div>
                  <strong>Updated By:</strong> {historyItem.updatedBy}
                </div>
                <div>
                  <strong>Status:</strong> {historyItem.status}
                </div>
                <div>
                  <strong>Updated At:</strong>{" "}
                  {new Date(historyItem.updatedAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>No history available for this task.</div>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
