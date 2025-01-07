const express = require("express");
const Task = require("../models/task");
const authenticateToken = require("../middleware/authMiddleware");
const Joi = require("joi");

const router = express.Router();

const taskschema = Joi.object({
  task: Joi.string()
    .pattern(/^[a-zA-Z][a-zA-Z0-9 _]*$/)
    .min(4)
    .max(30)
    .required()
    .trim()
    .custom((value, helpers) => {
      if (!value || value.trim().length === 0) {
        return helpers.message(
          "Task should not be empty or contain only spaces"
        );
      }
      return value;
    })
    .custom((value, helpers) => {
      const letterCount = value.replace(/[^a-zA-Z]/g, "").length;
      const totalCount = value.length;

      if (letterCount / totalCount < 0.5) {
        return helpers.message("Task should contain at least half letters");
      }

      return value;
    })
    .messages({
      "string.pattern.base":
        "Task should only contain letters, numbers, spaces, and underscores and start with character",
      "string.min": "Task should be at least 4 characters long",
      "string.max": "Task should not exceed 30 characters",
      "string.empty": "Task should not be empty or contain only spaces",
    }),
});
const statusschema = Joi.object({
  status: Joi.string().valid("todo", "doing", "done").required().messages({
    "any.only": "Status must be one of the following: todo, doing, done",
    "string.empty": "Status cannot be empty",
  }),
});

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
    const { error: taskerror } = taskschema.validate({ task: task });
    const { error: statuserror } = statusschema.validate({ status: status });

    if (taskerror) {
      // If validation fails, send a 400 Bad Request with the error message
      console.log("taskerror");
      return res.status(400).send(taskerror.details[0].message);
    }

    if (statuserror) {
      return res.status(400).send(statuserror.details[0].message);
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
    const { error: taskerror } = taskschema.validate({ task: task });
    const { error: statuserror } = statusschema.validate({ status: status });

    if (taskerror) {
      // If validation fails, send a 400 Bad Request with the error message
      console.log("taskerror");
      return res.status(400).send(taskerror.details[0].message);
    }

    if (statuserror) {
      return res.status(400).send(statuserror.details[0].message);
    }

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

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

module.exports = router;
