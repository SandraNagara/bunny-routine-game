
export const COLORS = {
  pink: '#FFB3D9',
  blue: '#A8D8FF',
  green: '#B5E7C2',
  yellow: '#FFF4A3',
  purple: '#D4B5F1',
  white: '#FFF9F0',
  text: '#4A4A4A'
};

export const GAME_CONFIG = {
  // Timers (seconds)
  DURATION_TRAIN: 8,
  DURATION_SLEEP: 15,
  DURATION_CLEAN: 3,
  DURATION_FEED: 2,
  
  // Work Session Configuration (Accelerated: 1 minute real = 1 hour game)
  // Total 6 hours game time = 360 seconds real time
  WORK_SESSION_DURATION: 360, 
  // Pomodoro every 1 hour game time = 60 seconds real time
  POMODORO_INTERVAL: 60,
  // Break duration 15 mins game time = 15 seconds real time
  POMODORO_DURATION: 15,
  
  // Decay Rates (per 60 seconds)
  DECAY_HUNGER: 5,
  DECAY_CLEANLINESS: 3,
  DECAY_LOVE: 2,
  
  // Gains & Costs
  GAIN_FEED_HUNGER: 25,
  GAIN_FEED_LOVE: 5,
  
  GAIN_CLEAN: 35,
  
  GAIN_WORK_XP_PER_SEC: 0.5, // XP gained per second of working
  COST_WORK_HUNGER: 10,
  COST_WORK_CLEAN: 5,
  
  GAIN_TRAIN_XP: 12,
  GAIN_TRAIN_LOVE: 4,
  COST_TRAIN_HUNGER: 6,
  
  GAIN_SLEEP_HEALTH: 10,
  GAIN_SLEEP_LOVE: 3,
  COST_SLEEP_HUNGER: 5,
  COST_SLEEP_CLEAN: 5,
  
  // Health Logic
  DAMAGE_STARVING_DIRTY: 10, // Damage if conditions bad
  REGEN_HEALTH: 5,           // Heal if conditions good
  
  // Thresholds
  THRESHOLD_HUNGRY: 20,
  THRESHOLD_DIRTY: 20,
  THRESHOLD_LONELY: 20,
  THRESHOLD_FULL: 95,
  THRESHOLD_HAPPY_HEALTH: 50, // Hunger & Clean must be > 50 to heal
};

export const VOXEL_SIZE = 1;
