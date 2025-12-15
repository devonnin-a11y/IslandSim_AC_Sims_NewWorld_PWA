function loop() {
  drawWorld();
  requestAnimationFrame(loop);
}

loop();
