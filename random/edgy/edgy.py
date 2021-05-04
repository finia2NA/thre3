import inspect
import math
import re
import time

import vectormath as ve
from functools import reduce
from classes import Color, Edge, Object3D, Patch, Texel, Vertex, ClosestRes
from helpers import dPrint, getArea, getBayecentric, discreteToMidpoint, discretizeStartEnd, sampleTexture, getClosestInside, mult_components

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
      texels: [Texel] = rasterizeFace(face, xRes, yRes)

      texel: Texel
      for texel in texels:
        sampleDist = 0
        bayecentrics = getBayecentric(texel.midpointPos, face)

        if reduce(lambda a, b: min(a, b), bayecentrics) < 0:
          closestRes: ClosestRes = getClosestInside(texel.midpointPos, face)
          bayecentrics[closestRes.startIndex] = closestRes.bay1
          bayecentrics[(closestRes.startIndex+1) % 3] = 1 - closestRes.bay1
          bayecentrics[(closestRes.startIndex+2) % 3] = 0

          sampleDist = closestRes.distance

          # TODO: don't know if changing the midpoint to reflect the samplepoint is good or bad...
          texel.midpointPos = mult_components(
              bayecentrics, map(lambda x: x.txcoord, face))

        position = mult_components(
            bayecentrics, map(lambda x: x.vertexCoord, face))
        normal = mult_components(
            bayecentrics, map(lambda x: x.normalCoords, face))
        selfIlluminance = \
            sampleTexture(texel.midpointPos.x, texel.midpointPos.y, luminanceMap) \
            * texel.ratio  # Since the lightmap specifies light/area, multiplying with area should give the absolute power for the patch. # TODO: remove lightmap dummy
        backwriteCoord = texel.discretePos
        nice = sampleDist  # the nice value should specify how far the midpoint of the texel is from the tri it is a part of. 0 in most cases, but in other cases I want to have some metric to determine which texel "wins"

        patch = Patch(position=position, normal=normal,
                      selfIlluminance=selfIlluminance, backwriteCoord=backwriteCoord, nice=nice)

      