// state-manager.js - Enhanced state management with validation
import { CONFIG } from "./config.js";
import { clamp, deepClone } from "./utils.js";

/**
 * Default menu structure
 */
export function createDefaultMenu() {
  return {
    name: "Untitled Menu",
    proteinId: "chicken",
    techniqueId: "roast",
    sauceId: "jus",
    garnishId: "knife_cuts",
    dessertId: "citrus",
    notes: "",
    cost: 0,
    prep: 0,
    wow: 0,
    risk: 0
  };
}

/**
 * Default rival structure
 */
export function createDefaultRival() {
  return {
    id: null,
    name: null,
    countryId: null,
    score: 0,
    wins: 0
  };
}

/**
 * Default game state
 */
export function createDefaultState(buildId = CONFIG.VERSION) {
  return {
    // Meta
    buildId,
    started: false,
    difficulty: "normal",
    
    // UI State
    ui: {
      tab: "dashboard",
      tutorialDone: false,
      screen: "title"
    },
    
    // Character
    countryId: null,
    
    // Progression
    week: 1,
    weeksTotal: CONFIG.WEEKS_TOTAL,
    lastActionWeek: 0,
    
    // Resources
    budget: CONFIG.STARTING_BUDGET,
    rep: 0,
    sponsorInterest: 0,
    
    // Skills
    technique: 50,
    palate: 50,
    creativity: 45,
    cleanliness: 55,
    consistency: 48,
    composure: 48,
    
    // Conditions
    morale: 55,
    fatigue: 8,
    prep: 0,
    risk: 10,
    
    // Systems
    flags: {},
    menu: createDefaultMenu(),
    obligations: [],
    rival: createDefaultRival(),
    telemetry: [],
    
    // Achievements (new)
    achievements: [],
    
    // Stats tracking (new)
    stats: {
      totalActions: 0,
      totalSpent: 0,
      totalEarned: 0,
      highestScore: 0,
      lowestFatigue: 100,
      perfectWeeks: 0
    }
  };
}

/**
 * Validate state object
 * @param {Object} state - State to validate
 * @returns {boolean} Is valid
 */
export function validateState(state) {
  if (!state || typeof state !== 'object') return false;
  
  // Required fields
  const required = ['buildId', 'week', 'budget', 'technique', 'menu'];
  for (const field of required) {
    if (!(field in state)) {
      console.warn(`Missing required field: ${field}`);
      return false;
    }
  }
  
  // Type checks
  if (typeof state.week !== 'number' || state.week < 1 || state.week > 12) {
    console.warn('Invalid week value');
    return false;
  }
  
  return true;
}

/**
 * Sanitize state (clamp stats, fix types)
 * @param {Object} state - State to sanitize
 * @returns {Object} Sanitized state
 */
export function sanitizeState(state) {
  const sanitized = deepClone(state);
  
  // Clamp stats
  const stats = ['technique', 'palate', 'creativity', 'cleanliness', 
                 'consistency', 'composure', 'morale', 'fatigue', 'prep', 'risk'];
  
  stats.forEach(stat => {
    if (typeof sanitized[stat] === 'number') {
      sanitized[stat] = clamp(sanitized[stat], CONFIG.STAT_MIN, CONFIG.STAT_MAX);
    }
  });
  
  // Ensure budget is a number
  sanitized.budget = Math.floor(Number(sanitized.budget) || 0);
  sanitized.rep = Math.max(0, Math.floor(Number(sanitized.rep) || 0));
  sanitized.sponsorInterest = Math.max(0, Math.floor(Number(sanitized.sponsorInterest) || 0));
  
  // Ensure arrays
  sanitized.obligations = Array.isArray(sanitized.obligations) ? sanitized.obligations : [];
  sanitized.telemetry = Array.isArray(sanitized.telemetry) ? sanitized.telemetry : [];
  sanitized.achievements = Array.isArray(sanitized.achievements) ? sanitized.achievements : [];
  
  // Ensure objects
  sanitized.flags = sanitized.flags || {};
  sanitized.rival = sanitized.rival || createDefaultRival();
  sanitized.menu = sanitized.menu || createDefaultMenu();
  sanitized.stats = sanitized.stats || createDefaultState().stats;
  
  return sanitized;
}

/**
 * Load state from localStorage
 * @returns {Object|null} Loaded state or null
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(CONFIG.SAVE_KEY);
    if (!raw) return null;
    
    const state = JSON.parse(raw);
    
    if (!validateState(state)) {
      console.warn('Loaded state failed validation');
      return null;
    }
    
    return sanitizeState(state);
  } catch (e) {
    console.error('Failed to load state:', e);
    return null;
  }
}

/**
 * Save state to localStorage
 * @param {Object} state - State to save
 * @returns {boolean} Success
 */
export function saveState(state) {
  try {
    if (!validateState(state)) {
      console.error('Cannot save invalid state');
      return false;
    }
    
    const sanitized = sanitizeState(state);
    localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(sanitized));
    return true;
  } catch (e) {
    console.error('Failed to save state:', e);
    return false;
  }
}

/**
 * Clear saved state
 */
export function clearState() {
  localStorage.removeItem(CONFIG.SAVE_KEY);
}

/**
 * Export state as JSON file
 * @param {Object} state - State to export
 * @param {string} filename - Filename (optional)
 */
export function exportState(state, filename) {
  const sanitized = sanitizeState(state);
  const blob = new Blob([JSON.stringify(sanitized, null, 2)], {
    type: 'application/json'
  });
  
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  
  const safeBuildId = (state.buildId || 'save').replace(/[^a-z0-9._-]/gi, '_');
  const date = new Date().toISOString().slice(0, 10);
  a.download = filename || `culinary_save_${safeBuildId}_${date}.json`;
  
  a.click();
  URL.revokeObjectURL(a.href);
}

/**
 * Import state from JSON
 * @param {string} json - JSON string
 * @returns {Object|null} Imported state or null
 */
export function importState(json) {
  try {
    const state = JSON.parse(json);
    
    if (!validateState(state)) {
      throw new Error('Invalid state format');
    }
    
    return sanitizeState(state);
  } catch (e) {
    console.error('Failed to import state:', e);
    return null;
  }
}

/**
 * Create a snapshot of current state
 * @param {Object} state - Full state
 * @returns {Object} Snapshot with key metrics
 */
export function createSnapshot(state) {
  return {
    week: state.week,
    budget: state.budget,
    rep: state.rep,
    sponsorInterest: state.sponsorInterest,
    technique: state.technique,
    palate: state.palate,
    creativity: state.creativity,
    cleanliness: state.cleanliness,
    consistency: state.consistency,
    composure: state.composure,
    morale: state.morale,
    fatigue: state.fatigue,
    prep: state.prep,
    risk: state.risk,
    obligations: (state.obligations || []).length,
    rival: { ...(state.rival || {}) },
    menu: { ...state.menu }
  };
}

/**
 * Calculate state diff between two snapshots
 * @param {Object} before - Before snapshot
 * @param {Object} after - After snapshot
 * @returns {Object} Difference object
 */
export function calculateDiff(before, after) {
  const diff = {};
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  
  keys.forEach(key => {
    if (typeof before[key] === 'number' && typeof after[key] === 'number') {
      const change = after[key] - before[key];
      if (change !== 0) {
        diff[key] = change;
      }
    }
  });
  
  return diff;
}

/**
 * Migrate old state to new version
 * @param {Object} state - Old state
 * @returns {Object} Migrated state
 */
export function migrateState(state) {
  const migrated = deepClone(state);
  
  // Add missing fields from new version
  const defaults = createDefaultState();
  
  Object.keys(defaults).forEach(key => {
    if (!(key in migrated)) {
      migrated[key] = defaults[key];
    }
  });
  
  // Update version
  migrated.buildId = CONFIG.VERSION;
  
  return sanitizeState(migrated);
}

export default {
  createDefaultMenu,
  createDefaultRival,
  createDefaultState,
  validateState,
  sanitizeState,
  loadState,
  saveState,
  clearState,
  exportState,
  importState,
  createSnapshot,
  calculateDiff,
  migrateState
};
