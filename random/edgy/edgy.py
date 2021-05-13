import inspect
import math
import re
import time

import vectormath as ve
from functools import reduce
import conservative
from classes import Color, Object3D, Patch, Texel, Vertex, ClosestRes
from helpers import dPrint, getArea, getBayecentric, discreteToMidpoint, sampleTexture, getClosestInside, mult_components


def getPatches(mesh: Object3D, xRes: int, yRes: int, luminanceMap: [[Color]], reflectanceMap: [[Color]]):
  patches = []

  for face in mesh.getFaces():
    tx_cornerPoints = map(lambda x: x.txCoord, face)

    vertexArea = getArea(list(map(lambda x: x.vertexCoord, face)))
    textureArea = getArea(list(map(lambda x: x.txCoord, face)))
    texelArea = 1/(xRes*yRes)
    ratio = vertexArea / (textureArea)*texelArea  # TODO: figure this thing out

    texels = conservative.rasterize(tx_cornerPoints, xRes, yRes)

    texel: [int]
    for texel in texels:
      samplePoint = discreteToMidpoint(texel)
      sampleDistance = 0
      # get bayecentric coordinates of the point
      bayecentrics = getBayecentric(samplePoint, face)

      # if any of those bayecentrics are < 0, the sample point was outside the face.
      # we now move it inside the face and update bayecentrics, sample position and .
      if reduce(lambda a, b: min(a, b), bayecentrics) < 0:
        closestRes: ClosestRes = getClosestInside(samplePoint, face)
        bayecentrics[closestRes.startIndex] = closestRes.bay1
        bayecentrics[(closestRes.startIndex+1) % 3] = 1 - closestRes.bay1
        bayecentrics[(closestRes.startIndex+2) % 3] = 0

        # the sample distance will be used as NICE
        sampleDistance = closestRes.distance

        samplePoint = closestRes.pos

      position = mult_components(
          bayecentrics, map(lambda x: x.vertexCoord, face))
      normal = mult_components(
          bayecentrics, map(lambda x: x.normalCoords, face))
      selfIlluminance = \
          sampleTexture(samplePoint.x,
                        samplePoint.y, luminanceMap)
      reflectance = sampleTexture(samplePoint.x,
                                  samplePoint.y, reflectanceMap)
      nice = sampleDistance  # the nice value should specify how far the midpoint of the texel is from the tri it is a part of. 0 in most cases, but in other cases I want to have some metric to determine which texel "wins"

      patch = Patch(position=position, normal=normal,
                    selfIlluminance=selfIlluminance, reflectance=reflectance, ratio=ratio, backwriteCoord=texel, nice=nice)

      patches.append(patch)

  patches.sort(key=lambda p: (
      p.backwriteCoord[0], p.backwriteCoord[1], p.nice))

  marks = []
  for i in range(len(patches)-1):
    first: Patch = patches[i]
    second: Patch = patches[i+1]

    if first.backWriteCoord == second.backWriteCoord:
      if first.nice < second.nice:
        marks.append(i+1)
      else:
        marks.append(i)

  for mark in reversed(marks):
    patches.pop(index=mark)
