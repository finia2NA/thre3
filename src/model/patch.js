import { checkNormalized } from "controller/rasterizer/helpers";
import { Vector3 } from "three";

export default class Patch {
  position3; // The 3d point which represents the patch
  normal3; // The normal of the patch
  backwriteTX; // which texture coordinate the patch needs to be written back to

  energyDensity; // The total energy of this patch, in unit W/m² for each of the 3 channels
  unshotDensity = new Vector3(0, 0, 0); // The unshot energy of this patch, in unit W/m² for each of the 3 channels
  reflectance; // The reflectance of the patch for each of the 3 channels

  area2; // The area the patch takes up in texel space // TODO: sollte das % of texelarea oder total sein?
  area3; // The area the patch takes up in 3D space

  constructor(
    position2,
    position3,
    normal3,
    backwriteTX,
    baseIlluminance,
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

    this.energyDensity = baseIlluminance.multiplyScalar(luminanceFactor);
    this.unshotDensity = baseIlluminance.multiplyScalar(luminanceFactor);

    this.reflectance = reflectance;

    this.areaFactor = area2;
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
    // https://onlinemschool.com/math/library/vector/angl/#:~:text=Definition.&text=The%20cosine%20of%20the%20angle,the%20product%20of%20vector%20magnitude.
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

  /**
   *
   * @param {Vector3} energy
   */
  illuminate(energy) {
    const addVector = energy.clone().multiply(this.reflectance);

    debugger;
    console.log(addVector);

    this.energyDensity.add(addVector);
    this.unshotDensity.add(addVector);
  }

  resetCollectedLight() {
    this.collectedLight = [0, 0, 0];
  }
}
