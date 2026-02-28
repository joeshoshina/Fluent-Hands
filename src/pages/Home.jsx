import { Link } from "react-router-dom";
import HeroHeader from "../components/home/HeroHeader";
import FloatingHandSign from "../components/home/FloatingHandSign";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroHeader />
      <FloatingHandSign /> 
    </div>
  );
};

export default Home;
