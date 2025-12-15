
window.setSpeed=s=>state.time.speed=s;
function tick(){
  const s=state.sim;
  s.needs.hunger-=.01*state.time.speed;
  s.needs.energy-=.008*state.time.speed;
  s.needs.social-=.006*state.time.speed;
  if(s.queue.length&&runAction(s.queue[0]))s.queue.shift();
  sim-name.textContent=s.name;
  sim-mood.textContent=s.mood;
  need-hunger.textContent=Math.floor(s.needs.hunger);
  need-energy.textContent=Math.floor(s.needs.energy);
  need-social.textContent=Math.floor(s.needs.social);
  queue.innerHTML=s.queue.map(q=>q.type+" "+q.progress).join("<br>");
}
(function loop(){tick();drawWorld();requestAnimationFrame(loop)})();
window.placeHouse=()=>state.world.houses.push({x:state.sim.x-16,y:state.sim.y-16});
