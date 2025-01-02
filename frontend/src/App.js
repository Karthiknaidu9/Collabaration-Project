<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/SignupPage.js";
=======
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login.jsx";
import "./App.css";
import TodosList from "./components/TodosList.jsx";
import Signup from "./components/signup.js";
>>>>>>> karthik_feature_branch
import SearchBar from "./components/SearchBar.js";

function App() {
  return (
<<<<<<< HEAD
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Signup />} /> {/* Signup page */}
          <Route path="/search" element={<SearchBar />} /> {/* Search page */}
        </Routes>
      </div>
    </Router>
=======
    <Routes>
      <Route path="/" element={<TodosList />}></Route>
      <Route path="/register" element={<Signup/>}></Route>
      <Route path="/search" element={<SearchBar/>}></Route>
      <Route path="/login" element={<Login />}></Route>
    </Routes>
>>>>>>> karthik_feature_branch
  );
}

export default App;
