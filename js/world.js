const canvas = document.getElementById("world");
const ctx = canvas.getContext("2d");

window.drawWorld = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Sim
  ctx.fillStyle = "#ffcc99";
  ctx.beginPath();
  ctx.arc(state.sim.x, state.sim.y, 14, 0, Math.PI * 2);
  ctx.fill();
};
