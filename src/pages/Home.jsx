import { Link } from "react-router-dom";
import HeroHeader from "../components/home/HeroHeader";
import FloatingHandSign from "../components/home/FloatingHandSign";
import Challenges from "../components/home/Challenges";

const Home = () => {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url(/landing-background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
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
    </div>
  );
};

export default Home;
