
import React, { useState } from 'react';
import { useGameLoop } from './hooks/useGameLoop';
import Scene from './components/Scene';
import PostIt from './components/PostIt';
import HUD from './components/HUD';
import { Briefcase, Utensils, ShowerHead, Heart, Moon, Dumbbell, Shirt, XCircle } from 'lucide-react';
import { Outfit, SceneType } from './types';
import { GAME_CONFIG } from './constants';

const App: React.FC = () => {
  const { 
    gameState, 
    time, 
    feed, 
    clean, 
    love, 
    work, 
    train, 
    sleep, 
    addTask, 
    toggleTask,
    changeOutfit,
    restartGame
  } = useGameLoop();

  const [showOutfitMenu, setShowOutfitMenu] = useState(false);

  // --- Derived Background Style based on Time ---
  const getBgGradient = () => {
      const hour = time.getHours();
      if (hour >= 6 && hour < 12) return 'bg-gradient-to-b from-yellow-200 to-sky-300';
      if (hour >= 12 && hour < 18) return 'bg-gradient-to-b from-sky-300 to-orange-300';
      if (hour >= 18 && hour < 22) return 'bg-gradient-to-b from-orange-400 to-purple-600';
      return 'bg-gradient-to-b from-indigo-900 to-purple-900';
  };

  // Formatting for Timer
  const formatSeconds = (secs: number) => {
      const h = Math.floor(secs / 60); // Game Hours (represented by real minutes)
      const m = secs % 60;
      return `${h}h ${m < 10 ? '0'+m : m}m`;
  };

  const isWorking = gameState.workSession.isActive;
  const isPomodoro = gameState.workSession.isPomodoro;
  // Buttons are disabled if Busy AND NOT in Pomodoro (Pomodoro allows interactions)
  const controlsDisabled = gameState.isBusy && !isPomodoro;

  if (gameState.isGameOver) {
      return (
          <div className="w-full h-screen bg-gray-900 flex flex-col items-center justify-center text-white grayscale">
              <h1 className="text-6xl font-black mb-4 title-font">GAME OVER</h1>
              <p className="text-2xl mb-8">Your bunny needs more love...</p>
              <button onClick={restartGame} className="bg-white text-black px-8 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform">
                Try Again 💔
              </button>
          </div>
      );
  }

  return (
    <div className={`w-full h-screen relative overflow-hidden transition-colors duration-1000 ${getBgGradient()}`}>
      
      <Scene 
        state={gameState.rabbitState} 
        outfit={gameState.outfit}
        scene={gameState.currentScene}
        isDirty={gameState.cleanliness < GAME_CONFIG.THRESHOLD_DIRTY}
        showCookie={isPomodoro} 
      />

      <HUD 
        time={time} 
        health={gameState.health} 
        hunger={gameState.hunger}
        cleanliness={gameState.cleanliness}
        love={gameState.love}
        xpWork={gameState.xpWork}
        xpTrain={gameState.xpTrain}
        levelWork={gameState.levelWork}
        levelTrain={gameState.levelTrain}
        currentMessage={gameState.currentMessage}
      />

      {/* Task List visible if working or office */}
      {(gameState.currentScene === SceneType.OFFICE || isWorking) && (
          <PostIt 
            tasks={gameState.tasks}
            onAdd={addTask}
            onToggle={toggleTask}
          />
      )}

      {/* --- MAIN CONTROLS --- */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-3xl px-4">
        
        {/* WORK STATUS OVERLAY (Optional visual aid above buttons) */}
        {isWorking && (
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-6 py-2 rounded-full shadow-lg flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full animate-pulse ${isPomodoro ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-bold text-indigo-900">
                    {isPomodoro ? 'POMODORO BREAK 🍪' : 'WORK SESSION'}
                </span>
                <span className="font-mono text-lg">
                    {isPomodoro 
                        ? gameState.workSession.breakTimer + 's' 
                        : formatSeconds(gameState.workSession.timeRemaining)
                    }
                </span>
            </div>
        )}

        <div className="grid grid-cols-7 gap-4 items-end">
            
            <ActionButton 
                icon={Utensils} label="Feed" color="bg-orange-400" 
                onClick={feed} disabled={controlsDisabled} 
                isActive={gameState.activeAction === 'FEED'}
            />
            <ActionButton 
                icon={ShowerHead} label="Clean" color="bg-blue-400" 
                onClick={clean} disabled={controlsDisabled} 
                isActive={gameState.activeAction === 'CLEAN'}
            />
            <ActionButton 
                icon={Heart} label="Love" color="bg-pink-400" 
                onClick={love} disabled={controlsDisabled} 
                isActive={gameState.activeAction === 'LOVE'}
            />
            
            {/* WORK (Center) */}
            <div className="col-span-1 flex justify-center">
                 <button 
                    onClick={work}
                    disabled={gameState.isBusy && !isWorking} // Disable only if busy with OTHER actions
                    className={`w-24 h-24 rounded-full shadow-2xl flex flex-col items-center justify-center gap-1 border-b-8 transition-all z-40
                        ${isWorking
                            ? 'bg-red-500 border-red-700 hover:bg-red-600' // Stop Button Style
                            : gameState.isBusy 
                                ? 'bg-gray-300 border-gray-400 opacity-50' 
                                : 'bg-indigo-500 border-indigo-700 hover:scale-105 active:scale-95 active:border-b-0 active:translate-y-2'
                        } text-white`}
                >
                    {isWorking ? (
                        <>
                            <XCircle size={32} />
                            <span className="font-bold text-[10px]">STOP</span>
                        </>
                    ) : (
                        <>
                            <Briefcase size={32} />
                            <span className="font-bold text-xs">WORK</span>
                        </>
                    )}
                </button>
            </div>

            <ActionButton 
                icon={Dumbbell} label="Train" color="bg-emerald-400" 
                onClick={train} disabled={controlsDisabled} 
                isActive={gameState.activeAction === 'TRAIN'}
                timer={gameState.activeAction === 'TRAIN' ? gameState.actionTimer : undefined}
            />
            <ActionButton 
                icon={Moon} label="Sleep" color="bg-purple-500" 
                onClick={sleep} disabled={controlsDisabled} 
                isActive={gameState.activeAction === 'SLEEP'}
                timer={gameState.activeAction === 'SLEEP' ? gameState.actionTimer : undefined}
            />
            
            {/* Outfit Menu */}
            <div className="relative">
                <ActionButton 
                    icon={Shirt} label="Outfit" color="bg-yellow-400" 
                    onClick={() => setShowOutfitMenu(!showOutfitMenu)} disabled={controlsDisabled} 
                />
                
                {showOutfitMenu && !controlsDisabled && (
                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white p-2 rounded-xl shadow-xl flex flex-col gap-2 min-w-[120px] animate-float z-50">
                        <OutfitBtn label="Casual" onClick={() => { changeOutfit(Outfit.CASUAL); setShowOutfitMenu(false); }} />
                        <OutfitBtn label="Formal" onClick={() => { changeOutfit(Outfit.WORK); setShowOutfitMenu(false); }} />
                        <OutfitBtn label="Sport" onClick={() => { changeOutfit(Outfit.SPORT_GYM); setShowOutfitMenu(false); }} />
                        <OutfitBtn label="Pajamas" onClick={() => { changeOutfit(Outfit.PAJAMA); setShowOutfitMenu(false); }} />
                    </div>
                )}
            </div>

        </div>
      </div>

    </div>
  );
};

interface ActionBtnProps {
    icon: any;
    label: string;
    color: string;
    onClick: () => void;
    disabled: boolean;
    isActive?: boolean;
    timer?: number;
}

const ActionButton: React.FC<ActionBtnProps> = ({ icon: Icon, label, color, onClick, disabled, isActive, timer }) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`w-full aspect-square rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 border-b-4 transition-all 
            ${isActive 
                ? `${color} scale-95 border-b-0 brightness-90` 
                : disabled 
                    ? 'bg-gray-300 border-gray-400 cursor-not-allowed opacity-50' 
                    : `${color} border-black/10 hover:brightness-110 active:scale-95 active:border-b-0 active:translate-y-2 text-white`
            }
        `}
    >
        {timer !== undefined ? (
            <span className="text-2xl font-black animate-pulse">{timer}s</span>
        ) : (
            <>
                <Icon size={24} />
                <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
            </>
        )}
    </button>
);

const OutfitBtn = ({ label, onClick }: { label: string, onClick: () => void }) => (
    <button onClick={onClick} className="px-4 py-2 hover:bg-yellow-100 rounded-lg text-sm font-bold text-gray-700 text-left whitespace-nowrap w-full">
        {label}
    </button>
);

export default App;
