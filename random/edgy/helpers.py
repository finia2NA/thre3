import math
import inspect
import re
import vectormath as ve

# debug helper


def dPrint(x):  # ✔
  frame = inspect.currentframe().f_back
  s = inspect.getframeinfo(frame).code_context[0]
  r = re.search(r"\((.*)\)", s).group(1)
  print("{} = {}".format(r, x))


# helper methods

def sampleTexture(u, v, tx):
  return 0  # TODO:


def getArea(a: Vertex, b: Vertex, c: Vertex):
  """Takes the vertices of a tri and returns the Area of the tri in 3D-Space"""
  ab: ve.Vector2 = b.txCoord-a.txCoord
  ac: ve.Vector2 = c.txCoord-a.txCoord

  return (1/2) * ab.cross(ac)


def getArea(face: [Vertex]):
  assert len(face) == 3
  return getArea(face[0], face[1], face[2])


def discretizeStartEnd(start: ve.Vector2, end: ve.Vector2, xRes, yRes):  # X
  """takes a start and end vector of a line and returns the start and end texel indices in a canvas of given size"""
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


def getBayecentric(p: ve.Vector2, a: ve.Vector2, b: ve.Vector2, c: ve.Vector2):  # ✔
  # Adapted from https://gamedev.stackexchange.com/questions/23743/whats-the-most-efficient-way-to-find-barycentric-coordinates
  v0: ve.Vector2 = b-a
  v1: ve.Vector2 = c-a
  v2: ve.Vector2 = p-a

  d00 = v0.dot(v0)
  d01 = v0.dot(v1)
  d11 = v1.dot(v1)
  d20 = v2.dot(v0)
  d21 = v2.dot(v1)

  denom = d00*d11-math.pow(d01, 2)

  v = (d11 * d20 - d01 * d21) / denom
  w = (d00 * d21 - d01 * d20) / denom
  u = 1.0 - v - w

  return u, v, w


def discreteToMidpoint(tx: ve.Vector2, xRes, yRes):
  """Takes a discrete texel coordinate and returns the vector of real coordinates of the texels midpoint on a scale of 0 to 1."""
  return ve.Vector2(tx.x/xRes, tx.y/yRes) + 1/2*ve.Vector2(xRes, yRes)
