import { Hand } from "lucide-react";

const HeroHeader = () => {
  return (
    <div className="w-full bg-white/10 backdrop-blur-md flex justify-center">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
        <Hand
          className="w-16 h-16 md:w-20 md:h-20 text-violet-400 flex-shrink-0"
          strokeWidth={1.5}
        />
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FF4DEF]">
            Fluent Hands
          </h1>
          <p className="text-lg sm:text-xl text-[#E6F201] mt-2">
            Learn ASL letter by letter
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroHeader;
