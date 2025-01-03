import React, { useState, useEffect } from "react";

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
    <div className="p-4">
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="mt-4">
        {filteredTodos.length === 0 && (
          <p className="text-gray-500">No tasks found</p>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

