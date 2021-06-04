import { request } from "util/network.js";
import { defaultTexture } from "model/textures";
import generatePatches from "controller/rasterizer/rasterizer";

export default class ObjectRepresentation {
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
