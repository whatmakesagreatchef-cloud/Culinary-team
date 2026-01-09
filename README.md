# Culinary Strategy Sim — v0.3.0 (Flat Modular, No Folders)

A single-page culinary competition strategy game where you manage a chef competing through a 12-week season. Balance menu complexity, fatigue, risk, sponsor obligations, and rival pressure to win competitions.

## New in v0.3.0

- **6 Countries + Story Arcs**: Australia (WA), Japan, France, Italy, USA, Thailand - each with unique perks and branching story choices
- **Rival System**: Face a rival competitor with signature menus tracked across competitions
- **Signature Dish Library**: Import competitor signatures in Menu Lab as templates
- **Fundraising Mini-game**: Bronze → Platinum tiers add budget + obligations (miss deliverables → penalties)
- **Report Card Tab**: Win rate, avg score, fatigue avg, top failure cause analysis
- **Telemetry Export**: Compare different builds and strategies

## Features

### Core Loop
- **12-week season** with 4 competitions (weeks 3, 6, 9, 12)
- **Story choices** each week (A/B decisions affecting stats)
- **One action per week**: Train, R&D, Sponsor meetings, Deliverables, Scout, Recovery
- **Random events**: Equipment failures, mentor visits, breakthrough moments
- **Auto-save** to localStorage

### Menu Lab
- Build menus from modular parts: protein, technique, sauce, garnish, dessert
- Generates: Cost, Prep Load, Wow factor, Menu Risk
- Import competitor signatures as templates
- Test cook feature to reduce variance

### Competition System
- Choose approach: Safe / Standard / Bold
- Optional rehearsals: Timing / Clean bench / Taste calibration
- Optional spend (0-400) for last-minute improvements
- Scout rival before competitions to reduce variance
- Rival AI picks signature dishes based on competition emphasis

### Resource Management
- **Stats**: Technique, Palate, Creativity, Cleanliness, Consistency, Composure
- **Resources**: Budget, Reputation, Sponsor Interest
- **Risks**: Fatigue, Risk level, Morale, Prep capacity
- **Obligations**: Sponsor deliverables with deadlines

### Scoring System
Core score from:
- Palate + Technique + Cleanliness + Consistency
- Menu impact (wow + creativity)
- Prep boost (if Prep KPI > menu prep)
- Penalties (fatigue + stacked risk)
- Variance (reduced by scouting + test cooking)

## Installation

### GitHub Pages (Mobile-friendly)
1. Upload all files to your repo root (no folders)
2. GitHub → Settings → Pages → Deploy from branch → `main` / `(root)`
3. Your game will be live at: `https://username.github.io/repo-name/`

### Local Testing
Open `index.html` in a web browser. Works offline after first load.

## File Structure (Flat, No Folders)

```
index.html              # Entry point
styles.css              # All styling
ui.js                   # UI rendering & interactions
systems.js              # Game logic & mechanics
state.js                # State management & localStorage
telemetry.js            # Logging & export
data_countries.js       # Country definitions + story arcs
data_competitors.js     # Rival competitors + signatures
data_menu_parts.js      # Menu component definitions
data_events.js          # Random weekly events
README.md               # This file
```

## Usage Tips

### Build IDs
Use semantic build IDs like `v0.3.1-riskTuned` or `v0.3.2-menuSimplify` to track experiments. Export telemetry after each season to compare what changed.

### Strategy Tips
- **Menu Prep** should stay near/below your **Prep** KPI
- Use **Test Cook** + **Scout Rival** before competition weeks
- Fundraising adds **obligations** - clear them with **Deliver Sponsor Pack**
- If **Fatigue** > 55, morale and consistency will drop
- Competition emphasis affects scoring weights

### Country Perks
- **Australia (WA)**: Extra budget, rep, consistency boost
- **Japan**: High consistency & composure, rep gain boost
- **France**: High technique, sponsor interest, failure risk reduction
- **Italy**: High palate & morale
- **USA**: High prep & creativity
- **Thailand**: High palate & creativity

## Technical Details

- **Vanilla JavaScript** (ES6 modules)
- **No frameworks or build tools**
- **localStorage** for auto-save
- **Responsive CSS Grid** layout
- **Mobile-friendly** interface
- **Offline-capable** after first load

## Browser Compatibility

Works in all modern browsers supporting:
- ES6 modules (`<script type="module">`)
- localStorage
- CSS Grid

## License

Free to use and modify for personal or educational purposes.

## Credits

**Design & Development**: Strategy simulation combining resource management, narrative choices, and competitive pressure.

**Inspiration**: Culinary competitions, roguelike progression, and sports management sims.
