import * as globals from './globals.mjs';
import { createBitmapFromImageElement } from './util/bitmaps.mjs';

export const bmBricks    = createBitmapFromImageElement(globals.diamond);
export const bmStone     = createBitmapFromImageElement(globals.stone);
export const bmCeil      = createBitmapFromImageElement(globals.ceiling);
