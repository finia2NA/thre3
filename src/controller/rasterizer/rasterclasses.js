export class Boundingbox {
  xMax;
  xMin;
  yMax;
  yMin;

  constructor(corners, xRes, yRes) {
    const xs = corners.map((o) => o.x);
    const ys = corners.map((o) => o.y);

    const xMax = Math.ceil(Math.max(...xs) * xRes);
    const xMin = Math.floor(Math.min(...xs) * xRes);
    const yMax = Math.ceil(Math.max(...ys) * yRes);
    const yMin = Math.floor(Math.min(...ys) * yRes);
  }
}

export class Vertex {
  constructor(vertexCoord, txCoord, vertexNormal) {
    this.txCoord = txCoord;
    this.vertexCoord = vertexCoord;
    this.vertexNormal = vertexNormal;
  }
}
