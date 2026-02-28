import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HandGestureDetector from "../components/quiz/HandGestureDetector";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function GestureDemo() {
  const [idx, setIdx] = useState(0);
  const [cue, setCue] = useState(null);
  const keyRef = useRef(0);

  const letter = LETTERS[idx];

  const showCue = (type) => {
    if (cue) return;
    setCue(type);
    setTimeout(() => {
      setCue(null);
      setIdx((i) => (i + 1) % LETTERS.length);
      keyRef.current += 1;
    }, 2500); // this is the time
  };

  const handleSuccess = () => {
    showCue("pass");
  };

  const handleFail = () => {
    showCue("fail");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-white text-3xl font-bold mb-2 text-center">
          Sign: {letter}
        </h1>
        <p className="text-gray-400 text-center mb-4">Select any letter A-Z</p>

        <div className="mb-4 flex gap-1 flex-wrap justify-center">
          {LETTERS.map((char) => (
            <button
              key={char}
              onClick={() => {
                setIdx(LETTERS.indexOf(char));
                setCue(null);
                keyRef.current += 1;
              }}
              className={`w-8 h-8 rounded text-sm font-bold ${
                char === letter
                  ? "bg-violet-600 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              {char}
            </button>
          ))}
        </div>

        {!cue ? (
          <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl">
            <div style={{ aspectRatio: "4/3" }}>
              <HandGestureDetector
                key={keyRef.current}
                targetLetter={letter}
                onSuccess={handleSuccess}
                onFail={handleFail}
                timeLimit={10}
                minimal={true}
              />
            </div>
          </div>
        ) : (
          <div
            className={`rounded-2xl flex items-center justify-center text-white text-8xl font-black shadow-2xl ${
              cue === "pass" ? "bg-green-500" : "bg-red-500"
            }`}
            style={{ aspectRatio: "4/3" }}
          >
            {cue === "pass" ? "✓ PASS" : "✗ FAIL"}
          </div>
        )}

        <button
          onClick={() => {
            setIdx((i) => (i + 1) % LETTERS.length);
            keyRef.current += 1;
          }}
          className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Next Letter
        </button>
      </div>
    </div>
  );
}
//Testing 