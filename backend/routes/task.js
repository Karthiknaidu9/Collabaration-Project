const express = require("express");
const Task = require("../models/task");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { task, status } = req.body;

    if (!task) {
      return res.status(400).json({ error: "Task is required" });
    }

    const newTask = new Task({ task, status });
    await newTask.save();

    res.status(201).json(newTask);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error adding task" });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { task, status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { task, status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "Error updating task" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

module.exports = router;
