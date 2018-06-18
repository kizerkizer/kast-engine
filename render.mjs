import * as globals from './globals.mjs';
import { keys, mouse} from './input.mjs';
import { cast } from './cast.mjs';
import { theta } from './movement.mjs';

let imageData = globals.raycast.createImageData(globals.width, globals.height),
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

function scale (sourceImageData, targetImageData, sourceStartX, targetStartX, targetStartY, height) {
  let source = sourceImageData.data;
  let target = targetImageData.data;
  let ratio = sourceImageData.height / height;

  sourceStartX = sourceStartX << 0;
  targetStartX = targetStartX << 0;
  targetStartY = targetStartY << 0;
  height = height << 0;

  for (let j = 0; j < height; j++) {
    let point = ratio * j;
    target[(j + targetStartY) * targetImageData.width * 4 + targetStartX * 4 + 0] = source[64 * (point << 0) * 4 + sourceStartX * 4 + 0]//[64 * 32 * 4 + 32]//source[(point * sourceImageData.width * 4 + sourceStartX * 4 + 0) << 0];
    target[(j + targetStartY) * targetImageData.width * 4 + targetStartX * 4 + 1] = source[64 * (point << 0) * 4 + sourceStartX * 4 + 1]//[64 * 32 * 4 + 33]//source[(point * sourceImageData.width * 4 + sourceStartX * 4 + 1) << 0];
    target[(j + targetStartY) * targetImageData.width * 4 + targetStartX * 4 + 2] = source[64 * (point << 0) * 4 + sourceStartX * 4 + 2]//[64 * 32 * 4 + 34]//source[(point * sourceImageData.width * 4 + sourceStartX * 4 + 2) << 0];
    target[(j + targetStartY) * targetImageData.width * 4 + targetStartX * 4 + 3] = source[64 * (point << 0) * 4 + sourceStartX * 4 + 3]//[64 * 32 * 4 + 35]//source[(point * sourceImageData.width * 4 + sourceStartX * 4 + 3) << 0];
  }
}

export function render (dt) {
  for (let i = -globals.p / 2; i <= globals.p / 2; i += 1) {
    let { vertex, hit, which } = cast(i * globals.dtheta + theta);
    let dist = globals.distance(vertex, globals.observer) * Math.cos(Math.PI / 6);
    let s = 2; // TODO
    let color = hit ? [0, 255, 0, 1] : [128, 128, 128, 1];
    let _height = (globals.side * globals.d) / dist;//((d) / (dist / 90));// + (playerHeight / globals.side);
    let starty = (globals.height / 2) - (_height / 2);
    let startx = i + globals.width / 2;
    fillID(imageData, startx, 0, 1, starty,  [0, 0, 128, 255]); // sky
    if (hit) {
      if (which === `vertical`) {
        //scale(diamondID, imageData, (((vertex[1] << 0) - ((vertex[1] / globals.side) << 0))), startx, starty, _height);
        scale(diamondID, imageData, (vertex[1] % globals.side) << 0, startx, starty, _height);
      } else {
        //scale(diamondID, imageData, (((vertex[0] << 0) - ((vertex[0] / globals.side) << 0))), startx, starty, _height);
        scale(diamondID, imageData, (vertex[0] % globals.side) << 0, startx, starty, _height);
      }
    } else {
      fillID(imageData, startx, starty, 1, _height,  [0, 0, 0, 255]); // "fog"
    }
    fillID(imageData, startx, starty + _height, 1, globals.height - (starty + _height), [128, 128, 128, 255]); // floor
  }
  globals.raycast.putImageData(imageData, 0, 0);
}
