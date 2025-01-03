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

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Signup successful:", data.message);
        // Redirect or navigate to another page if needed
        try {
          const res = await axios.post("http://localhost:5000/auth/login", {
            email,
            password,
          });
          localStorage.setItem("authToken", res.data.token);
          alert("signup successful");
        } catch (e) {
          console.log(e);
          alert("signup failed");
        }
        navigate("/");
      } else {
        console.error("Signup error:", data.error);
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
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


