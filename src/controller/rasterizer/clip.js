import { Vector3 } from "three";
import {
  cornerpoints,
  discreteToMidpoint,
  intersects,
} from "controller/rasterizer/helpers";
/**
 * Executes the Cohen-Sutherland Algorithm to find a fragment resulting from clipping a face with a texel.
 * @param {Vector2[]} edges the edges defining the face that will be clipped
 * @param {*} texel the x,y of the texel to be clipped with
 * @param {*} xRes the xRes of the rasterization
 * @param {*} yRes the yRes of the rasterization
 */
function cs(edges, texel, xRes, yRes) {
  // Step 1: compute the edges of the texel
  const clippingCorners = cornerpoints(discreteToMidpoint(texel), xRes, yRes);
  const clippingEdges = [0, 1, 2, 3].map((i) => [
    clippingCorners[i],
    clippingCorners[(i + 1) % 3],
  ]);

  // Step 2: since the alg wants the polygon not in edge, but on vertex form, I convert it into that.
  const subjectPolygon = edges.map((edge) => edge[0]);

  // The rest of the method is annotated with the pseudocode from Wikipedia
  // https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm

  // List resultList = subjectPolygon;
  const resultList = subjectPolygon;

  // for (Edge clipEdge in clipPolygon) do
  for (var clipIndex = 0; clipIndex < clippingEdges.length; clipIndex++) {
    // List workingList = resultList;
    const workingList = resultList;
    // resultList.clear();
    resultList = [];
    // for (int i = 0; i < workingList.count; i += 1) do
    for (var i = 0; i < workingList.length; i++) {
      // Point current_point = workingList[i];
      const currentPoint = workingList[i];
      // Point prev_point = workingList[(i − 1) % workingList.count];
      const prev_point = workingList[(i - 1) % workingList.length];

      // Point Intersecting_point = ComputeIntersection(prev_point, current_point, clipEdge)
      const intersecting_point = None; // TODO: insert the intersection alg from helpers here

      //         if (current_point inside clipEdge) then
      //             if (prev_point not inside clipEdge) then
      //                 resultList.add(Intersecting_point);
      //             end if
      //             resultList.add(current_point);

      //         else if (prev_point inside clipEdge) then
      //             resultList.add(Intersecting_point);
      //         end if

      //     done
    }
    // done
  }
}
