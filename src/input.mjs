import * as globals from './globals.mjs';

const keys = {};

const mouse = {
  x: 0,
  y: 0
};

globals.canvas.onclick = () => {
  globals.canvas.requestPointerLock();
};

document.body.onkeydown = (e) => {
  keys[e.which] = true;
};

document.body.onkeyup = (e) => {
  keys[e.which] = false;
};

document.body.onmousemove = (e) => {
  mouse.x += e.movementX;
  mouse.y += e.movementY;
};

export {
  keys,
  mouse
}
