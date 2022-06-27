export function generateShortId(n = 13) {
  const CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';
  const N = CHARS.length;

  let id = '';
  for (let i = 0; i < n; i++) {
    id += CHARS.charAt(Math.random() * N | 0);
  }
  return id;
}
