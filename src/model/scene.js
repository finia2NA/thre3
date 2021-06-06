import { defaultTexture } from "model/textures";
import generatePatches from "controller/rasterizer/rasterizer";
import { Raycaster } from "three";
import Patch from "./patch";
import SymStore from "model/symStore";
export default class SceneRepresentation {
  objects;
  formFactors;
  rayCaster;
  txRes;

  constructor() {
    this.objects = [];
    this.formFactors = null;
    this.rayCaster = null;
  }

  addObject(o) {
    this.objects.push(o);
  }

  async calculateFormFactors(xRes, yRes) {
    this.calculatePatches(xRes, yRes);

    //patches sind DA
    this.formFactors = new SymStore([this.objects.length, xRes, yRes]);

    // go through every representation of a patch pair
    for (const coords of this.formFactors.getRelevantCoordinates) {
      // and fill the formfactor DS with the corresponding FF.
      this.formFactors.set(
        coords[0],
        coords[1],
        this.formFactor(coords[0], coords[1])
      );
    }
  }

  async calculatePatches(xRes, yRes) {
    this.txRes = [xRes, yRes];

    for (const o of this.objects) {
      o.calculatePatches();
    }
  }

  getObjects() {
    return this.objects;
  }

  // radiate(xRes, yRes) {}

  /**
   * returns whether there is an unobstructed path from a to b in the scene.
   * @param {Vector3} a
   * @param {Vector3} b
   */
  unobstructed(a, b) {
    const vector = b.clone().sub(a);
    const direction = vector.div(vector.length); // normalized direction
  }

  /**
   *
   * @param {Patch} a
   * @param {Patch} b
   */
  formFactor(a, b) {
    // if we're to calculate the factor of a patch to itself
    // or the path is obstucted
    // you know what to do :fingerguns:
    if (a === b || !this.unobstructed(a.position3D, b.position3D)) return 0;
    else {
      // else the form factor consists of distance and turn factors
      return a.distanceFactor(b) * a.turnFactor(b);
    }
  }

  /**
   *
   * @param {Raycaster} rc
   */
  setRC = (rc) => {
    // TODO: adjust near in case of self-intersect on origin
    // rc.near = 0.0001
    console.log("rc.near = " + rc.near);
    this.rayCaster = rc;
  };

  setScene3 = (scene3) => {
    this.scene3 = scene3;
  };

  setTextureRes(x, y) {
    this.txRes = [x, y];
  }

  /**
   * Returns the coordinates of the first point hit when raycasting from origin to direction in the scene.
   * @param {Vector3} origin
   * @param {Vector3} direction
   */
  raycast = (origin, direction) => {
    // https://threejs.org/docs/#api/en/core/Raycaster
    this.rayCaster.set(origin, direction);
    // debugger;
    return this.rayCaster.intersectObject(this.scene3, true)[0];
  };
}
