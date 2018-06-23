import * as globals from './globals.mjs';
import { keys, mouse} from './input.mjs';
import { getCastTheta, cast } from './cast.mjs';
import { theta } from './movement.mjs';
import { BitMap, fill, scale, brightness } from './util/bitmaps.mjs';

function makeColor (array) {
  return (array[3] << 24) | (array[2] << 16) | (array[1] << 8) | (array[0] << 0);
}

let bmMain = new BitMap(globals.raycast.createImageData(globals.width, globals.height)),
  bmBricks = new BitMap(globals.getIDFromImage(diamond)),
  bmStone = new BitMap(globals.getIDFromImage(globals.stone)),
  bmTemp = new BitMap(globals.raycast.createImageData(1, globals.side)),
  bmCeil = new BitMap(globals.getIDFromImage(globals.ceiling));

export function render (dt) {
  for (let i = -globals.p / 2; i < globals.p / 2; i++) {
    let angle = getCastTheta(globals.d, i),
      { which, intersection, hit, offset } = cast(angle + theta),
      correctedDistance = correctFishEye(globals.distance(intersection, globals.observer), angle),
      dist = globals.distance(intersection, globals.observer),
      _height = (globals.side * globals.d) / correctedDistance,
      starty = (globals.height - _height) * (globals.playerHeight / globals.side) << 0, // TODO handle playerHeight correctly
      startx = (i + globals.width / 2) << 0;

    // draw ceiling
    for (let k = 0, j = 0; j < starty; j++, k++) {
      let distX = (globals.playerHeight * globals.d) / (j - (globals.height / 2)); // TODO should actually be function of playerHeight
      let distY = distX * Math.tan(angle);
      let vector0 = ((distX * Math.cos(theta) + distY * -Math.sin(theta)) + globals.observer[0]) << 0;
      let vector1 = ((distX * Math.sin(theta) + distY * Math.cos(theta)) + globals.observer[1]) << 0;
      let y = (j) << 0;
      let x = (startx) << 0;
      bmMain.buffer32[y * bmMain.width + x] = bmCeil.buffer32[Math.floor(((vector1 % bmCeil.height) * bmCeil.width) + (vector0 % bmCeil.width))];
    }

    if (hit) {
      // draw tiled, scaled column
      let xOffset = intersection[(which === `horizontal` ? 0 : 1)];
      for (let k = 0; k < globals.side; k++) {
        bmTemp.buffer32[k] = bmBricks.buffer32[Math.floor(((k % bmBricks.height) * bmBricks.width) + (xOffset % bmBricks.width))];
      }
      let darkness = 200 / dist;
      if (darkness <= 1) {
        brightness(bmTemp, 0, 0, 1, bmTemp.height, 200 / dist);
      }
      scale(bmTemp, bmMain, 0, startx, starty, _height);
    } else {
      fill(bmMain, startx, starty, 1, _height,  makeColor([0, 0, 0, 255])); // "fog"
    }

    // draw floor
    for (let k = 0, j = starty + _height; j < globals.height; j++, k++) {
      let distX = (globals.playerHeight * globals.d) / (j - (globals.height / 2)); // TODO should actually be function of playerHeight
      let distY = distX * Math.tan(angle);
      let vector0 = ((distX * Math.cos(theta) + distY * -Math.sin(theta)) + globals.observer[0]) << 0;
      let vector1 = ((distX * Math.sin(theta) + distY * Math.cos(theta)) + globals.observer[1]) << 0;
      let y = (j) << 0;
      let x = (startx) << 0;
      bmMain.buffer32[y * bmMain.width + x] = bmStone.buffer32[Math.floor(((vector1 % bmStone.height) * bmStone.width) + (vector0 % bmStone.width))];
    }
  }

  bmMain.write();
  globals.raycast.putImageData(bmMain.imageData, 0, 0);

}

function correctFishEye (distance, angle) {
  return distance * Math.cos(angle);
}
