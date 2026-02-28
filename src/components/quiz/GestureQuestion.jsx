import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HandGestureDetector from "./HandGestureDetector";

export default function GestureQuestion({
  question,
  onAnswer,
  timeLimit = 10,
}) {
  const [overlay, setOverlay] = useState(null); // null | "success" | "timeout"

  const handleSuccess = () => {
    setOverlay("success");
    setTimeout(() => {
      setOverlay(null);
      onAnswer(true);
    }, 1500);
  };

  const handleFail = () => {
    setOverlay("timeout");
    setTimeout(() => {
      setOverlay(null);
      onAnswer(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col items-center w-full"
    >
      <p className="text-lg font-bold text-gray-800 mb-1 text-center">
        Sign this letter!
      </p>
      <p className="text-sm text-gray-400 mb-5 text-center">
        {question.explanation}
      </p>

      {/* Camera with overlays */}
      <div className="relative w-full max-w-2xl mx-auto mb-6">
        <div
          className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-xl"
          style={{ aspectRatio: "4/3" }}
        >
          <HandGestureDetector
            targetLetter={question.correct_answer}
            timeLimit={timeLimit}
            onSuccess={handleSuccess}
            onFail={handleFail}
            minimal={true}
          />

          {/* Success overlay */}
          <AnimatePresence>
            {overlay === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-green-500/90 flex flex-col items-center justify-center gap-4 z-50 rounded-2xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <svg
                    className="w-28 h-28 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </motion.div>
                <h3 className="text-3xl font-black text-white">Perfect!</h3>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timeout overlay */}
          <AnimatePresence>
            {overlay === "timeout" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-red-500/90 flex flex-col items-center justify-center gap-4 z-50 rounded-2xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <svg
                    className="w-28 h-28 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                </motion.div>
                <h3 className="text-3xl font-black text-white">Time's up!</h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
