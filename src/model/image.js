import { Vector3 } from "three";

/**
 * Class to represent an image.
 */
class MyImage {
  // "mostly from http://www.html5canvastutorials.com/advanced/html5-canvas-get-image-data-tutorial/";

  data;
  res;
  loaded;
  path; // only for debug purposes

  /**
   * The constructor takes a path to an image file and loads it into a canvas
   * @param {*} path where to load the image from
   */
  constructor(path) {
    // TODO: the res and data and so on parts of the constructor could be moved into an onload function https://stackoverflow.com/questions/623172/how-to-get-image-size-height-width-using-javascript .

    this.path = path;

    const img = new Image();
    img.src = path;

    img.onload = () => {
      this.res = [img.naturalWidth, img.naturalHeight];

      const canvas = new OffscreenCanvas(this.res[0], this.res[1]);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0);

      this.data = ctx.getImageData(0, 0, this.res[0], this.res[1]).data;

      this.loaded = true;
      console.log("img loaded!");
    };
  }

  /**
   * discretizes the UV coordinates to a pixel
   * @param {*} u
   * @param {*} v
   */
  getXY(u, v) {
    return [u, v].map((x, i) => Math.round(x * this.res[i]));
  }

  /**
   * Returns the pixel value at the given UV coordinates.
   * @param {*} x
   * @param {*} y
   * @param {*} flipY
   * @returns {number}
   * @memberof MyImage
   */
  sample(u, v, flipY) {
    const [x, y] = flipY ? this.getXY(u, 1 - v) : this.getXY(u, v); //TODO: document this (texture flipping note)

    const red = this.data[(this.res[0] * y + x) * 4];
    const green = this.data[(this.res[0] * y + x) * 4 + 1];
    const blue = this.data[(this.res[0] * y + x) * 4 + 2];

    return new Vector3(red, green, blue);
  }
}

export default MyImage;
