/**
 * WCAG 2.1 Relative Luminance and Contrast Ratio Utility
 */

export interface ContrastResult {
  ratio: number;
  formattedRatio: string;
  isAANormal: boolean;
  isAALarge: boolean;
  isAAANormal: boolean;
  isAAALarge: boolean;
}

/**
 * Converts a 3 or 6 digit hex color string into [r, g, b] numbers (0-255).
 */
export function hexToRgb(hex: string): [number, number, number] {
  const sanitized = hex.replace('#', '').trim();
  let r = 0, g = 0, b = 0;
  if (sanitized.length === 3) {
    r = parseInt(sanitized[0] + sanitized[0], 16);
    g = parseInt(sanitized[1] + sanitized[1], 16);
    b = parseInt(sanitized[2] + sanitized[2], 16);
  } else if (sanitized.length === 6) {
    r = parseInt(sanitized.slice(0, 2), 16);
    g = parseInt(sanitized.slice(2, 4), 16);
    b = parseInt(sanitized.slice(4, 6), 16);
  }
  return [r, g, b];
}

/**
 * Computes relative luminance of an sRGB color per WCAG 2.1 formula.
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [sR, sG, sB] = [r / 255, g / 255, b / 255].map((val) => {
    return val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
}

/**
 * Calculates the WCAG contrast ratio between two hex colors.
 */
export function calculateContrastRatio(hex1: string, hex2: string): ContrastResult {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);

  const l1 = getRelativeLuminance(r1, g1, b1);
  const l2 = getRelativeLuminance(r2, g2, b2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  const roundedRatio = Number(ratio.toFixed(2));

  return {
    ratio: roundedRatio,
    formattedRatio: `${ratio.toFixed(2)}:1`,
    isAANormal: ratio >= 4.5,
    isAALarge: ratio >= 3.0,
    isAAANormal: ratio >= 7.0,
    isAAALarge: ratio >= 4.5,
  };
}

export const BRAND_COLORS = {
  cream: '#FAFAF9',
  taupe: '#8A8580',
  taupeDark: '#57534E',
  taupeContrast: '#44403C',
  stone: '#D6D3D1',
  gold: '#818CF8',
  goldDark: '#4338CA',
  ink: '#111111',
  white: '#FFFFFF',
  black: '#000000',
};
