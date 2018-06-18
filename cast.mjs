import * as globals from './globals.mjs';

function cast (theta) {
  theta = globals.normalizeAngle(theta);
  let v1 = globals.observer;
  let h1 = globals.observer;
  let current = globals.observer;
  let hit = false;
  let offset;
  let which;
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
        which = `vertical`;
        offset = current[1] % globals.side;
        break;
      }
    } else {
      current = h1;
      if (globals.grid[globals.getCellUnderVertex(h1)[0]] && globals.grid[globals.getCellUnderVertex(h1)[0]][globals.getCellUnderVertex(h1)[1]] === 1) {
        hit = true;
        which = `horizontal`;
        offset = current[0] % globals.side;
        break;
      }
    }
  }
  return {
    vertex: current,
    hit,
    offset,
    which
  };
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

export {
  cast
}
