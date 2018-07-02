// TODO properly organize contents of this file

const raycast = document.querySelector('#raycast').getContext('2d', {
  alpha: false
});
raycast.imageSmoothingEnabled = false;

const canvas = document.querySelector('#raycast');

function min (a, b) {
  return a < b ? a : b;
}

const diamond = document.querySelector('#diamond');
const stone = document.querySelector('#stone');
const ceiling = document.querySelector('#ceiling');

const width = 640,
  height = 360;

document.querySelector('#raycast').style.transform = `scale(${(window.innerWidth / (width / 2)).toFixed(2)}, ${(window.innerHeight / (height / 2)).toFixed(2)})`;

const side = 128,
  grid = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  ];
  
const sprites = [{
  x: 128,
  y: 128,
  width: 32,
  height: 32
}];

/// viewport
let p = width,
  d = (width / 2) / Math.tan(Math.PI / 6), // we want 60deg FOV
  playerHeight = 64; // TODO

window.setPlayerHeight = (height) => {
  playerHeight = height; // TODO
};

 let dtheta = (Math.PI / 3) / p;//(2 * Math.atan2(p, d / 2)) / p;

///

 const observer = [640 - 32, 256 + 64 + 32];

// https://stackoverflow.com/questions/24234609/standard-way-to-normalize-an-angle-to-%CF%80-radians-in-java
 const normalizeAngle = (theta) => Math.atan2(Math.sin(theta), Math.cos(theta));

 function distance (a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
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
  getCellUnderVertex,
  stone,
  canvas,
  ceiling,
  sprites
}
