import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/SignupPage.js";
import SearchBar from "./components/SearchBar.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Signup />} /> {/* Signup page */}
          <Route path="/search" element={<SearchBar />} /> {/* Search page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
