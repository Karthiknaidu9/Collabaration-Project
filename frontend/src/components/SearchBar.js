import React, { useState, useEffect } from "react";
import "./SearchBar.css";

const SearchBar = ({
  data,
  filteredTodos,
  setFilteredTodos,
  searchQuery,
  setSearchQuery,
}) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    setTodos(data);
    setFilteredTodos(data);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTodos(todos);
    } else {
      setFilteredTodos(
        todos.filter((todo) =>
          todo.task.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, todos]);
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
        {filteredTodos.length === 0 && (
          <p className="no-tasks">No tasks found</p>
        )}
      </div>
    </div>
  );
};

export default SearchBar;