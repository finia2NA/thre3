import { request } from "util/network.js";
import { defaultTexture } from "model/Textures";
import generatePatches from "controller/rasterizer";

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

  getPatches(params) {
    // TODO: caching
    const structure = this.parsedMesh.models[0];
    const faces = this.parsedMesh.models[0].faces;
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

  setRC(rc) {
    this.rayCaster = rc;
  }

  raycast() {
    // https://threejs.org/docs/#api/en/core/Raycaster
  }
}
