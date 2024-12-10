const express = require("express");
const mongoose = require("mongoose");
const app = express();
const login = require("./routes/login");
const signup = require("./routes/signup");
const addTaskRoute = require("./routes/addTask");
const getTasks = require("./routes/getTasks");
const updateTask = require("./routes/updateTask");
const taskDetails = require("./routes/taskDetails");
const deleteTask = require("./routes/deleteTask");
const getEmail = require("./routes/getEmail");
const cors = require("cors");
const http = require("http"); // Required for integrating Socket.IO
const { Server } = require("socket.io");
require("dotenv").config();

const port = process.env.PORT || 5000; // Fallback to 5000 if not defined
const origin_url = process.env.ORIGIN_URL; // Frontend URL (e.g., http://localhost:3000)
let url = process.env.FULL_URL || "http://localhost:5000"; // Default to localhost if FULL_URL is not set

console.log(
  `Server starting on port: ${port}, Origin URL: ${origin_url}, Full URL: ${url}`
);

const server = http.createServer(app);

// Initialize Socket.IO with CORS options
const io = new Server(server, {
  cors: {
    origin: origin_url, // Allow frontend (e.g., http://localhost:3000) to connect
    methods: ["GET", "POST"],
  },
});
app.set("socketio", io);

// Handling client connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for task updates and emit to all connected clients
  socket.on("taskUpdated", (updatedTask) => {
    console.log("Task updated:", updatedTask);
    io.emit("taskUpdated", updatedTask); // Broadcast task update to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Middleware and routes
app.use(
  cors({
    origin: origin_url, // Frontend URL
    credentials: true, // Allow cookies
  })
);

app.use(express.json());

// Pass `io` to the `addTask` route
addTaskRoute.setSocketInstance(io);
app.use("/addTask", addTaskRoute.router);

app.use("/signup", signup);
app.use("/login", login);
app.use("/getTasks", getTasks);
app.use("/updateTask", updateTask);
app.use("/taskDetails", taskDetails);
app.use("/deleteTask", deleteTask);
app.use("/getEmail", getEmail);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/mydb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Start the server
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
