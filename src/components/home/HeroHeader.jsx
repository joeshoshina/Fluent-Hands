import { Hand } from "lucide-react";

const HeroHeader = () => {
  return (
    <div className="w-full bg-gradient-to-r from-violet-100 via-blue-50 to-purple-100 py-16 px-4">
      <div className="max-w-3xl mx-auto flex items-center gap-6">
        <Hand
          className="w-20 h-20 text-violet-600 flex-shrink-0"
          strokeWidth={1.5}
        />
        <div>
          <h1 className="text-5xl font-black text-gray-900">Fluent Hands</h1>
          <p className="text-xl text-gray-600 mt-2">
            Learn ASL letter by letter
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroHeader;
