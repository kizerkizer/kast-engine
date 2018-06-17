// TODO properly organize contents of this file

export const raycast = document.querySelector('#raycast').getContext('2d');
raycast.imageSmoothingEnabled = false;

export const diamond = document.querySelector('#diamond');

export const width = 1280,
  height = 720;

export const side = 64,
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

export let p = width,
  d = 200,
  playerHeight = 32;

export let dtheta = (Math.PI / 3) / p;//(2 * Math.atan2(p, d / 2)) / p;

///

export const observer = [640 - 32, 256 + 64 + 32];

// https://stackoverflow.com/questions/24234609/standard-way-to-normalize-an-angle-to-%CF%80-radians-in-java
export const normalizeAngle = (theta) => Math.atan2(Math.sin(theta), Math.cos(theta));

export function distance (a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

export function getIDFromImage (img) {
  let ctx = document.createElement('canvas').getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

export function getCellUnderVertex (vertex) {
  return [((vertex[0] / side) << 0), ((vertex[1] / side) << 0)];
}
