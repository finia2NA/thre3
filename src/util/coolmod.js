/**
 * A modulo that wraps around on negative numbers
 * @param {number} a
 * @param {number} n
 */
export default function coolmod(a, n) {
  if (a >= 0) return a % n;
  else return n - (-a % n);
}
