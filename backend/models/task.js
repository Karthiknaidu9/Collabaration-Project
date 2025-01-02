const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  status: { type: String, enum: ["todo", "doing", "done"], default: "todo" },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
