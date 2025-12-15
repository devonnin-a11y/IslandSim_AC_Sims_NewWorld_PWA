
function pct(v){ return Math.max(0, Math.min(100, v)); }

window.renderUI = function(){
  const s = state.sim;

  document.getElementById("sim-name").textContent = s.name;
  document.getElementById("sim-mood").textContent = `🙂 ${s.mood}`;
  document.getElementById("sim-status").textContent = s.queue.length ? `Doing: ${s.queue[0].label}` : "Ready";

  document.getElementById("area-name").textContent = AREAS[state.area.id].name;

  const setNeed = (id, v) => {
    const el = document.getElementById(`need-${id}`);
    const bar = document.getElementById(`bar-${id}`);
    if(el) el.textContent = Math.round(v);
    if(bar) bar.style.width = `${pct(v)}%`;
    if(bar){
      if(v < 25) bar.style.background = "#e7b7c8";
      else if(v < 45) bar.style.background = "#f3d38b";
      else bar.style.background = "#8bd48b";
    }
  };

  setNeed("hunger", s.needs.hunger);
  setNeed("energy", s.needs.energy);
  setNeed("social", s.needs.social);
  setNeed("hygiene", s.needs.hygiene);
  setNeed("fun", s.needs.fun);

  const qel = document.getElementById("queue");
  if(qel){
    if(!s.queue.length){
      qel.innerHTML = `<div class="muted">No actions queued</div>`;
    } else {
      qel.innerHTML = s.queue.slice(0,6).map((q,i)=>`
        <div class="qitem">
          <div class="qmeta">
            <b>${q.label}</b>
            <span class="muted">${Math.round((q.progress/q.duration)*100)}%</span>
          </div>
          <div class="qbtns">
            <button class="qmini" onclick="moveQueue(${i},-1)">⬆️</button>
            <button class="qmini" onclick="moveQueue(${i},1)">⬇️</button>
            <button class="qmini danger" onclick="cancelQueue(${i})">✖</button>
          </div>
        </div>
      `).join("");
    }
  }
};

window.cancelQueue = function(i){
  state.sim.queue.splice(i,1);
};

window.moveQueue = function(i, dir){
  const q = state.sim.queue;
  const j = i + dir;
  if(j < 0 || j >= q.length) return;
  const tmp = q[i]; q[i] = q[j]; q[j] = tmp;
};

// Click world to place items (build mode)
document.getElementById("world").addEventListener("click", (e)=>{
  if(state.ui.placing !== "house") return;
  const area = getArea();

  const rect = e.target.getBoundingClientRect();
  const xN = (e.clientX - rect.left) / rect.width;
  const yN = (e.clientY - rect.top) / rect.height;

  // map to camera viewport coords (approx) using render constants
  const tsize = 18;
  const viewW = 960, viewH = 540;
  const tilesOnX = Math.ceil(viewW/tsize)+2;
  const tilesOnY = Math.ceil(viewH/tsize)+2;

  const camX = state.camera.x, camY = state.camera.y;
  const startX = Math.floor(camX - tilesOnX/2);
  const startY = Math.floor(camY - tilesOnY/2);

  const tileX = startX + Math.floor(xN * (viewW/tsize));
  const tileY = startY + Math.floor(yN * (viewH/tsize));

  if(tileX<1||tileY<1||tileX>=area.w-1||tileY>=area.h-1) return;

  state.world.houses.push({ areaId: state.area.id, x: tileX, y: tileY });
  state.ui.toast = { text: "House placed!", ttl: 140 };
  state.ui.placing = null;
  document.getElementById("build").classList.remove("show");
});
