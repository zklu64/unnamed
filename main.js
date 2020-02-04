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
let instances = 20;
let widthPerTile = cwidth / instances;
let heightPerTile = cheight / instances;

function errorHandler(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
}

function onInitFs(fs) {
  fs.root.getFile('assets/s1.txt', {}, function(fileEntry) {

    // Get a File object representing the file,
    // then use FileReader to read its contents.
    fileEntry.file(function(file) {
       var reader = new FileReader();

       reader.onloadend = function(e) {
         var txtArea = document.createElement('textarea');
         txtArea.value = this.result;
         document.body.appendChild(txtArea);
       };

       reader.readAsText(file);
    }, errorHandler);

  }, errorHandler);
}

window.storageInfo.requestQuota(TEMPORARY, 1024*1024,
    function(grantedBytes) {
        window.requestFileSystem(window.TEMPORARY, grantedBytes, onInitFs, errorHandler);
    },
    errorHandler
);

function draw() {
  for (i = 0; i < instances; i++) {
    for (j = 0; j < instances; j++) {
      ctx.drawImage(grass, widthPerTile*j, heightPerTile*i, widthPerTile-1, heightPerTile-1);
    }
  }
  ctx.drawImage(trash1, 0, 0);
  requestAnimationFrame(draw);
}

function readTextFile(file)
{
  var request = new XMLHttpRequest();
  request.open("GET", file, true);
  request.send(null);
  var returnValue = request.responseText;
  return returnValue;
}

draw();
