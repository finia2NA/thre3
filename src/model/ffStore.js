class FFStore {
  constructor(dimensions, mode) {
    console.error("this is an abstract class, pls instantiate a child");
  }

  get(a, b) {
    console.error("this is an abstract class, pls instantiate a child");
  }

  set(a, b, value) {
    console.error("this is an abstract class, pls instantiate a child");
  }
}

export default class SymStore extends FFStore {
  dimensions;
  array;
  mode = "vanilla";
  maxValue = 0;

  constructor(dimensions, mode) {
    this.dimensions = dimensions;
    if (mode) this.mode = mode;

    const maxIndex = dimensions.reduce((x, y) => x * y);
    this.array = [];

    for (var i = 0; i < maxIndex; i++) {
      const row = new Array(maxIndex - i).fill(0);
      this.array.push(row);
    }
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
