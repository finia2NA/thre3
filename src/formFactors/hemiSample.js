import { getPlaneNormal } from "rasterizer/helpers";
import { Vector3 } from "three";

/**
 * gets a number of samplepoints in a sphere
 * @param {*} endsample the number of samplepoints to calculate
 */
export function getSphereSamplepoints(endsample, startSample = 0) {
  // https://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere/26127012#26127012
  var points = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle in radians

  for (var i = startSample; i < endsample; i++) {
    const y = 1 - (i / (endsample - 1)) * 2; // y goes from 1 to - 1
    const radius = Math.sqrt(1 - y * y); // radius at y

    const theta = phi * i; // golden angle increment

    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;

    points.push(new Vector3(x, y, z));
  }
  return points;
}

/**
 * gets a number of samplepoints in a hemi-sphere
 * @param {*} endsample the number of samplepoints to calculate
 */

export default function getHemisphereSamplepoints(samples) {
  // adapted using prev. method from https://stackoverflow.com/questions/34313200/distribute-points-evenly-on-a-unit-hemisphere
  const points = getSphereSamplepoints(2 * samples, samples);

  for (const p of points) {
    p.negate();

    // just to be sure...
    if (p.y < 0) console.error("hemisphere sample point not in hemisphere");
  }

  return points;
}

/**
 * Rotates a cloud of samplepoints to center around a given vector
 * @param {*} points
 * @param {*} midVector
 * @returns
 */
export function rotateSamplepoints(points, midVector) {
  const defaultOrientation = new Vector3(0, 1, 0);

  const rotationVector = getPlaneNormal(defaultOrientation, midVector);
  const rotationAngle = defaultOrientation.angleTo(midVector);

  return points.map((point) =>
    point.clone().applyAxisAngle(rotationVector, rotationAngle)
  );
}
