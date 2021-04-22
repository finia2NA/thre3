import vectormath as ve
import math
import time

import inspect
import re


def dPrint(x):
  frame = inspect.currentframe().f_back
  s = inspect.getframeinfo(frame).code_context[0]
  r = re.search(r"\((.*)\)", s).group(1)
  print("{} = {}".format(r, x))


class Vertex:
  def __init__(self, txCoord, vertexCoord, vertexNormal=ve.Vector2(0, 0)):
    super().__init__()
    self.txCoord: ve.Vector2 = txCoord
    self.vertexCoord: ve.Vector2 = vertexCoord
    self.vertexNormal: ve.Vector2 = vertexNormal


class Edge:
  def __init__(self, start, end):
    super().__init__()
    self.start: Vertex = start
    self.end: Vertex = end

  def vector(self):
    return ve.Vector2((self.end.txCoord.x-self.start.txCoord.x), (self.end.txCoord.y-self.start.txCoord.y))


shape = [Vertex(ve.Vector2(0.0, 0.0), ve.Vector2(0, 0, 0)),
         Vertex(ve.Vector2(0.0, 0.3), ve.Vector2(0, 1, 1)),
         Vertex(ve.Vector2(1.0, 0.0), ve.Vector2(0, 0, 1))
         ]


def edgePointsToTexel(start: ve.Vector2, end: ve.Vector2, xRes, yRes):
  direction: ve.Vector2 = ve.Vector2(end.x-start.x, end.y-start.y)

  startquadrant = -1
  if direction.x <= 0 and direction.y < 0:
    startquadrant = 1
  elif direction.x < 0 and direction.y >= 0:
    startquadrant = 2
  elif direction.x >= 0 and direction.y > 0:
    startquadrant = 3
  elif direction.x > 0 and direction.y <= 0:
    startquadrant = 4

  # start
  sx = start.x*xRes
  sy = start.y*yRes

  if sx.is_integer():
    sx = sx if startquadrant in [3, 4] else sx-1
  else:
    sx = math.floor(sx)

  if sy.is_integer():
    sy = sy if startquadrant in [2, 3] else sy-1
  else:
    sy = math.floor(sy)

  # end
  endquadrant = -1
  if direction.x < 0 and direction.y <= 0:
    endquadrant = 1
  elif direction.x <= 0 and direction.y > 0:
    endquadrant = 2
  elif direction.x > 0 and direction.y >= 0:
    endquadrant = 3
  elif direction.x >= 0 and direction.y < 0:
    endquadrant = 4
  ex = end.x*xRes
  ey = end.y*yRes

  if ex.is_integer():
    ex = ex-1 if endquadrant in [3, 4] else ex
  else:
    ex = math.floor(ex)

  if ey.is_integer():
    ey = ey-1 if endquadrant in [2, 3] else ey
  else:
    ey = math.floor(ey)

  return ve.Vector2(sx, sy), ve.Vector2(ex, ey)


def myAlg(shape, xRes=16, yRes=16):
  for i in range(3):
    texels = []

    startVertex: Vertex = shape[i]
    endVertex: Vertex = shape[(i+1) % 3]

    startTexel, endTexel = \
        edgePointsToTexel(startVertex.txCoord, endVertex.txCoord, xRes, yRes)

    texels.append(startTexel)
    dPrint(startTexel)

    startPoint: ve.Vector2 = startVertex.txCoord
    endPoint: ve.Vector2 = endVertex.txCoord

    if not (startPoint.x == endPoint.x):

      m = (endPoint.y-startPoint.y) / (endPoint.x-startPoint.x)
      b = startPoint.y
      dPrint([m, b])

      direction = 1 if endTexel.x > startTexel.x else -1

      for x in range(int(startTexel.x), int(endTexel.x), direction): # TODO:/16...
        x = x/xRes
        y = m*x+b
        # dPrint([x, y])
        texel, _ = edgePointsToTexel(ve.Vector2(x, y), endPoint, xRes, yRes)
        dPrint(texel)
        # texels.append(texel)

    print()


if(__name__ == "__main__"):
  myAlg(shape)
