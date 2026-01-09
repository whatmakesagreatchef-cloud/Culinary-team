// Game systems (flat modular)
import { COUNTRIES } from "./data_countries.js";
import { EVENTS } from "./data_events.js";
import { log, snap } from "./telemetry.js";

export const COMP_WEEKS = {
  3: {name:"Local Heat", entry:250, rep:8, cash:650, emphasis:"Cleanliness / systems"},
  6: {name:"Signature Showdown", entry:420, rep:12, cash:950, emphasis:"Creativity"},
  9: {name:"Speed & Steel", entry:380, rep:13, cash:900, emphasis:"Technique / timing"},
  12:{name:"Grand Final", entry:600, rep:22, cash:1600, emphasis:"Everything"}
};

export const ACTIONS = [
  {id:"train", name:"Train Systems", desc:"Technique +, Cleanliness +, Prep +, Fatigue +",
    apply:(S)=>{ bump(S,{technique:r(3,6),cleanliness:r(2,5),prep:6,fatigue:6}); }},
  {id:"rnd", name:"R&D Menu", desc:"Creativity +, Palate +, Budget -, Risk +",
    apply:(S)=>{ bump(S,{budget:-r(120,220),creativity:r(3,7),palate:r(2,6),risk:4,prep:5,fatigue:4}); }},
  {id:"sponsor", name:"Sponsor Meetings", desc:"Budget +, Sponsor interest + (rep helps)",
    apply:(S)=>{
      const ok = (S.rep>=6) || Math.random()>0.35;
      if(ok){ bump(S,{budget:r(180,420)+Math.floor(S.rep*6),sponsorInterest:1,fatigue:3}); }
      else { bump(S,{rep:-2,fatigue:2}); }
    }},
  {id:"community", name:"Community / Mentoring", desc:"Reputation +, Morale +, Budget -",
    apply:(S)=>{ bump(S,{budget:-r(80,160),rep:r(4,8),morale:6,fatigue:2,community:1}); }}
];

export function r(a,b){ return a + Math.floor(Math.random()*(b-a+1)); }
export function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
export function money(n){ return "$"+Math.max(0, Math.floor(n)); }
export function countryFor(S){ return COUNTRIES.find(c=>c.id===S.countryId) || null; }

export function bump(S, delta){
  for(const k of Object.keys(delta)){ S[k] = (S[k] ?? 0) + delta[k]; }
  ["technique","palate","creativity","cleanliness","consistency","composure","morale","fatigue","prep","risk"].forEach(k=>{
    S[k] = clamp(S[k], 0, 120);
  });
  S.budget = Math.floor(S.budget);
  S.rep = Math.max(0, Math.floor(S.rep));
  S.sponsorInterest = Math.max(0, Math.floor(S.sponsorInterest));
}

export function chapterForWeek(S){
  const c = countryFor(S);
  if(!c) return null;
  const idx = (S.week===1?0:S.week===5?1:S.week===9?2:S.week===12?3:-1);
  return idx<0 ? null : c.chapters[idx];
}

export function applyStoryChoice(S, choiceIndex){
  const before = snap(S);
  const ch = chapterForWeek(S);
  const c = countryFor(S);
  if(!ch || !c) return;
  const key = c.id+"_"+S.week+"_"+choiceIndex;

  const effects = {
    "AU-WA_1_0": {technique:4, cleanliness:6, fatigue:6},
    "AU-WA_1_1": {creativity:6, risk:5, budget:-160},
    "AU-WA_5_0": {prep:8, rep:4, cleanliness:2, risk:-1},
    "AU-WA_5_1": {morale:6, consistency:2},
    "AU-WA_9_0": {creativity:4, rep:3, risk:4},
    "AU-WA_9_1": {consistency:5, risk:-4, creativity:-1},
    "AU-WA_12_0": {consistency:4, risk:-3},
    "AU-WA_12_1": {creativity:3, risk:5, composure:2},

    "FR_1_0": {consistency:5, creativity:-2, risk:-2},
    "FR_1_1": {creativity:4, risk:4},
    "FR_5_0": {prep:7, cleanliness:3, fatigue:4},
    "FR_5_1": {palate:4, risk:3},
    "FR_9_0": {risk:-4, consistency:4},
    "FR_9_1": {technique:4, risk:4},
    "FR_12_0": {technique:4, consistency:2, risk:-2},
    "FR_12_1": {creativity:3, composure:2, risk:2},

    "JP_1_0": {cleanliness:4, rep:3, consistency:2},
    "JP_1_1": {technique:4, prep:5, fatigue:4},
    "JP_5_0": {technique:3, consistency:3},
    "JP_5_1": {prep:6, risk:3},
    "JP_9_0": {cleanliness:3, risk:-3},
    "JP_9_1": {creativity:3, risk:3},
    "JP_12_0": {consistency:5, risk:-3},
    "JP_12_1": {palate:3, risk:4, creativity:2},

    "TH_1_0": {palate:4, consistency:3},
    "TH_1_1": {creativity:7, risk:7, budget:-180},
    "TH_5_0": {palate:4, risk:-3},
    "TH_5_1": {rep:3, risk:6},
    "TH_9_0": {technique:3, palate:3},
    "TH_9_1": {creativity:3, risk:3},
    "TH_12_0": {consistency:3, risk:-2},
    "TH_12_1": {creativity:3, risk:4},

    "MX_1_0": {cleanliness:3, risk:-3},
    "MX_1_1": {creativity:4, risk:4},
    "MX_5_0": {palate:3, consistency:3},
    "MX_5_1": {creativity:3, risk:3},
    "MX_9_0": {risk:-4, consistency:4},
    "MX_9_1": {rep:4, risk:3},
    "MX_12_0": {consistency:4, risk:-3},
    "MX_12_1": {creativity:3, risk:5},

    "US_1_0": {budget:-220, technique:4},
    "US_1_1": {fatigue:5, consistency:4},
    "US_5_0": {creativity:4, risk:4, rep:1},
    "US_5_1": {consistency:4, rep:3},
    "US_9_0": {creativity:4, prep:-3, risk:2},
    "US_9_1": {prep:5, risk:-3},
    "US_12_0": {consistency:4, risk:-2},
    "US_12_1": {creativity:3, risk:3, composure:2},
  };

  bump(S, effects[key] || {rep:1});
  const after = snap(S);
  log(S, "story", ch[0], before, after, null, "Choice " + (choiceIndex===0 ? "A":"B"));
}

export function takeAction(S, actionId){
  const a = ACTIONS.find(x=>x.id===actionId);
  if(!a) return;
  const before = snap(S);
  a.apply(S);
  if(S.cleanliness >= 70 && Math.random() < 0.6){ bump(S,{consistency:2}); }
  if(S.fatigue >= 55 && Math.random() < 0.7){ bump(S,{morale:-r(2,6), consistency:-2}); }
  const after = snap(S);
  log(S, "action", a.name, before, after, null, "");
}

export function runCompetition(S, approach){
  const comp = COMP_WEEKS[S.week];
  if(!comp) return { ok:false, message:"Not a competition week." };
  if(S.budget < comp.entry) return { ok:false, message:"Not enough budget to enter." };

  const before = snap(S);
  S.budget -= comp.entry;

  const base = (S.palate*0.28 + S.technique*0.28 + S.creativity*0.22 + S.cleanliness*0.22) / 2;
  const prepBoost = Math.min(16, Math.floor(S.prep/2));

  const fatiguePenalty = Math.max(0, (S.fatigue-35)*0.55);
  const riskPenalty = Math.max(0, S.risk*0.35);
  const stability = (S.consistency*0.22 + S.composure*0.18);
  const penalty = Math.max(0, fatiguePenalty + riskPenalty - stability);

  const variance = (approach==="safe")?6 : (approach==="standard")?10 : 15;
  const rng = r(-variance, variance);
  const approachMod = (approach==="safe")? +4 : (approach==="standard")? 0 : -2;

  const target = (S.week===12)?78:70;
  const total = base + prepBoost + approachMod + rng - penalty;
  const win = total >= target;

  bump(S,{fatigue:+10, prep:-10, risk:-6});
  if(win){
    bump(S,{budget:+comp.cash, rep:+comp.rep, morale:+10, consistency:+2});
  } else {
    bump(S,{rep:-(S.week===12?2:1), morale:-6, technique:+1, cleanliness:+1});
  }

  const after = snap(S);
  log(S, "competition", comp.name, before, after, {win, score:+total.toFixed(1), target}, "Approach: "+approach);
  return { ok:true, win, score:+total.toFixed(1), target };
}

export function nextWeek(S){
  const before = snap(S);
  bump(S,{fatigue:-r(2,4)});
  if(Math.random() < 0.55){
    const ev = EVENTS[Math.floor(Math.random()*EVENTS.length)];
    const c = countryFor(S);
    if(c?.id==="TH" && Math.random() < 0.35){
      const fb = EVENTS.find(e=>e.id==="flavour_breakthrough");
      if(fb){ bump(S, fb.delta); log(S,"event",fb.name,before,snap(S),null,fb.desc); }
    } else {
      bump(S, ev.delta);
      log(S, "event", ev.name, before, snap(S), null, ev.desc);
    }
  }
  S.week += 1;
  if(S.week > S.weeksTotal){
    log(S, "event", "Season End", before, snap(S), null, "Reached week 12.");
  }
}
