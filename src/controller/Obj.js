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

  debugger;
  // triangulate faces
};
