import { checkNormalized } from "rasterizer/helpers";
import { Vector3 } from "three";

export default class Patch {
  position2; // The 2d point which represents the patch
  position3; // The 3d point which represents the patch
  normal3; // The normal of the patch
  backwriteTX; // which texture coordinate the patch needs to be written back to

  totalEnergy; // The total energy of this patch, in unit W/m² for each of the 3 channels
  unshotEnergy = new Vector3(0, 0, 0); // The unshot energy of this patch, in unit W/m² for each of the 3 channels
  reflectance; // The reflectance of the patch for each of the 3 channels

  area2; // The area the patch takes up in texel space
  area3; // The area the patch takes up in 3D space

  constructor(
    position2,
    position3,
    normal3,
    backwriteTX,
    energyDensity,
    reflectance,
    area2,
    area3
  ) {
    if (!checkNormalized(normal3)) {
      console.error(
        "Given normal3D was not normalized! Was: " +
          Math.abs(normal3.length() - 1)
      );
    }
    this.position2 = position2;
    this.position3 = position3;
    this.normal3 = normal3;
    this.backwriteTX = backwriteTX;

    this.totalEnergy = energyDensity.clone().multiplyScalar(area3);
    this.unshotEnergy = this.totalEnergy.clone();

    this.reflectance = reflectance;

    this.area2 = area2;
    this.area3 = area3;
  }

  /**
   *
   * @param {Patch} b
   * @returns
   */
  turnFactor(b) {
    // All according to schema in 6/7/21 notability note
    const atob = b.position3.clone().sub(this.position3).normalize();

    if (!checkNormalized(atob))
      console.error("so called normalized vector was in fact not normalized");

    // eigentlich hier noch / produkt der vektorlängen,
    // aber ich gehe ja davon aus, dass die beiden normalen ~1 lang sind.
    // https://bit.ly/3dOdITA
    const alpha = Math.max(this.normal3.dot(atob), 0);
    const beta = Math.max(b.normal3.dot(atob.clone().negate()), 0);

    return alpha * beta;
  }

  distanceFactor(b, attenuationMethod) {
    var re;
    switch (attenuationMethod) {
      case "physical":
        re = 1 / this.position3.clone().sub(b.position3).length() ** 2;
        break;
      case "linear":
        re = 1 / this.position3.clone().sub(b.position3).length();
        break;
      case "model3":
        re = 1 / this.position3.clone().sub(b.position3).length() ** 0.5;
        break;
      default:
        console.error(
          "invalid or no attenuation method provided for form factor calculation"
        );
    }
    return re;
  }

  getEnergyDensity() {
    return this.totalEnergy.clone().divideScalar(this.area3);
  }

  /**
   *
   * @param {Vector3} energy
   */
  illuminate(energy) {
    const addVector = energy.clone().multiply(this.reflectance);

    this.totalEnergy.add(addVector);
    this.unshotEnergy.add(addVector);
  }
}
