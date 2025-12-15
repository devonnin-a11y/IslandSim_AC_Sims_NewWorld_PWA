
window.move=dir=>{
  const s=state.sim;
  if(dir==="up")s.y-=s.speed;
  if(dir==="down")s.y+=s.speed;
  if(dir==="left")s.x-=s.speed;
  if(dir==="right")s.x+=s.speed;
};
window.queueAction=type=>state.sim.queue.push({type,progress:0});
window.togglePhone=()=>phone.classList.toggle("show");
window.openCAS=()=>cas.classList.add("show");
window.closeCAS=()=>cas.classList.remove("show");
window.toggleBuild=()=>build.classList.toggle("show");
window.closeBuild=()=>build.classList.remove("show");
window.saveCAS=()=>{
  state.sim.name=cas-name.value||state.sim.name;
  state.sim.appearance.height=cas-height.value/100;
  state.sim.appearance.weight=cas-weight.value/100;
  closeCAS();
};
document.addEventListener("keydown",e=>{
  if(e.key.startsWith("Arrow"))move(e.key.replace("Arrow","").toLowerCase());
});
