// generate random number in 0..1
type RNG = () => number;

export function *shortId(RNG: RNG, len = 13): Generator<string, void> {
  const CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';
  const N = CHARS.length;

  while (true) {
    let id = '';
    for (let i = 0; i < len; i++) {
      id += CHARS.charAt(RNG() * N | 0);
    }
    yield id;
  }
}

export function createRandomColor(RNG: RNG): string {
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
