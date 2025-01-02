
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login.jsx";
import "./App.css";
import TodosList from "./components/TodosList.jsx";
import Signup from "./components/SignupTemp.js";  



import SearchBar from "./components/SearchBar.js";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TodosList />}></Route>
      <Route path="/register" element={<Signup/>}></Route>
      <Route path="/search" element={<SearchBar/>}></Route>
      <Route path="/login" element={<Login />}></Route>
    </Routes>

  );
}

export default App;
