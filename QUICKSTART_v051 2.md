# 🚀 Quick Start - V0.5.1 Competition Fix

## 3-Step Integration

### Step 1: Add New Files

Copy these files to your project:
```
competition-manager.js
ui-enhanced.js
styles-enhanced.css
```

### Step 2: Update index.html

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>The Final Season — Culinary Strategy Game</title>
  
  <!-- OLD: <link rel="stylesheet" href="./styles.css"/> -->
  <!-- NEW: --> 
  <link rel="stylesheet" href="./styles-enhanced.css"/>
</head>
<body>

<!-- ... all your HTML stays the same ... -->

<!-- OLD: <script type="module" src="./ui.js"></script> -->
<!-- NEW: -->
<script type="module" src="./ui-enhanced.js"></script>

</body>
</html>
```

### Step 3: Test

1. Open in browser
2. Start new game or continue
3. Progress through week 1-3
4. Competition week 3 should work!

## ✅ Verification

**You'll know it's working when:**
- ✅ Competition tab appears ONLY on weeks 3, 6, 9, 12
- ✅ Competition tab pulses/highlights when required
- ✅ "Advance Week" button is disabled until competition complete
- ✅ Readiness checker shows in competition tab
- ✅ Score breakdown appears after competition
- ✅ Can advance to week 4 after completing week 3 competition

## 🎮 How to Play

### Regular Weeks (1, 2, 4, 5, 7, 8, 10, 11)
1. Read story (if available)
2. Make story choice (if available)
3. Take one action
4. Click "Advance to Next Week"

### Competition Weeks (3, 6, 9, 12)
1. Read story/competition intro
2. **Go to Competition tab**
3. Check readiness
4. Enter competition
5. See results
6. Then can advance week

## 🔧 Troubleshooting

### Problem: Can't advance past week 3
**Solution**: You must complete the competition first
- Click on Competition tab
- Enter and complete the competition
- Then you can advance

### Problem: Competition tab not showing
**Solution**: 
- Check you're using `ui-enhanced.js`
- Check week number (should be 3, 6, 9, or 12)
- Refresh page (Ctrl+F5)

### Problem: Readiness checker not appearing
**Solution**:
- Check you're using `styles-enhanced.css`
- Clear browser cache
- Make sure files are in same directory

### Problem: Old UI still showing
**Solution**:
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Check HTML file is updated
- Verify file names match exactly

## 📋 File Checklist

Make sure you have:
- ✅ `competition-manager.js` (new)
- ✅ `ui-enhanced.js` (replaces ui.js)
- ✅ `styles-enhanced.css` (replaces styles.css)
- ✅ All other files unchanged (systems.js, state.js, data files, etc.)

## 🎯 Key Features

### Readiness Checker
Before competing, check:
- Budget (have enough for entry fee?)
- Fatigue (below 60?)
- Risk (below 25?)
- Menu Prep (matches your prep stat?)
- Scouted (reduced variance?)
- Tested (reduced variance?)

**Pro tip**: Aim for 5+ green checks before competing!

### Score Breakdown
After competing, see:
- Core Skills contribution
- Menu Impact
- Prep Bonus
- Approach modifier
- Random variance
- Penalties

**Pro tip**: Study this to understand what to improve!

### Competition Flow
1. **Week Intro** - Shows competition warning
2. **Competition Tab** - Pulses to draw attention
3. **Readiness Check** - Prepare before entering
4. **Competition** - Enter and execute
5. **Results** - See detailed breakdown
6. **Advance** - Continue to next week

## 💡 Strategy Tips

### Preparation
- **Week 2**: Take "Train Systems" or "R&D Menu"
- **Before Week 3**: Check your menu prep load
- **Week 2-3**: Scout rival if possible (reduces variance)

### During Competition
- **Safe approach** (+4 bonus, low variance) - Recommended for first try
- **Standard approach** (balanced) - When confident
- **Bold approach** (-2 penalty, high variance) - High risk/reward

### After Competition
- **Study score breakdown** - See what worked/didn't
- **Adjust strategy** - Plan for next competition
- **Manage resources** - Replenish budget, reduce fatigue

## 🎮 Full Game Flow

```
Week 1: Story → Action → Advance
Week 2: Story → Action → Advance
Week 3: Story → COMPETITION → Advance ⭐
Week 4: Story → Action → Advance
Week 5: Action → Advance
Week 6: Story → COMPETITION → Advance ⭐
Week 7: Story → Action → Advance
Week 8: Action → Advance
Week 9: Story → COMPETITION → Advance ⭐
Week 10: Story → Action → Advance
Week 11: Story → Action → Advance
Week 12: Story → COMPETITION → Season End ⭐
```

## 🆘 Still Having Issues?

1. **Open browser console** (F12)
2. **Look for errors** (red text)
3. **Check file names** (case-sensitive!)
4. **Verify paths** (all files in same folder?)
5. **Test in incognito** (rules out cache issues)

## 🎉 Success Indicators

You're good to go when you can:
- ✅ Start a new game
- ✅ Complete weeks 1-2
- ✅ See competition tab on week 3
- ✅ See readiness checker
- ✅ Enter and complete competition
- ✅ See score breakdown
- ✅ Advance to week 4

## 📚 Next Steps

Once working:
1. Play through a full season
2. Try different approaches (safe/standard/bold)
3. Experiment with menu combinations
4. Track your scores across competitions
5. Try to beat your rival every time!

---

**Need more help?** Check UPDATE_v051.md for detailed documentation.

**Found a bug?** Note the week, action, and any console errors.

**Want to learn more?** Read the full README_v050.md for game mechanics.

Good luck, Chef! 👨‍🍳🏆
