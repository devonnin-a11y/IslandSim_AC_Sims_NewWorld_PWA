
window.state = {
  time: { speed: 1, ms: 0, day: 1, hour: 8 },
  camera: { x: 0, y: 0, follow: true },
  area: { id: "meadow" },
  sim: {
    id: "sim-1",
    name: "Sim",
    x: 15, y: 9,             // tile coords
    px: 0, py: 0,             // sub-tile for smooth move
    speed: 4.0,               // tiles/sec baseline
    facing: "down",
    mood: "Fine",
    moodlets: [],             // {name, mood, strength, ttl}
    needs: {
      hunger: 75,
      energy: 75,
      social: 70,
      hygiene: 70,
      fun: 65
    },
    appearance: { height: 0.5, weight: 0.5 },
    skills: { gathering: { level: 1, xp: 0 }, crafting: { level: 1, xp: 0 } },
    inventory: { wood: 0, fiber: 0, stone: 0 },
    queue: [],                // {type,label,progress,duration,meta}
  },
  world: {
    areas: {},                // id -> {w,h,tiles,portals,objects}
    houses: []                // {areaId, x,y}
  },
  ui: {
    placing: null,            // "house" | null
    toast: null               // {text, ttl}
  }
};

// Failsafe spawn
state.sim.x = Math.max(100, Math.min(state.sim.x, map.width * map.tile - 100));
state.sim.y = Math.max(100, Math.min(state.sim.y, map.height * map.tile - 100));
