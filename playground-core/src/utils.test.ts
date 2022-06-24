import { describe, expect } from 'vitest';

import { createRandomColor } from './utils';

describe('createRandomColor', test => {
  test('should generate hex color', () => {
    const expectedPattern = /^#[0-9A-F]{6}$/i;
    expect(createRandomColor(() => 0.01)).toMatch(expectedPattern);
    expect(createRandomColor(() => 0.50)).toMatch(expectedPattern);
    expect(createRandomColor(() => 0.99)).toMatch(expectedPattern);
  });
});
