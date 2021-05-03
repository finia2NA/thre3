import inspect
import math
import re
import time

import vectormath as ve

from classes import Color, Edge, Object3D, Patch, Texel, Vertex
from helpers import dPrint, getArea, getBayecentric, txCoordToUV, edgePointsToMidpoint

# debug helper


def rasterizeFace(face: [Vertex], xRes=16, yRes=16):
  """get the coordinates of all texels belonging to the given face"""
  texels = []

  for i in range(3):

    startVertex: Vertex = face[i]
    endVertex: Vertex = face[(i+1) % 3]

    startTexel, endTexel = \
        edgePointsToMidpoint(startVertex.txCoord,
                             endVertex.txCoord, xRes, yRes)

    texels.append(startTexel)
    dPrint(startTexel)

    startPoint: ve.Vector2 = startVertex.txCoord
    endPoint: ve.Vector2 = endVertex.txCoord

    if not (startPoint.x == endPoint.x):

      m = (endPoint.y-startPoint.y) / (endPoint.x-startPoint.x)
      b = startPoint.y
      dPrint([m, b])

      direction = 1 if endTexel.x > startTexel.x else -1

      for x in range(int(startTexel.x), int(endTexel.x), direction):
        x = x/xRes
        y = m*x+b
        texel, _ = edgePointsToMidpoint(ve.Vector2(x, y), endPoint, xRes, yRes)
        dPrint(texel)
        texels.append(texel)

    print()

  # now, create a list that is sorted first by x and then by y.
  s = sorted(texels, key=lambda t: (t.x, t.y))

  fill = []
  # go through the list. whenever there are two vertices that share an x but have more than 1 y between them, fill.
  for i in range(len(s)-1):
    first = s[i]
    second = s[i+1]
    if first.x == second.x:
      deltaY = second.y-first.y
      for i in range(1, int(deltaY)):
        filledTexel = ve.Vector2(first.x, first.y+i)
        dPrint(filledTexel)
        fill.append(filledTexel)

  return texels+fill

  def getPatches(mesh: Object3D, xRes: int, yRes: int, lightmap: [[Color]]):
    patches = []
    for face in mesh.getFaces():
      a: Vertex = face[0]
      b: Vertex = face[1]
      c: Vertex = face[2]

      texelLocations = rasterizeFace(face, xRes, yRes)

      for location in texelLocations:
        u, v, w = getBayecentric(txCoordToUV(location, xRes, yRes), a, b, c)

        if u < 0 or v < 0 or w < 0:
          # do some magic that gets us a new u,v,w that represents the closest point that IS in the face.
          pass

        position = u*a.vertexCoord+v*b.vertexCoord+w*c.vertexCoord
        normal = u*a.vertexNormal+v*b.vertexNormal+w*c.vertexNormal
        selfIlluminance = 0  # TODO
        backwriteCoord = location
        nice = 0  # TODO

        patch = Patch(position=position, normal=normal,
                      selfIlluminance=selfIlluminance, backwriteCoord=backwriteCoord, nice=nice)
