
function nowTicks(){ return state.time.ms; }

window.addMoodlet = function(name, mood, strength, ttlSeconds){
  const s = state.sim;
  const ttl = ttlSeconds * 1000;
  // refresh existing
  const ex = s.moodlets.find(m => m.name === name);
  if(ex){
    ex.mood = mood;
    ex.strength = Math.max(ex.strength, strength);
    ex.expiresAt = nowTicks() + ttl;
    return;
  }
  s.moodlets.push({ name, mood, strength, expiresAt: nowTicks() + ttl });
};

window.tickMoodlets = function(){
  const s = state.sim;
  const t = nowTicks();
  s.moodlets = s.moodlets.filter(m => m.expiresAt > t);

  // Pick strongest moodlet; default Fine
  if(!s.moodlets.length){ s.mood = "Fine"; return; }
  const best = [...s.moodlets].sort((a,b)=>b.strength-a.strength)[0];
  s.mood = best.mood;
};
