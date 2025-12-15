
const canvas = document.getElementById("world");
const ctx = canvas.getContext("2d");
const mini = document.getElementById("minimap");
const mctx = mini.getContext("2d");

function tileColor(t){
  if(t==="grass") return "#6c5";
  if(t==="tree") return "#2f7";
  if(t==="stone") return "#889";
  if(t==="fiber") return "#9c6";
  if(t==="sand") return "#e6d38b";
  if(t==="shell") return "#f0e6d6";
  if(t==="path") return "#d7c4a3";
  if(t==="plaza") return "#cdbfa5";
  if(t==="vendor") return "#d49aa6";
  if(t==="portal") return "#a9d6e5";
  return "#6c5";
}

function drawToast(){
  if(!state.ui.toast) return;
  const t = state.ui.toast;
  const pad = 10;
  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = "rgba(255,247,230,.95)";
  ctx.strokeStyle = "rgba(0,0,0,.08)";
  ctx.lineWidth = 2;
  const w = ctx.measureText(t.text).width + 24;
  const x = 16, y = 16, h = 34;
  roundRect(ctx, x, y, w, h, 16);
  ctx.fill(); ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#2d2d27";
  ctx.font = "900 14px system-ui";
  ctx.fillText(t.text, x+12, y+22);
  ctx.restore();
}

function roundRect(c, x,y,w,h,r){
  c.beginPath();
  c.moveTo(x+r,y);
  c.arcTo(x+w,y,x+w,y+h,r);
  c.arcTo(x+w,y+h,x,y+h,r);
  c.arcTo(x,y+h,x,y,r);
  c.arcTo(x,y,x+w,y,r);
  c.closePath();
}

function drawArea(){
  const area = getArea();
  const tsize = 18; // render tile size (visual), independent from logical tiles
  const viewW = canvas.width, viewH = canvas.height;

  // camera follow
  if(state.camera.follow){
    state.camera.x = state.sim.x + state.sim.px;
    state.camera.y = state.sim.y + state.sim.py;
  }

  const camX = state.camera.x, camY = state.camera.y;
  const tilesOnX = Math.ceil(viewW/tsize)+2;
  const tilesOnY = Math.ceil(viewH/tsize)+2;

  const startX = Math.floor(camX - tilesOnX/2);
  const startY = Math.floor(camY - tilesOnY/2);

  ctx.clearRect(0,0,viewW,viewH);

  for(let yy=0; yy<tilesOnY; yy++){
    for(let xx=0; xx<tilesOnX; xx++){
      const x = startX + xx;
      const y = startY + yy;
      if(x<0||y<0||x>=area.w||y>=area.h) continue;
      const t = area.tiles[y*area.w+x];
      ctx.fillStyle = tileColor(t);
      ctx.fillRect(xx*tsize, yy*tsize, tsize, tsize);
      // add tiny details
      if(t==="tree"){
        ctx.fillStyle="rgba(0,0,0,.12)";
        ctx.fillRect(xx*tsize+6, yy*tsize+6, 6, 6);
      }
      if(t==="portal"){
        ctx.fillStyle="rgba(255,255,255,.65)";
        ctx.fillRect(xx*tsize+4, yy*tsize+4, tsize-8, tsize-8);
      }
    }
  }

  // houses
  state.world.houses.filter(h=>h.areaId===state.area.id).forEach(h=>{
    const sx = (h.x - startX)*tsize;
    const sy = (h.y - startY)*tsize;
    ctx.fillStyle="#b5651d";
    ctx.fillRect(sx+2, sy+2, tsize-4, tsize-4);
  });

  // gather nodes
  area.objects.forEach(o=>{
    const sx = (o.x - startX)*tsize;
    const sy = (o.y - startY)*tsize;
    if(sx<-tsize||sy<-tsize||sx>viewW||sy>viewH) return;
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = o.type==="tree" ? "#1f7" : o.type==="stone" ? "#667" : "#7a5";
    ctx.beginPath();
    ctx.arc(sx+tsize/2, sy+tsize/2, 5, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  // sim
  const simX = (state.sim.x + state.sim.px - startX)*tsize;
  const simY = (state.sim.y + state.sim.py - startY)*tsize;
  ctx.fillStyle = "#ffcc99";
  ctx.beginPath();
  ctx.arc(simX+tsize/2, simY+tsize/2, 7, 0, Math.PI*2);
  ctx.fill();

  // facing indicator
  ctx.fillStyle = "rgba(0,0,0,.25)";
  let fx=0, fy=0;
  if(state.sim.facing==="up") fy=-1;
  if(state.sim.facing==="down") fy=1;
  if(state.sim.facing==="left") fx=-1;
  if(state.sim.facing==="right") fx=1;
  ctx.fillRect(simX+tsize/2 + fx*7 - 2, simY+tsize/2 + fy*7 - 2, 4, 4);

  // toast
  drawToast();
}

function drawMinimap(){
  const area = getArea();
  const w = mini.width, h = mini.height;
  mctx.clearRect(0,0,w,h);

  // background
  mctx.fillStyle="rgba(255,247,230,.9)";
  mctx.fillRect(0,0,w,h);

  // draw simplified tiles
  const sx = w / area.w;
  const sy = h / area.h;
  for(let y=0;y<area.h;y++){
    for(let x=0;x<area.w;x++){
      const t = area.tiles[y*area.w+x];
      mctx.fillStyle = tileColor(t);
      mctx.fillRect(x*sx, y*sy, sx, sy);
    }
  }

  // portals
  area.portals.forEach(p=>{
    mctx.fillStyle="#fff";
    mctx.fillRect(p.x*sx-1, p.y*sy-1, 3, 3);
  });

  // sim marker
  mctx.fillStyle="#000";
  mctx.beginPath();
  mctx.arc((state.sim.x+0.5)*sx, (state.sim.y+0.5)*sy, 3.5, 0, Math.PI*2);
  mctx.fill();
}

window.drawWorld = function(){
  // keep area ensured
  ensureArea(state.area.id);
  drawArea();
  drawMinimap();
};
