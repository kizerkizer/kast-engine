const ctx = document.querySelector('#canvas').getContext('2d');
ctx.imageSmoothingEnabled = false;

const raycast = document.querySelector('#raycast').getContext('2d');
raycast.imageSmoothingEnabled = false;

const width = 1280,
  height = 720;

const side = 64,
  grid = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  ];
  
/// viewport

let p = width,
  d = 200;

let dtheta = (Math.PI / 3) / p;//(2 * Math.atan2(p, d / 2)) / p;

console.log(dtheta);

///

const observer = [640 - 32, 256 + 64 + 32];

// https://stackoverflow.com/questions/24234609/standard-way-to-normalize-an-angle-to-%CF%80-radians-in-java
const normalizeAngle = (theta) => Math.atan2(Math.sin(theta), Math.cos(theta));

function drawGrid2D () {
  grid.map((row, i) => {
    row.map((cell, j) => {
      ctx.beginPath();
      if (cell) {
        ctx.fillStyle = '#008800';
        ctx.fillRect(i * side, j * side, side, side);
        ctx.fill();
      } else {
        ctx.fillStyle = '#999';
        ctx.fillRect(i * side, j * side, side, side);
        ctx.fill();
      }
    });
  });
}

/*function getRayAngle (i) {
  let h = i - (width / 2);
  let theta = Math.atan(h / d);
  return Math.PI - theta;
}*/

/*function drawOneRay (theta) {
  let start = observer;
  
  let x = ((observer[0] / side) << 0) * side;
  let y = ((observer[1] / side) << 0) * side;
  
  let cellx = observer[0] % side;
  let celly = observer[1] % side;
  
  let dx = side - cellx;
  let dy = side - celly;
  
  let end = [64 * Math.cos(theta) + start[0], 64 * Math.sin(theta) + start[1]];
  
  if (end[0] < x) {
    end[0] = x;
  }
  if (end[0] > x + side) {
    end[0] = x + side;
  }
  if (end[1] < y) {
    end[1] = y;
  }
  if (end[1] > y + side) {
    end[1] = y + side;
  }
  
  ctx.beginPath();
  ctx.moveTo(...start);
  ctx.lineTo(...end);
  ctx.stroke();
}*/


function distance (a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

function getIntersectionPoint (start, theta) {
  let x = ((start[0] / side) << 0) * side;
  let y = ((start[1] / side) << 0) * side;
  
  let cellx = start[0] % side;
  let celly = start[1] % side;
  
  let dx = start - cellx;
  let dy = start - celly;
  
  let end = [64 * Math.cos(theta) + start[0], 64 * Math.sin(theta) + start[1]];
  
  if (end[0] < x) {
    end[0] = x;
  }
  if (end[0] > x + side) {
    end[0] = x + side;
  }
  if (end[1] < y) {
    end[1] = y;
  }
  if (end[1] > y + side) {
    end[1] = y + side;
  }
  return end;
}


/////

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
  mouse.x = e.clientX;//window.devicePixelRatio * (e.clientX - document.querySelector('#canvas').getBoundingClientRect().left);
  mouse.y = e.clientY;//window.devicePixelRatio * (e.clientY - document.querySelector('#canvas').getBoundingClientRect().top);
}

/////

function getCellUnderVertex (vertex) {
  return [((vertex[0] / side) << 0), ((vertex[1] / side) << 0)];
}


function fillID (imageData, x, y, width, height, color) {
  x = x << 0;
  y = y << 0;
  width = width << 0;
  height = height << 0;
  let idwidth = imageData.width,
    idheight = imageData.height,
    iddata = imageData.data;
  for (let yi = y; yi < y + height; yi++) {
    for (let xi = x; xi < x + width; xi++) {
      let offset0 = yi * idwidth * 4;
      let offset1 = xi * 4;
      iddata[offset0 + offset1 + 0] = color[0];
      iddata[offset0 + offset1 + 1] = color[1];
      iddata[offset0 + offset1 + 2] = color[2];
      iddata[offset0 + offset1 + 3] = color[3];
    }
  }
}


let theta = 0;

let imageData = raycast.createImageData(width, height);
let last = null;
function draw (timestamp) {
  if (!last) {
    last = timestamp;
  }
  let dt = timestamp - last;
  dt = dt / 50;
  last = timestamp;
  if (keys[37]) {
    theta -= Math.PI / 64 * dt;
  }
  if (keys[39]) {
    theta += Math.PI / 64 * dt;
  }
  let original = [observer[0], observer[1]];
  if (keys[83]) {
    observer[0] -= 2 * Math.cos(theta) * dt;
    observer[1] -= 2 * Math.sin(theta) * dt;
  }
  if (keys[87]) {
    observer[0] += 2 * Math.cos(theta) * dt;
    observer[1] += 2 * Math.sin(theta) * dt;
  }
  let under = getCellUnderVertex(observer);
  if (grid[under[0]][under[1]] === 1) {
    observer[0] = original[0];
    observer[1] = original[1];
  }
  if (keys[65]) {
    observer[0] -= 2 * Math.abs(Math.sin(normalizeAngle(theta))) * dt;
    observer[1] -= 2 * Math.abs(Math.cos(normalizeAngle(theta))) * dt;
  }
  if (keys[68]) {
    observer[0] += 2 * Math.abs(Math.sin(normalizeAngle(theta))) * dt;
    observer[1] += 2 * Math.abs(Math.cos(normalizeAngle(theta))) * dt;
  }

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  drawGrid2D();
  let underCell = getCellUnderVertex(observer);
  if (underCell) {
    ctx.beginPath();
    ctx.fillStyle = '#888';
    ctx.fillRect(underCell[0] * side, underCell[1] * side, side, side);
    ctx.fill();
  }
  //let theta = Math.atan2(mouse.y - 960, mouse.x - 360)
  //console.log(theta);
  //raycast.fillStyle = 'black';
  //raycast.fillRect(0, 0, width, height);
  fillID(imageData, 0, 0, width, height, [0, 0, 0, 255]);
  for (let i = -p / 2; i <= p / 2; i += 1) {
    let { vertex, hit } = drawDottedCast(i * dtheta + theta);
    let dist = distance(vertex, observer) * Math.cos(Math.PI / 6);
    let s = 2; // TODO
    let color = hit ? [0, 255, 0, 1] : [128, 128, 128, 1];
    // TODO
    //
   

    let _height = (200) / (dist / 90);
    fillID(imageData,i + width / 2, _height / 4, 1, _height, [0, (255/(dist * 0.02)) << 0, 0, 255]);


    /*raycast.beginPath();
    raycast.fillStyle = hit ? `rgb(0, ${255/(dist * 0.02)}, 0)` : '#333';
    //raycast.fillRect(i * (width / p) + p / 2, 0, width / p, 720);
    let _height = (700) / (dist / 90);
    raycast.fillRect(i + width / 2, _height / 4, 1, _height);
    raycast.fillStyle = 'grey';
    raycast.fillRect(i + width / 2, (_height / 8) + _height, 1, height-_height);
    raycast.fill();*/






  }
  raycast.putImageData(imageData, 0, 0);
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);



// slice I (clockwise)
function rightDrawOneRay2 (initialVertex, theta) {
  theta = normalizeAngle(theta);
  /*if (!((theta >= 0 && theta <= Math.PI / 2) || (theta <= 0 && theta >= -Math.PI / 2))) {
    throw new Error();
  }*/
  let cellX = initialVertex[0] - getCellUnderVertex(initialVertex)[0] * side,
    cellY = initialVertex[1] - getCellUnderVertex(initialVertex)[1] * side;
  let h = side - cellX + 1;
  let v = Math.tan(theta) * h;
  return [initialVertex[0] + h, initialVertex[1] + v];
}

// slice III (clockwise)
function leftDrawOneRay2 (initialVertex, theta) {
  theta = normalizeAngle(theta);
  /*if (!((theta >= 3 * Math.PI / 2 && theta <= Math.PI) || (theta <= -3 * Math.PI / 2 && theta >= -Math.PI))) {
    throw new Error();
  }*/
  let cellX = initialVertex[0] - getCellUnderVertex(initialVertex)[0] * side,
    cellY = initialVertex[1] - getCellUnderVertex(initialVertex)[1] * side;
  let h = cellX + 1//-(cellX + 1); // TODO
  let v =  Math.tan(theta) * h; // TODO
  return [initialVertex[0] - h, initialVertex[1] - v];
}

// slice IV (clockwise)
function upDrawOneRay2 (initialVertex, theta) {
  theta = normalizeAngle(theta);
  /*if (!((theta <= -Math.PI / 4) && (theta >= -3 * Math.PI / 2))) {
    throw new Error();
  }*/
  let cellX = initialVertex[0] - getCellUnderVertex(initialVertex)[0] * side,
    cellY = initialVertex[1] - getCellUnderVertex(initialVertex)[1] * side;
  let v = cellY + 1;//side - cellY + 1;
  let h = v / Math.tan(theta);
  return [initialVertex[0] - h, initialVertex[1] - v];
}

// slice II (clockwise)
function downDrawOneRay2 (initialVertex, theta) {
  theta = normalizeAngle(theta);
  /*if (!((theta >= Math.PI / 4) && (theta <= 3 * Math.PI / 2))) {
    throw new Error();
  }*/
  let cellX = initialVertex[0] - getCellUnderVertex(initialVertex)[0] * side,
    cellY = initialVertex[1] - getCellUnderVertex(initialVertex)[1] * side;
  let v = side - cellY + 1;//-(cellY + 1); // TODO
  let h =  v / Math.tan(theta); // TODO
  return [initialVertex[0] + h, initialVertex[1] + v];
}


function min (a, b) {
  return a < b ? a : b;
}

function drawDot (vector2D) {
  ctx.beginPath();
  ctx.fillStyle = '#ffffff';
  ctx.arc(vector2D[0], vector2D[1], 5, 0, 2 * Math.PI);
  ctx.fill();
}


function drawDottedCast (theta) {
  theta = normalizeAngle(theta);
  let v1 = observer;
  let h1 = observer;
  let current = observer;
  let hit = false;
  for (let i = 0; i < 10; i++) {
    //drawDot(current);
    if (grid[getCellUnderVertex(current)[0]] && grid[getCellUnderVertex(current)[0]][getCellUnderVertex(current)[1]] === 1) {
      hit = true;
      break;
    }
    /*let [x, y] = [Math.cos(theta), -Math.sin(theta)];
    if (x >= 0) {
      v1 = rightDrawOneRay2(current, theta);
    } else {
      v1 = leftDrawOneRay2(current, theta);
    }
    if (y <= 0) {
      h1 = upDrawOneRay2(current, theta);
    } else {
      h1 = downDrawOneRay2(current, theta);
    }*/
    /*if ((0 <= theta && theta <= Math.PI / 4) || (0 >= theta && theta >= -3 * Math.PI / 2)) {
      v1 = downDrawOneRay2(current, theta);
      h1 = rightDrawOneRay2(current, theta);
    } else {
      v1 = upDrawOneRay2(current, theta);
      h1 = leftDrawOneRay2(current, theta);
    }*/
    
    
    
    if (((theta >= 0 && theta <= Math.PI / 2) || (theta <= 0 && theta >= -Math.PI / 2))) {
      v1 = rightDrawOneRay2(current, theta);
    } else {
      v1 = leftDrawOneRay2(current, theta);
    }
    //current = v1;*/ // cols only
    
    
    
    if (((theta >= 0 && theta <= Math.PI))) {
      h1 = downDrawOneRay2(current, theta);
    } else {
      h1 = upDrawOneRay2(current, theta);
    }
    //current = h1; // rows only
    
    
    
    /*if (((theta >= 3 * Math.PI / 4 && theta <= Math.PI) || (theta <= -3 * Math.PI / 4 && theta >= -Math.PI))) {
      v1 = rightDrawOneRay2(current, theta);
    }*/
    /*if (((theta <= -Math.PI / 4) && (theta >= -3 * Math.PI / 4))) {
      h1 = downDrawOneRay2(current, theta);
    } else if (((theta >= Math.PI / 4) && (theta <= 3 * Math.PI / 4))) {
      h1 = upDrawOneRay2(current, theta);
    }*/
    if (distance(current, v1) < distance(current, h1)) {
      current = v1;
      if (grid[getCellUnderVertex(v1)[0]] && grid[getCellUnderVertex(v1)[0]][getCellUnderVertex(v1)[1]] === 1) {
        hit = true;
        break;
      }
    } else {
      current = h1;
      if (grid[getCellUnderVertex(h1)[0]] && grid[getCellUnderVertex(h1)[0]][getCellUnderVertex(h1)[1]] === 1) {
        hit = true;
        break;
      }
    }
  }
  ctx.beginPath();
  ctx.strokeStyle = 'yellow';
  ctx.moveTo(...observer);
  ctx.lineTo(...current);
  ctx.stroke();
  
  return {
    vertex: current,
    hit
  };
}

drawDottedCast(Math.PI / 2);

document.body.addEventListener('mousemove', (e) => {

})

//castOneRay(-Math.PI / 2);
