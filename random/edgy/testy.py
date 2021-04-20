import unittest
import vectormath as ve
from edgy import edgeToTexel, Edge, Vertex


class TestUVToTexel(unittest.TestCase):
  xRes = 16
  yRes = 16

  def gen(self, start, end, startExpected, endExpected):
    start, end = edgeToTexel(start, end, self.xRes, self.yRes)

    self.assertEqual(start.x, startExpected.x)
    self.assertEqual(start.y, startExpected.y)
    self.assertEqual(end.x, endExpected.x)
    self.assertEqual(end.y, endExpected.y)

  def test_StraightDown(self):
    start = ve.Vector2(0, 0)
    end = ve.Vector2(0, 0.3)

    startExpected = ve.Vector2(0, 0)
    endExpected = ve.Vector2(0, 4)

    self.gen(start, end, startExpected, endExpected)

  def test_upright(self):
    start = ve.Vector2(0, 0.3)
    end = ve.Vector2(1, 0)

    startExpected = ve.Vector2(0, 4)
    endExpected = ve.Vector2(15, 0)

    self.gen(start, end, startExpected, endExpected)


if __name__ == '__main__':
  unittest.main()
