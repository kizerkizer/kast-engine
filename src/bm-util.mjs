function fill (bm, x, y, width, height, color) {
  x = x << 0;
  y = y << 0;
  width = width << 0;
  height = height << 0;
  let bmWidth = bm.width;
  for (let yi = y; yi < y + height; yi++) {
    for (let xi = x; xi < x + width; xi++) {
      bm.buffer32[yi * bmWidth + xi] = color;
    }
  }
}

function scale (sourceBM, targetBM, sourceStartX, targetStartX, targetStartY, height) {
  let ratio = sourceBM.height / height;
  sourceStartX = sourceStartX << 0;
  targetStartX = targetStartX << 0;
  targetStartY = targetStartY << 0;
  height = height << 0;
  for (let i = 0; i < height; i++) {
    let point = ratio * i;
    targetBM.buffer32[(i + targetStartY) * targetBM.width + targetStartX] = sourceBM.buffer32[sourceBM.width * (point << 0) + sourceStartX];
  }
}

export {
  fill,
  scale
}
