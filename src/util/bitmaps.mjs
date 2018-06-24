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

const virtualCtx = document.createElement('canvas').getContext('2d');

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

function unpack (color) {
  return [color & 0x000000ff, (color & 0x0000ff00) >>> 8, (color & 0x00ff0000) >>> 16, (color & 0xff000000) >>> 24];
}

function pack (array) {
  return (array[3] << 24) | (array[2] << 16) | (array[1] << 8) | (array[0] << 0);
}

function clamp (value, min, max) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function brightness (bm, x, y, width, height, amount) {
  let bmWidth = bm.width;
  for (let yi = y; yi < y + height; yi++) {
    for (let xi = x; xi < x + width; xi++) {
      let color = unpack(bm.buffer32[yi * bmWidth + xi]);
      color[0] = clamp(color[0] * amount, 0, 255) << 0;
      color[1] = clamp(color[1] * amount, 0, 255) << 0;
      color[2] = clamp(color[2] * amount, 0, 255) << 0;
      bm.buffer32[yi * bmWidth + xi] = pack(color);
    }
  }
}

class BitMap {
  // TODO endianess
  constructor (imageData) {
    this._imageData = imageData;
    // https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
    // https://www.madebymike.com.au/writing/canvas-image-manipulation/
    this._arrayBuffer = new ArrayBuffer(this._imageData.data.length);
    this._buffer8 = new Uint8ClampedArray(this._arrayBuffer);
    this.buffer32 = new Uint32Array(this._arrayBuffer);
    this._writeImageData();
    this.width = this._imageData.width;
    this.height = this._imageData.height;
  }
  _writeImageData () {
    this._buffer8.set(this._imageData.data);
  }
  write () {
    this._imageData.data.set(this._buffer8);
  }
  get imageData () {
    return this._imageData;
  }
}

function createBitmapFromImageElement (imageElement) {
  virtualCtx.drawImage(imageElement, 0, 0);
  return new BitMap(virtualCtx.getImageData(0, 0, imageElement.width, imageElement.height));
}

export {
  fill,
  scale,
  brightness,
  BitMap,
  pack,
  unpack,
  createBitmapFromImageElement
}
