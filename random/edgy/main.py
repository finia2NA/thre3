import inspect
import math
import re
import time

import vectormath as ve

from classes import Color, Edge, Object3D, Patch, Texel, Vertex
from helpers import dPrint, getArea, getBayecentric, discreteToMidpoint

face = [Vertex(ve.Vector2(0.0, 0.0), ve.Vector2(0, 0, 0)),
        Vertex(ve.Vector2(0.0, 0.3), ve.Vector2(0, 1, 1)),
        Vertex(ve.Vector2(1.0, 0.0), ve.Vector2(0, 0, 1))
        ]


def bayExample1():
  # (possible)
  p = ve.Vector2(6.5, 7.5)
  a = ve.Vector2(4, 6)
  b = ve.Vector2(11, 6)
  c = ve.Vector2(6, 10)
  u, v, w = getBayecentric(p, a, b, c)

  dPrint([u, v, w])
  dPrint([p, u*a+v*b+w*c])


def bayExample2():
  # (impossible)
  p = ve.Vector2(9.5, 9.5)
  a = ve.Vector2(4, 6)
  b = ve.Vector2(11, 6)
  c = ve.Vector2(6, 10)
  u, v, w = getBayecentric(p, a, b, c)

  dPrint([u, v, w])
  dPrint([p, u*a+v*b+w*c])


if(__name__ == "__main__"):
  # myAlg(shape)
  bayExample1()
  bayExample2()
