# Migration Guide: v0.4.0 → v0.5.0

This guide shows how to integrate the new modular architecture into your existing game.

## 🎯 Overview

v0.5.0 introduces a modular architecture that separates concerns:
- Configuration → `config.js`
- Utilities → `utils.js`
- Scoring → `scoring.js`
- State Management → `state-manager.js`
- Achievements → `achievements.js`

## 📋 Step-by-Step Migration

### 1. Add New Files

Add these new files to your project:
- `config.js`
- `utils.js`
- `scoring.js`
- `state-manager.js`
- `achievements.js`

### 2. Update systems.js

**Before (v0.4):**
```javascript
export function r(a,b){return a+Math.floor(Math.random()*(b-a+1));}
export function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
export function money(n){return "$"+Math.max(0,Math.floor(n));}
```

**After (v0.5):**
```javascript
import { random, clamp, money } from "./utils.js";
import { CONFIG } from "./config.js";
import { calculateCompetitionScore, calculateRivalScore } from "./scoring.js";

// Use imported functions instead of local ones
// r() → random()
// All money formatting → money()
```

### 3. Update state.js

**Before (v0.4):**
```javascript
export const SAVE_KEY = "culinary_sim_polished_flat_v030";
export function loadState(){ /* ... */ }
export function saveState(S){ /* ... */ }
```

**After (v0.5):**
```javascript
// Simple wrapper for backward compatibility
import { 
  loadState as load,
  saveState as save,
  clearState as reset,
  createDefaultState as defaultState,
  createDefaultMenu as defaultMenu
} from "./state-manager.js";

export { load as loadState, save as saveState, reset as resetLocal };
export { defaultState, defaultMenu };
```

### 4. Update Competition Scoring in systems.js

**Before (v0.4):**
```javascript
export function runCompetition(S, plan) {
  // 50+ lines of scoring logic inline
  const core = (S.palate*0.30 + S.technique*0.28 + /* ... */);
  // ... more calculations
}
```

**After (v0.5):**
```javascript
import { calculateCompetitionScore, getCompetitionTarget } from "./scoring.js";

export function runCompetition(S, plan) {
  const comp = COMP_WEEKS[S.week];
  const m = computeMenu(S.menu, S.flags);
  
  // Apply plan modifications
  applyCompetitionPlan(S, plan);
  
  // Use modular scoring
  const scoring = calculateCompetitionScore(S, m, plan, comp);
  const target = getCompetitionTarget(S.week);
  const win = scoring.total >= target;
  
  // Rest of competition logic...
}
```

### 5. Add Achievement Checking

**In systems.js or ui.js:**
```javascript
import { checkAllAchievements, unlockAchievement } from "./achievements.js";

// After any significant action
function afterCompetition(S, result) {
  const context = { type: "competition", result };
  const newAchievements = checkAllAchievements(S, context);
  
  newAchievements.forEach(id => {
    unlockAchievement(S, id);
    // Show notification
    showAchievementUnlock(id);
  });
}
```

### 6. Update ui.js Imports

**Before (v0.4):**
```javascript
import { defaultState, loadState, saveState } from "./state.js";
```

**After (v0.5):**
```javascript
import { createDefaultState, loadState, saveState } from "./state-manager.js";
import { CONFIG } from "./config.js";
import { money, getColorClass } from "./utils.js";
import { getAchievementProgress } from "./achievements.js";

// Replace hardcoded values with CONFIG
// Replace inline formatting with utility functions
```

### 7. Update index.html Script Tags

**Before (v0.4):**
```html
<script type="module" src="./ui.js"></script>
```

**After (v0.5):**
```html
<!-- No changes needed! Modules handle dependencies -->
<script type="module" src="./ui.js"></script>
```

## 🔄 Function Mapping

### Utilities
```javascript
// Old → New
r(a, b) → random(a, b)
// No change needed for clamp() and money()
```

### State
```javascript
// Old → New
defaultState() → createDefaultState()
defaultMenu() → createDefaultMenu()
// loadState() and saveState() work the same
```

### Configuration
```javascript
// Old (hardcoded)
const STARTING_BUDGET = 1000;
const COMP_TARGET = 70;

// New (from config)
import { CONFIG } from "./config.js";
const budget = CONFIG.STARTING_BUDGET;
const target = CONFIG.COMP_TARGET_STANDARD;
```

## ✅ Testing Your Migration

### 1. Check Console
Open browser DevTools and check for:
- Import errors
- Undefined function errors
- Module loading issues

### 2. Test Core Functions
```javascript
// In browser console
import { random, clamp, money } from "./utils.js";
console.log(random(1, 10)); // Should log 1-10
console.log(clamp(150, 0, 100)); // Should log 100
console.log(money(1234.56)); // Should log "$1234"
```

### 3. Test State Management
```javascript
import { createDefaultState, saveState, loadState } from "./state-manager.js";
const state = createDefaultState();
saveState(state);
const loaded = loadState();
console.log(loaded); // Should match saved state
```

### 4. Test Scoring
```javascript
import { calculateCompetitionScore } from "./scoring.js";
// Should return score breakdown object
```

## 🐛 Common Issues

### "Module not found"
**Problem:** Import path incorrect
**Solution:** Check relative paths (use `./` for same directory)

### "Function is not defined"
**Problem:** Not imported properly
**Solution:** Add to import statement

```javascript
// Wrong
import { something } from "./utils.js";
something(); // works
random(); // ERROR - not imported

// Right
import { something, random } from "./utils.js";
random(); // works
```

### "CONFIG is not defined"
**Problem:** Config not imported
**Solution:**
```javascript
import { CONFIG } from "./config.js";
```

### State Validation Fails
**Problem:** Old save format
**Solution:** State manager auto-migrates, or start new game

## 🎨 Optional: Update systems.js

You can simplify `systems.js` by moving scoring logic out:

**Extract this section:**
```javascript
// OLD: In systems.js
const core = (S.palate*0.30 + S.technique*0.28 + ...);
const menuImpact = (m.wow*0.18) + (S.creativity*0.12);
// ... 40 more lines
```

**Replace with:**
```javascript
// NEW: In systems.js
import { calculateCompetitionScore } from "./scoring.js";
const scoring = calculateCompetitionScore(S, m, plan, comp);
const total = scoring.total;
```

## 🔧 Backward Compatibility

The new modules maintain backward compatibility:

```javascript
// Old code still works
import { loadState, saveState } from "./state.js";

// New code is better
import { loadState, saveState } from "./state-manager.js";
```

## 📝 Checklist

- [ ] Add new module files (config, utils, scoring, state-manager, achievements)
- [ ] Update imports in systems.js
- [ ] Update imports in ui.js
- [ ] Replace hardcoded constants with CONFIG
- [ ] Replace inline utilities with imported functions
- [ ] Add achievement checking
- [ ] Test in browser
- [ ] Verify saves load correctly
- [ ] Test competition scoring
- [ ] Check for console errors

## 🎉 Benefits After Migration

✅ **Easier to Balance**
- Change competition difficulty in one place
- Tweak scoring weights without hunting through code

✅ **Better Organization**
- Clear separation of concerns
- Each file has one job

✅ **Easier to Extend**
- Add achievements without touching core code
- Add new features as modules

✅ **Better Testing**
- Each module can be tested independently
- Utilities are reusable

✅ **Safer State Management**
- Validation prevents corruption
- Migration handles version updates

## 💡 Next Steps

1. **Get comfortable with modules** - Explore each new file
2. **Customize CONFIG** - Tune the game to your liking
3. **Add achievements** - Create new challenges
4. **Build new features** - Use the modular structure

## 📚 Resources

- [ES6 Modules Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Project README](./README_v050.md)
- [Config Documentation](./config.js)

---

**Need Help?**
Check the browser console for errors and compare with working examples in the new modules.
