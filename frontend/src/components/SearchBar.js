import React, { useState, useEffect } from "react";
import "./SearchBar.css";
import axios from "axios";

const SearchBar = ({
  data,
  filteredTodos,
  setFilteredTodos,
  searchQuery,
  setSearchQuery,
}) => {
  const [todos, setTodos] = useState([]);
  const [erroroccured, setErroroccured] = useState(false);

  useEffect(() => {
    setTodos(data);
    setFilteredTodos(data);
    setErroroccured(false);
  }, []);

  useEffect(() => {
    const fetchFilteredTodos = async () => {
      try {
        setErroroccured(false);
        const response = await axios.get(
          `http://localhost:5000/tasks/search?task=${searchQuery.trim()}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        console.log("Response:", response.data);
        setFilteredTodos(response.data);
      } catch (err) {
        setErroroccured(true);
        setFilteredTodos([]);
        console.error("Error fetching tasks:", err.message); // Log the error
      }
    };
    if (searchQuery.trim()) {
      fetchFilteredTodos();
    } else {
      setErroroccured(false);
      setFilteredTodos(data);
    }
  }, [searchQuery]);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <div className="results-container">
        {erroroccured && <p className="no-tasks">No tasks found</p>}
      </div>
    </div>
  );
};

export default SearchBar;
