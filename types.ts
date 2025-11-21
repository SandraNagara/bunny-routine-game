
export enum RabbitState {
  IDLE = 'IDLE',
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  WORKING = 'WORKING',
  EXERCISE = 'EXERCISE',
  EATING = 'EATING',
  SLEEPING = 'SLEEPING',
  WAKING = 'WAKING', // New state for wake up animation
  DEAD = 'DEAD',
  CLEANING = 'CLEANING',
  LOVING = 'LOVING',
  BREAK = 'BREAK' // New state for Pomodoro break
}

export enum Outfit {
  CASUAL = 'CASUAL',
  WORK = 'WORK',
  PAJAMA = 'PAJAMA',
  // Sport variants
  SPORT_SWIM = 'SPORT_SWIM',
  SPORT_BIKE = 'SPORT_BIKE',
  SPORT_RUN = 'SPORT_RUN',
  SPORT_GYM = 'SPORT_GYM'
}

export enum SceneType {
  LIVING_ROOM = 'LIVING_ROOM',
  OFFICE = 'OFFICE',
  GYM = 'GYM',
  BEDROOM = 'BEDROOM'
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface WorkSession {
  isActive: boolean;
  isPomodoro: boolean; // True if currently in a break
  timeElapsed: number; // Seconds worked so far
  timeRemaining: number; // Seconds left in total 6h session
  breakTimer: number; // Seconds left in current break
}

export interface GameState {
  // Core Stats (0-100)
  health: number;
  hunger: number; // 100 = Full, 0 = Starving
  cleanliness: number;
  love: number;
  
  // XP Stats
  xpWork: number; // Current XP progress (0-100)
  levelWork: number; // Current Level
  xpTrain: number; // Current XP progress (0-100)
  levelTrain: number; // Current Level

  rabbitState: RabbitState;
  outfit: Outfit;
  currentScene: SceneType;
  
  // Action System
  isBusy: boolean;
  activeAction: string | null; // 'WORK', 'TRAIN', 'SLEEP', etc.
  actionTimer: number; // Countdown in seconds
  
  // Work Session System
  workSession: WorkSession;

  // Task System
  tasks: Task[];
  
  // Metadata
  daysSurvived: number;
  isGameOver: boolean;
  
  // UI Messages/Bubbles
  currentMessage: string | null;
}

export const INITIAL_STATE: GameState = {
  health: 100,
  hunger: 80,
  cleanliness: 80,
  love: 80,
  
  xpWork: 0,
  levelWork: 1,
  xpTrain: 0,
  levelTrain: 1,
  
  rabbitState: RabbitState.IDLE,
  outfit: Outfit.CASUAL,
  currentScene: SceneType.LIVING_ROOM,
  
  isBusy: false,
  activeAction: null,
  actionTimer: 0,
  
  workSession: {
    isActive: false,
    isPomodoro: false,
    timeElapsed: 0,
    timeRemaining: 0,
    breakTimer: 0
  },
  
  tasks: [
    { id: '1', text: 'Check emails', completed: false },
    { id: '2', text: 'Plan the day', completed: false }
  ],
  daysSurvived: 0,
  isGameOver: false,
  currentMessage: "Hello! Let's have a great day! ^_^"
};
