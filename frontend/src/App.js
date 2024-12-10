import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Tasks from "./components/Tasks/Tasks";
import Navbar from "./components/Navbar/Navbar";
import AddTask from "./components/AddTask/AddTask";
import TaskDetail from "./components/TaskDetail/TaskDetail";
import Update from "./components/Update/Update";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Tasks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/addTask" element={<AddTask />} />
        <Route path="/taskDetail/:id" element={<TaskDetail />} />
        <Route path="/tasks/:taskId/update" element={<Update />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
