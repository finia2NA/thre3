import { request } from "util/network.js";
import MyImage from "./image";
import generateClippedPatches from "rasterizer/clipper";
import { Vector3 } from "three";

export function max1D(arr, selector = (a) => a.unshotEnergy) {
  if (!arr || arr.length === 0) return null;

  return arr.reduce((pre, nu) =>
    selector(pre).length() > selector(nu).length() ? pre : nu
  );
}

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

  constructor(meshPath, luminancePath, reflectancePath, jsonPath) {
    this.meshPath = meshPath;
    this.luminancePath = luminancePath;
    this.reflectancePath = reflectancePath;
    this.jsonPath = jsonPath;
    this.translate = [0, 0, 0];
    this.objText = null;
    // this.patchRes = [xRes, yRes];
    this.patchFlag = false;
    this.patches = [];

    this.reflectanceMap = new MyImage(reflectancePath);
    this.luminanceMap = new MyImage(luminancePath);
  }

  /**
   * load the obj text and accompanying information
   */
  async loadObjText() {
    this.objText = await request(this.meshPath);
    if (this.jsonPath) {
      const json = JSON.parse(await request(this.jsonPath));
      this.flipY = json.flipY;
      this.luminanceFactor = json.luminanceFactor;
    }
  }

  /**
   * get all the patches in a 1D array
   * @returns {Array}
   */
  getPatches1D() {
    var re = [];
    for (const row of this.patches) re = re.concat(row);

    return re.filter((x) => x !== undefined);
  }

  /**
   * get the patch with the maximum unshot energy
   * @returns {Patch}
   */
  getMaxUnshotPatch() {
    return max1D(this.getPatches1D());
  }

  /**
   * get the patch with the maximum total energy
   * @returns {Patch}
   */
  getMaxEnergyPatch() {
    return max1D(this.getPatches1D(), (a) => a.totalEnergy);
  }

  /**
   * get the total amount of unshot energy in the object
   * @returns {number}
   */
  getSumUnshotEnergies() {
    return this.patches
      .reduce((pre, row) => pre.concat(row.map((p) => p.unshotEnergy)), [])
      .reduce((pre, cur) => pre.add(cur), new Vector3(0, 0, 0));
  }

  /**
   * returns wether the maps of the objects have been loaded
   * @returns {boolean}
   */
  mapsLoaded() {
    return this.reflectanceMap.loaded && this.luminanceMap.loaded;
  }

  /**
   * compute the patches of the object
   * @param {Array} txResOverwrite an overwrite for the resolution of the patches
   */
  async computePatches(txResOverwrite) {
    const localPatchRes = txResOverwrite ? txResOverwrite : this.patchRes;

    if (!localPatchRes || Math.min(...localPatchRes) <= 0) {
      console.error("no resolution for patches given");
    }

    if (!this.patchFlag) {
      if (!this.objText) await this.loadObjText();

      this.patches = generateClippedPatches(
        this.objText,
        localPatchRes[0],
        localPatchRes[1],
        this.luminanceMap,
        this.reflectanceMap,
        this.luminanceFactor,
        this.flipY
      );
      this.patchFlag = true;
    }

    return this.patches; // TODO:if translation is to be implemented, here would be the place to do that
  }
}
