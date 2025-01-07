import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  
import SearchBar from "./SearchBar";
import { Navigate } from "react-router-dom";
import axios from "axios";
import EditTodo from "./EditTodo";
import DeleteTodo from "./DeleteTodo";
import "./TodosList.css";

const TodosList = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
const [joinDate, setJoinDate] = useState("");

  const [data, setData] = useState([]);
  const [range, setRange] = useState(0);
  const [lengthofpages, setLength] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const ITEMS_PER_PAGE = 5;

  // For navigation to profile
  const navigate = useNavigate();  // Using useNavigate hook

  const navigateToProfile = () => {
    navigate("/profile", { state: { username, email, joinDate } });
  };

  async function fetchData() {
    try {
      const res = await axios.get("http://localhost:5000/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setIsAuthenticated(true);
      setData(res.data);
      setFilteredTodos(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedJoinDate = localStorage.getItem("joinDate");
  
    if (storedUsername) {
      setUsername(storedUsername);
    }
    
    if (storedEmail) {
      setEmail(storedEmail);  // Assuming you have a setEmail state to store the email
    }
  
    if (storedJoinDate) {
      setJoinDate(storedJoinDate);  // Assuming you have a setJoinDate state to store the join date
    }
  
    if (!localStorage.getItem("authToken")) {
      setIsAuthenticated(false);
      return;
    }
  
    fetchData();
  }, []);
  

  useEffect(() => {
    const totalPages = Math.ceil(filteredTodos.length / ITEMS_PER_PAGE);
    setLength(Array.from({ length: totalPages }, (_, i) => i + 1));
    setRange(0);
  }, [filteredTodos]);

  useEffect(() => {
    if (searchQuery.length === 0) {
      setFilteredTodos(data);
    }
  }, [searchQuery]);

  if (isAuthenticated === false) {
    return <Navigate to={"/login"} />;
  }

  if (isAuthenticated === null || data.length === 0) {
    return <div>Loading...</div>;
  }

  const handlePageChange = (index) => {
    setRange(index * ITEMS_PER_PAGE);
  };

  const handleStatusChange = async (e, task) => {
    try {
      const newStatus = e.target.value;
      await axios.put(
        `http://localhost:5000/tasks/${task._id}`,
        { task: task.task, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const paginatedData = filteredTodos.slice(range, range + ITEMS_PER_PAGE);

  return (
    <div className="container">
      <header>
        {/* Make the username clickable to navigate to the profile */}
        <div className="username-display" onClick={navigateToProfile} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
  Profile
</div>

      </header>
      <h1>List of All TODOS Created</h1>
      <SearchBar
        filteredTodos={filteredTodos}
        setFilteredTodos={setFilteredTodos}
        data={data}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="todos-list">
        {paginatedData.map((task, index) => (
          <div key={index} className="ind-todo">
            <div>{task.task}</div>
            <div>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e, task)}
                className={`${task.status}`}
                style={{ marginLeft: "10px", padding: "5px" }}
              >
                <option value={task.status}>{task.status}</option>
                {["todo", "doing", "done"]
                  .filter((status) => status !== task.status)
                  .map((status, i) => (
                    <option key={i} value={status} className={`${status}`}>
                      {status}
                    </option>
                  ))}
              </select>
            </div>
            <div className="buttons">
              <button onClick={() => setEditingTask(task)}>Edit</button>
              <button onClick={() => setDeletingTask(task)}>Delete</button>
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
        {lengthofpages.map((page, index) => (
          <div
            key={index}
            className={`${
              Math.floor(range / ITEMS_PER_PAGE) + 1 === page ? "active" : "unactive"
            }`}
            onClick={() => handlePageChange(index)}
          >
            {page}
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
      {deletingTask && (
        <DeleteTodo
          task={deletingTask}
          onDeleteSuccess={() => {
            fetchData();
            setFilteredTodos(data);
            setDeletingTask(null);
          }}
          onCancel={() => setDeletingTask(null)}
        />
      )}
    </div>
  );
};

export default TodosList;





