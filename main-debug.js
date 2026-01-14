import { loadState, saveState, defaultState } from "./state.js";
import { render } from "./ui_screens.js";

console.log('🚀 Main.js loading...');

let state = loadState();
console.log('📊 State loaded:', state);

// first-run onboarding
if(!state.seenSetup){
  state.route = "setup";
  console.log('👋 First run detected, showing setup');
}

// allow ui_screens to request a fresh default
window.__RESIM_DEFAULT_STATE__ = defaultState;

function setState(mutator){
  console.log('🔄 setState called');
  state = mutator(state) || state;
  saveState(state);
  refresh();
}

function refresh(){
  console.log('🎨 Refreshing UI, route:', state.route);
  document.querySelectorAll(".tab").forEach(btn=>{
    const r = btn.getAttribute("data-route");
    btn.classList.toggle("active", r === state.route);
  });
  render(state, setState);
  console.log('✅ Render complete');
}

document.addEventListener("click", (e)=>{
  console.log('🖱️ Click detected:', e.target);
  
  const help = e.target.closest("[data-action=\"help\"]");
  if(help){
    console.log('❓ Help button clicked');
    setState(s=>{ s.route = "setup"; return s; });
    return;
  }

  const tab = e.target.closest(".tab");
  if(tab){
    const r = tab.getAttribute("data-route");
    console.log('📑 Tab clicked:', r);
    setState(s=>{ s.route = r; return s; });
  }
});

console.log('🎬 Initial refresh...');
refresh();
console.log('✨ Game initialized!');

// Expose for debugging
window.DEBUG = {
  state: () => state,
  setState,
  refresh
};
console.log('🐛 Debug available: window.DEBUG');
