// scoring.js - Modular scoring engine for competitions
import { CONFIG } from "./config.js";
import { random, clamp, calculatePenalty, statContribution } from "./utils.js";

/**
 * Calculate core skill score
 * @param {Object} stats - Chef stats
 * @returns {number} Core score
 */
export function calculateCoreScore(stats) {
  const weights = CONFIG.SCORING;
  return (
    stats.palate * weights.palate +
    stats.technique * weights.technique +
    stats.cleanliness * weights.cleanliness +
    stats.consistency * weights.consistency
  ) / 2;
}

/**
 * Calculate menu impact score
 * @param {Object} menuCalc - Menu calculation results
 * @param {Object} stats - Chef stats
 * @returns {number} Menu impact score
 */
export function calculateMenuImpact(menuCalc, stats) {
  const weights = CONFIG.SCORING;
  return (
    menuCalc.wow * weights.menuWow +
    stats.creativity * weights.creativity
  );
}

/**
 * Calculate prep bonus
 * @param {number} chefPrep - Chef's prep stat
 * @param {number} menuPrep - Menu prep requirement
 * @returns {number} Prep bonus
 */
export function calculatePrepBonus(chefPrep, menuPrep) {
  const prepDiff = chefPrep - menuPrep;
  const bonus = Math.floor(prepDiff / 2) + 6;
  return Math.min(CONFIG.SCORING.prepBonusMax, bonus);
}

/**
 * Calculate fatigue penalty
 * @param {number} fatigue - Chef's fatigue level
 * @returns {number} Fatigue penalty
 */
export function calculateFatiguePenalty(fatigue) {
  return calculatePenalty(
    fatigue,
    CONFIG.SCORING.fatigueThreshold,
    CONFIG.SCORING.fatiguePenaltyRate
  );
}

/**
 * Calculate risk penalty
 * @param {number} chefRisk - Chef's risk stat
 * @param {number} menuRisk - Menu risk level
 * @returns {number} Risk penalty
 */
export function calculateRiskPenalty(chefRisk, menuRisk) {
  const totalRisk = chefRisk + menuRisk;
  return calculatePenalty(
    totalRisk,
    CONFIG.SCORING.riskThreshold,
    CONFIG.SCORING.riskPenaltyRate
  );
}

/**
 * Calculate stability bonus
 * @param {Object} stats - Chef stats
 * @returns {number} Stability score
 */
export function calculateStability(stats) {
  const weights = CONFIG.SCORING;
  return (
    stats.composure * weights.composure +
    stats.consistency * weights.consistency
  );
}

/**
 * Calculate total penalty (fatigue + risk - stability)
 * @param {number} fatiguePenalty - Fatigue penalty
 * @param {number} riskPenalty - Risk penalty
 * @param {number} stability - Stability score
 * @returns {number} Net penalty
 */
export function calculateTotalPenalty(fatiguePenalty, riskPenalty, stability) {
  return Math.max(0, fatiguePenalty + riskPenalty - stability);
}

/**
 * Calculate variance for competition
 * @param {string} approach - Competition approach (safe/standard/bold)
 * @param {Object} flags - Chef's flags
 * @returns {number} Variance amount
 */
export function calculateVariance(approach, flags = {}) {
  let varianceBase = CONFIG.VARIANCE_STANDARD;
  
  if (approach === "safe") {
    varianceBase = CONFIG.VARIANCE_SAFE;
  } else if (approach === "bold") {
    varianceBase = CONFIG.VARIANCE_BOLD;
  }
  
  let variance = varianceBase;
  if (flags.scouted) variance -= CONFIG.VARIANCE_SCOUT_REDUCTION;
  if (flags.tested) variance -= CONFIG.VARIANCE_TEST_REDUCTION;
  
  return Math.max(4, variance);
}

/**
 * Calculate approach modifier
 * @param {string} approach - Competition approach
 * @returns {number} Modifier value
 */
export function calculateApproachModifier(approach) {
  switch (approach) {
    case "safe": return 4;
    case "bold": return -2;
    default: return 0;
  }
}

/**
 * Calculate emphasis modifier based on competition emphasis
 * @param {Object} stats - Chef stats
 * @param {Object} menuCalc - Menu calculation
 * @param {string} emphasis - Competition emphasis
 * @returns {number} Emphasis modifier
 */
export function calculateEmphasisModifier(stats, menuCalc, emphasis) {
  const emphasisLower = (emphasis || "").toLowerCase();
  const modifier = CONFIG.SCORING.emphasisModifier;
  let total = 0;
  
  if (emphasisLower.includes("cleanliness")) {
    total += (stats.cleanliness - 60) * modifier;
  }
  if (emphasisLower.includes("technique") || emphasisLower.includes("timing")) {
    total += (stats.technique - 60) * modifier;
  }
  if (emphasisLower.includes("menu") || emphasisLower.includes("wow")) {
    total += (menuCalc.wow - 25) * 0.06;
  }
  
  return total;
}

/**
 * Main competition scoring function
 * @param {Object} state - Game state
 * @param {Object} menuCalc - Menu calculation results
 * @param {Object} plan - Competition plan
 * @param {Object} competition - Competition details
 * @returns {Object} Scoring breakdown
 */
export function calculateCompetitionScore(state, menuCalc, plan, competition) {
  // Core components
  const core = calculateCoreScore(state);
  const menuImpact = calculateMenuImpact(menuCalc, state);
  const prepBonus = calculatePrepBonus(state.prep, menuCalc.prep);
  
  // Penalties and modifiers
  const fatiguePenalty = calculateFatiguePenalty(state.fatigue);
  const riskPenalty = calculateRiskPenalty(state.risk, menuCalc.risk);
  const stability = calculateStability(state);
  const totalPenalty = calculateTotalPenalty(fatiguePenalty, riskPenalty, stability);
  
  // Variance and modifiers
  const variance = calculateVariance(plan.approach, state.flags);
  const rng = random(-variance, variance);
  const approachMod = calculateApproachModifier(plan.approach);
  const emphasisMod = calculateEmphasisModifier(state, menuCalc, competition.emphasis);
  
  // Final score
  const total = core + menuImpact + prepBonus + approachMod + rng + emphasisMod - totalPenalty;
  
  return {
    core: +core.toFixed(2),
    menuImpact: +menuImpact.toFixed(2),
    prepBonus,
    approachMod,
    rng,
    emphasisMod: +emphasisMod.toFixed(2),
    fatiguePenalty: +fatiguePenalty.toFixed(2),
    riskPenalty: +riskPenalty.toFixed(2),
    stability: +stability.toFixed(2),
    totalPenalty: +totalPenalty.toFixed(2),
    variance,
    total: +total.toFixed(1)
  };
}

/**
 * Get competition target score
 * @param {number} week - Current week
 * @returns {number} Target score
 */
export function getCompetitionTarget(week) {
  return week === 12 ? CONFIG.COMP_TARGET_FINAL : CONFIG.COMP_TARGET_STANDARD;
}

/**
 * Calculate rival score (simplified version for AI opponent)
 * @param {Object} rival - Rival competitor
 * @param {Object} menuCalc - Rival's menu calculation
 * @param {Object} competition - Competition details
 * @returns {Object} Rival scoring breakdown
 */
export function calculateRivalScore(rival, menuCalc, competition) {
  // Rival has base stats
  const baseStats = {
    technique: 62,
    palate: 60,
    creativity: 54,
    cleanliness: 62,
    consistency: 64,
    composure: 62,
    prep: 18,
    fatigue: 18,
    risk: 14
  };
  
  // Apply rival's mods
  const stats = { ...baseStats };
  if (rival.mods) {
    Object.keys(rival.mods).forEach(key => {
      stats[key] = (stats[key] || 0) + rival.mods[key];
    });
  }
  
  // Calculate using same scoring system
  const core = calculateCoreScore(stats);
  const menuImpact = calculateMenuImpact(menuCalc, stats);
  const prepBonus = calculatePrepBonus(stats.prep, menuCalc.prep);
  const fatiguePenalty = calculateFatiguePenalty(stats.fatigue);
  const riskPenalty = calculateRiskPenalty(stats.risk, menuCalc.risk);
  const stability = calculateStability(stats);
  const totalPenalty = calculateTotalPenalty(fatiguePenalty, riskPenalty, stability);
  
  const variance = 7;
  const rng = random(-variance, variance);
  const emphasisMod = calculateEmphasisModifier(stats, menuCalc, competition.emphasis);
  
  const total = core + menuImpact + prepBonus + rng + emphasisMod - totalPenalty;
  
  return {
    id: rival.id,
    name: rival.name,
    countryId: rival.countryId,
    archetype: rival.archetype,
    score: +total.toFixed(1),
    breakdown: {
      core: +core.toFixed(2),
      menuImpact: +menuImpact.toFixed(2),
      prepBonus,
      totalPenalty: +totalPenalty.toFixed(2)
    }
  };
}

export default {
  calculateCoreScore,
  calculateMenuImpact,
  calculatePrepBonus,
  calculateFatiguePenalty,
  calculateRiskPenalty,
  calculateStability,
  calculateTotalPenalty,
  calculateVariance,
  calculateApproachModifier,
  calculateEmphasisModifier,
  calculateCompetitionScore,
  getCompetitionTarget,
  calculateRivalScore
};
