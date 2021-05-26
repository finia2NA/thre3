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
      const vertexCoord = structure.vertices[vertex.vertexIndex];
      const txCoord = structure.textureCoords[vertex.textureCoordsIndex];
      const vertexNormal = structure.vertexNormals[vertex.vertexNormalIndex];
      // debugger;

      const v = new Vertex(vertexCoord, txCoord, vertexNormal);
      vertexValues.push(v);
    }

    re.push(vertexValues);
  }

  return re;
}

// Takes a parsed obj,
const generatePatches = (
  objText,
  xRes,
  yRes,
  luminancePath,
  reflectancePath
) => {
  const parsed = new OBJFile(objText).parse();
  const structure = parsed.models[0];

  const faces = resolveActualValues(structure);
  debugger;
};

export default generatePatches;
