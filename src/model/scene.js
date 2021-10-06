import { densityTexture } from "components/3D/textures";
import { pointToDiscrete } from "rasterizer/helpers";
import getHemisphereSamplepoints, {
  rotateSamplepoints,
} from "formFactors/hemiSample";
import { SmallStore } from "model/ffStore";
import { Vector3 } from "three";

// after maxIterations, the simulation will stop, even if the threshold is not reached.
const maxIterations = 500000;
const threshP = 0.01;
const defaultNumSamples = 1000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export default class SceneRepresentation {
  objects;
  formFactors;
  rayCaster;

  constructor() {
    this.objects = [];
    this.formFactors = null;
    this.rayCaster = null;
    console.log("scene ready");
  }

  addObject(o) {
    this.objects.push(o);
  }

  getObjects() {
    return this.objects;
  }

  test = () => {
    console.time("rays");
    for (var i = 0; i < 10000; i++) {
      this.raycast(new Vector3(0, 0, 0), new Vector3(1, 0, 0));
    }
    console.timeEnd("rays");
  };

  /**
   *
   * @param {Raycaster} rc
   */
  setRC = (rc) => {
    rc.near = 0.0005;
    console.log("rc.near = " + rc.near);
    this.rayCaster = rc;
  };

  setScene3 = (scene3) => {
    this.scene3 = scene3;
  };

  mapsLoaded() {
    return this.objects.reduce((x, y) => x && y);
  }

  async computePatches(txResOverwrite) {
    performance.mark("patches start");
    while (!this.mapsLoaded()) {
      await sleep(100);
    }

    for (var i = 0; i < this.objects.length; i++) {
      const o = this.objects[i];
      o.computePatches(txResOverwrite);
    }

    performance.mark("patches end");
    performance.measure("patches", "patches start", "patches end");
    console.log("patches: done");
  }

  async computeFormFactors2(xRes, yRes, numSamples = defaultNumSamples) {
    this.computePatches([xRes, yRes]);
    console.log("starting ffs");
    performance.mark("ffs start");

    // patches sind DA
    // this.formFactors = new BasicStore([this.objects.length, xRes, yRes]);
    this.formFactors = new SmallStore([this.objects.length, xRes, yRes], 1);

    const samplePoints = getHemisphereSamplepoints(numSamples);

    // go through every representation of a patch pair
    for (var objIndex = 0; objIndex < this.objects.length; objIndex++) {
      for (var x = 0; x < this.objects[objIndex].patches.length; x++) {
        for (var y = 0; y < this.objects[objIndex].patches[x].length; y++) {
          if (!this.objects[objIndex].patches[x][y]) continue;

          const origin = this.objects[objIndex].patches[x][y].position3;
          const normal = this.objects[objIndex].patches[x][y].normal3;

          const currentSamplePoints = rotateSamplepoints(samplePoints, normal);

          const rtResults = currentSamplePoints.map((dir) =>
            this.raycast(origin, dir)
          );

          for (const res of rtResults) {
            if (!res) continue;

            const illuminatedObject = parseInt(res.object.name, 10);
            const texel = pointToDiscrete(res.uv, xRes, yRes);

            const a = [objIndex, x, y];
            const b = [illuminatedObject, texel[0], texel[1]];

            this.formFactors.add(a, b, 1 / numSamples);
          }
        }
      }
    }
    performance.mark("ffs end");
    performance.measure("ffs", "ffs start", "ffs end");
    console.log("form factors done");
  }

  async computeRadiosity(
    xRes,
    yRes,
    numSamples,
    stopValue = threshP,
    downloadTexture = false,
    totalEnergyApproach = true
  ) {
    await this.computeFormFactors2(xRes, yRes, numSamples);
    performance.mark("radiosity start");

    var threshold;
    // get abort threshold as % of max disply energy
    if (!totalEnergyApproach)
      threshold =
        stopValue *
        Math.max(
          ...this.objects.map((o) =>
            o.getMaxUnshotPatch().unshotEnergy.length()
          )
        );
    else
      threshold =
        stopValue *
        this.objects
          .reduce(
            (pre, curr) => pre.add(curr.getSumUnshotEnergies()),
            new Vector3(0, 0, 0)
          )
          .length();

    var i_counter = 0;
    var p_counter = 0;

    if (threshold) {
      console.log("threshold: " + threshold);
      while (i_counter < maxIterations) {
        // while (true) {

        // get patch with max unshot rad
        const objectsMaxPatch = this.objects.map((o) => o.getMaxUnshotPatch());
        var currentShooter = objectsMaxPatch[0];
        var shooterObjectIndex = 0;
        for (var p = 1; p < objectsMaxPatch.length; p++) {
          if (
            objectsMaxPatch[p].unshotEnergy.length() >
            currentShooter.unshotEnergy.length()
          ) {
            currentShooter = objectsMaxPatch[p];
            shooterObjectIndex = p;
          }
        }

        const energy = currentShooter.unshotEnergy;

        if (!totalEnergyApproach && energy.length() < threshold) {
          console.log("stopped radiating because of individual threshold");
          console.log("the unshot energy was: " + energy.length());
          break;
        }
        if (
          totalEnergyApproach &&
          this.objects
            .reduce(
              (pre, curr) => pre.add(curr.getSumUnshotEnergies()),
              new Vector3(0, 0, 0)
            )
            .length() < threshold
        ) {
          console.log("stopped radiating because of total energy threshold");
          console.log(
            "the unshot energy was: " +
              this.objects
                .reduce(
                  (pre, curr) => pre.add(curr.getSumUnshotEnergies()),
                  new Vector3(0, 0, 0)
                )
                .length()
          );
          break;
        }

        currentShooter.unshotEnergy = new Vector3(0, 0, 0);

        for (var i = 0; i < this.objects.length; i++) {
          for (var j = 0; j < this.objects[i].patches.length; j++) {
            for (var k = 0; k < this.objects[i].patches[j].length; k++) {
              const a = [
                shooterObjectIndex,
                currentShooter.backwriteTX[0],
                currentShooter.backwriteTX[1],
              ];
              const b = [i, j, k];

              const ff = this.formFactors.get(a, b);

              if (ff > 0) {
                p_counter++;

                const lightReaching = energy.clone().multiplyScalar(ff);

                if (!this.objects[i].patches[j][k]) continue;

                this.objects[i].patches[j][k].illuminate(lightReaching);
              }
            }
          }
        }
        i_counter++;
      }
    }

    if (i_counter < maxIterations) {
      console.log(
        "Made " +
          i_counter +
          " iterations before stopping for the threshold of <" +
          threshold +
          " energy.\n"
      );
    } else {
      console.log(
        "stopped because iterations reached set limit of" + maxIterations
      );
    }
    console.log("During this, patches were updated " + p_counter + " times.");

    performance.mark("radiosity end");
    performance.measure("radiosity", "radiosity start", "radiosity end");
    performance.mark("tx start");
    // generate textures:
    // first, find out what value maps to 255:

    var maxDensity = 0;

    for (const o of this.objects) {
      for (const p of o.getPatches1D()) {
        for (const selector of [(a) => a.x, (a) => a.y, (a) => a.z]) {
          if (selector(p.getEnergyDensity()) > maxDensity) {
            maxDensity = selector(p.getEnergyDensity());
          }
        }
      }
    }
    console.log("maximum energy density is " + maxDensity);

    // Then, generate the final textures.
    for (const o of this.objects) {
      o.radMap = densityTexture(
        o.patches,
        xRes,
        yRes,
        o.flipY,
        maxDensity,
        downloadTexture
      );
    }
    performance.mark("tx end");
    performance.measure("tx", "tx start", "tx end");
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
   * Returns the coordinates of the first point hit when raycasting from origin to direction
   * in the scene.
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
