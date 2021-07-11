import { Vector3 } from "three";
import {
  cornerpoints,
  discreteToMidpoint,
  intersectLines,
  pointToDiscrete,
} from "controller/rasterizer/helpers";
import coolmod from "util/coolmod";

const polygonClipping = require("polygon-clipping");

function isInTexel(point, texel, xRes, yRes) {
  const acc = 0.0001;

  const xInterval = 1 / xRes;
  const yInterval = 1 / yRes;

  // debugger;

  if (point.x < texel[0] * xInterval - acc) return false;
  if (point.x > (texel[0] + 1) * xInterval + acc) return false;
  if (point.y < texel[1] * yInterval - acc) return false;
  if (point.y > (texel[1] + 1) * yInterval + acc) return false;

  return true;
}

/**
 * Executes the Cohen-Sutherland Algorithm to find a fragment resulting from clipping a face with a texel.
 * @param {Vector2[]} edges the edges defining the face that will be clipped
 * @param {*} texel the x,y of the texel to be clipped with
 * @param {*} xRes the xRes of the rasterization
 * @param {*} yRes the yRes of the rasterization
 */
export function clipFaceTexel(vertices, texel, xRes, yRes) {
  // We define the texel edges for intersection later
  const mp = discreteToMidpoint(texel, xRes, yRes);
  const clippingCorners = cornerpoints(mp, xRes, yRes);
  const clippingEdges = [0, 1, 2, 3].map((i) => [
    clippingCorners[i],
    clippingCorners[(i + 1) % 3],
  ]);

  // make a copy of our input so we don't change it, and we're ready to go!
  const subjectPolygon = [...vertices];

  // The most of the alg is from https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm
  var resultList = subjectPolygon;

  // debugger;
  for (var clipIndex = 0; clipIndex < 4; clipIndex++) {
    const workingList = resultList;
    resultList = [];

    for (var i = 0; i < workingList.length; i++) {
      const currentPoint = workingList[i];
      const prevPoint = workingList[coolmod(i - 1, workingList.length)];

      if (!currentPoint || !prevPoint) debugger;

      // debugger;
      const intersectingPoint = intersectLines(
        [prevPoint, currentPoint],
        clippingEdges[clipIndex]
      );

      // deviation from the wiki article:
      // if an intersection exists, it always has to be added first to the result array.
      if (intersectingPoint) resultList.push(intersectingPoint);

      // in case the current point is in the texel, it has to be added to the result array secondly.
      if (isInTexel(currentPoint, texel, xRes, yRes))
        resultList.push(currentPoint);
    }
  }

  // check for === vertices
  for (var i = resultList.length - 1; i > 0; i--) {
    if (
      resultList[i].x === resultList[i - 1].x &&
      resultList[i].y === resultList[i - 1].y
    ) {
      resultList.splice(i, 1);
    }
  }

  // finally, check first and last element, which the loop didnt do
  if (resultList[0] === resultList[resultList - 1])
    resultList.splice(resultList.length - 1, 1);

  return resultList;
}

export function clip2(shape1, shape2) {
  const input1 = shape1.map((v) => [v.x, v.y]);
  input1.push(input1[0]);

  const input2 = shape2.map((v) => [v.x, v.y]);
  input2.push(input2[0]);

  debugger;
  const clipped = polygonClipping.intersection(shape1, shape2);
}
