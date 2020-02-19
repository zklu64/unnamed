const canvas = document.getElementById('canvas');
//TODO convert to css
canvas.style = "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; margin: auto;";
const ctx = canvas.getContext('2d');

var grass = new Image();
grass.src = "assets/grass.png"

var trash1 = new Image();
trash1.src = "assets/trash1.png";

var path1 = new Image();
path1.src = "assets/path.jpg";

const cwidth = canvas.offsetWidth;
const cheight = canvas.offsetHeight;
var row; //how many tiles in a row, determined by level
var col; //how many tiles in a column
var widthPerTile;
var heightPerTile;
var mapData = [];
var startTile;
var enemies = [];

/*
abstracted function to draw images to game grid
*/
function drawToGrid(img, x, y) {
  ctx.drawImage(img, widthPerTile*x, heightPerTile*y, widthPerTile-1, heightPerTile-1);
}

function draw() {
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (mapData[i][j] == '0' || mapData[i][j] == '0\r') {
        drawToGrid(grass, j, i);
      } else {
        drawToGrid(path1, j, i);
      }
    }
  }
  enemies.forEach((item, i) => {
    drawToGrid(trash1, item.tile[1], item.tile[0]);
  });

  requestAnimationFrame(draw);
}

function parseMapData(){
  mapData = [];
  let data = this.responseText.split("\n");
  row = parseInt(data[0].split(/[ ,]+/)[0]);
  col = parseInt(data[0].split(/[ ,]+/)[1]);
  for (let i = 1; i <= row; ++i) {
    mapData.push(data[i].split(/[ ,]+/));
    let startTileInd = mapData[i-1].indexOf('s');
    if (startTileInd != -1) startTile = [i-1, startTileInd];
  }
  widthPerTile = (cwidth / col);
  heightPerTile = (cheight / row);
  //printMap(mapData)

  //setup mobs and shop here before going into draw loop
  require(['mob'], function(m) {
    for (let i = 1; i <= 20; ++i) {
      enemies.push(new m("tutorial", startTile));
    }
  });

  draw();
}

function loadLevel(stageNum)
{
  var request = new XMLHttpRequest();
  request.addEventListener("load", parseMapData);
  request.open("GET", `assets/s${stageNum}.txt`);
  request.send();
}

loadLevel(1);


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
