import React, { useState, useEffect } from "react";
import "./TodosList.css";
import axios from "axios";
import SearchBar from "./SearchBar"; // Import the SearchBar component
import EditTodo from "./EditTodo";
import DeleteTodo from "./DeleteTodo";
import "./TodosList.css";

const TodosList = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [data, setData] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [range, setRange] = useState(0);
  const [lengthofpages, setlength] = useState([]);
  const ITEMS_PER_PAGE = 5;

  async function fetchData() {
    try {
      const res = await axios.get("http://localhost:5000/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setIsAuthenticated(true);
      setData(res.data);
      setFilteredTodos(res.data); // Initialize filteredTodos
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      setIsAuthenticated(false);
      return;
    }
    fetchData();
  }, []);

  useEffect(() => {
    let len = Math.floor(data.length / 5);
    if (len % 5 !== 0) {
      len++;
    }
    const numbers = Array.from({ length: len }, (_, index) => index + 1);
    setlength(numbers);
    // console.log(numbers);
  }, [data]);

  if (isAuthenticated === false) {
    return <Navigate to={"/login"} />;
  }

  if (isAuthenticated === null || data.length === 0) {
    return <div>Loading...</div>;
  }

  // Get the current page data
  function handlePagechange(ind) {
    console.log(ind);
    setRange(ind * 5);
  }
  async function handleStatuschange(e, item) {
    try {
      const newStatus = e.target.value;
      await axios.put(
        `http://localhost:5000/tasks/${item._id}`,
        { task: item.task, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      fetchData(); // Refresh data after updating status
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }
  const paginatedData = data.slice(range, range + ITEMS_PER_PAGE);
  console.log(range);
  return (
    <div className="container">
      <h1>List of All TODOS Created</h1>
      <div className="todos-list">
        {paginatedData.map((item, index) => (
          <div key={index} className="ind-todo">
            <div>{item.task}</div>
            <div>
              <select
                id={`options-${index}`}
                value={item.status}
                onChange={(e) => handleStatuschange(e, item)}
                style={{ marginLeft: "10px", padding: "5px" }}
                className={`${item.status}`}
              >
                <option value={item.status}>{item.status}</option>
                {["todo", "doing", "done"]
                  .filter((status) => status !== item.status)
                  .map((status, i) => (
                    <option key={i} value={status} className={`${status}`}>
                      {status}
                    </option>
                  ))}
              </select>
            </div>
            <div className="buttons">
              <button onClick={() => setEditingTask(item)}>Edit</button>
              <button onClick={() => setDeletingTask(item)}>Delete</button>
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
        {lengthofpages.map((item, index) => (
          <div
            className={`${
              Math.floor(range / ITEMS_PER_PAGE) + 1 === index + 1
                ? "active"
                : "unactive"
            }`}
            onClick={() => handlePageChange(index)}
            key={index}
          >
            {index + 1}
          </div>
        ))}
        <button
          onClick={() =>
            setRange((prev) =>
              prev + ITEMS_PER_PAGE < filteredTodos.length
                ? prev + ITEMS_PER_PAGE
                : prev
            )
          }
          disabled={range + ITEMS_PER_PAGE >= filteredTodos.length}
        >
          &gt;
        </button>
      </div>

      {/* EditTodo Modal */}
      {editingTask && (
        <EditTodo
          task={editingTask}
          onSave={() => {
            fetchData();
            setEditingTask(null);
          }}
          onCancel={() => setEditingTask(null)}
        />
      )}

      {/* DeleteTodo Modal */}
      {deletingTask && (
        <DeleteTodo
          task={deletingTask}
          onDeleteSuccess={() => {
            fetchData();
            setDeletingTask(null);
          }}
          onCancel={() => setDeletingTask(null)}
        />
      )}
    </div>
  );
};

export default TodosList;


