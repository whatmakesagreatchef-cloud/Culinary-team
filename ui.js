\
import { COUNTRIES } from "./data_countries.js";
import { COMPETITORS } from "./data_competitors.js";
import { COMP_WEEKS, ACTIONS, FUND_TIERS, money, countryFor, storyNodeForWeek, applyStoryChoice, parts, computeMenu, applyMenuToState, menuTestCook, takeAction, runCompetition, nextWeek, applyPerks, chooseRival, startFundraising, seasonReport } from "./systems.js";
import { defaultState, loadState, saveState, resetLocal } from "./state.js";
import { log, snap, exportTelemetry } from "./telemetry.js";

let S = loadState() || defaultState("v0.3.0");
const el=(id)=>document.getElementById(id);
const title=el("title"), subtitle=el("subtitle"), kpis=el("kpis"), storyBlock=el("storyBlock"), mainBlock=el("mainBlock"), logEl=el("log");
const countrySelect=el("countrySelect"), buildIdInput=el("buildId");
const tabs={dashboard:el("tabDashboard"),menu:el("tabMenu"),comp:el("tabComp"),help:el("tabHelp"),report:el("tabReport")};
const modalBack=el("modalBack"), modalTitle=el("modalTitle"), modalBody=el("modalBody"), modalClose=el("modalClose"), modalNext=el("modalNext"), modalPrev=el("modalPrev");
const TUTORIAL_KEY="culinary_sim_tutorial_done_v2";
let tutStep=0;

const tutorial=[
 {title:"Welcome",body:`<div class="panel"><div class="muted small">Win by managing:</div><div class="meta"><span class="chip">Menu complexity vs prep</span><span class="chip">Fatigue vs consistency</span><span class="chip">Risk vs variance</span><span class="chip">Rival pressure</span><span class="chip">Sponsor obligations</span></div></div><div class="hr"></div><div class="kb">Tip: keep a <b>Build ID</b> and export telemetry to compare changes.</div>`},
 {title:"Core Loop",body:`<div class="panel"><b>Each week:</b><ol class="muted small"><li>Story choice (A/B)</li><li>One weekly action</li><li>Advance week (events + obligations)</li></ol><div class="muted small">Competition weeks 3/6/9/12 unlock the planner.</div></div>`},
 {title:"Menu Lab + Signatures",body:`<div class="panel">Build a menu from parts. It generates <b>Cost</b>, <b>Prep Load</b>, <b>Wow</b>, <b>Menu Risk</b>.<div class="hr"></div>New: import a competitor’s <b>Signature</b> as a template.</div>`},
 {title:"Fundraising",body:`<div class="panel">Run a campaign (Bronze → Platinum). More cash means more <b>obligations</b>. Miss deliverables and you lose rep + gain risk.</div>`},
 {title:"Competition + Rival",body:`<div class="panel">Choose approach (safe/standard/bold), rehearsal, optional spend. Scouting + test cooks reduce variance. You also face a <b>rival</b> with their own signature dishes.</div>`},
 {title:"Report Card",body:`<div class="panel">Open <b>Report</b> to see win rate, avg score, fatigue curve, and your biggest failure cause.</div>`}
];

function openModal(t,html){modalTitle.textContent=t; modalBody.innerHTML=html; modalBack.style.display="flex";}
function closeModal(){modalBack.style.display="none";}
modalClose.addEventListener("click",closeModal);
modalBack.addEventListener("click",(e)=>{if(e.target===modalBack) closeModal();});
modalPrev.addEventListener("click",()=>showTutorial(tutStep-1));
modalNext.addEventListener("click",()=>{if(tutStep===tutorial.length-1){localStorage.setItem(TUTORIAL_KEY,"1"); S.ui.tutorialDone=true; saveState(S); closeModal(); return;} showTutorial(tutStep+1);});
function showTutorial(step=0){
  tutStep=Math.max(0,Math.min(tutorial.length-1,step));
  openModal("Tutorial — "+tutorial[tutStep].title, tutorial[tutStep].body);
  modalPrev.style.display=(tutStep===0)?"none":"inline-flex";
  modalNext.textContent=(tutStep===tutorial.length-1)?"Finish":"Next";
}
function maybeAutoTutorial(){
  const done=localStorage.getItem(TUTORIAL_KEY)==="1" || S.ui?.tutorialDone;
  if(!done) showTutorial(0);
}

function setTab(tab){
  S.ui=S.ui||{}; S.ui.tab=tab;
  Object.keys(tabs).forEach(k=>tabs[k].classList.toggle("active",k===tab));
  saveState(S); render();
}
function initCountries(){
  countrySelect.innerHTML="";
  COUNTRIES.forEach(c=>{const opt=document.createElement("option"); opt.value=c.id; opt.textContent=c.name; countrySelect.appendChild(opt);});
  countrySelect.value=S.countryId || COUNTRIES[0].id;
}
function kpi(label,value,cls=""){return `<div class="kpi"><div class="l">${label}</div><div class="v ${cls}">${value}</div></div>`;}

function renderHeader(){
  S.buildId=(buildIdInput.value || "v0.3.0").trim(); saveState(S);
  const c=countryFor(S);
  if(!S.started){title.textContent="Not started"; subtitle.textContent="Choose a country and press Start.";}
  else {
    const rival = S.rival?.name ? ` • Rival: ${S.rival.name} (${S.rival.wins||0} wins)` : "";
    title.textContent=`Week ${S.week} of ${S.weeksTotal} — ${c.name}`;
    subtitle.textContent=`${c.tagline} • Build: ${S.buildId}${rival}`;
  }
  const progress=S.started ? Math.round(((Math.min(S.week,S.weeksTotal)-1)/S.weeksTotal)*100) : 0;
  el("progressFill").style.width=progress+"%"; el("progressText").textContent=`Season progress: ${progress}%`;
}
function renderKpis(){
  const menuCalc=computeMenu(S.menu,S.flags);
  const budgetCls=S.budget<200?"warn":"good";
  const moraleCls=S.morale>=70?"good":(S.morale<=35?"bad":"warn");
  const fatigueCls=S.fatigue>=70?"bad":(S.fatigue>=40?"warn":"good");
  const oblig=(S.obligations||[]).filter(o=>!o.done).length;
  const obligCls=oblig>=4?"bad":oblig>=2?"warn":"good";
  kpis.innerHTML=[
    kpi("Budget",money(S.budget),budgetCls),
    kpi("Reputation",Math.round(S.rep),S.rep>=25?"good":"warn"),
    kpi("Sponsor",Math.round(S.sponsorInterest),S.sponsorInterest>=2?"good":"warn"),
    kpi("Obligations",oblig,obligCls),
    kpi("Morale",Math.round(S.morale),moraleCls),
    kpi("Technique",Math.round(S.technique)),
    kpi("Palate",Math.round(S.palate)),
    kpi("Creativity",Math.round(S.creativity)),
    kpi("Cleanliness",Math.round(S.cleanliness)),
    kpi("Consistency",Math.round(S.consistency)),
    kpi("Composure",Math.round(S.composure)),
    kpi("Prep",Math.round(S.prep),S.prep>=12?"good":"warn"),
    kpi("Fatigue",Math.round(S.fatigue),fatigueCls),
    kpi("Risk",Math.round(S.risk),S.risk>=70?"bad":S.risk>=40?"warn":"good"),
    kpi("Menu Prep",Math.round(menuCalc.prep),menuCalc.prep>=26?"warn":""),
    kpi("Menu Wow",Math.round(menuCalc.wow),menuCalc.wow>=35?"good":""),
    kpi("Menu Risk",Math.round(menuCalc.risk),menuCalc.risk>=20?"warn":"")
  ].join("");
}
function renderStory(){
  storyBlock.innerHTML="";
  if(!S.started){storyBlock.innerHTML=`<h2>Story</h2><div class="muted small">Start a season to activate story chapters.</div>`; return;}
  const node=storyNodeForWeek(S);
  if(!node){storyBlock.innerHTML=`<h2>Story</h2><div class="muted small">No story chapter this week. Focus on systems.</div>`; return;}
  const chips=Object.keys(S.flags||{}).filter(k=>S.flags[k]).slice(0,12).map(k=>`<span class="chip">${k}</span>`).join("");
  storyBlock.innerHTML=`
    <div class="row between"><h2>${node.title}</h2><div class="meta">${chips}</div></div>
    <div class="muted small">${node.body}</div>
    <div class="choices" style="margin-top:10px">
      ${node.choices.map((ch,i)=>`
        <div class="choice" data-choice="${i}"><h3>${ch.label}</h3><p>${ch.desc}</p>
          <div class="meta">${Object.entries(ch.effects||{}).slice(0,6).map(([k,v])=>`<span class="chip">${k} ${(v>=0?"+":"")}${v}</span>`).join("")}</div>
        </div>`).join("")}
    </div>`;
  storyBlock.querySelectorAll(".choice").forEach(n=>n.addEventListener("click",()=>{applyStoryChoice(S,Number(n.getAttribute("data-choice"))); saveState(S); render();}));
}

function renderDashboard(){
  const comp=COMP_WEEKS[S.week];
  const menuCalc=computeMenu(S.menu,S.flags);
  const actionDisabled=(S.lastActionWeek===S.week)?`<span class="chip warn">action already used</span>`:"";
  const compNotice=comp?`<span class="chip">Competition week: ${comp.name}</span>`:`<span class="chip">Training week</span>`;
  const oblig=(S.obligations||[]).filter(o=>!o.done);
  const obligText=oblig.length?`<span class="chip warn">${oblig.length} deliverables pending</span>`:`<span class="chip good">deliverables clear</span>`;

  mainBlock.innerHTML=`
    <div class="row between"><h2>Dashboard</h2><div class="meta">${compNotice}${actionDisabled}${obligText}</div></div>
    <div class="panel"><div class="row between">
      <div><div class="muted small">Your menu</div><div style="font-weight:950">${S.menu.name}</div>
      <div class="muted small">Cost ${money(menuCalc.cost)} • Prep ${menuCalc.prep} • Wow ${menuCalc.wow} • Menu risk ${menuCalc.risk}</div></div>
      <button class="accent" id="goMenu">Open Menu Lab</button></div></div>

    <div class="hr"></div>
    <div class="row between"><h2>Fundraising</h2><div class="muted small">Cash now vs obligations later.</div></div>
    <div class="panel">
      <div class="row between">
        <div class="row">
          <div><div class="muted small">Tier</div>
            <select id="fundTier" class="input">${FUND_TIERS.map(t=>`<option value="${t.id}">${t.name} (req rep ${t.reqRep}+)</option>`).join("")}</select>
          </div>
          <div><div class="muted small">Promise level</div>
            <select id="promise" class="input"><option value="safe">Safe</option><option value="standard" selected>Standard</option><option value="bold">Bold</option></select>
          </div>
        </div>
        <button id="btnFund" class="green">Run Campaign (uses weekly action)</button>
      </div>
      <div class="muted small" style="margin-top:8px">Tip: use <b>Deliver Sponsor Pack</b> to clear obligations. Overdue deliverables hit <b>rep</b> + add <b>risk</b>.</div>
    </div>

    <div class="hr"></div>
    <div class="row between"><h2>Weekly Action</h2><div class="muted small">One action per week.</div></div>
    <div class="choices" style="margin-top:10px">
      ${ACTIONS.map(a=>`<div class="choice" data-action="${a.id}"><h3>${a.name}</h3><p>${a.desc}</p></div>`).join("")}
      <div class="choice" id="testCook"><h3>Menu Test Cook</h3><p>Spend money + fatigue to reduce variance before comps.</p></div>
    </div>

    <div class="hr"></div>
    <div class="row between"><h2>Advance</h2><div class="muted small">Recovery + random events.</div></div>
    <div class="row" style="margin-top:10px"><button id="btnNext" class="green">Next Week</button>${comp?`<button id="goComp" class="accent">Open Competition Planner</button>`:""}</div>`;

  el("goMenu").addEventListener("click",()=>setTab("menu"));
  if(comp) el("goComp").addEventListener("click",()=>setTab("comp"));

  mainBlock.querySelectorAll(".choice[data-action]").forEach(node=>node.addEventListener("click",()=>{
    const res=takeAction(S,node.getAttribute("data-action")); if(!res.ok) alert(res.message); saveState(S); render();
  }));
  el("testCook").addEventListener("click",()=>{
    if(S.lastActionWeek===S.week){alert("You already used your weekly action. Advance week to continue."); return;}
    menuTestCook(S); S.lastActionWeek=S.week; saveState(S); render();
  });
  el("btnNext").addEventListener("click",()=>{nextWeek(S); saveState(S); render();});

  el("btnFund").addEventListener("click",()=>{
    const tier=el("fundTier").value, promise=el("promise").value;
    const res=startFundraising(S,tier,promise);
    if(!res.ok) alert(res.message);
    saveState(S); render();
  });
}

function optionList(items,selectedId){return items.map(x=>`<option value="${x.id}" ${x.id===selectedId?"selected":""}>${x.name}</option>`).join("");}

function renderMenuLab(){
  const p=parts(); const calc=computeMenu(S.menu,S.flags);
  const list = COMPETITORS.map(c=>`<option value="${c.id}">${c.name} (${c.countryId}) — ${c.archetype}</option>`).join("");
  mainBlock.innerHTML=`
    <div class="row between"><h2>Menu Lab</h2><div class="meta"><span class="chip">Cost ${money(calc.cost)}</span><span class="chip">Prep ${calc.prep}</span><span class="chip">Wow ${calc.wow}</span><span class="chip">Menu risk ${calc.risk}</span></div></div>
    <div class="panel">
      <div class="row between"><div style="flex:1"><div class="muted small">Menu name</div><input id="menuName" class="input" value="${S.menu.name}" style="width:100%"/></div>
      <button id="btnRecalc" class="accent">Recalculate</button></div>

      <div class="hr"></div>
      <div class="row between">
        <div class="row">
          <div><div class="muted small">Import signature</div>
            <select id="sigChef" class="input">${list}</select>
          </div>
          <div><div class="muted small">Signature</div>
            <select id="sigDish" class="input"></select>
          </div>
        </div>
        <button id="btnImport" class="green">Import</button>
      </div>

      <div class="hr"></div>
      <div class="choices">
        <div class="choice"><h3>Protein</h3><select id="proteinSel" class="input" style="width:100%">${optionList(p.proteins,S.menu.proteinId)}</select></div>
        <div class="choice"><h3>Technique</h3><select id="techSel" class="input" style="width:100%">${optionList(p.techniques,S.menu.techniqueId)}</select></div>
        <div class="choice"><h3>Sauce</h3><select id="sauceSel" class="input" style="width:100%">${optionList(p.sauces,S.menu.sauceId)}</select></div>
        <div class="choice"><h3>Garnish</h3><select id="garnSel" class="input" style="width:100%">${optionList(p.garnish,S.menu.garnishId)}</select></div>
        <div class="choice"><h3>Dessert</h3><select id="dessSel" class="input" style="width:100%">${optionList(p.dessert,S.menu.dessertId)}</select></div>
        <div class="choice"><h3>Notes</h3><textarea id="menuNotes" placeholder="Flavour intent, plating checkpoints, risks...">${S.menu.notes||""}</textarea></div>
      </div>

      <div class="hr"></div>
      <div class="row between"><div class="muted small">Tip: keep menu prep ≤ your Prep KPI unless you’ve drilled timing.</div>
      <div class="row"><button id="btnSaveMenu" class="green">Save Menu</button><button id="btnTestCook" class="accent">Test Cook (uses weekly action)</button></div></div>
    </div>

    <div class="hr"></div>
    <div class="panel"><h2>Menu Breakdown</h2><div class="muted small">Synergy: ${calc.breakdown.synergy}</div>
    <div class="meta" style="margin-top:8px"><span class="chip">${calc.breakdown.protein.name}</span><span class="chip">${calc.breakdown.technique.name}</span><span class="chip">${calc.breakdown.sauce.name}</span><span class="chip">${calc.breakdown.garnish.name}</span><span class="chip">${calc.breakdown.dessert.name}</span></div></div>`;

  function pullMenu(){
    S.menu.name=el("menuName").value.trim()||"Untitled Menu";
    S.menu.notes=el("menuNotes").value||"";
    S.menu.proteinId=el("proteinSel").value;
    S.menu.techniqueId=el("techSel").value;
    S.menu.sauceId=el("sauceSel").value;
    S.menu.garnishId=el("garnSel").value;
    S.menu.dessertId=el("dessSel").value;
  }

  function refreshSignatureList(){
    const chefId=el("sigChef").value;
    const chef=COMPETITORS.find(x=>x.id===chefId);
    const sig=el("sigDish");
    sig.innerHTML=(chef?.signatures||[]).map((s,i)=>`<option value="${i}">${s.name}</option>`).join("");
  }
  el("sigChef").addEventListener("change",refreshSignatureList);
  refreshSignatureList();

  el("btnImport").addEventListener("click",()=>{
    const chef=COMPETITORS.find(x=>x.id===el("sigChef").value);
    const idx=Number(el("sigDish").value||0);
    const s=(chef?.signatures||[])[idx];
    if(!s) return;
    S.menu.name=s.name;
    S.menu.proteinId=s.proteinId; S.menu.techniqueId=s.techniqueId; S.menu.sauceId=s.sauceId; S.menu.garnishId=s.garnishId; S.menu.dessertId=s.dessertId;
    applyMenuToState(S); saveState(S); render();
  });

  el("btnRecalc").addEventListener("click",()=>{pullMenu(); applyMenuToState(S); saveState(S); render();});
  el("btnSaveMenu").addEventListener("click",()=>{pullMenu(); applyMenuToState(S); saveState(S); alert("Menu saved."); render();});
  el("btnTestCook").addEventListener("click",()=>{
    if(S.lastActionWeek===S.week){alert("You already used your weekly action. Advance week to continue."); return;}
    pullMenu(); menuTestCook(S); S.lastActionWeek=S.week; saveState(S); alert("Test cook logged."); render();
  });
}

function renderCompetition(){
  const comp=COMP_WEEKS[S.week];
  if(!S.started){mainBlock.innerHTML=`<h2>Competition</h2><div class="muted small">Start a season first.</div>`; return;}
  if(!comp){mainBlock.innerHTML=`<h2>Competition</h2><div class="muted small">No competition this week. Next comps are weeks 3/6/9/12.</div>`; return;}
  const calc=computeMenu(S.menu,S.flags);
  const varianceHint=(S.flags.scouted?"lower":"normal")+(S.flags.tested?" (tested)":"");
  const rival = S.rival?.name ? `<span class="chip">Rival: ${S.rival.name} • Rival wins: ${S.rival.wins||0}</span>` : "";
  mainBlock.innerHTML=`
    <div class="row between"><h2>${comp.name} — Planner</h2><div class="meta"><span class="chip">Entry ${money(comp.entry)}</span><span class="chip">Reward ${money(comp.cash)} +${comp.rep} rep</span><span class="chip">Emphasis: ${comp.emphasis}</span>${rival}</div></div>
    <div class="panel"><div class="row between"><div>
      <div style="font-weight:950">${S.menu.name}</div>
      <div class="muted small">Menu cost ${money(calc.cost)} • Menu prep ${calc.prep} • Wow ${calc.wow} • Menu risk ${calc.risk}</div>
      <div class="muted small">Variance: <b>${varianceHint}</b> • Tip: scout + test cook before a comp.</div>
    </div><button id="goMenu2" class="accent">Adjust Menu</button></div></div>
    <div class="hr"></div>
    <div class="panel">
      <div class="row between">
        <div><div class="muted small">Approach</div><select id="approach" class="input"><option value="safe">Safe</option><option value="standard" selected>Standard</option><option value="bold">Bold</option></select></div>
        <div><div class="muted small">Rehearsal</div><select id="rehearsal" class="input"><option value="none" selected>None</option><option value="timing">Timing run-through</option><option value="clean">Clean bench protocol</option><option value="taste">Taste calibration</option></select></div>
        <div><div class="muted small">Optional spend (0–400)</div><input id="spend" class="input" type="number" min="0" max="400" value="0" style="width:120px"/></div>
        <div style="align-self:flex-end"><button id="runComp" class="green">Run Competition</button></div>
      </div>
      <div class="hr"></div>
      <div class="meta"><span class="chip">If menu prep > Prep KPI → timing penalties</span><span class="chip">High fatigue → errors</span><span class="chip">High risk + menu risk → penalties</span></div>
    </div>
    <div class="hr"></div>
    <div id="compResult" class="panel"><div class="muted small">No result yet.</div></div>`;
  el("goMenu2").addEventListener("click",()=>setTab("menu"));
  el("runComp").addEventListener("click",()=>{
    const plan={approach:el("approach").value,rehearsal:el("rehearsal").value,spend:Number(el("spend").value||0)};
    const res=runCompetition(S,plan); if(!res.ok){alert(res.message); return;}
    saveState(S);
    const rivalLine = res.rival ? `<div class="muted small" style="margin-top:6px">Rival: <b>${res.rival.name}</b> scored ${res.rival.score} using “${res.rival.menu.name}”.</div>` : "";
    const rivalry = res.rival ? (res.rival.score>res.score ? `<span class="warn">Rival beat you</span>` : `<span class="good">You beat rival</span>`) : "";
    el("compResult").innerHTML=`<div class="row between"><div style="font-weight:950">Result: ${res.win?`<span class="good">WIN</span>`:`<span class="warn">LOSS</span>`}</div><div class="muted small">Score ${res.score} • Target ${res.target} • ${rivalry}</div></div>
    <div class="muted small" style="margin-top:6px">Plan: ${plan.approach}, rehearsal: ${plan.rehearsal}, spend: ${money(plan.spend)}</div>
    ${rivalLine}
    <div class="meta" style="margin-top:8px"><span class="chip">Export telemetry to compare builds</span><span class="chip">Open Report for summary</span></div>`;
    renderKpis(); renderLog();
  });
}

function renderHelp(){
  const rosterMine = S.countryId ? COMPETITORS.filter(x=>x.countryId===S.countryId) : [];
  const rosterRival = S.rival?.countryId ? COMPETITORS.filter(x=>x.countryId===S.rival.countryId) : [];
  mainBlock.innerHTML=`
    <div class="row between"><h2>Help & Tools</h2><div class="row"><button id="btnTutorial" class="accent">Open Tutorial</button><button id="btnExport2">Export Telemetry</button></div></div>
    <div class="panel"><div class="muted small">Quick tips</div>
      <ul class="muted small">
        <li><b>Menu Prep</b> should stay near/below your <b>Prep</b> KPI.</li>
        <li>Use <b>Test Cook</b> + <b>Scout Rival</b> before comp weeks.</li>
        <li>Fundraising adds <b>obligations</b>. Clear them with <b>Deliver Sponsor Pack</b>.</li>
        <li>If <b>Fatigue</b> > 55, morale/consistency may drop.</li>
      </ul>
      <div class="hr"></div>
      <div class="kb">Build ID idea: <b>v0.3.1-menuSimplify</b> — export telemetry and compare.</div>
    </div>
    <div class="hr"></div>
    <div class="panel"><h2>Competitor Roster</h2>
      <div class="muted small">Use signatures in Menu Lab for templates.</div>
      <div class="hr"></div>
      <div class="muted small"><b>Your country</b></div>
      ${rosterMine.length?`<table class="table">${rosterMine.map(c=>`<tr><td><b>${c.name}</b><div class="muted small">${c.archetype}</div></td><td class="muted small">${c.signatures.map(s=>`• ${s.name}`).join("<br/>")}</td></tr>`).join("")}</table>`:`<div class="muted small">Start a season to see rosters.</div>`}
      <div class="hr"></div>
      <div class="muted small"><b>Rival country</b></div>
      ${rosterRival.length?`<table class="table">${rosterRival.map(c=>`<tr><td><b>${c.name}</b><div class="muted small">${c.archetype}</div></td><td class="muted small">${c.signatures.map(s=>`• ${s.name}`).join("<br/>")}</td></tr>`).join("")}</table>`:`<div class="muted small">Your rival will appear when you start.</div>`}
    </div>`;
  el("btnTutorial").addEventListener("click",()=>showTutorial(0));
  el("btnExport2").addEventListener("click",()=>exportTelemetry(S));
}

function renderReport(){
  if(!S.started){mainBlock.innerHTML=`<h2>Report</h2><div class="muted small">Start a season first.</div>`; return;}
  const rep = seasonReport(S);
  const done = S.week > S.weeksTotal;
  const status = done ? `<span class="chip good">Season complete</span>` : `<span class="chip">In progress</span>`;
  mainBlock.innerHTML=`
    <div class="row between"><h2>Report Card</h2><div class="meta">${status}<span class="chip">Build ${S.buildId}</span></div></div>
    <div class="panel">
      <div class="meta">
        <span class="chip">Comps played: ${rep.compsPlayed}</span>
        <span class="chip">Win rate: ${rep.winRate}% (${rep.wins}-${rep.losses})</span>
        <span class="chip">Avg score: ${rep.avgScore}</span>
        <span class="chip">Best: ${rep.bestScore}</span>
        <span class="chip">Worst: ${rep.worstScore}</span>
        <span class="chip">Rival beat you: ${rep.rivalBeats}x</span>
        <span class="chip">Avg fatigue: ${rep.fatigueAvg}</span>
        <span class="chip">Open obligations: ${rep.obligationsRemaining}</span>
      </div>
      <div class="hr"></div>
      <div class="muted small">Biggest failure cause (losses): <b>${rep.topFailureCause}</b></div>
      <div class="muted small">Use this to iterate: adjust menu prep, reduce risk, or run more rehearsals.</div>
      <div class="hr"></div>
      <div class="row"><button id="btnExport3" class="green">Export Telemetry</button><button id="btnExplain" class="accent">How scoring works</button></div>
    </div>`;
  el("btnExport3").addEventListener("click",()=>exportTelemetry(S));
  el("btnExplain").addEventListener("click",()=>openModal("Scoring overview",`
    <div class="panel">
      <div class="muted small">Score is built from:</div>
      <ul class="muted small">
        <li><b>Core</b>: palate + technique + cleanliness + consistency</li>
        <li><b>Menu impact</b>: wow + creativity</li>
        <li><b>Prep boost</b>: if your Prep KPI beats menu prep</li>
        <li><b>Penalties</b>: fatigue + stacked risk (reduced by composure/consistency)</li>
        <li><b>Variance</b>: reduced by Scout + Test Cook + Safe approach</li>
      </ul>
    </div>`));
}

function renderLog(){
  logEl.innerHTML=(S.telemetry||[]).slice(0,100).map(e=>{
    const right=e.type==="competition"?(e.result?.win?`<span class="good">WIN</span>`:`<span class="warn">LOSS</span>`):`<span class="muted">${e.buildId}</span>`;
    const extra=e.result?.score?` • score ${e.result.score} (target ${e.result.target})`:"";
    const rival = (e.type==="competition" && e.result?.rival)?` • rival ${e.result.rival.name} ${e.result.rival.score}`:"";
    return `<div class="entry"><div class="t"><span>Week ${e.week} — ${e.type}</span>${right}</div><div><strong>${e.name}</strong><div class="muted small" style="margin-top:6px">${(e.notes||"")}${extra}${rival}</div></div></div>`;
  }).join("");
}

function render(){
  renderHeader(); renderKpis(); renderStory();
  const tab=S.ui?.tab||"dashboard";
  Object.keys(tabs).forEach(k=>tabs[k].classList.toggle("active",k===tab));
  tabs.report.style.display = S.started ? "inline-flex" : "none";
  if(tab==="dashboard") renderDashboard();
  if(tab==="menu") renderMenuLab();
  if(tab==="comp") renderCompetition();
  if(tab==="help") renderHelp();
  if(tab==="report") renderReport();
  renderLog();
}

/* start buttons */
el("btnStart").addEventListener("click",()=>{
  const cid=countrySelect.value; const c=COUNTRIES.find(x=>x.id===cid); if(!c) return;
  S=defaultState((buildIdInput.value||"v0.3.0").trim());
  S.countryId=cid; S.started=true;

  const rival = chooseRival(S);
  if(rival){ S.rival={id:rival.id,name:rival.name,countryId:rival.countryId,score:0,wins:0}; }

  if(cid==="AU-WA"){S.menu.name="Ocean to Red Dirt"; S.menu.proteinId="lamb"; S.menu.techniqueId="roast"; S.menu.sauceId="buttermilk"; S.menu.garnishId="knife_cuts"; S.menu.dessertId="native";}
  if(cid==="JP"){S.menu.name="Precision Minimal"; S.menu.proteinId="fish"; S.menu.techniqueId="sousvide"; S.menu.sauceId="dashi"; S.menu.garnishId="pickles"; S.menu.dessertId="citrus";}
  if(cid==="FR"){S.menu.name="Classic Structure"; S.menu.proteinId="duck"; S.menu.techniqueId="roast"; S.menu.sauceId="beurreblanc"; S.menu.garnishId="tuille"; S.menu.dessertId="choc";}
  if(cid==="IT"){S.menu.name="Simple Depth"; S.menu.proteinId="pork"; S.menu.techniqueId="braise"; S.menu.sauceId="jus"; S.menu.garnishId="herb_oil"; S.menu.dessertId="citrus";}
  if(cid==="US"){S.menu.name="Big Swing"; S.menu.proteinId="octopus"; S.menu.techniqueId="fry"; S.menu.sauceId="namjim"; S.menu.garnishId="tuille"; S.menu.dessertId="tea";}
  if(cid==="TH"){S.menu.name="Thai Harmony"; S.menu.proteinId="fish"; S.menu.techniqueId="fry"; S.menu.sauceId="namjim"; S.menu.garnishId="pickles"; S.menu.dessertId="citrus";}

  applyPerks(S); applyMenuToState(S);
  log(S,"event","Season Begins",snap(S),snap(S),{country:c.name,rival:S.rival?.name||null},"");
  saveState(S); render(); maybeAutoTutorial();
});
el("btnNew").addEventListener("click",()=>{if(confirm("Reset season?")){S=defaultState((buildIdInput.value||"v0.3.0").trim()); saveState(S); initCountries(); render();}});
el("btnSave").addEventListener("click",()=>{saveState(S); alert("Saved locally.");});
el("btnExport").addEventListener("click",()=>exportTelemetry(S));
el("btnReset").addEventListener("click",()=>{if(confirm("Clear local save?")){resetLocal(); S=defaultState((buildIdInput.value||"v0.3.0").trim()); initCountries(); render();}});

tabs.dashboard.addEventListener("click",()=>setTab("dashboard"));
tabs.menu.addEventListener("click",()=>setTab("menu"));
tabs.comp.addEventListener("click",()=>setTab("comp"));
tabs.help.addEventListener("click",()=>setTab("help"));
tabs.report.addEventListener("click",()=>setTab("report"));
el("btnTutorialTop").addEventListener("click",()=>showTutorial(0));

initCountries(); buildIdInput.value=S.buildId||"v0.3.0"; render(); if(S.started) maybeAutoTutorial();

