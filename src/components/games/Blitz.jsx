import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Trophy, X } from "lucide-react";
import HandGestureDetector from "../quiz/HandGestureDetector";

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function getRandomLetters(count) {
  const shuffled = [...ALL_LETTERS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const Blitz = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("playing"); // playing | gameOver
  const [letters, setLetters] = useState(() => getRandomLetters(10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3.0);
  const [cue, setCue] = useState(null);
  const keyRef = useRef(0);
  const timerRef = useRef(null);

  const currentLetter = letters[currentIndex];
  const isGameOver = lives === 0 || currentIndex >= letters.length;

  // Timer countdown
  useEffect(() => {
    if (gameState !== "playing" || cue) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 0.1;
        if (newTime <= 0) {
          handleTimeout();
          return 3.0;
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [gameState, cue, currentIndex]);

  // Check game over
  useEffect(() => {
    if (isGameOver && gameState === "playing") {
      setGameState("gameOver");
      saveProgress();
    }
  }, [isGameOver, gameState]);

  const handleTimeout = () => {
    setLives((prev) => Math.max(0, prev - 1));
    showCue("fail");
  };

  const showCue = (type) => {
    if (cue) return;
    setCue(type);
    clearInterval(timerRef.current);

    setTimeout(() => {
      setCue(null);
      setCurrentIndex((i) => i + 1);
      setTimeLeft(3.0);
      keyRef.current += 1;
    }, 1000);
  };

  const handleSuccess = () => {
    setScore((prev) => prev + 1);
    showCue("pass");
  };

  const handleFail = () => {
    setLives((prev) => Math.max(0, prev - 1));
    showCue("fail");
  };

  const saveProgress = () => {
    const totalQuestions = letters.length;
    const progress = Math.round((score / totalQuestions) * 100);
    localStorage.setItem("blitzProgress", progress.toString());
  };

  const restartGame = () => {
    setLetters(getRandomLetters(10));
    setCurrentIndex(0);
    setLives(3);
    setScore(0);
    setTimeLeft(3.0);
    setCue(null);
    setGameState("playing");
    keyRef.current += 1;
  };

  if (gameState === "gameOver") {
    const progress = Math.round((score / letters.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
        >
          <div className="text-center">
            <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-500" />
            <h1 className="text-4xl font-black text-gray-800 mb-2">
              Game Over!
            </h1>
            <div className="text-6xl font-black text-purple-600 mb-6">
              {score}/{letters.length}
            </div>
            <div className="bg-gray-100 rounded-2xl p-4 mb-6">
              <div className="text-sm text-gray-600 mb-2">Progress</div>
              <div className="text-3xl font-bold text-gray-800">
                {progress}%
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={restartGame}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
              >
                Play Again
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
              >
                Home
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header with Lives and Score */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-8 h-8 ${
                  i < lives
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400 opacity-50"
                }`}
              />
            ))}
          </div>
          <div className="text-white text-2xl font-black">
            {score}/{letters.length}
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-white hover:text-gray-300 transition"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Current Letter and Timer */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-4xl font-black">
              Sign: {currentLetter}
            </h1>
            <div className="text-right">
              <div className="text-white/70 text-sm">Time Left</div>
              <div
                className={`text-3xl font-black ${
                  timeLeft <= 1 ? "text-red-300" : "text-white"
                }`}
              >
                {timeLeft.toFixed(1)}s
              </div>
            </div>
          </div>
          <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                timeLeft <= 1 ? "bg-red-500" : "bg-green-400"
              }`}
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / 3.0) * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="text-center text-white/70 text-sm mb-4">
          Question {currentIndex + 1} of {letters.length}
        </div>

        {/* Camera or Feedback */}
        <AnimatePresence mode="wait">
          {!cue ? (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative rounded-2xl overflow-hidden bg-black shadow-2xl"
            >
              <div style={{ aspectRatio: "4/3" }}>
                <HandGestureDetector
                  key={keyRef.current}
                  targetLetter={currentLetter}
                  onSuccess={handleSuccess}
                  onFail={handleFail}
                  timeLimit={3}
                  minimal={true}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="feedback"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`rounded-2xl flex items-center justify-center text-white text-8xl font-black shadow-2xl ${
                cue === "pass" ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ aspectRatio: "4/3" }}
            >
              {cue === "pass" ? "✓" : "✗"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Blitz;
