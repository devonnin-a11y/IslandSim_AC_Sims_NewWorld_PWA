
const effects={
  EAT:s=>{s.needs.hunger=Math.min(100,s.needs.hunger+30);s.mood="Happy"},
  REST:s=>{s.needs.energy=Math.min(100,s.needs.energy+30)},
  SOCIAL:s=>{s.needs.social=Math.min(100,s.needs.social+25)},
  GATHER:s=>{s.mood="Focused"},
  CRAFT:s=>{s.mood="Inspired"}
};
window.runAction=item=>{
  item.progress++;
  if(item.progress>30){effects[item.type]?.(state.sim);return true}
  return false;
};
