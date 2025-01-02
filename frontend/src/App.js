import { Route, Routes } from "react-router-dom";
import Login from "./components/Login.jsx";
import "./App.css";
import TodosList from "./components/TodosList.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TodosList />}></Route>
      <Route path="/login" element={<Login />}></Route>
    </Routes>
  );
}

export default App;
