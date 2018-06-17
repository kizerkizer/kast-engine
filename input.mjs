const keys = {

};

const mouse = {

};

document.body.onkeydown = (e) => {
  keys[e.which] = true;
};

document.body.onkeyup = (e) => {
  keys[e.which] = false;
};

document.body.onmousemove = (e) => {
  // TODO
  //mouse.x = e.clientX;//window.devicePixelRatio * (e.clientX - document.querySelector('#canvas').getBoundingClientRect().left);
  //mouse.y = e.clientY;//window.devicePixelRatio * (e.clientY - document.querySelector('#canvas').getBoundingClientRect().top);
};

export {
  keys,
  mouse
}
