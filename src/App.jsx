import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GestureDemo from "./pages/GestureDemo";
import Blitz from "./components/games/Blitz.jsx";
import Practice from "./components/games/Practice.jsx";
import Words from "./components/games/Words.jsx";
import Home from "./pages/Home.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<GestureDemo />} />
        <Route path="/games/blitz" element={<Blitz />} />
        <Route path="/games/practice" element={<Practice />} />
        <Route path="/games/words" element={<Words />} />
      </Routes>
    </Router>
  );
}

export default App;
