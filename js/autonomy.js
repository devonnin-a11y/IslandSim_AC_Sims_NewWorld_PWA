
// Basic autonomy: if idle, push an action to stabilize needs.
window.autonomyTick = function(){
  const s = state.sim;
  if(s.queue.length) return;

  const n = s.needs;
  // prioritize worst need
  const pairs = Object.entries(n).sort((a,b)=>a[1]-b[1]);
  const [need, val] = pairs[0];

  if(val < 35){
    if(need==="hunger") queueAction("EAT");
    else if(need==="energy") queueAction("REST");
    else if(need==="social") queueAction("SOCIAL");
    else if(need==="hygiene") queueAction("BATH");
    else if(need==="fun") queueAction("PLAY");
  }
};
