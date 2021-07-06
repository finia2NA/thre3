// The old core of the generatePatches function, which did not yet use fragments.
const samplePoint = discreteToMidpoint(texel, xRes, yRes);
var sampleDistance = 0;

var bayecentrics = getBayecentrics(samplePoint, face);

if (Math.min(...bayecentrics) < 0) {
  const closestRes = getClosestInside(samplePoint, face);
  bayecentrics[closestRes.startIndex] = closestRes.bay1;
  bayecentrics[(closestRes.startIndex + 1) % 3] = 1 - closestRes.bay1;
  bayecentrics[(closestRes.startIndex + 2) % 3] = 0;

  // # the sample distance will be used as NICE
  sampleDistance = closestRes.distance;

  // samplePoint = closestRes.pos
}

const position = linearCombination(
  bayecentrics,
  face.map((x) => x.vertexCoord)
);
const normal = linearCombination(
  bayecentrics,
  face.map((x) => x.vertexNormal)
).normalize();
const selfIlluminance = luminanceMap
  .sample(samplePoint.x, samplePoint.y)
  .multiplyScalar(luminanceFactor);
const reflectance = reflectanceMap
  .sample(samplePoint.x, samplePoint.y)
  .divideScalar(255.0); // mapped to 0...1
const nice = sampleDistance;

const patch = new Patch(
  position,
  normal,
  texel,
  selfIlluminance,
  reflectance,
  1, // ratio, //TODO: fix
  1,
  1,
  nice
);

// TODO: find out why things were going above x,yres and fix that, instead of this bandaid which probably masks some deeper error
// debugger;
if (texel[0] < xRes && texel[1] < yRes) {
  // if there's not yet a patch for this position
  // or the patch there has a higher nice than this one
  if (
    !patches[texel[0]][texel[1]] ||
    patches[texel[0]][texel[1]].nice > patch.nice
  ) {
    // write this patch as the representative of that texel.
    patches[texel[0]][texel[1]] = patch;
  }
}
