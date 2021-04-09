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

class ColoredTexel {
  constructor(u, v, r, g, b) {
    this.u = u;
    this.v = v;
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

/**
 * A rainbow texture useful for checking uniformity
 * @param {*} width
 * @param {*} height
 */
// Not beautifull but works
export const rainbowTexture = (width, height) => {
  var canvas = new OffscreenCanvas(width, height);
  var context = canvas.getContext("2d");

  // The four corners of the UV-square get assigned static colors.
  // per texel, these colors are interpolated by distance to that corner
  const corners = [
    // coordinate | color
    new ColoredTexel(0, 0, 40, 0, 0),
    new ColoredTexel(0, 1, 40, 40, 40),
    new ColoredTexel(1, 0, 0, 40, 0),
    new ColoredTexel(1, 1, 0, 0, 40),
  ];

  const factor_u = 1 / (width - 1);
  const factor_v = 1 / (height - 1);

  for (var col = 0; col < width; col++) {
    for (var row = 0; row < width; row++) {
      var me = new ColoredTexel(col * factor_u, row * factor_v, 0, 0, 0);

      for (var corner in corners) {
        const corner_factor = Math.min(
          Math.sqrt(
            Math.pow(me.u - corner.u, 2) + Math.pow(me.v - corner.v, 2)
          ),
          0
        );

        me.r += corner_factor * corner.r;
        me.g += corner_factor * corner.g;
        me.b += corner_factor * corner.b;
      }

      context.fillStyle = "rgb(" + me.r + ", " + me.g + ", " + me.b + ")";
      context.fillRect(col, row, 1, 1);
    }
  }

  return canvas.transferToImageBitmap();
};

export const defaultTexture = (width = 32, height = 32) => {
  // return checkerboardTexture(width, height, "black", "#ff00dc");

  return rainbowTexture(width, height);
};
