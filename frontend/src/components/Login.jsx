import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePopup } from "../contexts/PopupContext";
import "./Login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { showPopup } = usePopup();

  const isLoggedIn = localStorage.getItem("authToken");

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
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      localStorage.setItem("authToken", res.data.token);
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
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)} // Update password
            className="Login-input"
          />
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
