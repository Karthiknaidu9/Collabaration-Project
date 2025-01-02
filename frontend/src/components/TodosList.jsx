import { Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./TodosList.css";
import axios from "axios";

const TodosList = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [data, setData] = useState([]);
  const [range, setRange] = useState(0);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    if (!sessionStorage.getItem("authToken")) {
      setIsAuthenticated(false);
      return;
    }

    // Fetch the data if token exists
    async function fetchData() {
      try {
        const res = await axios.get("http://localhost:5000/tasks", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        });
        setIsAuthenticated(true);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setIsAuthenticated(false);
      }
    }
    fetchData();
  }, []);

  if (isAuthenticated === false) {
    return <Navigate to={"/login"} />;
  }

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // Get the current page data
  const paginatedData = data.slice(range, range + ITEMS_PER_PAGE);

  return (
    <div className="header">
      <h1>List of All TODOS Created</h1>
      <div className="todos-list">
        {paginatedData.map((item, index) => (
          <div key={index} className="ind-todo">
            <div>{item.task}</div>
            <div>
              <select
                id={`options-${index}`} // Unique ID for each dropdown
                value={item.status}
                onChange={(event) => {}}
                style={{ marginLeft: "10px", padding: "5px" }}
              >
                <option value={item.status}>{item.status}</option>
                {["todo", "doing", "done"]
                  .filter((status) => status !== item.status)
                  .map((status, i) => (
                    <option key={i} value={status}>
                      {status}
                    </option>
                  ))}
              </select>
            </div>
            <div className="buttons">
              <button>Edit</button>
              <button>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          onClick={() => setRange((prev) => Math.max(prev - ITEMS_PER_PAGE, 0))}
          disabled={range === 0}
        >
          &lt;
        </button>
        <button
          onClick={() =>
            setRange((prev) =>
              prev + ITEMS_PER_PAGE < data.length ? prev + ITEMS_PER_PAGE : prev
            )
          }
          disabled={range + ITEMS_PER_PAGE >= data.length}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default TodosList;
