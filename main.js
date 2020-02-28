var canvas;
var ctx;
var mouseState = {
  x : 0,
  y : 0,
  selected : null,
  clicked : null
};

var grass;
var trash1;
var path1;

var cwidth;
var cheight;
var row; //how many tiles in a row, determined by level
var col; //how many tiles in a column
var widthPerTile;
var heightPerTile;
var mapData = [];
var startTile;
var startDirection = [0,0];
var enemies = [];

/*
abstracted function to draw images to game grid
*/
function drawToGrid(img, x, y) {
  ctx.drawImage(img, widthPerTile*x, heightPerTile*y, widthPerTile-1, heightPerTile-1);
}

//main loop
function draw() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, cwidth, cheight);
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (mapData[i][j] == '0' || mapData[i][j] == '0\r') {
        drawToGrid(grass, j, i);
      } else {
        drawToGrid(path1, j, i);
      }
    }
  }
  for (let i = enemies.length - 1; i >= 0; --i) {
    //draw to canvas and update positions
    drawToGrid(trash1, enemies[i].pos[1], enemies[i].pos[0]);
    enemies[i].pos[0] += (enemies[i].dir[0] * 0.1 * i);
    enemies[i].pos[1] += (enemies[i].dir[1] * 0.1 * i);
    enemies[i].pos[0] = Number(enemies[i].pos[0].toPrecision(2));
    enemies[i].pos[1] = Number(enemies[i].pos[1].toPrecision(2));

    //check if mob needs to be removed
    let ycord = Math.floor(enemies[i].pos[0]);
    let xcord = Math.floor(enemies[i].pos[1]);
    if (ycord < row && ycord >= 0 && xcord < col && xcord >= 0) {
      let dir = mapData[ycord][xcord].match(/[udlr]/);
      if (dir != null) {
        enemies[i].dir = mapDirection(dir[0]);
      }
    } else {
      enemies.splice(i,1);
    }
  };

  //handle user interactions
  if (mouseState.clicked != null) {
    mapData[Math.floor(mouseState.clicked[1] / heightPerTile)][Math.floor(mouseState.clicked[0] / widthPerTile)] = '0';
    mouseState.clicked = null;
  }

  requestAnimationFrame(draw);
}

//get file from same source directory for stageNum
function loadLevel(stageNum)
{
  var request = new XMLHttpRequest();
  request.addEventListener("load", parseMapData);
  request.open("GET", `assets/s${stageNum}.txt`);
  request.send();
}

function parseMapData(){
  mapData = [];
  let data = this.responseText.split("\n");
  row = parseInt(data[0].split(/[ ,]+/)[0]);
  col = parseInt(data[0].split(/[ ,]+/)[1]);
  widthPerTile = (cwidth / col);
  heightPerTile = (cheight / row);
  require(['reIndexOf', 'mob'], function(reIndexOf, mob) {
    for (let i = 1; i <= row; ++i) {
      mapData.push(data[i].split(/[ ,]+/));
      let startTileInd = reIndexOf(mapData[i-1], /s./);
      if (startTileInd != -1) {
        startTile = [i-1, startTileInd];
        let dir = mapData[i-1][startTileInd][1];
        startDirection = mapDirection(dir);
      }
    }

    //setup mobs and shop here before going into draw loop
    for (let i = 1; i <= 20; ++i) {
      let startTileCopy = startTile.slice();
      enemies.push(new mob("tutorial", startTileCopy, startDirection));
    }
    draw();
  });
}

function mapDirection(dir)
{
  if (dir == 'd') {
    return [1, 0];
  } else if (dir == 'u') {
    return [-1, 0];
  } else if (dir == 'l') {
    return [0, -1];
  } else if (dir == 'r') {
    return [0, 1];
  }
}

window.onload = function()
{
  canvas = document.getElementById('canvas');
  //TODO convert to css
  canvas.style = "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; margin: auto;";
  ctx = canvas.getContext('2d');
  document.getElementById('canvas').addEventListener('click', function(e) {
    let pos = getMouse(e);
    mouseState.clicked = [pos.x, pos.y, 1];
  });
  grass = new Image();
  grass.src = "assets/grass.png"
  trash1 = new Image();
  trash1.src = "assets/trash1.png";
  path1 = new Image();
  path1.src = "assets/path.jpg";
  cwidth = canvas.offsetWidth;
  cheight = canvas.offsetHeight;
  loadLevel(1);
  window.addEventListener('mousemove', getMouse, false);
}

function getMouse(e) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function printMap(map)
{
  for (let i = 0; i < map.length; ++i) {
    let output = "";
    for (let j = 0; j < map[i].length; ++j) {
      output += map[i][j];
    }
    console.log(output);
  }
}
