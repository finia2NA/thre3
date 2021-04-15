const OBJFile = require("obj-file-parser");

const request = async (path) => {
  const response = await fetch(path);
  const text = await response.text();
  return text;
};

export const objToPatches = async (path) => {
  // Load file
  const text = await request(path);
  // console.log(text);

  // parse file
  const parsed = new OBJFile(text).parse();

  // TODO: maybe in the future I'll do some trickery here that converts faces to tris
  // (because I need tris for the bayecentric coordinates to work.)
  // Ideas are here https://en.wikipedia.org/wiki/Polygon_triangulation
  // However, I'm not sure how to solve problems that stem from "weird" geometry which isn't planar.
  // (see random/problem_1.png)
  // For now, however, I require objs to already have exclusively tri faces.

  const structure = parsed.models[0];
  const faces = parsed.models[0].faces;

  // for every face
  for (var i = 0; i < faces.length; i++) {
    console.log(structure);
    const face = faces[i];

    // for every edge
    for (var j = 0; j < 3; j++) {
      // again, hardcoded 3 here bc I expect all faces to be tris
      const [vertex1, vertex2] = [face.vertices[j], face.vertices[(j + 1) % 3]];

      // find out the running direction for breseham alg
      const width =
        structure.textureCoords[vertex2.textureCoordsIndex - 1].u -
        structure.textureCoords[vertex1.textureCoordsIndex - 1].u;
      const height =
        structure.textureCoords[vertex2.textureCoordsIndex - 1].v -
        structure.textureCoords[vertex1.textureCoordsIndex - 1].v;
      const runningDirection =
        Math.abs(width) > Math.abs(height)
          ? width > 0
            ? [1, 0]
            : [-1, 0]
          : height > 0
          ? [0, 1]
          : [0, -1];
      debugger;

      // the dominant direction is the one we need to iterate over.
      // (random/illustration_1)
      // const dominant = dominant(edge)

      // dominant(edge[0], edge[1])
    }
    // calculate patch coordinate values for corners

    // calculate edge representations w/ breseham algorithm (doing it like this solves random/problem_2.png)

    // calculate fill with linear interpolations per scanline.
  }
};
