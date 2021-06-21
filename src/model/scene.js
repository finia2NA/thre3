import { patchTexture, defaultTexture } from "components/3D/textures";
import SymStore from "model/symStore";
import { Vector3 } from "three";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
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
    rc.near = 0.0005;
    console.log("rc.near = " + rc.near);
    this.rayCaster = rc;
  };

  setScene3 = (scene3) => {
    this.scene3 = scene3;
  };

  setTextureRes(x, y) {
    this.txRes = [x, y];
  }

  mapsLoaded() {
    return this.objects.reduce((x, y) => x && y);
  }

  async calculatePatches(xRes, yRes) {
    this.txRes = [xRes, yRes];

    while (!this.mapsLoaded()) {
      // TODO: improve
      await sleep(100);
    }

    for (const o of this.objects) {
      o.calculatePatches();
    }

    console.log("patches: done");
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

      if (!patch1 || !patch2) {
        // alert("The thing you suspected could happen happened");
        continue; // if there are no patches in the texture there (which is very possible), we obviously can't calculate a form factor
      }

      const currentformFactor = this.formFactor(patch1, patch2);
      if (currentformFactor > 0) {
        this.formFactors.set(coords[0], coords[1], currentformFactor);
      }
    }
    console.log("form factors: done");
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
    if (a === b || !this.unobstructed(a.position3D, b.position3D)) {
      return 0;
    } else {
      // else the form factor consists of distance and turn factors
      const d = a.distanceFactor(b);
      const t = a.turnFactor(b);

      // if (d * t > 1)
      //   debugger;

      return d * t;
    }
  }

  async radiate() {
    await this.calculateFormFactors(16, 16); //TODO: res

    // get abort threshold as % of max dispaly energy
    const threshold =
      0.01 *
      Math.max(
        ...this.objects.map((o) =>
          o.getMaxUnshotPatch().unshotRadiosity.length()
        )
      );

    var i_counter = 0;
    var p_counter = 0;

    while (i_counter === 0) {
      // TODO: remove
      const objectsMaxPatch = this.objects.map((o) => o.getMaxUnshotPatch());

      var currentShooter = objectsMaxPatch[0];
      var shooterObjectIndex = 0;
      for (var p = 1; p < objectsMaxPatch.length; p++) {
        if (
          objectsMaxPatch[p].unshotRadiosity.length() >
          currentShooter.unshotRadiosity.length()
        ) {
          currentShooter = objectsMaxPatch[p];
          shooterObjectIndex = p;
        }
      }

      const energy = currentShooter.unshotRadiosity;

      console.log(energy);

      if (energy.length() < threshold) {
        break;
      }

      currentShooter.unshotRadiosity = new Vector3(0, 0, 0);

      for (var i = 0; i < this.objects.length; i++) {
        for (var j = 0; j < this.objects[i].patches.length; j++) {
          for (var k = 0; k < this.objects[i].patches[j].length; k++) {
            const a = [
              shooterObjectIndex,
              currentShooter.positionTX[0],
              currentShooter.positionTX[1],
            ];
            const b = [i, j, k];

            const ff = this.formFactors.get(a, b);

            if (ff > 0) {
              p_counter++;

              const lightReaching = energy
                .clone()
                .multiplyScalar(this.formFactors.get(a, b));

              if (lightReaching.length() > energy.length()) {
                lightReaching.divideScalar(
                  1.5 * (lightReaching.length() / energy.length())
                );
              }

              this.objects[i].patches[j][k].illuminate(lightReaching);
            }
          }
        }
      }
      i_counter++;
    }

    console.log(
      "Made " +
        i_counter +
        " iterations before stopping for the threshold of <" +
        threshold +
        " energy.\n During this, patches were updated " +
        p_counter +
        " times."
    );

    // debugger;

    for (const o of this.objects) {
      o.radMap = patchTexture(o.patches, o.patchRes[0], o.patchRes[1]);
    }
  }

  /**
   * returns whether there is an unobstructed path from a to b in the scene.
   * @param {Vector3} a
   * @param {Vector3} b
   */
  unobstructed(a, b) {
    const targetDistance = a.distanceTo(b);
    const direction = new Vector3(b.x - a.x, b.y - a.y, b.z - a.z).divideScalar(
      targetDistance
    );

    const result = this.raycast(a, direction);

    // This isnt just a target===result bc there may be some numerical shenanigans.
    if (!result || result.distance >= targetDistance - 0.005) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns the coordinates of the first point hit when raycasting from origin to direction in the scene.
   * @param {Vector3} origin
   * @param {Vector3} direction
   */
  raycast(origin, direction) {
    // https://threejs.org/docs/#api/en/core/Raycaster
    this.rayCaster.set(origin, direction);
    const intersect = this.rayCaster.intersectObject(this.scene3, true)[0];
    return intersect;
  }
}
