import * as globals from './globals.mjs';
import { keys, mouse } from './input.mjs';

let theta = 0;

// TODO observer should be here

function adjustPlayer (dt) {
  dt = 0.1 * dt;
  let original = [globals.observer[0], globals.observer[1]];
  theta = (mouse.x / 500) % (2 * Math.PI)
  if (keys[83]) {
    globals.observer[0] -= 10 * Math.cos(theta) * dt;
    globals.observer[1] -= 10 * Math.sin(theta) * dt;
  }
  if (keys[87]) {
    globals.observer[0] += 10 * Math.cos(theta) * dt;
    globals.observer[1] += 10 * Math.sin(theta) * dt;
  }
  let under = globals.getCellUnderVertex(globals.observer);
  if (globals.grid[under[0]][under[1]] === 1) {
    globals.observer[0] = original[0];
    globals.observer[1] = original[1];
  }
  if (keys[65]) {
    globals.observer[0] += 10 * Math.sin(theta) * dt;
    globals.observer[1] += -10 * Math.cos(theta) * dt;
  }
  if (keys[68]) {
    globals.observer[0] += -10 * Math.sin(theta) * dt;
    globals.observer[1] += 10 * Math.cos(theta) * dt;
  }
}

export {
  adjustPlayer,
  theta
};
