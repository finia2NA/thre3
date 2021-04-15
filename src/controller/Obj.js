const OBJFile = require("obj-file-parser");

const request = async (path) => {
  const response = await fetch(path);
  const text = await response.text();
  return text;
};

function uvDimToTexel(numPixels, uvCoordinate) {
  return Math.floor(numPixels * uvCoordinate);
}

export const objToPatches = async (path, txwidth, txheight) => {
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
    const face = faces[i];

    // for every edge
    for (var j = 0; j < 3; j++) {
      // again, hardcoded 3 here bc I expect all faces to be tris
      const [vertex0, vertex1] = [face.vertices[j], face.vertices[(j + 1) % 3]];

      // Breseham Alg, adapted from (https://de.wikipedia.org/wiki/Bresenham-Algorithmus)

      // First, we store the beginning and end of the line.
      const u0 = structure.textureCoords[vertex0.textureCoordsIndex - 1].u;
      const v0 = structure.textureCoords[vertex0.textureCoordsIndex - 1].v;
      const u1 = structure.textureCoords[vertex1.textureCoordsIndex - 1].u;
      const v1 = structure.textureCoords[vertex1.textureCoordsIndex - 1].v;

      // However, the breseham alg thingy expects end and beginning in Texels, not uv coordinates.
      // So, we convert those to texels.
      var x0 = uvDimToTexel(u0, txwidth);
      var y0 = uvDimToTexel(v0, txheight);
      var x1 = uvDimToTexel(u1, txwidth);
      var y1 = uvDimToTexel(v1, txheight);

      const dx = Math.abs(x1 - x0); // how many u steps
      const sx = x0 < x1 ? 1 : -1; // in what direction
      const dy = -Math.abs(y1 - y0); // how many v steps
      const sy = y0 < y1 ? 1 : -1; // in what direction
      var err = dx + dy; // total number of pixels to fill
      var e2; /* error value e_xy */

      while (true) {
        console.log(x0, y0); // TODO: replace the log with actually calculating a patch
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 > dy) {
          err += dy;
          x0 += sx;
        } /* e_xy+e_x > 0 */
        if (e2 < dx) {
          err += dx;
          y0 += sy;
        } /* e_xy+e_y < 0 */
      }

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
