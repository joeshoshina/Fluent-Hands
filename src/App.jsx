import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GestureDemo from "./pages/GestureDemo";
import TestEntry from "./components/games/TestEntry";
import Home from "./pages/Home.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<GestureDemo />} />
      </Routes>
    </Router>
  );
}

export default App;
