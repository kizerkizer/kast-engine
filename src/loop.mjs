import { update } from './update.mjs';
import { render } from './render.mjs';

let last;

function loop (timestamp) {
  if (!last) {
    last = timestamp;
  }
  let dt = timestamp - last;
  update(dt);
  render(dt);
  last = timestamp;
  window.requestAnimationFrame(loop);
}

function start () {
  window.requestAnimationFrame(loop);
}

export {
  start
}
