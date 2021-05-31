import { Vector2, Vector3 } from "three";
import { resolveActualValues, conservative, getArea } from "./helpers";
import { Boundingbox, Implicit } from "./rasterclasses";
const OBJFile = require("obj-file-parser");

function rasterize(corners, xRes, yRes) {
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
  const parsed = new OBJFile(objText).parse();
  const structure = parsed.models[0];

  const faces = resolveActualValues(structure);

  for (const face of faces) {
    const vertexArea = getArea(face.map((x) => x.vertexCoord));
    const textureArea = getArea(face.map((x) => x.txCoord));
    const texelSize = 1 / (xRes * yRes);
    const ratio = vertexArea / (textureArea * texelSize);

    const texels = rasterize(
      face.map((o) => o.txCoord),
      xRes,
      yRes
    );
  }
}

export default generatePatches;
