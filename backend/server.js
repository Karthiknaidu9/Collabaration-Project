const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
