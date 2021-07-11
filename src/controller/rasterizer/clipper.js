// https://en.wikipedia.org/wiki/Clipper
import { Vector2 } from "three";

import {
  resolveActualValues,
  cornerpoints,
  conservative,
  getArea,
  checkCounterClockwise,
  vectorAverage,
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
    const bb = new Boundingbox(
      face.map((v) => v.txCoord),
      xRes,
      yRes
    );

    const texelSize = 1 / (xRes * yRes);

    for (var x = bb.xMin; x < bb.xMax; x++) {
      for (var y = bb.yMin; y < bb.yMax; y++) {
        const shape1 = face.map((v) => v.txCoord);
        const shape2 = cornerpoints([x, y], xRes, yRes); // FIXME: THIS SHIT AINT WORKING!!!!!!!!!!!!!!!
        debugger;
        const clipped = clip2(shape1, shape2);

        console.log("😎");
      }
    }
  }
}
