// ui-mobile-optimized.js - Mobile-first UI with full-screen tabs
import { COUNTRIES } from "./data_countries.js";
import { COMPETITORS } from "./data_competitors.js";
import { BACKSTORIES, WEEK_NARRATIVES, COMPETITION_INTROS, ENDING_NARRATIVES } from "./data_narrative.js";
import { COMP_WEEKS, ACTIONS, FUND_TIERS, money, countryFor, storyNodeForWeek, applyStoryChoice, parts, computeMenu, applyMenuToState, menuTestCook, takeAction, runCompetition, nextWeek as systemNextWeek, applyPerks, chooseRival, startFundraising, seasonReport } from "./systems.js";
import { defaultState, loadState, saveState, resetLocal } from "./state.js";
import { log, snap, exportTelemetry } from "./telemetry.js";
import { competitionManager, getCompetitionUIState } from "./competition-manager.js";

let S = loadState() || defaultState("v0.5.4");
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

// ===== MOBILE DETECTION =====
const isMobile = () => window.innerWidth < 768;

// ===== SCREEN TRANSITIONS =====
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

// ===== TITLE SCREEN =====
el("btnNewGame").addEventListener("click", () => {
  S = defaultState("v0.5.4");
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
  alert("The Final Season v0.5.4\n\nA narrative culinary strategy game.\n\nManage your chef through 12 weeks of competition, balancing technique, creativity, fatigue, and rival pressure.");
});

// ===== CHARACTER CREATION =====
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
  S = defaultState("v0.5.4");
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

// ===== WEEK INTRO =====
function showWeekIntro() {
  const weekNum = S.week;
  const narrative = WEEK_NARRATIVES[weekNum];
  const compStatus = getCompetitionUIState(S);
  
  el("weekTitle").textContent = narrative?.title || `Week ${weekNum}`;
  el("weekProgressBar").style.width = `${(weekNum / 12) * 100}%`;
  
  let content = `<p class="story-text">${narrative?.universal || "The competition continues."}</p>`;
  
  if (compStatus.isCompWeek) {
    const comp = compStatus.competition;
    const compIntro = COMPETITION_INTROS[weekNum];
    content += `<div class="hr"></div>`;
    content += `<h3 style="margin-bottom:12px">${comp.name}</h3>`;
    content += `<p class="story-text">${compIntro?.narrative || ""}</p>`;
    content += `<p class="story-text"><em>Emphasis: ${comp.emphasis}</em></p>`;
    
    if (compStatus.hasCompleted) {
      content += `<div class="badge good" style="margin-top:12px">✓ Competition Completed</div>`;
    } else {
      content += `<div class="badge warn" style="margin-top:12px">⚠ Must complete competition to advance</div>`;
    }
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

// ===== GAME SCREEN =====
function renderGame() {
  el("headerWeek").textContent = `Week ${S.week}`;
  el("headerCountry").textContent = countryFor(S)?.name || "";
  
  // Update competition tab visibility
  const compStatus = getCompetitionUIState(S);
  el("tabComp").style.display = compStatus.isCompWeek ? "flex" : "none";
  
  // Show competition indicator if needed
  if (compStatus.isCompWeek && !compStatus.hasCompleted) {
    el("tabComp").classList.add("pulse");
  } else {
    el("tabComp").classList.remove("pulse");
  }
  
  renderSidebar();
  
  // Default to story tab or comp tab if competition week
  const defaultTab = (compStatus.isCompWeek && !compStatus.hasCompleted) ? "comp" : "story";
  showTab(defaultTab);
}

let currentTab = "story";

function showTab(tab) {
  currentTab = tab;
  
  // Update tab buttons
  document.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"));
  const tabBtn = el("tab" + tab.charAt(0).toUpperCase() + tab.slice(1));
  if (tabBtn) tabBtn.classList.add("active");
  
  // Hide sidebar on mobile when viewing content
  if (isMobile()) {
    el("sidebar").classList.remove("show");
  }
  
  // Render tab content
  if (tab === "story") renderStoryTab();
  if (tab === "actions") renderActionsTab();
  if (tab === "menu") renderMenuTab();
  if (tab === "comp") renderCompTab();
  if (tab === "stats") renderStatsTab();
}

// Tab button handlers
el("tabStory").addEventListener("click", () => showTab("story"));
el("tabActions").addEventListener("click", () => showTab("actions"));
el("tabMenu").addEventListener("click", () => showTab("menu"));
el("tabComp").addEventListener("click", () => showTab("comp"));
el("tabStats").addEventListener("click", () => showTab("stats"));

// Mobile menu toggle
el("btnMobileMenu")?.addEventListener("click", () => {
  el("sidebar").classList.toggle("show");
});

function renderSidebar() {
  const calc = computeMenu(S.menu, S.flags);
  
  el("sidebarContent").innerHTML = `
    <div class="sidebar-section">
      <h3>Resources</h3>
      <div class="stat-grid">
        <div class="stat-item">
          <span class="stat-label">Budget</span>
          <span class="stat-value ${S.budget < 200 ? 'warn' : 'good'}">${money(S.budget)}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Rep</span>
          <span class="stat-value ${S.rep >= 20 ? 'good' : 'warn'}">${Math.round(S.rep)}</span>
        </div>
      </div>
    </div>
    
    <div class="sidebar-section">
      <h3>Condition</h3>
      <div class="stat-grid">
        <div class="stat-item">
          <span class="stat-label">Fatigue</span>
          <span class="stat-value ${S.fatigue >= 60 ? 'bad' : S.fatigue >= 40 ? 'warn' : 'good'}">${Math.round(S.fatigue)}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Morale</span>
          <span class="stat-value ${S.morale >= 70 ? 'good' : S.morale <= 35 ? 'bad' : 'warn'}">${Math.round(S.morale)}</span>
        </div>
      </div>
    </div>
    
    <div class="sidebar-section">
      <h3>Skills</h3>
      <div class="stat-list">
        <div class="stat-bar">
          <span class="stat-label">Technique</span>
          <div class="bar"><div class="bar-fill" style="width:${S.technique}%"></div></div>
          <span class="stat-value">${Math.round(S.technique)}</span>
        </div>
        <div class="stat-bar">
          <span class="stat-label">Palate</span>
          <div class="bar"><div class="bar-fill" style="width:${S.palate}%"></div></div>
          <span class="stat-value">${Math.round(S.palate)}</span>
        </div>
        <div class="stat-bar">
          <span class="stat-label">Consistency</span>
          <div class="bar"><div class="bar-fill" style="width:${S.consistency}%"></div></div>
          <span class="stat-value">${Math.round(S.consistency)}</span>
        </div>
      </div>
    </div>
    
    <div class="sidebar-section">
      <h3>Menu</h3>
      <div class="stat-grid">
        <div class="stat-item">
          <span class="stat-label">Prep</span>
          <span class="stat-value ${calc.prep >= 26 ? 'warn' : ''}">${calc.prep}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Wow</span>
          <span class="stat-value ${calc.wow >= 35 ? 'good' : ''}">${calc.wow}</span>
        </div>
      </div>
    </div>
  `;
}

function renderStatsTab() {
  const calc = computeMenu(S.menu, S.flags);
  const recent = (S.telemetry || []).slice(0, 10);
  
  el("mainContent").innerHTML = `
    <div class="fullscreen-tab">
      <h2>Your Progress</h2>
      
      <div class="stat-card">
        <h3>Resources</h3>
        <div class="stat-grid-large">
          <div class="stat-box">
            <div class="stat-label">Budget</div>
            <div class="stat-value ${S.budget < 200 ? 'warn' : 'good'}">${money(S.budget)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Reputation</div>
            <div class="stat-value ${S.rep >= 20 ? 'good' : 'warn'}">${Math.round(S.rep)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Sponsor Interest</div>
            <div class="stat-value">${Math.round(S.sponsorInterest)}</div>
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <h3>Condition</h3>
        <div class="stat-grid-large">
          <div class="stat-box">
            <div class="stat-label">Fatigue</div>
            <div class="stat-value ${S.fatigue >= 60 ? 'bad' : S.fatigue >= 40 ? 'warn' : 'good'}">${Math.round(S.fatigue)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Morale</div>
            <div class="stat-value ${S.morale >= 70 ? 'good' : S.morale <= 35 ? 'bad' : 'warn'}">${Math.round(S.morale)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Risk</div>
            <div class="stat-value ${S.risk >= 25 ? 'warn' : 'good'}">${Math.round(S.risk)}</div>
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <h3>Core Skills</h3>
        <div class="stat-bars">
          <div class="stat-bar-item">
            <div class="stat-bar-label">
              <span>Technique</span>
              <span>${Math.round(S.technique)}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${Math.min(100, S.technique)}%"></div>
            </div>
          </div>
          <div class="stat-bar-item">
            <div class="stat-bar-label">
              <span>Palate</span>
              <span>${Math.round(S.palate)}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${Math.min(100, S.palate)}%"></div>
            </div>
          </div>
          <div class="stat-bar-item">
            <div class="stat-bar-label">
              <span>Creativity</span>
              <span>${Math.round(S.creativity)}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${Math.min(100, S.creativity)}%"></div>
            </div>
          </div>
          <div class="stat-bar-item">
            <div class="stat-bar-label">
              <span>Cleanliness</span>
              <span>${Math.round(S.cleanliness)}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${Math.min(100, S.cleanliness)}%"></div>
            </div>
          </div>
          <div class="stat-bar-item">
            <div class="stat-bar-label">
              <span>Consistency</span>
              <span>${Math.round(S.consistency)}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${Math.min(100, S.consistency)}%"></div>
            </div>
          </div>
          <div class="stat-bar-item">
            <div class="stat-bar-label">
              <span>Composure</span>
              <span>${Math.round(S.composure)}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${Math.min(100, S.composure)}%"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <h3>Menu Stats</h3>
        <div class="stat-grid-large">
          <div class="stat-box">
            <div class="stat-label">Cost</div>
            <div class="stat-value">${money(calc.cost)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Prep Load</div>
            <div class="stat-value ${calc.prep >= 26 ? 'warn' : ''}">${calc.prep}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Wow Factor</div>
            <div class="stat-value ${calc.wow >= 35 ? 'good' : ''}">${calc.wow}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Risk Level</div>
            <div class="stat-value ${calc.risk >= 20 ? 'warn' : ''}">${calc.risk}</div>
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <h3>Recent Activity</h3>
        <div class="activity-log">
          ${recent.map(e => {
            const result = e.type === "competition" ? (e.result?.win ? "✓ WIN" : "✗ LOSS") : "";
            const resultClass = e.type === "competition" ? (e.result?.win ? "good" : "bad") : "";
            return `
              <div class="log-entry">
                <strong>${e.name}</strong>
                ${result ? `<span class="${resultClass}">${result}</span>` : ''}
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderStoryTab() {
  const node = storyNodeForWeek(S);
  if (!node) {
    el("mainContent").innerHTML = `
      <div class="fullscreen-tab">
        <div class="empty-state">
          <h2>No Story This Week</h2>
          <p>Focus on training and preparation.</p>
        </div>
      </div>
    `;
    return;
  }
  
  const chips = Object.keys(S.flags || {}).filter(k => S.flags[k]).slice(0, 8).map(k => 
    `<span class="chip">${k}</span>`
  ).join("");
  
  el("mainContent").innerHTML = `
    <div class="fullscreen-tab">
      <div class="story-header-section">
        <h2>${node.title}</h2>
        ${chips ? `<div class="story-flags">${chips}</div>` : ''}
      </div>
      
      <div class="story-body">
        <p>${node.body}</p>
      </div>
      
      <h3 class="choice-header">Choose Your Path</h3>
      
      <div class="choice-cards">
        ${node.choices.map((ch, i) => `
          <div class="choice-card" data-choice="${i}">
            <div class="choice-card-header">
              <h4>${ch.label}</h4>
            </div>
            <div class="choice-card-body">
              <p>${ch.desc}</p>
            </div>
            <div class="choice-card-effects">
              ${Object.entries(ch.effects || {}).slice(0, 5).map(([k, v]) => 
                `<span class="effect-chip ${v >= 0 ? 'positive' : 'negative'}">${k} ${v >= 0 ? '+' : ''}${v}</span>`
              ).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
  
  el("mainContent").querySelectorAll(".choice-card").forEach(node => {
    node.addEventListener("click", () => {
      applyStoryChoice(S, Number(node.getAttribute("data-choice")));
      saveState(S);
      renderGame();
    });
  });
}

function renderActionsTab() {
  const compStatus = getCompetitionUIState(S);
  const actionDisabled = S.lastActionWeek === S.week;
  const oblig = (S.obligations || []).filter(o => !o.done);
  
  let advanceButtonText = "Advance to Next Week";
  let advanceButtonDisabled = false;
  let advanceWarning = "";
  
  if (compStatus.isCompWeek && !compStatus.hasCompleted) {
    advanceButtonText = "Complete Competition First";
    advanceButtonDisabled = true;
    advanceWarning = `<div class="warning-banner">⚠ Must complete ${compStatus.competition.name} before advancing</div>`;
  }
  
  el("mainContent").innerHTML = `
    <div class="fullscreen-tab">
      <div class="action-header">
        <h2>Weekly Actions</h2>
        <div class="action-status">
          ${actionDisabled 
            ? '<span class="status-badge warn">Action Used</span>' 
            : '<span class="status-badge good">Action Available</span>'}
          ${oblig.length > 0 ? `<span class="status-badge warn">${oblig.length} Obligations</span>` : ''}
        </div>
      </div>
      
      <p class="section-description">Choose one action per week. Plan carefully.</p>
      
      <div class="action-cards">
        ${ACTIONS.map(a => `
          <div class="action-card ${actionDisabled ? 'disabled' : ''}" data-action="${a.id}">
            <h3>${a.name}</h3>
            <p>${a.desc}</p>
          </div>
        `).join("")}
        <div class="action-card ${actionDisabled ? 'disabled' : ''}" data-action="testcook">
          <h3>Menu Test Cook</h3>
          <p>Spend budget + fatigue to reduce competition variance.</p>
        </div>
      </div>
      
      <div class="action-footer">
        ${advanceWarning}
        <button class="btn-primary btn-large ${advanceButtonDisabled ? 'disabled' : ''}" 
                id="btnAdvanceWeek" 
                ${advanceButtonDisabled ? 'disabled' : ''}>
          ${advanceButtonText}
        </button>
      </div>
    </div>
  `;
  
  if (!actionDisabled) {
    el("mainContent").querySelectorAll(".action-card[data-action]").forEach(node => {
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
  
  const advanceBtn = el("btnAdvanceWeek");
  if (advanceBtn && !advanceButtonDisabled) {
    advanceBtn.addEventListener("click", advanceWeek);
  }
}

function renderMenuTab() {
  const p = parts();
  const calc = computeMenu(S.menu, S.flags);
  
  el("mainContent").innerHTML = `
    <div class="fullscreen-tab">
      <div class="menu-header">
        <h2>${S.menu.name}</h2>
        <div class="menu-stats-row">
          <span class="menu-stat">Cost: ${money(calc.cost)}</span>
          <span class="menu-stat">Prep: ${calc.prep}</span>
          <span class="menu-stat">Wow: ${calc.wow}</span>
          <span class="menu-stat ${calc.risk >= 20 ? 'warn' : ''}">Risk: ${calc.risk}</span>
        </div>
      </div>
      
      <div class="menu-section">
        <h3>Menu Components</h3>
        
        <div class="menu-component">
          <label>Protein</label>
          <select id="proteinSel" class="select-large">
            ${p.proteins.map(x => `<option value="${x.id}" ${x.id === S.menu.proteinId ? 'selected' : ''}>${x.name}</option>`).join("")}
          </select>
        </div>
        
        <div class="menu-component">
          <label>Technique</label>
          <select id="techSel" class="select-large">
            ${p.techniques.map(x => `<option value="${x.id}" ${x.id === S.menu.techniqueId ? 'selected' : ''}>${x.name}</option>`).join("")}
          </select>
        </div>
        
        <div class="menu-component">
          <label>Sauce</label>
          <select id="sauceSel" class="select-large">
            ${p.sauces.map(x => `<option value="${x.id}" ${x.id === S.menu.sauceId ? 'selected' : ''}>${x.name}</option>`).join("")}
          </select>
        </div>
        
        <div class="menu-component">
          <label>Garnish</label>
          <select id="garnSel" class="select-large">
            ${p.garnish.map(x => `<option value="${x.id}" ${x.id === S.menu.garnishId ? 'selected' : ''}>${x.name}</option>`).join("")}
          </select>
        </div>
        
        <div class="menu-component">
          <label>Dessert</label>
          <select id="dessSel" class="select-large">
            ${p.dessert.map(x => `<option value="${x.id}" ${x.id === S.menu.dessertId ? 'selected' : ''}>${x.name}</option>`).join("")}
          </select>
        </div>
        
        <button class="btn-primary btn-large" id="btnSaveMenu">Save Menu</button>
      </div>
    </div>
  `;
  
  el("btnSaveMenu").addEventListener("click", () => {
    S.menu.proteinId = el("proteinSel").value;
    S.menu.techniqueId = el("techSel").value;
    S.menu.sauceId = el("sauceSel").value;
    S.menu.garnishId = el("garnSel").value;
    S.menu.dessertId = el("dessSel").value;
    applyMenuToState(S);
    saveState(S);
    renderGame();
    
    // Show toast notification
    showToast("Menu saved!");
  });
}

function renderCompTab() {
  const compStatus = getCompetitionUIState(S);
  
  if (!compStatus.isCompWeek) {
    el("mainContent").innerHTML = `
      <div class="fullscreen-tab">
        <div class="empty-state">
          <h2>No Competition This Week</h2>
          <p>Focus on training and preparation.</p>
        </div>
      </div>
    `;
    return;
  }
  
  const comp = compStatus.competition;
  const calc = computeMenu(S.menu, S.flags);
  const readiness = competitionManager.calculateReadiness(S, calc);
  const readinessColor = readiness.level === "ready" ? "good" : readiness.level === "fair" ? "warn" : "bad";
  
  el("mainContent").innerHTML = `
    <div class="fullscreen-tab">
      <div class="comp-header">
        <h2>${comp.name}</h2>
        <p class="comp-details">Entry: ${money(comp.entry)} • Prize: ${money(comp.cash)} + ${comp.rep} rep</p>
        <p class="comp-emphasis">Emphasis: ${comp.emphasis}</p>
      </div>
      
      <div class="readiness-section">
        <h3>Readiness Check</h3>
        <div class="readiness-grid-mobile">
          <div class="readiness-item ${readiness.budget ? 'good' : 'bad'}">
            <span class="readiness-icon">${readiness.budget ? '✓' : '✗'}</span>
            <span class="readiness-label">Budget</span>
            <span class="readiness-value">${money(S.budget)} / ${money(comp.entry)}</span>
          </div>
          <div class="readiness-item ${readiness.fatigue ? 'good' : 'warn'}">
            <span class="readiness-icon">${readiness.fatigue ? '✓' : '⚠'}</span>
            <span class="readiness-label">Fatigue</span>
            <span class="readiness-value">${Math.round(S.fatigue)}</span>
          </div>
          <div class="readiness-item ${readiness.risk ? 'good' : 'warn'}">
            <span class="readiness-icon">${readiness.risk ? '✓' : '⚠'}</span>
            <span class="readiness-label">Risk</span>
            <span class="readiness-value">${Math.round(S.risk)}</span>
          </div>
          <div class="readiness-item ${readiness.menuPrep ? 'good' : 'warn'}">
            <span class="readiness-icon">${readiness.menuPrep ? '✓' : '⚠'}</span>
            <span class="readiness-label">Menu Prep</span>
            <span class="readiness-value">${calc.prep} / ${S.prep}</span>
          </div>
          <div class="readiness-item ${readiness.scouted ? 'good' : 'muted'}">
            <span class="readiness-icon">${readiness.scouted ? '✓' : '○'}</span>
            <span class="readiness-label">Scouted</span>
            <span class="readiness-value">${readiness.scouted ? 'Yes' : 'No'}</span>
          </div>
          <div class="readiness-item ${readiness.tested ? 'good' : 'muted'}">
            <span class="readiness-icon">${readiness.tested ? '✓' : '○'}</span>
            <span class="readiness-label">Tested</span>
            <span class="readiness-value">${readiness.tested ? 'Yes' : 'No'}</span>
          </div>
        </div>
        <div class="readiness-summary ${readinessColor}">
          ${readiness.level.toUpperCase()}: ${readiness.score}/${readiness.total} checks passed
        </div>
      </div>
      
      <div class="comp-plan-section">
        <h3>Competition Plan</h3>
        
        <div class="plan-input">
          <label>Approach</label>
          <select id="approach" class="select-large">
            <option value="safe">Safe (+4 bonus, low variance)</option>
            <option value="standard" selected>Standard (balanced)</option>
            <option value="bold">Bold (-2 penalty, high variance)</option>
          </select>
        </div>
        
        <div class="plan-input">
          <label>Rehearsal</label>
          <select id="rehearsal" class="select-large">
            <option value="none" selected>None</option>
            <option value="timing">Timing (+prep, +consistency)</option>
            <option value="clean">Clean bench (+cleanliness, -risk)</option>
            <option value="taste">Taste calibration (+palate, +creativity)</option>
          </select>
        </div>
        
        <div class="plan-input">
          <label>Last-minute Spend (0-${Math.min(400, S.budget)})</label>
          <input id="spend" class="input-large" type="number" min="0" max="${Math.min(400, S.budget)}" value="0"/>
        </div>
        
        <button class="btn-primary btn-large ${!compStatus.canEnter.ok ? 'disabled' : ''}" 
                id="btnRunComp" 
                ${!compStatus.canEnter.ok ? 'disabled' : ''}>
          ${compStatus.canEnter.ok ? 'Enter Competition' : compStatus.canEnter.reason}
        </button>
      </div>
    </div>
  `;
  
  const btnRunComp = el("btnRunComp");
  if (btnRunComp && compStatus.canEnter.ok) {
    btnRunComp.addEventListener("click", () => {
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
}

function showCompResults(res, comp) {
  const icon = res.win ? "🏆" : "📊";
  const title = res.win ? "Victory!" : "Close, but not enough";
  const titleClass = res.win ? "win" : "loss";
  
  let rivalText = "";
  if (res.rival) {
    const rivalStatus = res.rival.score > res.score ? 
      `<span class="bad">Your rival scored ${res.rival.score} and beat you this round.</span>` :
      `<span class="good">You outscored your rival (${res.rival.score}) this round!</span>`;
    rivalText = `<p class="result-text">${rivalStatus}</p>`;
  }
  
  // Show score breakdown
  const breakdown = res.details ? `
    <div class="score-breakdown-mobile">
      <h4>Score Breakdown</h4>
      <div class="breakdown-list">
        <div class="breakdown-row">
          <span class="breakdown-label">Core Skills</span>
          <span class="breakdown-value">${res.details.core}</span>
        </div>
        <div class="breakdown-row">
          <span class="breakdown-label">Menu Impact</span>
          <span class="breakdown-value">${res.details.menuImpact}</span>
        </div>
        <div class="breakdown-row">
          <span class="breakdown-label">Prep Bonus</span>
          <span class="breakdown-value good">+${res.details.prepBonus}</span>
        </div>
        <div class="breakdown-row">
          <span class="breakdown-label">Approach</span>
          <span class="breakdown-value ${res.details.approachMod >= 0 ? 'good' : 'bad'}">${res.details.approachMod >= 0 ? '+' : ''}${res.details.approachMod}</span>
        </div>
        <div class="breakdown-row">
          <span class="breakdown-label">Variance</span>
          <span class="breakdown-value">${res.details.rng >= 0 ? '+' : ''}${res.details.rng}</span>
        </div>
        <div class="breakdown-row">
          <span class="breakdown-label">Penalties</span>
          <span class="breakdown-value bad">-${res.details.totalPenalty}</span>
        </div>
      </div>
    </div>
  ` : '';
  
  el("compResultTitle").textContent = comp.name;
  el("compResultContent").innerHTML = `
    <div class="result-icon">${icon}</div>
    <div class="result-title ${titleClass}">${title}</div>
    <div class="result-score">Score: ${res.score} / ${res.target}</div>
    ${rivalText}
    ${breakdown}
    <div class="result-details">
      <p>Approach: <strong>${res.plan?.approach || 'standard'}</strong></p>
      <p>Rehearsal: <strong>${res.plan?.rehearsal || 'none'}</strong></p>
      <p>Spend: <strong>${money(res.plan?.spend || 0)}</strong></p>
    </div>
  `;
  
  showScreen("compResults");
}

el("btnCompContinue").addEventListener("click", () => {
  showScreen("game");
  renderGame();
});

function advanceWeek() {
  const validation = competitionManager.canAdvanceWeek(S);
  if (!validation.ok) {
    alert(validation.reason);
    return;
  }
  
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
  S = defaultState("v0.5.4");
  saveState(S);
  showScreen("title");
});

el("btnExportFinal").addEventListener("click", () => exportTelemetry(S));

// ===== PAUSE MENU =====
el("btnMenu").addEventListener("click", () => {
  el("pauseMenu").classList.add("active");
});

el("btnResume").addEventListener("click", () => {
  el("pauseMenu").classList.remove("active");
});

el("btnSaveGame").addEventListener("click", () => {
  saveState(S);
  showToast("Game saved!");
});

el("btnExportTelemetry").addEventListener("click", () => {
  exportTelemetry(S);
  el("pauseMenu").classList.remove("active");
});

el("btnQuitToTitle").addEventListener("click", () => {
  if (confirm("Quit to title? Progress will be saved.")) {
    saveState(S);
    el("pauseMenu").classList.remove("active");
    showScreen("title");
  }
});

// ===== TOAST NOTIFICATIONS =====
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ===== INIT =====
if (S.started && currentScreen === "title") {
  showScreen("game");
  renderGame();
}
