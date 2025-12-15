
function clamp(v){ return Math.max(0, Math.min(100, v)); }

// Reworked Sims-like needs: base decay + situational modifiers + mood penalties
window.tickNeeds = function(dt){
  const s = state.sim;
  const sp = Math.max(0, state.time.speed);

  // Base per-second decay rates (tuned for feel)
  const base = {
    hunger: 0.45,
    energy: 0.35,
    social: 0.28,
    hygiene: 0.22,
    fun: 0.26
  };

  // While queueing actions, some needs decay faster (effort)
  const working = s.queue.length ? 1.10 : 1.0;

  s.needs.hunger  = clamp(s.needs.hunger  - base.hunger  * dt * sp * working);
  s.needs.energy  = clamp(s.needs.energy  - base.energy  * dt * sp * working);
  s.needs.social  = clamp(s.needs.social  - base.social  * dt * sp);
  s.needs.hygiene = clamp(s.needs.hygiene - base.hygiene * dt * sp);
  s.needs.fun     = clamp(s.needs.fun     - base.fun     * dt * sp);

  // Threshold moodlets
  if(s.needs.hunger < 25) addMoodlet("Hungry", "Uncomfortable", 2, 12);
  if(s.needs.energy < 20) addMoodlet("Tired", "Uncomfortable", 2, 12);
  if(s.needs.social < 20) addMoodlet("Lonely", "Sad", 2, 12);
  if(s.needs.hygiene < 18) addMoodlet("Grimy", "Uncomfortable", 2, 12);
  if(s.needs.fun < 18) addMoodlet("Bored", "Sad", 2, 12);

  // Minor recovery if needs are high
  if(s.needs.energy > 85) addMoodlet("Well Rested", "Happy", 1, 10);
};
