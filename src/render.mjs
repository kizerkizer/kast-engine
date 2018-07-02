import * as globals from './globals.mjs';
import { keys, mouse} from './input.mjs';
import { getCastTheta, cast } from './cast.mjs';
import { theta } from './movement.mjs';
import { BitMap, fill, scale, brightness, pack, createBitmapFromImageElement } from './util/bitmaps.mjs';
import * as textures from './textures.mjs';

let bmMain = new BitMap(globals.raycast.createImageData(globals.width, globals.height));

let wallTexture = textures.bmStone;

setTimeout(() => {
  wallTexture = createBitmapFromImageElement(document.body.querySelector('#hiresbricks'));
}, 1000);

let angle;

export function render (dt) {
  for (let i = -globals.p / 2; i < globals.p / 2; i++) {
    angle = getCastTheta(globals.d, i);
    let { which, intersection, hit, offset, isCorner } = cast(angle + theta);
    let correctedDistance = correctFishEye(globals.distance(intersection, globals.observer), angle),
      dist = globals.distance(intersection, globals.observer),
      height = (globals.side * globals.d) / correctedDistance,
      starty = (globals.height - height) * (globals.playerHeight / globals.side) << 0,
      startx = (i + globals.width / 2) << 0;
    // draw ceiling
    for (let k = 0, j = 0; j < starty; j++, k++) {
      textureVertex(startx, j, textures.bmCeil, bmMain);
      let darkness = starty / (0.5 * j);
      if (darkness <= 1) {
        brightness(bmMain, startx, j, 1, 1, darkness);
      }
    }
    if (hit || isCorner) {
      // draw tiled, scaled column
      //if (isCorner) {
        //fill(bmMain, startx, starty, 1, height,  pack([0, 255, 0, 255]));
      //} else {
        let xOffset = intersection[(which === `horizontal` ? 0 : 1)];
        let ratio = globals.side / height;
        for (let k = 0, j = starty; j < starty + height; j++, k++) {
          drawPixelFromTexture(xOffset, k * ratio, startx, j, wallTexture, bmMain);
        }
        let darkness = 200 / dist;
        if (darkness <= 1) {
          brightness(bmMain, startx, starty, 1, height, darkness);
        }
      //}
    } else {
      fill(bmMain, startx, starty, 1, height,  pack([0, 0, 0, 255])); // "fog"
    }
    // draw floor
    let count = 0;
    for (let k = (globals.height - starty - height), j = globals.height; j > starty + height; j--, k--) {
      textureVertex(startx, j, textures.bmStone, bmMain);
      let darkness = ((globals.height - starty - height) / (k * 0.5)) //* 0.5;
      darkness = 1 / darkness;
      if (darkness <= 1) {
        brightness(bmMain, startx, j, 1, 1, darkness);
      }
    }
  }
  bmMain.write();
  globals.raycast.putImageData(bmMain.imageData, 0, 0);
}


function drawPixelFromTexture (sx, sy, tx, ty, bmSource, bmTarget) {
  sx = sx << 0;
  sy = sy << 0;
  tx = tx << 0;
  ty = ty << 0;
  bmTarget.buffer32[ty * bmTarget.width + tx] = bmSource.buffer32[Math.floor(((sy % bmSource.height) * bmSource.width) + (sx % bmSource.width))];
}

function textureVertex (planeX, planeY, bmSource, bmTarget) {
  let distX, distY, vector0, vector1, y, x;
  distX = Math.abs((globals.playerHeight * globals.d) / (planeY - (globals.height / 2)));
  distY = distX * Math.tan(angle);
  vector0 = ((distX * Math.cos(theta) + distY * -Math.sin(theta)) + globals.observer[0]) << 0;
  vector1 = ((distX * Math.sin(theta) + distY * Math.cos(theta)) + globals.observer[1]) << 0;
  y = planeY << 0;
  x = (planeX) << 0;
  drawPixelFromTexture(vector0, vector1, x, y, bmSource, bmTarget);
}

function correctFishEye (distance, angle) {
  return distance * Math.cos(angle);
}
