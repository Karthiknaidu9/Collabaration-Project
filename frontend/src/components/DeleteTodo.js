import React from "react";
import axios from "axios";
import "./Delete.css";

const DeleteTodo = ({ task, onDeleteSuccess, onCancel, setSearchQuery }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${task._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setSearchQuery(""); 
      onDeleteSuccess();
    } catch (e) {
      console.log("Error deleting task:", e);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Are you sure you want to delete this task?</h2>
        <div className="modal-buttons">
          <button onClick={handleDelete} className="btn-delete">
            Yes, Delete
          </button>
          <button onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTodo;


