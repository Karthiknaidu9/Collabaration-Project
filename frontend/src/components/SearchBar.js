import React, { useState } from "react";

const SearchBar = ({ todos, setFilteredTodos }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter todos based on the search query
    const filtered = todos.filter((todo) =>
      todo.task.toLowerCase().includes(query)
    );

    // Update filteredTodos
    setFilteredTodos(filtered);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

export default SearchBar;

