import * as globals from './globals.mjs';
import { keys, mouse} from './input.mjs';
import { getCastTheta, cast } from './cast.mjs';
import { theta } from './movement.mjs';
import { fillID, scale } from './id-util.mjs';

let imageData = globals.raycast.createImageData(globals.width, globals.height),
  diamondID = globals.getIDFromImage(diamond);

export function render (dt) {
  for (let i = -globals.p / 2; i < globals.p / 2; i++) {
    let angle = getCastTheta(globals.d, i),
      { intersection, hit, offset } = cast(angle + theta),
      correctedDistance = correctFishEye(globals.distance(intersection, globals.observer), angle),
      color = hit ? [0, 255, 0, 1] : [128, 128, 128, 1],
      _height = (globals.side * globals.d) / correctedDistance,
      starty = (globals.height / 2) - (_height / 2),
      startx = i + globals.width / 2;

    fillID(imageData, startx, 0, 1, starty,  [0, 0, 128, 255]); // sky

    if (hit) {
        scale(diamondID, imageData, (offset) << 0, startx, starty, _height);
    } else {
      fillID(imageData, startx, starty, 1, _height,  [0, 0, 0, 255]); // "fog"
    }

    fillID(imageData, startx, starty + _height, 1, globals.height - (starty + _height), [128, 128, 128, 255]); // floor

  }

  globals.raycast.putImageData(imageData, 0, 0);

}

function correctFishEye (distance, angle) {
  return distance * Math.cos(angle);
}
