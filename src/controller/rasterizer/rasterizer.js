import { Vector2, Vector3 } from "three";
import { getArea } from "./helpers";
const OBJFile = require("obj-file-parser");

class Vertex {
  constructor(vertexCoord, txCoord, vertexNormal) {
    this.txCoord = txCoord;
    this.vertexCoord = vertexCoord;
    this.vertexNormal = vertexNormal;
  }
}

function resolveActualValues(structure) {
  var re = [];

  for (const face of structure.faces) {
    const vertexValues = [];

    for (const vertex of face.vertices) {
      // why these things are 1-indexed I could not tell you, but I can assure you they are
      const v = structure.vertices[vertex.vertexIndex - 1];
      const t = structure.textureCoords[vertex.textureCoordsIndex - 1];
      const n = structure.vertexNormals[vertex.vertexNormalIndex - 1];

      const actual = new Vertex(
        new Vector3(v.x, v.y, v.z),
        new Vector2(t.u, t.v),
        new Vector3(n.x, n.y, n.z)
      );
      vertexValues.push(actual);
    }

    re.push(vertexValues);
  }

  return re;
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
  }
}

export default generatePatches;
