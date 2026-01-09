# The Final Season — v0.4.0 (Narrative Edition)

A narrative-driven culinary strategy game where you manage a chef through 12 weeks of intense competition.

## What's New in v0.4.0 - Narrative Edition

### 🎭 Full Story Experience
- **Title Screen** - Proper game menu with New Game / Continue / About
- **Character Creation** - Choose from 6 countries, each with unique backstory
- **Week Intros** - Narrative setup for each week with context and stakes
- **Competition Intros** - Story moments before each major competition
- **Ending Narratives** - Multiple endings based on your performance

### 🎬 Screen Flow
1. Title Screen → Character Creation → Backstory
2. Week Intro → Game Screen (Story/Actions/Menu/Competition tabs)
3. Competition Results → Week Intro (repeat)
4. Season End → Credits & Stats

### 🎮 Enhanced Gameplay
- **Tab-Based Interface** - Story, Actions, Menu Lab, Competition (when available)
- **Progress Tracking** - Visual progress bars, week-by-week narrative
- **Pause Menu** - Save, Export Telemetry, Help, Quit to Title
- **Better Feedback** - Animated transitions, result screens, visual polish

### 📖 Story Features
- **6 Unique Backstories** - Each country has deep narrative context
- **Weekly Narratives** - Story beats for every week
- **Choice Consequences** - Story choices have mechanical effects
- **Multiple Endings** - Champion, Respected Finalist, or Lessons Learned

## Countries & Backstories

### 🦘 Australia (WA)
*Ocean to red dirt. Provenance + standards.*
- Perks: Extra budget, rep, consistency boost
- Rival: France
- Story: Learn standards in harsh conditions, prove regional identity matters

### 🇯🇵 Japan
*Precision culture. Calm is power.*
- Perks: High consistency & composure, rep gain boost
- Rival: USA
- Story: Silent discipline vs loud ambition

### 🇫🇷 France
*Technique expected. Organisation wins.*
- Perks: High technique, sponsor interest, failure risk reduction
- Rival: Japan
- Story: Escape the weight of tradition, prove you're more than a name

### 🇮🇹 Italy
*Simplicity, depth, timing. Perfect the basics.*
- Perks: High palate & morale
- Rival: Thailand
- Story: Flavor conquers everything—if you can execute

### 🇺🇸 USA
*Big swings, big speed, big pressure.*
- Perks: High prep & creativity
- Rival: Japan
- Story: Speed and ambition vs precision and restraint

### 🇹🇭 Thailand
*Balance, aroma, heat. Clean chaos.*
- Perks: High palate & creativity
- Rival: Italy
- Story: Intuitive balance vs structured simplicity

## Gameplay Loop

Each week:
1. **Week Intro** - Story setup, check stats
2. **Story Choice** - A/B decision affecting stats (if available)
3. **Action** - One weekly action (train, R&D, scout, etc.)
4. **Advance** - Move to next week (recovery, events, obligations)
5. **Competition** - Weeks 3, 6, 9, 12 (plan approach, rehearsal, spend)

## Key Systems

### Menu Lab
- Build from: Protein, Technique, Sauce, Garnish, Dessert
- Generates: Cost, Prep Load, Wow Factor, Risk
- Import competitor signatures as templates
- Test cook to reduce variance

### Competition Planning
- **Approach**: Safe / Standard / Bold (affects variance & score)
- **Rehearsal**: Timing / Clean Bench / Taste (adds bonuses)
- **Optional Spend**: 0-400 for last-minute improvements

### Resource Management
- **Stats**: Technique, Palate, Creativity, Cleanliness, Consistency, Composure
- **Resources**: Budget, Reputation, Sponsor Interest
- **Risks**: Fatigue (drops morale/consistency), Risk (increases penalties)
- **Obligations**: Sponsor deliverables with deadlines

### Rival System
- Each country faces a specific rival with signature dishes
- Rivals compete alongside you in competitions
- Track rival wins vs your wins

## Installation

### GitHub Pages
1. Upload all files to repo root (no folders)
2. Settings → Pages → Deploy from `main` / `(root)`
3. Game will be live at: `https://username.github.io/repo-name/`

### Local
Open `index.html` in a modern browser. Works offline.

## File Structure

```
index.html              # Entry point with screen system
styles.css              # Enhanced styling with animations
ui.js                   # Screen management & narrative flow
systems.js              # Game logic & mechanics
state.js                # State management & localStorage
telemetry.js            # Logging & export
data_narrative.js       # Backstories, week narratives, endings
data_countries.js       # Country definitions + story arcs
data_competitors.js     # Rival competitors + signatures
data_menu_parts.js      # Menu component definitions
data_events.js          # Random weekly events
```

## Controls

- **Arrow Keys / Mouse** - Navigate menus and choices
- **ESC** - Open pause menu (or click Menu button)
- **Tab-based navigation** - Story / Actions / Menu Lab / Competition

## Strategy Tips

### Early Game (Weeks 1-4)
- Build solid foundations (technique, cleanliness)
- Don't overextend on sponsor obligations
- Keep menu prep manageable

### Mid Game (Weeks 5-8)
- Scout rival before Week 6 competition
- Manage fatigue (recovery week around Week 7)
- Refine menu based on competition emphasis

### Late Game (Weeks 9-12)
- Test cook before Week 9 and 12
- Clear all obligations before final
- Balance risk vs consistency for final push

## Browser Compatibility

Requires modern browser with:
- ES6 modules
- CSS Grid
- localStorage
- CSS animations

## Credits

**Design & Development**: Narrative culinary strategy sim
**Version**: v0.4.0 - Narrative Edition
**Previous Version**: v0.3.0 - Modular flat structure

## License

Free to use and modify for personal or educational purposes.
