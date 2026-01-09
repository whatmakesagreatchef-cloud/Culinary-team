\
// Systems + strategy
import { COUNTRIES } from "./data_countries.js";
import { COMPETITORS } from "./data_competitors.js";
import { EVENTS } from "./data_events.js";
import { MENU_PARTS } from "./data_menu_parts.js";
import { log, snap } from "./telemetry.js";

export const COMP_WEEKS={
  3:{name:"Local Heat",entry:250,rep:8,cash:650,emphasis:"Cleanliness / systems"},
  6:{name:"Signature Showdown",entry:420,rep:12,cash:950,emphasis:"Menu cohesion + wow"},
  9:{name:"Speed & Steel",entry:380,rep:13,cash:900,emphasis:"Technique / timing"},
  12:{name:"Grand Final",entry:600,rep:22,cash:1600,emphasis:"Everything"}
};

export const FUND_TIERS=[
  {id:"bronze",name:"Bronze",reqRep:0,  cash:180,oblig:1,risk:1,desc:"Small local partner."},
  {id:"silver",name:"Silver",reqRep:8, cash:320,oblig:2,risk:2,desc:"More cash, more expectations."},
  {id:"gold",  name:"Gold",  reqRep:14,cash:520,oblig:3,risk:3,desc:"Real money. Real pressure."},
  {id:"platinum",name:"Platinum",reqRep:22,cash:820,oblig:4,risk:4,desc:"Big swing. Big obligation."}
];

export const ACTIONS=[
  {id:"train",name:"Train Systems",desc:"Technique +, Cleanliness +, Prep +, Fatigue +",apply:(S)=>bump(S,{technique:r(3,6),cleanliness:r(2,5),prep:6,fatigue:6})},
  {id:"rnd",name:"R&D Menu",desc:"Creativity +, Palate +, Budget -, Risk +",apply:(S)=>bump(S,{budget:-r(120,220),creativity:r(3,7),palate:r(2,6),risk:4,prep:5,fatigue:4})},
  {id:"sponsor",name:"Sponsor Meetings",desc:"Budget +, Sponsor interest + (rep helps)",apply:(S)=>{const ok=(S.rep>=6)||Math.random()>0.35; if(ok)bump(S,{budget:r(180,420)+Math.floor(S.rep*6),sponsorInterest:1,fatigue:3}); else bump(S,{rep:-2,fatigue:2});}},
  {id:"deliver",name:"Deliver Sponsor Pack",desc:"Clear one obligation (if any) → rep +, risk -",apply:(S)=>deliver(S)},
  {id:"community",name:"Community / Mentoring",desc:"Reputation +, Morale +, Budget -",apply:(S)=>bump(S,{budget:-r(80,160),rep:r(4,8),morale:6,fatigue:2})},
  {id:"scout",name:"Scout Rival",desc:"Lower variance next competition, reduces risk slightly",apply:(S)=>{bump(S,{composure:3,risk:-2,fatigue:2}); S.flags.scouted=true;}},
  {id:"recover",name:"Recovery Week",desc:"Fatigue -, morale +, risk -",apply:(S)=>bump(S,{fatigue:-10,morale:6,risk:-2})},
];

export function r(a,b){return a+Math.floor(Math.random()*(b-a+1));}
export function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
export function money(n){return "$"+Math.max(0,Math.floor(n));}
export function countryFor(S){return COUNTRIES.find(c=>c.id===S.countryId)||null;}
export function storyNodeForWeek(S){const c=countryFor(S); return (c?.story||[]).find(x=>x.week===S.week)||null;}
export function competitorsForCountry(countryId){return COMPETITORS.filter(x=>x.countryId===countryId);}
export function chooseRival(S){
  const c=countryFor(S); if(!c) return null;
  const rid=c.rivalCountryId || null;
  const pool = rid ? COMPETITORS.filter(x=>x.countryId===rid) : COMPETITORS.filter(x=>x.countryId!==S.countryId);
  const pick = pool[Math.floor(Math.random()*pool.length)];
  return pick || null;
}

export function bump(S,delta){
  for(const k of Object.keys(delta)){S[k]=(S[k]??0)+delta[k];}
  ["technique","palate","creativity","cleanliness","consistency","composure","morale","fatigue","prep","risk"].forEach(k=>S[k]=clamp(S[k],0,120));
  S.budget=Math.floor(S.budget); S.rep=Math.max(0,Math.floor(S.rep)); S.sponsorInterest=Math.max(0,Math.floor(S.sponsorInterest));
}
export function applyPerks(S){
  const c=countryFor(S); if(!c) return; const p=c.perks||{};
  if(p.budget) S.budget+=p.budget; if(p.rep) S.rep+=p.rep; if(p.technique) S.technique+=p.technique;
  if(p.consistency) S.consistency+=p.consistency; if(p.composure) S.composure+=p.composure; if(p.palate) S.palate+=p.palate;
  if(p.creativity) S.creativity+=p.creativity; if(p.prep) S.prep+=p.prep; if(p.morale) S.morale+=p.morale;
  if(p.sponsorInterest) S.sponsorInterest+=p.sponsorInterest;
}
export function applyStoryChoice(S,i){
  const node=storyNodeForWeek(S); const ch=node?.choices?.[i]; if(!ch) return;
  const before=snap(S); bump(S,ch.effects||{}); S.flags={...S.flags,...(ch.flags||{})}; const after=snap(S);
  log(S,"story",node.title,before,after,{choice:ch.label},ch.desc||"");
}
export function parts(){return MENU_PARTS;}
function partById(group,id){return (MENU_PARTS[group]||[]).find(x=>x.id===id)||(MENU_PARTS[group]||[])[0];}
export function computeMenu(menu,flags={}){
  const protein=partById("proteins",menu.proteinId), technique=partById("techniques",menu.techniqueId),
        sauce=partById("sauces",menu.sauceId), garnish=partById("garnish",menu.garnishId), dessert=partById("dessert",menu.dessertId);
  const parts=[protein,technique,sauce,garnish,dessert];
  const cost=parts.reduce((a,p)=>a+(p.cost||0),0);
  const prep=parts.reduce((a,p)=>a+(p.prep||0),0);
  const wowBase=(parts.reduce((a,p)=>a+(p.cre||0),0)*1.7)+(parts.reduce((a,p)=>a+(p.tech||0),0)*1.3)+(parts.reduce((a,p)=>a+(p.palate||0),0)*1.2);
  let synergy=0;
  if((protein.tags||[]).includes("wa") && flags.waStory) synergy+=3;
  if(flags.storyFirst) synergy+=2;
  if(flags.heroElement) synergy+=2;
  if(flags.harmony) synergy+=1;
  const risk=parts.reduce((a,p)=>a+(p.risk||0),0)+Math.max(0,Math.floor(prep/6));
  const wow=Math.max(0,Math.round(wowBase+synergy));
  return {cost,prep,wow,risk,breakdown:{protein,technique,sauce,garnish,dessert,synergy}};
}
export function applyMenuToState(S){
  const before=snap(S); const m=computeMenu(S.menu,S.flags);
  S.menu.cost=m.cost; S.menu.prep=m.prep; S.menu.wow=m.wow; S.menu.risk=m.risk;
  const after=snap(S); log(S,"menu","Menu Updated",before,after,null,"Menu recalculated."); return m;
}
export function menuTestCook(S){
  const before=snap(S); const m=computeMenu(S.menu,S.flags);
  bump(S,{budget:-Math.max(40,Math.floor(m.cost*0.25)),fatigue:4,prep:4});
  bump(S,{consistency:2,technique:1,risk:-2}); S.flags.tested=true;
  applyMenuToState(S); const after=snap(S); log(S,"action","Menu Test Cook",before,after,null,"Dry run to reduce variance.");
}
export function takeAction(S,actionId){
  if(S.lastActionWeek===S.week) return {ok:false,message:"You already took a weekly action. Advance week to continue."};
  const a=ACTIONS.find(x=>x.id===actionId); if(!a) return {ok:false,message:"Action not found."};
  const before=snap(S); a.apply(S);
  const c=countryFor(S);
  if(c?.perks?.consistencyBoost && actionId==="train" && Math.random()<0.8) bump(S,{consistency:2});
  if(c?.perks?.repGain && actionId==="community") bump(S,{rep:Math.floor(2+3*c.perks.repGain*10)});
  if(S.fatigue>=55 && Math.random()<0.65) bump(S,{morale:-r(2,6),consistency:-2});
  const after=snap(S); log(S,"action",a.name,before,after,null,""); S.lastActionWeek=S.week; return {ok:true};
}

// --- fundraising mini-game
export function startFundraising(S, tierId, promise="safe"){
  const t = FUND_TIERS.find(x=>x.id===tierId); if(!t) return {ok:false,message:"Tier not found."};
  if(S.rep < t.reqRep) return {ok:false,message:`Need reputation ${t.reqRep}+ for ${t.name}.`};
  if(S.lastActionWeek===S.week) return {ok:false,message:"You already took a weekly action."};
  const before=snap(S);
  const promiseRisk = promise==="safe"?0:(promise==="standard"?1:2);
  const baseChance = 0.55 + (S.rep*0.01) + (S.sponsorInterest*0.05) - (t.risk*0.04) - (promiseRisk*0.06);
  const chance = clamp(baseChance, 0.25, 0.92);
  const roll = Math.random();
  if(roll < chance){
    const cash = t.cash + Math.floor(S.rep*6);
    bump(S,{budget:cash, sponsorInterest:1, risk:t.risk+promiseRisk, fatigue:3});
    const due = nextCompWeek(S.week);
    for(let i=0;i<t.oblig;i++){ S.obligations.push({id:`obl_${Date.now()}_${i}`,dueWeek:due,level:t.id,done:false}); }
    const after=snap(S);
    log(S,"fundraising","Fundraising success",before,after,{tier:t.name,promise,roll:+roll.toFixed(2),chance:+chance.toFixed(2),cash,obligations:t.oblig,dueWeek:due},"Sponsor obligations added.");
  }else{
    bump(S,{rep:-2, morale:-3, fatigue:2, risk:1});
    const after=snap(S);
    log(S,"fundraising","Fundraising failed",before,after,{tier:t.name,promise,roll:+roll.toFixed(2),chance:+chance.toFixed(2)},"Pitch didn’t land.");
  }
  S.lastActionWeek=S.week;
  return {ok:true};
}
export function deliver(S){
  const before=snap(S);
  const idx = (S.obligations||[]).findIndex(o=>!o.done);
  if(idx>=0){
    S.obligations[idx].done=true;
    bump(S,{rep:3,risk:-2, morale:2, fatigue:2});
    log(S,"deliverable","Sponsor deliverable delivered",before,snap(S),{cleared:1},"One obligation cleared.");
  }else{
    bump(S,{rep:1, risk:-1, fatigue:1});
    log(S,"deliverable","Sponsor check-in",before,snap(S),{cleared:0},"No obligations, but you stayed visible.");
  }
}
export function nextCompWeek(week){
  const keys = Object.keys(COMP_WEEKS).map(x=>Number(x)).sort((a,b)=>a-b);
  for(const k of keys){ if(k>week) return k; }
  return 12;
}
export function applyObligationPenalties(S){
  const overdue = (S.obligations||[]).filter(o=>!o.done && o.dueWeek<=S.week);
  if(overdue.length){
    bump(S,{rep:-2*overdue.length, risk:+2*overdue.length, morale:-2});
    overdue.forEach(o=>o.done=true);
    return overdue.length;
  }
  return 0;
}

// --- Rival simulation
export function pickSignatureMenu(competitor, comp){
  const sigs = competitor.signatures || [];
  if(!sigs.length) return null;
  const em = (comp?.emphasis||"").toLowerCase();
  let best = sigs[0], bestScore=-999;
  for(const s of sigs){
    const m = computeMenu(s, {});
    let score = 0;
    if(em.includes("wow") || em.includes("menu")) score += m.wow*1.2 - m.prep*0.6;
    else if(em.includes("clean")) score += -m.risk*1.0 - m.prep*0.4;
    else if(em.includes("technique")||em.includes("timing")) score += -m.prep*0.4 + m.wow*0.6;
    else score += m.wow*0.8 - m.prep*0.4;
    if(score>bestScore){bestScore=score; best=s;}
  }
  return best;
}
export function rivalScoreAgainst(S, comp){
  const rival = S.rival?.id ? COMPETITORS.find(x=>x.id===S.rival.id) : null;
  if(!rival) return null;
  const menu = pickSignatureMenu(rival, comp);
  const m = computeMenu(menu, {});
  const base = {technique:62,palate:60,creativity:54,cleanliness:62,consistency:64,composure:62,prep:18,fatigue:18,risk:14};
  const mods = rival.mods||{};
  const R = {...base, ...Object.fromEntries(Object.entries(base).map(([k,v])=>[k, v + (mods[k]||0)]))};
  const core=(R.palate*0.30+R.technique*0.28+R.cleanliness*0.22+R.consistency*0.20)/2;
  const menuImpact=(m.wow*0.18)+(R.creativity*0.12);
  const prepBoost=Math.min(18,Math.floor((R.prep-m.prep)/2)+6);
  const fatiguePenalty=Math.max(0,(R.fatigue-35)*0.45);
  const riskPenalty=Math.max(0,(R.risk+m.risk-20)*0.28);
  const stability=(R.composure*0.22+R.consistency*0.18);
  const penalty=Math.max(0,fatiguePenalty+riskPenalty-stability);
  const variance=7;
  const rng=r(-variance,variance);
  let emphasisMod=0;
  if(comp.emphasis.includes("Cleanliness")) emphasisMod+=(R.cleanliness-60)*0.05;
  if(comp.emphasis.includes("Technique")) emphasisMod+=(R.technique-60)*0.05;
  if(comp.emphasis.includes("Menu")) emphasisMod+=(m.wow-25)*0.06;
  const total=core+menuImpact+prepBoost+rng+emphasisMod-penalty;
  return {id:rival.id,name:rival.name,countryId:rival.countryId,archetype:rival.archetype,menu,menuCalc:m,score:+total.toFixed(1)};
}

export function runCompetition(S,plan){
  const comp=COMP_WEEKS[S.week]; if(!comp) return {ok:false,message:"Not a competition week."};
  if(S.budget<comp.entry) return {ok:false,message:"Not enough budget to enter."};
  const m=computeMenu(S.menu,S.flags); S.menu.cost=m.cost; S.menu.prep=m.prep; S.menu.wow=m.wow; S.menu.risk=m.risk;
  const before=snap(S);
  S.budget-=comp.entry;
  const spend=clamp(plan?.spend??0,0,400);
  if(spend>0 && S.budget>=spend){S.budget-=spend; bump(S,{technique:Math.floor(spend/200),palate:Math.floor(spend/250)});}
  const rehearsal=plan?.rehearsal||"none";
  if(rehearsal==="timing") bump(S,{prep:6,fatigue:4,consistency:1});
  if(rehearsal==="clean") bump(S,{cleanliness:4,fatigue:3,risk:-1});
  if(rehearsal==="taste") bump(S,{palate:3,fatigue:3,creativity:1});
  const approach=plan?.approach||"standard";
  const varianceBase=(approach==="safe")?6:(approach==="standard")?10:15;
  const variance=Math.max(4,varianceBase-(S.flags.scouted?3:0)-(S.flags.tested?2:0));
  const core=(S.palate*0.30+S.technique*0.28+S.cleanliness*0.22+S.consistency*0.20)/2;
  const menuImpact=(m.wow*0.18)+(S.creativity*0.12);
  const prepBoost=Math.min(18,Math.floor((S.prep-m.prep)/2)+6);
  const fatiguePenalty=Math.max(0,(S.fatigue-35)*0.55);
  const riskPenalty=Math.max(0,(S.risk+m.risk-20)*0.32);
  const stability=(S.composure*0.22+S.consistency*0.18);
  const penalty=Math.max(0,fatiguePenalty+riskPenalty-stability);
  const rng=r(-variance,variance);
  const approachMod=(approach==="safe")?+4:(approach==="standard")?0:-2;
  let emphasisMod=0;
  if(comp.emphasis.includes("Cleanliness")) emphasisMod+=(S.cleanliness-60)*0.05;
  if(comp.emphasis.includes("Technique")) emphasisMod+=(S.technique-60)*0.05;
  if(comp.emphasis.includes("Menu")) emphasisMod+=(m.wow-25)*0.06;
  const target=(S.week===12)?78:70;
  const total=core+menuImpact+prepBoost+approachMod+rng+emphasisMod-penalty;
  const win=total>=target;

  // Rival
  const rival = rivalScoreAgainst(S, comp);
  const rivalBeatsYou = rival ? rival.score > total : false;
  if(rival){ S.rival.score = rival.score; if(rivalBeatsYou) S.rival.wins=(S.rival.wins||0)+1; }

  bump(S,{fatigue:+10,prep:-10,risk:-6});
  if(win) bump(S,{budget:+comp.cash,rep:+comp.rep,morale:+10,consistency:+2});
  else bump(S,{rep:-(S.week===12?2:1),morale:-6,technique:+1,cleanliness:+1});
  S.flags.scouted=false;

  const after=snap(S);
  const details={core:+core.toFixed(2),menuImpact:+menuImpact.toFixed(2),prepBoost,approachMod,rng,emphasisMod:+emphasisMod.toFixed(2),
    fatiguePenalty:+fatiguePenalty.toFixed(2),riskPenalty:+riskPenalty.toFixed(2),stability:+stability.toFixed(2),penalty:+penalty.toFixed(2),variance,target};
  log(S,"competition",comp.name,before,after,{win,score:+total.toFixed(1),target,plan,menu:m,details,rival},"");
  return {ok:true,win,score:+total.toFixed(1),target,rival,beatByRival:rivalBeatsYou};
}

export function nextWeek(S){
  const before=snap(S);
  const overdueCount = applyObligationPenalties(S);
  if(overdueCount){
    log(S,"deliverable","Overdue sponsor penalties",before,snap(S),{overdue:overdueCount},"Missed sponsor deliverables.");
  }
  bump(S,{fatigue:-r(2,4)}); S.lastActionWeek=0;
  if(Math.random()<0.55){
    const ev=EVENTS[Math.floor(Math.random()*EVENTS.length)];
    bump(S,ev.delta);
    log(S,"event",ev.name,before,snap(S),null,ev.desc);
  }
  S.week+=1;
  if(S.week>S.weeksTotal){
    log(S,"event","Season End",before,snap(S),null,"Reached week 12.");
  }
}

export function seasonReport(S){
  const t = S.telemetry || [];
  const comps = t.filter(e=>e.type==="competition").reverse();
  const wins = comps.filter(c=>c.result?.win).length;
  const losses = comps.length - wins;
  const rivalBeats = comps.filter(c=>c.result?.rival && c.result?.rival?.score > c.result?.score).length;
  const avgScore = comps.length ? (comps.reduce((a,c)=>a+(c.result?.score||0),0)/comps.length) : 0;
  const bestScore = comps.length ? Math.max(...comps.map(c=>c.result?.score||0)) : 0;
  const worstScore = comps.length ? Math.min(...comps.map(c=>c.result?.score||0)) : 0;

  const snaps = t.map(e=>e.after).filter(Boolean);
  const fatigueAvg = snaps.length ? snaps.reduce((a,s)=>a+(s.fatigue||0),0)/snaps.length : 0;

  const lossDetails = comps.filter(c=>!c.result?.win).map(c=>c.result?.details).filter(Boolean);
  const cause = {fatigue:0,risk:0,prep:0,variance:0};
  for(const d of lossDetails){
    cause.fatigue += d.fatiguePenalty||0;
    cause.risk += d.riskPenalty||0;
    cause.prep += Math.max(0, 6 - (d.prepBoost||6));
    cause.variance += (d.variance||0);
  }
  const topCause = Object.entries(cause).sort((a,b)=>b[1]-a[1])[0]?.[0] || "n/a";

  return {
    compsPlayed: comps.length, wins, losses, winRate: comps.length? Math.round((wins/comps.length)*100):0,
    rivalBeats, avgScore:+avgScore.toFixed(1), bestScore, worstScore,
    fatigueAvg:+fatigueAvg.toFixed(1),
    obligationsRemaining:(S.obligations||[]).filter(o=>!o.done).length,
    topFailureCause: topCause
  };
}

