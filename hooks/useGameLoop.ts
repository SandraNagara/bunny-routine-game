
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, INITIAL_STATE, RabbitState, Outfit, SceneType } from '../types';
import { GAME_CONFIG } from '../constants';

export const useGameLoop = () => {
  // Load from localStorage or default
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem('bunnyLifeState_v3');
      return saved ? JSON.parse(saved) : INITIAL_STATE;
    } catch (e) {
      return INITIAL_STATE;
    }
  });

  const [time, setTime] = useState(new Date());
  const tickCounter = useRef(0); // Counts seconds for the 60s decay loop

  // Persistence
  useEffect(() => {
    localStorage.setItem('bunnyLifeState_v3', JSON.stringify(gameState));
  }, [gameState]);

  // --- MAIN LOOP (1s Tick) ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now);

      setGameState(prev => {
        if (prev.isGameOver) return prev;
        
        let newState = { ...prev };
        let message = prev.currentMessage;

        // --- 0. WORK SESSION LOGIC ---
        if (newState.workSession.isActive) {
            
            // A. POMODORO BREAK
            if (newState.workSession.isPomodoro) {
                newState.workSession.breakTimer -= 1;
                newState.rabbitState = RabbitState.IDLE; // Relaxing during break
                newState.isBusy = false; // Allow interactions (Feed, etc.) during break
                
                if (newState.workSession.breakTimer <= 0) {
                    // END BREAK
                    newState.workSession.isPomodoro = false;
                    newState.rabbitState = RabbitState.WORKING;
                    newState.currentScene = SceneType.OFFICE;
                    newState.outfit = Outfit.WORK;
                    newState.isBusy = true; // Lock controls again
                    message = "Break over! Back to focus! 💼";
                } else {
                    message = `Pomodoro Break! Relax... 🍪 (${newState.workSession.breakTimer}s)`;
                }
            } 
            // B. WORKING
            else {
                newState.workSession.timeRemaining -= 1;
                newState.workSession.timeElapsed += 1;
                
                // XP PROGRESS
                newState.xpWork += GAME_CONFIG.GAIN_WORK_XP_PER_SEC;
                
                // CHECK POMODORO TRIGGER
                // Every 60s (Game Hour) trigger a break, but not at the very end
                if (newState.workSession.timeElapsed > 0 && 
                    newState.workSession.timeElapsed % GAME_CONFIG.POMODORO_INTERVAL === 0 && 
                    newState.workSession.timeRemaining > GAME_CONFIG.POMODORO_DURATION) {
                    
                    newState.workSession.isPomodoro = true;
                    newState.workSession.breakTimer = GAME_CONFIG.POMODORO_DURATION;
                    newState.currentScene = SceneType.LIVING_ROOM; // Go to lounge for break
                    newState.outfit = Outfit.CASUAL;
                    message = "Pomodoro Time! Take a break! 🍪";
                }

                // END WORK SESSION
                if (newState.workSession.timeRemaining <= 0) {
                    newState.workSession.isActive = false;
                    newState.isBusy = false;
                    newState.activeAction = null;
                    newState.rabbitState = RabbitState.HAPPY;
                    newState.currentScene = SceneType.LIVING_ROOM;
                    newState.outfit = Outfit.CASUAL;
                    message = "Work day finished! Great job! 🎉";
                }
            }
        }

        // --- 1. HANDLE STANDARD ACTION TIMER (Train, Sleep, etc.) ---
        // Only process if NOT in a main work session (or if action triggered during break)
        if (newState.isBusy && newState.actionTimer > 0 && !newState.workSession.isActive) {
            newState.actionTimer -= 1;
            
            // ACTION COMPLETED
            if (newState.actionTimer <= 0) {
                
                // --- SPECIAL LOGIC FOR SLEEP SEQUENCE ---
                if (newState.activeAction === 'SLEEP') {
                    // Phase 1 Done: Start Phase 2 (Waking Up)
                    newState.activeAction = 'WAKING_ROUTINE';
                    newState.rabbitState = RabbitState.WAKING;
                    newState.actionTimer = 3; // 3 seconds to wake up
                    message = "Yawn... Good morning! ☀️";
                }
                else if (newState.activeAction === 'WAKING_ROUTINE') {
                    // Phase 2 Done: Actually finish the sleep cycle
                    newState.isBusy = false;
                    newState.rabbitState = RabbitState.IDLE;
                    
                    // Apply Sleep Stats Here
                    newState.hunger = Math.max(0, newState.hunger - GAME_CONFIG.COST_SLEEP_HUNGER);
                    newState.cleanliness = Math.max(0, newState.cleanliness - GAME_CONFIG.COST_SLEEP_CLEAN);
                    newState.love = Math.min(100, newState.love + GAME_CONFIG.GAIN_SLEEP_LOVE);
                    newState.health = Math.min(100, newState.health + GAME_CONFIG.GAIN_SLEEP_HEALTH);
                    
                    newState.currentScene = SceneType.LIVING_ROOM;
                    newState.outfit = Outfit.CASUAL;
                    newState.activeAction = null;
                    message = "I feel refreshed! ☀️";
                }
                // --- STANDARD ACTIONS ---
                else {
                    newState.isBusy = false;
                    newState.rabbitState = RabbitState.IDLE;
                    
                    // Resolve Action Effects
                    switch (newState.activeAction) {
                        case 'TRAIN':
                            newState.xpTrain += GAME_CONFIG.GAIN_TRAIN_XP;
                            newState.love = Math.min(100, newState.love + GAME_CONFIG.GAIN_TRAIN_LOVE);
                            newState.hunger = Math.max(0, newState.hunger - GAME_CONFIG.COST_TRAIN_HUNGER);
                            newState.currentScene = SceneType.LIVING_ROOM;
                            newState.outfit = Outfit.CASUAL;
                            message = "Phew! Stronger everyday! 💪";
                            break;
                        case 'FEED':
                        case 'CLEAN':
                        case 'LOVE':
                            // Immediate effects handled in function, this resets state
                            break;
                    }
                    newState.activeAction = null;
                }
            }
        }

        // --- 2. LEVEL UP LOGIC (Looping 0-100) ---
        if (newState.xpWork >= 100) {
            newState.xpWork -= 100;
            newState.levelWork += 1;
            message = `WORK LEVEL UP! Lvl ${newState.levelWork} 🎉`;
        }
        if (newState.xpTrain >= 100) {
            newState.xpTrain -= 100;
            newState.levelTrain += 1;
            message = `SPORT LEVEL UP! Lvl ${newState.levelTrain} 🎉`;
        }

        // --- 3. DECAY LOOP (Every 60s) ---
        tickCounter.current += 1;
        if (tickCounter.current >= 60) {
            tickCounter.current = 0;

            // PAUSE DECAY IF WORKING (Focus Mode)
            if (!newState.workSession.isActive || newState.workSession.isPomodoro) {
                newState.hunger = Math.max(0, newState.hunger - GAME_CONFIG.DECAY_HUNGER);
                newState.cleanliness = Math.max(0, newState.cleanliness - GAME_CONFIG.DECAY_CLEANLINESS);
                newState.love = Math.max(0, newState.love - GAME_CONFIG.DECAY_LOVE);
            }

            // HEALTH LOGIC
            if (newState.hunger < GAME_CONFIG.THRESHOLD_HUNGRY || newState.cleanliness < GAME_CONFIG.THRESHOLD_DIRTY) {
                newState.health = Math.max(0, newState.health - GAME_CONFIG.DAMAGE_STARVING_DIRTY);
                message = "I don't feel so good... 🤒";
            } 
            else if (newState.hunger > GAME_CONFIG.THRESHOLD_HAPPY_HEALTH && newState.cleanliness > GAME_CONFIG.THRESHOLD_HAPPY_HEALTH) {
                newState.health = Math.min(100, newState.health + GAME_CONFIG.REGEN_HEALTH);
            }
            
            // Automatic Message Update based on Needs
            if (!newState.isBusy && !newState.workSession.isActive) {
                if (newState.hunger < GAME_CONFIG.THRESHOLD_HUNGRY) message = "I'm so hungry... 🥕";
                else if (newState.cleanliness < GAME_CONFIG.THRESHOLD_DIRTY) message = "I feel dirty... 🚿";
                else if (newState.love < GAME_CONFIG.THRESHOLD_LONELY) message = "I'm lonely... ❤️";
            }
        }

        // --- 4. GAME OVER CHECK ---
        if (newState.health <= 0) {
            newState.isGameOver = true;
            newState.rabbitState = RabbitState.DEAD;
        }

        return { ...newState, currentMessage: message };
      });

    }, 1000); // 1 second tick

    return () => clearInterval(interval);
  }, []);


  // --- ACTIONS ---

  const feed = useCallback(() => {
    setGameState(prev => {
        const canAct = !prev.isBusy || (prev.workSession.isActive && prev.workSession.isPomodoro);
        if (!canAct) return prev;
        
        if (prev.hunger >= GAME_CONFIG.THRESHOLD_FULL) {
            return { ...prev, currentMessage: "I'm full! No more carrots! 🥕" };
        }
        
        return {
            ...prev,
            isBusy: true,
            activeAction: 'FEED',
            actionTimer: GAME_CONFIG.DURATION_FEED,
            rabbitState: RabbitState.EATING,
            hunger: Math.min(100, prev.hunger + GAME_CONFIG.GAIN_FEED_HUNGER),
            love: Math.min(100, prev.love + GAME_CONFIG.GAIN_FEED_LOVE),
            currentMessage: "Yummy! I love carrots! 🥕"
        };
    });
  }, []);

  const clean = useCallback(() => {
    setGameState(prev => {
        const canAct = !prev.isBusy || (prev.workSession.isActive && prev.workSession.isPomodoro);
        if (!canAct) return prev;

        if (prev.cleanliness >= 99) {
            return { ...prev, currentMessage: "I'm already clean! ✨" };
        }

        return {
            ...prev,
            isBusy: true,
            activeAction: 'CLEAN',
            actionTimer: GAME_CONFIG.DURATION_CLEAN,
            rabbitState: RabbitState.CLEANING,
            cleanliness: Math.min(100, prev.cleanliness + GAME_CONFIG.GAIN_CLEAN),
            currentMessage: "Scrub scrub! So fresh! 🧼"
        };
    });
  }, []);

  const love = useCallback(() => {
    setGameState(prev => {
        const canAct = !prev.isBusy || (prev.workSession.isActive && prev.workSession.isPomodoro);
        if (!canAct) return prev;
        
        return {
            ...prev,
            isBusy: true,
            activeAction: 'LOVE',
            actionTimer: 2,
            rabbitState: RabbitState.LOVING,
            love: Math.min(100, prev.love + 15),
            currentMessage: "I love you too! ❤️"
        };
    });
  }, []);

  // TOGGLE WORK SESSION
  const work = useCallback(() => {
    setGameState(prev => {
        if (prev.workSession.isActive) {
             return {
                ...prev,
                workSession: { ...prev.workSession, isActive: false },
                isBusy: false,
                rabbitState: RabbitState.IDLE,
                currentScene: SceneType.LIVING_ROOM,
                outfit: Outfit.CASUAL,
                currentMessage: "Work session cancelled."
             };
        }

        if (prev.isBusy) return prev;

        return {
            ...prev,
            isBusy: true,
            activeAction: 'WORK_SESSION',
            workSession: {
                isActive: true,
                isPomodoro: false,
                timeElapsed: 0,
                timeRemaining: GAME_CONFIG.WORK_SESSION_DURATION,
                breakTimer: 0
            },
            rabbitState: RabbitState.WORKING,
            currentScene: SceneType.OFFICE,
            outfit: Outfit.WORK,
            currentMessage: "Let's focus for 6 hours! (Simulated) 💼"
        };
    });
  }, []);

  const train = useCallback(() => {
    setGameState(prev => {
        if (prev.isBusy) return prev;
        
        const sports = [Outfit.SPORT_BIKE, Outfit.SPORT_GYM, Outfit.SPORT_RUN, Outfit.SPORT_SWIM];
        const randomSport = sports[Math.floor(Math.random() * sports.length)];

        return {
            ...prev,
            isBusy: true,
            activeAction: 'TRAIN',
            actionTimer: GAME_CONFIG.DURATION_TRAIN,
            rabbitState: RabbitState.EXERCISE,
            currentScene: SceneType.GYM,
            outfit: randomSport,
            currentMessage: "Feel the burn! Let's go! 🔥"
        };
    });
  }, []);

  const sleep = useCallback(() => {
    setGameState(prev => {
        if (prev.isBusy) return prev;

        return {
            ...prev,
            isBusy: true,
            activeAction: 'SLEEP',
            actionTimer: GAME_CONFIG.DURATION_SLEEP,
            rabbitState: RabbitState.SLEEPING,
            currentScene: SceneType.BEDROOM,
            outfit: Outfit.PAJAMA,
            currentMessage: "Goodnight... Zzz... 🌙"
        };
    });
  }, []);

  const changeOutfit = useCallback((newOutfit: Outfit) => {
      setGameState(prev => {
          if (prev.isBusy && !prev.workSession.isPomodoro) return prev; 
          return { ...prev, outfit: newOutfit };
      });
  }, []);

  const addTask = useCallback((text: string) => {
    setGameState(prev => ({
      ...prev,
      tasks: [...prev.tasks, { id: Date.now().toString(), text, completed: false }]
    }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setGameState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  }, []);

  const restartGame = useCallback(() => {
      localStorage.removeItem('bunnyLifeState_v3');
      setGameState(INITIAL_STATE);
      tickCounter.current = 0;
  }, []);

  return {
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
  };
};
