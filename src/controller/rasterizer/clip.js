import { Vector3 } from "three";
import {
  cornerpoints,
  texelMidpoint,
  intersectSegments,
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
  // First, we'll need a way to check if a point is in a texel or not.
  // For this, we use predicates for each side of the texel.
  const xIncrement = 1 / xRes;
  const yIncrement = 1 / yRes;

  const mp = texelMidpoint(texel, xRes, yRes);
  const predicates = [
    (p) => p.x > mp.x - 0.5 * xIncrement,
    (p) => p.x < mp.x + 0.5 * xIncrement,
    (p) => p.y > mp.y - 0.5 * yIncrement,
    (p) => p.y < mp.y + 0.5 * yIncrement,
  ]; // true => is in, false => not

  // We define the texel edges for intersection later
  const clippingCorners = cornerpoints(mp, xRes, yRes);
  const clippingEdges = [0, 1, 2, 3].map((i) => [
    clippingCorners[i],
    clippingCorners[(i + 1) % 3],
  ]);

  // make a copy of our input so we don't change it, and we're ready to go!
  const subjectPolygon = [...vertices];

  // The rest of the alg is from https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm
  var resultList = subjectPolygon;

  for (var clipIndex = 0; clipIndex < predicates.length; clipIndex++) {
    const workingList = resultList;
    resultList = [];

    for (var i = 0; i < workingList.length; i++) {
      const currentPoint = workingList[i];
      const prevPoint = workingList[coolmod(i - 1, workingList.length)];

      const intersectingPoint = intersectSegments(
        [prevPoint, currentPoint],
        clippingEdges[clipIndex]
      );

      //FIXME: this
      // debugger;
      if (predicates[clipIndex](currentPoint)) {
        if (!predicates[clipIndex](prevPoint)) {
          if (!intersectingPoint)
            console.error("intersection detected, but no point computed");
          resultList.push(intersectingPoint);
        }
        resultList.push(currentPoint);
      } else if (predicates[clipIndex](prevPoint)) {
        resultList.push(intersectingPoint);
      }
    }
    debugger;
  }

  return resultList;
}
