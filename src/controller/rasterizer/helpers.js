import { Vector2, Vector3 } from "three";
import { Vertex } from "./rasterclasses";

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

function getOrthNormal(start, end) {
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
      positions.push(
        texel_midpoint.clone().add(new Vector2(i * xIncrement, j * yIncrement))
      );
    }
  }

  // This takes the max of the positions array. I won't blame you if this isn't immediatly obvious.
  const re = positions.reduce((a, b) =>
    normal.dot(a) > normal.dot(b) ? a : b
  );
  // Just for fun, here's how you'd do that in python:
  // > re =max(positions, key=lambda p: normal.dot(p))
  // Not saying python is better, buuuuut

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
