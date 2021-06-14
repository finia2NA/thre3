import { Vector2 } from "three";
import { Boundingbox, Implicit } from "./rasterclasses";
import {
  resolveActualValues,
  conservative,
  getArea,
  discreteToMidpoint,
  getBayecentrics,
  getClosestInside,
  multiplyBayecentric,
  checkCounterClockwise,
} from "controller/rasterizer/helpers";
import Patch from "model/patch";

const OBJFile = require("obj-file-parser");

function rasterize(corners, xRes, yRes) {
  if (!checkCounterClockwise(corners)) {
    corners.reverse();
    console.log("fixed orientation!!");
  }

  // FIXME: not working right, painting too little
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
        // debugger;
        if (eqRes >= 0) {
          eqCanary = false;
          break;
        }
      }

      // if (x===15&&y===9)
      //   debugger;
      if (eqCanary) locations.push([x, y]);
    }
  }
  // TODO: take another look at the edgecase in geogebra
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
  const patches = new Array(xRes).fill(new Array(yRes));

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

      const position = multiplyBayecentric(
        bayecentrics,
        face.map((x) => x.vertexCoord)
      );
      const normal = multiplyBayecentric(
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
        // ratio, //TODO: fix
        1,
        1,
        nice
      );

      // TODO: find out why things were going above x,yres and fix that, instead of this bandaid which probably masks some deeper error
      if (texel[0] < xRes && texel[1] < yRes) {
        if (
          !patches[texel[0]][texel[1]] ||
          patches[texel[0]][texel[1]].nice < patch.nice
        ) {
          patches[texel[0]][texel[1]] = patch;
        }
      }
    }
  }
  return patches;
}

export default generatePatches;
