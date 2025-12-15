
let keyState = { up:false, down:false, left:false, right:false };

function setKey(k, v){
  if(k==="ArrowUp") keyState.up=v;
  if(k==="ArrowDown") keyState.down=v;
  if(k==="ArrowLeft") keyState.left=v;
  if(k==="ArrowRight") keyState.right=v;
}

document.addEventListener("keydown", e => setKey(e.key, true));
document.addEventListener("keyup", e => setKey(e.key, false));

// D-pad hold: tap triggers a short burst; holding on mobile can be done by repeated taps for now
window.moveHold = function(dir){
  if(dir==="up") keyState.up = true;
  if(dir==="down") keyState.down = true;
  if(dir==="left") keyState.left = true;
  if(dir==="right") keyState.right = true;
  setTimeout(()=>{
    if(dir==="up") keyState.up = false;
    if(dir==="down") keyState.down = false;
    if(dir==="left") keyState.left = false;
    if(dir==="right") keyState.right = false;
  }, 120);
};

function moveStep(dt){
  const a = getArea();
  const s = state.sim;

  // smooth sub-tile movement (px/py), keep tile coords consistent
  const speedTiles = s.speed * (0.75 + state.time.speed*0.25); // small feel change by speed
  let dx = 0, dy = 0;

  if(keyState.up) dy -= speedTiles*dt;
  if(keyState.down) dy += speedTiles*dt;
  if(keyState.left) dx -= speedTiles*dt;
  if(keyState.right) dx += speedTiles*dt;

  if(dx===0 && dy===0) return;

  // direction
  if(Math.abs(dx) > Math.abs(dy)) s.facing = dx>0 ? "right" : "left";
  else s.facing = dy>0 ? "down" : "up";

  s.px += dx;
  s.py += dy;

  // carry into tiles
  while(s.px > 1){ s.x += 1; s.px -= 1; }
  while(s.px < -1){ s.x -= 1; s.px += 1; }
  while(s.py > 1){ s.y += 1; s.py -= 1; }
  while(s.py < -1){ s.y -= 1; s.py += 1; }

  // clamp inside bounds, and handle edge travel by portals
  if(s.x < 0){ travelTo(AREA_LINKS[state.area.id].west, "east"); }
  if(s.x >= a.w){ travelTo(AREA_LINKS[state.area.id].east, "west"); }
  if(s.y < 0){ travelTo(AREA_LINKS[state.area.id].north, "south"); }
  if(s.y >= a.h){ travelTo(AREA_LINKS[state.area.id].south, "north"); }
}

window.inputTick = moveStep;

// UI toggles + CAS/build
window.togglePhone = function(){
  document.getElementById("phone").classList.toggle("show");
};

window.openCAS = function(){
  const el = document.getElementById("cas");
  el.classList.add("show");
  document.getElementById("cas-name").value = state.sim.name;
  document.getElementById("cas-height").value = Math.round(state.sim.appearance.height*100);
  document.getElementById("cas-weight").value = Math.round(state.sim.appearance.weight*100);
};

window.closeCAS = function(){
  document.getElementById("cas").classList.remove("show");
};

window.saveCAS = function(){
  const name = document.getElementById("cas-name").value.trim();
  if(name) state.sim.name = name;
  state.sim.appearance.height = document.getElementById("cas-height").value/100;
  state.sim.appearance.weight = document.getElementById("cas-weight").value/100;
  closeCAS();
};

window.toggleBuild = function(){
  document.getElementById("build").classList.toggle("show");
  state.ui.placing = null;
};

window.closeBuild = function(){
  document.getElementById("build").classList.remove("show");
  state.ui.placing = null;
};

window.startPlaceHouse = function(){
  state.ui.placing = "house";
  state.ui.toast = { text: "Click the world to place a house", ttl: 180 };
};

window.refocus = function(){
  state.camera.follow = true;
  state.ui.toast = { text: "Camera refocused", ttl: 90 };
};

// Journal/Inventory
window.toggleJournal = function(){
  const el = document.getElementById("journal");
  el.classList.toggle("show");
  if(el.classList.contains("show")) renderQuests();
};

// Alias so the HUD button works even if you call refocusCamera()
window.refocusCamera = function () {
  state.camera.follow = true;
  state.ui.toast = { text: "Camera refocused", ttl: 90 };
};


