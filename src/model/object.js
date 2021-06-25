import { request } from "util/network.js";
import generatePatches from "controller/rasterizer/rasterizer";
import MyImage from "./image";

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

  constructor(meshPath, luminancePath, reflectancePath) {
    this.meshPath = meshPath;
    this.luminancePath = luminancePath;
    this.reflectancePath = reflectancePath;
    this.translate = [0, 0, 0];
    this.objText = null;
    this.patchRes = [16, 16]; //T ODO: change
    this.patchFlag = false;
    this.patches = null;

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
        pre.unshotRadiosity.length() > nu.unshotRadiosity.length() ? pre : nu
      );

    return max1D(this.patches.map((row) => max1D(row)));
  }

  mapsLoaded() {
    return this.reflectanceMap.loaded && this.luminanceMap.loaded;
  }

  async calculatePatches() {
    if (this.patchRes === null || null in this.patchRes) {
      console.error("no resolution for patches given");
    }

    if (!this.patchFlag) {
      if (!this.objText) await this.loadObjText();

      this.patches = generatePatches(
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