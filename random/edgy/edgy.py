import inspect
import math
import re
import time

import vectormath as ve

from classes import Color, Edge, Object3D, Patch, Texel, Vertex
from helpers import dPrint, getArea, getBayecentric, discreteToMidpoint, discretizeStartEnd, sampleTexture

# debug helper


def rasterizeFace(face: [Vertex], xRes=16, yRes=16) -> [Texel]:
  """Given a tri and the dimensions of a canvas, return all texels in the canvas that make up the face."""

  assert len(face) == 3

  texels: [Texel] = []
  vertexArea = getArea(map(lambda x: x.txCoord, face))
  textureArea = getArea(map(lambda x: x.txCoord, face))

  for i in range(3):

    startVertex: Vertex = face[i]
    endVertex: Vertex = face[(i+1) % 3]

    startPos, endPos = \
        discretizeStartEnd(startVertex.txCoord,
                           endVertex.txCoord, xRes, yRes)

    startTexel: Texel = \
        Texel(discreteToMidpoint(startPos, xRes, yRes),
              startPos, vertexArea/textureArea)
    endTexel: Texel = \
        Texel(discreteToMidpoint(endPos, xRes, yRes),
              endPos, vertexArea/textureArea)

    texels.append(startTexel)
    dPrint(startTexel)

    startPoint: ve.Vector2 = startVertex.txCoord
    endPoint: ve.Vector2 = endVertex.txCoord

    if not (startPoint.x == endPoint.x):

      m = (endPoint.y-startPoint.y) / (endPoint.x-startPoint.x)
      b = startPoint.y
      dPrint([m, b])

      direction = 1 if endTexel.discretePos.x > startTexel.discretePos.x else -1

      for x in range(startTexel.discretePos.x, endTexel.discretePos.x, direction):
        x = x/xRes
        y = m*x+b
        pos, _ = discretizeStartEnd(ve.Vector2(x, y), endPoint, xRes, yRes)
        texel = Texel(discreteToMidpoint(pos, xRes, yRes),
                      pos, vertexArea/textureArea)
        dPrint(texel)
        texels.append(texel)

    print()

  # now, create a list that is sorted first by x and then by y.
  s = sorted(texels, key=lambda t: (t.discretePos.x, t.discretePos.y))

  fill: [Texel] = []
  # go through the list. whenever there are two vertices that share an x but have more than 1 y between them, fill.
  for i in range(len(s)-1):
    first: Texel = s[i]
    second: Texel = s[i+1]
    if first.discretePos.x == second.discretePos.x:
      deltaY = second.discretePos.y - first.discretePos.y
      for i in range(1, int(deltaY)):
        pos = ve.Vector2(first.x, first.y+i)
        filledTexel = Texel(discreteToMidpoint(
            pos, xRes, yRes), pos, vertexArea)
        dPrint(filledTexel)
        fill.append(filledTexel)

  return texels+fill

  def getPatches(mesh: Object3D, xRes: int, yRes: int, luminanceMap: [[Color]]):
    patches = []
    for face in mesh.getFaces():
      a: Vertex = face[0]
      b: Vertex = face[1]
      c: Vertex = face[2]

      texels: [Texel] = rasterizeFace(face, xRes, yRes)

      texel: Texel
      for texel in texels:
        u, v, w = getBayecentric(texel.midpointPos, a, b, c)

        if u < 0 or v < 0 or w < 0:
          # in this case, the midpoint of the texel is not inside the shape. this is problematic, since we can't simply use bayecentric coordinates to determine the position of the patch in 3D space now.
          # As a substitute, we find the closest point that *is* inside the shape and place the patch there.
          # do some magic that gets us a new u,v,w that represents the closest point that IS in the face.
          pass

        position = u*a.vertexCoord + v*b.vertexCoord + w*c.vertexCoord
        normal = u*a.vertexNormal + v*b.vertexNormal + w*c.vertexNormal
        selfIlluminance = \
            sampleTexture(texel.midpointPos.x, texel.midpointPos.y, luminanceMap) \
            * texel.ratio  # Since the lightmap specifies light/area, multiplying with area should give the absolute power for the patch. # TODO: remove lightmap dummy
        backwriteCoord = texel.discretePos
        nice = 0  # TODO: the nice value should specify how far the midpoint of the texel is from the tri it is a part of. 0 in most cases, but in other cases I want to have some metric to determine which texel "wins"

        patch = Patch(position=position, normal=normal,
                      selfIlluminance=selfIlluminance, backwriteCoord=backwriteCoord, nice=nice)
