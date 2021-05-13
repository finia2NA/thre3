import math
import inspect
import re
import vectormath as ve

from multipledispatch import dispatch

from classes import Color, Vertex, ClosestRes

# debug helper


def dPrint(x):  # ✔
  frame = inspect.currentframe().f_back
  s = inspect.getframeinfo(frame).code_context[0]
  r = re.search(r"\((.*)\)", s).group(1)
  print("{} = {}".format(r, x))


# helper methods

def sampleTexture(u, v, tx: [[Color]]):
  """samples the texture at given [0,1]-coordinates"""
  uRes = len(tx)
  vRes = len(tx[0])

  # TODO: don't know if this might need to be more sophisticated but should at least work for now.
  # Since the incoming u,v are midpointpositions, I don't think there's substantial harm that could come from fenceposting
  return tx[math.floor(u*uRes)][math.floor(v*vRes)]

@dispatch(ve.Vector2,ve.Vector2,ve.Vector2)
def getArea(a: ve.Vector2, b: ve.Vector2, c: ve.Vector2):
  """Returns the area of the triangle defined by the 3 given positions"""
  ab: ve.Vector2 = b-a
  ac: ve.Vector2 = c-a

  return (1/2) * ab.cross(ac)

@dispatch([ve.Vector2])
def getArea(positions: [ve.Vector2]):
  """Returns the area of the triangle defined by the 3 given positions"""
  assert len(positions) == 3
  return getArea(positions[0], positions[1], positions[2])


def distance(p1: ve.Vector2, p2: ve.Vector2):
  a = p2.x-p1.x
  b = p2.y-p1.y
  return math.sqrt(a*a+b*b)


def closestToLineSegment(p: ve.Vector2, face: [Vertex], startIndex: int) -> ClosestRes:
  start = face[startIndex]
  end = face[(startIndex+1) % 3]

  ls = (p-start).dot(end-start) / (end-start).dot(end-start)
  if ls <= 0:
    point = start
    ls = 0
  elif ls >= 1:
    point = end
    ls = 1
  else:
    point = (1-ls)*start+ls*end

  return ClosestRes(startIndex=ls, bay1=ls, distance=distance(p, point), pos=point)


def getClosestInside(p: ve.Vector2, face: [Vertex]) -> ClosestRes:
  """given a position that is outside of the given face, return the closest point that is in the face"""
  # from here: https://diego.assencio.com/?index=ec3d5dfdfc0b6a0d147a656f0af332bd#mjx-eqn-post_ec3d5dfdfc0b6a0d147a656f0af332bd_lambda_closest_point_line_to_point.

  re: ClosestRes = None

  for i in range(3):
    this = closestToLineSegment(p, face, i)

    if re == None or re.distance > this.distance:
      re = this

    return re


def mult_components(a, b):
  # yeah i know this could be done more neatly
  assert len(a) == len(b)
  re = []
  for i in range(len(a)):
    re.append(a[i]*b[i])

  return re

@dispatch(ve.Vector2,ve.Vector2,ve.Vector2,ve.Vector2)
def getBayecentric(p: ve.Vector2, a: ve.Vector2, b: ve.Vector2, c: ve.Vector2):  # ✔
  """returns the factors for bayecentrically calculating point p using vectors a,b,c"""
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

  return [u, v, w]

@dispatch(ve.Vector2,[ve.Vector2])
def getBayecentric(p: ve.Vector2, arr: [ve.Vector2]):
  assert(len(arr) == 3)
  return getBayecentric(p, arr[0], arr[1], arr[2])


def discreteToMidpoint(tx: ve.Vector2, xRes, yRes):
  """Takes a discrete texel coordinate and returns the vector of[0,1]- coordinates of the texels midpoint on a scale of 0 to 1."""
  return ve.Vector2(tx.x/xRes, tx.y/yRes) + 1/2*ve.Vector2(xRes, yRes)


def discreteToMidpoint(pos: [int], xRes, yRes):
  vector = ve.Vector2(pos[0], pos[1])
  return discreteToMidpoint(vector, xRes, yRes)
