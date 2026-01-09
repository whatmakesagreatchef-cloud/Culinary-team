// State + persistence (flat modular)
export const SAVE_KEY = "culinary_sim_flat_modular_save_v1";

export function defaultState(buildId="v0.1.0"){
  return {
    buildId,
    started:false,
    countryId:null,
    week:1,
    weeksTotal:12,
    budget:1000, rep:0, sponsorInterest:0,
    technique:50, palate:50, creativity:45, cleanliness:55, consistency:48, composure:48,
    morale:55, fatigue:8, prep:0, risk:10,
    community:0,
    telemetry: []
  };
}

export function loadState(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(e){
    return null;
  }
}

export function saveState(S){
  localStorage.setItem(SAVE_KEY, JSON.stringify(S));
}

export function resetLocal(){
  localStorage.removeItem(SAVE_KEY);
}
