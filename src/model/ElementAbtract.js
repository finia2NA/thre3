/**
 * Base class for 3D Objects. Stores channel box info and provides a method to get patches.
 */

const { checkerboardTexture, rainbowTexture } = require("./Textures");

// TODO: support scale and rotation. This is not trivial when allowing object groups!
class EntityAbstract {
  constructor(position = [0, 0, 0]) {
    this.position = position;
    this.scale = [1, 1, 1];
    this.rotation = [0, 0, 0];
    this.name = "EntityAbstract";
  }

  get_patches(resolution = [64, 64]) {
    console.error("this is an abstract class that should never be called :/");
  }
}

/**
 * The abstract superclass for objects that have a mesh and can be textured
 */
class TangibleAbstract extends EntityAbstract {
  constructor(position = [0, 0, 0]) {
    super(position);

    this.texture = checkerboardTexture(16, 16); // default texture
    this.mesh = undefined;
    this.name = "TangibleAbstract";
  }
}

/**
 * Represents a cube, already UV-mapped
 */
export class CubeAbstract extends TangibleAbstract {
  constructor(position = [0, 0, 0]) {
    super(position);
    this.name = "CubeAbstract";
  }
}
// TODO:
export class TestBoxAbstract extends TangibleAbstract {
  constructor(position = [0, 0, 0]) {
    super(position);
    this.name = "TestBoxAbstract";
  }
} // TODO:

export class PlaneAbstract extends TangibleAbstract {} // TODO:

/**
 * Represents a Teapot, already UV-mapped
 */
export class TeapotAbstract extends TangibleAbstract {
  constructor(...args) {
    super(...args);
    this.mesh = "assets/teapot.js";
    this.texture = rainbowTexture(16, 16); // TODO: this aint sposed to be static ya know
    this.name = "TeapotAbstract";
  }
}
