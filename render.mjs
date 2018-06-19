import * as globals from './globals.mjs';
import { keys, mouse} from './input.mjs';
import { getCastTheta, cast } from './cast.mjs';
import { theta } from './movement.mjs';
import { fillID, scale } from './id-util.mjs';

let imageData = globals.raycast.createImageData(globals.width, globals.height),
  diamondID = globals.getIDFromImage(diamond);

export function render (dt) {
  for (let i = -globals.p / 2; i < globals.p / 2; i += 1) {
    let angle = getCastTheta(globals.d, i);
    //let { vertex, hit, which } = cast(i * globals.dtheta + theta);
    let { vertex, hit, which } = cast(angle + theta);
    let dist = globals.distance(vertex, globals.observer);
    let color = hit ? [0, 255, 0, 1] : [128, 128, 128, 1];
    let _height = (globals.side * globals.d) / dist;
    let starty = (globals.height / 2) - (_height / 2);
    let startx = i + globals.width / 2;
    fillID(imageData, startx, 0, 1, starty,  [0, 0, 128, 255]); // sky
    if (hit) {
      if (which === `vertical`) {
        scale(diamondID, imageData, (vertex[1] % globals.side) << 0, startx, starty, _height);
      } else {
        scale(diamondID, imageData, (vertex[0] % globals.side) << 0, startx, starty, _height);
      }
    } else {
      fillID(imageData, startx, starty, 1, _height,  [0, 0, 0, 255]); // "fog"
    }
    fillID(imageData, startx, starty + _height, 1, globals.height - (starty + _height), [128, 128, 128, 255]); // floor
  }
  globals.raycast.putImageData(imageData, 0, 0);
}
