import React, { useState, useEffect } from "react";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch("http://localhost:5000/tasks", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTodos(data);
        setFilteredTodos(data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setIsAuthenticated(false);
      }
    };

    fetchTodos();
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
        {filteredTodos.map((todo) => (
          <div
            key={todo._id}
            className="p-2 bg-gray-100 border-b"
          >
            {todo.task} - <span className="text-gray-500">{todo.status}</span>
          </div>
        ))}
        {filteredTodos.length === 0 && (
          <p className="text-gray-500">No tasks found</p>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
