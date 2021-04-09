/**
 * A checkerboard Testure that's suitable for discerning between texels.
 * @param {*} width
 * @param {*} height
 * @param {*} color1
 * @param {*} color2
 * @returns
 */

export const checkerboardTexture = (
  width,
  height,
  color1 = "black",
  color2 = "white"
) => {
  var canvas = new OffscreenCanvas(width, height);
  var context = canvas.getContext("2d");

  for (var col = 0; col < width; col++) {
    for (var row = 0; row < width; row++) {
      context.fillStyle = (col + row) % 2 === 0 ? color1 : color2;
      context.fillRect(col, row, 1, 1);
    }
  }

  return canvas.transferToImageBitmap();
};

function RGBToHex(r, b, g) {
  return "#" + r.toString(16) + g.toString(16) + b.toString(16);
}

class ColoredTexel {
  constructor(uv, color) {
    this.uv = uv;
    this.color = color;
  }
}

/**
 * A rainbow texture useful for checking uniformity
 * @param {*} width
 * @param {*} height
 */
// Not beautifull but works
export const rainbowTexture = (width, height) => {
  const corners = [
    [[0, 0], "red"],
    [[0, 1], "white"],
    [[1, 0], "green"],
    [[1, 1], "blue"],
  ];

  var canvas = new OffscreenCanvas(width, height);
  var context = canvas.getContext("2d");

  for (var index = 0; index < corners.length; index++) {
    context.fillStyle = corners[index][1];
    context.fillRect(corners[index][0][0], corners[index][0][1], 1, 1);
  }

  return canvas.transferToImageBitmap();
};

export const defaultTexture = (width = 32, height = 32) => {
  // return checkerboardTexture(2, 2, "black", "#ff00dc");

  return rainbowTexture(2, 2);
};
