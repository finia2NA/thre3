from functools import reduce
from random import random
import vectormath as ve
from edgy import getPatches
from typing import List
from helpers import computeFormFactor


class Vertex:
  def __init__(self, txCoord, vertexCoord, vertexNormal=ve.Vector2(0, 0)):
    super().__init__()
    self.txCoord: ve.Vector2 = txCoord
    self.vertexCoord: ve.Vector3 = vertexCoord
    self.vertexNormal: ve.Vector3 = vertexNormal


class Patch:
  def __init__(self, owner, position, normal, selfIlluminance, reflectance, ratio, backwriteCoord, nice=0):
    self.owner = owner
    self.position = position
    self.normal = normal
    self.selfIlluminance = selfIlluminance
    self.reflectance = reflectance
    self.backWriteCoord = backwriteCoord
    self.nice = nice
    self.ratio = ratio
    self.finalWattage = 0

  def getSelfWattage(self):
    return self.selfIlluminance*self.ratio

  def getFinalWattage(self):
    return self.finalWattage*self.ratio


class FormFactorStorage:
  def __init__(self):
    super().__init__()
    self.theDict = {}

  def add(self, a: Patch, b: Patch, factor: float):
    primary:Patch = min(a, b, key=lambda x: x.owner.id)
    if not primary.owner.id in self.theDict:
      self.theDict[primary.owner.id] = [[None]*primary.owner.patchRes[1] for _ in primary.owner.patch] # TODO: not length ysize, but ysize-xSize or something.

  def getFF(a: Patch, b: Patch):
    pass


class Scene:
  def __init__(self):
    super().__init__()
    self.objects = []
    self.__formFactors = {}  # Form Factors are a dictionary over <mesh, x,y>

  def addObjects(self, new_o):
    # Adding the object to a szene definitly means the form factors have to be recomputed, but patches might be right.
    new_o.formFlag = False
    self.objects.append(new_o)

  def getFormFactors(self):

    # first of all, if we already have up to date form factors, no need to calc new ones.
    canary = True
    for o in self.objects:
      canary = canary and o.formFlag

    # if any objects say that form factors are out of sync, we need to compute new ones.
    if not canary:
        # first, get all patches to compute form factors between
      patches: List[Patch] = []
      for o in self.objects:
        patches.append(o.getPatches())

      for i in range(len(patches)):
        self.__formFactors[patches[i], patches[i]] = 0
        for j in range(i+1, len(patches)):
          self.__formFactors[(patches[i], patches[j])] = computeFormFactor(
              patches[i], patches[j])

      for o in self.objects:
        canary = o.formFlag = True

    return self.__formFactors


class Object3D:
  def __init__(self, tris: List[List[Vertex]], reflectanceMap, luminanceMap, translate=0):
    self.tris: List[List[Vertex]] = tris
    self.__translate = translate
    self.reflectanceMap = reflectanceMap
    self.luminanceMap = luminanceMap
    self.id = random.randomInt()

    self.finalTexture: List[List[Color]] = [[]]

    # a flag of whether things have happened to this object that would mean the form factors in the scene must be recomputed.
    # criteria for this are:
    # - the object is new
    # - the object has been translated
    # - the resolution of patches has been changed
    self.formFlag = False

    # a flag of wheter things have happened to this object that would mean the patches have to be recomputed.
    # criteria for this are:
    # - the object is new
    # - the patchRes has changed
    self.patchFlag = False

    self.__patches = []
    self.patchRes = None

  def getFaces(self) -> List[List[Vertex]]:
    return self.tris

  def setTranslate(self, trans):
    if trans != self.__translate:
      self.__translate = trans
      self.formFlag = False

  def setPatchRes(self, newRes: List[int, int]):
    if newRes != self.patchRes:
      self.patchRes = newRes
      self.patchFlag = True
      self.formFlag = True

  def getPatches(self, translate=None) -> List[Patch]:

    if self.patchRes == None or None in self.patchRes:
      raise Exception("no resolution for patches given")

    if self.patchFlag == False:
      self.patches = getPatches(
          self, self.patchRes[0], self.patchRes[1], self.luminanceMap, self.reflectanceMap
      )
      self.patchFlag = True

    return self.__translatePatches(self.__patches)


class Edge:
  def __init__(self, start, end):
    super().__init__()
    self.start: Vertex = start
    self.end: Vertex = end

  def vector(self):
    return ve.Vector2((self.end.txCoord.x-self.start.txCoord.x), (self.end.txCoord.y-self.start.txCoord.y))


class Color:
  def __init__(self, r, g, b):
    self.r = r
    self.g = g
    self.b = b


class ClosestRes:
  def __init__(self, startIndex, bay1, distance, pos):
    super().__init__()
    self.startIndex = startIndex
    self.bay1 = bay1
    self.distance = distance
    self.pos = pos
