import { Vector2, Vector3 } from "three";
import { Vertex, ClosestRes } from "./rasterclasses";
import { intersect as extIntersect } from "mathjs";

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
  return Math.abs(normal3.length() - 1) <= 0.005;
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

function closestPointLine(point, line) {
  start = line[0];
  end = line[1];

  // First, determine the closes point on the line to p.
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

  // Then, calculate the distance from p t it.
  const distance = Math.abs(point.clone().sub(p).length());

  // return bayecentric factor, distance and point
  return [ls, distance, point];
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
    const candidate = new ClosestRes(startIndex, ls, dist, point);

    if (re && re.distance < this.distance) {
      re = candidate;
    }
  }
  return re;
}

/**
 * Takes a discrete Texel position and returns the position of its midpoint in 0-1 tx space.
 * @param {*} texelPos
 * @param {*} xRes
 * @param {*} yRes
 * @returns
 */
export function discreteToMidpoint(texelPos, xRes, yRes) {
  return new Vector2((0.5 + texelPos[0]) / xRes, (0.5 + texelPos[1]) / yRes);
}

export function midpointToDiscrete(pos, xRes, yRes) {
  const x = Math.floor(pos.x * xRes);
  const y = Math.floor(pos.y * yRes);

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
export function cornerpoints(texel_midpoint, xRes, yRes) {
  const xIncrement = 1 / xRes;
  const yIncrement = 1 / yRes;

  const positions = [];

  for (const i of [-0.5, 0.5]) {
    for (const j of [-0.5, 0.5]) {
      positions.push(
        texel_midpoint.clone().add(new Vector2(i * xIncrement, j * yIncrement))
      );
    }
  }
  return positions;
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
 * get the area of a polygon
 * @param {*} positions
 * @returns
 */
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

/**
 * returns the point of intersection if the line from e1s->e1e intersects with e2s->e2e, or null if no such intersection exists.
 * @param {Vector2[]} e1 The first edge
 * @param {Vector2[]} e2 The second edge
 * @returns the intersection point or *null* if no intersection exists between the segments.
 */
// from https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
export function intersectSegments(e1, e2) {
  point = extIntersect(e1.x, e1.y, e2.x, e2.y);

  if (!point)
    // in this case, there was no intersection
    return null;
  else {
    // in this case, there was an intersection, but we still need to check if that intersection between the *lines* was indeed on the *segments*.
    // for this, we use the method defined above to find the closest point on one of the lines to that intersection.
    // if the intersection itself was on the point, the distance between it and the point we got through intersection
    // should be pretty small, eh?

    for (const e of [e1, e2]) {
      const dist = closestPointLine(point, e)[1];
      if (dist < 0.0001)
        // not 0 bc numerics and stuff
        return null;
    }
    return point;
  }
}
export function vectorAverage(vectors) {
  return vectors.reduce((prev, nu) =>
    prev.clone().addVector(nu.clone().multiplyScaler(1 / vectors.length))
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

/**
 * creates a patch-fragment interpolation that's the result of adding the fragment to the patch
 * @param {*} patch
 * @param {*} fragment
 * @param {*} xRes
 * @param {*} yRes
 * @returns
 */
export function pfInterpolate(patch, fragment, xRes, yRes) {
  fNice =
    distance(discreteToMidpoint(texel, xRes, yRes), fragment.position2) /
    (1 + fragment.area2);
  pNice =
    distance(discreteToMidpoint(texel, xRes, yRes), patch.position2) /
    (1 + patch.area2);

  const position2 = fNice < pNice ? fragment.position2 : patch.position2;
  const position3 = fNice < pNice ? fragment.position3 : patch.position3;
  const normal3 = fNice < pNice ? fragment.normal3 : patch.normal3;

  const area2 = patch.area2 + fragment.area2;
  const area3 = patch.area3 + fragment.area3;

  const selfIlluminance = patch.selfIlluminance
    .clone()
    .addVector(fragment.selfIlluminance);
  const reflectance = patch.reflectance
    .clone()
    .multiplyScalar(patch.area2 / area2)
    .addVector(fragment.clone().multiplyScalar(fragment.area2 / area2));

  return new Patch(
    position2,
    position3,
    normal3,
    patch.texel,
    selfIlluminance,
    reflectance,
    area2,
    area3
  );
}
