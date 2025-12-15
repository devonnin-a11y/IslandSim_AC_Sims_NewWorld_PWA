const canvas = document.getElementById("world");
const ctx = canvas.getContext("2d");
const mini = document.getElementById("minimap");
const mctx = mini ? mini.getContext("2d") : null;

// Failsafe: if anything breaks, we still draw the sim in the center.
function drawFallback() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = "#87ceeb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#7ec850";
  ctx.fillRect(0, canvas.height * 0.55, canvas.width, canvas.height * 0.45);

  // Sim (center)
  ctx.fillStyle = "#ffcc99";
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 14, 0, Math.PI * 2);
  ctx.fill();

  // Debug text
  ctx.fillStyle = "rgba(0,0,0,.55)";
  ctx.font = "900 14px system-ui";
  ctx.fillText("Fallback render (world error)", 14, 24);
}

// Normal draw (area tiles + camera)
function tileColor(t) {
  if (t === "grass") return "#6c5";
  if (t === "tree") return "#2f7";
  if (t === "stone") return "#889";
  if (t === "fiber") return "#9c6";
  if (t === "sand") return "#e6d38b";
  if (t === "shell") return "#f0e6d6";
  if (t === "path") return "#d7c4a3";
  if (t === "plaza") return "#cdbfa5";
  if (t === "vendor") return "#d49aa6";
  if (t === "portal") return "#a9d6e5";
  return "#6c5";
}

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function drawToast() {
  if (!state.ui.toast) return;
  const t = state.ui.toast;

  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = "rgba(255,247,230,.95)";
  ctx.strokeStyle = "rgba(0,0,0,.08)";
  ctx.lineWidth = 2;

  ctx.font = "900 14px system-ui";
  const w = ctx.measureText(t.text).width + 24;
  const x = 16, y = 16, h = 34;
  roundRect(ctx, x, y, w, h, 16);
  ctx.fill();
  ctx.stroke();

  ctx.globalAlpha = 1;
  ctx.fillStyle = "#2d2d27";
  ctx.fillText(t.text, x + 12, y + 22);
  ctx.restore();
}

function drawAreaAndSim() {
  const area = (typeof getArea === "function") ? getArea() : null;
  if (!area) return drawFallback();

  const tsize = 18;
  const viewW = canvas.width, viewH = canvas.height;

  // camera follow: keep it centered on sim
  if (state.camera && state.camera.follow) {
    state.camera.x = state.sim.x + (state.sim.px || 0);
    state.camera.y = state.sim.y + (state.sim.py || 0);
  }
  const camX = (state.camera?.x ?? state.sim.x);
  const camY = (state.camera?.y ?? state.sim.y);

  const tilesOnX = Math.ceil(viewW / tsize) + 2;
  const tilesOnY = Math.ceil(viewH / tsize) + 2;

  const startX = Math.floor(camX - tilesOnX / 2);
  const startY = Math.floor(camY - tilesOnY / 2);

  ctx.clearRect(0, 0, viewW, viewH);

  // tiles
  for (let yy = 0; yy < tilesOnY; yy++) {
    for (let xx = 0; xx < tilesOnX; xx++) {
      const x = startX + xx;
      const y = startY + yy;
      if (x < 0 || y < 0 || x >= area.w || y >= area.h) continue;
      const t = area.tiles[y * area.w + x];
      ctx.fillStyle = tileColor(t);
      ctx.fillRect(xx * tsize, yy * tsize, tsize, tsize);
    }
  }

  // houses
  (state.world.houses || [])
    .filter(h => h.areaId === state.area.id)
    .forEach(h => {
      const sx = (h.x - startX) * tsize;
      const sy = (h.y - startY) * tsize;
      ctx.fillStyle = "#b5651d";
      ctx.fillRect(sx + 2, sy + 2, tsize - 4, tsize - 4);
    });

  // sim
  const simX = (state.sim.x + (state.sim.px || 0) - startX) * tsize;
  const simY = (state.sim.y + (state.sim.py || 0) - startY) * tsize;

  ctx.fillStyle = "#ffcc99";
  ctx.beginPath();
  ctx.arc(simX + tsize / 2, simY + tsize / 2, 7, 0, Math.PI * 2);
  ctx.fill();

  drawToast();

  // minimap
  if (!mctx || !mini) return;

  const w = mini.width, h = mini.height;
  mctx.clearRect(0, 0, w, h);
  mctx.fillStyle = "rgba(255,247,230,.9)";
  mctx.fillRect(0, 0, w, h);

  const sx = w / area.w;
  const sy = h / area.h;
  for (let y = 0; y < area.h; y++) {
    for (let x = 0; x < area.w; x++) {
      const t = area.tiles[y * area.w + x];
      mctx.fillStyle = tileColor(t);
      mctx.fillRect(x * sx, y * sy, sx, sy);
    }
  }

  // sim marker
  mctx.fillStyle = "#000";
  mctx.beginPath();
  mctx.arc((state.sim.x + 0.5) * sx, (state.sim.y + 0.5) * sy, 3.5, 0, Math.PI * 2);
  mctx.fill();
}

window.drawWorld = function () {
  try {
    // Ensure area exists
    if (typeof ensureArea === "function") ensureArea(state.area.id);
    drawAreaAndSim();
  } catch (err) {
    drawFallback();
  }
};
