/**
 * Base class for 3D Objects. Stores channel box info and provides a method to get patches.
 */

const { checkerboardTexture } = require("./Textures");

// TODO: support scale and rotation. This is not trivial when allowing object groups!
class Entity3D {
  constructor(position = [0, 0, 0]) {
    this.position = position;
    this.scale = [1, 1, 1];
    this.rotation = [0, 0, 0];
  }

  get_patches(resolution = [64, 64]) {
    console.error("this is an abstract class that should never be called :/");
  }
}

/**
 * The abstract superclass for objects that have a mesh and can be textured
 */
class Tangible3D extends Entity3D {
  constructor(...args) {
    super(...args);

    this.texture = checkerboardTexture(16, 16); // default texture
    this.mesh = None;
  }
}

/**
 * Represents a cube, already UV-mapped
 */
class Cube3D extends Tangible3D {}

class Plane3D extends Tangible3D {}

/**
 * Represents a Teapot, already UV-mapped
 */
class Teapot3D extends Tangible3D {}
