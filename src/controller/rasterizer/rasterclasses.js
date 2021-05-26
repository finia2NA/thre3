export class Boundingbox {
  xMax;

  constructor(corners) {
    const xs = corners.map((o) => o.x);
    const ys = corners.map((o) => o.y);

    console.log(xs);
    const xMax = Math.ceil(Math.max(...xs)); //TODO: make it so it's not literally just 1 -.-
    // this.xMin = Math.floor(Math.min(corners.map(o => o.x)))
    // this.yMax = Math.ceil(Math.max(corners.map(o => o.y)))
    // this.yMin = Math.floor(Math.min(corners.map(o => o.y)))

    console.log(xMax);
  }
}
