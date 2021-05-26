export function getArea(positions) {
  const a = positions[0];
  const b = positions[1];
  const c = positions[2];

  const ab = b.clone().sub(a);
  const ac = c.clone().sub(a);

  debugger;
  const re = (1 / 2) * ab.clone().cross(ac).length();
  return re;
}
