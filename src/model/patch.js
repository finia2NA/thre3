export default class Patch {
  position3D;
  normal3D;
  positionTX;
  selfIlluminance;
  reflectance;
  areaRatio;
  luminanceFactor;
  nice;
  collectedLight = [1.0, 1.0, 1.0]; // TODO: change to 0,0,0

  constructor(
    position3D,
    normal3D,
    positionTX,
    selfIlluminance,
    reflectance,
    areaRatio,
    luminanceFactor,
    nice
  ) {
    if (Math.abs(normal3D.length() - 1) > 0.005) {
      console.error("Given normal3D was not normalized!");
    }

    this.position3D = position3D;
    this.normal3D = normal3D;
    this.positionTX = positionTX;
    this.selfIlluminance = selfIlluminance;
    this.reflectance = reflectance;
    this.areaRatio = areaRatio;
    this.luminanceFactor = luminanceFactor;
    this.nice = nice;
  }

  /**
   *
   * @param {Patch} b
   * @returns
   */
  turnFactor(b) {
    return this.normal3D.dot(b.normal3D); // eigentlich hier noch / produkt der vektorlängen, aber ich gehe ja davon aus, dass die beiden vektoren so ~1 lang sind.
  }

  distanceFactor(b) {
    return this.position3D.clone().sub(b.position3D).length();
  }

  illuminate(value) {
    this.collectedLight += value;
  }

  resetCollectedLight() {
    this.collectedLight = [0, 0, 0];
  }
}
