const OBJFile = require("obj-file-parser");

const request = async (path) => {
  const response = await fetch(path);
  const text = await response.text();
  return text;
};

export const objToPatches = async (path) => {
  // Load file
  const text = await request(path);
  console.log(text);

  // parse file
  const parsed = new OBJFile(text).parse();

  // array that faces will be written to
  // var faces = []

  // for (var model = 0; model < parsed.models.length; model++) {
  //   for (var face = 0; face < parsed.models[model].faces.length; face++) {
  //     // triangulate faces
  //     // copy verts into new array
  //     var verts = parsed.models[model].faces.map(x => x) // TODO: i hope this is a way to copy elements

  //     while (verts.length > 3) {

  //     }
  //   }
  // }

  // debugger;
};
