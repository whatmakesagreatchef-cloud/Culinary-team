// competition-manager.js - Competition flow and state management
import { CONFIG } from "./config.js";
import { COMP_WEEKS } from "./systems.js";

/**
 * Competition Manager
 * Handles competition state, flow, and validation
 */
export class CompetitionManager {
  constructor() {
    this.currentCompetition = null;
    this.competitionState = "none"; // none, ready, planning, results
  }

  /**
   * Check if current week is a competition week
   */
  isCompetitionWeek(week) {
    return week in COMP_WEEKS;
  }

  /**
   * Get competition for week
   */
  getCompetition(week) {
    return COMP_WEEKS[week] || null;
  }

  /**
   * Check if player can enter competition
   */
  canEnterCompetition(state, week) {
    const comp = this.getCompetition(week);
    if (!comp) return { ok: false, reason: "No competition this week" };
    
    if (state.budget < comp.entry) {
      return { ok: false, reason: `Need ${comp.entry} budget. You have ${Math.floor(state.budget)}` };
    }
    
    return { ok: true };
  }

  /**
   * Check if competition is required to advance
   */
  isCompetitionRequired(week) {
    return this.isCompetitionWeek(week);
  }

  /**
   * Get next competition week
   */
  getNextCompetitionWeek(currentWeek) {
    const compWeeks = Object.keys(COMP_WEEKS).map(Number).sort((a, b) => a - b);
    return compWeeks.find(w => w > currentWeek) || null;
  }

  /**
   * Get competition status for UI
   */
  getCompetitionStatus(state) {
    const week = state.week;
    const comp = this.getCompetition(week);
    
    if (!comp) {
      return {
        isCompWeek: false,
        hasCompleted: false,
        canAdvance: true
      };
    }

    // Check if competition has been completed this week
    const hasCompleted = (state.telemetry || []).some(
      e => e.type === "competition" && e.week === week
    );

    return {
      isCompWeek: true,
      hasCompleted,
      canAdvance: hasCompleted,
      competition: comp,
      canEnter: this.canEnterCompetition(state, week)
    };
  }

  /**
   * Validate week advancement
   */
  canAdvanceWeek(state) {
    const status = this.getCompetitionStatus(state);
    
    if (status.isCompWeek && !status.hasCompleted) {
      return {
        ok: false,
        reason: `Must complete ${status.competition.name} before advancing`
      };
    }

    return { ok: true };
  }

  /**
   * Get competition schedule
   */
  getSchedule() {
    return Object.entries(COMP_WEEKS).map(([week, comp]) => ({
      week: Number(week),
      ...comp
    }));
  }

  /**
   * Get competition history for player
   */
  getHistory(state) {
    return (state.telemetry || [])
      .filter(e => e.type === "competition")
      .map(e => ({
        week: e.week,
        name: e.name,
        win: e.result?.win || false,
        score: e.result?.score || 0,
        target: e.result?.target || 0,
        rival: e.result?.rival || null
      }));
  }

  /**
   * Calculate competition readiness
   */
  calculateReadiness(state, menuCalc) {
    const comp = this.getCompetition(state.week);
    if (!comp) return null;

    const readiness = {
      budget: state.budget >= comp.entry,
      fatigue: state.fatigue < 60,
      risk: state.risk < 25,
      menuPrep: menuCalc.prep <= state.prep + 5,
      scouted: state.flags.scouted || false,
      tested: state.flags.tested || false
    };

    const score = Object.values(readiness).filter(Boolean).length;
    const total = Object.keys(readiness).length;

    return {
      ...readiness,
      score,
      total,
      percentage: Math.round((score / total) * 100),
      level: score >= 5 ? "ready" : score >= 3 ? "fair" : "risky"
    };
  }
}

// Singleton instance
export const competitionManager = new CompetitionManager();

/**
 * Helper function to check if player can advance week
 */
export function validateWeekAdvance(state) {
  return competitionManager.canAdvanceWeek(state);
}

/**
 * Helper to get competition UI state
 */
export function getCompetitionUIState(state) {
  return competitionManager.getCompetitionStatus(state);
}

export default competitionManager;
