
window.map={width:30,height:17,tile:32,tiles:[]};
for(let y=0;y<map.height;y++){
  for(let x=0;x<map.width;x++){
    map.tiles.push({x,y,type:Math.random()<.1?"tree":"grass"});
  }
}
