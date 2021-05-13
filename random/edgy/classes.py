import vectormath as ve


class Vertex:
  def __init__(self, txCoord, vertexCoord, vertexNormal=ve.Vector2(0, 0)):
    super().__init__()
    self.txCoord: ve.Vector2 = txCoord
    self.vertexCoord: ve.Vector3 = vertexCoord
    self.vertexNormal: ve.Vector3 = vertexNormal


class Szene:
  def __init__(self):
    super().__init__()
    self.objects = []

  def addObjects(self):
    pass


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


class Object3D:
  def __init__(self, tris: [[Vertex]], reflectanceMap, translate=0):
    self.tris: [[Vertex]] = tris
    self.translate = translate
    self.formFlag = False

    self.patches = []
    self.patchRes = None

  def getFaces(self) -> [[Vertex]]:
    return self.tris

  def getPatches(self, xRes, yRes, translate=self.translate) -> [Patch]:
    update = False
    if self.patchRes != [xRes,yRes]:
      self.patchRes = [xRes, yRes]
      update = True
    self.patches 


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
