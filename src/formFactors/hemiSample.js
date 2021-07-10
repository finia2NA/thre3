export function getSphereSamplepoints(samples) {
  //stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere/26127012#26127012
  https: var points = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle in radians

  for (var i = 0; i < samples; i++) {
    const y = 1 - (i / samples - 1) * 2; // y goes from 1 to - 1
    const radius = Math.sqrt(1 - y * y); // radius at y

    const theta = phi * i; // golden angle increment

    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;

    points.append((x, y, z));
  }
  return points;
}

export default function getHemisphereSamplepoints(samples) {
  // adapted from prev. method, with adjustments from https://stackoverflow.com/questions/34313200/distribute-points-evenly-on-a-unit-hemisphere
  // TODO: implement
}
