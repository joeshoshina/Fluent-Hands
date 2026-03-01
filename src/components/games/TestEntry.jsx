export default function LevelButton({
  label = "label",
  progress = 20,
  onClick,
  color,
  textColor,
  hoverSpriteSrc,
  hoverSpriteAlt = "Level sprite",
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
        className={`group relative w-24 aspect-square rounded-full flex items-center justify-center overflow-visible transition-all hover:scale-105 active:scale-95 shadow-lg ${color || "bg-pink-600 hover:bg-pink-500"}`}
      >
        <svg
          height={radius * 2}
          width={radius * 2}
          className="absolute rotate-[-90deg]"
        >
          {/* Background ring */}
          <circle
            stroke="rgba(255, 255, 255, 0.2)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          {/* Progress ring */}
          <circle
            stroke="white"
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
        <div className="relative w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-sm text-center px-2">
          <span
            className={`transition-opacity duration-200 ${hoverSpriteSrc ? "opacity-100 group-hover:opacity-0" : "opacity-100"}`}
          >
            {label}
          </span>
          {hoverSpriteSrc && (
            <img
              src={hoverSpriteSrc}
              alt={hoverSpriteAlt}
              className="pointer-events-none select-none absolute left-1/2 top-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-250"
            />
          )}
        </div>
      </button>

      {/* Optional progress text */}
      <span
        className={`text-sm font-bold ${textColor || "text-white"} bg-black/35 px-2.5 py-1 rounded-md backdrop-blur-[1px] shadow-[0_0_10px_rgba(0,0,0,0.45)]`}
      >
        {safeProgress}% Complete
      </span>
    </div>
  );
}
