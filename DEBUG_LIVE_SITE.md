# 🐛 DEBUGGING YOUR LIVE SITE

Your site: https://whatmakesagreatchef-cloud.github.io/Culinary-team/

## Quick Diagnosis

### Step 1: Open Browser Console
1. Visit your site: https://whatmakesagreatchef-cloud.github.io/Culinary-team/
2. Press **F12** (or right-click → Inspect)
3. Click **Console** tab
4. Take a screenshot of any RED errors

### Step 2: Check What You See
Which of these describes what you see?

**A) Complete blank page**
→ JavaScript not loading at all

**B) You see the game interface but buttons don't respond**
→ Event listeners not attaching

**C) Tabs at bottom work, but buttons in content don't work**
→ Specific button issue

**D) Loading screen forever**
→ Module loading issue (covered in TROUBLESHOOTING.md)

---

## Fix Option 1: Use Debug Version

I've created `main-debug.js` with console logging.

### Replace main.js temporarily:
1. In your GitHub repo, edit `index.html`
2. Change this line:
```html
<script type="module" src="./main.js"></script>
```
3. To this:
```html
<script type="module" src="./main-debug.js"></script>
```
4. Commit changes
5. Wait 30 seconds
6. Refresh your site
7. Open console (F12)
8. You'll see:
```
🚀 Main.js loading...
📊 State loaded: {...}
👋 First run detected, showing setup
🎬 Initial refresh...
🎨 Refreshing UI, route: setup
✅ Render complete
✨ Game initialized!
🐛 Debug available: window.DEBUG
```

### Now click a button:
- You should see: `🖱️ Click detected: <element>`
- If you DON'T see this → Problem is event delegation
- If you DO see it but nothing happens → Problem is in setState

---

## Fix Option 2: Check Common Issues

### Issue: Cached Old Version
**Symptom**: Game shows old version even after updating

**Fix**:
```
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Or: Open in Incognito/Private mode
3. Or: Clear site data:
   F12 → Application → Storage → Clear site data
```

### Issue: GitHub Pages Not Rebuilding
**Symptom**: Changes don't appear after push

**Fix**:
```
1. Go to repo → Actions tab
2. Check if build is still running (yellow dot)
3. Wait for green checkmark
4. Usually takes 30-60 seconds
```

### Issue: Files in Wrong Location
**Symptom**: 404 errors in console

**Fix**:
```
1. Verify ALL files are in repository ROOT
2. No folders/subdirectories
3. Check Settings → Pages shows "Your site is published"
```

---

## Fix Option 3: Test Individual Components

### Test State Loading:
Open console on your live site and run:
```javascript
localStorage.getItem('resim_v1_save')
```

**If null**: No save exists (normal for first visit)
**If string**: Save exists, game should work

### Test Manual Render:
```javascript
// Force a render
window.DEBUG.refresh()
```

**If this works**: Event system is broken
**If this fails**: Render function has error

---

## Fix Option 4: Compare With Working Version

### Your current files should match:
```
index.html - Basic HTML structure
main.js - Event handling
state.js - State management  
ui_screens.js - Render logic (large file ~150KB)
```

### Critical checks:
1. **index.html** has: `<script type="module" src="./main.js"></script>`
2. **main.js** has: `import { render } from "./ui_screens.js";`
3. **All .js files** are in ROOT (not in folders)

---

## What To Share For Help

If still not working, share:

1. **Screenshot of browser console** (F12 → Console)
2. **What you see** (blank page? interface but no buttons work? tabs work?)
3. **Error messages** (any red text in console)
4. **Network tab** (F12 → Network → refresh → any red/failed requests?)

---

## Most Likely Cause

Based on "buttons don't work":

**Hypothesis**: The game is loading but event listeners aren't attaching to dynamically created content.

**Solution**: The original code should handle this correctly via event delegation on `document.addEventListener("click")`.

**To verify**: Use debug version (main-debug.js) and watch console when you click.

---

## Quick Test Commands

Run these in your browser console on the live site:

```javascript
// Test 1: Check if game loaded
console.log(typeof window.__RESIM_DEFAULT_STATE__)
// Should say: "function"

// Test 2: Check current route  
console.log(document.querySelector('.tab.active')?.dataset.route)
// Should say: "setup" or current tab

// Test 3: Try manual navigation
document.querySelector('[data-route="world"]')?.click()
// Should navigate to World tab

// Test 4: Check for errors
console.error('Test error')
// Should show red error (proves console works)
```

---

## Nuclear Option: Fresh Deploy

If nothing works:

1. Delete repository
2. Create new repository
3. Re-extract ZIP
4. Upload ALL files fresh
5. Enable Pages
6. Test in incognito mode

---

## Expected Behavior

**On first visit:**
1. Loading screen (brief flash)
2. Setup screen appears
3. Tabs at bottom are clickable
4. "Start setup wizard" button works
5. Can navigate between all tabs

**Console should show:**
- No red errors
- All .js files load successfully (check Network tab)

---

Let me know what you see in console and I'll help fix it!
