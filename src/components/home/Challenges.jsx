import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TestEntry from "../games/TestEntry";

const GAME_MODES = [
  {
    id: "blitz",
    label: "Blitz",
    progressKey: "blitzProgress",
    color: "bg-purple-600 hover:bg-purple-500",
    route: "/games/blitz",
  },
  {
    id: "practice",
    label: "Practice",
    progressKey: "practiceProgress",
    color: "bg-blue-600 hover:bg-blue-500",
    route: "/games/practice",
  },
  {
    id: "challenge",
    label: "Challenge",
    progressKey: "challengeProgress",
    color: "bg-emerald-600 hover:bg-emerald-500",
    route: "/games/challenge",
  },
];

const Challenges = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const loadProgress = () => {
      const newProgress = {};
      GAME_MODES.forEach((mode) => {
        const saved = localStorage.getItem(mode.progressKey);
        newProgress[mode.id] = saved ? parseInt(saved, 10) : 0;
      });
      setProgress(newProgress);
    };

    loadProgress();
    window.addEventListener("focus", loadProgress);
    return () => window.removeEventListener("focus", loadProgress);
  }, []);

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
                  progress={progress[mode.id] || 0}
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
