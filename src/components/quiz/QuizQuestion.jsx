import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export default function QuizQuestion({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const isCorrect = selected === question.correct_answer;

  const handleSelect = (option) => {
    if (showResult) return;
    setSelected(option);
  };

  const handleCheck = () => {
    setShowResult(true);
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelected(null);
      setShowResult(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col items-center w-full max-w-lg mx-auto"
    >
      <p className="text-lg font-bold text-gray-800 mb-2 text-center">
        What sign is this?
      </p>
      <p className="text-sm text-gray-500 mb-6 text-center">
        {question.prompt}
      </p>

      {question.image_url && (
        <div className="w-56 h-56 rounded-2xl bg-gradient-to-br from-violet-50 to-blue-50 border-2 border-violet-100 flex items-center justify-center mb-8 overflow-hidden shadow-inner">
          <img
            src={question.image_url}
            alt="Sign language gesture"
            className="w-full h-full object-contain p-3"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML =
                '<div class="text-6xl">🤟</div>';
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 w-full mb-6">
        {question.options?.map((option) => {
          let borderClass =
            "border-gray-200 hover:border-violet-300 hover:bg-violet-50";
          if (selected === option && !showResult) {
            borderClass =
              "border-violet-500 bg-violet-50 ring-2 ring-violet-200";
          }
          if (showResult && option === question.correct_answer) {
            borderClass = "border-green-500 bg-green-50 ring-2 ring-green-200";
          }
          if (showResult && selected === option && !isCorrect) {
            borderClass = "border-red-500 bg-red-50 ring-2 ring-red-200";
          }

          return (
            <motion.button
              key={option}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(option)}
              className={`px-4 py-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${borderClass}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-full text-sm font-bold ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {isCorrect
              ? "Correct!"
              : `Correct answer: ${question.correct_answer}`}
          </motion.div>
        )}
      </AnimatePresence>

      {!showResult && (
        <button
          onClick={handleCheck}
          disabled={!selected}
          className="w-full max-w-xs bg-violet-600 hover:bg-violet-700 text-white font-bold py-6 rounded-xl text-base disabled:opacity-40 shadow-lg shadow-violet-200 disabled:cursor-not-allowed"
        >
          Check
        </button>
      )}
    </motion.div>
  );
}
