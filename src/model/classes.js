import { request } from "util/network.js";
import { defaultTexture } from "model/Textures";

const OBJFile = require("obj-file-parser");

export class Object3D {
  // TODO:scopes
  meshPath;
  luminancePath;
  reflectancePath;
  translate;
  objText;

  constructor(meshPath, luminanceMap, reflectanceMap) {
    // const text = await request(meshPath);
    // this.parsedMesh = new OBJFile(text).parse();

    this.meshPath = meshPath;
    this.luminanceMap = luminanceMap;
    this.reflectanceMap = reflectanceMap;
    this.translate = [0, 0, 0];
    this.objText = null;
  }

  getPatches(params) {
    // TODO: caching
    const structure = this.parsedMesh.models[0];
    const faces = this.parsedMesh.models[0].faces;
  }

  async loadObjText() {
    this.objText = request(this.meshPath);
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

  radiate() {}

  setRC(rc) {
    this.rayCaster = rc;
  }

  raycast() {
    // https://threejs.org/docs/#api/en/core/Raycaster
  }
}
