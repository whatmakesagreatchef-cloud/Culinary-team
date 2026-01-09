# Quick Start Guide - v0.5.0 Modular Edition

Get started with the new modular architecture in 5 minutes.

## 🚀 Installation

### Option 1: Fresh Install
1. Download all files from v0.5.0
2. Upload to your web server or GitHub Pages
3. Open `index.html` in browser
4. Play!

### Option 2: Update Existing Game
1. Add new module files:
   - `config.js`
   - `utils.js`
   - `scoring.js`
   - `state-manager.js`
   - `achievements.js`
2. Replace `systems.js` with `systems_v050.js`
3. Follow [Migration Guide](./MIGRATION_GUIDE.md)

## 🎮 Basic Usage

### Playing the Game

**Start New Game:**
1. Click "New Game" on title screen
2. Select your country
3. Read backstory
4. Begin season

**During Gameplay:**
- **Story Tab**: Make narrative choices
- **Actions Tab**: Take weekly actions
- **Menu Lab**: Design your dishes
- **Competition Tab**: Enter competitions (weeks 3, 6, 9, 12)

**Controls:**
- Click tabs to switch views
- ESC or Menu button for pause menu
- Auto-saves after important actions

### First Playthrough Tips

**Week 1-2**: Focus on story choices and building stats
**Week 3**: Your first competition - keep it simple
**Week 4-5**: Train technique or R&D menu
**Week 6**: Major competition - scout rival first
**Week 7**: Take recovery week if fatigue is high
**Week 9**: Speed competition - test cook beforehand
**Week 12**: Grand final - use your best menu

## 🔧 Customization

### Easy Difficulty Changes

Open `config.js` and change:

```javascript
// Make game easier
export const CONFIG = {
  STARTING_BUDGET: 1500,    // More money
  COMP_TARGET_FINAL: 73,    // Lower final target
  EVENT_CHANCE_PER_WEEK: 0.3  // Fewer random events
};
```

### Change Scoring Balance

Open `config.js`:

```javascript
SCORING: {
  palate: 0.35,        // Make palate more important
  technique: 0.25,     // Make technique less important
  cleanliness: 0.22,
  consistency: 0.18
}
```

### Add New Menu Items

Open `data_menu_parts.js` and add to relevant array:

```javascript
proteins: [
  {
    id: "wagyu",
    name: "Wagyu Beef",
    cost: 400,
    prep: 11,
    tech: 4,
    palate: 3,
    cre: 1,
    risk: 3,
    tags: ["luxury"]
  },
  // ... existing items
]
```

### Create New Achievement

Open `achievements.js`:

```javascript
export const ACHIEVEMENTS = {
  // ... existing achievements
  
  my_new_achievement: {
    id: "my_new_achievement",
    name: "Master Chef",
    desc: "Win all competitions with 85+ score",
    icon: "👨‍🍳",
    check: (state) => {
      const comps = (state.telemetry || [])
        .filter(e => e.type === "competition");
      return comps.length >= 4 && 
             comps.every(c => c.result?.win && c.result?.score >= 85);
    }
  }
};
```

## 📊 Understanding the Systems

### Stats Explained

**Skills** (Higher is better)
- **Technique**: Execution quality
- **Palate**: Flavor judgment  
- **Creativity**: Innovation ability
- **Cleanliness**: Organization
- **Consistency**: Reliability
- **Composure**: Stress handling

**Resources**
- **Budget**: Money for expenses
- **Reputation**: Opens opportunities
- **Prep**: Readiness for service

**Conditions** (Manage carefully)
- **Morale**: Team spirit (keep high)
- **Fatigue**: Exhaustion (keep low)
- **Risk**: Chance of failure (keep low)

### Menu System

**Components:**
1. Protein (chicken, duck, fish, etc.)
2. Technique (roast, sous-vide, braise, etc.)
3. Sauce (jus, beurre blanc, nam jim, etc.)
4. Garnish (knife cuts, herbs, pickles, etc.)
5. Dessert (citrus, chocolate, tea, etc.)

**Menu Stats:**
- **Cost**: How much to prepare
- **Prep Load**: Time/effort required
- **Wow Factor**: Impression on judges
- **Risk**: Chance of mistakes

**Menu Strategy:**
- Match prep load to your prep stat
- Higher wow = better scores
- Balance risk vs reward
- Test cook before competitions

### Competition Scoring

**Formula (simplified):**
```
Score = Core Skills + Menu Impact + Prep Bonus 
        + Approach Modifier + Emphasis Bonus
        - Penalties (fatigue + risk)
        ± Random Variance
```

**Core Skills**: Your technique, palate, cleanliness, consistency
**Menu Impact**: Your creativity + menu wow factor
**Prep Bonus**: Being prepared vs menu requirements
**Penalties**: High fatigue and risk hurt you
**Variance**: Randomness (reduce with scouting + testing)

**Competition Approaches:**
- **Safe**: +4 bonus, low variance (6)
- **Standard**: No modifier, medium variance (10)
- **Bold**: -2 penalty, high variance (15)

### Weekly Actions

**Train Systems**: Improve technique + cleanliness
**R&D Menu**: Improve creativity + palate
**Sponsor Meetings**: Get money (success chance based on rep)
**Deliver Sponsor Pack**: Clear obligations
**Community Events**: Build reputation
**Scout Rival**: Reduce competition variance
**Recovery Week**: Reduce fatigue, restore morale

**Rule**: One action per week

## 🎯 Winning Strategies

### Conservative Approach
- Week 1: Story choice (standards/organization)
- Week 2: Train Systems
- Week 3: COMPETITION (safe approach)
- Week 4-5: R&D Menu + Train
- Week 6: Scout → COMPETITION (standard)
- Week 7: Recovery Week
- Week 8: Community Events
- Week 9: Test Cook → COMPETITION (safe)
- Week 10-11: Train + Sponsor
- Week 12: FINAL (safe approach)

### Aggressive Approach
- Build high-risk, high-reward menu early
- Take Bold approach in competitions
- Manage fatigue with recovery
- Hope for good variance rolls

### Balanced Approach
- Mix training and R&D
- Use Standard approach
- Scout + Test Cook before big competitions
- Keep stats above 70
- Manage obligations carefully

## 🏆 Achievement Hunting

**Easy Achievements:**
- Master Technique (100+ technique)
- Wealthy ($2000+ budget)
- Famous (30+ reputation)

**Medium Achievements:**
- Clean Sweep (win all 4 competitions)
- Balanced Chef (all stats 70+)
- Debt Free (finish with no obligations)

**Hard Achievements:**
- Perfect Score (85+ in competition)
- Iron Chef (fatigue never >60)
- Rival Crusher (beat rival every time)

## 🐛 Troubleshooting

**Game won't load:**
- Check browser console (F12)
- Must use HTTP server (not file://)
- Try incognito mode

**Stats seem broken:**
- Export telemetry to see calculations
- Check console for errors
- Verify CONFIG values

**Save disappeared:**
- Check localStorage in browser
- May need to start new game
- Use Export feature to backup

**Score calculation unclear:**
- Check telemetry after competition
- Look at result.details object
- Compare with scoring.js formulas

## 📚 Next Steps

1. **Play through once** to understand mechanics
2. **Read full README** for detailed info
3. **Experiment with config.js** to tune difficulty
4. **Try different countries** for variety
5. **Create custom achievements**
6. **Balance your own menu items**
7. **Share your mods**

## 🔗 Resources

- [Full README](./README_v050.md) - Complete documentation
- [Migration Guide](./MIGRATION_GUIDE.md) - Upgrade from v0.4
- Browser Console (F12) - Debug and explore
- [GitHub Issues] - Report bugs (if applicable)

## 💡 Pro Tips

✅ Scout rival before Week 6 competition
✅ Test cook before Week 12 final
✅ Keep fatigue below 50
✅ Clear obligations on time
✅ Save budget for Week 12 entry fee
✅ Match menu prep to your prep stat
✅ Export telemetry to study scoring

---

**Have Fun!** 🎮👨‍🍳

Remember: It's about the journey, not just winning. Try different strategies, experiment with builds, and enjoy the narrative!
