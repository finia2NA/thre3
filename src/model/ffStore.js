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

  encode(a) {
    var re = 0;

    for (var i = 0; i < a.length - 1; i++) {
      re += a[i];
      re *= this.dimensions[i + 1];
    }

    re += a[a.length - 1];

    return re;
  }

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

export class BasicStore extends FFStore {
  constructor(dimensions, mode) {
    super(dimensions, mode);

    const maxIndex = dimensions.reduce((x, y) => x * y);

    this.array = [];

    for (var col = 0; col < maxIndex; col++)
      this.array.push(new Array(maxIndex).fill(0));
  }

  set(a, b, value) {
    const aIndex = this.encode(a);
    const bIndex = this.encode(b);

    this.array[aIndex][bIndex] = value;
  }

  get(a, b) {
    const aIndex = this.encode(a);
    const bIndex = this.encode(b);

    return this.array[aIndex][bIndex];
  }

  add(a, b, value) {
    const aIndex = this.encode(a);
    const bIndex = this.encode(b);

    this.array[aIndex][bIndex] += value;
  }
}

export class SmallStore extends FFStore {
  maxVal;
  initializer;
  bits;

  constructor(dimensions, mode, precisionLevel = 1) {
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

    const maxIndex = dimensions.reduce((x, y) => x * y);

    console.log("array size:" + (maxIndex * maxIndex * this.bits) / 8);

    this.array = [];

    for (var col = 0; col < maxIndex; col++)
      this.array.push(this.initializer(maxIndex));
  }

  set(a, b, value) {
    const aIndex = this.encode(a);
    const bIndex = this.encode(b);
    this.array[aIndex][bIndex] = value * this.maxVal;
  }

  get(a, b) {
    const aIndex = this.encode(a);
    const bIndex = this.encode(b);

    return this.array[aIndex][bIndex] / this.maxVal;
  }

  add(a, b, value) {
    const aIndex = this.encode(a);
    const bIndex = this.encode(b);

    this.array[aIndex][bIndex] += value * this.maxVal;
  }
}

export default class SymStore extends FFStore {
  dimensions;
  array;
  mode = "vanilla";
  maxValue = 0;

  constructor(dimensions, mode) {
    super(dimensions, mode);

    const maxIndex = dimensions.reduce((x, y) => x * y);

    for (var i = 0; i < maxIndex; i++) {
      const row = new Array(maxIndex - i).fill(0);
      this.array.push(row);
    }
  }

  getIndices(a, b) {
    var re = [this.encode(a), this.encode(b)].sort();
    // sort the array so that the smaller element is in front
    re = re[0] < re[1] ? [re[0], re[1]] : [re[1], re[0]];

    re[1] = re[1] - re[0];

    if (Math.min(...re) < 0)
      console.error(
        "something went wrong when calculating Sym indices, resulted in" + re
      );
    return re;
  }

  get(a, b) {
    const indices = this.getIndices(a, b);
    const value = this.array[indices[0]][indices[1]];

    switch (this.mode) {
      case "vanilla":
        return value;
        break;

      case "scaled":
        if (this.maxValue < 0.99) return value;
        else return (value / this.maxValue) * 0.99;
      default:
        console.error("invalid value retrieval mode in symStore");
        break;
    }

    if (this.maxValue < 0.99) return value;
    else return (value / this.maxValue) * 0.99;
  }

  set(a, b, value) {
    const indices = this.getIndices(a, b);
    this.array[indices[0]][indices[1]] = value;

    if (this.maxValue < value) this.maxValue = value;
  }

  /**
   * @returns 1 representational coordinate of every symetrical pair that can be stored in the SymStore
   */
  getRelevantCoordinates() {
    const re = [];
    for (var i = 0; i < this.array.length; i++) {
      for (var j = 0; j < this.array[i].length; j++) {
        re.push([this.decode(i), this.decode(j + i)]);
      }
    }
    return re;
  }
}
