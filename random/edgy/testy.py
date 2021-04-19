import unittest
import vectormath as ve
from edgy import uvToTexel, Edge


class TestUVToTexel(unittest.TestCase):
  xRes = 4
  yRes = 4

  def test_straightup(self):
    uv = ve.Vector2(0.5, 0.5)

    edge = Edge(start=ve.Vector2(0.5, 0.5), end=ve.Vector2(0.5, 0.25))

    res = uvToTexel(uv=uv, edge=edge, xRes=self.xRes,
                    yRes=self.yRes)

    self.assertEqual(res.x, 1)
    self.assertEqual(res.y, 1)

  def test_leftup(self):
    uv = ve.Vector2(0.5, 0.5)

    edge = Edge(start=ve.Vector2(0.5, 0.5), end=ve.Vector2(0.25, 0.25))

    res = uvToTexel(uv=uv, edge=edge, xRes=self.xRes,
                    yRes=self.yRes)

    self.assertEqual(res.x, 1)
    self.assertEqual(res.y, 1)

  def test_left(self):
    uv = ve.Vector2(0.5, 0.5)

    edge = Edge(start=ve.Vector2(0.5, 0.5), end=ve.Vector2(0.25, 0.5))

    res = uvToTexel(uv=uv, edge=edge, xRes=self.xRes,
                    yRes=self.yRes)

    self.assertEqual(res.x, 1)
    self.assertEqual(res.y, 2)

  def test_downleft(self):
    uv = ve.Vector2(0.5, 0.5)

    edge = Edge(start=ve.Vector2(0.5, 0.5), end=ve.Vector2(0.25, 0.75))

    res = uvToTexel(uv=uv, edge=edge, xRes=self.xRes,
                    yRes=self.yRes)

    self.assertEqual(res.x, 1)
    self.assertEqual(res.y, 2)

  def test_down(self):
    uv = ve.Vector2(0.5, 0.5)

    edge = Edge(start=ve.Vector2(0.5, 0.5), end=ve.Vector2(0.5, 0.75))

    res = uvToTexel(uv=uv, edge=edge, xRes=self.xRes,
                    yRes=self.yRes)

    self.assertEqual(res.x, 2)
    self.assertEqual(res.y, 2)

  def test_downright(self):
    uv = ve.Vector2(0.5, 0.5)

    edge = Edge(start=ve.Vector2(0.5, 0.5), end=ve.Vector2(0.75, 0.75))

    res = uvToTexel(uv=uv, edge=edge, xRes=self.xRes,
                    yRes=self.yRes)

    self.assertEqual(res.x, 2)
    self.assertEqual(res.y, 2)

  def test_right(self):
    uv = ve.Vector2(0.5, 0.5)

    edge = Edge(start=ve.Vector2(0.5, 0.5), end=ve.Vector2(0.75, 0.5))

    res = uvToTexel(uv=uv, edge=edge, xRes=self.xRes,
                    yRes=self.yRes)

    self.assertEqual(res.x, 2)
    self.assertEqual(res.y, 1)

  def test_rightup(self):
    uv = ve.Vector2(0.5, 0.5)

    edge = Edge(start=ve.Vector2(0.5, 0.5), end=ve.Vector2(0.75, 0.25))

    res = uvToTexel(uv=uv, edge=edge, xRes=self.xRes,
                    yRes=self.yRes)

    self.assertEqual(res.x, 2)
    self.assertEqual(res.y, 1)


if __name__ == '__main__':
  unittest.main()
