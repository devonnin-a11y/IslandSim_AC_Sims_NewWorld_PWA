window.move = function(dir) {
  const sim = state.sim;
  if (dir === "up") sim.y -= sim.speed;
  if (dir === "down") sim.y += sim.speed;
  if (dir === "left") sim.x -= sim.speed;
  if (dir === "right") sim.x += sim.speed;
};

window.queue = function(action) {
  state.sim.queue.push(action);
  console.log("Queued:", action);
};

window.togglePhone = function() {
  document.getElementById("phone").classList.toggle("show");
};

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") move("up");
  if (e.key === "ArrowDown") move("down");
  if (e.key === "ArrowLeft") move("left");
  if (e.key === "ArrowRight") move("right");
});
