import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Trophy, X, BookOpen } from "lucide-react";
import HandGestureDetector from "../quiz/HandGestureDetector";

const WORD_LIST = ["BLUE", "HELLO", "CAT", "DOG", "SIGN", "APPLE", "HELP", "PLEASE", "RED", "IRVINE"];
const ROUND_DURATION = 10; // Match the 10s logic from your previous request

const WordMode = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("setup");
  const [currentWord, setCurrentWord] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [cue, setCue] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  const keyRef = useRef(0);
  const timerRef = useRef(null);
  const cueRef = useRef(null);

  const targetLetter = currentWord[charIndex];

  // --- TIMER LOGIC (Blitz Style) ---
  useEffect(() => {
    if (gameState !== "playing" || cueRef.current || !cameraReady) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = parseFloat((prev - 0.1).toFixed(1));
        return newTime <= 0 ? 0 : newTime;
      });
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [gameState, cue, charIndex, currentWord, cameraReady]);

  useEffect(() => {
    if (timeLeft <= 0 && gameState === "playing") {
      handleTimeout();
    }
  }, [timeLeft]);

  const handleTimeout = () => {
    if (cueRef.current) return;
    const newLives = lives - 1;
    setLives(newLives);
    showCue("fail", false, newLives === 0);
  };

  const handleSuccess = () => {
    const isWordFinished = charIndex === currentWord.length - 1;
    if (isWordFinished) setScore((prev) => prev + 1);
    showCue("pass", isWordFinished, false);
  };

  const showCue = (type, wordFinished, isLastLife = false) => {
    if (cueRef.current) return;

    cueRef.current = type;
    setCue(type);
    clearInterval(timerRef.current);

    setTimeout(() => {
      cueRef.current = null;
      setCue(null);

      if (isLastLife) {
        setGameState("gameOver");
        saveProgress();
      } else {
        if (wordFinished) {
          const nextWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
          setCurrentWord(nextWord);
          setCharIndex(0);
        } else if (type === "pass") {
          setCharIndex((i) => i + 1);
        }
        
        setTimeLeft(ROUND_DURATION);
        setCameraReady(false);
        keyRef.current += 1;
      }
    }, 1000);
  };

  const startGame = () => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setCurrentWord(randomWord);
    setCharIndex(0);
    setLives(3);
    setScore(0);
    setTimeLeft(ROUND_DURATION);
    setGameState("playing");
    keyRef.current += 1;
  };

  const saveProgress = () => {
   // SET YOUR GOAL HERE: How many words = 100%?
  const WORDS_TO_COMPLETE = 10; 

  // Calculate the percentage (Score / Goal * 100)
  const calculatedPercent = Math.min(Math.round((score / WORDS_TO_COMPLETE) * 100), 100);
  
  // Get previous best from storage
  const saved = localStorage.getItem("wordsProgress");
  const previousBest = saved ? parseInt(saved, 10) : 0;

  // Only save if this run was better than the last
  if (calculatedPercent > previousBest) {
    localStorage.setItem("wordsProgress", calculatedPercent.toString());
  }
  };

  // --- SETUP & GAME OVER (Blitz Style) ---
  if (gameState === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-teal-600 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-black text-gray-800 mb-2">Word Mode</h1>
          <p className="text-gray-600 mb-6">Sign each letter to spell the word. 10s per letter!</p>
          <button onClick={startGame} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105">
            Start Game
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === "gameOver") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-teal-600 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
          <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-500" />
          <h1 className="text-4xl font-black text-gray-800 mb-2">Game Over!</h1>
          <div className="text-6xl font-black text-blue-600 mb-6">{score}</div>
          <div className="bg-gray-100 rounded-2xl p-4 mb-6">
              <div className="text-sm text-gray-600 mb-2">Words Spelled</div>
              <div className="text-3xl font-bold text-gray-800">{score}</div>
          </div>
          <div className="flex gap-3">
            <button onClick={startGame} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105">Play Again</button>
            <button onClick={() => navigate("/")} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105">Home</button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- MAIN GAMEPLAY (Blitz Style UI) ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-teal-600 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        
        {/* === HEADER ROW (Blitz Match) === */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} className={`w-8 h-8 ${i < lives ? "fill-red-500 text-red-500" : "text-gray-400 opacity-50"}`} />
            ))}
          </div>
          <div className="text-white text-2xl font-black">Words: {score}</div>
          <button onClick={() => navigate("/")} className="text-white hover:text-gray-300 transition"><X className="w-8 h-8" /></button>
        </div>

       {/* === WORD & TIMER CARD === */}
<div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-4 border border-white/20 shadow-2xl">
  
  {/* Header Info: Small and tucked away */}
  <div className="flex justify-between items-center mb-6 opacity-80">
    <div className="text-blue-200 text-xs font-black uppercase tracking-widest">
      Spelling: {currentWord}
    </div>
    <div className="text-right">
      <span className="text-white/60 text-xs font-bold uppercase mr-2">Time:</span>
      <span className={`text-xl font-black ${!cameraReady ? "text-yellow-200" : timeLeft <= 2 ? "text-red-400" : "text-white"}`}>
        {cameraReady ? `${timeLeft.toFixed(1)}s` : "Waiting..."}
      </span>
    </div>
  </div>

  {/* MAIN WORD: Huge and Centered */}
  <div className="flex justify-center items-center gap-4 mb-8">
    {currentWord.split("").map((letter, idx) => (
      <motion.div
        key={`${currentWord}-${idx}`}
        initial={{ y: 20, opacity: 0 }}
        animate={idx === charIndex 
          ? { scale: 1.3, y: -10, opacity: 1 } 
          : { scale: 1, y: 0, opacity: idx < charIndex ? 1 : 0.4 }
        }
        className={`text-6xl sm:text-7xl font-black tracking-tighter transition-all
          ${idx === charIndex 
            ? "text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]" 
            : idx < charIndex 
              ? "text-green-400" 
              : "text-white/20"
          }`}
      >
        {letter}
      </motion.div>
    ))}
  </div>

  {/* Progress bar (Simplified Blitz style) */}
  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
    <motion.div 
      className={`absolute top-0 left-0 h-full ${!cameraReady ? "bg-yellow-300" : timeLeft <= 2 ? "bg-red-500" : "bg-blue-400"}`}
      initial={{ width: "100%" }}
      animate={{ width: `${cameraReady ? (timeLeft / ROUND_DURATION) * 100 : 100}%` }}
      transition={{ duration: 0.1, ease: "linear" }}
    />
  </div>
</div>

        {/* Progress indicator */}
        <div className="text-center text-white/70 text-sm mb-4">
          Signing letter <span className="text-white font-bold">{targetLetter}</span> of "{currentWord}"
        </div>

        {/* === CAMERA / FEEDBACK SECTION (Blitz Match) === */}
        <AnimatePresence mode="wait">
          {!cue ? (
            <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative rounded-2xl overflow-hidden bg-black shadow-2xl aspect-[4/3]">
                <HandGestureDetector
                  key={keyRef.current}
                  targetLetter={targetLetter}
                  onSuccess={handleSuccess}
                  onFail={() => {}}
                  onCameraReady={() => setCameraReady(true)}
                  minimal={true}
                />
            </motion.div>
          ) : (
            <motion.div key="feedback" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className={`rounded-2xl flex items-center justify-center text-white text-8xl font-black shadow-2xl aspect-[4/3] ${cue === "pass" ? "bg-green-500" : "bg-red-500"}`}>
              {cue === "pass" ? "✓" : "✗"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WordMode;