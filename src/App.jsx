import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GestureDemo from "./pages/GestureDemo";
import TestEntry from "./components/games/TestEntry";
import "./App.css";

function App() {
  return (
    <div>
      <GestureDemo />
      <TestEntry />
    </div>
  );
}

export default App;
