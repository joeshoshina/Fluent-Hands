import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TestEntry from "../games/TestEntry";

const GAME_MODES = [
  {
    id: "practice",
    label: "Practice",
    progressKey: "practiceProgress",
    color: "bg-emerald-600 hover:bg-emerald-500",
    textColor: "text-emerald-400",
    route: "/games/practice",
  },
  {
    id: "blitz",
    label: "Blitz",
    progressKey: "blitzProgress",
    color: "bg-purple-600 hover:bg-purple-500",
    textColor: "text-purple-400",
    route: "/games/blitz",
  },
  {
    id: "words",
    label: "Words",
    progressKey: "wordsProgress",
    color: "bg-[#00BBBB] hover:bg-[#00A2A2]",
    textColor: "text-[#00DDDD]",
    route: "/games/words",
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
    <div className="relative w-full py-16 md:py-24 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative flex flex-col items-center gap-20">
          {GAME_MODES.map((mode, index) => {
            // Calculate Zig-Zag offset:
            // Even (0, 2): -60px (Left) | Odd (1, 3): 60px (Right)
            const isRight = index % 2 !== 0;
            const offset = isRight
              ? "translate-x-16 md:translate-x-24"
              : "-translate-x-16 md:-translate-x-24";

            return (
              <div
                key={mode.id}
                className={`relative transition-all duration-500 ${offset}`}
              >
                {/* Connecting Line (Angled for Zig-Zag) */}
                {index < GAME_MODES.length - 1 && (
                  <div
                    className={`absolute top-[70%] w-[3px] h-55 origin-top rounded-full -z-10 animate-dash-flow
            ${isRight ? "rotate-[45deg]" : "-rotate-[50deg]"}`}
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to bottom, rgba(208,234,147,0.95) 0 10px, rgba(208,234,147,0) 10px 18px)",
                      backgroundSize: "100% 28px",
                      /* If current node is LEFT (isRight = false), lean RIGHT (rotate 35)
            If current node is RIGHT (isRight = true), lean LEFT (rotate -35)
            */
                      left: "50%",
                      marginLeft: "-10px", // Centers the line perfectly under the node
                      boxShadow:
                        "0 0 12px rgba(208,234,147,0.6), 0 0 24px rgba(208,234,147,0.3)",
                    }}
                  />
                )}

                {/* Game node */}
                <div className="relative z-10">
                  <TestEntry
                    label={mode.label}
                    progress={progress[mode.id] || 0}
                    color={mode.color}
                    textColor={mode.textColor}
                    hoverSpriteSrc="/hacker-sprite.svg"
                    hoverSpriteAlt={`${mode.label} level sprite`}
                    onClick={() => navigate(mode.route)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-12px); }
      }

      @keyframes dashFlow {
        0% { background-position: 0 0; }
        100% { background-position: 0 56px; }
      }

      .animate-dash-flow {
        animation: dashFlow 1.6s linear infinite;
      }
    `}</style>
    </div>
  );
};

export default Challenges;
