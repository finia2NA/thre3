import { Vector2, Vector3 } from "three";
import { Vertex, ClosestRes } from "./rasterclasses";

export function multiplyArrayVector3(array, vector) {
  return new Vector3(
    array[0] * vector.x,
    array[1] * vector.y,
    array[2] * vector.z
  );
}

function closestToLineSegment(p, face, startIndex) {
  const start = face[startIndex];
  const end = face[(startIndex + 1) % 3];

  const startToEnd = end.clone().sub(start);
  const startToP = p.clone().sub(start);
  var ls = startToP.dot(startToEnd) / startToEnd.dot(startToEnd);

  var point = undefined;
  if (ls <= 0) {
    point = start;
    ls = 0;
  } else if (ls >= 1) {
    point = end;
    ls = 1;
  } else {
    point = start
      .clone()
      .multiplyScalar(1 - ls)
      .add(end.clone().multiplyScalar(ls));
  }

  const distance = Math.abs(point.clone().sub(p).length());
  return new ClosestRes(startIndex, ls, distance, point);
}

export function getClosestInside(p, face) {
  var re = undefined;

  for (var i = 0; i < 3; i++) {
    const candidate = closestToLineSegment(
      p,
      face.map((x) => x.txCoord),
      i
    );

    if (!re || re.distance > this.distance) re = candidate;

    return re;
  }
}

export function discreteToMidpoint(texelPos, xRes, yRes) {
  return new Vector2((0.5 + texelPos[0]) / xRes, (0.5 + texelPos[1]) / yRes);
}

export function getBayecentrics(p, face) {
  const a = face[0].txCoord;
  const b = face[1].txCoord;
  const c = face[2].txCoord;

  const v0 = b.clone().sub(a);
  const v1 = c.clone().sub(a);
  const v2 = p.clone().sub(a);

  const d00 = v0.dot(v0);
  const d01 = v0.dot(v1);
  const d11 = v1.dot(v1);
  const d20 = v2.dot(v0);
  const d21 = v2.dot(v1);

  const denom = d00 * d11 - Math.pow(d01, 2);

  const v = (d11 * d20 - d01 * d21) / denom;
  const w = (d00 * d21 - d01 * d20) / denom;
  const u = 1.0 - v - w;

  return [u, v, w];
}

export function resolveActualValues(structure) {
  var re = [];

  for (const face of structure.faces) {
    const vertexValues = [];

    for (const vertex of face.vertices) {
      // why these things are 1-indexed I could not tell you, but I can assure you they are
      const v = structure.vertices[vertex.vertexIndex - 1];
      const t = structure.textureCoords[vertex.textureCoordsIndex - 1];
      const n = structure.vertexNormals[vertex.vertexNormalIndex - 1];

      const actual = new Vertex(
        new Vector3(v.x, v.y, v.z),
        new Vector2(t.u, t.v),
        new Vector3(n.x, n.y, n.z)
      );
      vertexValues.push(actual);
    }

    re.push(vertexValues);
  }

  return re;
}

export function getOrthNormal(start, end) {
  const direction = end.clone().sub(start);
  const re = new Vector2(-direction.y, direction.x);
  re.divideScalar(re.length());

  return re;
}

function getCandidate(texel_midpoint, normal, xRes, yRes) {
  const xIncrement = 1 / xRes;
  const yIncrement = 1 / yRes;

  const positions = [];

  for (const i of [-0.5, 0.5]) {
    for (const j of [-0.5, 0.5]) {
      // debugger;
      positions.push(
        texel_midpoint.clone().add(new Vector2(i * xIncrement, j * yIncrement))
      );
    }
  }

  // This takes the max of the positions array. I won't blame you if this isn't immediatly obvious.
  const re = positions.reduce((a, b) =>
    normal.dot(a) > normal.dot(b) ? a : b
  );

  return re;
}

export function conservative(start, end, xRes, yRes) {
  const n = getOrthNormal(start, end);

  const re_start = getCandidate(start, n, xRes, yRes);
  const re_end = getCandidate(end, n, xRes, yRes);

  return [re_start, re_end];
}

export function getArea(positions) {
  const a = positions[0];
  const b = positions[1];
  const c = positions[2];

  const ab = b.clone().sub(a);
  const ac = c.clone().sub(a);

  const cross = ab.clone().cross(ac);

  // sometimes the resulting cp is a number, sometimes it's a vector whose length is the value we're looking for.
  if (typeof cross == "number") return cross / 2;
  else return cross.length() / 2;
}
