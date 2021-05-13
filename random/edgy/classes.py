import vectormath as ve


class Texel:
  def __init__(self, samplePos, discretePos, ratio):
    super().__init__()
    self.samplePos = samplePos
    self.discretePos = discretePos
    self.ratio = ratio


class Vertex:
  def __init__(self, txCoord, vertexCoord, vertexNormal=ve.Vector2(0, 0)):
    super().__init__()
    self.txCoord: ve.Vector2 = txCoord
    self.vertexCoord: ve.Vector3 = vertexCoord
    self.vertexNormal: ve.Vector3 = vertexNormal


class Object3D:
  def __init__(self, tris: [[Vertex]], translate):
    self.tris: [[Vertex]] = tris
    self.translate = translate

  def getFaces(self) -> [[Vertex]]:
    return self.tris


class Patch:
  def __init__(self, position, normal, selfIlluminance, reflectance, ratio, backwriteCoord, nice=0):
    self.position = position
    self.normal = normal
    self.selfIlluminance = selfIlluminance
    self.reflectance = reflectance
    self.backWriteCoord = backwriteCoord
    self.nice = nice
    self.ratio = ratio

  def getWattage(self):
    return self.selfIlluminance*self.ratio


class Edge:
  def __init__(self, start, end):
    super().__init__()
    self.start: Vertex = start
    self.end: Vertex = end

  def vector(self):
    return ve.Vector2((self.end.txCoord.x-self.start.txCoord.x), (self.end.txCoord.y-self.start.txCoord.y))


class Color:
  def __init__(self, r, g, b):
    self.r = r
    self.g = g
    self.b = b


class ClosestRes:
  def __init__(self, startIndex, bay1, distance, pos):
    super().__init__()
    self.startIndex = startIndex
    self.bay1 = bay1
    self.distance = distance
    self.pos = pos
