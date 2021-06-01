class Sym:

  def __init__(self, sqareDim):
    self.array = [[0 for _ in range(i)] for i in map(
        lambda x:sqareDim-x, range(sqareDim))]

  def __getIndices__(self, a, b):
    return sorted([a, b])

  def get(self, a, b):
    indices = self.__getIndices__(a, b)

    return self.array[indices[0]][indices[1]]

  def set(self, a, b, value):
    indices = self.__getIndices__(a, b)

    akali = self.array[indices[0]]
    self.array[indices[0]][indices[1]] = value


if __name__ == "__main__":
  testSym = Sym(5)
  print(testSym.array)

  testSym.set(0, 4, "hello!")

  print(testSym.get(4, 0))
  print(testSym.get(0, 4))
