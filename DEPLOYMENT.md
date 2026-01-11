# 🚀 DEPLOYMENT GUIDE — The Final Season v0.5.2

Complete guide to deploying your culinary competition simulator on various platforms.

## 📦 What You're Deploying

A static web application built with:
- Vanilla JavaScript (ES6 modules)
- HTML5 + CSS3
- No backend required
- No build process needed
- No dependencies to install

**Total size**: ~150KB (loads fast!)

## ✅ Pre-Deployment Checklist

### Required Files
```
✓ index.html              (Entry point)
✓ styles.css              (Mobile-first styling)
✓ ui.js                   (UI management)
✓ config.js               (Game configuration)
✓ utils.js                (Utility functions)
✓ scoring.js              (Scoring engine)
✓ state-manager.js        (State management)
✓ achievements.js         (Achievement system)
✓ competition-manager.js  (Competition logic)
✓ systems.js              (Core game logic)
✓ state.js                (State persistence)
✓ telemetry.js           (Event logging)
✓ data_narrative.js       (Stories and text)
✓ data_countries.js       (Country data)
✓ data_competitors.js     (Rival chefs)
✓ data_menu_parts.js      (Ingredients)
✓ data_events.js          (Random events)
```

### Optional Files
```
□ README.md              (Documentation)
□ QUICKSTART.md          (Getting started guide)
□ favicon.ico            (Browser icon)
□ apple-touch-icon.png   (iOS home screen icon)
```

## 🌐 Deployment Options

### Option 1: GitHub Pages (Recommended for Beginners)

**Pros**: Free, easy, custom domain support, GitHub integration
**Cons**: Public repository required for free tier

#### Steps:
1. **Create Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - The Final Season v0.5.2"
   ```

2. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/the-final-season.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to "Pages"
   - Source: Deploy from branch
   - Branch: main / (root)
   - Click Save

4. **Access Your Game**
   ```
   https://yourusername.github.io/the-final-season/
   ```

**Deployment Time**: 2-3 minutes after push

#### Custom Domain (Optional)
1. Add `CNAME` file with your domain:
   ```
   yourgame.com
   ```
2. Configure DNS:
   - Add CNAME record pointing to: `yourusername.github.io`
3. Enable HTTPS in GitHub Pages settings

---

### Option 2: Netlify (Recommended for Features)

**Pros**: Instant preview, form handling, serverless functions, free SSL
**Cons**: None really!

#### Method A: Drag & Drop (Fastest)
1. Go to [netlify.com](https://netlify.com)
2. Sign up / Log in
3. Drag your project folder to the deploy area
4. Done! Get instant URL

#### Method B: Git Integration (Best for Updates)
1. **Push to GitHub/GitLab/Bitbucket**
2. **Connect to Netlify**
   - New site from Git
   - Choose your repository
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: (leave empty or `/`)
   - Deploy site

3. **Access Your Game**
   ```
   https://random-name-123.netlify.app
   ```

4. **Custom Domain** (Optional)
   - Domain settings → Add custom domain
   - Follow DNS configuration steps

**Deployment Time**: ~30 seconds

#### Netlify Configuration (Optional)
Create `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: Vercel (Recommended for Speed)

**Pros**: Fast CDN, instant deployment, preview URLs, free SSL
**Cons**: Requires account

#### Steps:
1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Or Use Web Interface**
   - Go to [vercel.com](https://vercel.com)
   - Import Git repository
   - Deploy automatically

**Deployment Time**: ~20 seconds

---

### Option 4: Cloudflare Pages

**Pros**: Excellent CDN, unlimited bandwidth, free SSL
**Cons**: Requires Cloudflare account

#### Steps:
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Create new project
3. Connect Git repository
4. Deploy settings:
   - Build command: (none)
   - Output directory: (root)
5. Deploy

**Deployment Time**: ~1 minute

---

### Option 5: Firebase Hosting

**Pros**: Google infrastructure, free tier, easy CLI
**Cons**: Requires Firebase setup

#### Steps:
1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure** (firebase.json)
   ```json
   {
     "hosting": {
       "public": ".",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
     }
   }
   ```

4. **Deploy**
   ```bash
   firebase deploy
   ```

**Deployment Time**: ~1 minute

---

### Option 6: Traditional Web Host (cPanel, FTP)

**Pros**: Works with existing hosting, full control
**Cons**: Manual upload, no automatic deployments

#### Steps:
1. **Via FTP**
   - Connect to your host via FTP client
   - Upload all files to public_html or www folder
   - Ensure index.html is in root

2. **Via cPanel File Manager**
   - Log into cPanel
   - Navigate to File Manager
   - Upload all files to public_html
   - Extract if uploaded as ZIP

3. **Set Permissions** (if needed)
   - Files: 644
   - Directories: 755

**Access**: `https://yourdomain.com/`

---

### Option 7: Local Development

**Pros**: Test locally, no deployment needed
**Cons**: Only accessible on your machine

#### Simple HTTP Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (npx)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

**Access**: `http://localhost:8000`

---

## 🔧 Post-Deployment Configuration

### 1. Test All Features
- [ ] New game creation works
- [ ] Country selection works
- [ ] All tabs navigate properly
- [ ] Actions execute correctly
- [ ] Competitions run successfully
- [ ] Save/load functionality works
- [ ] Mobile responsiveness
- [ ] All 4 competitions (weeks 3, 6, 9, 12)

### 2. Mobile Testing
Test on actual devices:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (tablet view)
- [ ] Bottom tabs work
- [ ] Touch targets are large enough
- [ ] No content cut off by notch
- [ ] Can add to home screen

### 3. Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (desktop)
- [ ] Safari (iOS)
- [ ] Samsung Internet

### 4. Performance Check
Open DevTools → Network:
- All files load quickly (<1s total)
- No 404 errors
- JS modules load correctly
- Check console for errors

---

## 🎨 Customization Before Deploy

### 1. Branding
**Update Title** (index.html):
```html
<title>Your Game Name — Culinary Strategy</title>
```

**Update Version** (index.html):
```html
<div class="version">v0.5.2 — Your Edition</div>
```

### 2. Favicon
Add to `<head>` in index.html:
```html
<link rel="icon" type="image/png" href="favicon.png"/>
<link rel="apple-touch-icon" href="apple-touch-icon.png"/>
```

### 3. Meta Tags (SEO)
Add to `<head>` in index.html:
```html
<meta name="description" content="A strategic culinary competition simulator"/>
<meta property="og:title" content="The Final Season"/>
<meta property="og:description" content="Manage your chef through 20 weeks of competition"/>
<meta property="og:image" content="https://yoursite.com/preview.png"/>
<meta name="twitter:card" content="summary_large_image"/>
```

### 4. Analytics (Optional)
Add before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🔐 Security Best Practices

### 1. HTTPS Only
Always deploy with HTTPS:
- GitHub Pages: Automatic
- Netlify: Automatic
- Vercel: Automatic
- Traditional host: Configure SSL certificate

### 2. Content Security Policy (Optional)
Add to `<head>`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';">
```

### 3. No Sensitive Data
Game stores data in browser localStorage:
- No server-side storage needed
- No API keys required
- No user authentication needed
- All data stays on user's device

---

## 📱 Progressive Web App (Optional)

### Make it Installable

1. **Add manifest.json**:
```json
{
  "name": "The Final Season",
  "short_name": "Final Season",
  "description": "Culinary Strategy Game",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0f16",
  "theme_color": "#66d9ef",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. **Link in index.html**:
```html
<link rel="manifest" href="manifest.json"/>
```

3. **Add Service Worker** (optional, for offline play):
```javascript
// sw.js
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('final-season-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/ui.js',
        // ... all other files
      ]);
    })
  );
});
```

---

## 🐛 Troubleshooting Deployment

### Issue: "Cannot find module"
**Cause**: Incorrect file paths or missing files
**Fix**: 
- Verify all files uploaded
- Check file names are exact (case-sensitive)
- Ensure no typos in imports

### Issue: "Blank white screen"
**Cause**: JavaScript error or incorrect path
**Fix**:
- Open browser console (F12)
- Look for red error messages
- Check Network tab for failed requests
- Verify index.html points to correct files

### Issue: "Game doesn't save"
**Cause**: localStorage blocked
**Fix**:
- Ensure HTTPS (not HTTP)
- Check browser privacy settings
- Try different browser
- Check console for errors

### Issue: "Mobile layout broken"
**Cause**: Viewport meta tag missing or CSS not loading
**Fix**:
- Verify viewport meta tag in <head>
- Check styles.css loaded correctly
- Clear browser cache
- Try hard refresh (Ctrl+F5)

### Issue: "ES6 modules not loading"
**Cause**: Server not sending correct MIME types
**Fix**:
- Add to .htaccess (Apache):
  ```apache
  AddType application/javascript .js
  ```
- Or configure server to serve .js as application/javascript

---

## 📊 Monitoring & Analytics

### Basic Monitoring
Track these metrics:
- Page views
- New games started
- Competitions completed
- Average session duration

### Error Tracking (Optional)
Use service like Sentry:
```html
<script src="https://browser.sentry-cdn.com/7.x.x/bundle.min.js"></script>
<script>
  Sentry.init({ dsn: 'YOUR_DSN' });
</script>
```

---

## 🔄 Update Deployment

### GitHub Pages
```bash
git add .
git commit -m "Update to v0.5.2"
git push
# Automatic deployment in ~2 minutes
```

### Netlify (Git connected)
```bash
git push
# Automatic deployment in ~30 seconds
```

### Manual (FTP)
1. Upload changed files only
2. Clear browser cache
3. Test immediately

---

## 📋 Deployment Checklist

Before going live:
- [ ] All files uploaded
- [ ] HTTPS enabled
- [ ] Mobile tested
- [ ] Desktop tested
- [ ] All tabs work
- [ ] Save/load works
- [ ] Competitions work
- [ ] No console errors
- [ ] Fast loading (<2s)
- [ ] Custom domain configured (if applicable)
- [ ] Analytics added (if desired)
- [ ] Social meta tags added
- [ ] Favicon added

---

## 🎯 Recommended Setup

**For Most Users**: Netlify or Vercel
- Free tier is generous
- Automatic HTTPS
- Fast global CDN
- Easy custom domains
- Instant preview URLs

**For GitHub Users**: GitHub Pages
- Free forever
- Integrated with Git
- Simple setup
- Good for open source

**For Full Control**: Traditional web host
- You own everything
- No platform lock-in
- Works with existing hosting

---

## 📞 Support Resources

**Deployment Issues**:
- GitHub Pages: [docs.github.com/pages](https://docs.github.com/pages)
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Vercel: [vercel.com/docs](https://vercel.com/docs)

**Browser Issues**:
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed loads

**Game Issues**:
- See README.md for game documentation
- Check QUICKSTART.md for gameplay help
- Export telemetry for debugging

---

## ✨ You're Ready!

Choose your deployment platform and get your game live. The setup takes just a few minutes, and you'll have a fully functional culinary strategy game available to players worldwide!

**Happy deploying!** 🚀
