// systems.js - Core game systems (Modular v0.5.0)
import { COUNTRIES } from "./data_countries.js";
import { COMPETITORS } from "./data_competitors.js";
import { EVENTS } from "./data_events.js";
import { MENU_PARTS } from "./data_menu_parts.js";
import { CONFIG } from "./config.js";
import { random, clamp, money } from "./utils.js";
import { calculateCompetitionScore, calculateRivalScore, getCompetitionTarget } from "./scoring.js";
import { createSnapshot } from "./state-manager.js";
import { checkAllAchievements, unlockAchievement } from "./achievements.js";
import { log } from "./telemetry.js";

// ===== COMPETITION DEFINITIONS =====
export const COMP_WEEKS = {
  3: { name: "Local Heat", entry: 250, rep: 8, cash: 650, emphasis: "Cleanliness / systems" },
  6: { name: "Signature Showdown", entry: 420, rep: 12, cash: 950, emphasis: "Menu cohesion + wow" },
  9: { name: "Speed & Steel", entry: 380, rep: 13, cash: 900, emphasis: "Technique / timing" },
  12: { name: "Grand Final", entry: 600, rep: 22, cash: 1600, emphasis: "Everything" }
};

// ===== FUNDRAISING TIERS =====
export const FUND_TIERS = [
  { id: "bronze", name: "Bronze", reqRep: 0, cash: 180, oblig: 1, risk: 1, desc: "Small local partner." },
  { id: "silver", name: "Silver", reqRep: 8, cash: 320, oblig: 2, risk: 2, desc: "More cash, more expectations." },
  { id: "gold", name: "Gold", reqRep: 14, cash: 520, oblig: 3, risk: 3, desc: "Real money. Real pressure." },
  { id: "platinum", name: "Platinum", reqRep: 22, cash: 820, oblig: 4, risk: 4, desc: "Big swing. Big obligation." }
];

// ===== WEEKLY ACTIONS =====
export const ACTIONS = [
  {
    id: "train",
    name: "Train Systems",
    desc: "Technique +, Cleanliness +, Prep +, Fatigue +",
    apply: (S) => bump(S, { 
      technique: random(3, 6), 
      cleanliness: random(2, 5), 
      prep: 6, 
      fatigue: 6 
    })
  },
  {
    id: "rnd",
    name: "R&D Menu",
    desc: "Creativity +, Palate +, Budget -, Risk +",
    apply: (S) => bump(S, {
      budget: -random(120, 220),
      creativity: random(3, 7),
      palate: random(2, 6),
      risk: 4,
      prep: 5,
      fatigue: 4
    })
  },
  {
    id: "sponsor",
    name: "Sponsor Meetings",
    desc: "Budget +, Sponsor interest + (rep helps)",
    apply: (S) => {
      const ok = (S.rep >= 6) || Math.random() > 0.35;
      if (ok) {
        bump(S, {
          budget: random(180, 420) + Math.floor(S.rep * 6),
          sponsorInterest: 1,
          fatigue: 3
        });
      } else {
        bump(S, { rep: -2, fatigue: 2 });
      }
    }
  },
  {
    id: "deliver",
    name: "Deliver Sponsor Pack",
    desc: "Clear one obligation (if any) → rep +, risk -",
    apply: (S) => deliverObligation(S)
  },
  {
    id: "community",
    name: "Community / Mentoring",
    desc: "Reputation +, Morale +, Budget -",
    apply: (S) => bump(S, {
      budget: -random(80, 160),
      rep: random(4, 8),
      morale: 6,
      fatigue: 2
    })
  },
  {
    id: "scout",
    name: "Scout Rival",
    desc: "Lower variance next competition, reduces risk slightly",
    apply: (S) => {
      bump(S, { composure: 3, risk: -2, fatigue: 2 });
      S.flags.scouted = true;
    }
  },
  {
    id: "recover",
    name: "Recovery Week",
    desc: "Fatigue -, morale +, risk -",
    apply: (S) => bump(S, { fatigue: -10, morale: 6, risk: -2 })
  }
];

// ===== HELPER FUNCTIONS =====

/**
 * Get country data for state
 */
export function countryFor(S) {
  return COUNTRIES.find(c => c.id === S.countryId) || null;
}

/**
 * Get story node for current week
 */
export function storyNodeForWeek(S) {
  const c = countryFor(S);
  return (c?.story || []).find(x => x.week === S.week) || null;
}

/**
 * Get competitors for a country
 */
export function competitorsForCountry(countryId) {
  return COMPETITORS.filter(x => x.countryId === countryId);
}

/**
 * Choose rival for player
 */
export function chooseRival(S) {
  const c = countryFor(S);
  if (!c) return null;
  
  const rid = c.rivalCountryId || null;
  const pool = rid 
    ? COMPETITORS.filter(x => x.countryId === rid)
    : COMPETITORS.filter(x => x.countryId !== S.countryId);
    
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return pick || null;
}

/**
 * Bump stats (add deltas and clamp)
 */
export function bump(S, delta) {
  for (const k of Object.keys(delta)) {
    S[k] = (S[k] ?? 0) + delta[k];
  }
  
  // Clamp stats
  const stats = ['technique', 'palate', 'creativity', 'cleanliness', 
                 'consistency', 'composure', 'morale', 'fatigue', 'prep', 'risk'];
  stats.forEach(k => {
    S[k] = clamp(S[k], CONFIG.STAT_MIN, CONFIG.STAT_MAX);
  });
  
  // Floor numbers
  S.budget = Math.floor(S.budget);
  S.rep = Math.max(0, Math.floor(S.rep));
  S.sponsorInterest = Math.max(0, Math.floor(S.sponsorInterest));
}

/**
 * Apply country perks to state
 */
export function applyPerks(S) {
  const c = countryFor(S);
  if (!c) return;
  
  const p = c.perks || {};
  if (p.budget) S.budget += p.budget;
  if (p.rep) S.rep += p.rep;
  if (p.technique) S.technique += p.technique;
  if (p.consistency) S.consistency += p.consistency;
  if (p.composure) S.composure += p.composure;
  if (p.palate) S.palate += p.palate;
  if (p.creativity) S.creativity += p.creativity;
  if (p.prep) S.prep += p.prep;
  if (p.morale) S.morale += p.morale;
  if (p.sponsorInterest) S.sponsorInterest += p.sponsorInterest;
}

/**
 * Apply story choice effects
 */
export function applyStoryChoice(S, choiceIndex) {
  const node = storyNodeForWeek(S);
  const choice = node?.choices?.[choiceIndex];
  if (!choice) return;
  
  const before = createSnapshot(S);
  bump(S, choice.effects || {});
  S.flags = { ...S.flags, ...(choice.flags || {}) };
  const after = createSnapshot(S);
  
  log(S, "story", node.title, before, after, { choice: choice.label }, choice.desc || "");
  
  // Check achievements after story choice
  checkAndUnlockAchievements(S, { type: "story", choice });
}

// ===== MENU SYSTEM =====

export function parts() {
  return MENU_PARTS;
}

function partById(group, id) {
  return (MENU_PARTS[group] || []).find(x => x.id === id) || (MENU_PARTS[group] || [])[0];
}

/**
 * Calculate menu stats
 */
export function computeMenu(menu, flags = {}) {
  const protein = partById("proteins", menu.proteinId);
  const technique = partById("techniques", menu.techniqueId);
  const sauce = partById("sauces", menu.sauceId);
  const garnish = partById("garnish", menu.garnishId);
  const dessert = partById("dessert", menu.dessertId);
  
  const parts = [protein, technique, sauce, garnish, dessert];
  
  const cost = parts.reduce((a, p) => a + (p.cost || 0), 0);
  const prep = parts.reduce((a, p) => a + (p.prep || 0), 0);
  const wowBase = 
    parts.reduce((a, p) => a + (p.cre || 0), 0) * 1.7 +
    parts.reduce((a, p) => a + (p.tech || 0), 0) * 1.3 +
    parts.reduce((a, p) => a + (p.palate || 0), 0) * 1.2;
  
  let synergy = 0;
  if ((protein.tags || []).includes("wa") && flags.waStory) synergy += 3;
  if (flags.storyFirst) synergy += 2;
  if (flags.heroElement) synergy += 2;
  if (flags.harmony) synergy += 1;
  
  const risk = parts.reduce((a, p) => a + (p.risk || 0), 0) + Math.max(0, Math.floor(prep / 6));
  const wow = Math.max(0, Math.round(wowBase + synergy));
  
  return {
    cost,
    prep,
    wow,
    risk,
    breakdown: { protein, technique, sauce, garnish, dessert, synergy }
  };
}

/**
 * Apply menu calculation to state
 */
export function applyMenuToState(S) {
  const before = createSnapshot(S);
  const m = computeMenu(S.menu, S.flags);
  
  S.menu.cost = m.cost;
  S.menu.prep = m.prep;
  S.menu.wow = m.wow;
  S.menu.risk = m.risk;
  
  const after = createSnapshot(S);
  log(S, "menu", "Menu Updated", before, after, null, "Menu recalculated.");
  
  // Check achievements
  checkAndUnlockAchievements(S, { type: "menu", menu: m });
  
  return m;
}

/**
 * Test cook menu (reduces variance)
 */
export function menuTestCook(S) {
  const before = createSnapshot(S);
  const m = computeMenu(S.menu, S.flags);
  
  bump(S, {
    budget: -Math.max(40, Math.floor(m.cost * 0.25)),
    fatigue: 4,
    prep: 4,
    consistency: 2,
    technique: 1,
    risk: -2
  });
  
  S.flags.tested = true;
  applyMenuToState(S);
  
  const after = createSnapshot(S);
  log(S, "action", "Menu Test Cook", before, after, null, "Dry run to reduce variance.");
}

// ===== ACTIONS =====

/**
 * Take weekly action
 */
export function takeAction(S, actionId) {
  if (S.lastActionWeek === S.week) {
    return { ok: false, message: "You already took a weekly action. Advance week to continue." };
  }
  
  const action = ACTIONS.find(x => x.id === actionId);
  if (!action) {
    return { ok: false, message: "Action not found." };
  }
  
  const before = createSnapshot(S);
  action.apply(S);
  
  // Country-specific bonuses
  const c = countryFor(S);
  if (c?.perks?.consistencyBoost && actionId === "train" && Math.random() < 0.8) {
    bump(S, { consistency: 2 });
  }
  if (c?.perks?.repGain && actionId === "community") {
    bump(S, { rep: Math.floor(2 + 3 * c.perks.repGain * 10) });
  }
  
  // Fatigue morale penalty
  if (S.fatigue >= CONFIG.FATIGUE_MORALE_PENALTY_THRESHOLD) {
    if (Math.random() < CONFIG.FATIGUE_MORALE_PENALTY_CHANCE) {
      bump(S, { morale: -random(2, 6), consistency: -2 });
    }
  }
  
  const after = createSnapshot(S);
  log(S, "action", action.name, before, after, null, "");
  
  S.lastActionWeek = S.week;
  S.stats.totalActions = (S.stats.totalActions || 0) + 1;
  
  // Check achievements
  checkAndUnlockAchievements(S, { type: "action", actionId });
  
  return { ok: true };
}

// ===== FUNDRAISING =====

export function nextCompWeek(week) {
  const keys = Object.keys(COMP_WEEKS).map(x => Number(x)).sort((a, b) => a - b);
  for (const k of keys) {
    if (k > week) return k;
  }
  return 12;
}

/**
 * Start fundraising campaign
 */
export function startFundraising(S, tierId, promise = "safe") {
  const tier = FUND_TIERS.find(x => x.id === tierId);
  if (!tier) {
    return { ok: false, message: "Tier not found." };
  }
  if (S.rep < tier.reqRep) {
    return { ok: false, message: `Need reputation ${tier.reqRep}+ for ${tier.name}.` };
  }
  if (S.lastActionWeek === S.week) {
    return { ok: false, message: "You already took a weekly action." };
  }
  
  const before = createSnapshot(S);
  const promiseRisk = promise === "safe" ? 0 : (promise === "standard" ? 1 : 2);
  const baseChance = 0.55 + (S.rep * 0.01) + (S.sponsorInterest * 0.05) - 
                     (tier.risk * 0.04) - (promiseRisk * 0.06);
  const chance = clamp(baseChance, 0.25, 0.92);
  const roll = Math.random();
  
  if (roll < chance) {
    // Success
    const cash = tier.cash + Math.floor(S.rep * 6);
    bump(S, {
      budget: cash,
      sponsorInterest: 1,
      risk: tier.risk + promiseRisk,
      fatigue: 3
    });
    
    S.stats.totalEarned = (S.stats.totalEarned || 0) + cash;
    
    const dueWeek = nextCompWeek(S.week);
    for (let i = 0; i < tier.oblig; i++) {
      S.obligations.push({
        id: `obl_${Date.now()}_${i}`,
        dueWeek,
        level: tier.id,
        done: false
      });
    }
    
    const after = createSnapshot(S);
    log(S, "fundraising", "Fundraising success", before, after, {
      tier: tier.name,
      promise,
      roll: +roll.toFixed(2),
      chance: +chance.toFixed(2),
      cash,
      obligations: tier.oblig,
      dueWeek
    }, "Sponsor obligations added.");
  } else {
    // Failure
    bump(S, { rep: -2, morale: -3, fatigue: 2, risk: 1 });
    const after = createSnapshot(S);
    log(S, "fundraising", "Fundraising failed", before, after, {
      tier: tier.name,
      promise,
      roll: +roll.toFixed(2),
      chance: +chance.toFixed(2)
    }, "Pitch didn't land.");
  }
  
  S.lastActionWeek = S.week;
  return { ok: true };
}

/**
 * Deliver sponsor obligation
 */
export function deliverObligation(S) {
  const before = createSnapshot(S);
  const idx = (S.obligations || []).findIndex(o => !o.done);
  
  if (idx >= 0) {
    S.obligations[idx].done = true;
    bump(S, { rep: 3, risk: -2, morale: 2, fatigue: 2 });
    log(S, "deliverable", "Sponsor deliverable delivered", before, createSnapshot(S), 
        { cleared: 1 }, "One obligation cleared.");
  } else {
    bump(S, { rep: 1, risk: -1, fatigue: 1 });
    log(S, "deliverable", "Sponsor check-in", before, createSnapshot(S), 
        { cleared: 0 }, "No obligations, but you stayed visible.");
  }
}

/**
 * Apply overdue obligation penalties
 */
export function applyObligationPenalties(S) {
  const overdue = (S.obligations || []).filter(o => !o.done && o.dueWeek <= S.week);
  if (overdue.length) {
    bump(S, {
      rep: -2 * overdue.length,
      risk: +2 * overdue.length,
      morale: -2
    });
    overdue.forEach(o => o.done = true);
    return overdue.length;
  }
  return 0;
}

// ===== RIVAL SYSTEM =====

/**
 * Pick rival's best menu for competition
 */
export function pickSignatureMenu(competitor, comp) {
  const sigs = competitor.signatures || [];
  if (!sigs.length) return null;
  
  const em = (comp?.emphasis || "").toLowerCase();
  let best = sigs[0];
  let bestScore = -999;
  
  for (const s of sigs) {
    const m = computeMenu(s, {});
    let score = 0;
    
    if (em.includes("wow") || em.includes("menu")) {
      score += m.wow * 1.2 - m.prep * 0.6;
    } else if (em.includes("clean")) {
      score += -m.risk * 1.0 - m.prep * 0.4;
    } else if (em.includes("technique") || em.includes("timing")) {
      score += -m.prep * 0.4 + m.wow * 0.6;
    } else {
      score += m.wow * 0.8 - m.prep * 0.4;
    }
    
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }
  
  return best;
}

/**
 * Calculate rival's score for competition
 */
export function rivalScoreAgainst(S, comp) {
  const rival = S.rival?.id ? COMPETITORS.find(x => x.id === S.rival.id) : null;
  if (!rival) return null;
  
  const menu = pickSignatureMenu(rival, comp);
  const menuCalc = computeMenu(menu, {});
  
  return calculateRivalScore(rival, menuCalc, comp);
}

// ===== COMPETITION =====

/**
 * Run competition
 */
export function runCompetition(S, plan) {
  const comp = COMP_WEEKS[S.week];
  if (!comp) {
    return { ok: false, message: "Not a competition week." };
  }
  if (S.budget < comp.entry) {
    return { ok: false, message: "Not enough budget to enter." };
  }
  
  // Calculate menu
  const m = computeMenu(S.menu, S.flags);
  S.menu.cost = m.cost;
  S.menu.prep = m.prep;
  S.menu.wow = m.wow;
  S.menu.risk = m.risk;
  
  const before = createSnapshot(S);
  
  // Pay entry
  S.budget -= comp.entry;
  S.stats.totalSpent = (S.stats.totalSpent || 0) + comp.entry;
  
  // Apply plan modifications
  const spend = clamp(plan?.spend ?? 0, 0, 400);
  if (spend > 0 && S.budget >= spend) {
    S.budget -= spend;
    S.stats.totalSpent = (S.stats.totalSpent || 0) + spend;
    bump(S, {
      technique: Math.floor(spend / 200),
      palate: Math.floor(spend / 250)
    });
  }
  
  const rehearsal = plan?.rehearsal || "none";
  if (rehearsal === "timing") bump(S, { prep: 6, fatigue: 4, consistency: 1 });
  if (rehearsal === "clean") bump(S, { cleanliness: 4, fatigue: 3, risk: -1 });
  if (rehearsal === "taste") bump(S, { palate: 3, fatigue: 3, creativity: 1 });
  
  // Calculate score using modular scoring engine
  const scoring = calculateCompetitionScore(S, m, plan, comp);
  const target = getCompetitionTarget(S.week);
  const win = scoring.total >= target;
  
  // Rival
  const rival = rivalScoreAgainst(S, comp);
  const rivalBeatsYou = rival ? rival.score > scoring.total : false;
  if (rival) {
    S.rival.score = rival.score;
    if (rivalBeatsYou) S.rival.wins = (S.rival.wins || 0) + 1;
  }
  
  // Apply results
  bump(S, { fatigue: +10, prep: -10, risk: -6 });
  if (win) {
    bump(S, {
      budget: +comp.cash,
      rep: +comp.rep,
      morale: +10,
      consistency: +2
    });
    S.stats.totalEarned = (S.stats.totalEarned || 0) + comp.cash;
  } else {
    bump(S, {
      rep: -(S.week === 12 ? 2 : 1),
      morale: -6,
      technique: +1,
      cleanliness: +1
    });
  }
  
  // Track stats
  if (scoring.total > (S.stats.highestScore || 0)) {
    S.stats.highestScore = scoring.total;
  }
  if (S.fatigue < (S.stats.lowestFatigue || 100)) {
    S.stats.lowestFatigue = S.fatigue;
  }
  
  S.flags.scouted = false;
  
  const after = createSnapshot(S);
  const details = scoring;
  log(S, "competition", comp.name, before, after, {
    win,
    score: scoring.total,
    target,
    plan,
    menu: m,
    details,
    rival
  }, "");
  
  // Check achievements with competition context
  checkAndUnlockAchievements(S, {
    type: "competition",
    result: { win, score: scoring.total, target, plan, rival }
  });
  
  return {
    ok: true,
    win,
    score: scoring.total,
    target,
    rival,
    beatByRival: rivalBeatsYou,
    details: scoring
  };
}

// ===== WEEK PROGRESSION =====

/**
 * Advance to next week
 */
export function nextWeek(S) {
  const before = createSnapshot(S);
  
  // Handle overdue obligations
  const overdueCount = applyObligationPenalties(S);
  if (overdueCount) {
    log(S, "deliverable", "Overdue sponsor penalties", before, createSnapshot(S), 
        { overdue: overdueCount }, "Missed sponsor deliverables.");
  }
  
  // Natural fatigue recovery
  bump(S, { fatigue: -random(2, 4) });
  S.lastActionWeek = 0;
  
  // Random event
  if (Math.random() < CONFIG.EVENT_CHANCE_PER_WEEK) {
    const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    bump(S, ev.delta);
    log(S, "event", ev.name, before, createSnapshot(S), null, ev.desc);
  }
  
  S.week += 1;
  
  if (S.week > S.weeksTotal) {
    log(S, "event", "Season End", before, createSnapshot(S), null, "Reached week 12.");
    checkAndUnlockAchievements(S, { type: "season_end" });
  }
}

// ===== SEASON REPORTING =====

/**
 * Generate season report
 */
export function seasonReport(S) {
  const t = S.telemetry || [];
  const comps = t.filter(e => e.type === "competition").reverse();
  const wins = comps.filter(c => c.result?.win).length;
  const losses = comps.length - wins;
  const rivalBeats = comps.filter(c => c.result?.rival && c.result?.rival?.score > c.result?.score).length;
  const avgScore = comps.length ? (comps.reduce((a, c) => a + (c.result?.score || 0), 0) / comps.length) : 0;
  const bestScore = comps.length ? Math.max(...comps.map(c => c.result?.score || 0)) : 0;
  const worstScore = comps.length ? Math.min(...comps.map(c => c.result?.score || 0)) : 0;
  
  const snaps = t.map(e => e.after).filter(Boolean);
  const fatigueAvg = snaps.length ? snaps.reduce((a, s) => a + (s.fatigue || 0), 0) / snaps.length : 0;
  
  const lossDetails = comps.filter(c => !c.result?.win).map(c => c.result?.details).filter(Boolean);
  const cause = { fatigue: 0, risk: 0, prep: 0, variance: 0 };
  for (const d of lossDetails) {
    cause.fatigue += d.fatiguePenalty || 0;
    cause.risk += d.riskPenalty || 0;
    cause.prep += Math.max(0, 6 - (d.prepBonus || 6));
    cause.variance += (d.variance || 0);
  }
  const topCause = Object.entries(cause).sort((a, b) => b[1] - a[1])[0]?.[0] || "n/a";
  
  return {
    compsPlayed: comps.length,
    wins,
    losses,
    winRate: comps.length ? Math.round((wins / comps.length) * 100) : 0,
    rivalBeats,
    avgScore: +avgScore.toFixed(1),
    bestScore,
    worstScore,
    fatigueAvg: +fatigueAvg.toFixed(1),
    obligationsRemaining: (S.obligations || []).filter(o => !o.done).length,
    topFailureCause: topCause
  };
}

// ===== ACHIEVEMENTS INTEGRATION =====

/**
 * Check and unlock achievements
 */
function checkAndUnlockAchievements(S, context) {
  if (!CONFIG.FEATURES.achievements) return;
  
  const newAchievements = checkAllAchievements(S, context);
  newAchievements.forEach(id => {
    unlockAchievement(S, id);
  });
  
  return newAchievements;
}

// Re-export utilities for backward compatibility
export { random, clamp, money };
