import math

import vectormath as ve

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
    assert not(start.x == end.x and start.y == end.y)

    self.normal = getOrthNormal(start, end)
    self.offset = start.dot(self.normal)

  def apply(self, point):
    re = self.normal.dot(point)-self.offset
    return re


def getOrthNormal(start: ve.Vector2, end: ve.Vector2):
  direction: ve.Vector2 = end-start
  return ve.Vector2(-direction.y, direction.x).normalize()


def getCandidate(texel_midpoint, normal, xRes, yRes):
  """returns the corner of the texel with the biggest dotp with a given normal"""
  xIncrement = 1/xRes
  yIncrement = 1/yRes

  # positions stores the positions of the 4 corners of the texel.
  positions = []
  for i in [-0.5, 0.5]:
    for j in [-0.5, 0.5]:
      positions.append(texel_midpoint+ve.Vector2(i*xIncrement, j*yIncrement))

  return max(positions, key=lambda p: normal.dot(p))


def conservative(start, end, xRes, yRes):
  """return start and end point of an edge for conservative rasterization"""

  n = getOrthNormal(start, end)
  re_start = getCandidate(start, n, xRes, yRes)
  re_end = getCandidate(end, n, xRes, yRes)

  return [re_start, re_end]


def rasterize(face: [ve.Vector2], xRes, yRes):
  locations = []
  boundingbox = Boundingbox(face, xRes, yRes)
  conservative_edges = list(map(lambda i:
                                conservative(face[i], face[(i+1) % 3], xRes, yRes), range(3)))

  equations = map(lambda x: Implicit(x[0], x[1]), conservative_edges)

  for x in range(boundingbox.xMin, boundingbox.xMax):
    for y in range(boundingbox.yMin, boundingbox.yMax):
      midpoint = ve.Vector2((x+0.5)/xRes, (y+0.5)/yRes)
      canary = True
      for eq in equations:

        if eq.apply(midpoint) >= 0:  # TODO: fenceposting :D
          canary = False
          break

      if canary:
        locations.append([x, y])

  return locations
