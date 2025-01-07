import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePopup } from "../contexts/PopupContext";
import "./Login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { showPopup } = usePopup();

  const isLoggedIn = localStorage.getItem("authToken");

  const validateEmail = (email) => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,22}$/;
    return passwordRegex.test(password);
  };

  useEffect(() => {
    if (isLoggedIn) {
      showPopup("You have already logged in....");
    }
  }, []);

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

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
  // if (localStorage.getItem("authToken")) {
  //   showPopup("You have ready loggedin....");
  //   return <Navigate to={"/"} />;
  // }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="Login-container">
      <div className="Login-Block">
        <h1 className="Login-heading">Login</h1>
        <form onSubmit={handleLoginSubmit}>
          <input
            type="text"
            placeholder="Karthik"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)} // Update username
            className="Login-input"
          />
          {emailError && <p className="error-message">{emailError}</p>}
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)} // Update password
            className="Login-input"
          />
          {passwordError && <p className="error-message">{passwordError}</p>}
          <button className="Login-Button">Login</button>
          <div className="register-nav">
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
