const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Ensure CORs is set properly for both HTTP requests and WebSockets (Socket.io)
const corsOptions = {
  origin: process.env.ORIGIN_URL, // Frontend URL
  methods: ["GET", "POST"],
  credentials: true, // Allow cookies
};

const io = new Server(server, {
  cors: corsOptions, // Socket.io CORS
});

app.set("socketio", io);

// Middleware
app.use(
  cors(corsOptions) // Express CORS
);
app.use(express.json());

// Define Routes
app.use("/login", require("./routes/login"));
app.use("/signup", require("./routes/signup"));
app.use("/getTasks", require("./routes/getTasks"));
app.use("/updateTask", require("./routes/updateTask"));
app.use("/taskDetails", require("./routes/taskDetails"));
app.use("/deleteTask", require("./routes/deleteTask"));
app.use("/getEmail", require("./routes/getEmail"));

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

module.exports = (req, res) => {
  server.emit("request", req, res);
};
