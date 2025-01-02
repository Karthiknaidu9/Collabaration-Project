import { Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  console.log(email + " working");

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      sessionStorage.setItem("authToken", res.data.token);
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
          <input
            type="text"
            placeholder="Karthik"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)} // Update username
            className="Login-input"
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)} // Update password
            className="Login-input"
          />
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
