import { Link } from "react-router-dom";
import HeroHeader from "../components/home/HeroHeader";
import FloatingHandSign from "../components/home/FloatingHandSign";
import Challenges from "../components/home/Challenges";

const Home = () => {
  return (
    <div className="min-h-screen bg-white relative">
      <HeroHeader />
      <div className="relative">
        <div className="relative z-0 mb-0">
          <FloatingHandSign />
        </div>
        <div className="relative z-20 -mt-150">
          <Challenges />
        </div>
      </div>
    </div>
  );
};

export default Home;
