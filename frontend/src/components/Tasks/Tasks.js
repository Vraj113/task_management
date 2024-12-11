import React, { useEffect, useState } from "react";
import Task from "../Task/Task";
import styles from "./Tasks.module.css";
import { NavLink } from "react-router";
import axios from "axios";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

let socket_url = process.env.REACT_APP_BACKEND_URL;
const socket = io(socket_url); // Replace with your backend URL
const Tasks = () => {
  let url = process.env.REACT_APP_URL;
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    token: token,
  });

  const onChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    if (
      taskData.title === "" ||
      taskData.assignedTo === "" ||
      taskData.description === ""
    ) {
      toast("Please fill all the fields");
      return;
    }
    try {
      const res = await axios.post(`${url}/addTask`, taskData);
      if (res.status === 201) {
        // Check if the task already exists to prevent duplicates
        setData((prevData) => {
          // Prevent adding a duplicate task based on the taskId
          const taskExists = prevData.some(
            (task) => task.taskId === res.data.taskId
          );
          if (!taskExists) {
            return [...prevData, res.data];
          }
          return prevData;
        });

        setTaskData({
          title: "",
          description: "",
          assignedTo: "",
          token: token,
        });
        toast("Task Added Successfully");
      }
    } catch (error) {
      toast("Error adding task");
      console.error("Error adding task:", error);
    }
  };

  const getData = async () => {
    try {
      const res = await axios.get(`${url}/getTasks`);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    getData();

    const handleTaskUpdate = (updatedTask) => {
      setData((prevData) => {
        const index = prevData.findIndex(
          (task) => task.taskId === updatedTask.taskId
        );
        if (index !== -1) {
          const updatedData = [...prevData];
          updatedData[index] = updatedTask;
          return updatedData;
        }
        return [...prevData, updatedTask];
      });
    };

    socket.on("taskUpdated", handleTaskUpdate);

    return () => {
      socket.off("taskUpdated", handleTaskUpdate);
    };
  }, []);

  return (
    <>
      <ToastContainer />
      <div className={styles.main}>
        <div className={styles.addTask}>
          <div>
            <div>
              <div>Title</div>
              <input
                type="text"
                value={taskData.title}
                name="title"
                onChange={onChange}
              />
            </div>
            <div>
              <div>Description</div>
              <input
                type="text"
                value={taskData.description}
                name="description"
                onChange={onChange}
              />
            </div>
            <div>
              <div>Assigned to</div>
              <input
                type="text"
                value={taskData.assignedTo}
                name="assignedTo"
                onChange={onChange}
              />
            </div>
            <div>
              <button className={styles.addTaskBtn} onClick={onSubmit}>
                Add
              </button>
            </div>
          </div>
        </div>
        {data && data.length > 0 ? (
          data.map((task, index) => (
            <Task
              key={task.taskId || index}
              title={task.title}
              description={task.description}
              status={task.status}
              assignedTo={task.assignedTo}
              createdAt={task.createdAt}
              taskId={task.taskId}
            />
          ))
        ) : (
          <p>No tasks available</p>
        )}
      </div>
    </>
  );
};

export default Tasks;
