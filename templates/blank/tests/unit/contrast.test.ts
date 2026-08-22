import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  getRelativeLuminance,
  calculateContrastRatio,
  BRAND_COLORS,
} from '../../src/utils/contrast';

describe('WCAG AA Color Contrast & Luminance Utility', () => {
  it('correctly converts 3-digit and 6-digit hex values to RGB', () => {
    expect(hexToRgb('#FFF')).toEqual([255, 255, 255]);
    expect(hexToRgb('#000')).toEqual([0, 0, 0]);
    expect(hexToRgb('#FAFAF9')).toEqual([250, 250, 249]);
    expect(hexToRgb('#111111')).toEqual([17, 17, 17]);
  });

  it('calculates relative luminance per WCAG 2.1 mathematical formulas', () => {
    const whiteLum = getRelativeLuminance(255, 255, 255);
    const blackLum = getRelativeLuminance(0, 0, 0);
    const creamLum = getRelativeLuminance(250, 250, 249);
    const inkLum = getRelativeLuminance(17, 17, 17);

    expect(whiteLum).toBeCloseTo(1.0, 3);
    expect(blackLum).toBeCloseTo(0.0, 3);
    expect(creamLum).toBeGreaterThan(0.8);
    expect(inkLum).toBeLessThan(0.05);
  });

  it('validates Ink on Cream achieves WCAG AAA compliance (>= 7.0:1)', () => {
    const result = calculateContrastRatio(BRAND_COLORS.ink, BRAND_COLORS.cream);
    expect(result.ratio).toBeGreaterThanOrEqual(10.0);
    expect(result.isAANormal).toBe(true);
    expect(result.isAALarge).toBe(true);
    expect(result.isAAANormal).toBe(true);
  });

  it('validates Taupe-Contrast (#44403C) on Cream achieves WCAG AA compliance (>= 4.5:1)', () => {
    const result = calculateContrastRatio(BRAND_COLORS.taupeContrast, BRAND_COLORS.cream);
    expect(result.ratio).toBeGreaterThanOrEqual(6.0);
    expect(result.isAANormal).toBe(true);
    expect(result.isAALarge).toBe(true);
  });

  it('validates Gold-Dark (#4338CA) on Cream achieves WCAG AA compliance (>= 4.5:1)', () => {
    const result = calculateContrastRatio(BRAND_COLORS.goldDark, BRAND_COLORS.cream);
    expect(result.ratio).toBeGreaterThanOrEqual(4.5);
    expect(result.isAANormal).toBe(true);
  });

  it('validates Gold (#818CF8) on Ink achieves WCAG AA compliance (>= 4.5:1)', () => {
    const result = calculateContrastRatio(BRAND_COLORS.gold, BRAND_COLORS.ink);
    expect(result.ratio).toBeGreaterThanOrEqual(6.0);
    expect(result.isAANormal).toBe(true);
    expect(result.isAALarge).toBe(true);
  });

  it('confirms that a lighter raw Taupe (#8A8580) fails WCAG AA normal text on Cream (< 4.5:1)', () => {
    const result = calculateContrastRatio(BRAND_COLORS.taupe, BRAND_COLORS.cream);
    expect(result.ratio).toBeLessThan(4.5);
    expect(result.isAANormal).toBe(false);
  });
});
