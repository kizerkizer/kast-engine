import * as globals from './globals.mjs';

const maxCastDistance = 25;

function getCastTheta (d, distanceFromCenter) {
  return Math.atan2(distanceFromCenter, d);
}

function cast (theta) {
  theta = globals.normalizeAngle(theta);

  let intersection = globals.observer, 
    hit = false,
    offset,
    which;

  for (let i = 0; i < maxCastDistance && !hit; i++) {
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
  return globals.grid[cell[0]] && globals.grid[cell[0]][cell[1]] === 1;
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

  x = left ? -x : x;
  y = left ? -y : y;

  return [initialVertex[0] + x, initialVertex[1] + y];
}

export {
  cast,
  getCastTheta
}

