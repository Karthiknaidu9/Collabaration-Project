import React, { useState } from "react";
import axios from "axios";
import "./Edit.css";

const EditTodo = ({ task, onSave, onCancel }) => {
  const [newTaskValue, setNewTaskValue] = useState(task.task);
  const [error, setError] = useState("");

  const validateInput = (value) => {
    const specialCharRegex = /[^\w\s]/; // Matches any character that is not a letter, digit, whitespace, or underscore
    if (specialCharRegex.test(value)) {
      setError("Task cannot contain special characters.");
      return false;
    }
    if (value.trim() === "") {
      setError("Task cannot be empty.");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (validateInput(value) || value === "") {
      setNewTaskValue(value);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/tasks/${task._id}`,
        {
          task: newTaskValue.trim(),
          status: task.status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      onSave();
    } catch (e) {
      console.log("Error updating task:", e);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Task</h2>
        <textarea
          value={newTaskValue}
          onChange={handleChange}
          className={`textarea ${error ? "error-border" : ""}`}
        />
        {error && <p className="error-message">{error}</p>}
        <div className="modal-buttons">
          <button
            onClick={handleSave}
            className="btn-save"
            disabled={!newTaskValue.trim() || error}
          >
            Save
          </button>
          <button onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTodo;


