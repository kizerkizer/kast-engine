import * as globals from './globals.mjs';
import { keys, mouse} from './input.mjs';

let theta = 0,
  imageData = globals.raycast.createImageData(globals.width, globals.height),
  last = null,
  diamondID = globals.getIDFromImage(diamond);

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
  let original = [globals.observer[0], globals.observer[1]];
  if (keys[83]) {
    globals.observer[0] -= 3 * Math.cos(theta) * dt;
    globals.observer[1] -= 3 * Math.sin(theta) * dt;
  }
  if (keys[87]) {
    globals.observer[0] += 3 * Math.cos(theta) * dt;
    globals.observer[1] += 3 * Math.sin(theta) * dt;
  }
  let under = globals.getCellUnderVertex(globals.observer);
  if (globals.grid[under[0]][under[1]] === 1) {
    globals.observer[0] = original[0];
    globals.observer[1] = original[1];
  }
  if (keys[65]) {
    globals.observer[0] += 3 * Math.sin(theta) * dt;
    globals.observer[1] += -3 * Math.cos(theta) * dt;
  }
  if (keys[68]) {
    globals.observer[0] += -3 * Math.sin(theta) * dt;
    globals.observer[1] += 3 * Math.cos(theta) * dt;
  }
  fillID(imageData, 0, 0, globals.width, globals.height, [0, 0, 0, 255]);
  for (let i = -globals.p / 2; i <= globals.p / 2; i += 1) {
    let { vertex, hit } = cast(i * globals.dtheta + theta);
    let dist = globals.distance(vertex, globals.observer) * Math.cos(Math.PI / 6);
    let s = 2; // TODO
    let color = hit ? [0, 255, 0, 1] : [128, 128, 128, 1];
    let _height = (globals.side * globals.d) / dist;//((d) / (dist / 90));// + (playerHeight / globals.side);
    let starty = (globals.height / 2) - (_height / 2);
    let startx = i + globals.width / 2;
    fillID(imageData, startx, starty, 1, _height, [0, (255/(dist * 0.02)) << 0, 0, 255]);
  }
  globals.raycast.putImageData(imageData, 0, 0);
  requestAnimationFrame(draw);
}

function rightDrawOneRay2 (initialVertex, theta) {
  theta = globals.normalizeAngle(theta);
  let cellX = initialVertex[0] - globals.getCellUnderVertex(initialVertex)[0] * globals.side,
    cellY = initialVertex[1] - globals.getCellUnderVertex(initialVertex)[1] * globals.side;
  let h = globals.side - cellX + 1;
  let v = Math.tan(theta) * h;
  return [initialVertex[0] + h, initialVertex[1] + v];
}

function leftDrawOneRay2 (initialVertex, theta) {
  theta = globals.normalizeAngle(theta);
  let cellX = initialVertex[0] - globals.getCellUnderVertex(initialVertex)[0] * globals.side,
    cellY = initialVertex[1] - globals.getCellUnderVertex(initialVertex)[1] * globals.side;
  let h = cellX + 1;
  let v =  Math.tan(theta) * h;
  return [initialVertex[0] - h, initialVertex[1] - v];
}

function upDrawOneRay2 (initialVertex, theta) {
  theta = globals.normalizeAngle(theta);
  let cellX = initialVertex[0] - globals.getCellUnderVertex(initialVertex)[0] * globals.side,
    cellY = initialVertex[1] - globals.getCellUnderVertex(initialVertex)[1] * globals.side;
  let v = cellY + 1;
  let h = v / Math.tan(theta);
  return [initialVertex[0] - h, initialVertex[1] - v];
}

function downDrawOneRay2 (initialVertex, theta) {
  theta = globals.normalizeAngle(theta);
  let cellX = initialVertex[0] - globals.getCellUnderVertex(initialVertex)[0] * globals.side,
    cellY = initialVertex[1] - globals.getCellUnderVertex(initialVertex)[1] * globals.side;
  let v = globals.side - cellY + 1;
  let h =  v / Math.tan(theta);
  return [initialVertex[0] + h, initialVertex[1] + v];
}

function min (a, b) {
  return a < b ? a : b;
}

function cast (theta) {
  theta = globals.normalizeAngle(theta);
  let v1 = globals.observer;
  let h1 = globals.observer;
  let current = globals.observer;
  let hit = false;
  let offset;
  for (let i = 0; i < 10; i++) {
    /*if (globals.grid[getCellUnderVertex(current)[0]] && globals.grid[getCellUnderVertex(current)[0]][getCellUnderVertex(current)[1]] === 1) {
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
    
    if (globals.distance(current, v1) < globals.distance(current, h1)) {
      current = v1;
      if (globals.grid[globals.getCellUnderVertex(v1)[0]] && globals.grid[globals.getCellUnderVertex(v1)[0]][globals.getCellUnderVertex(v1)[1]] === 1) {
        hit = true;
        offset = current[1] % globals.side;
        break;
      }
    } else {
      current = h1;
      if (globals.grid[globals.getCellUnderVertex(h1)[0]] && globals.grid[globals.getCellUnderVertex(h1)[0]][globals.getCellUnderVertex(h1)[1]] === 1) {
        hit = true;
        offset = current[0] % globals.side;
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

export {
  draw
}

