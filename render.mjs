import * as globals from './globals.mjs';
import { keys, mouse} from './input.mjs';
import { cast } from './cast.mjs';
import { theta } from './movement.mjs';

import * as txStone from './stonetexturebase64.mjs';

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

function drawShrunkColumn (targetImageData, sourceImageData, targetX, sourceX, height) {
  let tData = targetImageData.data,
    sData = sourceImageData.data;
  let ratio = targetImageData.height / sourceImageData.height;
  for (let yi = 0; yi < targetImageData.height; yi++) {
    let sourcePixel = ratio * yi * sourceImageData.width * 4 + sourceX * 4,
      targetPixel = yi * targetImageData.width * 4 + targetX * 4;
    tData[targetPixel + 0] = sData[sourcePixel + 0]
    tData[targetPixel + 1] = sData[sourcePixel + 1]
    tData[targetPixel + 2] = sData[sourcePixel + 2]
    tData[targetPixel + 3] = sData[sourcePixel + 3]
  }
}

export function render (dt) {
  for (let i = -globals.p / 2; i <= globals.p / 2; i += 1) {
    let { vertex, hit } = cast(i * globals.dtheta + theta);
    let dist = globals.distance(vertex, globals.observer) * Math.cos(Math.PI / 6);
    let s = 2; // TODO
    let color = hit ? [0, 255, 0, 1] : [128, 128, 128, 1];
    let _height = (globals.side * globals.d) / dist;//((d) / (dist / 90));// + (playerHeight / globals.side);
    let starty = (globals.height / 2) - (_height / 2);
    let startx = i + globals.width / 2;

    fillID(imageData, startx, 0, 1, starty,  [0, 0, 128, 255]); // sky
    fillID(imageData, startx, starty, 1, _height, [0, (255/(dist * 0.02)) << 0, 0, 255]); // block
    fillID(imageData, startx, starty + _height, 1, globals.height - (starty + _height), [128, 128, 128, 255]); // floor
  }
  globals.raycast.putImageData(imageData, 0, 0);
}
