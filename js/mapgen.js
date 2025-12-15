
function rng(seed){
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}
function idx(x,y,w){ return y*w + x; }

function genArea(id){
  const def = AREAS[id];
  const r = rng(def.seed);
  const w = def.w, h = def.h;
  const tiles = new Array(w*h).fill("grass");

  // Stamp biomes
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const n = r();
      let t = "grass";
      if(id==="beach"){
        t = y > h*0.62 ? "sand" : "grass";
        if(n<0.06 && y < h*0.55) t = "tree";
        if(n<0.03 && y > h*0.62) t = "shell";
      } else if(id==="forest"){
        t = "grass";
        if(n<0.18) t = "tree";
        if(n<0.03) t = "stone";
      } else if(id==="town"){
        t = (x>18 && x<30 && y>10 && y<20) ? "plaza" : "path";
        if(n<0.04 && t!=="plaza") t = "vendor";
      } else { // meadow
        if(n<0.10) t = "tree";
        if(n<0.04) t = "stone";
        if(n<0.03) t = "fiber";
      }
      tiles[idx(x,y,w)] = t;
    }
  }

  // Portals on edges (visual markers)
  const portals = [];
  // north
  portals.push({ x: Math.floor(w/2), y: 0, dir: "north", to: AREA_LINKS[id]?.north || id });
  // south
  portals.push({ x: Math.floor(w/2), y: h-1, dir: "south", to: AREA_LINKS[id]?.south || id });
  // east
  portals.push({ x: w-1, y: Math.floor(h/2), dir: "east", to: AREA_LINKS[id]?.east || id });
  // west
  portals.push({ x: 0, y: Math.floor(h/2), dir: "west", to: AREA_LINKS[id]?.west || id });

  portals.forEach(p => { tiles[idx(p.x,p.y,w)] = "portal"; });

  // Objects: gather nodes (New World loop)
  const objects = [];
  for(let i=0;i<40;i++){
    const x = Math.floor(r()*w), y = Math.floor(r()*h);
    const t = tiles[idx(x,y,w)];
    if(t==="tree" || t==="fiber" || t==="stone" || t==="shell"){
      objects.push({ x,y, type: t, hp: 3 });
    }
  }

  return { id, name: def.name, w,h, tiles, portals, objects };
}

window.ensureArea = function(id){
  if(!state.world.areas[id]) state.world.areas[id] = genArea(id);
  return state.world.areas[id];
};

window.getArea = function(){
  return ensureArea(state.area.id);
};

window.travelTo = function(nextId, spawnDir){
  ensureArea(nextId);
  state.area.id = nextId;
  const a = getArea();
  // Spawn opposite edge based on entry direction
  if(spawnDir==="north"){ state.sim.x = Math.floor(a.w/2); state.sim.y = a.h-2; }
  if(spawnDir==="south"){ state.sim.x = Math.floor(a.w/2); state.sim.y = 1; }
  if(spawnDir==="east"){ state.sim.x = 1; state.sim.y = Math.floor(a.h/2); }
  if(spawnDir==="west"){ state.sim.x = a.w-2; state.sim.y = Math.floor(a.h/2); }
  state.sim.px = 0; state.sim.py = 0;
  state.camera.follow = true;
  state.ui.toast = { text: `Entered ${AREAS[nextId].name}`, ttl: 120 };
};
