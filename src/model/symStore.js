export default class Sym {
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

  getIndex(a) {
    var re = 0;

    for (var i = 0; i < a.length - 1; i++) {
      re += a[i];
      re *= this.dimensions[i + 1];
    }

    re += a[a.length - 1];

    return re;
  }

  getIndices(a, b) {
    const s = [a, b].sort();
    const re = [this.getIndex(s[0]), this.getIndex(s[1])];
    re[1] = re[1] - re[0];
    return re;
  }

  get(a, b) {
    const indices = this.getIndices(a, b);
    return self.array[(indices[0], indices[1])];
  }

  set(a, b, value) {
    const indices = this.getIndices(a, b);
    self.array[(indices[0], indices[1])] = value;
  }
}
