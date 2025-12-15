const canvas = document.getElementById("world");
const ctx = canvas.getContext("2d");

const camera = {
  x: 0,
  y: 0,
  follow: true
};

window.refocusCamera = () => {
  camera.follow = true;
};

function updateCamera() {
  if (!camera.follow) return;

  camera.x = state.sim.x - canvas.width / 2;
  camera.y = state.sim.y - canvas.height / 2;

  // Clamp camera to map bounds
  const maxX = map.width * map.tile - canvas.width;
  const maxY = map.height * map.tile - canvas.height;

  camera.x = Math.max(0, Math.min(camera.x, maxX));
  camera.y = Math.max(0, Math.min(camera.y, maxY));
}

window.drawWorld = () => {
  updateCamera();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw tiles
  map.tiles.forEach(t => {
    const px = t.x * map.tile - camera.x;
    const py = t.y * map.tile - camera.y;

    ctx.fillStyle = t.type === "tree" ? "#3a7" : "#6c5";
    ctx.fillRect(px, py, map.tile, map.tile);
  });

  // Draw houses
  state.world.houses.forEach(h => {
    ctx.fillStyle = "#b5651d";
    ctx.fillRect(h.x - camera.x, h.y - camera.y, 32, 32);
  });

  // Draw Sim (ALWAYS LAST)
  ctx.fillStyle = "#ffcc99";
  ctx.beginPath();
  ctx.arc(
    state.sim.x - camera.x,
    state.sim.y - camera.y,
    12,
    0,
    Math.PI * 2
  );
  ctx.fill();
};
