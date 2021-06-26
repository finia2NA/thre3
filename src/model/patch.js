import { Vector3 } from "three";

export default class Patch {
  position3D;
  normal3D;
  positionTX;

  displayEnergy; // unit:energy/m2
  reflectance;

  areaFactor;
  nice;

  unshotRadiosity = new Vector3(0, 0, 0);

  constructor(
    position3D,
    normal3D,
    positionTX,
    baseIlluminance,
    reflectance,
    areaFactor,
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

    this.displayEnergy = baseIlluminance.multiplyScalar(
      luminanceFactor * areaFactor
    );
    this.unshotRadiosity = baseIlluminance.multiplyScalar(
      luminanceFactor * areaFactor
    );

    this.reflectance = reflectance;

    this.areaFactor = areaFactor;
    this.nice = nice;
  }

  /**
   *
   * @param {Patch} b
   * @returns
   */
  turnFactor(b) {
    // eigentlich hier noch / produkt der vektorlängen, aber ich gehe ja davon aus, dass die beiden normalen ~1 lang sind.
    // https://onlinemschool.com/math/library/vector/angl/#:~:text=Definition.&text=The%20cosine%20of%20the%20angle,the%20product%20of%20vector%20magnitude.

    return Math.max(this.normal3D.dot(b.normal3D.clone().negate()), 0);
  }

  distanceFactor(b, attenuationMethod) {
    var re;
    switch (attenuationMethod) {
      case "physical":
        re = 1 / this.position3D.clone().sub(b.position3D).length() ** 2;
        break;
      case "linear":
        re = 1 / this.position3D.clone().sub(b.position3D).length();
        break;
      case "model3":
        re = 1 / this.position3D.clone().sub(b.position3D).length() ** 0.5;
        break;
      default:
        console.error(
          "invalid or no attenuation method provided for form factor calculation"
        );
    }
    return re;
  }

  /**
   *
   * @param {Vector3} energy
   */
  illuminate(energy) {
    const addVector = energy.clone().multiply(this.reflectance);

    debugger;
    console.log(addVector);

    this.displayEnergy.add(addVector);
    this.unshotRadiosity.add(addVector);
  }

  resetCollectedLight() {
    this.collectedLight = [0, 0, 0];
  }
}
