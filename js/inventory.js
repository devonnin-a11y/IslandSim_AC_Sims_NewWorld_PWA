
window.renderInventory = function(){
  const el = document.getElementById("inv");
  if(!el) return;
  const inv = state.sim.inventory;
  el.innerHTML = `
    <div class="inv-grid">
      <div class="inv-item">🪵 Wood <b>${inv.wood}</b></div>
      <div class="inv-item">🌾 Fiber <b>${inv.fiber}</b></div>
      <div class="inv-item">🪨 Stone <b>${inv.stone}</b></div>
    </div>
    <div class="muted" style="margin-top:10px">Crafting uses resources (New World loop).</div>
  `;
};

window.toggleInventory = function(){
  const el = document.getElementById("inventory");
  el.classList.toggle("show");
  if(el.classList.contains("show")) renderInventory();
};
