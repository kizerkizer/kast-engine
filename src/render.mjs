import * as globals from './globals.mjs';
import { keys, mouse} from './input.mjs';
import { getCastTheta, cast } from './cast.mjs';
import { theta } from './movement.mjs';
import { fill, scale } from './util/bitmaps.mjs';

// https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
// https://www.madebymike.com.au/writing/canvas-image-manipulation/
export class BitMap {
  // TODO endianess
  constructor (imageData) {
    this._imageData = imageData;
    this._arrayBuffer = new ArrayBuffer(this._imageData.data.length);
    this._buffer8 = new Uint8ClampedArray(this._arrayBuffer);
    this.buffer32 = new Uint32Array(this._arrayBuffer);
    this._writeImageData();
  }
  _writeImageData () {
    this._buffer8.set(this._imageData.data);
  }
  get width () {
    return this._imageData.width;
  }
  get height () {
    return this._imageData.height;
  }
  write () {
    this._imageData.data.set(this._buffer8);
  }
  get imageData () {
    return this._imageData;
  }
}

function makeColor (array) {
  return (array[3] << 24) | (array[2] << 16) | (array[1] << 8) | (array[0] << 0);
}

let imageData = globals.raycast.createImageData(globals.width, globals.height),
  diamondID = globals.getIDFromImage(diamond);

let bmMain = new BitMap(imageData),
  bmBricks = new BitMap(diamondID);

export function render (dt) {
  for (let i = -globals.p / 2; i < globals.p / 2; i++) {
    let angle = getCastTheta(globals.d, i),
      { intersection, hit, offset } = cast(angle + theta),
      correctedDistance = correctFishEye(globals.distance(intersection, globals.observer), angle),
      color = hit ? [0, 255, 0, 1] : [128, 128, 128, 1],
      _height = (globals.side * globals.d) / correctedDistance,
      starty = (globals.height - _height) * (globals.playerHeight / globals.side), // TODO handle playerHeight correctly
      startx = i + globals.width / 2;

    fill(bmMain, startx, 0, 1, starty,  makeColor([0, 0, 128, 255])); // sky

    if (hit) {
        scale(bmBricks, bmMain, offset, startx, starty, _height);
    } else {
      fill(bmMain, startx, starty, 1, _height,  makeColor([0, 0, 0, 255])); // "fog"
    }

    fill(bmMain, startx, starty + _height, 1, globals.height - (starty + _height), makeColor([128, 128, 128, 255])); // floor
  }

  bmMain.write();
  globals.raycast.putImageData(imageData, 0, 0);

}

function correctFishEye (distance, angle) {
  return distance * Math.cos(angle);
}
