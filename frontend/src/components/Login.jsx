import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/; 
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,22}$/; 
    return passwordRegex.test(password);
  };

  async function handleLoginSubmit(ev) {
    ev.preventDefault();

    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("Invalid email format (lowercase only).");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be 8-22 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character."
      );
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) return;

    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("username", res.data.username); 
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("joinDate", res.data.joinDate);
      alert("Login successful");
      setRedirect(true);
    } catch (e) {
      console.log(e);
      alert("Login failed");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="Login-container">
      <div className="Login-Block">
        <h1 className="Login-heading">Login</h1>
        <form onSubmit={handleLoginSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className={`Login-input ${emailError ? "error-border" : ""}`}
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              className={`Login-input ${passwordError ? "error-border" : ""}`}
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
          <button className="Login-Button">Login</button>
          <div>
            Don't have an account yet?{" "}
            <Link className="underline text-black" to={"/register"}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

