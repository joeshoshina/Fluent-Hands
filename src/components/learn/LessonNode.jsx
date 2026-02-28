import React from "react";
import { motion } from "framer-motion";
import { Lock, Check, Star } from "lucide-react";
import ProgressRing from "./ProgressRing";

export default function LessonNode({
  lesson,
  index,
  isLocked,
  isCompleted,
  score,
  onClick,
}) {
  const colors = [
    { bg: "bg-violet-500", ring: "#8B5CF6", glow: "shadow-violet-300" },
    { bg: "bg-blue-500", ring: "#3B82F6", glow: "shadow-blue-300" },
    { bg: "bg-emerald-500", ring: "#10B981", glow: "shadow-emerald-300" },
    { bg: "bg-amber-500", ring: "#F59E0B", glow: "shadow-amber-300" },
    { bg: "bg-rose-500", ring: "#F43F5E", glow: "shadow-rose-300" },
  ];
  const color = colors[index % colors.length];
  const progress = isCompleted ? 100 : 0;

  return (
    <motion.button
      onClick={() => !isLocked && onClick(lesson)}
      whileHover={!isLocked ? { scale: 1.08 } : {}}
      whileTap={!isLocked ? { scale: 0.95 } : {}}
      className={`relative flex flex-col items-center gap-1 ${isLocked ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="relative">
        <ProgressRing
          progress={progress}
          size={72}
          strokeWidth={5}
          color={color.ring}
        />
        <div className={`absolute inset-0 flex items-center justify-center`}>
          <div
            className={`w-14 h-14 rounded-full ${isLocked ? "bg-gray-300" : color.bg} flex items-center justify-center shadow-lg ${!isLocked ? color.glow : ""} shadow-md`}
          >
            {isLocked ? (
              <Lock className="w-5 h-5 text-white" />
            ) : isCompleted ? (
              <Check className="w-6 h-6 text-white" strokeWidth={3} />
            ) : (
              <Star className="w-5 h-5 text-white" />
            )}
          </div>
        </div>
      </div>
      <span
        className={`text-xs font-semibold mt-1 max-w-[80px] text-center leading-tight ${isLocked ? "text-gray-400" : "text-gray-700"}`}
      >
        {lesson.title}
      </span>
      {isCompleted && score !== undefined && (
        <span className="text-[10px] font-bold text-amber-500">{score}%</span>
      )}
    </motion.button>
  );
}
