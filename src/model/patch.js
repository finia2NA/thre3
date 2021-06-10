export default class Patch {
  position3D;
  normal3D;
  positionTX;

  selfIlluminance;
  reflectance;
  luminanceFactor;

  areaRatio;
  nice;

  collectedLight = [1.0, 1.0, 1.0]; // TODO: change to 0,0,0
  unshotRadiosity = [0.0, 0.0, 0.0];

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
      console.error(
        "Given normal3D was not normalized! Was: " +
          Math.abs(normal3D.length() - 1)
      );
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
    // eigentlich hier noch / produkt der vektorlängen, aber ich gehe ja davon aus, dass die beiden vektoren so ~1 lang sind.
    // https://onlinemschool.com/math/library/vector/angl/#:~:text=Definition.&text=The%20cosine%20of%20the%20angle,the%20product%20of%20vector%20magnitude.
    return Math.max(this.normal3D.dot(b.normal3D.clone().negate()), 0);
  }

  distanceFactor(b) {
    return 1 / this.position3D.clone().sub(b.position3D).length() ** 2;
  }

  illuminate(value) {
    this.collectedLight += value;
    this.unshotRadiosity += value;
  }

  resetCollectedLight() {
    this.collectedLight = [0, 0, 0];
  }
}
