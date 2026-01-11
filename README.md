# The Final Season — v0.5.2 (Ultimate Edition)

A narrative-driven culinary strategy game where you manage a chef through 20 weeks of intense competition. Inspired by Football Manager, featuring authentic competition mechanics from real culinary tournaments.

## 🆕 What's New in v0.5.2 - Ultimate Edition

### 📱 Mobile-First Experience
- **Bottom Tab Navigation** - iOS/Android style navigation with 44px+ touch targets
- **Full-Screen Content** - Each tab uses entire screen (no cramped sidebars)
- **Smooth Animations** - Native-feeling transitions and interactions
- **Safe Area Support** - Works perfectly with notch devices and home indicators
- **Responsive Design** - Optimized for phones, tablets, and desktop

### 🏆 Competition System Improvements
- **Competition Manager Module** - Centralized competition logic and state
- **Readiness Checker** - Visual feedback on preparation with 6-factor analysis
- **Score Breakdown** - Detailed post-competition analysis showing all components
- **Flow Validation** - Cannot skip mandatory competitions (weeks 3, 6, 9, 12)
- **Enhanced UI States** - Clear visual indicators for competition requirements

### 🏗️ Modular Architecture
- **config.js** - Centralized game tuning and balance
- **utils.js** - Shared utility functions
- **scoring.js** - Dedicated scoring engine with transparent calculations
- **state-manager.js** - Enhanced state management with validation
- **achievements.js** - Complete achievement system (25+ achievements)
- **competition-manager.js** - Competition state and flow management

### 🎯 Enhanced Gameplay
- **Achievement System** - 25+ achievements across skill, competition, management categories
- **Difficulty Settings** - Easy, Normal, Hard presets adjustable from config
- **Better Feedback** - Clear stat changes, notifications, and tooltips
- **Auto-save** - Automatic save on important actions
- **Export/Import** - Save file export and import support

## 📁 File Structure

```
/
├── index.html                    # Entry point (v0.5.2)
├── styles.css                    # Mobile-first styling
│
├── config.js                    ⭐ Game configuration
├── utils.js                     ⭐ Utility functions
├── scoring.js                   ⭐ Scoring engine
├── state-manager.js             ⭐ State management
├── achievements.js              ⭐ Achievement system
├── competition-manager.js       ⭐ Competition flow
│
├── ui.js                         # UI management (mobile-optimized)
├── systems.js                    # Core game logic
├── state.js                      # Basic state persistence
├── telemetry.js                  # Event logging
│
├── data_narrative.js             # Stories and text
├── data_countries.js             # Country definitions (6 countries)
├── data_competitors.js           # Rival chef data
├── data_menu_parts.js            # Menu components and ingredients
└── data_events.js                # Random events
```

## 🎮 How to Play

### Getting Started
1. **Choose Your Country** - Select from 6 countries with unique perks and backstories
2. **Read Your Story** - Learn your character's background and motivation
3. **Navigate Competition Circuit** - 20 weeks of training and competition

### Mobile Navigation (Bottom Tabs)
```
📖 Story | ⚡ Actions | 🍽️ Menu | 🏆 Compete | 📊 Stats
```

**Story Tab** - Make narrative choices that affect your character
**Actions Tab** - Take weekly actions (train, scout, fundraise, etc.)
**Menu Tab** - Design your competition menu (protein, veg, starch, sauce)
**Competition Tab** - Enter competitions (appears on weeks 3, 6, 9, 12)
**Stats Tab** - View all stats, progress, and recent activity

### Competition Weeks
**Week 3** - Local Heat (Target: 70) - Introductory competition
**Week 6** - Signature Dish (Target: 70) - Tests menu creativity
**Week 9** - Speed & Steel (Target: 70) - Tests technique under pressure
**Week 12** - Grand Final (Target: 78) - The ultimate challenge

### Readiness Checker
Before entering competition, the game checks:
- ✓ **Budget** - Can afford entry fee?
- ✓ **Fatigue** - Below 60?
- ✓ **Risk** - Menu risk below 25?
- ✓ **Menu Prep** - Matches your prep stat?
- ✓ **Scouted** - Reduced score variance?
- ✓ **Tested** - Further reduced variance?

**Readiness Levels:**
- **READY** (Green) - 5-6 checks passed - optimal condition
- **FAIR** (Yellow) - 3-4 checks passed - acceptable
- **RISKY** (Red) - 0-2 checks passed - high chance of penalties

## 🎯 Core Stats

### Skills (0-100+)
- **Technique** - Execution precision and fundamental skills
- **Palate** - Flavor balance and taste refinement
- **Creativity** - Innovation and artistic presentation
- **Cleanliness** - Food safety and HACCP compliance
- **Prep** - Planning and mise en place efficiency

### Resources
- **Budget** - Money for ingredients and entry fees ($800-1500 typical)
- **Fatigue** - Exhaustion level (0-100, high fatigue = penalties)
- **Reputation** - Public standing (affects rival behavior and endings)

### Menu Properties
- **Wow Factor** - Visual and conceptual impact (0-100)
- **Risk** - Technical difficulty and failure potential (0-40+)
- **Prep Time** - Required preparation time (0-60+ hours)

## 🎲 Actions Explained

### Training Actions
- **Knife Work** - Improve technique (+3 technique, +2 fatigue)
- **Taste Training** - Improve palate (+3 palate, +2 fatigue)
- **Plating Practice** - Improve creativity (+3 creativity, +2 fatigue)
- **HACCP Review** - Improve cleanliness (+3 cleanliness, +1 fatigue)

### Strategic Actions
- **Test Cook** - Practice your menu (reduce variance, +3 fatigue, costs $50)
- **Scout Rival** - Research competitor (reduce variance, +1 fatigue, costs $100)
- **Fundraise** - Raise money (+$200, +2 reputation, +1 fatigue)
- **Recovery Session** - Reduce fatigue (-10 fatigue, costs $50)

### Menu Actions
- **Design Menu** - Select protein, vegetable, starch, sauce
- **Refine Menu** - Adjust components and balance risk/reward
- **Save Menu** - Lock in your competition menu

## 🏅 Achievement System

### Categories
**Skill Achievements** - Master individual techniques
- High Technique, High Palate, High Creativity, etc.

**Competition Achievements** - Competition performance
- First Win, Perfect Week, Undefeated Season, etc.

**Management Achievements** - Resource management
- Budget Master, Zero Fatigue, Risk Taker, etc.

**Endurance Achievements** - Long-term success
- Complete Season, Multiple Playthroughs, etc.

Achievements persist across playthroughs and are stored in telemetry.

## 🎨 Six Countries

### France 🇫🇷
"Classical Excellence"
- Perks: +5 technique, +5 palate, +3 cleanliness
- Style: Traditional French haute cuisine mastery

### Japan 🇯🇵
"Disciplined Perfection"
- Perks: +8 technique, +5 cleanliness, +2 palate
- Style: Precision, discipline, and respect for ingredients

### Italy 🇮🇹
"Rustic Innovation"
- Perks: +5 creativity, +5 palate, +3 technique
- Style: Fresh ingredients and bold flavors

### Peru 🇵🇪
"Bold Fusion"
- Perks: +6 creativity, +4 palate, +3 technique
- Style: Indigenous ingredients with modern techniques

### Thailand 🇹🇭
"Vibrant Balance"
- Perks: +5 palate, +5 creativity, +3 technique
- Style: Perfect balance of sweet, sour, salty, spicy

### Denmark 🇩🇰
"Modern Nordic"
- Perks: +6 creativity, +4 technique, +3 cleanliness
- Style: Foraged ingredients and innovative techniques

## 🔧 Customization Guide

### Easy Balance Changes (config.js)
```javascript
export const CONFIG = {
  // Difficulty
  STARTING_BUDGET: 1500,        // More/less starting money
  COMP_TARGET_FINAL: 75,        // Easier/harder final (default: 78)
  EVENT_CHANCE_PER_WEEK: 0.2,   // Fewer/more random events
  
  // Fatigue
  FATIGUE_RECOVERY_RATE: 5,     // Faster/slower natural recovery
  
  // Costs
  COST_TEST_COOK: 50,          // Cheaper/more expensive testing
  COST_SCOUT: 100,             // Cheaper/more expensive scouting
};
```

### Add New Countries (3 files to edit)
1. **data_countries.js** - Add country stats and perks
2. **data_narrative.js** - Add backstory and flag
3. **data_competitors.js** - Add rival chef

### Balance Competitions (scoring.js)
```javascript
SCORING: {
  palate: 0.30,        // Increase/decrease importance
  technique: 0.28,
  creativity: 0.25,
  cleanliness: 0.17,
}
```

### Add New Menu Parts (data_menu_parts.js)
```javascript
proteins: [
  {
    id: "wagyu",
    name: "A5 Wagyu Beef",
    cost: 400,           // Higher cost
    prep: 15,            // More prep time
    tech: 5,             // More technique required
    palate: 4,
    wow: 5,              // More impressive
    risk: 3              // More risky
  }
]
```

### Add New Achievements (achievements.js)
```javascript
export const ACHIEVEMENTS = {
  speed_demon: {
    id: "speed_demon",
    name: "Speed Demon",
    desc: "Complete a week in under 30 minutes",
    icon: "⚡",
    check: (state, context) => {
      return context.weekTimeMinutes < 30;
    }
  }
};
```

## 📊 Scoring System

### Base Score Components
1. **Core Skills** (60-70% of score)
   - Technique × 0.28
   - Palate × 0.30
   - Creativity × 0.25
   - Cleanliness × 0.17

2. **Menu Impact** (10-15% of score)
   - Wow Factor bonus
   - Creativity bonus

3. **Preparation Bonus** (5-10% of score)
   - Proper prep reduces variance
   - Test cook bonus
   - Scouting bonus

4. **Approach Modifier**
   - Safe Approach: Lower ceiling, lower variance
   - Standard Approach: Balanced
   - Bold Approach: Higher ceiling, higher variance

5. **Variance** (±5-15 points)
   - Random element (simulates judges, conditions)
   - Reduced by scouting and testing

6. **Penalties**
   - High fatigue (60+): Up to -10 points
   - High risk (25+): Up to -15 points
   - Prep mismatch: Up to -10 points

### Target Scores
- **70**: Baseline competitive score
- **75**: Strong performance
- **78**: Final competition target
- **80+**: Excellence
- **85+**: Legendary performance

## 🎯 Strategy Guide

### Early Game (Weeks 1-4)
**Focus**: Build fundamentals
- Train technique and cleanliness
- Keep menu simple (low risk)
- Build budget through fundraising
- Scout rival before Week 3 competition
- Don't overspend on ingredients

### Mid Game (Weeks 5-8)
**Focus**: Refine approach
- Design signature menu
- Balance creativity with risk
- Test cook before Week 6
- Manage fatigue (recovery around Week 7)
- Build reputation

### Late Game (Weeks 9-12)
**Focus**: Peak performance
- Optimize menu for final
- Test cook before both competitions
- Clear all fatigue
- Scout rival before Week 12
- Balance risk vs consistency

### Optimal Competition Prep
1. **Week Before Competition**
   - Test cook your menu (-variance)
   - Scout rival if not done (-variance)
   - Ensure fatigue below 60
   - Check menu prep matches your prep stat

2. **Competition Day**
   - Review readiness checker
   - Aim for "READY" status
   - Choose approach based on target score
   - Enter competition

3. **Post-Competition**
   - Review score breakdown
   - Understand what worked/didn't
   - Adjust strategy for next competition

## 💾 Technical Features

### State Management
- Automatic save on key actions
- State validation on load
- Corruption detection and fixing
- Export/import save files
- State snapshots for debugging

### Telemetry System
- All actions logged
- Competition results tracked
- Achievement progress recorded
- Exportable for analysis

### Mobile Optimization
- Hardware-accelerated animations
- Touch-optimized UI (44px+ targets)
- Safe area support (notch/home indicator)
- Smooth scrolling
- No zoom required (proper font sizes)

## 🐛 Troubleshooting

### Save Won't Load
- Clear browser cache (Ctrl+F5)
- Check console for errors
- State will auto-fix common issues
- Export old save, start fresh, import if needed

### Score Seems Wrong
- Export telemetry
- Check `result.details` for breakdown
- Verify stat values are correct
- Check for penalties (fatigue, risk)

### UI Not Updating
- Hard refresh (Ctrl+F5 or Cmd+Shift+R)
- Check console for JavaScript errors
- Verify all module files are loaded

### Mobile Issues
- Tabs not switching: Hard refresh page
- Content cut off: Scroll within tab
- Text too small: Shouldn't happen (all 16px+)
- Buttons not tapping: Check console errors

## 📈 Future Expansion Ideas

### Potential Modules
- **career-mode.js** - Multi-season progression with reputation
- **restaurant-sim.js** - Run your own restaurant between competitions
- **training-programs.js** - Skill trees and specialization paths
- **market-system.js** - Dynamic ingredient pricing and seasons
- **social-media.js** - Reputation system with media interactions
- **multiplayer.js** - Async competition with other players

### Easy Additions
- New countries (3 files, ~2 hours)
- New menu parts (1 file, ~30 minutes)
- New events (1 file, ~30 minutes)
- New achievements (1 file, ~1 hour)
- New story branches (1 file, ~2 hours)

## 🎓 Learning Resources

### Understanding the Code
- Start with `config.js` - understand game constants
- Read `scoring.js` - learn how competitions work
- Explore `systems.js` - see game logic
- Check `ui.js` - understand interface rendering

### Making Your First Mod
1. Adjust difficulty in `config.js`
2. Add new menu ingredient in `data_menu_parts.js`
3. Create new achievement in `achievements.js`
4. Test and iterate!

## 💡 Design Philosophy

### Authenticity First
The game is based on real culinary competitions like:
- Bocuse d'Or (technical excellence)
- RAK Porcelain Culinary World Cup (team competition)
- World Association of Chefs' Societies events

Real competition elements:
- HACCP requirements
- Prep time constraints
- Judge scoring criteria
- Equipment limitations
- Pressure management

### Accessible Depth
- Simple to learn (Football Manager style)
- Deep strategy (stat optimization)
- Mobile-friendly (play anywhere)
- Modular design (easy to expand)

### Player Respect
- No dark patterns or manipulation
- Clear feedback on decisions
- Transparent scoring
- Fair difficulty progression
- Auto-save to respect player time

## 📝 Changelog

### v0.5.2 - Ultimate Edition (2025-01-11)
- ✨ Mobile-first redesign with bottom tabs
- ✨ Competition manager module
- ✨ Enhanced readiness checker
- ✨ Detailed score breakdown
- ✨ Full-screen tab experience
- 🔧 Competition flow validation
- 🔧 Safe area support for notch devices
- 🔧 44px+ touch targets throughout
- 📱 Optimized for phones, tablets, desktop

### v0.5.1 - Competition Fix (2025-01-10)
- ✨ Competition blocking fixed
- ✨ Week advancement validation
- ✨ UI state management
- 🐛 Fixed competition progression

### v0.5.0 - Modular Edition (2025-01-09)
- ✨ Modular architecture
- ✨ Achievement system
- ✨ Enhanced state management
- ✨ Dedicated scoring engine

### v0.4.0 - Narrative Edition
- Full story experience
- Character creation
- Multiple endings

### v0.3.0 - Initial Release
- Basic gameplay loop
- Competition system
- 6 countries

## 🤝 Contributing

This is an open framework! Feel free to:
- Add new countries and storylines
- Create new menu systems
- Build additional game modes
- Share your mods and improvements

## 📜 License

Free to use and modify for personal or educational purposes.
Attribution appreciated but not required.

---

**Version**: v0.5.2 - Ultimate Edition  
**Last Updated**: January 11, 2025  
**Framework**: Vanilla JavaScript + ES6 Modules  
**Compatibility**: iOS Safari 14+, Chrome 90+, Firefox 88+  
**Deployment**: GitHub Pages, Netlify, Vercel, or any static host

**Enjoy your culinary journey!** 👨‍🍳✨
