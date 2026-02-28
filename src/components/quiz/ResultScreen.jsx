import React from "react";
import { motion } from "framer-motion";
import { Trophy, Flame, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ResultsScreen({
  score,
  totalQuestions,
  xpEarned,
  lessonTitle,
}) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const isPerfect = percentage === 100;
  const isPassing = percentage >= 60;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[70vh] px-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="text-7xl mb-6"
      >
        {isPerfect ? "🎉" : isPassing ? "✨" : "💪"}
      </motion.div>

      <h1 className="text-3xl font-black text-gray-900 mb-2">
        {isPerfect ? "Perfect!" : isPassing ? "Great job!" : "Keep practicing!"}
      </h1>
      <p className="text-gray-500 mb-8">{lessonTitle}</p>

      <div className="flex gap-6 mb-10">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-2">
            <Trophy className="w-7 h-7 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-gray-900">
            {percentage}%
          </span>
          <span className="text-xs text-gray-400 font-medium">Score</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-2">
            <Flame className="w-7 h-7 text-violet-500" />
          </div>
          <span className="text-2xl font-black text-gray-900">+{xpEarned}</span>
          <span className="text-xs text-gray-400 font-medium">XP Earned</span>
        </div>
      </div>

      <div className="w-full max-w-xs bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className={`h-full rounded-full ${isPassing ? "bg-gradient-to-r from-violet-500 to-blue-500" : "bg-orange-400"}`}
        />
      </div>
      <p className="text-xs text-gray-400 mb-8">
        {score}/{totalQuestions} correct answers
      </p>

      <Link to={createPageUrl("Home")} className="w-full max-w-xs">
        <button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-6 rounded-xl text-base shadow-lg shadow-violet-200 flex items-center justify-center gap-2">
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </Link>
    </motion.div>
  );
}
