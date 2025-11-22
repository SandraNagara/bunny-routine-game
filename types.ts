import React from 'react';

export enum RabbitState {
  IDLE = 'IDLE',
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  WORKING = 'WORKING',
  EXERCISE = 'EXERCISE',
  EATING = 'EATING',
  DRINKING = 'DRINKING',
  SLEEPING = 'SLEEPING',
  WAKING = 'WAKING', 
  DEAD = 'DEAD',
  CLEANING = 'CLEANING', // Generic cleanup (kept for backward compat)
  BRUSHING = 'BRUSHING',
  WASHING_FACE = 'WASHING_FACE',
  SHOWERING = 'SHOWERING',
  SOCIAL = 'SOCIAL', 
  DANCING = 'DANCING', // New
  BREAK = 'BREAK' 
}

export enum Outfit {
  CASUAL = 'CASUAL',
  WORK = 'WORK',
  PAJAMA = 'PAJAMA',
  SPORT_SWIM = 'SPORT_SWIM',
  SPORT_BIKE = 'SPORT_BIKE', 
  SPORT_RUN = 'SPORT_RUN',
  SPORT_GYM = 'SPORT_GYM',
  SPORT_PILATES = 'SPORT_PILATES',
  PARTY = 'PARTY' // New
}

export enum SceneType {
  LIVING_ROOM = 'LIVING_ROOM',
  OFFICE = 'OFFICE',
  BEDROOM = 'BEDROOM',
  BATHROOM = 'BATHROOM',
  // Social Scenes
  RESTAURANT = 'RESTAURANT',
  CINEMA = 'CINEMA',
  PICNIC = 'PICNIC',
  TV_ROOM = 'TV_ROOM',
  NIGHTCLUB = 'NIGHTCLUB', // New
  // Sport Scenes
  GYM = 'GYM',
  POOL = 'POOL',
  TRACK = 'TRACK',
  STUDIO = 'STUDIO'
}

export enum Season {
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  AUTUMN = 'AUTUMN',
  WINTER = 'WINTER'
}

export enum Weather {
  SUNNY = 'SUNNY',
  RAIN = 'RAIN',
  SNOW = 'SNOW',
  CLOUDY = 'CLOUDY',
  SAKURA = 'SAKURA' 
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface WorkSession {
  isActive: boolean;
  isPomodoro: boolean; 
  timeElapsed: number; 
  timeRemaining: number; 
  breakTimer: number; 
}

export interface DailyHygiene {
  brushed: boolean;
  washedFace: boolean;
  showered: boolean;
}

export interface GameState {
  // Core Stats (0-100)
  health: number;
  hunger: number;
  thirst: number;
  cleanliness: number;
  love: number; 
  weight: number; 
  
  // XP Stats
  xpWork: number; 
  levelWork: number; 
  xpTrain: number; 
  levelTrain: number;

  rabbitState: RabbitState;
  outfit: Outfit;
  currentScene: SceneType;
  
  // Environment
  season: Season;
  weather: Weather;
  isManualWeather: boolean; 
  lampOn: boolean; 
  
  // Action System
  isBusy: boolean;
  activeAction: string | null; 
  actionTimer: number; 
  
  // Work Session System
  workSession: WorkSession;

  // Meal System
  lunchEaten: boolean;
  dinnerEaten: boolean;
  mealPrompt: 'LUNCH' | 'DINNER' | null;
  lastDayPlayed: string; 
  lastSportDate: string; 

  // Hygiene System
  dailyHygiene: DailyHygiene;

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
  thirst: 80,
  cleanliness: 80,
  love: 80,
  weight: 50, 
  
  xpWork: 0,
  levelWork: 1,
  xpTrain: 0,
  levelTrain: 1,
  
  rabbitState: RabbitState.IDLE,
  outfit: Outfit.CASUAL,
  currentScene: SceneType.LIVING_ROOM,
  
  season: Season.SPRING, 
  weather: Weather.SUNNY,
  isManualWeather: false,
  lampOn: false,

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

  lunchEaten: false,
  dinnerEaten: false,
  mealPrompt: null,
  lastDayPlayed: new Date().toISOString(),
  lastSportDate: '',
  
  dailyHygiene: {
    brushed: false,
    washedFace: false,
    showered: false
  },

  tasks: [
    { id: '1', text: 'Check emails', completed: false },
    { id: '2', text: 'Plan the day', completed: false }
  ],
  daysSurvived: 0,
  isGameOver: false,
  currentMessage: "Hello! Let's have a great day! ^_^"
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}