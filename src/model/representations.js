import { request } from "util/network.js";
import { defaultTexture } from "model/textures";
import generatePatches from "controller/rasterizer/rasterizer";
import { Raycaster } from "three";

const OBJFile = require("obj-file-parser");

export class ObjectRepresentation {
  // TODO:scopes
  meshPath;
  luminancePath;
  reflectancePath;
  translate;
  objText;
  patchRes;
  patchFlag;
  patches;

  constructor(meshPath, luminancePath, reflectancePath) {
    // const text = await request(meshPath);
    // this.parsedMesh = new OBJFile(text).parse();

    this.meshPath = meshPath;
    this.luminancePath = luminancePath;
    this.reflectancePath = reflectancePath;
    this.translate = [0, 0, 0];
    this.objText = null;
    this.patchRes = [16, 16]; //TODO: change
    this.patchFlag = false;
    this.patches = null;
  }

  async loadObjText() {
    this.objText = await request(this.meshPath);
  }

  async getPatches(xRes, yRes) {
    if (this.patchRes === null || null in this.patchRes) {
      console.error("no resolution for patches given");
    }

    if (!this.patchFlag) {
      if (!this.objText) await this.loadObjText();

      this.patches = generatePatches(
        this.objText,
        this.patchRes[0],
        this.patchRes[1],
        this.luminancePath,
        this.reflectancePath
      );
      this.patchFlag = true;
    }

    return this.patches; // TODO:translate
  }
}

export class SceneRepresentation {
  // objects;
  // formFactors;
  // rayCaster;

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

  radiate(xRes, yRes) {}

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
