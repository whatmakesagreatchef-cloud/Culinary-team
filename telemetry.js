export function snap(S){
  return {week:S.week,budget:S.budget,rep:S.rep,sponsorInterest:S.sponsorInterest,technique:S.technique,palate:S.palate,creativity:S.creativity,
  cleanliness:S.cleanliness,consistency:S.consistency,composure:S.composure,morale:S.morale,fatigue:S.fatigue,prep:S.prep,risk:S.risk,
  obligations:(S.obligations||[]).length,rival:{...(S.rival||{})},menu:{...S.menu}};
}
export function log(S,type,name,before,after,result=null,notes=""){
  S.telemetry.unshift({ts:new Date().toISOString(),buildId:S.buildId,week:S.week,type,name,before,after,result,notes});
}
export function exportTelemetry(S){
  const blob=new Blob([JSON.stringify(S.telemetry,null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
  const safe=(S.buildId||"build").replace(/[^a-z0-9._-]/gi,"_");
  a.download=`telemetry_${safe}_${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(a.href);
}
