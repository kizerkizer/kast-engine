import { update } from './update.mjs';
import { render } from './render.mjs';

let last;

function loop (timestamp) {
  window.requestAnimationFrame(loop);
  if (!last) {
    last = timestamp;
  }
  let dt = timestamp - last;
  update(dt);
  render(dt);
  last = timestamp;
}

function start () {
  window.requestAnimationFrame(loop);
}

export {
  start
}
