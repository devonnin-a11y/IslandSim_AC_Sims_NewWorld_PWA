
function clamp(v){ return Math.max(0, Math.min(100, v)); }

window.queueAction = function(type){
  const labelMap = {
    EAT:"Eat", REST:"Rest", SOCIAL:"Chat", GATHER:"Gather", CRAFT:"Craft", BATH:"Clean", PLAY:"Play"
  };
  state.sim.queue.push({
    type,
    label: labelMap[type] || type,
    progress: 0,
    duration: actionDuration(type),
    meta: {}
  });
};

function actionDuration(type){
  // seconds (scaled by speed elsewhere)
  if(type==="EAT") return 3.0;
  if(type==="REST") return 4.0;
  if(type==="SOCIAL") return 3.0;
  if(type==="BATH") return 3.0;
  if(type==="PLAY") return 3.0;
  if(type==="GATHER") return 2.2;
  if(type==="CRAFT") return 3.5;
  return 3.0;
}

// Gather from nearby node
function nearestGatherNode(area){
  const sx = state.sim.x, sy = state.sim.y;
  let best = null, bd = 9999;
  for(const o of area.objects){
    const d = Math.abs(o.x-sx)+Math.abs(o.y-sy);
    if(d < bd){
      bd = d; best = o;
    }
  }
  return { node: best, dist: bd };
}

function gainXP(skill, amount){
  const s = state.sim.skills[skill];
  s.xp += amount;
  const need = 100 + (s.level-1)*35;
  if(s.xp >= need){
    s.xp -= need;
    s.level += 1;
    addMoodlet(`${skill} Lv ${s.level}`, "Inspired", 2, 10);
    state.ui.toast = { text: `⭐ ${skill} reached Lv ${s.level}`, ttl: 160 };
  }
}

window.runAction = function(item, dt){
  const sim = state.sim;
  item.progress += dt;

  if(item.progress < item.duration) return false;

  const area = getArea();

  switch(item.type){
    case "EAT":
      sim.needs.hunger = clamp(sim.needs.hunger + 35);
      sim.needs.energy = clamp(sim.needs.energy - 3);
      addMoodlet("Well Fed", "Happy", 2, 12);
      break;

    case "REST":
      sim.needs.energy = clamp(sim.needs.energy + 45);
      sim.needs.hunger = clamp(sim.needs.hunger - 5);
      addMoodlet("Rested", "Happy", 2, 10);
      break;

    case "SOCIAL":
      sim.needs.social = clamp(sim.needs.social + 35);
      sim.needs.fun = clamp(sim.needs.fun + 10);
      addMoodlet("Good Chat", "Happy", 1, 10);
      break;

    case "BATH":
      sim.needs.hygiene = clamp(sim.needs.hygiene + 50);
      addMoodlet("Fresh", "Happy", 1, 12);
      break;

    case "PLAY":
      sim.needs.fun = clamp(sim.needs.fun + 50);
      sim.needs.energy = clamp(sim.needs.energy - 6);
      addMoodlet("Having Fun", "Happy", 1, 10);
      break;

    case "GATHER": {
      const { node, dist } = nearestGatherNode(area);
      if(!node || dist > 2){
        state.ui.toast = { text: "No resource nearby", ttl: 120 };
        break;
      }
      node.hp -= 1;
      if(node.type==="tree") sim.inventory.wood += 1;
      if(node.type==="fiber") sim.inventory.fiber += 1;
      if(node.type==="stone") sim.inventory.stone += 1;
      if(node.type==="shell") sim.inventory.fiber += 1;

      gainXP("gathering", 18);
      addMoodlet("Gathering", "Focused", 1, 8);

      if(node.hp <= 0){
        // respawn the node type into a weaker tile marker
        node.hp = 3;
        state.ui.toast = { text: "Node depleted (will regrow)", ttl: 120 };
      }
      break;
    }

    case "CRAFT": {
      // Simple craft: consume 2 wood + 1 fiber -> crafting xp
      if(sim.inventory.wood < 2 || sim.inventory.fiber < 1){
        state.ui.toast = { text: "Need 2 Wood + 1 Fiber", ttl: 150 };
        break;
      }
      sim.inventory.wood -= 2;
      sim.inventory.fiber -= 1;
      gainXP("crafting", 26);
      addMoodlet("Crafted", "Inspired", 1, 10);
      break;
    }
  }

  return true;
};
