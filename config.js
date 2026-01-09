// config.js - Central configuration for game tuning
export const CONFIG = {
  VERSION: "v0.5.0",
  BUILD_NAME: "Modular Edition",
  
  // Game Balance
  STARTING_BUDGET: 1000,
  WEEKS_TOTAL: 12,
  STAT_MIN: 0,
  STAT_MAX: 120,
  
  // Competition Targets
  COMP_TARGET_STANDARD: 70,
  COMP_TARGET_FINAL: 78,
  
  // Variance Settings
  VARIANCE_SAFE: 6,
  VARIANCE_STANDARD: 10,
  VARIANCE_BOLD: 15,
  VARIANCE_SCOUT_REDUCTION: 3,
  VARIANCE_TEST_REDUCTION: 2,
  
  // Scoring Weights
  SCORING: {
    palate: 0.30,
    technique: 0.28,
    cleanliness: 0.22,
    consistency: 0.20,
    menuWow: 0.18,
    creativity: 0.12,
    composure: 0.22,
    fatiguePenaltyRate: 0.55,
    riskPenaltyRate: 0.32,
    fatigueThreshold: 35,
    riskThreshold: 20,
    prepBonusMax: 18,
    emphasisModifier: 0.05
  },
  
  // Event Chances
  EVENT_CHANCE_PER_WEEK: 0.55,
  FATIGUE_MORALE_PENALTY_CHANCE: 0.65,
  FATIGUE_MORALE_PENALTY_THRESHOLD: 55,
  
  // UI Settings
  MAX_LOG_ENTRIES: 5,
  ANIMATION_DURATION: 300,
  FADE_DURATION: 500,
  
  // Save Settings
  SAVE_KEY: "culinary_sim_v050",
  AUTO_SAVE: true,
  
  // Tutorial
  TUTORIAL_ENABLED: true,
  
  // Feature Flags
  FEATURES: {
    fundraising: true,
    rivalSystem: true,
    telemetryExport: true,
    storyChoices: true,
    menuImport: true
  }
};

// Tuning presets for easy difficulty adjustment
export const DIFFICULTY_PRESETS = {
  easy: {
    STARTING_BUDGET: 1200,
    COMP_TARGET_STANDARD: 65,
    COMP_TARGET_FINAL: 73,
    EVENT_CHANCE_PER_WEEK: 0.40
  },
  normal: {
    STARTING_BUDGET: 1000,
    COMP_TARGET_STANDARD: 70,
    COMP_TARGET_FINAL: 78,
    EVENT_CHANCE_PER_WEEK: 0.55
  },
  hard: {
    STARTING_BUDGET: 800,
    COMP_TARGET_STANDARD: 75,
    COMP_TARGET_FINAL: 83,
    EVENT_CHANCE_PER_WEEK: 0.70
  }
};

// Apply difficulty preset
export function applyDifficulty(difficulty = 'normal') {
  const preset = DIFFICULTY_PRESETS[difficulty];
  if (preset) {
    Object.assign(CONFIG, preset);
  }
}
