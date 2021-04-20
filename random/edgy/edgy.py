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


def edgeToTexel(edge: [ve.Vector2], xRes, yRes):
  direction: ve.Vector2 = ve.Vector2(edge[1].x-edge[0].x, edge[1].y-edge[0].y)

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
  sx = edge[0].x*xRes
  sy = edge[0].y*yRes

  if sx.is_integer():
    sx = sx+1 if startquadrant in [3, 4] else sx
  else:
    sx = math.floor(sx)

  if sy.is_integer():
    sy = sy+1 if startquadrant in [2, 3] else sy
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
  ex = edge[1].x*xRes
  ey = edge[1].y*yRes

  if ex.is_integer():
    ex = ex+1 if endquadrant in [3, 4] else ex
  else:
    ex = math.floor(ex)

  if ey.is_integer():
    ey = ey+1 if endquadrant in [2, 3] else ey
  else:
    ey = math.floor(ey)

  return ve.Vector2(sx, sy), ve.Vector2(ex, ey)


def uvToTexel(uv: ve.Vector2, edge: Edge, xRes, yRes):
  """convert uv coordinate to texel coordinates. If the coordinate is exactly inbetween two texels, the one that will be in the shape is returned."""  # (hence why the edge is needed as a parameter.)

  u = uv.x
  v = uv.y

  x = -1
  y = -1

  if (u*xRes).is_integer():
    # if the vector points leftward, the pixel has to be left, else right
    if edge.vector().x <= 0 and not (edge.vector().x == 0 and edge.vector().y > 0):
      x = u*xRes
    else:
      x = u*xRes+1
  else:
    x = math.floor(u*xRes)

  if (v*yRes).is_integer():
    # if the vector points down, the pixel has to be below, else above
    if edge.vector().y <= 0 and not (edge.vector().y == 0 and edge.vector().x <= 0):  # "oben minus links"
      y = v*yRes
    else:
      y = v*yRes+1
  else:
    y = math.floor(v*yRes)

  return ve.Vector2(x-1.0, y-1.0)  # -1 bc 0 indexing :)


def draw(shape, xRes=16, yRes=16):

  # for now, just determine which texels have to be calculated
  texels = []

  for i in range(3):
    start = shape[i]
    end = shape[(i+1) % 3]
    edge = Edge(start, end)

    startTexel = uvToTexel(edge.start.txCoord, edge, xRes, yRes)
    endTexel = uvToTexel(edge.end.txCoord, edge, xRes, yRes)

    dPrint([edge.start.txCoord, edge.end.txCoord])

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
      dPrint([x0, x1])
      if x0 == x1 and y0 == y1:
        break
      e2 = 2*err
      if e2 > dy:
        err = err+dy
        x0 = x0+sx
      if e2 < dx:
        err = err + dx
        y0 = y0+sy

      time.sleep(0.25)
    print()


if(__name__ == "__main__"):
  draw(shape)
