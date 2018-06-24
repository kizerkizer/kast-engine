import * as globals from './globals.mjs';
import { BitMap } from './util/bitmaps.mjs';

const bmBricks = new BitMap(globals.getIDFromImage(diamond)),
  bmStone = new BitMap(globals.getIDFromImage(globals.stone)),
  bmCeil = new BitMap(globals.getIDFromImage(globals.ceiling));

export {
  bmBricks,
  bmStone,
  bmCeil
}
