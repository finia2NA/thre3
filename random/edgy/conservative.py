import vectormath as ve
import math
from functools import reduce
from helpers import discreteToMidpoint


class Boundingbox:
  def __init__(self, xMax, xMin, yMax, yMin):
    super().__init__()
    self.xMax = xMax
    self.xMin = xMin
    self.yMax = yMax
    self.yMin = yMin

  def __init__(self, face, xRes, yRes):
    self.xMax = math.ceil(max(face, key=lambda v: v.x).x*xRes)
    self.xMin = math.floor(min(face, key=lambda v: v.x).x*xRes)
    self.yMax = math.ceil(max(face, key=lambda v: v.y).y*yRes)
    self.yMin = math.floor(min(face, key=lambda v: v.y).y*yRes)


class Implicit:
  def __init__(self, start: ve.Vector2, end: ve.Vector2):
    super().__init__()
    assert start != end

    direction: ve.Vector2 = end-start
    self.n = ve.Vector2(-direction.y, direction.x)

  def apply(self):
    pass


class Equation:
  def apply(self):
    pass


def conserve(start, end, xRes, yRes):
  pass


def getImplicit(start: ve.Vector2, end: ve.Vector2):
  pass


def rasterize(face: [ve.Vector2], xRes, yRes):
  locations = []
  boundingbox = Boundingbox(face, xRes, yRes)
  conservative_edges = map(lambda i:
                           conserve(face[i], face[(i+1) % 3], xRes, yRes), range(3))

  equations = map(lambda x: getImplicit(x), conservative_edges)

  for x in range(boundingbox.xMin, boundingbox.xMax+1):
    for y in range(boundingbox.yMin, boundingbox.yMax+1):
      loc = discreteToMidpoint(x, y, xRes, yRes)
      for eq in equations:

        if eq.apply(loc) <= 0:  # TODO: or maybe bigger idk
          break

        locations.append([x, y])
