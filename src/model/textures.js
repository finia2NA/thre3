const rgbHex = require("rgb-hex");

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
    for (var row = 0; row < height; row++) {
      context.fillStyle = (col + row) % 2 === 0 ? color1 : color2;
      context.fillRect(col, row, 1, 1);
    }
  }

  return canvas.transferToImageBitmap();
};

/**
 * A rainbow texture where every pixel has a different value. This is useful for checking uv-mapping.
 * @param {*} width
 * @param {*} height
 */
export const rainbowTexture = (width, height) => {
  const maxBrightness = 220;

  var canvas = new OffscreenCanvas(width, height);
  var context = canvas.getContext("2d");

  var factor_col = 1.0 / (width - 1);
  var factor_row = 1.0 / (height - 1);

  for (var col = 0; col < width; col++) {
    for (var row = 0; row < height; row++) {
      context.fillStyle =
        "#" +
        rgbHex(
          col * factor_col * maxBrightness,
          ((row * factor_row + col * factor_col) / 4) * maxBrightness,
          row * factor_row * maxBrightness
        );
      context.fillRect(col, row, 1, 1);
    }
  }

  return canvas.transferToImageBitmap();
};

export const patchTexture = (patches, width, height) => {
  // create canvas
  var canvas = new OffscreenCanvas(width, height);
  var context = canvas.getContext("2d");

  // bg of the canvas is no energy = black
  context.fillStyle = "black";
  context.fill(0, 0, width, height); //TODO: off-by-ones would lead to overdrawing or to wite line at the edge

  // determine what energy corresponds to white
  const maxBrightness = Math.max(...patches.map((x) => x.finalWattage));

  for (const patch of patches) {
    const wattage = patch.finalWattage;

    context.fillStyle =
      "#" +
      rgbHex(
        Math.round(wattage[0] / maxBrightness),
        Math.round(wattage[1] / maxBrightness),
        Math.round(wattage[2] / maxBrightness)
      );
    context.fillRect(patch.backwriteCoord[0], patch.backwriteCoord[1], 1, 1);
  }

  return canvas.transferToImageBitmap();
};

export const defaultTexture = (width = 32, height = 32) => {
  // return checkerboardTexture(2, 2, "black", "#ff00dc");

  return rainbowTexture(width, height);
};
