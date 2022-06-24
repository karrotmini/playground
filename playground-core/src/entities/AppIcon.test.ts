/* eslint-env node */

import { describe, expect } from 'vitest';

import { AppIcon } from '../entities';

describe('AppIcon', test => {
  test('fallbackSVG should be valid data URI', async () => {
    const fallbackSVG = AppIcon.createFallbackSVG({
      size: 100,
      text: 'test',
      color: ['#000000', '#ffffff'],
    });
    expect(() => new URL(fallbackSVG)).not.toThrow();
    expect(fallbackSVG.protocol).toEqual('data:');
    expect(fallbackSVG.pathname).toMatch('image/svg+xml,');
  });
});
