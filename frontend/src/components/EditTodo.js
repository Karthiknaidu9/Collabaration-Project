import React, { useState } from "react";
import axios from "axios";
import "./Edit.css";


const EditTodo = ({ task, onSave, onCancel }) => {
  const [newTaskValue, setNewTaskValue] = useState(task.task);

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/tasks/${task._id}`,
        {
          task: newTaskValue,
          status: task.status,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
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
          onChange={(e) => setNewTaskValue(e.target.value)}
          className="textarea"
        />
        <div className="modal-buttons">
          <button onClick={handleSave} className="btn-save">
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

