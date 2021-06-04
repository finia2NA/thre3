import { Vector2, Vector3 } from "three";
import { Boundingbox, Implicit, ClosestRes } from "./rasterclasses";
import {
  resolveActualValues,
  conservative,
  getArea,
  discreteToMidpoint,
  getBayecentrics,
  getClosestInside,
  multiplyArrayVector3,
} from "controller/rasterizer/helpers";
import Patch from "model/patch";

const OBJFile = require("obj-file-parser");

function rasterize(corners, xRes, yRes) {
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

      // debugger;
      var eqCanary = true;

      for (const eq of equations) {
        if (eq.apply(midpoint) > 0) {
          // TODO: fenceposting :D
          eqCanary = false;
          break;
        }
      }

      if (eqCanary) locations.push([x, y]);
    }
  }

  // debugger;
  return locations;
}

// Takes a parsed obj,
function generatePatches(objText, xRes, yRes, luminancePath, reflectancePath) {
  const patches = [];

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

      const position = multiplyArrayVector3(
        bayecentrics,
        face.map((x) => x.vertexCoord)
      );
      const normal = multiplyArrayVector3(
        bayecentrics,
        face.map((x) => x.vertexNormal)
      );
      const selfIlluminance = 1; // TODO: sample texture
      const reflectance = 1; // TODO: sample texture
      const nice = sampleDistance;

      const patch = new Patch(
        position,
        normal,
        texel,
        selfIlluminance,
        reflectance,
        ratio,
        1,
        nice
      ); // TODO: think about where to set the luminance factor

      patches.push(patch);
    }
  }

  // patches.sort()
}

export default generatePatches;
