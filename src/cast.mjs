import * as globals from './globals.mjs';

const maxCastDistance = 25;

function getCastTheta (d, distanceFromCenter) {
  return Math.atan2(distanceFromCenter, d);
}

function isCornerVertex (vertex) {
  let x = vertex[0] << 0,
    y = vertex[1] << 0;
  if (x % globals.side === globals.side - 1 && y % globals.side === 0) { // top right
    return `tr`;
  }
  if (x % globals.side === globals.side - 1 && y % globals.side === globals.side - 1) { // bottom right
    return `br`;
  }
  if (x % globals.side === 0 && y % globals.side === globals.side - 1) { // bottom left
    return `bl`;
  }
  if (x % globals.side === 0 && y % globals.side === 0) { // top left 
    return `tl`;
  }
  return false;
}

function isSolidCornerVertex (vertex) {
  // TODO ors or ands?
  let result = isCornerVertex(vertex);
  if (!result) {
    return false;
  }
  let [cellX, cellY] = globals.getCellUnderVertex(vertex);
  if (result === `tr`) {
    if ((globals.grid[cellX + 1] && globals.grid[cellX + 1][cellY] && globals.grid[cellX + 1][cellY] === 1)
      ||(globals.grid[cellX] && globals.grid[cellX][cellY - 1] && globals.grid[cellX][cellY - 1] === 1)) {
      return true;
    } else {
      return false;
    }
  }
  if (result === `tl`) {
    if ((globals.grid[cellX - 1] && globals.grid[cellX - 1][cellY] && globals.grid[cellX - 1][cellY] === 1)
      ||(globals.grid[cellX] && globals.grid[cellX][cellY - 1] && globals.grid[cellX][cellY - 1] === 1)) {
      return true;
    } else {
      return false;
    }
  }
  if (result === `br`) {
    if ((globals.grid[cellX + 1] && globals.grid[cellX + 1][cellY] && globals.grid[cellX + 1][cellY] === 1)
      ||(globals.grid[cellX] && globals.grid[cellX][cellY + 1] && globals.grid[cellX][cellY + 1] === 1 )) {
      return true;
    } else {
      return false;
    }
  }
  if (result === `bl`) {
    if ((globals.grid[cellX - 1] && globals.grid[cellX - 1][cellY] && globals.grid[cellX - 1][cellY] === 1)
      ||(globals.grid[cellX] && globals.grid[cellX][cellY + 1] && globals.grid[cellX][cellY + 1] === 1)) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

function cast (theta) {
  theta = globals.normalizeAngle(theta);

  let intersection = globals.observer, 
    hit = false,
    offset,
    which;

  for (let i = 0; i < maxCastDistance && !hit; i++) {
    /*if (isCorner = isSolidCornerVertex(intersection)) {
      hit = true;
      break;
    }*/
    ({which, offset, intersection} = getNextIntersection(intersection, theta));
    hit = isCollision(intersection);
  }

 

  return {
    intersection,
    hit,
    offset,
    which
  };
}

function isCollision (vertex) {
  let cell = globals.getCellUnderVertex(vertex);
  return (globals.grid[cell[0]] && globals.grid[cell[0]][cell[1]] === 1) || isSolidCornerVertex(vertex);
}

function getNextIntersection (initialVertex, theta) {
  let intersectionHorizontal = getNextIntersectionHorizontal(initialVertex, theta),
    intersectionVertical = getNextIntersectionVertical(initialVertex, theta);

  if (globals.distance(initialVertex, intersectionHorizontal) < globals.distance(initialVertex, intersectionVertical)) {
    return {
      intersection: intersectionHorizontal,
      which: `horizontal`,
      offset: intersectionHorizontal[0] % globals.side
    };
  } else {
    return {
      intersection: intersectionVertical,
      which: `vertical`,
      offset: intersectionVertical[1] % globals.side
    };
  }
}

function getNextIntersectionHorizontal (initialVertex, theta) {
  theta = globals.normalizeAngle(theta);

  let up = !((theta >= 0 && theta <= Math.PI)),
    cell = globals.getCellUnderVertex(initialVertex);

  let cellX = initialVertex[0] - cell[0] * globals.side,
    cellY = initialVertex[1] - cell[1] * globals.side;

  let y = up ? (cellY + 1) : (globals.side - cellY + 1),
    x = y / Math.tan(theta);

  let cy = up ? cellY : (globals.side - cellY),
    cx = cy / Math.tan(theta);

  if (isSolidCornerVertex([initialVertex[0] + cx, initialVertex[1] + cy])) {
    //cx = up ? -cx : cx;
    //cy = up ? -cy : cy;
    return [initialVertex[0] + cx, initialVertex[1] + cy];
  }
  y = up ? -y : y;
  x = up ? -x : x;

  return [initialVertex[0] + x, initialVertex[1] + y];
}

function getNextIntersectionVertical (initialVertex, theta) {
  theta = globals.normalizeAngle(theta);

  let left = !((theta >= 0 && theta <= Math.PI / 2) || (theta <= 0 && theta >= -Math.PI / 2)),
    cell = globals.getCellUnderVertex(initialVertex);

  let cellX = initialVertex[0] - cell[0] * globals.side,
    cellY = initialVertex[1] - cell[1] * globals.side;

  let x = left ? (cellX + 1) : (globals.side - cellX + 1),
    y = x * Math.tan(theta);

  let cx = left ? cellX : (globals.side - cellX),
    cy = cx * Math.tan(theta);

  if (isSolidCornerVertex([initialVertex[0] + cx, initialVertex[1] + cy])) {
    //cx = left ? -cx : cx;
    //cy = left ? -cy : cy;
    return [initialVertex[0] + cx, initialVertex[1] + cy];
  }


  x = left ? -x : x;
  y = left ? -y : y;

  return [initialVertex[0] + x, initialVertex[1] + y];
}

export {
  cast,
  getCastTheta
}

