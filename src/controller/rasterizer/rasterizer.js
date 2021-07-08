import { Vector2 } from "three";
import { Boundingbox, Implicit } from "./rasterclasses";
import {
  resolveActualValues,
  conservative,
  getArea,
  checkCounterClockwise,
  vectorAverage,
  pfInterpolate,
  reconstructVertex,
} from "controller/rasterizer/helpers";
import Patch from "model/patch";
import { clipFaceTexel } from "./clip";

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
    const texelSize = 1 / (xRes * yRes);

    const texelPositions = rasterize(
      face.map((o) => o.txCoord),
      xRes,
      yRes
    );

    for (const texel of texelPositions) {
      // This gives us the txcoords of the face clipped with the texel.
      // Note that this may result in quads
      const clipped = clipFaceTexel(
        face.map((vertex) => vertex.txCoord),
        texel,
        xRes,
        yRes
      );

      const fragmentVertices = clipped.map((txPos) =>
        reconstructVertex(txPos, face)
      ); // result will be a list of vertices

      const fragmentArea2 = getArea(clipped);
      const fragmentMidPoint2 = vectorAverage(clipped);

      const fragmentArea3 = getArea(
        fragmentVertices.map((vert) => vert.vertexCoord)
      );
      const fragmentMidPoint3 = vectorAverage(
        fragmentVertices.map((vert) => vert.vertexCoord)
      );
      const fragmentNormal3 = vectorAverage(
        fragmentVertices.map((vert) => vert.vertexNormal)
      );

      const selfIlluminance = luminanceMap
        .sample(fragmentMidPoint2.x, fragmentMidPoint2.y)
        // .multiplyScalar(fragmentArea2 / texelSize) // TODO: test: this one?
        .multiplyScalar(luminanceFactor);
      const reflectance = reflectanceMap
        .sample(fragmentMidPoint2.x, fragmentMidPoint2.y)
        .divideScalar(255.0); // mapped to 0...1

      const fragment = new Patch( // TODO: perhaps a fragment class if needed
        fragmentMidPoint2,
        fragmentMidPoint3,
        fragmentNormal3,
        texel,
        selfIlluminance,
        reflectance,
        fragmentArea2,
        fragmentArea3,
        luminanceFactor
      );

      // save if no patch in texelpos, interpolate otherwise.
      if (!patches[texel[0]][texel[1]]) patches[texel[0]][texel[1]] = fragment;
      else
        patches[texel[0]][texel[1]] = pfInterpolate(
          patches[texel[0]][texel[1]],
          fragment,
          xRes,
          yRes
        );
    }
  }

  return patches;
}

export default generatePatches;
