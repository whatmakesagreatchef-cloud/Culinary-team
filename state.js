export const SAVE_KEY = "culinary_sim_polished_flat_v030";
export function defaultMenu(){
  return {name:"Untitled Menu",proteinId:"chicken",techniqueId:"roast",sauceId:"jus",garnishId:"knife_cuts",dessertId:"citrus",notes:"",cost:0,prep:0,wow:0,risk:0};
}
export function defaultState(buildId="v0.3.0"){
  return {buildId,ui:{tab:"dashboard",tutorialDone:false},started:false,countryId:null,week:1,weeksTotal:12,
  budget:1000,rep:0,sponsorInterest:0,technique:50,palate:50,creativity:45,cleanliness:55,consistency:48,composure:48,
  morale:55,fatigue:8,prep:0,risk:10,flags:{},menu:defaultMenu(),lastActionWeek:0,telemetry:[],
  obligations:[],rival:{id:null,name:null,countryId:null,score:0,wins:0}};
}
export function loadState(){ try{ const raw=localStorage.getItem(SAVE_KEY); return raw?JSON.parse(raw):null; }catch(e){ return null; } }
export function saveState(S){ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }
export function resetLocal(){ localStorage.removeItem(SAVE_KEY); }
