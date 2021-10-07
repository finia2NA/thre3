class FFStore {
  constructor(dimensions, mode) {
    this.dimensions = dimensions;
    if (mode) this.mode = mode;

    this.array = [];
  }

  get(a, b) {
    console.error("this is an abstract class, pls instantiate a child");
  }

  set(a, b, value) {
    console.error("this is an abstract class, pls instantiate a child");
  }

  /**
   * encodes a patch of an object into a 1D position on the array
   */
  encode(a) {
    var re = 0;

    for (var i = 0; i < a.length - 1; i++) {
      re += a[i];
      re *= this.dimensions[i + 1];
    }

    re += a[a.length - 1];

    return re;
  }

  /**
   * determines which object and patch a 1D position is referring to
   */
  decode(a) {
    const re = [];
    var next = a;
    const factors = [...this.dimensions].slice({ start: 1 });
    factors.push(1);

    for (var i = 0; i < this.dimensions.length; i++) {
      var divisor = factors.slice(i + 1).reduce((x, y) => x * y);
      re.push(Math.floor(next / divisor));
      next = next % divisor;
    }

    return re;
  }
}

/**
 * A basic form factor store that uses a parameterized amount of bits per form factor
 */
export class SmallStore extends FFStore {
  maxVal;
  initializer;
  bits;

  constructor(dimensions, precisionLevel = 1, mode) {
    super(dimensions, mode);

    // initialize values for bit sizes
    if (precisionLevel === 0) {
      this.bits = 8;
      this.initializer = (maxIndex) => new Uint8Array(maxIndex);
    }
    if (precisionLevel === 1) {
      this.bits = 16;
      this.initializer = (maxIndex) => new Uint16Array(maxIndex);
    }
    if (precisionLevel === 2) {
      this.bits = 32;
      this.initializer = (maxIndex) => new Uint32Array(maxIndex);
    }
    this.maxVal = Math.pow(2, this.bits) - 1;

    // determine array size and initialize
    const maxIndex = dimensions.reduce((x, y) => x * y);
    console.log("array size:" + (maxIndex * maxIndex * this.bits) / 8);

    this.array = [];
    for (var col = 0; col < maxIndex; col++)
      this.array.push(this.initializer(maxIndex));
  }

  /**
   * set a given form factor
   * @param {*} a from patch a
   * @param {*} b to patch b
   * @param {*} value to this value
   */
  set(a, b, value) {
    const aIndex = this.encode(a);
    const bIndex = this.encode(b);
    this.array[aIndex][bIndex] = value * this.maxVal;
  }

  /**
   * get a form factor
   * @param {*} a from patch a
   * @param {*} b to patch b
   * @returns
   */
  get(a, b) {
    const aIndex = this.encode(a);
    const bIndex = this.encode(b);

    return this.array[aIndex][bIndex] / this.maxVal;
  }

  /**
   * Increase a form factor
   * @param {*} a from patch a
   * @param {*} b to patch b
   * @param {*} value by this value
   */
  add(a, b, value) {
    const aIndex = this.encode(a);
    const bIndex = this.encode(b);

    this.array[aIndex][bIndex] += value * this.maxVal;
  }
}
