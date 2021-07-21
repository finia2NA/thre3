import { request } from "util/network.js";
import MyImage from "./image";
import generateClippedPatches from "controller/rasterizer/clipper";

export default class ObjectRepresentation {
  translate;

  meshPath;
  objText;

  luminanceMap;
  luminancePath;

  reflectanceMap;
  reflectancePath;

  radMap;

  patchRes;
  patchFlag;
  patches;

  /*
  FLIPY explanation:
  "OBJ considers (0, 0) to be the top left of a texture, OpenGL considers it to be the bottom left, so unless you've set the texture matrix stack to invert texture coordinates in code not shown, you need to invert them yourself, e.g. textureCoordinatesMesh.add(1.0 - ycoord);""
  - https://stackoverflow.com/questions/5585368/problems-using-wavefront-objs-texture-coordinates-in-android-opengl-es/5605027#5605027
 */
  jsonPath;
  luminanceFactor = 1;
  flipY;

  constructor(meshPath, luminancePath, reflectancePath, jsonPath, xRes, yRes) {
    this.meshPath = meshPath;
    this.luminancePath = luminancePath;
    this.reflectancePath = reflectancePath;
    this.jsonPath = jsonPath;
    this.translate = [0, 0, 0];
    this.objText = null;
    this.patchRes = [xRes, yRes];
    this.patchFlag = false;
    this.patches = [];

    this.reflectanceMap = new MyImage(reflectancePath);
    this.luminanceMap = new MyImage(luminancePath);
  }

  async loadObjText() {
    this.objText = await request(this.meshPath);
    if (this.jsonPath) {
      const json = JSON.parse(await request(this.jsonPath));
      this.flipY = json.flipY;
      this.luminanceFactor = json.luminanceFactor;
    }
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
        this.luminanceFactor,
        this.flipY
      );
      this.patchFlag = true;
    }

    return this.patches; // TODO:translate
  }
}
