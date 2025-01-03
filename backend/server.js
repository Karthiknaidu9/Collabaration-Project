const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicit methods
  allowedHeaders: ["Content-Type", "Authorization"], // Necessary headers
  credentials: true, // Allow credentials (cookies, etc.)
};

// Apply CORS middleware before routing
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Debugging middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// MongoDB connection setup
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Route setup
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Handle preflight requests for all routes (before routing)
app.options("*", cors(corsOptions));

// Default error handler for debugging
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



