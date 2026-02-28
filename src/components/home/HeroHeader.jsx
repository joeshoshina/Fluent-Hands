import { Hand } from "lucide-react";

const HeroHeader = () => {
  return (
    <div className="w-full bg-gradient-to-r from-violet-100 via-blue-50 to-purple-100 py-12 md:py-16 px-4">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
        <Hand
          className="w-16 h-16 md:w-20 md:h-20 text-violet-600 flex-shrink-0"
          strokeWidth={1.5}
        />
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900">
            Fluent Hands
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mt-2">
            Learn ASL letter by letter
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroHeader;
