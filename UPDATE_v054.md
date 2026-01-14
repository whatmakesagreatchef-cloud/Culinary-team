# Update v0.5.4 — Storage-Safe Hotfix

## What was broken
On some mobile browsers (especially iOS Safari in Private/Restricted storage mode), `localStorage.setItem(...)` can throw.

Because the title screen "New Game" button saves immediately, that exception stopped the click handler mid-flight — making the opening menu buttons feel like they "did nothing".

## What’s fixed
- `saveState()` and `resetLocal()` are now **fail-soft** (wrapped in try/catch) so the UI continues even if persistence is unavailable.
- Build id strings updated to `v0.5.4`.

## Notes
If your browser blocks storage, the game will still run, but it won’t be able to persist saves between refreshes.
