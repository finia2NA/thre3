import { Vector2, Vector3 } from "three";
import { Vertex, ClosestRes } from "./rasterclasses";
import { intersect as extIntersect } from "mathjs";
import Patch from "model/patch";
import coolmod from "util/coolmod";

// TODO: refactor this file by splitting, finding duplicates and unused functions and commenting

/**
 * checks wether a given face was defined in a counterclockwise fashion (using a coordinate system where the y-axis points down).
 * @param {*} c
 * @returns
 */
export function checkCounterClockwise(c) {
  // https://mathworld.wolfram.com/PolygonArea.html

  // first calculate area of the triangle
  var a = 0;
  for (var i = 0; i < 3; i++) {
    a += c[i].x * c[(i + 1) % 3].y - c[(i + 1) % 3].x * c[i].y;
  }

  // usually, if said area is positive, the tri was defined counterclockwise, else clockwise.
  // however, since in our coordsystem, y points downward, the opposite is true.
  return a < 0;
}

export function checkNormalized(vector) {
  return Math.abs(vector.length() - 1) <= 0.005;
}

/**
 * checks if all elements of two given arrays are equal
 * @param {*} a
 * @param {*} b
 * @returns
 */
export function elementwiseEquals(a, b) {
  if (a.length !== b.length) {
    console.error(
      "I was asked to compare the elements of arrays of different lengths"
    );
  }

  for (var i = 0; i < b.length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}
/**
 * takes rational factors and vectors and returns the linear combination of those.
 * @param {*} bay
 * @param {*} face
 * @returns
 */
export function linearCombination(bay, face) {
  const f0 = face[0].clone().multiplyScalar(bay[0]);
  const f1 = face[1].clone().multiplyScalar(bay[1]);
  const f2 = face[2].clone().multiplyScalar(bay[2]);

  const re = f0.clone().add(f1).add(f2);

  return re;
}

function closestPointLine(target, line) {
  if (!target.clone) debugger;

  const start = line[0];
  const end = line[1];

  // First, determine the closes point on the line to p.
  const startToEnd = end.clone().sub(start);
  const startToTarget = target.clone().sub(start);
  var ls = startToTarget.dot(startToEnd) / startToEnd.dot(startToEnd);

  var re = undefined;
  if (ls <= 0) {
    re = start;
    ls = 0;
  } else if (ls >= 1) {
    re = end;
    ls = 1;
  } else {
    re = start
      .clone()
      .multiplyScalar(1 - ls)
      .add(end.clone().multiplyScalar(ls));
  }

  // Then, calculate the distance from target to re.
  const distance = Math.abs(re.clone().sub(target).length());

  // return bayecentric factor, distance and point
  return [ls, distance, re];
}

/**
 * given a point p and a face, returns a point p' closest to p inside the face.
 * @param {*} p
 * @param {*} face
 * @returns
 */
export function getClosestInside(p, face) {
  var re = undefined;
  const txCoords = face.map((x) => x.txCoord);

  for (var i = 0; i < 3; i++) {
    const line = [txCoords[i], txCoords[(i + 1) % 3]];

    const [ls, dist, point] = closestPointLine(p, line);
    const candidate = new ClosestRes(i, ls, dist, point);

    if (re && re.distance < this.distance) {
      re = candidate;
    }
  }
  return re;
}

/**
 * Takes a discrete Texel position and returns the position of its midpoint in 0-1 tx space.
 * @param {*} texel
 * @param {*} xRes
 * @param {*} yRes
 * @returns
 */
export function discreteToMidpoint(texel, xRes, yRes) {
  const xIncrement = 1 / xRes;
  const yIncrement = 1 / yRes;

  const x = (0.5 + texel[0]) * xIncrement;
  const y = (0.5 + texel[1]) * yIncrement;
  return new Vector2(x, y);
}

export function pointToDiscrete(pos, xRes, yRes) {
  const x = Math.floor(pos.x * xRes);
  const y = Math.floor(pos.y * yRes);

  debugger;
  return [x, y];
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

/**
 * Takes an OBJ structure and resolves usable faces made up from vertices from it.
 * @param {*} structure
 * @returns
 */
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

/**
 * Gets the normal of a line
 * @param {*} start
 * @param {*} end
 * @returns
 */
export function getOrthNormal(start, end) {
  const direction = end.clone().sub(start);
  const re = new Vector2(-direction.y, direction.x);
  re.divideScalar(re.length());

  return re;
}

/**
 * Given a texel midpoint and the rasterization resolution, compute its cornerpoints
 * @param {*} texel_midpoint
 * @param {*} xRes
 * @param {*} yRes
 * @returns
 */
export function cornerpoints(texel, xRes, yRes) {
  const xIncrement = 1 / xRes;
  const yIncrement = 1 / yRes;

  const texel_midpoint = discreteToMidpoint(texel, xRes, yRes);

  const positions = [];

  for (const pair of [
    [-0.5, -0.5],
    [-0.5, 0.5],
    [0.5, 0.5],
    [0.5, -0.5],
  ]) {
    positions.push([
      pair[0] * xIncrement + texel_midpoint.x,
      pair[1] * yIncrement + texel_midpoint.y,
    ]);
  }
  return positions.map((arr) => new Vector2(arr[0], arr[1]));
}

function getCandidate(texel_midpoint, normal, xRes, yRes) {
  const positions = cornerpoints(texel_midpoint, xRes, yRes);

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

/**
 * get the area of a tri
 * @param {*} positions
 * @returns
 */
export function getArea3(a, b, c) {
  const ab = b.clone().sub(a);
  const ac = c.clone().sub(a);

  const cross = ab.clone().cross(ac);

  // sometimes the resulting cp is a number, sometimes it's a vector whose length is the value we're looking for.
  if (typeof cross == "number") return cross / 2;
  else return cross.length() / 2;
}

export function getAreaConvex(positions) {
  if (positions.length < 2) return null;
  else {
    var sum = 0;

    const anchor = positions[0];
    for (var i = 2; i < positions.length; i++) {
      const prev = positions[i - 1];
      const curr = positions[i];

      sum += getArea3(anchor, prev, curr);
    }

    return sum;
  }
}

export function intersectLines(e1, e2) {
  const intersectResult = extIntersect(
    [e1[0].x, e1[0].y],
    [e1[1].x, e1[1].y],
    [e2[0].x, e2[0].y],
    [e2[1].x, e2[1].y]
  );

  if (!intersectResult) {
    // in this case, there was no intersection
    return null;
  } else {
    return new Vector2(intersectResult[0], intersectResult[1]);
  }
}

/**
 * returns the point of intersection if the line from e1s->e1e intersects with e2s->e2e, or null if no such intersection exists.
 * @param {Vector2[]} e1 The first edge
 * @param {Vector2[]} e2 The second edge
 * @returns the intersection point or *null* if no intersection exists between the segments.
 */
// from https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
export function intersectSegments(e1, e2) {
  const intersect = intersectLines(e1, e2);
  if (!intersect) return intersect;

  // in this case, there was an intersection, but we still need to check if that intersection between the *lines* was indeed on the *segments*.
  // for this, we use the method defined above to find the closest point on one of the lines to that intersection.
  // if the intersection itself was on the point, the distance between it and the point we got through intersection
  // should be pretty small, eh?
  for (const e of [e1, e2]) {
    const dist = closestPointLine(intersect, e)[1];
    if (dist < 0.0001)
      // not 0 bc numerics and stuff
      return null;
  }
  return intersect;
}

export function convexMidpoint2(points) {
  return convexMidpoint(points, new Vector2(0, 0));
}

export function convexMidpoint3(points) {
  return convexMidpoint(points, new Vector3(0, 0, 0));
}

function convexMidpoint(points, initial) {
  // https://stackoverflow.com/questions/34059116/what-is-the-fastest-way-to-find-the-center-of-an-irregular-convex-polygon
  const sumCenter = initial;

  var sumWeight = 0;
  for (var i = 0; i < points.length; i++) {
    const prev = points[coolmod(i - 1, points.length)];
    const curr = points[i];
    const next = points[coolmod(i + 1, points.length)];

    const weight =
      curr.clone().sub(prev).length() + curr.clone().sub(next).length();

    sumCenter.add(curr.clone().multiplyScalar(weight));
    sumWeight += weight;
  }

  if (sumWeight === 0) {
    // needed for the case when calculating a new normal and all 3 input normals are the same
    return points[0];
  } else {
    return sumCenter.divideScalar(sumWeight);
  }
}

export function vectorAverage(vectors) {
  return vectors.reduce((prev, nu) =>
    prev.clone().add(nu.clone().multiplyScalar(1 / vectors.length))
  );
}
export function reconstructVertex(txCoord, face) {
  const bays = getBayecentrics(txCoord, face);
  const vertexCoord = linearCombination(
    bays,
    face.map((vert) => vert.vertexCoord)
  );
  const vertexNormal = linearCombination(
    bays,
    face.map((vert) => vert.vertexNormal)
  );

  return new Vertex(vertexCoord, txCoord, vertexNormal);
}

function pointDistance(a, b) {
  return Math.abs(a.clone().sub(b).length);
}

/**
 * creates a patch-fragment interpolation that's the result of adding the fragment to the patch
 * @param {*} patch
 * @param {*} fragment
 * @param {*} xRes
 * @param {*} yRes
 * @returns
 */
export function pfInterpolate(patch, fragment, xRes, yRes) {
  const fNice =
    pointDistance(
      discreteToMidpoint(fragment.backwriteTX, xRes, yRes),
      fragment.position2
    ) /
    (1 + fragment.area2);
  const pNice =
    pointDistance(
      discreteToMidpoint(fragment.backwriteTX, xRes, yRes),
      patch.position2
    ) /
    (1 + patch.area2);

  const position2 = fNice < pNice ? fragment.position2 : patch.position2;
  const position3 = fNice < pNice ? fragment.position3 : patch.position3;
  const normal3 = fNice < pNice ? fragment.normal3 : patch.normal3;

  const area2 = patch.area2 + fragment.area2;
  const area3 = patch.area3 + fragment.area3;

  const totalEnergy = patch.totalEnergy.clone().add(fragment.totalEnergy);
  const reflectance = patch.reflectance
    .clone()
    .multiplyScalar(patch.area2 / area2)
    .add(fragment.reflectance.clone().multiplyScalar(fragment.area2 / area2));

  return new Patch(
    position2,
    position3,
    normal3,
    patch.backwriteTX,
    totalEnergy,
    reflectance,
    area2,
    area3
  );
}

/**
 * Checks if a given list is a 3D shape that is not just a horizontal or vertical line
 * @param {*} vertices
 * @returns
 */
export function dameCheck(vertices) {
  if (!vertices || vertices.length < 3) return false;

  const x = vertices[0].x;
  const y = vertices[0].y;

  var xChanged = false;
  var yChanged = false;

  for (var i = 1; i < vertices.length; i++) {
    if (vertices[i].x !== x) xChanged = true;
    if (vertices[i].y !== y) yChanged = true;
  }

  return xChanged && yChanged;
}

export function normalizeVector3(v) {
  return v.clone().divideScalar(v.length());
}
