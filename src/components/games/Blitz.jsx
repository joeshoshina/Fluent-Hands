// React imports for component, state management, and side effects
import React, { useState, useRef, useEffect } from "react";
// Framer Motion for animations (entry/exit transitions, scale effects)
import { motion, AnimatePresence } from "framer-motion";
// React Router for navigation back to home
import { useNavigate } from "react-router-dom";
// Lucide React icons: Heart (lives), Trophy (game over), X (exit button)
import { Heart, Trophy, X } from "lucide-react";
// Custom component that integrates camera + MediaPipe hand detection
import HandGestureDetector from "../quiz/HandGestureDetector";

// All 26 letters A-Z split into array for random selection
const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/**
 * getRandomLetters - Generates random unique letters for the game
 * @param {number} count - How many letters to generate (default 10 for Blitz)
 * @returns {Array<string>} - Array of random letters
 *
 * How it works:
 * 1. Create copy of ALL_LETTERS to avoid mutating original
 * 2. Shuffle using sort with random comparator (Fisher-Yates would be better but this works)
 * 3. Take first `count` letters from shuffled array
 */
function getRandomLetters(count) {
  const shuffled = [...ALL_LETTERS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
const amount = 10;

const Blitz = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("playing");
  const [letters, setLetters] = useState(() => getRandomLetters(amount));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3.0);
  const [cue, setCue] = useState(null);

  const keyRef = useRef(0);
  const timerRef = useRef(null);

  const cueRef = useRef(null);

  const currentLetter = letters[currentIndex];
  const isGameOver = lives === 0 || currentIndex >= letters.length;

  useEffect(() => {
    if (gameState !== "playing" || cueRef.current) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = parseFloat((prev - 0.1).toFixed(1));
        return newTime <= 0 ? 0 : newTime;
      });
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [gameState, cue, currentIndex]); // cue dep still restarts timer after feedback

  useEffect(() => {
    if (timeLeft <= 0 && gameState === "playing") {
      handleTimeout();
    }
  }, [timeLeft]); // Fires once when timeLeft hits 0

  useEffect(() => {
    if (isGameOver && gameState === "playing") {
      // Only trigger if lives are still > 0 (all 10 letters completed successfully)
      if (lives > 0) {
        setGameState("gameOver");
        saveProgress();
      }
      // If lives === 0, the fail screen from showCue will handle the transition
    }
  }, [isGameOver, gameState, lives]);

  const showCue = (type, isLastLife = false) => {
    if (cueRef.current) return;

    cueRef.current = type;
    setCue(type);
    clearInterval(timerRef.current);

    setTimeout(() => {
      cueRef.current = null;
      setCue(null);

      // If this was a fail on the last life, transition to game over
      if (type === "fail" && isLastLife) {
        setGameState("gameOver");
        saveProgress();
      } else {
        // Normal progression: next letter
        setCurrentIndex((i) => i + 1);
        setTimeLeft(3.0);
        keyRef.current += 1;
      }
    }, 1000);
  };

  const handleTimeout = () => {
    if (cueRef.current) return;
    const newLives = lives - 1; // Calculate what lives will be AFTER this decrement
    setLives(newLives);
    // Pass whether this will be the last life (newLives === 0)
    showCue("fail", newLives === 0);
  };

  const handleSuccess = () => {
    setScore((prev) => prev + 1);
    showCue("pass");
  };

  const handleFail = () => {};

  /**
   * saveProgress - Store completion percentage in localStorage
   *
   * Used by Challenges component to update progress ring on home page
   * Calculation: (correct answers / total questions) * 100
   * Key: "blitzProgress" (read by Challenges component)
   */
  const saveProgress = () => {
    const totalQuestions = letters.length; // Always 10
    const progress = Math.round((score / totalQuestions) * 100);
    localStorage.setItem("blitzProgress", progress.toString());
  };

  /**
   * restartGame - Reset all state to initial values for new game
   *
   * Called by "Play Again" button on game over screen
   * Actions:
   * 1. Generate new random 10 letters
   * 2. Reset index to 0 (first letter)
   * 3. Reset lives to 3
   * 4. Reset score to 0
   * 5. Reset timer to 3.0 seconds
   * 6. Clear any feedback
   * 7. Set gameState to "playing"
   * 8. Increment keyRef to force detector remount
   */
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

  /**
   * GAME OVER SCREEN RENDER
   *
   * Shown when gameState === "gameOver"
   * Triggers: lives === 0 OR all 10 letters completed
   *
   * Layout:
   * - Purple gradient background (matches brand)
   * - White card with rounded corners
   * - Trophy icon (yellow)
   * - "Game Over!" title
   * - Score display (X/10)
   * - Progress percentage (saved to localStorage)
   * - Two buttons: "Play Again" (purple) and "Home" (gray)
   *
   * Animations:
   * - Card scales up from 0.8 to 1.0 on entry (bounce effect)
   * - Button hover: scale up slightly (105%)
   */
  if (gameState === "gameOver") {
    // Calculate final progress percentage for display
    const progress = Math.round((score / letters.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 flex items-center justify-center p-4">
        {/* Animated card with scale + fade in */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} // Start small and transparent
          animate={{ scale: 1, opacity: 1 }} // Grow to full size
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
        >
          <div className="text-center">
            {/* Trophy icon - yellow to indicate achievement */}
            <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-500" />

            {/* Title */}
            <h1 className="text-4xl font-black text-gray-800 mb-2">
              Game Over!
            </h1>

            {/* Large score display - purple accent matches theme */}
            <div className="text-6xl font-black text-purple-600 mb-6">
              {score}/{letters.length}
            </div>

            {/* Progress card - gray background for contrast */}
            <div className="bg-gray-100 rounded-2xl p-4 mb-6">
              <div className="text-sm text-gray-600 mb-2">Progress</div>
              <div className="text-3xl font-bold text-gray-800">
                {progress}%
              </div>
            </div>

            {/* Action buttons - flex row with gap */}
            <div className="flex gap-3">
              {/* Play Again - purple to match game theme */}
              <button
                onClick={restartGame} // Reset all state, generate new letters
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
              >
                Play Again
              </button>

              {/* Home - gray secondary button */}
              <button
                onClick={() => navigate("/")} // Navigate back to home page
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

  /**
   * MAIN GAMEPLAY SCREEN RENDER
   *
   * Layout structure:
   * 1. Header: Lives (hearts) | Score | Exit button
   * 2. Info card: Current letter | Timer with progress bar
   * 3. Progress indicator: "Question X of 10"
   * 4. Camera/Feedback: HandGestureDetector OR pass/fail screen
   *
   * Color scheme:
   * - Purple gradient background
   * - White text with transparency for secondary info
   * - Red hearts for lives
   * - Green timer bar (turns red at <1 second)
   * - Green checkmark for pass, red X for fail
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* === HEADER ROW === */}
        {/* Lives (left) | Score (center) | Exit (right) */}
        <div className="flex justify-between items-center mb-4">
          {/* Lives display - 3 heart icons */}
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                // Filled red if life remains, gray/transparent if lost
                className={`w-8 h-8 ${
                  i < lives
                    ? "fill-red-500 text-red-500" // Active life
                    : "text-gray-400 opacity-50" // Lost life
                }`}
              />
            ))}
          </div>

          {/* Score counter - shows correct answers out of total */}
          <div className="text-white text-2xl font-black">
            {score}/{letters.length}
          </div>

          {/* Exit button - X icon navigates back to home */}
          <button
            onClick={() => navigate("/")}
            className="text-white hover:text-gray-300 transition"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* === LETTER & TIMER CARD === */}
        {/* Semi-transparent white card with blur effect */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
          {/* Top row: Letter to sign | Timer value */}
          <div className="flex justify-between items-center">
            {/* Current letter instruction */}
            <h1 className="text-white text-4xl font-black">
              Sign: {currentLetter}
            </h1>

            {/* Timer display - right aligned */}
            <div className="text-right">
              <div className="text-white/70 text-sm">Time Left</div>
              <div
                // Turn red when under 1 second to create urgency
                className={`text-3xl font-black ${
                  timeLeft <= 1 ? "text-red-300" : "text-white"
                }`}
              >
                {timeLeft.toFixed(1)}s {/* Show 1 decimal place */}
              </div>
            </div>
          </div>

          {/* Progress bar - visual timer representation */}
          <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              // Green normally, red when < 1 second
              className={`h-full ${
                timeLeft <= 1 ? "bg-red-500" : "bg-green-400"
              }`}
              initial={{ width: "100%" }} // Start full
              animate={{ width: `${(timeLeft / 3.0) * 100}%` }} // Shrink proportionally
              transition={{ duration: 0.1 }} // Smooth 100ms transition
            />
          </div>
        </div>

        {/* === PROGRESS INDICATOR === */}
        {/* Shows current question number (1-indexed for user) */}
        <div className="text-center text-white/70 text-sm mb-4">
          Question {currentIndex + 1} of {letters.length}
        </div>

        {/* === CAMERA / FEEDBACK SECTION === */}
        {/* AnimatePresence: smooth transitions between camera and feedback */}
        <AnimatePresence mode="wait">
          {/* CAMERA VIEW - shown when cue is null */}
          {!cue ? (
            <motion.div
              key="camera" // Unique key for AnimatePresence
              initial={{ opacity: 0 }} // Fade in
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} // Fade out
              className="relative rounded-2xl overflow-hidden bg-black shadow-2xl"
            >
              <div style={{ aspectRatio: "4/3" }}>
                {" "}
                {/* 4:3 camera ratio */}
                {/* HandGestureDetector props:
                 * - key: Force remount when keyRef changes (resets detection buffer)
                 * - targetLetter: Current letter to detect
                 * - onSuccess: Callback when correct sign detected
                 * - onFail: Callback when wrong sign detected
                 * - timeLimit: Not used in minimal mode, but kept for consistency
                 * - minimal: true = no internal UI, parent handles feedback
                 */}
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
            /* FEEDBACK VIEW - shown when cue is "pass" or "fail" */
            <motion.div
              key="feedback" // Unique key for AnimatePresence
              initial={{ scale: 0.8, opacity: 0 }} // Pop in effect
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }} // Pop out effect
              // Green for pass, red for fail
              className={`rounded-2xl flex items-center justify-center text-white text-8xl font-black shadow-2xl ${
                cue === "pass" ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ aspectRatio: "4/3" }} // Match camera dimensions
            >
              {/* Unicode checkmark or X */}
              {cue === "pass" ? "✓" : "✗"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Blitz;
