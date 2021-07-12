import {} from "./helpers";

export class Boundingbox {
  xMax;
  xMin;
  yMax;
  yMin;

  constructor(corners, xRes, yRes) {
    const xs = corners.map((o) => o.x);
    const ys = corners.map((o) => o.y);

    this.xMax = Math.floor(xRes * Math.max(...xs));
    this.xMin = Math.floor(xRes * Math.min(...xs));
    this.yMax = Math.floor(yRes * Math.max(...ys));
    this.yMin = Math.floor(yRes * Math.min(...ys));
  }
}

export class Vertex {
  constructor(vertexCoord, txCoord, vertexNormal) {
    this.txCoord = txCoord;
    this.vertexCoord = vertexCoord;
    this.vertexNormal = vertexNormal;
  }
}
