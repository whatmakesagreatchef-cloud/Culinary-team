// UI + wiring (flat modular)
import { COUNTRIES } from "./data_countries.js";
import { COMP_WEEKS, ACTIONS, money, countryFor, chapterForWeek, applyStoryChoice, takeAction, runCompetition, nextWeek } from "./systems.js";
import { defaultState, loadState, saveState, resetLocal } from "./state.js";
import { log, snap, exportTelemetry } from "./telemetry.js";

let S = loadState() || defaultState("v0.1.0");

const el = (id)=>document.getElementById(id);
const title = el("title");
const subtitle = el("subtitle");
const kpis = el("kpis");
const storyBlock = el("storyBlock");
const actionBlock = el("actionBlock");
const advanceBlock = el("advanceBlock");
const countrySelect = el("countrySelect");
const buildIdInput = el("buildId");
const subhead = el("subhead");
const logEl = el("log");

function initCountries(){
  countrySelect.innerHTML = "";
  COUNTRIES.forEach(c=>{
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    countrySelect.appendChild(opt);
  });
  countrySelect.value = S.countryId || COUNTRIES[0].id;
}

function kpi(label, value, cls=""){
  return `<div class="kpi"><div class="l">${label}</div><div class="v ${cls}">${value}</div></div>`;
}

function render(){
  S.buildId = (buildIdInput.value || "v0.1.0").trim();
  saveState(S);

  if(!S.started){
    title.textContent = "Not started";
    subtitle.textContent = "Choose a country and press Start.";
    subhead.textContent = "Pick a country and run a 12-week season.";
  } else {
    const c = countryFor(S);
    title.textContent = `Week ${S.week} of ${S.weeksTotal} — ${c.name}`;
    subtitle.textContent = `${c.tagline} | Rival: ${c.rival} | Build: ${S.buildId}`;
    subhead.textContent = "Season loop: story beats + weekly actions + competition weeks + telemetry export.";
  }

  kpis.innerHTML = [
    kpi("Budget", money(S.budget), S.budget<200 ? "warn":"good"),
    kpi("Reputation", Math.round(S.rep), S.rep>=25?"good":"warn"),
    kpi("Sponsor Interest", Math.round(S.sponsorInterest), S.sponsorInterest>=2?"good":"warn"),
    kpi("Morale", Math.round(S.morale), S.morale>=70?"good":S.morale<=35?"bad":"warn"),
    kpi("Technique", Math.round(S.technique)),
    kpi("Palate", Math.round(S.palate)),
    kpi("Creativity", Math.round(S.creativity)),
    kpi("Cleanliness", Math.round(S.cleanliness)),
    kpi("Consistency", Math.round(S.consistency)),
    kpi("Composure", Math.round(S.composure)),
    kpi("Prep", Math.round(S.prep), S.prep>=12?"good":"warn"),
    kpi("Fatigue", Math.round(S.fatigue), S.fatigue>=70?"bad":S.fatigue>=40?"warn":"good"),
    kpi("Risk", Math.round(S.risk), S.risk>=70?"bad":S.risk>=40?"warn":"good"),
  ].join("");

  storyBlock.innerHTML = "";
  if(S.started){
    const ch = chapterForWeek(S);
    if(ch){
      storyBlock.innerHTML = `
        <h2>Story Chapter</h2>
        <div class="muted small">${ch[1]}</div>
        <div class="choices" style="margin-top:10px">
          <div class="choice" data-choice="0"><h3>Choice A</h3><p>${ch[2][0]}</p></div>
          <div class="choice" data-choice="1"><h3>Choice B</h3><p>${ch[2][1]}</p></div>
        </div>
      `;
      storyBlock.querySelectorAll(".choice").forEach(node=>{
        node.addEventListener("click", ()=>{
          applyStoryChoice(S, Number(node.getAttribute("data-choice")));
          saveState(S);
          render();
        });
      });
    } else {
      storyBlock.innerHTML = `<h2>Story</h2><div class="muted small">No chapter this week. Build your systems.</div>`;
    }
  } else {
    storyBlock.innerHTML = `<h2>Story</h2><div class="muted small">Start a season to activate story chapters.</div>`;
  }

  actionBlock.innerHTML = "";
  if(S.started && S.week <= S.weeksTotal){
    const comp = COMP_WEEKS[S.week];
    if(comp){
      actionBlock.innerHTML = `
        <h2>${comp.name} (Competition Week)</h2>
        <div class="muted small">Entry ${money(comp.entry)} | Reward ${money(comp.cash)} + ${comp.rep} rep | Emphasis: ${comp.emphasis}</div>
        <div class="choices" style="margin-top:10px">
          <div class="choice" data-approach="safe"><h3>Safe</h3><p>Lower variance, cleaner execution.</p></div>
          <div class="choice" data-approach="standard"><h3>Standard</h3><p>Balanced plan.</p></div>
          <div class="choice" data-approach="bold"><h3>Bold</h3><p>High upside, higher risk.</p></div>
        </div>
      `;
      actionBlock.querySelectorAll(".choice").forEach(node=>{
        node.addEventListener("click", ()=>{
          const res = runCompetition(S, node.getAttribute("data-approach"));
          if(!res.ok) alert(res.message);
          saveState(S);
          render();
        });
      });
    } else {
      actionBlock.innerHTML = `
        <h2>Weekly Action</h2>
        <div class="muted small">Pick one focus. Export telemetry to compare builds.</div>
        <div class="choices" style="margin-top:10px">
          ${ACTIONS.map(a=>`<div class="choice" data-action="${a.id}"><h3>${a.name}</h3><p>${a.desc}</p></div>`).join("")}
        </div>
      `;
      actionBlock.querySelectorAll(".choice").forEach(node=>{
        node.addEventListener("click", ()=>{
          takeAction(S, node.getAttribute("data-action"));
          saveState(S);
          render();
        });
      });
    }
  } else {
    actionBlock.innerHTML = `<h2>Actions</h2><div class="muted small">Start a season to take actions.</div>`;
  }

  advanceBlock.innerHTML = "";
  if(S.started && S.week <= S.weeksTotal){
    advanceBlock.innerHTML = `
      <h2>Advance</h2>
      <div class="muted small">Advancing triggers light recovery and occasional events.</div>
      <div class="row" style="margin-top:10px"><button id="btnNext">Next Week</button></div>
    `;
    el("btnNext").addEventListener("click", ()=>{
      nextWeek(S);
      saveState(S);
      render();
    });
  } else if(S.started && S.week > S.weeksTotal){
    advanceBlock.innerHTML = `<h2>Season Complete</h2><div class="muted small">Export telemetry and compare builds. Try another country.</div>`;
  }

  logEl.innerHTML = (S.telemetry || []).slice(0,80).map(e=>{
    const right = e.type==="competition" ? (e.result?.win ? `<span class="good">WIN</span>` : `<span class="warn">LOSS</span>`) : `<span class="muted">${e.buildId}</span>`;
    const extra = e.result ? ` • score ${e.result.score} (target ${e.result.target})` : "";
    return `
      <div class="entry">
        <div class="t"><span>Week ${e.week} — ${e.type}</span>${right}</div>
        <div><strong>${e.name}</strong><div class="muted small" style="margin-top:6px">${(e.notes||"")}${extra}</div></div>
      </div>
    `;
  }).join("");
}

el("btnStart").addEventListener("click", ()=>{
  const cid = countrySelect.value;
  const c = COUNTRIES.find(x=>x.id===cid);
  if(!c) return;

  S = defaultState((buildIdInput.value || "v0.1.0").trim());
  S.countryId = cid;

  for(const perk of c.perks){
    if(perk.includes("starting budget")){
      const m = perk.match(/\+\$(\d+)/);
      if(m) S.budget += Number(m[1]);
    }
    if(perk.includes("reputation")){
      const m = perk.match(/\+(\d+) reputation/);
      if(m) S.rep += Number(m[1]);
    }
    if(perk.includes("+10 technique")) S.technique += 10;
    if(perk.includes("+14 palate")) S.palate += 14;
    if(perk.includes("+10 creativity")) S.creativity += 10;
    if(perk.includes("+12 consistency")) S.consistency += 12;
    if(perk.includes("+6 composure")) S.composure += 6;
    if(perk.includes("+1 sponsor interest")) S.sponsorInterest += 1;
    if(perk.includes("+2 sponsor interest")) S.sponsorInterest += 2;
  }

  S.started = true;
  log(S, "event", "Season Begins", snap(S), snap(S), null, "Country: " + c.name);
  saveState(S);
  render();
});

el("btnNew").addEventListener("click", ()=>{
  if(confirm("Reset season?")){
    S = defaultState((buildIdInput.value || "v0.1.0").trim());
    saveState(S);
    render();
  }
});

el("btnSave").addEventListener("click", ()=>{
  saveState(S);
  alert("Saved locally.");
});

el("btnExport").addEventListener("click", ()=> exportTelemetry(S));

el("btnReset").addEventListener("click", ()=>{
  if(confirm("Clear local save?")){
    resetLocal();
    S = defaultState((buildIdInput.value || "v0.1.0").trim());
    initCountries();
    render();
  }
});

initCountries();
buildIdInput.value = S.buildId || "v0.1.0";
render();
