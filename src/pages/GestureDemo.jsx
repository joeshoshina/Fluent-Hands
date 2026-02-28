import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HandGestureDetector from "../components/quiz/HandGestureDetector";

const LETTERS = ["A", "B", "C"];

export default function GestureDemo() {
  const [idx, setIdx] = useState(0);
  const keyRef = useRef(0);

  const letter = LETTERS[idx];

  const handleSuccess = () => {
    setIdx((i) => (i + 1) % LETTERS.length);
    keyRef.current += 1;
  };

  const handleFail = () => {
    setIdx((i) => (i + 1) % LETTERS.length);
    keyRef.current += 1;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-white text-3xl font-bold mb-2 text-center">
          Sign: {letter}
        </h1>
        <p className="text-gray-400 text-center mb-4">Letters: A, B, C</p>

        <div className="rounded-2xl overflow-hidden bg-red-500 shadow-2xl">
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