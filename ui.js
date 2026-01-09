import { COUNTRIES } from "./data_countries.js";
import { COMPETITORS } from "./data_competitors.js";
import { BACKSTORIES, WEEK_NARRATIVES, COMPETITION_INTROS, ENDING_NARRATIVES } from "./data_narrative.js";
import { COMP_WEEKS, ACTIONS, FUND_TIERS, money, countryFor, storyNodeForWeek, applyStoryChoice, parts, computeMenu, applyMenuToState, menuTestCook, takeAction, runCompetition, nextWeek as systemNextWeek, applyPerks, chooseRival, startFundraising, seasonReport } from "./systems.js";
import { defaultState, loadState, saveState, resetLocal } from "./state.js";
import { log, snap, exportTelemetry } from "./telemetry.js";

let S = loadState() || defaultState("v0.4.0");
let currentScreen = "title";
let selectedCountry = null;

const screens = {
  title: document.getElementById("titleScreen"),
  charCreation: document.getElementById("charCreation"),
  backstory: document.getElementById("backstory"),
  weekIntro: document.getElementById("weekIntro"),
  game: document.getElementById("gameScreen"),
  compResults: document.getElementById("compResults"),
  seasonEnd: document.getElementById("seasonEnd")
};

const el = (id) => document.getElementById(id);

// SCREEN TRANSITIONS
function showScreen(screenName) {
  const current = screens[currentScreen];
  const next = screens[screenName];
  
  if (current) {
    current.classList.add("exiting");
    setTimeout(() => {
      current.classList.remove("active", "exiting");
    }, 300);
  }
  
  setTimeout(() => {
    next.classList.add("active");
    currentScreen = screenName;
  }, 300);
}

// TITLE SCREEN
el("btnNewGame").addEventListener("click", () => {
  S = defaultState("v0.4.0");
  saveState(S);
  showScreen("charCreation");
  renderCountrySelection();
});

el("btnContinue").addEventListener("click", () => {
  const saved = loadState();
  if (saved && saved.started) {
    S = saved;
    showScreen("game");
    renderGame();
  } else {
    alert("No saved game found. Start a new game instead.");
  }
});

el("btnAbout").addEventListener("click", () => {
  alert("The Final Season v0.4.0\n\nA narrative culinary strategy game.\n\nManage your chef through 12 weeks of competition, balancing technique, creativity, fatigue, and rival pressure.");
});

// CHARACTER CREATION
function renderCountrySelection() {
  const grid = el("countryGrid");
  grid.innerHTML = COUNTRIES.map(c => {
    const story = BACKSTORIES[c.id];
    const perks = Object.entries(c.perks).slice(0, 3).map(([k, v]) => 
      `<span class="perk-tag">${k}: +${v}</span>`
    ).join("");
    
    return `
      <div class="country-card" data-country="${c.id}">
        <div class="country-card-content">
          <div class="country-flag">${story.flag}</div>
          <div class="country-name">${c.name}</div>
          <div class="country-tagline">${c.tagline}</div>
          <div class="country-perks">${perks}</div>
        </div>
      </div>
    `;
  }).join("");
  
  grid.querySelectorAll(".country-card").forEach(card => {
    card.addEventListener("click", () => {
      selectedCountry = card.getAttribute("data-country");
      showBackstory(selectedCountry);
    });
  });
}

function showBackstory(countryId) {
  const country = COUNTRIES.find(c => c.id === countryId);
  const story = BACKSTORIES[countryId];
  
  el("backstoryTitle").textContent = country.name;
  el("backstoryContent").innerHTML = `
    <p class="story-text">${story.intro.split('\n\n').join('</p><p class="story-text">')}</p>
    <div class="hr"></div>
    <p class="story-text"><strong>${story.rival}</strong></p>
  `;
  
  showScreen("backstory");
}

el("btnStartJourney").addEventListener("click", () => {
  startSeason(selectedCountry);
});

function startSeason(countryId) {
  const country = COUNTRIES.find(c => c.id === countryId);
  S = defaultState("v0.4.0");
  S.countryId = countryId;
  S.started = true;
  
  // Setup rival
  const rival = chooseRival(S);
  if (rival) {
    S.rival = { id: rival.id, name: rival.name, countryId: rival.countryId, score: 0, wins: 0 };
  }
  
  // Setup starting menu
  const menuDefaults = {
    "AU-WA": { name: "Ocean to Red Dirt", proteinId: "lamb", techniqueId: "roast", sauceId: "buttermilk", garnishId: "knife_cuts", dessertId: "native" },
    "JP": { name: "Precision Minimal", proteinId: "fish", techniqueId: "sousvide", sauceId: "dashi", garnishId: "pickles", dessertId: "citrus" },
    "FR": { name: "Classic Structure", proteinId: "duck", techniqueId: "roast", sauceId: "beurreblanc", garnishId: "tuille", dessertId: "choc" },
    "IT": { name: "Simple Depth", proteinId: "pork", techniqueId: "braise", sauceId: "jus", garnishId: "herb_oil", dessertId: "citrus" },
    "US": { name: "Big Swing", proteinId: "octopus", techniqueId: "fry", sauceId: "namjim", garnishId: "tuille", dessertId: "tea" },
    "TH": { name: "Thai Harmony", proteinId: "fish", techniqueId: "fry", sauceId: "namjim", garnishId: "pickles", dessertId: "citrus" }
  };
  
  Object.assign(S.menu, menuDefaults[countryId] || {});
  
  applyPerks(S);
  applyMenuToState(S);
  log(S, "event", "Season Begins", snap(S), snap(S), { country: country.name, rival: S.rival?.name || null }, "");
  saveState(S);
  
  showWeekIntro();
}

// WEEK INTRO
function showWeekIntro() {
  const weekNum = S.week;
  const narrative = WEEK_NARRATIVES[weekNum];
  const comp = COMP_WEEKS[weekNum];
  
  el("weekTitle").textContent = narrative?.title || `Week ${weekNum}`;
  el("weekProgressBar").style.width = `${(weekNum / 12) * 100}%`;
  
  let content = `<p class="story-text">${narrative?.universal || "The competition continues."}</p>`;
  
  if (comp) {
    const compIntro = COMPETITION_INTROS[weekNum];
    content += `<div class="hr"></div>`;
    content += `<h3 style="margin-bottom:12px">${comp.name}</h3>`;
    content += `<p class="story-text">${compIntro?.narrative || ""}</p>`;
    content += `<p class="story-text"><em>${comp.emphasis}</em></p>`;
  }
  
  el("weekNarrative").innerHTML = content;
  
  // Show key stats
  el("weekStats").innerHTML = `
    <div class="week-stat">
      <div class="week-stat-label">Budget</div>
      <div class="week-stat-value ${S.budget < 200 ? 'warn' : 'good'}">${money(S.budget)}</div>
    </div>
    <div class="week-stat">
      <div class="week-stat-label">Reputation</div>
      <div class="week-stat-value ${S.rep >= 20 ? 'good' : 'warn'}">${Math.round(S.rep)}</div>
    </div>
    <div class="week-stat">
      <div class="week-stat-label">Fatigue</div>
      <div class="week-stat-value ${S.fatigue >= 60 ? 'bad' : S.fatigue >= 40 ? 'warn' : 'good'}">${Math.round(S.fatigue)}</div>
    </div>
    <div class="week-stat">
      <div class="week-stat-label">Morale</div>
      <div class="week-stat-value ${S.morale >= 70 ? 'good' : S.morale <= 35 ? 'bad' : 'warn'}">${Math.round(S.morale)}</div>
    </div>
  `;
  
  showScreen("weekIntro");
}

el("btnEnterWeek").addEventListener("click", () => {
  showScreen("game");
  renderGame();
});

// GAME SCREEN
function renderGame() {
  el("headerWeek").textContent = `Week ${S.week} of ${S.weeksTotal}`;
  el("headerCountry").textContent = countryFor(S)?.name || "";
  
  renderKPIs();
  renderRecentLog();
  
  // Show comp tab if it's a comp week
  const isCompWeek = !!COMP_WEEKS[S.week];
  el("tabComp").style.display = isCompWeek ? "inline-flex" : "none";
  
  showTab("story");
}

let currentTab = "story";

function showTab(tab) {
  currentTab = tab;
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  el("tab" + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add("active");
  
  if (tab === "story") renderStoryTab();
  if (tab === "actions") renderActionsTab();
  if (tab === "menu") renderMenuTab();
  if (tab === "comp") renderCompTab();
}

el("tabStory").addEventListener("click", () => showTab("story"));
el("tabActions").addEventListener("click", () => showTab("actions"));
el("tabMenu").addEventListener("click", () => showTab("menu"));
el("tabComp").addEventListener("click", () => showTab("comp"));

function renderStoryTab() {
  const node = storyNodeForWeek(S);
  if (!node) {
    el("mainContent").innerHTML = `
      <div class="panel">
        <h2>No Story This Week</h2>
        <p class="muted">Focus on training and preparation.</p>
      </div>
    `;
    return;
  }
  
  const chips = Object.keys(S.flags || {}).filter(k => S.flags[k]).slice(0, 8).map(k => 
    `<span class="chip">${k}</span>`
  ).join("");
  
  el("mainContent").innerHTML = `
    <div class="panel">
      <div class="row between">
        <h2>${node.title}</h2>
        <div class="meta">${chips}</div>
      </div>
      <p style="margin:12px 0;line-height:1.7">${node.body}</p>
    </div>
    <h3 style="margin-bottom:12px">Choose Your Path</h3>
    <div class="choices">
      ${node.choices.map((ch, i) => `
        <div class="choice" data-choice="${i}">
          <h3>${ch.label}</h3>
          <p>${ch.desc}</p>
          <div class="meta">
            ${Object.entries(ch.effects || {}).slice(0, 5).map(([k, v]) => 
              `<span class="chip">${k} ${v >= 0 ? '+' : ''}${v}</span>`
            ).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;
  
  el("mainContent").querySelectorAll(".choice").forEach(node => {
    node.addEventListener("click", () => {
      applyStoryChoice(S, Number(node.getAttribute("data-choice")));
      saveState(S);
      renderGame();
    });
  });
}

function renderActionsTab() {
  const actionDisabled = S.lastActionWeek === S.week;
  const oblig = (S.obligations || []).filter(o => !o.done);
  
  el("mainContent").innerHTML = `
    <div class="panel">
      <div class="row between">
        <h2>Weekly Actions</h2>
        <div class="meta">
          ${actionDisabled ? '<span class="chip warn">Action used</span>' : '<span class="chip good">Action available</span>'}
          ${oblig.length > 0 ? `<span class="chip warn">${oblig.length} obligations</span>` : ''}
        </div>
      </div>
      <p class="muted small">Choose one action per week. Plan carefully.</p>
    </div>
    
    <div class="choices">
      ${ACTIONS.map(a => `
        <div class="choice ${actionDisabled ? 'loading' : ''}" data-action="${a.id}">
          <h3>${a.name}</h3>
          <p>${a.desc}</p>
        </div>
      `).join("")}
      <div class="choice ${actionDisabled ? 'loading' : ''}" data-action="testcook">
        <h3>Menu Test Cook</h3>
        <p>Spend budget + fatigue to reduce competition variance.</p>
      </div>
    </div>
    
    <div class="panel mt-2">
      <button class="btn-primary" id="btnAdvanceWeek">Advance to Next Week</button>
    </div>
  `;
  
  if (!actionDisabled) {
    el("mainContent").querySelectorAll(".choice[data-action]").forEach(node => {
      node.addEventListener("click", () => {
        const actionId = node.getAttribute("data-action");
        if (actionId === "testcook") {
          menuTestCook(S);
          S.lastActionWeek = S.week;
        } else {
          const res = takeAction(S, actionId);
          if (!res.ok) alert(res.message);
        }
        saveState(S);
        renderGame();
      });
    });
  }
  
  el("btnAdvanceWeek").addEventListener("click", advanceWeek);
}

function renderMenuTab() {
  const p = parts();
  const calc = computeMenu(S.menu, S.flags);
  const list = COMPETITORS.map(c => `<option value="${c.id}">${c.name} (${c.countryId})</option>`).join("");
  
  el("mainContent").innerHTML = `
    <div class="panel">
      <div class="row between">
        <h2>${S.menu.name}</h2>
        <div class="meta">
          <span class="chip">Cost: ${money(calc.cost)}</span>
          <span class="chip">Prep: ${calc.prep}</span>
          <span class="chip">Wow: ${calc.wow}</span>
          <span class="chip ${calc.risk >= 20 ? 'warn' : ''}">Risk: ${calc.risk}</span>
        </div>
      </div>
    </div>
    
    <div class="panel">
      <h3 class="mb-1">Import Signature</h3>
      <div class="row" style="margin-bottom:12px">
        <select id="sigChef" class="input" style="flex:1">${list}</select>
        <select id="sigDish" class="input" style="flex:1"></select>
        <button id="btnImport" class="btn-primary">Import</button>
      </div>
    </div>
    
    <div class="panel">
      <h3 class="mb-1">Menu Components</h3>
      <div class="choices">
        <div class="choice">
          <h3>Protein</h3>
          <select id="proteinSel" class="input" style="width:100%">
            ${p.proteins.map(x => `<option value="${x.id}" ${x.id === S.menu.proteinId ? 'selected' : ''}>${x.name}</option>`).join("")}
          </select>
        </div>
        <div class="choice">
          <h3>Technique</h3>
          <select id="techSel" class="input" style="width:100%">
            ${p.techniques.map(x => `<option value="${x.id}" ${x.id === S.menu.techniqueId ? 'selected' : ''}>${x.name}</option>`).join("")}
          </select>
        </div>
        <div class="choice">
          <h3>Sauce</h3>
          <select id="sauceSel" class="input" style="width:100%">
            ${p.sauces.map(x => `<option value="${x.id}" ${x.id === S.menu.sauceId ? 'selected' : ''}>${x.name}</option>`).join("")}
          </select>
        </div>
        <div class="choice">
          <h3>Garnish</h3>
          <select id="garnSel" class="input" style="width:100%">
            ${p.garnish.map(x => `<option value="${x.id}" ${x.id === S.menu.garnishId ? 'selected' : ''}>${x.name}</option>`).join("")}
          </select>
        </div>
        <div class="choice">
          <h3>Dessert</h3>
          <select id="dessSel" class="input" style="width:100%">
            ${p.dessert.map(x => `<option value="${x.id}" ${x.id === S.menu.dessertId ? 'selected' : ''}>${x.name}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="mt-2">
        <button class="btn-primary" id="btnSaveMenu">Save Menu</button>
      </div>
    </div>
  `;
  
  function refreshSignatures() {
    const chef = COMPETITORS.find(x => x.id === el("sigChef").value);
    el("sigDish").innerHTML = (chef?.signatures || []).map((s, i) => 
      `<option value="${i}">${s.name}</option>`
    ).join("");
  }
  el("sigChef").addEventListener("change", refreshSignatures);
  refreshSignatures();
  
  el("btnImport").addEventListener("click", () => {
    const chef = COMPETITORS.find(x => x.id === el("sigChef").value);
    const idx = Number(el("sigDish").value || 0);
    const s = (chef?.signatures || [])[idx];
    if (s) {
      S.menu.name = s.name;
      S.menu.proteinId = s.proteinId;
      S.menu.techniqueId = s.techniqueId;
      S.menu.sauceId = s.sauceId;
      S.menu.garnishId = s.garnishId;
      S.menu.dessertId = s.dessertId;
      applyMenuToState(S);
      saveState(S);
      renderGame();
    }
  });
  
  el("btnSaveMenu").addEventListener("click", () => {
    S.menu.proteinId = el("proteinSel").value;
    S.menu.techniqueId = el("techSel").value;
    S.menu.sauceId = el("sauceSel").value;
    S.menu.garnishId = el("garnSel").value;
    S.menu.dessertId = el("dessSel").value;
    applyMenuToState(S);
    saveState(S);
    alert("Menu saved!");
    renderGame();
  });
}

function renderCompTab() {
  const comp = COMP_WEEKS[S.week];
  if (!comp) {
    el("mainContent").innerHTML = '<div class="panel"><p>No competition this week.</p></div>';
    return;
  }
  
  const calc = computeMenu(S.menu, S.flags);
  const varianceHint = (S.flags.scouted ? "lower" : "normal") + (S.flags.tested ? " (tested)" : "");
  
  el("mainContent").innerHTML = `
    <div class="panel">
      <h2>${comp.name}</h2>
      <p class="muted">Entry: ${money(comp.entry)} • Prize: ${money(comp.cash)} + ${comp.rep} rep</p>
      <p class="muted small mt-1">Emphasis: ${comp.emphasis}</p>
    </div>
    
    <div class="panel">
      <h3 class="mb-1">Your Menu: ${S.menu.name}</h3>
      <div class="meta">
        <span class="chip">Cost: ${money(calc.cost)}</span>
        <span class="chip">Prep: ${calc.prep}</span>
        <span class="chip">Wow: ${calc.wow}</span>
        <span class="chip">Risk: ${calc.risk}</span>
        <span class="chip">Variance: ${varianceHint}</span>
      </div>
    </div>
    
    <div class="panel">
      <h3 class="mb-1">Competition Plan</h3>
      <div class="row" style="margin-bottom:12px;flex-wrap:wrap">
        <div>
          <label class="muted small">Approach</label>
          <select id="approach" class="input">
            <option value="safe">Safe</option>
            <option value="standard" selected>Standard</option>
            <option value="bold">Bold</option>
          </select>
        </div>
        <div>
          <label class="muted small">Rehearsal</label>
          <select id="rehearsal" class="input">
            <option value="none" selected>None</option>
            <option value="timing">Timing</option>
            <option value="clean">Clean bench</option>
            <option value="taste">Taste calibration</option>
          </select>
        </div>
        <div>
          <label class="muted small">Spend (0-400)</label>
          <input id="spend" class="input" type="number" min="0" max="400" value="0" style="width:100px"/>
        </div>
      </div>
      <button class="btn-primary" id="btnRunComp">Enter Competition</button>
    </div>
  `;
  
  el("btnRunComp").addEventListener("click", () => {
    const plan = {
      approach: el("approach").value,
      rehearsal: el("rehearsal").value,
      spend: Number(el("spend").value || 0)
    };
    const res = runCompetition(S, plan);
    if (!res.ok) {
      alert(res.message);
      return;
    }
    saveState(S);
    showCompResults(res, comp);
  });
}

function showCompResults(res, comp) {
  const icon = res.win ? "🏆" : "📊";
  const title = res.win ? "Victory!" : "Results";
  const titleClass = res.win ? "win" : "loss";
  
  let rivalText = "";
  if (res.rival) {
    const rivalStatus = res.rival.score > res.score ? 
      `<span class="bad">Your rival scored ${res.rival.score} and beat you this round.</span>` :
      `<span class="good">You outscored your rival (${res.rival.score}) this round!</span>`;
    rivalText = `<p class="story-text">${rivalStatus}</p>`;
  }
  
  el("compResultTitle").textContent = comp.name;
  el("compResultContent").innerHTML = `
    <div class="result-icon">${icon}</div>
    <div class="result-title ${titleClass}">${title}</div>
    <div class="result-details">Score: ${res.score} / Target: ${res.target}</div>
    ${rivalText}
    <div class="hr"></div>
    <p class="story-text muted">
      Approach: ${res.plan?.approach || 'standard'} • 
      Rehearsal: ${res.plan?.rehearsal || 'none'} • 
      Spend: ${money(res.plan?.spend || 0)}
    </p>
  `;
  
  showScreen("compResults");
}

el("btnCompContinue").addEventListener("click", () => {
  showScreen("game");
  renderGame();
});

function advanceWeek() {
  systemNextWeek(S);
  saveState(S);
  
  if (S.week > S.weeksTotal) {
    showSeasonEnd();
  } else {
    showWeekIntro();
  }
}

function showSeasonEnd() {
  const report = seasonReport(S);
  let ending;
  
  if (report.winRate >= 75 && report.wins >= 3) {
    ending = ENDING_NARRATIVES.champion;
  } else if (report.winRate >= 50) {
    ending = ENDING_NARRATIVES.strong;
  } else {
    ending = ENDING_NARRATIVES.struggled;
  }
  
  el("seasonEndContent").innerHTML = `
    <h3 class="mb-2">${ending.title}</h3>
    <p class="story-text">${ending.text.split('\n\n').join('</p><p class="story-text">')}</p>
    <div class="hr"></div>
    <div class="result-breakdown">
      <div class="week-stat">
        <div class="week-stat-label">Competitions</div>
        <div class="week-stat-value">${report.compsPlayed}</div>
      </div>
      <div class="week-stat">
        <div class="week-stat-label">Win Rate</div>
        <div class="week-stat-value ${report.winRate >= 75 ? 'good' : report.winRate >= 50 ? 'warn' : 'bad'}">${report.winRate}%</div>
      </div>
      <div class="week-stat">
        <div class="week-stat-label">Avg Score</div>
        <div class="week-stat-value">${report.avgScore}</div>
      </div>
      <div class="week-stat">
        <div class="week-stat-label">Rival Wins</div>
        <div class="week-stat-value ${report.rivalBeats >= 3 ? 'bad' : 'good'}">${report.rivalBeats}</div>
      </div>
    </div>
  `;
  
  showScreen("seasonEnd");
}

el("btnPlayAgain").addEventListener("click", () => {
  resetLocal();
  S = defaultState("v0.4.0");
  saveState(S);
  showScreen("title");
});

el("btnExportFinal").addEventListener("click", () => exportTelemetry(S));

// PAUSE MENU
el("btnMenu").addEventListener("click", () => {
  el("pauseMenu").classList.add("active");
});

el("btnResume").addEventListener("click", () => {
  el("pauseMenu").classList.remove("active");
});

el("btnSaveGame").addEventListener("click", () => {
  saveState(S);
  alert("Game saved!");
});

el("btnExportTelemetry").addEventListener("click", () => {
  exportTelemetry(S);
  el("pauseMenu").classList.remove("active");
});

el("btnHelp").addEventListener("click", () => {
  el("pauseMenu").classList.remove("active");
  el("helpModal").classList.add("active");
  el("helpContent").innerHTML = `
    <div class="panel">
      <h3>Core Tips</h3>
      <ul class="muted small" style="margin-left:20px;line-height:1.8">
        <li>Menu Prep should stay near your Prep KPI</li>
        <li>Scout rival + test cook before competitions</li>
        <li>Manage fatigue or consistency drops</li>
        <li>Clear sponsor obligations on time</li>
      </ul>
    </div>
  `;
});

el("btnCloseHelp").addEventListener("click", () => {
  el("helpModal").classList.remove("active");
});

el("btnQuitToTitle").addEventListener("click", () => {
  if (confirm("Quit to title? Unsaved progress will be lost.")) {
    saveState(S);
    el("pauseMenu").classList.remove("active");
    showScreen("title");
  }
});

// KPIs and Log
function renderKPIs() {
  const kpis = el("kpis");
  const calc = computeMenu(S.menu, S.flags);
  
  kpis.innerHTML = `
    <div class="kpi"><div class="l">Budget</div><div class="v ${S.budget < 200 ? 'warn' : 'good'}">${money(S.budget)}</div></div>
    <div class="kpi"><div class="l">Reputation</div><div class="v ${S.rep >= 20 ? 'good' : 'warn'}">${Math.round(S.rep)}</div></div>
    <div class="kpi"><div class="l">Fatigue</div><div class="v ${S.fatigue >= 60 ? 'bad' : S.fatigue >= 40 ? 'warn' : 'good'}">${Math.round(S.fatigue)}</div></div>
    <div class="kpi"><div class="l">Morale</div><div class="v ${S.morale >= 70 ? 'good' : S.morale <= 35 ? 'bad' : 'warn'}">${Math.round(S.morale)}</div></div>
    <div class="kpi"><div class="l">Technique</div><div class="v">${Math.round(S.technique)}</div></div>
    <div class="kpi"><div class="l">Consistency</div><div class="v">${Math.round(S.consistency)}</div></div>
    <div class="kpi"><div class="l">Menu Prep</div><div class="v ${calc.prep >= 26 ? 'warn' : ''}">${calc.prep}</div></div>
    <div class="kpi"><div class="l">Menu Wow</div><div class="v ${calc.wow >= 35 ? 'good' : ''}">${calc.wow}</div></div>
  `;
}

function renderRecentLog() {
  const log = el("recentLog");
  const recent = (S.telemetry || []).slice(0, 5);
  
  log.innerHTML = recent.map(e => {
    const result = e.type === "competition" ? (e.result?.win ? "WIN" : "LOSS") : "";
    return `<div class="entry"><strong>${e.name}</strong> <span class="muted">${result}</span></div>`;
  }).join("");
}

// INIT
if (S.started && currentScreen === "title") {
  showScreen("game");
  renderGame();
}
