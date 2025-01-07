import React, { createContext, useState, useContext, useEffect } from "react";
import "./popup.css";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [popup, setPopup] = useState({ message: "", visible: false });

  const showPopup = (message) => {
    setPopup({ message, visible: true });

    setTimeout(() => {
      setPopup({ message: "", visible: false });
    }, 5000);
  };

  const hidePopup = () => {
    setPopup({ message: "", visible: false });
  };

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      {popup.visible && (
        <div className="popup-container">
          <div className="popup">
            <span>{popup.message}</span>
            <button className="popup-close" onClick={hidePopup}>
              ✖
            </button>
          </div>
        </div>
      )}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
