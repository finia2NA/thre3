import { getOrthNormal } from "./helpers";

export class ClosestRes {
  startIndex;
  bay1;
  distance;
  pos;

  constructor(startIndex, bay1, distance, pos) {
    this.startIndex = startIndex;
    this.bay1 = bay1;
    this.distance = distance;
    this.pos = pos;
  }
}

export class Boundingbox {
  xMax;
  xMin;
  yMax;
  yMin;

  constructor(corners, xRes, yRes) {
    const xs = corners.map((o) => o.x);
    const ys = corners.map((o) => o.y);

    this.xMax = Math.ceil(Math.max(...xs) * (xRes - 1));
    this.xMin = Math.floor(Math.min(...xs) * (xRes - 1));
    this.yMax = Math.ceil(Math.max(...ys) * (yRes - 1));
    this.yMin = Math.floor(Math.min(...ys) * (yRes - 1));
  }
}

export class Implicit {
  constructor(start, end) {
    if (start.equals(end))
      console.error(
        "Tried to get a HNF where start and end are the same, which doesn't exist"
      );

    this.normal = getOrthNormal(start, end);
    this.offset = start.dot(this.normal);
  }

  apply(point) {
    const re = this.normal.dot(point) - this.offset;
    return re;
  }
}

export class Vertex {
  constructor(vertexCoord, txCoord, vertexNormal) {
    this.txCoord = txCoord;
    this.vertexCoord = vertexCoord;
    this.vertexNormal = vertexNormal;
  }
}
