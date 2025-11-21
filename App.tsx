
import React, { useState } from 'react';
import { useGameLoop } from './hooks/useGameLoop';
import Scene from './components/Scene';
import HUD from './components/HUD';
import PostIt from './components/PostIt';
import { Briefcase, Utensils, ShowerHead, Heart, Moon, Dumbbell, Shirt, XCircle, Coffee, Users, Settings, Lightbulb, Zap } from 'lucide-react';
import { Outfit, Weather, Season } from './types';
import { GAME_CONFIG } from './constants';

const MealOverlay = ({ prompt, onFeed }: { prompt: 'LUNCH' | 'DINNER', onFeed: () => void }) => {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md transform animate-bounce-slight">
                <h2 className="text-3xl font-black text-orange-500 mb-2 title-font">
                    {prompt === 'LUNCH' ? "🥕 IT'S LUNCH TIME!" : "🥕 IT'S DINNER TIME!"}
                </h2>
                <p className="text-gray-600 font-bold mb-6">Your bunny is hungry! Give it a carrot!</p>
                
                <button 
                    onClick={onFeed}
                    className="group relative w-40 h-40 mx-auto transition-transform hover:scale-110 active:scale-95"
                >
                     <div className="text-[100px] leading-none drop-shadow-xl group-hover:rotate-12 transition-transform">
                         🥕
                     </div>
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-sm font-bold px-4 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                         Click to Feed!
                     </div>
                </button>
            </div>
        </div>
    );
};

const XPWidget = ({ xpWork, xpTrain, levelWork, levelTrain }: { xpWork: number, xpTrain: number, levelWork: number, levelTrain: number }) => (
    <div className="flex flex-col gap-3">
        <div className="bg-white/20 backdrop-blur-lg p-3 rounded-2xl shadow-lg border border-white/10 w-48">
            <div className="flex justify-between items-center text-xs font-black text-indigo-100 uppercase mb-1 tracking-wider">
                <span className="flex items-center gap-1"><Briefcase size={12} /> Work Level</span>
                <span className="text-white">{levelWork}</span>
            </div>
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-400 transition-all duration-500" style={{ width: `${xpWork}%` }}></div>
            </div>
        </div>
        <div className="bg-white/20 backdrop-blur-lg p-3 rounded-2xl shadow-lg border border-white/10 w-48">
             <div className="flex justify-between items-center text-xs font-black text-emerald-100 uppercase mb-1 tracking-wider">
                <span className="flex items-center gap-1"><Zap size={12} /> Sport Level</span>
                <span className="text-white">{levelTrain}</span>
            </div>
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${xpTrain}%` }}></div>
            </div>
        </div>
    </div>
);

const App: React.FC = () => {
  const { 
    gameState, 
    time, 
    feed, 
    clean, 
    social, 
    work, 
    togglePomodoro,
    train, 
    sleep,
    wakeUp, 
    addTask, 
    toggleTask,
    changeOutfit,
    setManualWeather,
    toggleLamp,
    restartGame
  } = useGameLoop();

  const [showOutfitMenu, setShowOutfitMenu] = useState(false);
  const [showSocialMenu, setShowSocialMenu] = useState(false);
  const [showFeedMenu, setShowFeedMenu] = useState(false);
  const [showSportMenu, setShowSportMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // --- Derived Background Style based on Time & Weather ---
  const getBgGradient = () => {
      const hour = time.getHours();
      if (gameState.weather === Weather.RAIN) return 'bg-gradient-to-b from-gray-600 to-blue-500';
      if (gameState.weather === Weather.SNOW) return 'bg-gradient-to-b from-slate-300 to-white';
      
      // Use a deep purple base to match screenshot aesthetic more closely while keeping dynamic feel
      if (hour >= 6 && hour < 12) return 'bg-gradient-to-b from-indigo-400 to-purple-300';
      if (hour >= 12 && hour < 18) return 'bg-gradient-to-b from-sky-400 to-indigo-500';
      if (hour >= 18 && hour < 22) return 'bg-gradient-to-b from-indigo-600 to-purple-800';
      return 'bg-gradient-to-b from-indigo-900 to-purple-950';
  };

  const formatSeconds = (secs: number) => {
      const h = Math.floor(secs / 60); 
      const m = secs % 60;
      return `${h}h ${m < 10 ? '0'+m : m}m`;
  };

  const isWorking = gameState.workSession.isActive;
  const isPomodoro = gameState.workSession.isPomodoro;
  const controlsDisabled = gameState.isBusy && !isPomodoro;

  if (gameState.isGameOver) {
      return (
          <div className="w-full h-screen bg-gray-900 flex flex-col items-center justify-center text-white grayscale p-4 text-center">
              <h1 className="text-6xl font-black mb-4 title-font">GAME OVER</h1>
              <p className="text-2xl mb-8">Your bunny has gone to a better place... 🌈</p>
              <button onClick={restartGame} className="bg-white text-black px-8 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform flex items-center gap-2">
                <Heart className="text-red-500 fill-current" /> Revive & Restart
              </button>
          </div>
      );
  }

  const isNightSleep = gameState.activeAction === 'SLEEP_LONG';

  return (
    <div className={`w-full h-screen relative overflow-hidden transition-colors duration-1000 ${getBgGradient()}`}>
      
      {gameState.mealPrompt && (
          <MealOverlay prompt={gameState.mealPrompt} onFeed={() => feed('FOOD')} />
      )}
      
      {isNightSleep && (
           <div className="absolute inset-0 z-40 bg-black/30 pointer-events-none flex items-center justify-center">
               <div className="bg-indigo-900/80 backdrop-blur px-8 py-4 rounded-3xl border-2 border-indigo-400/50 animate-pulse pointer-events-auto">
                   <p className="text-indigo-100 font-bold text-2xl flex items-center gap-2 mb-2">
                       <Moon className="text-yellow-400 fill-current" /> Sleeping...
                   </p>
                   <button onClick={wakeUp} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-2 rounded-full">
                       Wake Up
                   </button>
               </div>
           </div>
      )}

      <Scene 
        state={gameState.rabbitState} 
        outfit={gameState.outfit}
        scene={gameState.currentScene}
        season={gameState.season}
        weather={gameState.weather}
        isDirty={gameState.cleanliness < GAME_CONFIG.THRESHOLD_DIRTY}
        showCookie={isPomodoro}
        workTimer={gameState.workSession.timeRemaining}
        isWorking={isWorking}
        hunger={gameState.hunger}
        timeOfDay={time.getHours()}
        weight={gameState.weight}
        lampOn={gameState.lampOn}
        tasks={gameState.tasks}
        onAddTask={addTask}
        onToggleTask={toggleTask}
      />

      <HUD 
        time={time} 
        health={gameState.health} 
        hunger={gameState.hunger}
        thirst={gameState.thirst}
        cleanliness={gameState.cleanliness}
        love={gameState.love}
        weight={gameState.weight}
        season={gameState.season}
        weather={gameState.weather}
        currentMessage={gameState.currentMessage}
      />
      
      {/* --- LEFT SIDE: POST-IT TO-DO LIST --- */}
      {/* ONLY Visible when isWorking is true */}
      {isWorking && (
          <div className="absolute top-32 left-6 z-20 animate-float">
              <PostIt 
                tasks={gameState.tasks} 
                onAdd={addTask} 
                onToggle={toggleTask} 
                isWorking={isWorking}
              />
          </div>
      )}

      {/* --- RIGHT SIDE: SETTINGS BUTTONS --- */}
      <div className="absolute top-72 right-6 flex flex-col gap-3 z-40">
        <button 
            onClick={() => setShowSettings(!showSettings)}
            className="bg-white/20 backdrop-blur-md border border-white/10 p-3 rounded-xl hover:bg-white/30 transition-colors text-white shadow-lg"
        >
            <Settings size={20} />
        </button>
        <button 
            onClick={toggleLamp}
            className={`p-3 rounded-xl transition-all shadow-lg backdrop-blur-md border border-white/10 ${gameState.lampOn ? 'bg-yellow-400 text-white' : 'bg-white/20 text-white'}`}
        >
            <Lightbulb size={20} className={gameState.lampOn ? "fill-current" : ""} />
        </button>
      </div>

      {/* --- SETTINGS PANEL --- */}
      {showSettings && (
          <div className="absolute top-72 right-20 bg-white p-4 rounded-2xl shadow-xl z-40 w-48 animate-fade-in">
              <h3 className="font-bold text-gray-700 mb-2 border-b pb-1">World Settings</h3>
              <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1 uppercase font-bold">Season</p>
                  <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setManualWeather(Season.SPRING, Weather.SUNNY)} className="text-xs bg-pink-100 p-1 rounded hover:bg-pink-200">Spring</button>
                      <button onClick={() => setManualWeather(Season.SUMMER, Weather.SUNNY)} className="text-xs bg-green-100 p-1 rounded hover:bg-green-200">Summer</button>
                      <button onClick={() => setManualWeather(Season.AUTUMN, Weather.SUNNY)} className="text-xs bg-orange-100 p-1 rounded hover:bg-orange-200">Autumn</button>
                      <button onClick={() => setManualWeather(Season.WINTER, Weather.SNOW)} className="text-xs bg-blue-100 p-1 rounded hover:bg-blue-200">Winter</button>
                  </div>
              </div>
          </div>
      )}

      {/* --- BOTTOM LAYOUT --- */}
      <div className="absolute bottom-8 left-0 w-full px-6 flex items-end justify-between z-30 pointer-events-none">
          
          {/* XP Widget (Bottom Left) */}
          <div className="pointer-events-auto">
             <XPWidget 
                xpWork={gameState.xpWork} 
                xpTrain={gameState.xpTrain} 
                levelWork={gameState.levelWork} 
                levelTrain={gameState.levelTrain} 
             />
          </div>

          {/* Center Action Buttons */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center gap-4 pointer-events-auto">
                
                {/* Work Timer Overlay */}
                {isWorking && (
                    <div className="flex flex-col items-center gap-2 mb-2 animate-bounce-slight">
                        <button 
                            onClick={togglePomodoro}
                            className="bg-indigo-100 text-indigo-800 px-5 py-1.5 rounded-full text-sm font-black hover:bg-white transition-colors flex items-center gap-2 shadow-lg"
                        >
                            <Coffee size={14} />
                            {isPomodoro ? 'Skip Break' : 'Take Break'}
                        </button>
                        <div className="bg-white/90 backdrop-blur px-8 py-3 rounded-full shadow-2xl flex items-center gap-3 border-2 border-indigo-100">
                            <div className={`w-3 h-3 rounded-full animate-pulse ${isPomodoro ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="font-black text-indigo-900 uppercase tracking-wide text-sm">
                                {isPomodoro ? 'Break Time' : 'Work Session'}
                            </span>
                            <span className="font-mono text-xl text-red-500 font-bold">
                                {isPomodoro 
                                    ? gameState.workSession.breakTimer + 's' 
                                    : formatSeconds(gameState.workSession.timeRemaining)
                                }
                            </span>
                        </div>
                    </div>
                )}

                {/* Main Button Row */}
                <div className="flex items-center gap-4">
                    
                    <div className="relative">
                        <GlassButton 
                            icon={Utensils} label="Feed" 
                            onClick={() => setShowFeedMenu(!showFeedMenu)} disabled={controlsDisabled} 
                            isActive={gameState.activeAction === 'FEED' || gameState.activeAction === 'DRINK'}
                        />
                        {showFeedMenu && !controlsDisabled && (
                            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-white p-2 rounded-xl shadow-xl flex flex-col gap-2 min-w-[120px] animate-float z-50">
                                <MenuBtn label="Carrot 🥕" onClick={() => { feed('FOOD'); setShowFeedMenu(false); }} />
                                <MenuBtn label="Water 💧" onClick={() => { feed('WATER'); setShowFeedMenu(false); }} />
                            </div>
                        )}
                    </div>

                    <GlassButton 
                        icon={ShowerHead} label="Clean" 
                        onClick={clean} disabled={controlsDisabled} 
                        isActive={gameState.activeAction === 'CLEAN'}
                    />
                    
                    <div className="relative">
                        <GlassButton 
                            icon={Users} label="Social" 
                            onClick={() => setShowSocialMenu(!showSocialMenu)} disabled={controlsDisabled} 
                            isActive={gameState.activeAction === 'SOCIAL'}
                        />
                        {showSocialMenu && !controlsDisabled && (
                            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-white p-2 rounded-xl shadow-xl flex flex-col gap-2 min-w-[140px] animate-float z-50">
                                <MenuBtn label="Restaurant 🍝" onClick={() => { social('RESTAURANT'); setShowSocialMenu(false); }} />
                                <MenuBtn label="Cinema 🍿" onClick={() => { social('CINEMA'); setShowSocialMenu(false); }} />
                                <MenuBtn label="TV Series 📺" onClick={() => { social('TV'); setShowSocialMenu(false); }} />
                                <MenuBtn label="Picnic 🧺" onClick={() => { social('PICNIC'); setShowSocialMenu(false); }} />
                            </div>
                        )}
                    </div>
                    
                    {/* Big STOP/WORK Button */}
                    <button 
                        onClick={work}
                        disabled={gameState.isBusy && !isWorking} 
                        className={`w-24 h-24 rounded-full shadow-2xl flex flex-col items-center justify-center gap-1 border-4 transition-all z-40 transform hover:scale-105 active:scale-95
                            ${isWorking
                                ? 'bg-red-500 border-red-400 text-white shadow-red-500/50' 
                                : gameState.isBusy 
                                    ? 'bg-gray-400 border-gray-500 text-gray-200 cursor-not-allowed' 
                                    : 'bg-white text-indigo-600 border-white hover:bg-indigo-50'
                            }
                        `}
                    >
                        {isWorking ? (
                            <>
                                <XCircle size={32} className="animate-pulse" />
                                <span className="font-black text-xs tracking-widest">STOP</span>
                            </>
                        ) : (
                            <>
                                <Briefcase size={32} />
                                <span className="font-black text-xs tracking-widest">WORK</span>
                            </>
                        )}
                    </button>

                    <div className="relative">
                        <GlassButton 
                            icon={Dumbbell} label="Train" 
                            onClick={() => setShowSportMenu(!showSportMenu)} disabled={controlsDisabled} 
                            isActive={gameState.activeAction === 'TRAIN'}
                            timer={gameState.activeAction === 'TRAIN' ? gameState.actionTimer : undefined}
                        />
                        {showSportMenu && !controlsDisabled && (
                            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-white p-2 rounded-xl shadow-xl flex flex-col gap-2 min-w-[140px] animate-float z-50">
                                <MenuBtn label="Swimming 🏊" onClick={() => { train('SWIM'); setShowSportMenu(false); }} />
                                <MenuBtn label="Lifting 💪" onClick={() => { train('LIFT'); setShowSportMenu(false); }} />
                                <MenuBtn label="Running 🏃" onClick={() => { train('RUN'); setShowSportMenu(false); }} />
                                <MenuBtn label="Pilates 🧘" onClick={() => { train('PILATES'); setShowSportMenu(false); }} />
                            </div>
                        )}
                    </div>

                    <GlassButton 
                        icon={Moon} label="Sleep" 
                        onClick={sleep} disabled={controlsDisabled} 
                        isActive={gameState.activeAction === 'SLEEP'}
                        timer={gameState.activeAction === 'SLEEP' ? gameState.actionTimer : undefined}
                    />
                    
                    <div className="relative">
                        <GlassButton 
                            icon={Shirt} label="Outfit" 
                            onClick={() => setShowOutfitMenu(!showOutfitMenu)} disabled={controlsDisabled} 
                        />
                        {showOutfitMenu && !controlsDisabled && (
                            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-white p-2 rounded-xl shadow-xl flex flex-col gap-2 min-w-[120px] animate-float z-50">
                                <MenuBtn label="Casual" onClick={() => { changeOutfit(Outfit.CASUAL); setShowOutfitMenu(false); }} />
                                <MenuBtn label="Formal" onClick={() => { changeOutfit(Outfit.WORK); setShowOutfitMenu(false); }} />
                                <MenuBtn label="Sport" onClick={() => { changeOutfit(Outfit.SPORT_GYM); setShowOutfitMenu(false); }} />
                                <MenuBtn label="Pajamas" onClick={() => { changeOutfit(Outfit.PAJAMA); setShowOutfitMenu(false); }} />
                            </div>
                        )}
                    </div>
                </div>
          </div>
          
          {/* Right side spacer to balance layout if needed, or for future widgets */}
          <div className="w-48"></div>
      </div>

    </div>
  );
};

interface GlassBtnProps {
    icon: any;
    label: string;
    onClick: () => void;
    disabled: boolean;
    isActive?: boolean;
    timer?: number;
}

const GlassButton: React.FC<GlassBtnProps> = ({ icon: Icon, label, onClick, disabled, isActive, timer }) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`w-20 h-20 rounded-2xl backdrop-blur-md border shadow-lg flex flex-col items-center justify-center gap-1 transition-all
            ${isActive 
                ? 'bg-white text-indigo-600 border-white scale-95 ring-4 ring-indigo-400/30' 
                : disabled 
                    ? 'bg-gray-500/20 border-gray-500/30 text-gray-400 cursor-not-allowed' 
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105 hover:border-white/40 active:scale-95'
            }
        `}
    >
        {timer !== undefined ? (
            <span className="text-xl font-black animate-pulse">{timer}s</span>
        ) : (
            <>
                <Icon size={24} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
            </>
        )}
    </button>
);

const MenuBtn = ({ label, onClick }: { label: string, onClick: () => void }) => (
    <button onClick={onClick} className="px-4 py-2 hover:bg-indigo-50 rounded-lg text-sm font-bold text-gray-700 text-left whitespace-nowrap w-full transition-colors">
        {label}
    </button>
);

export default App;
