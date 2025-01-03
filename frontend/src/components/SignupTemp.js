import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Signup.css'; 
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Signup username:", username, "email:", email, "password:", password);

    // After successful signup (e.g., after calling an API), navigate to the next page
    navigate("/search"); // Redirect to the search page
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <div>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="signup-input"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="signup-input"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="signup-input"
            />
          </div>
          <button
            type="submit"
            className="signup-button"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;