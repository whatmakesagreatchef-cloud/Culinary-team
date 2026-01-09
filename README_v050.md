# The Final Season — v0.5.0 (Modular Edition)

A narrative-driven culinary strategy game where you manage a chef through 12 weeks of intense competition.

## 🆕 What's New in v0.5.0 - Modular Edition

### 🏗️ Architectural Improvements

**Modular Code Structure**
- **config.js** - Centralized game tuning and balance
- **utils.js** - Shared utility functions
- **scoring.js** - Dedicated scoring engine
- **state-manager.js** - Enhanced state management with validation
- **achievements.js** - New achievement system

**Benefits:**
- Easier to update and balance
- Better code organization
- Simpler to add new features
- More maintainable codebase

### 🎯 New Features

**Achievement System**
- 25+ achievements to unlock
- Skill, competition, management, and endurance categories
- Track progress across playthroughs
- Achievements persist in telemetry

**Enhanced State Management**
- State validation on load/save
- Automatic sanitization
- State migration for version updates
- Export/import save files
- Snapshot system for debugging

**Difficulty Settings**
- Easy, Normal, Hard presets
- Adjustable from config.js
- Affects budget, targets, event frequency

**Improved Scoring**
- Modular scoring engine
- Easier to understand score breakdown
- Better balance between risk/reward
- Transparent calculations

### 🎮 Gameplay Enhancements

**Better Feedback**
- Clearer stat changes
- Achievement notifications
- Score breakdown in competitions
- Improved UI tooltips

**Quality of Life**
- Auto-save on important actions
- State validation prevents corruption
- Better error handling
- Smoother transitions

## 📁 File Structure

```
/
├── index.html              # Entry point
├── styles.css              # Styling
├── ui.js                   # UI management
│
├── config.js              ⭐ NEW - Game configuration
├── utils.js               ⭐ NEW - Utility functions
├── scoring.js             ⭐ NEW - Scoring engine
├── state-manager.js       ⭐ NEW - State management
├── achievements.js        ⭐ NEW - Achievement system
│
├── systems.js             # Game logic (streamlined)
├── state.js               # Basic state (now uses state-manager)
├── telemetry.js           # Logging
│
├── data_narrative.js      # Stories and text
├── data_countries.js      # Country definitions
├── data_competitors.js    # Rival data
├── data_menu_parts.js     # Menu components
└── data_events.js         # Random events
```

## 🎯 Module Guide

### config.js
Central configuration file for all game constants.

**What to change here:**
- Starting budget
- Competition difficulty
- Scoring weights
- Event frequencies
- Feature flags

**Example:**
```javascript
export const CONFIG = {
  STARTING_BUDGET: 1000,  // Change starting money
  COMP_TARGET_FINAL: 78,  // Change final difficulty
  // ... more settings
};
```

### scoring.js
Dedicated module for all scoring calculations.

**Key Functions:**
- `calculateCompetitionScore()` - Main scoring
- `calculateRivalScore()` - AI opponent scoring
- `getCompetitionTarget()` - Get target score

**Benefits:**
- Easy to balance competitions
- Clear score breakdown
- Transparent formulas

### state-manager.js
Enhanced state management with validation.

**Key Functions:**
- `createDefaultState()` - Generate clean state
- `loadState()` / `saveState()` - Persistence
- `validateState()` - Check validity
- `sanitizeState()` - Fix issues
- `exportState()` - Save to file

**Benefits:**
- Prevents save corruption
- Automatic data fixing
- Version migration
- Export/import support

### achievements.js
Complete achievement system.

**Key Functions:**
- `checkAllAchievements()` - Check for unlocks
- `unlockAchievement()` - Unlock achievement
- `getAchievementProgress()` - Track progress

**Adding New Achievements:**
```javascript
export const ACHIEVEMENTS = {
  my_achievement: {
    id: "my_achievement",
    name: "Achievement Name",
    desc: "Description",
    icon: "🏆",
    check: (state, context) => {
      // Return true if unlocked
      return state.someValue >= 100;
    }
  }
};
```

### utils.js
Reusable utility functions.

**Common Functions:**
- `random(a, b)` - Random number
- `clamp(n, min, max)` - Clamp value
- `money(n)` - Format currency
- `getColorClass()` - UI helper
- More...

## 🎮 How to Mod / Customize

### Change Difficulty

Edit `config.js`:
```javascript
export const CONFIG = {
  STARTING_BUDGET: 1500,    // More starting money
  COMP_TARGET_FINAL: 75,    // Easier final
  EVENT_CHANCE_PER_WEEK: 0.3  // Fewer events
};
```

### Add New Countries

1. Add to `data_countries.js`
2. Add backstory to `data_narrative.js`
3. Add rival competitor to `data_competitors.js`

### Balance Competitions

Edit `scoring.js` weights:
```javascript
SCORING: {
  palate: 0.30,        // Increase palate importance
  technique: 0.28,
  // ... adjust other weights
}
```

### Add New Menu Parts

Edit `data_menu_parts.js`:
```javascript
proteins: [
  {
    id: "beef",
    name: "Wagyu Beef",
    cost: 350,
    prep: 12,
    tech: 4,
    // ... more properties
  }
]
```

### Add New Events

Edit `data_events.js`:
```javascript
{
  id: "my_event",
  name: "Event Name",
  desc: "What happens",
  delta: {
    technique: 3,
    fatigue: 2
  }
}
```

### Customize UI

Edit `styles.css`:
```css
:root {
  --bg: #0a0f16;      /* Background color */
  --acc: #66d9ef;     /* Accent color */
  --text: #e8eef6;    /* Text color */
  /* ... more CSS variables */
}
```

## 🔧 Developer Guide

### Adding New Features

1. **Create new module** (if needed)
   ```javascript
   // my-feature.js
   export function myFunction() {
     // Implementation
   }
   ```

2. **Import in systems.js or ui.js**
   ```javascript
   import { myFunction } from "./my-feature.js";
   ```

3. **Add to feature flags** (config.js)
   ```javascript
   FEATURES: {
     myFeature: true
   }
   ```

4. **Update UI** (ui.js)
   ```javascript
   if (CONFIG.FEATURES.myFeature) {
     // Show feature
   }
   ```

### Testing Changes

1. Make changes to module
2. Refresh browser (Ctrl+F5 to clear cache)
3. Check browser console for errors
4. Test gameplay flow
5. Export telemetry to verify calculations

### Debugging

**Enable Verbose Logging:**
```javascript
// Add to config.js
DEBUG: true,
LOG_LEVEL: 'verbose'
```

**Check State:**
```javascript
// In browser console
console.log(window.__STATE__);
```

**Validate Scoring:**
```javascript
// Export telemetry after competition
// Check result.details for score breakdown
```

## 📊 Balance Guidelines

### Competition Difficulty
- **Week 3** (Local Heat): Target 70, forgiving
- **Week 6** (Signature): Target 70, tests menu
- **Week 9** (Speed & Steel): Target 70, tests technique
- **Week 12** (Grand Final): Target 78, tests everything

### Stat Targets
- **Core Skills** (60-80): Competitive range
- **80-100**: Strong performance
- **100+**: Excellence
- **Resources**: Budget $800-1500 typical

### Risk Management
- **Low Risk** (<15): Safe, lower ceiling
- **Medium Risk** (15-25): Balanced
- **High Risk** (25+): Dangerous, penalties likely

## 🎯 Gameplay Strategy

### Early Game (Weeks 1-4)
- Build fundamentals (technique, cleanliness)
- Keep menu simple
- Scout rival before Week 3
- Manage budget carefully

### Mid Game (Weeks 5-8)
- Refine menu
- Take calculated risks
- Manage fatigue (recovery around Week 7)
- Build reputation

### Late Game (Weeks 9-12)
- Test cook before competitions
- Clear all obligations
- Optimize menu for final
- Balance risk vs consistency

## 📈 Future Expansion Ideas

### Potential Modules
- **career-mode.js** - Multi-season progression
- **restaurant-sim.js** - Restaurant management
- **training-programs.js** - Skill trees
- **market-system.js** - Dynamic ingredient pricing
- **social-media.js** - Reputation system
- **multiplayer.js** - Async competition

### Easy to Add
- New countries (3 files)
- New menu parts (1 file)
- New events (1 file)
- New achievements (1 file)
- New story branches (1 file)

## 🐛 Troubleshooting

**Save won't load:**
- Clear browser cache
- Check console for errors
- State will auto-fix on load

**Score seems wrong:**
- Export telemetry
- Check result.details
- Verify stat values

**UI not updating:**
- Hard refresh (Ctrl+F5)
- Check for JS errors in console

## 📝 Changelog

### v0.5.0 - Modular Edition
- ✨ Modular code architecture
- ✨ Achievement system (25+ achievements)
- ✨ Enhanced state management
- ✨ Dedicated scoring engine
- ✨ Utility library
- ✨ Difficulty settings
- 🔧 Better error handling
- 🔧 State validation
- 🔧 Export/import saves
- 📚 Comprehensive documentation

### v0.4.0 - Narrative Edition
- Full story experience
- Character creation
- Multiple endings
- Enhanced UI

### v0.3.0
- Initial modular structure
- Basic gameplay loop
- Competition system

## 💡 Tips for Modders

1. **Always test in browser** - JavaScript modules require HTTP server
2. **Use browser DevTools** - Check console for errors
3. **Export telemetry** - Great for debugging calculations
4. **Start small** - Modify constants before adding features
5. **Keep backups** - Save working versions
6. **Use feature flags** - Easy enable/disable

## 🤝 Contributing

This is an open framework! Feel free to:
- Add new countries and storylines
- Create new menu systems
- Build additional game modes
- Share your mods

## 📜 License

Free to use and modify for personal or educational purposes.

---

**Version**: v0.5.0 - Modular Edition
**Last Updated**: 2025
**Framework**: Vanilla JS + ES6 Modules
