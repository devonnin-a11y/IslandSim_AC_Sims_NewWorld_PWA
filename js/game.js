
window.setSpeed = function(s){
  state.time.speed = s;
  state.ui.toast = { text: s===0 ? "Paused" : `Speed x${s}`, ttl: 90 };
};

// Ensure starting area exists + spawn sim visible
ensureArea(state.area.id);

let last = performance.now();

function simTick(dt){
  state.time.ms += dt*1000;
  // simple clock
  state.time.ms = Math.max(0, state.time.ms);
  if(state.time.speed>0){
    // 1 real second ~ 10 sim minutes at speed 1
    const minutes = dt * state.time.speed * 10;
    state.time.hour += minutes / 60;
    if(state.time.hour >= 24){
      state.time.hour -= 24;
      state.time.day += 1;
    }
  }

  // input movement
  inputTick(dt);

  // needs + moodlets
  tickNeeds(dt);
  tickMoodlets();

  // queue action execution (scaled slightly by speed)
  const q = state.sim.queue;
  if(q.length && state.time.speed>0){
    const done = runAction(q[0], dt * (0.8 + state.time.speed*0.2));
    if(done) q.shift();
  }

  // autonomy pulse
  if(state.time.ms % 2000 < 40) autonomyTick();

  // toast ttl
  if(state.ui.toast){
    state.ui.toast.ttl -= 1;
    if(state.ui.toast.ttl <= 0) state.ui.toast = null;
  }
}

function loop(now){
  const dt = Math.min(0.05, (now - last) / 1000); // cap
  last = now;

  if(state.time.speed !== 0){
    simTick(dt);
  } else {
    // still allow input + camera even when paused
    inputTick(dt);
    tickMoodlets();
  }

  drawWorld();
  renderUI();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
