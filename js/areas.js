
window.AREAS = {
  meadow: { name: "Meadow", w: 48, h: 30, seed: 1337 },
  beach:  { name: "Beach",  w: 48, h: 30, seed: 2025 },
  forest: { name: "Forest", w: 48, h: 30, seed: 9001 },
  town:   { name: "Town",   w: 48, h: 30, seed: 4040 }
};

// World graph: edges to travel (portals are also stamped on borders)
window.AREA_LINKS = {
  meadow: { north: "forest", south: "beach", east: "town", west: "forest" },
  beach:  { north: "meadow", south: "beach", east: "beach", west: "beach" },
  forest: { south: "meadow", north: "forest", east: "forest", west: "forest" },
  town:   { west: "meadow", east: "town", north: "town", south: "town" }
};
