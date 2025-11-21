
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, INITIAL_STATE, RabbitState, Outfit, SceneType, Season, Weather } from '../types';
import { GAME_CONFIG } from '../constants';

// --- AUDIO SYSTEM (Synth) ---
const playSFX = (type: 'success' | 'alert' | 'start' | 'click' | 'eat' | 'drink') => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        const now = ctx.currentTime;

        switch (type) {
            case 'success': 
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now); 
                osc.frequency.linearRampToValueAtTime(1046.50, now + 0.1); 
                osc.frequency.linearRampToValueAtTime(1318.51, now + 0.2); 
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                osc.start(now);
                osc.stop(now + 0.6);
                break;
            case 'alert': 
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(880, now); 
                osc.frequency.setValueAtTime(880, now + 0.1);
                osc.frequency.setValueAtTime(0, now + 0.11); 
                osc.frequency.setValueAtTime(880, now + 0.2);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0.1, now + 0.3);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
                break;
            case 'start': 
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;
            case 'click':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'eat':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.linearRampToValueAtTime(200, now + 0.1);
                osc.frequency.setValueAtTime(300, now + 0.15);
                osc.frequency.linearRampToValueAtTime(200, now + 0.25);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;
            case 'drink':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
        }
    } catch (e) {
    }
};

const getSeason = (date: Date): Season => {
    const month = date.getMonth(); 
    if (month >= 2 && month <= 4) return Season.SPRING;
    if (month >= 5 && month <= 7) return Season.SUMMER;
    if (month >= 8 && month <= 10) return Season.AUTUMN;
    return Season.WINTER;
};

const getRandomWeather = (season: Season): Weather => {
    const rand = Math.random();
    if (season === Season.WINTER) {
        return rand > 0.6 ? Weather.SNOW : (rand > 0.3 ? Weather.CLOUDY : Weather.SUNNY);
    }
    if (season === Season.SPRING) {
        return rand > 0.8 ? Weather.SAKURA : (rand > 0.6 ? Weather.RAIN : Weather.SUNNY);
    }
    if (season === Season.AUTUMN) {
        return rand > 0.5 ? Weather.RAIN : (rand > 0.3 ? Weather.CLOUDY : Weather.SUNNY);
    }
    return rand > 0.9 ? Weather.RAIN : Weather.SUNNY;
};

export const useGameLoop = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem('bunnyLifeState_v7'); 
      if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.thirst === undefined) parsed.thirst = 80;
          if (parsed.weight === undefined) parsed.weight = 50;
          if (parsed.lampOn === undefined) parsed.lampOn = false;
          if (!parsed.lastSportDate) parsed.lastSportDate = '';
          return parsed;
      }
      return INITIAL_STATE;
    } catch (e) {
      return INITIAL_STATE;
    }
  });

  const [time, setTime] = useState(new Date());
  const tickCounter = useRef(0); 
  const sleepAlertShown = useRef(false);

  useEffect(() => {
    localStorage.setItem('bunnyLifeState_v7', JSON.stringify(gameState));
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

        // --- SEASON & WEATHER LOGIC ---
        if (!prev.isManualWeather) {
            const currentSeason = getSeason(now);
            if (newState.season !== currentSeason) newState.season = currentSeason;
            if (now.getMinutes() === 0 && now.getSeconds() === 0) {
                 newState.weather = getRandomWeather(newState.season);
                 if (newState.weather === Weather.RAIN) message = "It started raining... ☔";
            }
        }

        // --- DAILY RESET & SPORT CHECK ---
        const lastDate = new Date(prev.lastDayPlayed);
        if (now.getDate() !== lastDate.getDate()) {
            newState.lunchEaten = false;
            newState.dinnerEaten = false;
            newState.lastDayPlayed = now.toISOString();
            newState.daysSurvived += 1;
            
            // Check sport
            const lastSport = new Date(prev.lastSportDate);
            if (lastSport.getDate() !== lastDate.getDate()) {
                newState.weight = Math.min(100, newState.weight + GAME_CONFIG.WEIGHT_GAIN_SKIP);
                message = "I didn't exercise yesterday... gained weight ⚖️";
            }
            
            if (!prev.isManualWeather) newState.weather = getRandomWeather(newState.season);
            message = "Good morning! New day! ☀️";
        }

        // --- SLEEP ALERT (22:00) ---
        const hour = now.getHours();
        if (hour === 22 && now.getMinutes() === 0 && now.getSeconds() === 0) {
            message = "It's 22:00! Time to sleep! 🌙";
            playSFX('alert');
        }

        // --- MEAL WINDOW CHECK ---
        if (hour >= 12 && hour < 14 && !newState.lunchEaten) {
            if (newState.mealPrompt !== 'LUNCH') {
                newState.mealPrompt = 'LUNCH';
                message = "It's Lunch Time! 🥕";
                playSFX('alert');
            }
        } else if (hour >= 14 && newState.mealPrompt === 'LUNCH') {
             newState.mealPrompt = null;
             newState.hunger = Math.max(0, newState.hunger - 30);
             newState.health = Math.max(0, newState.health - 10);
        }

        if (hour >= 19 && hour < 21 && !newState.dinnerEaten) {
            if (newState.mealPrompt !== 'DINNER') {
                newState.mealPrompt = 'DINNER';
                message = "It's Dinner Time! 🥕";
                playSFX('alert');
            }
        } else if (hour >= 21 && newState.mealPrompt === 'DINNER') {
            newState.mealPrompt = null;
            newState.hunger = Math.max(0, newState.hunger - 30);
            newState.health = Math.max(0, newState.health - 10);
        }

        // --- WORK SESSION LOGIC ---
        if (newState.workSession.isActive) {
            if (newState.workSession.isPomodoro) {
                newState.workSession.breakTimer -= 1;
                // Ensure we stay in EATING state during Pomodoro
                if (newState.rabbitState !== RabbitState.EATING) {
                   newState.rabbitState = RabbitState.EATING;
                }
                newState.isBusy = false; 
                
                if (newState.workSession.breakTimer <= 0) {
                    playSFX('start');
                    newState.workSession.isPomodoro = false;
                    newState.rabbitState = RabbitState.WORKING;
                    newState.currentScene = SceneType.OFFICE;
                    newState.outfit = Outfit.WORK;
                    newState.isBusy = true; 
                    message = "Break over! Back to focus! 💼";
                }
            } 
            else {
                newState.workSession.timeRemaining -= 1;
                newState.workSession.timeElapsed += 1;
                newState.xpWork += GAME_CONFIG.GAIN_WORK_XP_PER_SEC;
                
                if (newState.workSession.timeElapsed > 0 && 
                    newState.workSession.timeElapsed % GAME_CONFIG.POMODORO_INTERVAL === 0 && 
                    newState.workSession.timeRemaining > GAME_CONFIG.POMODORO_DURATION) {
                    playSFX('alert');
                    newState.workSession.isPomodoro = true;
                    newState.workSession.breakTimer = GAME_CONFIG.POMODORO_DURATION;
                    // Keep in Office, keep Work outfit (or maybe relaxed), but EATING state
                    newState.rabbitState = RabbitState.EATING;
                    message = "Pomodoro Time! 🍪";
                }

                if (newState.workSession.timeRemaining <= 0) {
                    playSFX('success');
                    newState.workSession.isActive = false;
                    newState.isBusy = true;
                    newState.activeAction = 'FINISHED_WORK';
                    newState.actionTimer = 5;
                    newState.rabbitState = RabbitState.HAPPY;
                    newState.currentScene = SceneType.OFFICE;
                    newState.outfit = Outfit.WORK;
                    message = "Work day finished! 🎉";
                }
            }
        }

        // --- ACTION TIMER ---
        if (newState.isBusy && newState.actionTimer > 0 && !newState.workSession.isActive) {
            newState.actionTimer -= 1;
            
            if (newState.actionTimer <= 0) {
                // End of Action
                if (newState.activeAction === 'SLEEP_LONG') {
                    // Sleeping until awake
                }
                else if (newState.activeAction === 'FINISHED_WORK') {
                     newState.isBusy = false;
                     newState.activeAction = null;
                     newState.rabbitState = RabbitState.IDLE;
                     newState.currentScene = SceneType.LIVING_ROOM;
                     newState.outfit = Outfit.CASUAL;
                }
                else if (newState.activeAction === 'SLEEP') {
                    newState.activeAction = 'WAKING_ROUTINE';
                    newState.rabbitState = RabbitState.WAKING;
                    newState.actionTimer = 3; 
                    message = "Good morning! ☀️";
                }
                else if (newState.activeAction === 'WAKING_ROUTINE') {
                    newState.isBusy = false;
                    newState.rabbitState = RabbitState.IDLE;
                    newState.hunger = Math.max(0, newState.hunger - GAME_CONFIG.COST_SLEEP_HUNGER);
                    newState.cleanliness = Math.max(0, newState.cleanliness - GAME_CONFIG.COST_SLEEP_CLEAN);
                    newState.currentScene = SceneType.LIVING_ROOM;
                    newState.outfit = Outfit.CASUAL;
                    newState.activeAction = null;
                }
                else {
                    // Generic finish
                    newState.isBusy = false;
                    newState.rabbitState = RabbitState.IDLE;
                    newState.currentScene = SceneType.LIVING_ROOM;
                    if (newState.outfit !== Outfit.CASUAL && !newState.workSession.isActive) newState.outfit = Outfit.CASUAL;
                    
                    if (newState.activeAction === 'TRAIN') {
                        newState.xpTrain += GAME_CONFIG.GAIN_TRAIN_XP;
                        newState.lastSportDate = new Date().toISOString();
                        newState.weight = Math.max(0, newState.weight - GAME_CONFIG.WEIGHT_LOSS_TRAIN);
                    }
                    newState.activeAction = null;
                }
            }
        }

        // --- DECAY LOOP ---
        tickCounter.current += 1;
        if (tickCounter.current >= 60) {
            tickCounter.current = 0;
            if (!newState.workSession.isActive || newState.workSession.isPomodoro) {
                newState.hunger = Math.max(0, newState.hunger - GAME_CONFIG.DECAY_HUNGER);
                newState.thirst = Math.max(0, newState.thirst - GAME_CONFIG.DECAY_THIRST);
                newState.cleanliness = Math.max(0, newState.cleanliness - GAME_CONFIG.DECAY_CLEANLINESS);
                newState.love = Math.max(0, newState.love - GAME_CONFIG.DECAY_LOVE);
                
                if (newState.currentScene === SceneType.LIVING_ROOM && 
                   (newState.weather === Weather.RAIN || newState.weather === Weather.SNOW)) {
                       newState.cleanliness -= 2; 
                }
            }
            
            if (newState.hunger < 20) {
                 newState.health = Math.max(0, newState.health - 5);
                 message = "I feel sick... 🤢";
            }
            if (newState.thirst < 20) {
                newState.health = Math.max(0, newState.health - 5);
                message = "Thirsty... 💧";
            }
        }

        // --- GAME OVER ---
        if (newState.health <= 0) {
            newState.isGameOver = true;
            newState.rabbitState = RabbitState.DEAD;
        }

        return { ...newState, currentMessage: message };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  // --- ACTIONS ---

  const feed = useCallback((type: 'FOOD' | 'WATER' = 'FOOD') => {
    setGameState(prev => {
        if (prev.isBusy && !prev.workSession.isPomodoro) return prev;
        
        if (type === 'WATER') {
             playSFX('drink');
             return {
                ...prev,
                isBusy: true,
                activeAction: 'DRINK',
                actionTimer: GAME_CONFIG.DURATION_DRINK,
                rabbitState: RabbitState.DRINKING,
                thirst: Math.min(100, prev.thirst + GAME_CONFIG.GAIN_DRINK_THIRST),
                currentMessage: "Refreshing! 💧"
             };
        } else {
             playSFX('eat');
             let fulfillLunch = false;
             let fulfillDinner = false;
             const hour = new Date().getHours();
             if (hour >= 12 && hour < 14 && !prev.lunchEaten) fulfillLunch = true;
             if (hour >= 19 && hour < 21 && !prev.dinnerEaten) fulfillDinner = true;

             return {
                ...prev,
                isBusy: true,
                activeAction: 'FEED',
                actionTimer: GAME_CONFIG.DURATION_FEED,
                rabbitState: RabbitState.EATING,
                hunger: Math.min(100, prev.hunger + GAME_CONFIG.GAIN_FEED_HUNGER),
                lunchEaten: fulfillLunch ? true : prev.lunchEaten,
                dinnerEaten: fulfillDinner ? true : prev.dinnerEaten,
                mealPrompt: null, 
                currentMessage: "Yummy! 🥕"
            };
        }
    });
  }, []);

  const clean = useCallback(() => {
    playSFX('click');
    setGameState(prev => {
        if (prev.isBusy) return prev;
        return {
            ...prev,
            isBusy: true,
            activeAction: 'CLEAN',
            actionTimer: GAME_CONFIG.DURATION_CLEAN,
            rabbitState: RabbitState.CLEANING,
            cleanliness: Math.min(100, prev.cleanliness + GAME_CONFIG.GAIN_CLEAN),
            currentMessage: "Scrub scrub! 🧼"
        };
    });
  }, []);

  const social = useCallback((activity: 'RESTAURANT' | 'CINEMA' | 'TV' | 'PICNIC') => {
    playSFX('click');
    setGameState(prev => {
        if (prev.isBusy) return prev;
        
        let targetScene = SceneType.LIVING_ROOM;
        let msg = "Hanging out!";
        
        if (activity === 'RESTAURANT') { targetScene = SceneType.RESTAURANT; msg = "Dinner with Kitty! 🐱"; }
        if (activity === 'CINEMA') { targetScene = SceneType.CINEMA; msg = "Watching a movie! 🍿"; }
        if (activity === 'TV') { targetScene = SceneType.TV_ROOM; msg = "Binge watching! 📺"; }
        if (activity === 'PICNIC') { targetScene = SceneType.PICNIC; msg = "Picnic time! 🧺"; }

        return {
            ...prev,
            isBusy: true,
            activeAction: 'SOCIAL',
            actionTimer: GAME_CONFIG.DURATION_SOCIAL,
            rabbitState: RabbitState.SOCIAL,
            currentScene: targetScene,
            currentMessage: msg,
            love: Math.min(100, prev.love + GAME_CONFIG.GAIN_SOCIAL_LOVE)
        };
    });
  }, []);

  const work = useCallback(() => {
    playSFX('start');
    setGameState(prev => {
        if (prev.workSession.isActive) {
             return {
                ...prev,
                workSession: { ...prev.workSession, isActive: false },
                isBusy: false,
                rabbitState: RabbitState.IDLE,
                currentScene: SceneType.LIVING_ROOM,
                outfit: Outfit.CASUAL,
                currentMessage: "Work cancelled."
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
            currentMessage: "Focus Session! 💼"
        };
    });
  }, []);
  
  const togglePomodoro = useCallback(() => {
      playSFX('click');
      setGameState(prev => {
          if (!prev.workSession.isActive) return prev;
          if (prev.workSession.isPomodoro) {
              return {
                  ...prev,
                  workSession: { ...prev.workSession, isPomodoro: false, breakTimer: 0 },
                  rabbitState: RabbitState.WORKING,
                  currentScene: SceneType.OFFICE,
                  outfit: Outfit.WORK,
                  isBusy: true,
                  currentMessage: "Back to work! 💪"
              };
          } else {
              return {
                  ...prev,
                  workSession: { ...prev.workSession, isPomodoro: true, breakTimer: GAME_CONFIG.POMODORO_DURATION },
                  // Stay in OFFICE, just relax/eat
                  rabbitState: RabbitState.EATING,
                  isBusy: false,
                  currentMessage: "Quick break! 🍪"
              };
          }
      });
  }, []);

  const train = useCallback((sport: 'SWIM' | 'LIFT' | 'RUN' | 'PILATES') => {
    playSFX('click');
    setGameState(prev => {
        if (prev.isBusy) return prev;
        
        let outfit = Outfit.SPORT_GYM;
        let scene = SceneType.GYM;
        let msg = "Let's train! 🔥";

        if (sport === 'SWIM') { outfit = Outfit.SPORT_SWIM; scene = SceneType.POOL; msg = "Swimming laps! 🏊"; }
        if (sport === 'LIFT') { outfit = Outfit.SPORT_GYM; scene = SceneType.GYM; msg = "Lifting weights! 💪"; }
        if (sport === 'RUN') { outfit = Outfit.SPORT_RUN; scene = SceneType.TRACK; msg = "Running fast! 🏃"; }
        if (sport === 'PILATES') { outfit = Outfit.SPORT_PILATES; scene = SceneType.STUDIO; msg = "Pilates time! 🧘"; }

        return {
            ...prev,
            isBusy: true,
            activeAction: 'TRAIN',
            actionTimer: GAME_CONFIG.DURATION_TRAIN,
            rabbitState: RabbitState.EXERCISE,
            currentScene: scene,
            outfit: outfit,
            currentMessage: msg
        };
    });
  }, []);

  const sleep = useCallback(() => {
    playSFX('click');
    setGameState(prev => {
        if (prev.isBusy) return prev;
        const hour = new Date().getHours();
        const isNight = hour >= 22 || hour < 6;
        const duration = isNight ? GAME_CONFIG.DURATION_LONG_SLEEP : GAME_CONFIG.DURATION_SLEEP;
        
        return {
            ...prev,
            isBusy: true,
            activeAction: isNight ? 'SLEEP_LONG' : 'SLEEP',
            actionTimer: duration,
            rabbitState: RabbitState.SLEEPING,
            currentScene: SceneType.BEDROOM,
            outfit: Outfit.PAJAMA,
            currentMessage: isNight ? "Goodnight... see you tomorrow! 🌙" : "Power nap! Zzz..."
        };
    });
  }, []);
  
  const wakeUp = useCallback(() => {
      setGameState(prev => ({
          ...prev,
          activeAction: 'WAKING_ROUTINE',
          rabbitState: RabbitState.WAKING,
          actionTimer: 3,
          currentMessage: "Waking up..."
      }));
  }, []);

  const changeOutfit = useCallback((newOutfit: Outfit) => {
      playSFX('click');
      setGameState(prev => {
          if (prev.isBusy && !prev.workSession.isPomodoro) return prev; 
          return { ...prev, outfit: newOutfit };
      });
  }, []);
  
  const setManualWeather = useCallback((season: Season, weather: Weather) => {
      setGameState(prev => ({
          ...prev,
          isManualWeather: true,
          season,
          weather
      }));
  }, []);

  const toggleLamp = useCallback(() => {
      playSFX('click');
      setGameState(prev => ({ ...prev, lampOn: !prev.lampOn }));
  }, []);

  const addTask = useCallback((text: string) => {
    playSFX('click');
    setGameState(prev => ({
      ...prev,
      tasks: [...prev.tasks, { id: Date.now().toString(), text, completed: false }]
    }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    playSFX('success');
    setGameState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  }, []);

  const restartGame = useCallback(() => {
      setGameState(prev => ({
          ...INITIAL_STATE,
          daysSurvived: prev.daysSurvived, 
          levelWork: prev.levelWork,
          levelTrain: prev.levelTrain,
      }));
      tickCounter.current = 0;
  }, []);

  return {
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
  };
};
