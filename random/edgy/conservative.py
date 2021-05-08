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
    assert start != end

    self.normal = getOrthNormal(start, end)
    self.offset = start.dot(normal)

  def apply(self, point):
    return self.normal.dot(point)-self.offset


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
  conservative_edges = map(lambda i:
                           conservative(face[i], face[(i+1) % 3], xRes, yRes), range(3))

  equations = map(lambda x: Implicit(x), conservative_edges)

  for x in range(boundingbox.xMin, boundingbox.xMax+1):
    for y in range(boundingbox.yMin, boundingbox.yMax+1):
      loc = discreteToMidpoint(x, y, xRes, yRes)
      for eq in equations:

        if eq.apply(loc) <= 0:  # TODO: fenceposting :D
          break

        locations.append([x, y])

  return locations
