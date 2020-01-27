const canvas = document.getElementById('canvas');
//TODO convert to css
canvas.style = "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; margin: auto;";
const ctx = canvas.getContext('2d');

var grass = new Image();
grass.src = "assets/grass.png"

var trash1 = new Image();
trash1.src = "assets/trash1.png";

function draw() {
  ctx.drawImage(grass, 0, 0);
  ctx.drawImage(trash1, 0, 0, 300, 300);
  requestAnimationFrame(draw);
}

draw();
