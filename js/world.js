
const c=document.getElementById("world"),ctx=c.getContext("2d");
window.drawWorld=()=>{
  ctx.clearRect(0,0,c.width,c.height);
  map.tiles.forEach(t=>{
    ctx.fillStyle=t.type==="tree"?"#3a7":"#6c5";
    ctx.fillRect(t.x*map.tile,t.y*map.tile,map.tile,map.tile);
  });
  state.world.houses.forEach(h=>{
    ctx.fillStyle="#b5651d";
    ctx.fillRect(h.x,h.y,32,32);
  });
  ctx.fillStyle="#ffcc99";
  ctx.beginPath();ctx.arc(state.sim.x,state.sim.y,12,0,Math.PI*2);ctx.fill();
};
