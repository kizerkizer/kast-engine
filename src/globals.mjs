// TODO properly organize contents of this file

const raycast = document.querySelector('#raycast').getContext('2d');
raycast.imageSmoothingEnabled = false;

function min (a, b) {
  return a < b ? a : b;
}

const diamond = document.querySelector('#diamond');

const width = 1280,
  height = 720;

const side = 64,
  grid = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  ];
  
/// viewport

let p = width,
  d = (width / 2) / Math.tan(Math.PI / 6), // we want 60deg FOV
  playerHeight = 32;

 let dtheta = (Math.PI / 3) / p;//(2 * Math.atan2(p, d / 2)) / p;

///

 const observer = [640 - 32, 256 + 64 + 32];

// https://stackoverflow.com/questions/24234609/standard-way-to-normalize-an-angle-to-%CF%80-radians-in-java
 const normalizeAngle = (theta) => Math.atan2(Math.sin(theta), Math.cos(theta));

 function distance (a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

 function getIDFromImage (img) {
  let ctx = document.createElement('canvas').getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

 function getCellUnderVertex (vertex) {
  return [((vertex[0] / side) << 0), ((vertex[1] / side) << 0)];
}

 export {
  p,
  d,
  playerHeight,
  raycast,
  diamond,
  width,
  height,
  side,
  grid,
  dtheta,
  observer,
  normalizeAngle,
  distance,
  getIDFromImage,
  getCellUnderVertex
}
