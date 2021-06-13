export default class SymStore {
  dimensions;
  array;

  constructor(dimensions) {
    this.dimensions = dimensions;

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
    re = re[0] < re[1] ? [re[0], re[1]] : [re[1], re[0]]; // sort the array so that the smaller element is in front

    re[1] = re[1] - re[0];

    if (Math.min(...re) < 0)
      console.error(
        "something went wrong when calculating Sym indices, resulted in" + re
      );
    return re;
  }

  get(a, b) {
    const indices = this.getIndices(a, b);
    return this.array[indices[0]][indices[1]];
  }

  set(a, b, value) {
    const indices = this.getIndices(a, b);
    this.array[indices[0]][indices[1]] = value;
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
