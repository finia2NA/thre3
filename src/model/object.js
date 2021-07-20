import { request } from "util/network.js";
import MyImage from "./image";
import generateClippedPatches from "controller/rasterizer/clipper";

export default class ObjectRepresentation {
  translate;

  meshPath;
  objText;

  luminanceMap;
  luminancePath;
  luminanceFactor = 1; // TODO: make this changeable

  reflectanceMap;
  reflectancePath;

  radMap;

  patchRes;
  patchFlag;
  patches;

  flipY;

  constructor(
    meshPath,
    luminancePath,
    reflectancePath,
    xRes,
    yRes,
    flipY = false
  ) {
    this.meshPath = meshPath;
    this.luminancePath = luminancePath;
    this.reflectancePath = reflectancePath;
    this.translate = [0, 0, 0];
    this.objText = null;
    this.patchRes = [xRes, yRes];
    this.patchFlag = false;
    this.patches = [];
    this.flipY = flipY;

    this.reflectanceMap = new MyImage(reflectancePath);
    this.luminanceMap = new MyImage(luminancePath);
  }

  async loadObjText() {
    this.objText = await request(this.meshPath);
  }

  getPatches() {
    return this.patches;
  }

  getMaxUnshotPatch() {
    const max1D = (arr) =>
      arr.reduce((pre, nu) =>
        pre.unshotEnergy.length() > nu.unshotEnergy.length() ? pre : nu
      );

    return max1D(this.patches.map((row) => max1D(row)));
  }

  mapsLoaded() {
    return this.reflectanceMap.loaded && this.luminanceMap.loaded;
  }

  async calculatePatches() {
    if (!this.patchRes || Math.min(...this.patchRes) <= 0) {
      console.error("no resolution for patches given");
    }

    if (!this.patchFlag) {
      if (!this.objText) await this.loadObjText();

      this.patches = generateClippedPatches(
        this.objText,
        this.patchRes[0],
        this.patchRes[1],
        this.luminanceMap,
        this.reflectanceMap,
        this.luminanceFactor
      );
      this.patchFlag = true;
    }

    return this.patches; // TODO:translate
  }
}
