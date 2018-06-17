const scaleMut2 (vector, scalar) => {
  vector[0] = vector[0] * scalar;
  vector[1] = vector[1] * scalar;
};

const scaleMut3 (vector, scalar) => {
  vector[0] = vector[0] * scalar;
  vector[1] = vector[1] * scalar;
  vector[2] = vector[2] * scalar;
};

const scale2 (vector, scalar) => {
  return [vector[0] * scalar, vector[1] * scalar];
};

const scale3 (vector, scalar) => {
  return [vector[0] * scalar, vector[1] * scalar, vector[2] * scalar];
};

const addMut2 (original, addend) => {
  original[0] += addend[0];
  original[1] += addend[1];
};

const addMut3 (original, addend) => {
  original[0] += addend[0];
  original[1] += addend[1];
  original[2] += addend[2];
};

const add2 (x, y) => {
  return [x[0] + y[0], x[1] + y[1]];
};

const add3 (x, y) => {
  return [x[0] + y[0], x[1] + y[1], x[2] + y[2]];
};

export {
  scaleMut2,
  scaleMut3,
  scale2,
  scale3,
  addMut2,
  addMut3,
  add2,
  add3
}
