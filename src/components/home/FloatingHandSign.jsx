import React from "react";

const ASL_SIGNS = [
  { letter: "A", position: "top-[60px] right-[10%]", delay: "0s", size: 70 },
  { letter: "B", position: "top-[160px] right-[5%]", delay: "0.5s", size: 65 },
  { letter: "C", position: "top-[80px] left-[8%]", delay: "1s", size: 65 },
  { letter: "D", position: "top-[280px] left-[5%]", delay: "1.5s", size: 60 },
  { letter: "I", position: "top-[380px] right-[8%]", delay: "0.8s", size: 60 },
  { letter: "Y", position: "top-[480px] left-[6%]", delay: "0.3s", size: 65 },
];

const HAND_PATHS = {
  A: (
    // Fist with thumb to side (ASL A)
    <g>
      <rect x="14" y="20" width="36" height="30" rx="8" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="14" y="14" width="7" height="14" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="24" y="10" width="7" height="18" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="34" y="10" width="7" height="18" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="44" y="12" width="7" height="16" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="7" y="30" width="10" height="8" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5"/>
    </g>
  ),
  B: (
    // Flat hand fingers up (ASL B)
    <g>
      <rect x="20" y="30" width="24" height="22" rx="6" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="16" y="10" width="7" height="24" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="25" y="8" width="7" height="26" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="34" y="8" width="7" height="26" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="43" y="10" width="7" height="24" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2.5"/>
    </g>
  ),
  C: (
    // Curved C shape (ASL C)
    <g>
      <path d="M42 18 Q20 18 20 32 Q20 46 42 46" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M44 14 Q14 14 14 32 Q14 50 44 50" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/>
    </g>
  ),
  D: (
    // Index pointing up, others curl (ASL D)
    <g>
      <rect x="25" y="8" width="8" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M33 22 Q45 20 45 32 Q45 44 33 44 L22 44 L22 30 Q22 20 33 22" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="14" y="26" width="10" height="8" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5"/>
    </g>
  ),
  I: (
    // Pinky up (ASL I)
    <g>
      <rect x="26" y="24" width="12" height="24" rx="6" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="40" y="8" width="7" height="28" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="14" y="26" width="14" height="10" rx="5" fill="none" stroke="currentColor" strokeWidth="2.5"/>
    </g>
  ),
  Y: (
    // Thumb and pinky out (ASL Y / Shaka)
    <g>
      <rect x="22" y="22" width="20" height="22" rx="6" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="8" y="20" width="18" height="8" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" transform="rotate(-20 8 24)"/>
      <rect x="40" y="8" width="7" height="26" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2.5"/>
    </g>
  ),
};

export default function FloatingHandSigns() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {ASL_SIGNS.map(({ letter, position, delay, size }) => (
        <div
          key={letter}
          className={`absolute ${position}`}
          style={{ animationDelay: delay }}
        >
          <div
            className="float-anim"
            style={{ animationDelay: delay }}
          >
            <div className="relative flex flex-col items-center gap-1">
              <svg
                width={size}
                height={size}
                viewBox="0 0 64 64"
                fill="none"
                className="drop-shadow-sm"
                style={{ color: letter === "A" || letter === "D" || letter === "Y" ? "#8B5CF6" : "#2DD4BF" }}
              >
                {HAND_PATHS[letter] || HAND_PATHS["A"]}
              </svg>
              <span
                className="text-xs font-black tracking-wider"
                style={{ color: letter === "A" || letter === "D" || letter === "Y" ? "#8B5CF6" : "#2DD4BF", opacity: 0.7 }}
              >
                {letter}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}