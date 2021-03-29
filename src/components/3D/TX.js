const getCheckerboardTexture = (width, height) => {
  var canvas = new OffscreenCanvas(width, height);
  var context = canvas.getContext("2d");

  for (var col = 0; col < width; col++) {
    for (var row = 0; row < width; row++) {
      context.fillStyle = (col + row) % 2 === 0 ? "black" : "white";
      context.fillRect(col, row, 1, 1);
    }
  }

  return canvas.transferToImageBitmap();
};
export default getCheckerboardTexture;
