import { Vector2 } from "three";
import { Boundingbox, Implicit } from "./rasterclasses";
import {
  resolveActualValues,
  conservative,
  getArea,
  discreteToMidpoint,
  getBayecentrics,
  getClosestInside,
  linearCombination,
  checkCounterClockwise,
} from "controller/rasterizer/helpers";
import Patch from "model/patch";

const OBJFile = require("obj-file-parser");

/**
 * Takes a single face in texture space, described by its corner points, and returns a conservative rasterization of that face.
 * @param {Vector2[]} corners
 * @param {number} xRes
 * @param {number} yRes
 * @returns {number[][]} A list of discrete painted texel coordinates.
 */
export function rasterize(corners, xRes, yRes) {
  // The algorithm is designed to work with faces that are in counterclockwise orientation.
  // We first check if this is the case, and if not fix that issue.
  if (!checkCounterClockwise(corners)) {
    corners.reverse(); // mutates the array
    // console.log("fixed orientation!!");
  }

  // The algorithm works in the following way:
  // We assume the faces we're given are defined in a counterclockwise fashion.
  // We first create a bounding box, a rough area in which we'll later check if the texels are in our shape.
  // Then, generate *conservative* descriptions for every edge in our given shape.
  // The rasterization of these will include every texel which is included in our shape in any way.
  // Then, we create an indirect equation for every conservative edge, which describes if a given point is to the left, right or exactly on that line.
  // Now, we just have to take the midpoints of the texels in the bounding box, and check if they are left to the left of every conservative edge using the indirect equations.
  // If this is the case, the texel is part of the shapes conservative rasterization.

  const locations = [];
  const boundingbox = new Boundingbox(corners, xRes, yRes);

  const conservativeEdges = [];
  for (var i = 0; i < 3; i++) {
    const edge = conservative(corners[i], corners[(i + 1) % 3], xRes, yRes);
    conservativeEdges.push(edge);
  }

  const equations = conservativeEdges.map((x) => new Implicit(x[0], x[1]));

  for (var x = boundingbox.xMin; x <= boundingbox.xMax; x++) {
    for (var y = boundingbox.yMin; y <= boundingbox.yMax; y++) {
      const midpoint = new Vector2((x + 0.5) / xRes, (y + 0.5) / yRes);

      var eqCanary = true;

      for (const eq of equations) {
        const eqRes = eq.apply(midpoint);

        if (eqRes >= 0) {
          // tested and proven, has to be >= ! :)
          eqCanary = false;
          break;
        }
      }

      if (eqCanary) locations.push([x, y]);
    }
  }

  return locations;
}

// Takes a parsed obj,
function generatePatches(
  objText,
  xRes,
  yRes,
  luminanceMap,
  reflectanceMap,
  luminanceFactor
) {
  const patches = new Array(xRes).fill();
  for (var i = 0; i < yRes; i++) {
    patches[i] = new Array(yRes);
  }

  const parsed = new OBJFile(objText).parse();
  const structure = parsed.models[0];

  const faces = resolveActualValues(structure);

  for (const face of faces) {
    const vertexArea = getArea(face.map((x) => x.vertexCoord));
    const textureArea = getArea(face.map((x) => x.txCoord));
    const texelSize = 1 / (xRes * yRes);
    const ratio = vertexArea / (textureArea * texelSize);

    const texelPositions = rasterize(
      face.map((o) => o.txCoord),
      xRes,
      yRes
    );

    for (const texel of texelPositions) {
      const samplePoint = discreteToMidpoint(texel, xRes, yRes);
      var sampleDistance = 0;

      var bayecentrics = getBayecentrics(samplePoint, face);

      if (Math.min(...bayecentrics) < 0) {
        const closestRes = getClosestInside(samplePoint, face);
        bayecentrics[closestRes.startIndex] = closestRes.bay1;
        bayecentrics[(closestRes.startIndex + 1) % 3] = 1 - closestRes.bay1;
        bayecentrics[(closestRes.startIndex + 2) % 3] = 0;

        // # the sample distance will be used as NICE
        sampleDistance = closestRes.distance;

        // samplePoint = closestRes.pos
      }

      const position = linearCombination(
        bayecentrics,
        face.map((x) => x.vertexCoord)
      );
      const normal = linearCombination(
        bayecentrics,
        face.map((x) => x.vertexNormal)
      ).normalize();
      const selfIlluminance = luminanceMap
        .sample(samplePoint.x, samplePoint.y)
        .multiplyScalar(luminanceFactor);
      const reflectance = reflectanceMap
        .sample(samplePoint.x, samplePoint.y)
        .divideScalar(255.0); // mapped to 0...1
      const nice = sampleDistance;

      const patch = new Patch(
        position,
        normal,
        texel,
        selfIlluminance,
        reflectance,
        1, // ratio, //TODO: fix
        1,
        1,
        nice
      );

      // TODO: find out why things were going above x,yres and fix that, instead of this bandaid which probably masks some deeper error
      // debugger;
      if (texel[0] < xRes && texel[1] < yRes) {
        // if there's not yet a patch for this position
        // or the patch there has a higher nice than this one
        if (
          !patches[texel[0]][texel[1]] ||
          patches[texel[0]][texel[1]].nice > patch.nice
        ) {
          // write this patch as the representative of that texel.
          patches[texel[0]][texel[1]] = patch;
        }
      }
    }
  }

  // debugger;

  return patches;
}

export default generatePatches;
