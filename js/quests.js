
window.QUESTS = [
  { id:"q1", title:"Gather Basics", desc:"Collect 3 Wood and 3 Fiber.", done:false },
  { id:"q2", title:"First Craft", desc:"Craft 1 Simple Tool.", done:false },
  { id:"q3", title:"Settle In", desc:"Place your first House.", done:false }
];

function check(){
  const inv = state.sim.inventory;
  QUESTS.forEach(q=>{
    if(q.id==="q1" && inv.wood>=3 && inv.fiber>=3) q.done = true;
    if(q.id==="q2" && state.sim.skills.crafting.level>=2) q.done = true;
    if(q.id==="q3" && state.world.houses.some(h=>h.areaId===state.area.id)) q.done = true;
  });
}

window.renderQuests = function(){
  check();
  const el = document.getElementById("quests");
  if(!el) return;
  el.innerHTML = QUESTS.map(q=>`
    <div class="qcard">
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:center">
        <div style="font-weight:1000">${q.done ? "✅" : "⬜"} ${q.title}</div>
        <div class="muted">${q.done ? "Complete" : "In Progress"}</div>
      </div>
      <div class="muted" style="margin-top:4px">${q.desc}</div>
    </div>
  `).join("");
};

window.toggleJournal = function(){
  const el = document.getElementById("journal");
  el.classList.toggle("show");
  if(el.classList.contains("show")) renderQuests();
};
