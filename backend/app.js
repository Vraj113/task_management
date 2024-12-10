const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN_URL, // Allow frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: process.env.ORIGIN_URL, // Allow requests from the frontend
    methods: ["GET", "POST", "OPTIONS"], // Allow necessary methods
    credentials: true, // Allow cookies if needed
  })
);

app.use(express.json());

// Define routes (login, signup, etc.)
app.use("/login", require("./routes/login"));
app.use("/signup", require("./routes/signup"));
// Add other routes...

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
server.listen(process.env.PORT || 5000, () => {
  console.log("App listening on port 5000");
});
