import React, { useState } from "react";
import "./Logout.css";

const Logout = ({ setIsAuthenticated }) => {
  const [showpopup, setShowPopUp] = useState(false);
  function handleClick(e) {
    if (localStorage.getItem("authToken")) {
      localStorage.removeItem("authToken");
    }
    setIsAuthenticated(false);
    // console.log("clicked");
  }
  return (
    <div>
      <div
        onClick={(e) => {
          setShowPopUp(true);
        }}
        className="logout-button"
      >
        Logout
      </div>
      {showpopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="delete-heading">Are you sure you want logout?</h2>
            <div className="modal-buttons">
              <button
                onClick={(e) => {
                  handleClick(e);
                }}
                className="btn-delete"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => {
                  setShowPopUp(false);
                }}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logout;
