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

  getObjects() {
    return this.objects;
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

  async calculatePatches(xRes, yRes) {
    this.txRes = [xRes, yRes];

    for (const o of this.objects) {
      o.calculatePatches();
    }
  }

  async calculateFormFactors(xRes, yRes) {
    this.calculatePatches(xRes, yRes);

    //patches sind DA
    this.formFactors = new SymStore([this.objects.length, xRes, yRes]);

    // go through every representation of a patch pair
    const relevantCoords = this.formFactors.getRelevantCoordinates();
    for (const coords of relevantCoords) {
      // and fill the formfactor DS with the corresponding FF.
      const patch1 =
        this.objects[coords[0][0]].patches[coords[0][1]][coords[0][2]];
      const patch2 =
        this.objects[coords[1][0]].patches[coords[1][1]][coords[1][2]];

      this.formFactors.set(
        coords[0],
        coords[1],
        this.formFactor(patch1, patch2)
      );
    }
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
   * returns whether there is an unobstructed path from a to b in the scene.
   * @param {Vector3} a
   * @param {Vector3} b
   */
  unobstructed(a, b) {
    const vector = b.clone().sub(a);
    console.log("hi");
    const direction = vector.divideScalar(vector.length); // normalized direction. I don't actually know if it _needs_ to be normalized per se, but better safe than sorry for now
    debugger;
    const result = this.raycast(vector, direction);

    return b.distanceTo(result) < 0.005; // TODO: tune. this isnt just a b===result bc there may be some numberical shenanigans. Maybe there's a better way to do this???
  }

  /**
   * Returns the coordinates of the first point hit when raycasting from origin to direction in the scene.
   * @param {Vector3} origin
   * @param {Vector3} direction
   */
  raycast = (origin, direction) => {
    // https://threejs.org/docs/#api/en/core/Raycaster
    this.rayCaster.set(origin, direction);
    return this.rayCaster.intersectObject(this.scene3, true)[0];
  };
}
