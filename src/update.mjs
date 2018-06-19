import { cast } from './cast.mjs';
import { adjustPlayer } from './movement.mjs';

function update (dt) {
  adjustPlayer(dt);
}

export {
  update
}
