import inspect
import math
import re
import time

import vectormath as ve

from classes import Color, Edge, Object3D, Patch, Vertex, Scene
from helpers import dPrint, getArea, getBayecentric, discreteToMidpoint
from edgy import rasterizeFace

from conservative import rasterize

face1 = [
    Vertex(ve.Vector2(0.0, 0.0), ve.Vector2(0, 0, 0)),
    Vertex(ve.Vector2(0.0, 0.3), ve.Vector2(0, 1, 1)),
    Vertex(ve.Vector2(1.0, 0.0), ve.Vector2(0, 0, 1))
]

face2 = [
    Vertex(ve.Vector2(0.5, 0.5), ve.Vector2(1, 1, 1)),
    Vertex(ve.Vector2(1.0, 1.0), ve.Vector2(1, 2, 2)),
    Vertex(ve.Vector2(1.0, 0.5), ve.Vector2(1, 1, 2))
]

luminance = [
    [Color(255, 255, 255), Color(255, 0, 0)],
    [Color(0, 0, 255), Color(0, 255, 0)]
]

ref = None
si = None


def bayExample1():
  # (possible)
  p = ve.Vector2(6.5, 7.5)
  a = ve.Vector2(4, 6)
  b = ve.Vector2(11, 6)
  c = ve.Vector2(6, 10)
  u, v, w = getBayecentric(p, a, b, c)

  dPrint([u, v, w])
  dPrint([p, u*a+v*b+w*c])


def test1():
  scene = Scene()

  object1 = Object3D(tris=[face1],reflectanceMap=ref,luminanceMap=luminance)
  object2 = Object3D(tris=[face2],reflectanceMap=ref,luminanceMap=luminance)

  scene.addObject(object1)
  scene.addObject(object2)

  scene.calcLightmaps()

  # view.display(scene)




if(__name__ == "__main__"):
  test1()
