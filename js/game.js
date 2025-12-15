window.setSpeed = function (s) {
  state.time.speed = s;
  state.ui.toast = { text: s === 0 ? "Paused" : `Speed x${s}`, ttl: 90 };
};

const debugEl = document.getElementById("debugOverlay");
function showDebug(msg) {
  if (!debugEl) return;
  debugEl.style.display = "block";
  debugEl.textContent = msg;
}

// Show any runtime error ON SCREEN (mobile friendly)
window.addEventListener("error", (e) => {
  showDebug(`ERROR: ${e.message}\n${e.filename}:${e.lineno}:${e.colno}`);
});
window.addEventListener("unhandledrejection", (e) => {
  showDebug(`PROMISE ERROR: ${e.reason}`);
});

// Ensure starting area exists (never crash silently)
try {
  if (typeof ensureArea === "function") ensureArea(state.area.id);
} catch (err) {
  showDebug("ensureArea failed: " + err.message);
}

let last = performance.now();

function simTick(dt) {
  state.time.ms += dt * 1000;

  // clock
  if (state.time.speed > 0) {
    const minutes = dt * state.time.speed * 10;
    state.time.hour += minutes / 60;
    if (state.time.hour >= 24) {
      state.time.hour -= 24;
      state.time.day += 1;
    }
  }

  // movement
  if (typeof inputTick === "function") inputTick(dt);

  // needs + moodlets
  if (typeof tickNeeds === "function") tickNeeds(dt);
  if (typeof tickMoodlets === "function") tickMoodlets();

  // queue execution
  const q = state.sim.queue;
  if (q.length && state.time.speed > 0 && typeof runAction === "function") {
    const done = runAction(q[0], dt * (0.8 + state.time.speed * 0.2));
    if (done) q.shift();
  }

  // autonomy pulse
  if (typeof autonomyTick === "function" && state.time.ms % 2000 < 40) autonomyTick();

  // toast ttl
  if (state.ui.toast) {
    state.ui.toast.ttl -= 1;
    if (state.ui.toast.ttl <= 0) state.ui.toast = null;
  }
}

function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  try {
    if (state.time.speed !== 0) simTick(dt);
    else if (typeof inputTick === "function") inputTick(dt);

    // DRAW ALWAYS (even if UI fails)
    if (typeof drawWorld === "function") drawWorld();
    if (typeof renderUI === "function") renderUI();
  } catch (err) {
    showDebug("Loop crash: " + err.message);
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
