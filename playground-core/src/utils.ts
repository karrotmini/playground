export function generateShortId(n = 13) {
  const CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';
  const N = CHARS.length;

  let id = '';
  for (let i = 0; i < n; i++) {
    id += CHARS.charAt(Math.random() * N | 0);
  }
  return id;
}

export function createRandomColor(RNG: () => number): string {
  const letters = '0123456789abcdef';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[RNG() * 16 | 0];
  }
  return color;
}

export function encodeSVG(data: string): string {
  data = data.replace(/"/g, '\'');
  data = data.replace(/>\s{1,}</g, '><');
  data = data.replace(/\s{2,}/g, ' ');
  return data.replace(/[\r\n%#()<>?[\\\]^`{|}]/g, encodeURIComponent);
}
