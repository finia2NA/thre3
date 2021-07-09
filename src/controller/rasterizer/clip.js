import { Vector3 } from "three";
import {
  cornerpoints,
  discreteToMidpoint,
  intersectSegments,
  pointToDiscrete,
} from "controller/rasterizer/helpers";
import { coolmod } from "util/coolmod";

/**
 * Executes the Cohen-Sutherland Algorithm to find a fragment resulting from clipping a face with a texel.
 * @param {Vector2[]} edges the edges defining the face that will be clipped
 * @param {*} texel the x,y of the texel to be clipped with
 * @param {*} xRes the xRes of the rasterization
 * @param {*} yRes the yRes of the rasterization
 */
export function clipFaceTexel(vertices, texel, xRes, yRes) {
  // We define the texel edges for intersection later
  const clippingCorners = cornerpoints(discreteToMidpoint(texel), xRes, yRes);
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

      const intersectingPoint = intersectSegments(
        [prevPoint, currentPoint],
        clippingEdges[clipIndex]
      );

      // deviation from the wiki article:
      // if an intersection exists, it always has to be added first to the result array.
      if (intersectingPoint) resultList.push(intersectingPoint);

      // in case the current point is in the texel, it has to be added to the result array secondly.
      if (pointToDiscrete(currentPoint) === texel)
        resultList.push(currentPoint);
    }
  }
  // debugger;
  return resultList;
}
