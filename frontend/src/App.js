import { Route, Routes } from "react-router-dom";
import LoginPage from "./components/Login.jsx";
import "./App.css";
import TodosList from "./components/TodosList.jsx";
import Signup from "./components/SignupTemp.js";
import Profile from "./components/Profile.js";


function App() {
  return (
    <Routes>
      <Route path="/" element={<TodosList />}></Route>
      <Route path="/register" element={<Signup/>}></Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/profile" element={<Profile />}></Route>

    </Routes>
  );
}

export default App;
