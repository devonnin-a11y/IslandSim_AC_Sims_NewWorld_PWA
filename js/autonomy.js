
setInterval(()=>{
  const s=state.sim;
  if(s.queue.length)return;
  if(s.needs.hunger<40)queueAction("EAT");
  else if(s.needs.energy<40)queueAction("REST");
},2000);
