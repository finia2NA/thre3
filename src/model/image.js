import { Vector3 } from "three";

class MyImage {
  // TODO: find a better name (Image already taken)
  // "mostly from http://www.html5canvastutorials.com/advanced/html5-canvas-get-image-data-tutorial/";
  data;
  res;
  loaded;
  path; // only for debug purposes

  constructor(path) {
    // TODO: do the res and data and so on parts of the constructor in the onload function https://stackoverflow.com/questions/623172/how-to-get-image-size-height-width-using-javascript .

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

  getXY(u, v) {
    return [u, v].map((x, i) => Math.round(x * this.res[i]));
  }

  sample(u, v) {
    const [x, y] = this.getXY(u, v);

    const red = this.data[(this.res[0] * y + x) * 4];
    const green = this.data[(this.res[0] * y + x) * 4 + 1];
    const blue = this.data[(this.res[0] * y + x) * 4 + 2];
    // const alpha = this.data[((this.res[0] * y) + x) * 4 + 3]; // don't really need the alpha huh.. If I did I'd return a Vector4 instead

    // if(this.path==="robj/package/reflectance.png")
    //   debugger;

    return new Vector3(red, green, blue);
  }
}

export default MyImage;
