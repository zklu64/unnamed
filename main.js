var canvas;
var ctx;
var mouseState = {
  x : 0,
  y : 0,
  selected : null,
  mouseDown : false,
  mouseUp : false,
};

var grass;
var trash1;
var path1;
var turrent1;

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
var turrents = [];

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
      } else if (typeof mapData[i][j] == "string") {
        drawToGrid(path1, j, i);
      } else {
        drawToGrid(grass, j, i);
        drawToGrid(turrent1, j, i);
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
  }
  turrents.attack();
  
  //handle user interactions
  if (mouseState.mouseDown == true) {
    let temp = mapData[Math.floor(mouseState.y / heightPerTile)][Math.floor(mouseState.x / widthPerTile)];
    if (typeof temp == "object" && temp != null) {
      mouseState.selected = temp;
    }
    mouseState.mouseDown = false;
  }
  if (mouseState.mouseUp == true) {
    if (typeof mouseState.selected == "object" && mouseState.selected != null) {
      let targetTile = mapData[Math.floor(mouseState.y / heightPerTile)][Math.floor(mouseState.x / widthPerTile)];
      if (targetTile == '0' || targetTile == '0\r') {
        mapData[mouseState.selected.pos[0]][mouseState.selected.pos[1]] = '0';
        mapData[Math.floor(mouseState.y / heightPerTile)][Math.floor(mouseState.x / widthPerTile)] = mouseState.selected;
        mouseState.selected.onDrop([Math.floor(mouseState.y / heightPerTile), Math.floor(mouseState.x / widthPerTile)]);
      }
      mouseState.selected = null;
    }
    mouseState.mouseUp = false;
  }
  if (mouseState.selected != null) ctx.drawImage(turrent1, mouseState.x - widthPerTile/2, mouseState.y - heightPerTile/2, widthPerTile, heightPerTile);
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
  require(['reIndexOf', 'mob', 'turrent'], function(reIndexOf, mob, turrent) {
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

    //for testing only, set turrent to a fixed location
    mapData[2][2] = new turrent("tutorial", enemies, [2,2]);
    turrents = mapData[2][2];
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
  document.getElementById('canvas').addEventListener('mousedown', function(e) {
    mouseState.mouseDown = true;
  });
  document.getElementById('canvas').addEventListener('mouseup', function(e) {
    mouseState.mouseUp = true;
  });
  document.getElementById('canvas').addEventListener('mousemove', function(e) {
    let rect = canvas.getBoundingClientRect();
    mouseState.x = e.clientX - rect.left;
    mouseState.y = e.clientY - rect.top;
  });
  grass = new Image();
  grass.src = "assets/grass.png"
  trash1 = new Image();
  trash1.src = "assets/trash1.png";
  path1 = new Image();
  path1.src = "assets/path.jpg";
  turrent1 = new Image();
  turrent1.src = "assets/turrent1.png";
  cwidth = canvas.offsetWidth;
  cheight = canvas.offsetHeight;
  loadLevel(1);
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
