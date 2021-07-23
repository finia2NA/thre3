// https://en.wikipedia.org/wiki/Clipper
import { Vector2 } from "three";

import {
  resolveActualValues,
  cornerpoints,
  pfInterpolate,
  reconstructVertex,
  normalizeVector3,
  dameCheck,
  getAreaConvex,
  convexMidpoint2,
  convexMidpoint3,
} from "controller/rasterizer/helpers";
import { clip2 } from "./clip";

import Patch from "model/patch";
import { Boundingbox } from "./rasterclasses";

const OBJFile = require("obj-file-parser");
const polygonClipping = require("polygon-clipping");

export default function generateClippedPatches(
  objText,
  xRes,
  yRes,
  luminanceMap,
  reflectanceMap,
  luminanceFactor,
  flipY
) {
  const patches = new Array(xRes).fill();
  for (var i = 0; i < yRes; i++) {
    patches[i] = new Array(yRes);
  }

  const parsed = new OBJFile(objText).parse();
  const structure = parsed.models[0];

  const faces = resolveActualValues(structure);

  for (var i = 0; i < faces.length; i++) {
    const face = faces[i];

    // debugger;

    const bb = new Boundingbox(
      face.map((v) => v.txCoord),
      xRes,
      yRes
    );

    // // Uncomment this to disable the bounding box and clip with all texels
    // bb.xMin = 0;
    // bb.xMax = xRes - 1;
    // bb.yMin = 0;
    // bb.yMax = yRes - 1;

    const texelSize = 1 / (xRes * yRes);

    for (var x = bb.xMin; x < bb.xMax; x++) {
      for (var y = bb.yMin; y < bb.yMax; y++) {
        const texel = [x, y];

        const faceShape = face.map((v) => v.txCoord);

        const texelshape = cornerpoints([x, y], xRes, yRes);
        const clipped = clip2(faceShape, texelshape);

        if (!dameCheck(clipped)) continue;

        // console.log("survived damecheck");

        const fragmentVertices = clipped.map((txPos) =>
          reconstructVertex(txPos, face)
        ); // result will be a list of vertices

        const fragmentArea2 = getAreaConvex(clipped);
        const fragmentMidPoint2 = convexMidpoint2(clipped);

        const fragmentArea3 = getAreaConvex(
          fragmentVertices.map((vert) => vert.vertexCoord)
        );
        const fragmentMidPoint3 = convexMidpoint3(
          fragmentVertices.map((vert) => vert.vertexCoord)
        );

        const fragmentNormal3 = normalizeVector3(
          convexMidpoint3(fragmentVertices.map((vert) => vert.vertexNormal))
        );

        const energyDensity = luminanceMap
          .sample(fragmentMidPoint2.x, fragmentMidPoint2.y, flipY)
          // .multiplyScalar(fragmentArea2 / texelSize) // I don't
          .multiplyScalar(luminanceFactor);
        const reflectance = reflectanceMap
          .sample(fragmentMidPoint2.x, fragmentMidPoint2.y, flipY)
          .divideScalar(255.0); // mapped to 0...1

        const fragment = new Patch(
          fragmentMidPoint2,
          fragmentMidPoint3,
          fragmentNormal3,
          texel,
          energyDensity,
          reflectance,
          fragmentArea2,
          fragmentArea3,
          luminanceFactor
        );

        // save if no patch in texelpos, interpolate otherwise.
        if (!patches[texel[0]][texel[1]])
          patches[texel[0]][texel[1]] = fragment;
        else
          patches[texel[0]][texel[1]] = pfInterpolate(
            patches[texel[0]][texel[1]],
            fragment,
            xRes,
            yRes
          );
      }
    }
  }
  return patches;
}
