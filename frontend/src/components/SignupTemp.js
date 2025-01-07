import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const validateUsername = (value) => /^[a-zA-Z]+$/.test(value);
  const validateEmail = (value) => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value);
  const validatePassword = (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,22}$/.test(value);

  const handleValidation = (field, value) => {
    let error = "";
    if (field === "username" && !validateUsername(value)) {
      error = "Only alphabets are allowed.";
    } else if (field === "email" && !validateEmail(value)) {
      error = "Invalid email format (no uppercase allowed).";
    } else if (field === "password" && !validatePassword(value)) {
      error =
        "Password must have 1 uppercase, 1 lowercase, 1 number, 1 special character, and be 8-22 characters long.";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

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
        // Clear any previous authToken or session data
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("joinDate");
  
        // Proceed with login after signup
        const loginRes = await axios.post("http://localhost:5000/auth/login", {
          email,
          password,
        });
  
        // Store new authToken and profile data in localStorage
        localStorage.setItem("authToken", loginRes.data.token);
        localStorage.setItem("username", loginRes.data.username);
        localStorage.setItem("email", loginRes.data.email);
        localStorage.setItem("joinDate", loginRes.data.joinDate);
  
        // Redirect to profile or main page after successful signup and login
        navigate("/");
  
        alert("Signup and login successful!");
      } else {
        alert(`Signup failed: ${data.error}`);
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
              onChange={(e) => {
                setUsername(e.target.value);
                handleValidation("username", e.target.value);
              }}
              className={`signup-input ${errors.username ? "error" : "success"}`}
              required
            />
            {errors.username && <p className="error-message">{errors.username}</p>}
            {!errors.username && username && <span className="tick-mark">✔</span>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.toLowerCase());
                handleValidation("email", e.target.value.toLowerCase());
              }}
              className={`signup-input ${errors.email ? "error" : "success"}`}
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
            {!errors.email && email && <span className="tick-mark">✔</span>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                handleValidation("password", e.target.value);
              }}
              className={`signup-input ${errors.password ? "error" : "success"}`}
              required
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
            {!errors.password && password && <span className="tick-mark">✔</span>}
          </div>
          <button type="submit" className="signup-button" disabled={!!Object.values(errors).find((err) => err)}>
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;




