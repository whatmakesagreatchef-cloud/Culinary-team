# 🔧 DEVELOPER GUIDE — The Final Season v0.5.2

Complete guide to understanding, modifying, and extending the game.

## 📚 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Module System](#module-system)
3. [Easy Modifications](#easy-modifications)
4. [Advanced Modifications](#advanced-modifications)
5. [Creating New Content](#creating-new-content)
6. [Testing & Debugging](#testing--debugging)
7. [Best Practices](#best-practices)

---

## 🏗️ Architecture Overview

### Design Philosophy
- **Modular**: Each system in its own file
- **Data-Driven**: Gameplay defined by data files
- **Mobile-First**: Optimized for touch devices
- **No Build Step**: Runs directly in browser
- **No Dependencies**: Vanilla JavaScript only

### Tech Stack
- **HTML5** - Structure
- **CSS3** - Styling (Flexbox, Grid, CSS Variables)
- **JavaScript ES6+** - Logic (Modules, Classes, Arrow Functions)
- **LocalStorage API** - Save game persistence

### File Organization
```
Core System Files (Game Engine)
├── config.js           - Game constants and tuning
├── utils.js            - Reusable utility functions
├── scoring.js          - Competition scoring logic
├── state-manager.js    - Save/load/validation
├── achievements.js     - Achievement system
├── competition-manager.js - Competition flow
├── systems.js          - Core game logic
├── state.js            - Basic state handling
└── telemetry.js        - Event logging

Data Files (Content)
├── data_countries.js   - Country definitions
├── data_competitors.js - Rival chef data
├── data_events.js      - Random events
├── data_menu_parts.js  - Ingredients & components
└── data_narrative.js   - Story text & choices

UI Files (Interface)
├── index.html          - HTML structure
├── styles.css          - Mobile-first CSS
└── ui.js               - UI rendering & events
```

---

## 📦 Module System

### Import/Export Pattern
```javascript
// Exporting (config.js)
export const CONFIG = {
  STARTING_BUDGET: 1000
};

// Importing (systems.js)
import { CONFIG } from "./config.js";
```

### Module Loading Order
1. **config.js** - First (other modules depend on it)
2. **utils.js** - Second (provides helpers)
3. **Data files** - Third (provide content)
4. **System files** - Fourth (use config + data)
5. **ui.js** - Last (orchestrates everything)

### Module Dependencies
```
config.js (no dependencies)
  ↓
utils.js (uses config)
  ↓
scoring.js (uses config, utils)
  ↓
state-manager.js (uses config, utils)
  ↓
achievements.js (uses config, utils)
  ↓
competition-manager.js (uses config, scoring)
  ↓
systems.js (uses all above)
  ↓
ui.js (uses all above)
```

---

## ✏️ Easy Modifications

### 1. Adjust Difficulty (config.js)

#### Make Game Easier
```javascript
export const CONFIG = {
  // Give more starting money
  STARTING_BUDGET: 1500,        // (default: 1000)
  
  // Lower final competition target
  COMP_TARGET_FINAL: 75,        // (default: 78)
  
  // Reduce random events
  EVENT_CHANCE_PER_WEEK: 0.15,  // (default: 0.25)
  
  // Faster fatigue recovery
  FATIGUE_RECOVERY_RATE: 7,     // (default: 5)
  
  // Cheaper actions
  COST_TEST_COOK: 30,           // (default: 50)
  COST_SCOUT: 75,               // (default: 100)
  COST_RECOVERY: 30,            // (default: 50)
};
```

#### Make Game Harder
```javascript
export const CONFIG = {
  // Less starting money
  STARTING_BUDGET: 750,
  
  // Higher targets
  COMP_TARGET_FINAL: 80,
  COMP_TARGET_WEEK3: 72,        // (default: 70)
  
  // More random events
  EVENT_CHANCE_PER_WEEK: 0.4,
  
  // Slower recovery
  FATIGUE_RECOVERY_RATE: 3,
  
  // More expensive actions
  COST_TEST_COOK: 75,
  COST_SCOUT: 150,
};
```

### 2. Change Scoring Balance (scoring.js)

```javascript
// Make technique more important
const SCORING = {
  technique: 0.32,    // Increased from 0.28
  palate: 0.28,       // Decreased from 0.30
  creativity: 0.25,   // Same
  cleanliness: 0.15,  // Decreased from 0.17
};

// Adjust risk penalties
const RISK_PENALTY_THRESHOLD = 20;  // Lower = stricter
const MAX_RISK_PENALTY = -20;       // Higher negative = harsher
```

### 3. Modify Action Effects (systems.js)

Find `ACTIONS` object and adjust:
```javascript
export const ACTIONS = {
  knife_work: {
    id: "knife_work",
    name: "Knife Work",
    desc: "Practice your cuts",
    cost: 0,
    delta: {
      technique: 4,    // Increased from 3
      fatigue: 2       // Same
    }
  },
  // ... other actions
};
```

### 4. Add CSS Styling (styles.css)

#### Change Color Theme
```css
:root {
  --bg: #1a1f2e;        /* Dark blue background */
  --acc: #ff6b6b;       /* Red accent */
  --text: #f1f3f5;      /* Light text */
  --border: #2d3748;    /* Border color */
}
```

#### Adjust Spacing
```css
.action-card {
  padding: 20px;        /* More padding */
  margin-bottom: 16px;  /* More space between cards */
}
```

---

## 🚀 Advanced Modifications

### 1. Add New Stat

#### Step 1: Add to config.js
```javascript
export const CONFIG = {
  STATS: {
    // Existing stats
    technique: { min: 0, max: 100, start: 40 },
    palate: { min: 0, max: 100, start: 35 },
    // New stat
    speed: { min: 0, max: 100, start: 30 }
  }
};
```

#### Step 2: Add to state (state-manager.js)
```javascript
function createDefaultState() {
  return {
    // ... existing stats
    speed: 30,
  };
}
```

#### Step 3: Add to scoring (scoring.js)
```javascript
const SCORING = {
  technique: 0.25,
  palate: 0.25,
  creativity: 0.20,
  cleanliness: 0.15,
  speed: 0.15        // New stat
};
```

#### Step 4: Update UI (ui.js)
```javascript
// Add to stats display
function renderStatsTab() {
  return `
    <div class="stat-item">
      <div class="stat-label">Speed</div>
      <div class="stat-value">${S.speed}</div>
      <div class="stat-bar">
        <div class="stat-bar-fill" style="width:${S.speed}%"></div>
      </div>
    </div>
  `;
}
```

### 2. Create New Action Type

#### Add to systems.js
```javascript
export const ACTIONS = {
  // ... existing actions
  
  meditation: {
    id: "meditation",
    name: "Meditation Session",
    desc: "Clear your mind and focus",
    cost: 0,
    delta: {
      fatigue: -5,      // Reduces fatigue
      creativity: 2,    // Slight creativity boost
      prep: 1          // Better mental preparation
    },
    unlock: (S) => S.week >= 5  // Unlocks week 5+
  }
};
```

### 3. Add Complex Menu Validation

#### In systems.js
```javascript
export function validateMenu(menu, state) {
  const errors = [];
  
  // Check budget
  const totalCost = calculateMenuCost(menu);
  if (totalCost > state.budget) {
    errors.push("Cannot afford this menu");
  }
  
  // Check skill requirements
  const protein = parts.proteins.find(p => p.id === menu.protein);
  if (protein.tech > state.technique) {
    errors.push("Technique too low for this protein");
  }
  
  // Check ingredient compatibility
  if (menu.protein === "fish" && menu.sauce === "tomato") {
    errors.push("Fish + tomato is risky combination");
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

### 4. Create Custom Scoring Algorithm

#### In scoring.js
```javascript
export function calculateCustomScore(state, menu, approach) {
  let score = 0;
  
  // Base from stats
  score += state.technique * 0.3;
  score += state.palate * 0.3;
  score += state.creativity * 0.2;
  score += state.cleanliness * 0.2;
  
  // Menu complexity bonus
  const complexity = calculateMenuComplexity(menu);
  score += complexity * 0.1;
  
  // Consistency bonus (low variance)
  if (state.testCookCount > 2) {
    score += 5;
  }
  
  // Reputation bonus
  score += state.reputation * 0.05;
  
  // Apply approach modifier
  if (approach === "bold") {
    score *= 1.2;  // 20% boost
  }
  
  return Math.min(100, Math.max(0, score));
}
```

---

## 🎨 Creating New Content

### Add New Country

#### 1. data_countries.js
```javascript
export const COUNTRIES = [
  // ... existing countries
  {
    id: "spain",
    name: "Spain",
    tagline: "Passionate Tradition",
    perks: {
      palate: 6,
      creativity: 5,
      technique: 3
    }
  }
];
```

#### 2. data_narrative.js
```javascript
export const BACKSTORIES = {
  // ... existing backstories
  spain: {
    flag: "🇪🇸",
    title: "The Catalonian Maverick",
    intro: "You trained under the masters of Catalan cuisine...",
    scenes: [
      {
        week: 1,
        text: "Your first week in the competition...",
        choices: [
          {
            text: "Focus on traditional techniques",
            delta: { technique: 2 }
          },
          {
            text: "Embrace modern innovation",
            delta: { creativity: 2 }
          }
        ]
      }
    ]
  }
};
```

#### 3. data_competitors.js
```javascript
export const COMPETITORS = {
  // ... existing competitors
  spain: {
    name: "Elena García",
    style: "Bold & Traditional",
    stats: {
      technique: 75,
      palate: 78,
      creativity: 72,
      cleanliness: 70
    }
  }
};
```

### Add New Menu Ingredient

#### data_menu_parts.js
```javascript
export const parts = {
  proteins: [
    // ... existing proteins
    {
      id: "lobster",
      name: "Maine Lobster",
      cost: 450,           // Expensive
      prep: 18,            // High prep time
      tech: 5,             // High technique required
      palate: 5,           // Excellent flavor
      wow: 6,              // Very impressive
      risk: 4,             // Quite risky
      desc: "Premium shellfish requiring expert handling"
    }
  ]
};
```

### Add New Achievement

#### achievements.js
```javascript
export const ACHIEVEMENTS = {
  // ... existing achievements
  
  perfect_season: {
    id: "perfect_season",
    name: "Perfect Season",
    desc: "Win all 4 competitions with 80+ score",
    icon: "🏆",
    category: "competition",
    check: (state, context) => {
      const wins = state.telemetry.filter(e => 
        e.event === "competition" && 
        e.data.score >= 80
      );
      return wins.length >= 4;
    }
  },
  
  speed_demon: {
    id: "speed_demon",
    name: "Speed Demon",
    desc: "Complete entire season in under 2 hours",
    icon: "⚡",
    category: "endurance",
    check: (state, context) => {
      const totalTime = calculateTotalPlayTime(state);
      return totalTime < 120; // 120 minutes
    }
  }
};
```

### Add New Random Event

#### data_events.js
```javascript
export const EVENTS = [
  // ... existing events
  {
    id: "masterclass",
    name: "Guest Chef Masterclass",
    desc: "A visiting Michelin-star chef offers private tutoring",
    chance: 0.15,
    weekRange: [3, 10],
    delta: {
      technique: 5,
      palate: 3,
      fatigue: 2,
      budget: -100
    },
    condition: (S) => S.reputation >= 50
  }
];
```

---

## 🧪 Testing & Debugging

### Browser DevTools

#### Console Commands
```javascript
// Inspect current state
console.log(window.__STATE__);

// Check specific stat
console.log(window.__STATE__.technique);

// View telemetry
console.log(window.__STATE__.telemetry);

// Manually modify state (for testing)
window.__STATE__.budget = 9999;
window.__STATE__.technique = 100;
```

#### Test Specific Scenario
```javascript
// Skip to Week 12
window.__STATE__.week = 12;

// Max out all stats
window.__STATE__.technique = 100;
window.__STATE__.palate = 100;
window.__STATE__.creativity = 100;
window.__STATE__.cleanliness = 100;

// Save and reload
saveState(window.__STATE__);
location.reload();
```

### Telemetry Export

Export after playing to analyze:
```javascript
// Menu → Export Telemetry → Download JSON

// Sample telemetry structure:
{
  "events": [
    {
      "timestamp": "2025-01-11T10:30:00",
      "event": "action_taken",
      "data": {
        "action": "knife_work",
        "week": 1,
        "delta": { "technique": 3 }
      }
    },
    {
      "event": "competition",
      "data": {
        "week": 3,
        "score": 72,
        "breakdown": { ... }
      }
    }
  ]
}
```

### Common Debug Scenarios

#### Test Competition Scoring
```javascript
// Set up ideal state
const testState = {
  week: 3,
  technique: 80,
  palate: 80,
  creativity: 70,
  cleanliness: 75,
  fatigue: 20,
  budget: 1000
};

// Test scoring
const score = calculateCompetitionScore(testState, menu, "standard");
console.log("Test score:", score);
```

#### Test Menu Validation
```javascript
const testMenu = {
  protein: "wagyu",
  veg: "truffle",
  starch: "risotto",
  sauce: "butter"
};

const calc = computeMenu(testMenu);
console.log("Menu calc:", calc);
// Check: risk, prep, cost, wow
```

---

## 💡 Best Practices

### Code Style

#### Use Descriptive Names
```javascript
// Bad
function calc(s) { ... }

// Good
function calculateCompetitionScore(state) { ... }
```

#### Keep Functions Small
```javascript
// Bad - does too much
function doEverything() {
  // 200 lines of code
}

// Good - single responsibility
function validateMenu(menu) { ... }
function calculateCost(menu) { ... }
function checkCompatibility(menu) { ... }
```

#### Use Constants
```javascript
// Bad
if (score > 78) { ... }

// Good
const PASSING_SCORE = 78;
if (score > PASSING_SCORE) { ... }
```

### Performance

#### Cache Calculations
```javascript
// Bad - recalculates every render
function render() {
  const menu = computeMenu(S.menu); // Slow
  // ... use menu
}

// Good - calculate once
const menuCalc = computeMenu(S.menu);
function render() {
  // ... use menuCalc
}
```

#### Minimize DOM Updates
```javascript
// Bad - updates DOM multiple times
function updateStats() {
  document.getElementById("tech").textContent = S.technique;
  document.getElementById("pal").textContent = S.palate;
  // ... more updates
}

// Good - batch update
function updateStats() {
  const html = `
    <div>Technique: ${S.technique}</div>
    <div>Palate: ${S.palate}</div>
  `;
  document.getElementById("stats").innerHTML = html;
}
```

### State Management

#### Always Validate State
```javascript
function loadState() {
  const saved = localStorage.getItem("save");
  if (!saved) return null;
  
  const state = JSON.parse(saved);
  
  // Validate before using
  if (!validateState(state)) {
    console.warn("Invalid state, creating new");
    return defaultState();
  }
  
  return state;
}
```

#### Use Immutable Updates
```javascript
// Bad - mutates state
function applyDelta(state, delta) {
  state.technique += delta.technique;
  return state;
}

// Good - creates new state
function applyDelta(state, delta) {
  return {
    ...state,
    technique: state.technique + (delta.technique || 0)
  };
}
```

### Mobile Considerations

#### Touch Target Size
```css
/* Minimum 44x44 pixels for touch */
.button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 24px;
}
```

#### Prevent Zoom
```css
/* Use 16px+ font size */
input, select, textarea {
  font-size: 16px; /* Prevents iOS zoom */
}
```

#### Safe Areas
```css
/* Account for notch/home indicator */
.tab-bar {
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

## 🎓 Learning Path

### Beginner Modifications
1. Change difficulty in config.js
2. Adjust action costs
3. Modify color theme in styles.css
4. Add new achievement

### Intermediate Modifications
1. Create new country with backstory
2. Add new menu ingredients
3. Create new action type
4. Modify scoring weights

### Advanced Modifications
1. Add new core stat
2. Create new game mode
3. Build new UI screen
4. Implement multiplayer features

---

## 📚 Resources

### JavaScript ES6+
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

### CSS
- [CSS Tricks](https://css-tricks.com/)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

### Mobile Development
- [Mobile Web Best Practices](https://web.dev/mobile-web-best-practices/)
- [Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

---

## 🤝 Contributing

Want to share your modifications?
1. Fork the project
2. Make your changes
3. Document what you changed
4. Share with the community!

---

## 💬 Getting Help

**Stuck?**
- Check browser console for errors
- Review this guide
- Check README.md for game mechanics
- Export telemetry to analyze behavior

**Found a Bug?**
- Note the steps to reproduce
- Check console for errors
- Export your save game
- Document expected vs actual behavior

---

**Happy modding!** 🎮✨

The game is designed to be modified. Don't be afraid to experiment and break things - that's how you learn!
