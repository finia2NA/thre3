import { Vector2, Vector3 } from "three";
import { Vertex, ClosestRes } from "./rasterclasses";
import { intersect as extIntersect } from "mathjs";
import Patch from "model/patch";
import coolmod from "util/coolmod";

// TODO: refactor this file by splitting, finding duplicates and unused functions and commenting

export function checkNormalized(vector) {
  return Math.abs(vector.length() - 1) <= 0.005;
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
