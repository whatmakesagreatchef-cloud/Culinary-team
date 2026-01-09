// achievements.js - Achievement tracking system
import { generateId } from "./utils.js";

/**
 * Achievement definitions
 */
export const ACHIEVEMENTS = {
  // Skill Achievements
  master_technique: {
    id: "master_technique",
    name: "Technical Master",
    desc: "Reach 100+ Technique",
    icon: "🔪",
    check: (state) => state.technique >= 100
  },
  
  refined_palate: {
    id: "refined_palate",
    name: "Refined Palate",
    desc: "Reach 100+ Palate",
    icon: "👅",
    check: (state) => state.palate >= 100
  },
  
  creative_genius: {
    id: "creative_genius",
    name: "Creative Genius",
    desc: "Reach 100+ Creativity",
    icon: "🎨",
    check: (state) => state.creativity >= 100
  },
  
  spotless: {
    id: "spotless",
    name: "Spotless",
    desc: "Reach 100+ Cleanliness",
    icon: "✨",
    check: (state) => state.cleanliness >= 100
  },
  
  // Competition Achievements
  perfect_score: {
    id: "perfect_score",
    name: "Perfect Execution",
    desc: "Score 85+ in any competition",
    icon: "⭐",
    check: (state, context) => {
      return context?.type === "competition" && context?.result?.score >= 85;
    }
  },
  
  clean_sweep: {
    id: "clean_sweep",
    name: "Clean Sweep",
    desc: "Win all 4 competitions",
    icon: "🏆",
    check: (state) => {
      const comps = (state.telemetry || []).filter(e => e.type === "competition");
      if (comps.length < 4) return false;
      return comps.every(c => c.result?.win);
    }
  },
  
  comeback_kid: {
    id: "comeback_kid",
    name: "Comeback Kid",
    desc: "Win a competition after losing one",
    icon: "💪",
    check: (state, context) => {
      if (context?.type !== "competition" || !context?.result?.win) return false;
      const comps = (state.telemetry || []).filter(e => e.type === "competition");
      return comps.some(c => !c.result?.win);
    }
  },
  
  underdog: {
    id: "underdog",
    name: "Underdog Victory",
    desc: "Win final with budget under $200",
    icon: "🎯",
    check: (state, context) => {
      return context?.type === "competition" && 
             state.week === 12 && 
             context?.result?.win && 
             state.budget < 200;
    }
  },
  
  // Management Achievements
  wealthy: {
    id: "wealthy",
    name: "Well Funded",
    desc: "Have $2000+ budget at once",
    icon: "💰",
    check: (state) => state.budget >= 2000
  },
  
  famous: {
    id: "famous",
    name: "Famous Chef",
    desc: "Reach 30+ Reputation",
    icon: "⭐",
    check: (state) => state.rep >= 30
  },
  
  debt_free: {
    id: "debt_free",
    name: "Debt Free",
    desc: "Complete season with no outstanding obligations",
    icon: "📋",
    check: (state) => {
      if (state.week < 12) return false;
      const obligations = state.obligations || [];
      return obligations.filter(o => !o.done).length === 0;
    }
  },
  
  balanced: {
    id: "balanced",
    name: "Balanced Chef",
    desc: "Have all core stats above 70",
    icon: "⚖️",
    check: (state) => {
      return state.technique >= 70 &&
             state.palate >= 70 &&
             state.creativity >= 70 &&
             state.cleanliness >= 70 &&
             state.consistency >= 70;
    }
  },
  
  // Endurance Achievements
  iron_chef: {
    id: "iron_chef",
    name: "Iron Chef",
    desc: "Complete season with fatigue never exceeding 60",
    icon: "💪",
    check: (state) => {
      if (state.week < 12) return false;
      const snaps = (state.telemetry || []).map(e => e.after).filter(Boolean);
      return snaps.every(s => (s.fatigue || 0) <= 60);
    }
  },
  
  zen_master: {
    id: "zen_master",
    name: "Zen Master",
    desc: "Keep morale above 70 for entire season",
    icon: "🧘",
    check: (state) => {
      if (state.week < 12) return false;
      const snaps = (state.telemetry || []).map(e => e.after).filter(Boolean);
      return snaps.every(s => (s.morale || 0) >= 70);
    }
  },
  
  risk_taker: {
    id: "risk_taker",
    name: "Risk Taker",
    desc: "Win a competition with bold approach",
    icon: "🎲",
    check: (state, context) => {
      return context?.type === "competition" &&
             context?.result?.win &&
             context?.result?.plan?.approach === "bold";
    }
  },
  
  safe_player: {
    id: "safe_player",
    name: "Safe Player",
    desc: "Win a competition with safe approach",
    icon: "🛡️",
    check: (state, context) => {
      return context?.type === "competition" &&
             context?.result?.win &&
             context?.result?.plan?.approach === "safe";
    }
  },
  
  // Menu Achievements
  expensive_taste: {
    id: "expensive_taste",
    name: "Expensive Taste",
    desc: "Create a menu costing $700+",
    icon: "💎",
    check: (state) => {
      return state.menu?.cost >= 700;
    }
  },
  
  wow_factor: {
    id: "wow_factor",
    name: "Wow Factor",
    desc: "Create a menu with 45+ wow",
    icon: "✨",
    check: (state) => {
      return state.menu?.wow >= 45;
    }
  },
  
  minimalist: {
    id: "minimalist",
    name: "Minimalist",
    desc: "Win with menu cost under $300",
    icon: "🍃",
    check: (state, context) => {
      return context?.type === "competition" &&
             context?.result?.win &&
             state.menu?.cost < 300;
    }
  },
  
  // Rival Achievements
  rival_crusher: {
    id: "rival_crusher",
    name: "Rival Crusher",
    desc: "Beat rival in all 4 competitions",
    icon: "⚔️",
    check: (state) => {
      const comps = (state.telemetry || [])
        .filter(e => e.type === "competition" && e.result?.rival);
      if (comps.length < 4) return false;
      return comps.every(c => c.result.score > c.result.rival.score);
    }
  },
  
  respect: {
    id: "respect",
    name: "Mutual Respect",
    desc: "Lose to rival but finish with 25+ rep",
    icon: "🤝",
    check: (state) => {
      if (state.week < 12 || state.rep < 25) return false;
      const comps = (state.telemetry || [])
        .filter(e => e.type === "competition" && e.result?.rival);
      return comps.some(c => c.result.rival.score > c.result.score);
    }
  }
};

/**
 * Check if achievement is unlocked
 * @param {string} achievementId - Achievement to check
 * @param {Object} state - Current game state
 * @param {Object} context - Optional context (for event-based achievements)
 * @returns {boolean} Is unlocked
 */
export function checkAchievement(achievementId, state, context = null) {
  const achievement = ACHIEVEMENTS[achievementId];
  if (!achievement) return false;
  
  // Check if already unlocked
  if ((state.achievements || []).includes(achievementId)) {
    return false; // Already has it
  }
  
  return achievement.check(state, context);
}

/**
 * Check all achievements and return newly unlocked ones
 * @param {Object} state - Current game state
 * @param {Object} context - Optional context
 * @returns {Array<string>} Array of newly unlocked achievement IDs
 */
export function checkAllAchievements(state, context = null) {
  const unlocked = [];
  
  Object.keys(ACHIEVEMENTS).forEach(id => {
    if (checkAchievement(id, state, context)) {
      unlocked.push(id);
    }
  });
  
  return unlocked;
}

/**
 * Unlock achievement
 * @param {Object} state - Game state (mutated)
 * @param {string} achievementId - Achievement to unlock
 * @returns {boolean} Success
 */
export function unlockAchievement(state, achievementId) {
  if (!ACHIEVEMENTS[achievementId]) return false;
  
  if (!state.achievements) {
    state.achievements = [];
  }
  
  if (!state.achievements.includes(achievementId)) {
    state.achievements.push(achievementId);
    return true;
  }
  
  return false;
}

/**
 * Get achievement progress (for display)
 * @param {Object} state - Game state
 * @returns {Object} Progress summary
 */
export function getAchievementProgress(state) {
  const total = Object.keys(ACHIEVEMENTS).length;
  const unlocked = (state.achievements || []).length;
  
  return {
    total,
    unlocked,
    remaining: total - unlocked,
    percentage: Math.round((unlocked / total) * 100)
  };
}

/**
 * Get unlocked achievements with details
 * @param {Object} state - Game state
 * @returns {Array<Object>} Array of achievement objects
 */
export function getUnlockedAchievements(state) {
  const unlockedIds = state.achievements || [];
  return unlockedIds
    .map(id => ACHIEVEMENTS[id])
    .filter(Boolean);
}

/**
 * Get locked achievements
 * @param {Object} state - Game state
 * @returns {Array<Object>} Array of achievement objects
 */
export function getLockedAchievements(state) {
  const unlockedIds = state.achievements || [];
  return Object.values(ACHIEVEMENTS)
    .filter(a => !unlockedIds.includes(a.id));
}

export default {
  ACHIEVEMENTS,
  checkAchievement,
  checkAllAchievements,
  unlockAchievement,
  getAchievementProgress,
  getUnlockedAchievements,
  getLockedAchievements
};
