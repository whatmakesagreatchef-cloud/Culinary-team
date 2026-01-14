# Update v0.5.3 — Mobile Hotfix (Jan 14, 2026)

This hotfix is focused on **getting the GitHub Pages build running again** and ensuring the **mobile UI always loads correctly**.

## Fixed

- **Game not starting (blank / “no service”)**
  - `index.html` previously referenced files that weren’t present (`competition-manager.js`, `ui.js`).
  - `systems.js` referenced a missing menu parts module (`data_menu_parts.js`).

## Changes included in this pack

- **index.html now points to the mobile-optimized build**
  - Uses `styles-mobile.css` + `ui-mobile-optimized.js`.
- Added missing module filenames (so imports resolve on GitHub Pages):
  - `competition-manager.js` (copied from the working build)
  - `data_menu_parts.js` (alias to the enhanced menu parts set)
  - `ui.js` (alias to the mobile UI module)

## Notes

- `index-mobile.html` is still included as a reference, but **GitHub Pages will load `index.html`**.
- Your saves will continue to use the existing save key defined in `state.js`.

