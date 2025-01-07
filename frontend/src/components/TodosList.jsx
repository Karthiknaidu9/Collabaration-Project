import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  
import SearchBar from "./SearchBar";
import { Navigate } from "react-router-dom";
import axios from "axios";
import EditTodo from "./EditTodo";
import DeleteTodo from "./DeleteTodo";
import "./TodosList.css";
import Logout from "./Logout";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { usePopup } from "../contexts/PopupContext";

const TodosList = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
const [joinDate, setJoinDate] = useState("");

  const [data, setData] = useState([]);
  const [range, setRange] = useState(0);
  const [lengthofpages, setLength] = useState([]);
  const [editingTask, setEditingTask] = useState(null); // State for edit modal
  const [deletingTask, setDeletingTask] = useState(null); // State for delete modal
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { showPopup } = usePopup();

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
      showPopup("You need login or signup first....");
      setIsAuthenticated(false);
      return;
    }
  
    fetchData();
  }, []);
  

  useEffect(() => {
    let len = Math.floor(filteredTodos.length / 5);
    // console.log(len + "  len");
    // console.log((len % 5) + "  len%5");
    if (filteredTodos.length - len * 5 !== 0) {
      len++;
    }
    const numbers = Array.from({ length: len }, (_, index) => index + 1);
    setLength(numbers);
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
      fetchData(); // Refresh data after updating status
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const paginatedData = filteredTodos.slice(range, range + ITEMS_PER_PAGE);

  return (
    <div className="container">
      {/* <header>
        <div className="username-display" onClick={navigateToProfile} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
  Profile
</div>

      </header> */}
      <div className="header">
        <h1>List of All TODOS Created</h1>
        <div className="username-display" onClick={navigateToProfile} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
  Profile
</div>
        <Logout setIsAuthenticated={setIsAuthenticated} />
      </div>
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
            <div className="taskname">{task.task}</div>
            <div className="task-actions">
              <div className="buttons">
                <MdEdit
                  className="edit-icon"
                  onClick={() => setEditingTask(task)}
                />
                <MdDelete
                  className="delete-icon"
                  onClick={() => setDeletingTask(task)}
                />
              </div>
              <div className="status-dropdown">
                <select
                  id={`options-${index}`}
                  value={task.status}
                  onChange={(e) => handleStatusChange(e, task)}
                  style={{ marginLeft: "10px", padding: "5px" }}
                  className={`${task.status}`}
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
            setDeletingTask(null);
            setSearchQuery("");
          }}
          onCancel={() => setDeletingTask(null)}
        />
      )}
    </div>
  );
};

export default TodosList;
