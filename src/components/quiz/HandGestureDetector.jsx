import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CheckCircle2, XCircle, Loader2 } from "lucide-react";

// ASL finger spelling classifier using MediaPipe landmarks
function classifyASLLetter(landmarks, targetLetter) {
  if (!landmarks || landmarks.length < 21) return null;
  const isRight = landmarks[20].x < landmarks[0].x? true : false;

  const lm = landmarks;

  // Helper: is fingertip above its MCP (knuckle)?
  const tipAboveMCP = (tipIdx, mcpIdx) => lm[tipIdx].y < lm[mcpIdx].y;
  const tipAbovePIP = (tipIdx, pipIdx) => lm[tipIdx].y < lm[pipIdx].y;
  const avgMCPY = (lm[5].y + lm[9].y + lm[13].y + lm[17].y) / 4;

  const upsideDown = avgMCPY > lm[0].y;
  const fingerDown = (tip, mcp) => lm[tip].y > lm[mcp].y;

  //const tipBelowWrist = (tipIdx) => lm[tipIdx].y > lm[0].y;

  // Finger extended checks (y-axis: lower y = higher on screen)
  const thumbExtended = lm[4].x < lm[3].x; // thumb tip left of thumb IP (for right hand)
  const indexExtended = tipAboveMCP(8, 5);
  const middleExtended = tipAboveMCP(12, 9);
  const ringExtended = tipAboveMCP(16, 13);
  const pinkyExtended = tipAboveMCP(20, 17);

  const indexExtendedUpsideDown = fingerDown(8, 5);
  const middleExtendedUpsideDown = fingerDown(12, 9);
  const straightenThumbDown = fingerDown(4, 2);
  const pinkyCurledDown = !fingerDown(17, 20);
  const ringCurledDown = !fingerDown(13, 16);

  const thumbBetweenMiddle = lm[4].x < lm[10].x && lm[6].x < lm[4].x;
  const middleBetweenThumb = lm[6].x > lm[11].x && lm[2].x < lm[11].x;

  // Math.abs(lm[8].x - lm[5].x) > Math.abs(lm[8].y - lm[5].y)
  const indexPointing =
    Math.abs(lm[8].x - lm[5].x) > Math.abs(lm[8].y - lm[5].y) &&
    lm[8].x < lm[5].x;
  const middlePointing =
    Math.abs(lm[12].x - lm[9].x) > Math.abs(lm[12].y - lm[9].y) &&
    lm[12].x < lm[9].x;
  const ringPointing =
    Math.abs(lm[14].x - lm[13].x) > Math.abs(lm[14].y - lm[13].y) &&
    lm[16].x < lm[13].x;
  const pinkyPointing =
    Math.abs(lm[18].x - lm[17].x) > Math.abs(lm[18].y - lm[17].y) &&
    lm[20].x < lm[17].x;

  const indexCurled = !indexExtended;
  const middleCurled = !middleExtended;
  const ringCurled = !ringExtended;
  const pinkyCurled = !pinkyExtended;

  const thumbStraightened = lm[4].y < lm[3].y;
  const thumbStraightenedDown = lm[4].y > lm[3].y;

  // const indexCurledPointing = !indexPointing
  // const middleCurledPointing = !middlePointing
  // const ringCurledPointing = !ringPointing
  // const pinkyCurledPointing = !pinkyPointing
  const indexCurledPointing =
    Math.abs(lm[6].x - lm[5].x) > Math.abs(lm[6].y - lm[5].y) &&
    lm[8].x > lm[6].x;
  const middleCurledPointing =
    Math.abs(lm[10].x - lm[9].x) > Math.abs(lm[10].y - lm[9].y) &&
    lm[12].x > lm[10].x;
  const ringCurledPointing =
    Math.abs(lm[14].x - lm[13].x) > Math.abs(lm[14].y - lm[13].y) &&
    lm[16].x > lm[14].x;
  const pinkyCurledPointing =
    Math.abs(lm[18].x - lm[17].x) > Math.abs(lm[18].y - lm[17].y) &&
    lm[20].x > lm[18].x;

  const indexCrooked = lm[6].y < lm[5].y && lm[8].y > lm[7].y;

  // A: Fist with thumb to side
  if (targetLetter === "A") {
    if (indexCurled && middleCurled && ringCurled && pinkyCurled) {
      // Check that thumb isn't tucked so we can distinguish between M
      if (lm[4].x < lm[6].x) {
        return "A";
      }
    }
  }
  // B: All four fingers up, thumb tucked
  if (targetLetter === "B") {
    if (indexExtended && middleExtended && ringExtended && pinkyExtended) {
      const thumbTucked = lm[4].x > lm[3].x;
      if (thumbTucked) return "B";
    }
  }

  // C: Curved hand (all fingers slightly curled, not closed)
  if (targetLetter === "C") {
    if (!indexCurled && !middleCurled && !ringCurled && !pinkyCurled) {
      const tipDist = Math.abs(lm[8].x - lm[4].x);
      if (tipDist < 0.2) return "C";
    }
  }

  // L: Index and thumb extended, others curled
  if (targetLetter === "L") {
    if (
      indexExtended &&
      middleCurled &&
      ringCurled &&
      pinkyCurled &&
      thumbExtended
    )
      return "L";
  }

  // D: Index up, others curled
  if (targetLetter === "D") {
    if (indexExtended && middleCurled && ringCurled && pinkyCurled) return "D";
  }

  // E: All fingers bent/curled forward
  if (targetLetter === "E") {
    if (
      !tipAbovePIP(8, 6) &&
      !tipAbovePIP(12, 10) &&
      !tipAbovePIP(16, 14) &&
      !tipAbovePIP(20, 18)
    )
      return "E";
  }

  // F: Index & thumb touching, others up
  if (targetLetter === "F") {
    if (!indexExtended && middleExtended && ringExtended && pinkyExtended) {
      const thumbIndexClose =
        Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y) < 0.08;
      if (thumbIndexClose) return "F";
    }
  }

  // G: Index pointing sideways, thumb up
  if (targetLetter === "G") {
    if (
      indexPointing &&
      middleCurledPointing &&
      ringCurledPointing &&
      pinkyCurledPointing
    ) {
      if ((lm[4].x < lm[18].x) && (lm[4].y < lm[18].y)) {
        return "G";
      }
    }
  }

  if (targetLetter === "H") {
    if (
      (indexPointing &&
      middlePointing) &&
      ringCurledPointing &&
      pinkyCurledPointing &&
      //!thumbExtended &&
      !thumbStraightened
    ) {
      return "H";
    }
  }

  // I: Pinky only extended
  if (targetLetter === "I") {
    if (indexCurled && middleCurled && ringCurled && pinkyExtended) return "I";
  }
  
  if (targetLetter === "K") {
    if (
      thumbStraightened &&
      indexExtended &&
      middleExtended &&
      ringCurled &&
      pinkyCurled &&
      lm[4].x > lm[8].x
    )
      return "K";
  }

  if (targetLetter === "M") {
    if (indexCurled && middleCurled && ringCurled && pinkyCurled) {
      // Check that thumb is tucked
      if (
        lm[4].x > lm[5].x &&
        lm[4].x > lm[6].x &&
        lm[4].x > lm[7].x &&
        lm[4].x > lm[8].x
      ) {
        // Check that thumb is behind other joints
        if (lm[4].z > lm[10].z) {
          return "M";
        }
      }
    }
  }

  if (targetLetter === "N") {
    if (indexCurled && middleCurled && ringCurled && pinkyCurled) {
      // Check that thumb is between ring and middle
      if (lm[4].x > lm[10].x && lm[4].y < lm[14].y) {
        return "N";
      }
    }
  }

  // O: Fingers curved to form circle with thumb
  if (targetLetter === "O") {
    if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      const thumbTipToIndexTip = Math.hypot(
        lm[4].x - lm[8].x,
        lm[4].y - lm[8].y,
      );
      if (thumbTipToIndexTip < 0.1) return "O";
    }
  }

  if (targetLetter === "R") {
    if (indexExtended && middleExtended && ringCurled && pinkyCurled) {
      if (lm[12].x < lm[8].x) {
        return "R";
      }
    }
  }

  if (targetLetter === "S") {
    if (indexCurled && middleCurled && ringCurled && pinkyCurled) {
      // Check that thumb is tucked
      if (
        lm[4].x > lm[5].x &&
        lm[4].x > lm[6].x &&
        lm[4].x > lm[7].x &&
        lm[4].x > lm[8].x
      ) {
        // Check that thumb is in front of other joints
        if (lm[4].z < lm[12].z) {
          return "S";
        }
      }
    }
  }
  // broad coverage of P, check if fingers curled later and figure out thumb issues
  if (targetLetter === "P") {
    if (
      upsideDown &&
      //inf && pinkyExtended && thumbNearMiddle &&
      indexExtendedUpsideDown &&
      middleExtendedUpsideDown &&
      ringCurledDown &&
      pinkyCurledDown &&
      thumbBetweenMiddle
    )
      return "P";
  }

  if (targetLetter === "Q") {
    if (
      upsideDown &&
      indexExtendedUpsideDown &&
      middleBetweenThumb &&
      straightenThumbDown &&
      pinkyCurledDown &&
      ringCurledDown
    )
      return "Q";
  }

  if (targetLetter === "T") {
    if (indexCurled && middleCurled && ringCurled && pinkyCurled) {
      // Check that thumb is between ring and middle
      if (lm[4].x > lm[6].x && lm[4].x < lm[10].x) {
        return "T";
      }
    }
  }

  if (targetLetter === "U") {
      if (indexExtended && middleExtended && ringCurled && pinkyCurled) {
        return "U";
      }
  }

  // V: Index and middle extended in V shape
  if (targetLetter === "V") {
    if (indexExtended && middleExtended && ringCurled && pinkyCurled && isRight) {
      //if (isRight){
      //const vShape = Math.abs(lm[8].x - lm[12].x) > 0.03;
      //if (vShape) return "V";

      //}else {
      const vShape = Math.abs(lm[12].x - lm[8].x) > 0.03;
      if (vShape) return "V";

      //}

      //if (vShape) return "V";
    }
  }

  // W: Index, middle, ring extended
  if (targetLetter === "W") {
    if (indexExtended && middleExtended && ringExtended && pinkyCurled)
      return "W";
  }

  if (targetLetter === "X") {
    if (indexCrooked && middleCurled && ringCurled && pinkyCurled) {
      if (lm[4].z < lm[10].z) {
        return "X";
      }
    }
  }

  // Y: Thumb and pinky extended
  if (targetLetter === "Y") {
    if (
      indexCurled &&
      middleCurled &&
      ringCurled &&
      pinkyExtended &&
      thumbExtended
    )
      return "Y";
  }

  return null;
}

function detectJ(landmarks, motionBufferRef){
  const pinkyTip = landmarks[20];

  motionBufferRef.current.push({ x: pinkyTip.x, y: pinkyTip.y });
  if (motionBufferRef.current.length > 30) motionBufferRef.current.shift();

  if (motionBufferRef.current.length < 15) return;
  const pts = motionBufferRef.current;
  const start = pts[0];
  const end = pts[pts.length - 1];
  let maxY = -1;
  let maxYIdx = -1;
  for (let i = 0; i < pts.length; i++){
    if(pts[i].y > maxY){
      maxY = pts[i].y;
      maxYIdx = i;
    }
  }

  const vertPortion = maxY - start.y;
  const hook = maxY - end.y;
  const sidePortion = pts[maxYIdx].x - end.x;


  //const dx = end.x - start.x;
  //const dy = end.y - start.y;

  // Downward + slight curve
  if (vertPortion > 0.1 && hook > 0.03 && sidePortion > 0.05) {
    motionBufferRef.current = [];
    return "J";
}}

export default function HandGestureDetector({
  targetLetter,
  onSuccess,
  onFail,
  timeLimit = null,
  isPaused = false,
  minimal = false,
  onCameraReady = () => {},
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const cameraRef = useRef(null);
  const detectionBufferRef = useRef([]);
  const motionBufferRef = useRef([]); //creates the buffer frame for j/z motion
  const timerRef = useRef(null);

  const [status, setStatus] = useState("loading"); // loading | ready | detecting | success | fail
  const [timeLeft, setTimeLeft] = useState(timeLimit || 8);
  const [detectedLetter, setDetectedLetter] = useState(null);
  const [cameraError, setCameraError] = useState(false);

  const handleDetectionResult = useCallback(
    (letter) => {
      setDetectedLetter(letter);
      if (letter) {
        detectionBufferRef.current.push(letter);
        if (detectionBufferRef.current.length > 10)
          detectionBufferRef.current.shift();

        // Need 5 consistent detections of the target
        const recentMatches = detectionBufferRef.current.filter(
          (l) => l === targetLetter,
        ).length;
        if (recentMatches >= 5) {
          setStatus("success");
          clearInterval(timerRef.current);
          if (cameraRef.current) cameraRef.current.stop();
          setTimeout(() => onSuccess(), 200);
        }
      }
    },
    [targetLetter, onSuccess],
  );

  useEffect(() => {
    let stopped = false;

    const initMediaPipe = async () => {
      try {
        const { Hands } = await import("@mediapipe/hands");
        const { Camera } = await import("@mediapipe/camera_utils");
        const { drawConnectors, drawLandmarks } =
          await import("@mediapipe/drawing_utils");
        const { HAND_CONNECTIONS } = await import("@mediapipe/hands");

        if (stopped) return;

        const hands = new Hands({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results) => {
          if (stopped) return;
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          ctx.save();
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
          
          if (results.multiHandLandmarks?.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            motionBufferRef.current.push({
              x: landmarks[20].x,
              y: landmarks[20].y,
            });
            if (motionBufferRef.current.length > 30)
              motionBufferRef.current.shift();
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
              color: "#a78bfa",
              lineWidth: 2,
            });
            drawLandmarks(ctx, landmarks, {
              color: "#7c3aed",
              lineWidth: 1,
              radius: 4,
            });

            if (!window.lastSentTime) window.lastSentTime = 0;
            const now = Date.now();

            if (now - window.lastSentTime > 200) {
              window.lastSentTime = now;

              const features = landmarks.flatMap((lm) => [lm.x, lm.y, lm.z]);
              const isRight = landmarks[20].x < landmarks[0].x? true : false;

              if (targetLetter === "U" || (targetLetter === "V" && isRight) || targetLetter == "L" ||
                  (targetLetter === "Y" && !isRight) || (targetLetter === "O" && isRight) || (targetLetter === "A" && !isRight) ||
                (targetLetter === "C" && isRight) || (targetLetter === "G" && isRight)){
                //console.log("slipped in");
                const letter = classifyASLLetter(landmarks, targetLetter);
                handleDetectionResult(letter);
              }

              fetch("http://127.0.0.1:5050/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ features }),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.letter) {
                    console.log(data.letter);
                    handleDetectionResult(data.letter);
                  } else {
                    handleDetectionResult(null);
                  }
                })
                .catch((err) => {
                  console.error("Prediction error:", err);
                  handleDetectionResult(null);
                });
            }
          } else {
            handleDetectionResult(null);
          }
          ctx.restore();
        });

        handsRef.current = hands;

        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (handsRef.current && videoRef.current) {
              await handsRef.current.send({ image: videoRef.current });
            }
          },
          width: 400,
          height: 300,
        });

        cameraRef.current = camera;
        await camera.start();

        if (!stopped) {
          setStatus("detecting");
          onCameraReady();
          // Countdown timer - only if timeLimit is provided
          if (timeLimit) {
            let t = timeLimit;
            timerRef.current = setInterval(() => {
              if (!isPaused) {
                t -= 1;
                setTimeLeft(t);
                if (t <= 0) {
                  clearInterval(timerRef.current);
                  setStatus("fail");
                  if (cameraRef.current) cameraRef.current.stop();
                  setTimeout(() => onFail(), 200);
                }
              }
            }, 1000);
          }
        }
      } catch (err) {
        console.error("MediaPipe init error:", err);
        setCameraError(true);
        setStatus("error");
      }
    };

    initMediaPipe();

    return () => {
      stopped = true;
      clearInterval(timerRef.current);
      if (cameraRef.current) {
        try {
          cameraRef.current.stop();
        } catch {}
      }
      if (handsRef.current) {
        try {
          handsRef.current.close();
        } catch {}
      }
    };
  }, []);

  const timerPercent = (timeLeft / timeLimit) * 100;
  const timerColor =
    timerPercent > 50 ? "#7c3aed" : timerPercent > 25 ? "#f59e0b" : "#ef4444";

  // Minimal mode: just camera and canvas, no UI elements
  if (minimal) {
    return (
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />

        {/* Loading overlay */}
        <AnimatePresence>
          {status === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/80 flex flex-col items-center justify-center gap-3"
            >
              <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
              <span className="text-white text-sm font-medium">
                Starting camera...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      <div className="w-full mb-4">
        <div className="flex justify-between text-sm font-bold mb-1">
          <span className="text-gray-500">Show the sign for</span>
          {status === "detecting" && timeLimit && !isPaused && (
            <span
              style={{ color: timerColor }}
              className="font-black tabular-nums"
            >
              {timeLeft}s
            </span>
          )}
          {status === "detecting" && isPaused && (
            <span className="font-black text-blue-500">Paused</span>
          )}
        </div>
        {status === "detecting" && timeLimit && !isPaused && (
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full transition-all"
              style={{ width: `${timerPercent}%`, backgroundColor: timerColor }}
            />
          </div>
        )}
      </div>

      {/* Target letter display */}
      <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center mb-5 shadow-lg shadow-violet-200">
        <span className="text-6xl font-black text-white">{targetLetter}</span>
      </div>

      {/* Camera feed */}
      <div
        className="relative w-full rounded-2xl overflow-hidden bg-gray-900 shadow-xl mb-4"
        style={{ aspectRatio: "4/3" }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />

        {/* Status overlay */}
        <AnimatePresence>
          {status === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/80 flex flex-col items-center justify-center gap-3"
            >
              <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
              <span className="text-white text-sm font-medium">
                Starting camera...
              </span>
            </motion.div>
          )}
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-green-500/80 flex flex-col items-center justify-center gap-3"
            >
              <CheckCircle2
                className="w-16 h-16 text-white"
                strokeWidth={2.5}
              />
              <span className="text-white text-xl font-black">Perfect!</span>
            </motion.div>
          )}
          {status === "fail" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-500/80 flex flex-col items-center justify-center gap-3"
            >
              <XCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
              <span className="text-white text-xl font-black">Time's up!</span>
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gray-900/90 flex flex-col items-center justify-center gap-3 p-4"
            >
              <Camera className="w-8 h-8 text-gray-400" />
              <span className="text-white text-sm font-medium text-center">
                Camera not available. Please allow camera access.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detected letter indicator */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Detecting:</span>
        <span
          className={`font-black text-lg ${detectedLetter === targetLetter ? "text-violet-600" : "text-gray-300"}`}
        >
          {detectedLetter || "—"}
        </span>
      </div>
    </div>
  );
}
