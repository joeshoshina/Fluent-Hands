import { useNavigate } from "react-router-dom";
import TestEntry from "../games/TestEntry";

const GAME_MODES = [
  {
    id: "practice",
    label: "Practice",
    progress: 35,
    color: "bg-purple-600 hover:bg-purple-500",
    route: "/games/blitz",
  },
  {
    id: "blitz",
    label: "Blitz",
    progress: 60,
    color: "bg-blue-600 hover:bg-blue-500",
    route: "/games/practice",
  },
  {
    id: "challenge",
    label: "Challenge",
    progress: 0,
    color: "bg-emerald-600 hover:bg-emerald-500",
    route: "/games/challenge",
  },
];

const Challenges = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Graph nodes with connecting lines */}
        <div className="relative flex flex-col items-center gap-12">
          {GAME_MODES.map((mode, index) => (
            <div key={mode.id} className="relative">
              {/* Animated connecting line to next node */}
              {index < GAME_MODES.length - 1 && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 w-1 h-12 origin-top">
                  <div
                    className="w-full h-full bg-gradient-to-b from-gray-300 to-gray-400 rounded-full animate-pulse"
                    style={{
                      animationDelay: `${index * 0.3}s`,
                      animationDuration: "2s",
                    }}
                  />
                </div>
              )}

              {/* Game node */}
              <div
                className="transform transition-transform hover:scale-105"
                style={{
                  animation: `float 3s ease-in-out infinite`,
                  animationDelay: `${index * 0.5}s`,
                }}
              >
                <TestEntry
                  label={mode.label}
                  progress={mode.progress}
                  color={mode.color}
                  onClick={() => navigate(mode.route)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default Challenges;
