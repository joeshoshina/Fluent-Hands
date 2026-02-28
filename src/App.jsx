import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GestureDemo from "./pages/GestureDemo";
import Blitz from "./components/games/Blitz.jsx";
import Home from "./pages/Home.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<GestureDemo />} />
        <Route path="/games/blitz" element={<Blitz />} />
      </Routes>
    </Router>
  );
}

export default App;
