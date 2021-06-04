from functools import reduce


class Sym:

  def __init__(self, dimensions: list[int]):
    self.dimensions = dimensions

    maxIndex = reduce(lambda x, y: x*y, dimensions)
    print(maxIndex)
    self.array = \
        [[0 for col in range(row, maxIndex)] for row in range(maxIndex)]

  def __getIndex__(self, a):
    # 1:1 relation between index and position in hypercube.
    assert len(a) == len(self.dimensions)
    for i in range(len(a)):
      assert a[i] < self.dimensions[i]

    re = 0

    for i in range(len(a)-1):
      re += a[i]
      re *= self.dimensions[i+1]

    re = re + a[len(a)-1]
    return re

  def __getIndices__(self, a, b):
    s = sorted([a, b])
    re = [self.__getIndex__(s[0]), self.__getIndex__(s[1])]
    re[1] = re[1]-re[0]
    return re

  def get(self, a, b):
    indices = self.__getIndices__(a, b)

    return self.array[indices[0]][indices[1]]

  def set(self, a, b, value):
    indices = self.__getIndices__(a, b)

    self.array[indices[0]][indices[1]] = value

if __name__ == "__main__":

  dim = [5, 16, 16]
  a = [3, 15, 15]
  b = [4, 15, 15]

  testSym = Sym(dim)

  testSym.set(a, b, "hello!")
  print(testSym.array)

  print(testSym.get(a, b))
  print(testSym.get(b, a))
