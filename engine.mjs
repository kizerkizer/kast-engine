import { keys, mouse} from './input.mjs';

const raycast = document.querySelector('#raycast').getContext('2d');
raycast.imageSmoothingEnabled = false;

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
  d = 200,
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

function fillID (imageData, x, y, width, height, color) {
  x = x << 0;
  y = y << 0;
  width = width << 0;
  height = height << 0;
  let idwidth = imageData.width,
    idheight = imageData.height,
    iddata = imageData.data;
  for (let yi = y; yi < y + height; yi++) {
    for (let xi = x; xi < x + width; xi++) {
      let offset0 = yi * idwidth * 4;
      let offset1 = xi * 4;
      iddata[offset0 + offset1 + 0] = color[0];
      iddata[offset0 + offset1 + 1] = color[1];
      iddata[offset0 + offset1 + 2] = color[2];
      iddata[offset0 + offset1 + 3] = color[3];
    }
  }
}

let theta = 0,
  imageData = raycast.createImageData(width, height),
  last = null,
  diamondID = getIDFromImage(diamond);

function draw (timestamp) {
  if (!last) {
    last = timestamp;
  }
  let dt = timestamp - last;
  dt = dt / 50;
  last = timestamp;
  if (keys[37]) {
    theta -= Math.PI / 64 * dt;
  }
  if (keys[39]) {
    theta += Math.PI / 64 * dt;
  }
  let original = [observer[0], observer[1]];
  if (keys[83]) {
    observer[0] -= 3 * Math.cos(theta) * dt;
    observer[1] -= 3 * Math.sin(theta) * dt;
  }
  if (keys[87]) {
    observer[0] += 3 * Math.cos(theta) * dt;
    observer[1] += 3 * Math.sin(theta) * dt;
  }
  let under = getCellUnderVertex(observer);
  if (grid[under[0]][under[1]] === 1) {
    observer[0] = original[0];
    observer[1] = original[1];
  }
  if (keys[65]) {
    observer[0] += 3 * Math.sin(theta) * dt;
    observer[1] += -3 * Math.cos(theta) * dt;
  }
  if (keys[68]) {
    observer[0] += -3 * Math.sin(theta) * dt;
    observer[1] += 3 * Math.cos(theta) * dt;
  }
  fillID(imageData, 0, 0, width, height, [0, 0, 0, 255]);
  for (let i = -p / 2; i <= p / 2; i += 1) {
    let { vertex, hit } = cast(i * dtheta + theta);
    let dist = distance(vertex, observer) * Math.cos(Math.PI / 6);
    let s = 2; // TODO
    let color = hit ? [0, 255, 0, 1] : [128, 128, 128, 1];
    let _height = (side * d) / dist;//((d) / (dist / 90));// + (playerHeight / side);
    let starty = (height / 2) - (_height / 2);
    let startx = i + width / 2;
    fillID(imageData, startx, starty, 1, _height, [0, (255/(dist * 0.02)) << 0, 0, 255]);
  }
  raycast.putImageData(imageData, 0, 0);
  requestAnimationFrame(draw);
}

function rightDrawOneRay2 (initialVertex, theta) {
  theta = normalizeAngle(theta);
  let cellX = initialVertex[0] - getCellUnderVertex(initialVertex)[0] * side,
    cellY = initialVertex[1] - getCellUnderVertex(initialVertex)[1] * side;
  let h = side - cellX + 1;
  let v = Math.tan(theta) * h;
  return [initialVertex[0] + h, initialVertex[1] + v];
}

function leftDrawOneRay2 (initialVertex, theta) {
  theta = normalizeAngle(theta);
  let cellX = initialVertex[0] - getCellUnderVertex(initialVertex)[0] * side,
    cellY = initialVertex[1] - getCellUnderVertex(initialVertex)[1] * side;
  let h = cellX + 1;
  let v =  Math.tan(theta) * h;
  return [initialVertex[0] - h, initialVertex[1] - v];
}

function upDrawOneRay2 (initialVertex, theta) {
  theta = normalizeAngle(theta);
  let cellX = initialVertex[0] - getCellUnderVertex(initialVertex)[0] * side,
    cellY = initialVertex[1] - getCellUnderVertex(initialVertex)[1] * side;
  let v = cellY + 1;
  let h = v / Math.tan(theta);
  return [initialVertex[0] - h, initialVertex[1] - v];
}

function downDrawOneRay2 (initialVertex, theta) {
  theta = normalizeAngle(theta);
  let cellX = initialVertex[0] - getCellUnderVertex(initialVertex)[0] * side,
    cellY = initialVertex[1] - getCellUnderVertex(initialVertex)[1] * side;
  let v = side - cellY + 1;
  let h =  v / Math.tan(theta);
  return [initialVertex[0] + h, initialVertex[1] + v];
}

function min (a, b) {
  return a < b ? a : b;
}

function cast (theta) {
  theta = normalizeAngle(theta);
  let v1 = observer;
  let h1 = observer;
  let current = observer;
  let hit = false;
  let offset;
  for (let i = 0; i < 10; i++) {
    /*if (grid[getCellUnderVertex(current)[0]] && grid[getCellUnderVertex(current)[0]][getCellUnderVertex(current)[1]] === 1) {
      hit = true;
      break;
    }*/
    if (((theta >= 0 && theta <= Math.PI / 2) || (theta <= 0 && theta >= -Math.PI / 2))) {
      v1 = rightDrawOneRay2(current, theta);
    } else {
      v1 = leftDrawOneRay2(current, theta);
    }
    
    if (((theta >= 0 && theta <= Math.PI))) {
      h1 = downDrawOneRay2(current, theta);
    } else {
      h1 = upDrawOneRay2(current, theta);
    }
    
    if (distance(current, v1) < distance(current, h1)) {
      current = v1;
      if (grid[getCellUnderVertex(v1)[0]] && grid[getCellUnderVertex(v1)[0]][getCellUnderVertex(v1)[1]] === 1) {
        hit = true;
        offset = current[1] % side;
        break;
      }
    } else {
      current = h1;
      if (grid[getCellUnderVertex(h1)[0]] && grid[getCellUnderVertex(h1)[0]][getCellUnderVertex(h1)[1]] === 1) {
        hit = true;
        offset = current[0] % side;
        break;
      }
    }
  }
  return {
    vertex: current,
    hit,
    offset
  };
}

requestAnimationFrame(draw);
