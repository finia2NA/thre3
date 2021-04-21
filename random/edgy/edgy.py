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


def breseham(shape, xRes=16, yRes=1):

  for i in range(3):
    start: Vertex = shape[i]
    end: Vertex = shape[(i+1) % 3]

    startTexel, endTexel = edgePointsToTexel(
        start.txCoord, end.txCoord, xRes, yRes)

    dPrint([startTexel, endTexel])

    x0 = startTexel.x
    y0 = startTexel.y
    x1 = endTexel.x
    y1 = endTexel.y

    dx = abs(x1-x0)
    sx = 1 if x0 < x1 else -1
    dy = -abs(y1-y0)
    sy = 1 if y0 < y1 else -1

    dPrint([x0, y0, x1, y1])
    dPrint([dx, sx, dy, sy])

    err = dx+dy

    while True:
      dPrint([x0, y0])
      if x0 == x1 and y0 == y1:
        break
      e2 = 2*err
      if e2 > dy:
        err = err+dy
        x0 = x0+sx
      if e2 < dx:
        err = err + dx
        y0 = y0+sy

      time.sleep(0.0625)
    print()


def dda(shape, xRes=16, yRes=16):
  # DDA algorithm, adapted from https://en.wikipedia.org/wiki/Digital_differential_analyzer_(graphics_algorithm)
  for i in range(3):
    startVertex: Vertex = shape[i]
    endVertex: Vertex = shape[(i+1) % 3]

    start = startVertex.txCoord*ve.Vector2(xRes, yRes)
    end = endVertex.txCoord*ve.Vector2(xRes, yRes)

    dPrint([start, end])

    dx = end.x-start.x
    dy = end.y-start.y

    step = max(abs(dx), abs(dy))

    dx = float(dx)/float(step)
    dx = float(dy)/float(step)

    x = start.x
    y = start.y
    i = 1

    while i <= step:
      dPrint([x/xRes, y/yRes])
      x = x+dx
      y = y+dy
      i = i+1
      time.sleep(0.0625)

    print()


if(__name__ == "__main__"):
  # breseham(shape)
  dda(shape)
