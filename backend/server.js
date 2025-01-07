const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const profile = require("./routes/profile");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials: true,
};


app.use(cors(corsOptions));


app.use(bodyParser.json());


app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});


const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));


app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/profile", profile);

app.options("*", cors(corsOptions));

app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).send("Something went wrong!");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
