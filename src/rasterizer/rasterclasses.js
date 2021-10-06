import {} from "./helpers";

export class Boundingbox {
  xMax;
  xMin;
  yMax;
  yMin;

  constructor(corners, xRes, yRes) {
    const xCoordinates = corners.map((o) => o.x);
    const yCoordinates = corners.map((o) => o.y);

    this.xMax = Math.ceil(xRes * Math.max(...xCoordinates));
    this.xMin = Math.floor(xRes * Math.min(...xCoordinates));
    this.yMax = Math.ceil(yRes * Math.max(...yCoordinates));
    this.yMin = Math.floor(yRes * Math.min(...yCoordinates));
  }
}

export class Vertex {
  constructor(vertexCoord, txCoord, vertexNormal) {
    this.txCoord = txCoord;
    this.vertexCoord = vertexCoord;
    this.vertexNormal = vertexNormal;
  }
}
