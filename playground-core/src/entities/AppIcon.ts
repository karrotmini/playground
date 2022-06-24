import { encodeSVG } from '../utils';

export class AppIcon extends URL {
  get isRemote(): boolean {
    return this.protocol.startsWith('http');
  }

  static createFallbackSVG(props: {
    size: number,
    text: string,
    color: [string, string],
  }): AppIcon {
    const svg = AppIcon.fallbackSVGString(props);
    const encoded = encodeSVG(svg);
    const dataUri = `data:image/svg+xml,${encoded}`;
    return new AppIcon(dataUri);
  }

  static fallbackSVGString(props: {
    size: number,
    text: string,
    color: [string, string],
  }): string {
    const { size, color: [color1, color2] } = props;
    const fontSize = size * 0.6 | 0;
    const text = props.text[0].toUpperCase();
    const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <g>
    <defs>
      <linearGradient id="avatar" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${color1}"/>
        <stop offset="100%" stop-color="${color2}"/>
      </linearGradient>
    </defs>
    <rect fill="url(#avatar)" x="0" y="0" width="${size}" height="${size}"/>
    <text x="50%" y="50%" alignment-baseline="central" dominant-baseline="central" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="${fontSize}">${text}</text>
  </g>
</svg>
  `.trim();
    return svg;
  }
}
