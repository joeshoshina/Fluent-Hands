export default function LevelButton({
  label = "label",
  progress = 20,
  onClick,
  color,
}) {
  const radius = 40;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;

  // Clamp progress between 0–100
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

  return (
    <div className="flex flex-col gap-4 items-center">
      <button
        onClick={onClick}
        className={`relative w-24 aspect-square rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg ${color || "bg-pink-600 hover:bg-pink-500"}`}
      >
        <svg
          height={radius * 2}
          width={radius * 2}
          className="absolute rotate-[-90deg]"
        >
          {/* Background ring */}
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          {/* Progress ring */}
          <circle
            stroke="#3b82f6"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Inner Label */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-sm text-center px-2">
          {label}
        </div>
      </button>

      {/* Optional progress text */}
      <span className="text-sm font-semibold">{safeProgress}% Complete</span>
    </div>
  );
}
