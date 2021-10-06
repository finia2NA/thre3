import { Vector3 } from "three";

const rgbHex = require("rgb-hex");

function downloadBlob(blob, name = "file.png") {
  // credit: https://dev.to/nombrekeff/download-file-from-blob-21ho
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  // Remove link from body
  document.body.removeChild(link);
}

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

export const reflectanceTexture = (patches, width, height, flipY) => {
  const colors = patches.map((row) => row.map((patch) => patch.reflectance));
  return gridTexture(colors, width, height, flipY);
};

export const unshotDensityTexture = (patches, width, height) => {
  const colors = patches.map((row) =>
    row.map((patch) => patch.unshotEnergy.clone().divideScalar(patch.area3))
  );
  return gridTexture(colors, width, height);
};

export const densityTexture = (
  patches,
  width,
  height,
  flipY,
  extMaxDensity = null,
  downloadTexture = false
) => {
  const colors = patches.map((row) =>
    row.map((patch) => patch.getEnergyDensity())
  );
  return gridTexture(
    colors,
    width,
    height,
    flipY,
    extMaxDensity,
    downloadTexture
  );
};

const gridTexture = (
  patches,
  width,
  height,
  flipY,
  externalMax = null,
  writeBlob = false
) => {
  // TODO: a thing that takes into considerations cross.object max
  // TODO: determine if flipY is nesseccary
  // create canvas
  var canvas = new OffscreenCanvas(width, height);
  var context = canvas.getContext("2d");

  // determine the max energy in a single color channel.

  var maxBrightness;

  if (externalMax) {
    maxBrightness = externalMax;
  } else {
    const maxComponents = new Vector3(0, 0, 0);
    for (var i = 0; i < patches.length; i++) {
      for (var j = 0; j < patches[i].length; j++) {
        if (patches[i][j]) {
          // "If this vector's x, y or z value is less than the argument's x, y or z value, replace that value with the corresponding max value."
          maxComponents.max(patches[i][j]);
        }
      }
    }
    maxBrightness = Math.max(...maxComponents.toArray());
  }

  for (var x = 0; x < patches.length; x++) {
    for (var y = 0; y < patches[x].length; y++) {
      if (!patches[x][y]) {
        // if there's no patch here there's nothing to do, eh? ^^
        continue;
      }
      const patch = patches[x][y];
      const wattage = patch.clone().multiplyScalar(255 / maxBrightness);

      context.fillStyle =
        "#" +
        rgbHex(
          Math.round(wattage.x),
          Math.round(wattage.y),
          Math.round(wattage.z)
        );

      const writex = x;
      const writey = y;
      // const writey = flipY ? height - y : y;
      context.fillRect(writex, writey, 1, 1);
    }
  }
  if (writeBlob) {
    canvas
      .convertToBlob({ type: "image/png" })
      .then((blob) => downloadBlob(blob));
  }

  return canvas.transferToImageBitmap();
};

export const defaultTexture = (width = 32, height = 32) => {
  // return checkerboardTexture(2, 2, "black", "#ff00dc");

  return rainbowTexture(width, height);
};
