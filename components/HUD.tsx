
import React from 'react';
import { Heart, Zap, Smile, Sparkles, Droplets, Scale, Cloud, Sun, CloudRain, CloudSnow } from 'lucide-react';
import { Weather, Season } from '../types';

interface HUDProps {
  time: Date;
  health: number;
  hunger: number;
  thirst: number;
  cleanliness: number;
  love: number;
  weight: number;
  season: Season;
  weather: Weather;
  currentMessage: string | null;
}

const StatBar = ({ value, color, icon: Icon }: { value: number, color: string, icon: any }) => (
    <div className="flex items-center gap-2 bg-white/20 p-1 pr-2 rounded-full backdrop-blur-md shadow-sm mb-2 w-48">
        <div className={`p-1.5 rounded-full text-white shadow-sm`} style={{ backgroundColor: color }}>
            <Icon size={16} fill="currentColor" />
        </div>
        <div className="flex-1 h-3 bg-black/10 rounded-full overflow-hidden">
            <div 
                className="h-full transition-all duration-500 shadow-[0_0_10px_rgba(0,0,0,0.1)]" 
                style={{ width: `${value}%`, backgroundColor: color }}
            />
        </div>
    </div>
);

const HUD: React.FC<HUDProps> = ({ time, health, hunger, thirst, cleanliness, love, weight, season, weather, currentMessage }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <>
      {/* TOP LEFT: CLOCK */}
      <div className="absolute top-6 left-6 z-30 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-xl rounded-full px-8 py-3 shadow-2xl border-2 border-white/50 inline-block">
             <span className="text-4xl font-black text-gray-800 title-font tracking-widest drop-shadow-sm">
               {formatTime(time)}
             </span>
          </div>
          
          {/* Dialogue Bubble */}
          {currentMessage && (
              <div className="mt-4 bg-white p-4 rounded-2xl rounded-tl-none shadow-xl max-w-xs animate-bounce-slight border-2 border-gray-100 pointer-events-auto">
                  <p className="text-gray-600 font-bold text-sm handwritten">{currentMessage}</p>
              </div>
          )}
      </div>

      {/* TOP RIGHT: STATS & WEATHER */}
      <div className="absolute top-6 right-6 z-30 flex flex-col items-end pointer-events-none">
        
        {/* Weather & Weight Pill */}
        <div className="flex items-center gap-2 mb-3 pointer-events-auto">
            <div className="bg-indigo-900/80 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 backdrop-blur-md shadow-lg border border-white/10">
                <span>{season} • {weather}</span>
            </div>
            <div className="bg-white/90 text-gray-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                 <Scale size={12} />
                 <span>{Math.round(weight)}kg</span>
            </div>
        </div>

        {/* Vertical Stats Stack */}
        <div className="pointer-events-auto">
          <StatBar value={health} color="#EF4444" icon={Heart} />
          <StatBar value={hunger} color="#F97316" icon={Zap} />
          <StatBar value={thirst} color="#0EA5E9" icon={Droplets} />
          <StatBar value={cleanliness} color="#8B5CF6" icon={Sparkles} />
          <StatBar value={love} color="#EC4899" icon={Smile} />
        </div>
      </div>
    </>
  );
};

export default HUD;
