import { Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./TodosList.css";
import axios from "axios";

const TodosList = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [data, setData] = useState([]);
  const [range, setRange] = useState(0);
  const [lengthofpages, setlength] = useState([]);
  const ITEMS_PER_PAGE = 5;

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
  useEffect(() => {
    if (!sessionStorage.getItem("authToken")) {
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
    console.log(e.target.value);
    console.log(item);
    try {
      await axios.put(
        `http://localhost:5000/tasks/${item._id}`,
        {
          task: item.task,
          status: e.target.value,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        }
      );
      fetchData();
    } catch (e) {
      console.log(e);
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
                id={`options-${index}`} // Unique ID for each dropdown
                value={item.status}
                onChange={(e) => {
                  handleStatuschange(e, item);
                }}
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
        {lengthofpages &&
          lengthofpages.length > 0 &&
          lengthofpages.map((item, index) => {
            return (
              <div
                className={`${
                  Math.floor(range / 5) + 1 === index + 1
                    ? "active"
                    : "unactive"
                }`}
                onClick={() => handlePagechange(index)}
                key={index}
              >
                {index + 1}
              </div>
            );
          })}

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
