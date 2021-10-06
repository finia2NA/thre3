import { Vector2 } from "three";

const polygonClipping = require("polygon-clipping");

export function clip2(shape1, shape2) {
  var input1 = shape1.map((v) => [v.x, v.y]);
  input1.push(input1[0]);
  input1 = [[input1]];

  var input2 = shape2.map((v) => [v.x, v.y]);
  input2.push(input2[0]);
  input2 = [[input2]];

  const clipped = polygonClipping.intersection(input1, input2);

  if (!clipped || clipped.length === 0) return clipped;

  const re = clipped[0][0].map((arr) => new Vector2(arr[0], arr[1]));
  return re;
}
