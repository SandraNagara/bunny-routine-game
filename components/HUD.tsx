import React from 'react';
import { Heart, Zap, Smile, Sparkles, Briefcase } from 'lucide-react';

interface HUDProps {
  time: Date;
  health: number;
  hunger: number;
  cleanliness: number;
  love: number;
  xpWork: number;
  xpTrain: number;
  levelWork: number;
  levelTrain: number;
  currentMessage: string | null;
}

const ProgressBar = ({ value, color, icon: Icon }: { value: number, color: string, icon: any }) => (
    <div className="flex items-center gap-2 bg-white/80 p-1 pr-2 rounded-full backdrop-blur-sm shadow-sm mb-1">
        <div className={`p-1.5 rounded-full text-white`} style={{ backgroundColor: color }}>
            <Icon size={14} />
        </div>
        <div className="flex-1 h-3 w-24 bg-gray-200 rounded-full overflow-hidden">
            <div 
                className="h-full transition-all duration-500" 
                style={{ width: `${value}%`, backgroundColor: color }}
            />
        </div>
    </div>
);

const HUD: React.FC<HUDProps> = ({ time, health, hunger, cleanliness, love, xpWork, xpTrain, levelWork, levelTrain, currentMessage }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-30 pointer-events-none">
        {/* Left: Time & Message */}
        <div className="flex flex-col gap-4 items-start pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-full px-6 py-3 shadow-xl border-2 border-pink-100">
             <span className="text-3xl font-black text-gray-700 title-font tracking-wider">
               {formatTime(time)}
             </span>
          </div>
          
          {/* Dialogue Bubble */}
          {currentMessage && (
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-lg max-w-xs animate-bounce-slight border-2 border-gray-100">
                  <p className="text-gray-600 font-bold text-sm handwritten">{currentMessage}</p>
              </div>
          )}
        </div>

        {/* Right: Stats */}
        <div className="flex flex-col items-end gap-1 pointer-events-auto">
          <ProgressBar value={health} color="#EF4444" icon={Heart} />
          <ProgressBar value={hunger} color="#F97316" icon={Zap} />
          <ProgressBar value={cleanliness} color="#3B82F6" icon={Sparkles} />
          <ProgressBar value={love} color="#EC4899" icon={Smile} />
        </div>
      </div>

      {/* XP BARS (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-30 pointer-events-auto flex flex-col gap-2">
          <div className="bg-white/90 p-3 rounded-xl shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-500 uppercase">
                  <Briefcase size={12} /> Work Level <span className="text-indigo-600 ml-auto">{levelWork}</span>
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${xpWork}%` }}></div>
              </div>
          </div>
          
          <div className="bg-white/90 p-3 rounded-xl shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-500 uppercase">
                  <Zap size={12} /> Sport Level <span className="text-emerald-600 ml-auto">{levelTrain}</span>
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${xpTrain}%` }}></div>
              </div>
          </div>
      </div>
    </>
  );
};

export default HUD;