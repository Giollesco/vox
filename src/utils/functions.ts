/**
 * Generates a random integer between `n` and `-n` (inclusive).
 *
 * @param n - The positive integer defining the range.
 * @returns A random integer between `n` and `-n`.
 *
 * @example
 * ```typescript
 * const result = getRandomBetween(10);
 * // result will be a random integer between -10 and 10
 * ```
 */
export function getRandomBetween(n: number): number {
  return Math.floor(Math.random() * (2 * n + 1)) - n;
}

//? CONTRAST COLOR FROM HSL ============================================================================================================================

/**
 * Represents a color in HSL (Hue, Saturation, Lightness) format.
 * @interface
 */
interface HSLColor {
  h: number; // Hue (0-360)
  s: number; // Saturation (0-100)
  l: number; // Lightness (0-100)
}

/**
 * Converts an HSL color to RGB format.
 * @param {HSLColor} hsl - The HSL color to convert.
 * @returns {[number, number, number]} An array containing the RGB values.
 */
const hslToRgb = (hsl: HSLColor): [number, number, number] => {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // Achromatic (grey)
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

/**
 * Converts a hex color string to RGB format.
 * @param {string} hexColorString - The hex color string (e.g., "#RRGGBB").
 * @returns {[number, number, number]} An array containing the RGB values.
 */
const hexToRgb = (hexColorString: string): [number, number, number] => {
  const hex = hexColorString.replace(/^#/, '');

  if (hex.length === 3) {
    // Handle shorthand hex format (e.g., "#RGB")
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return [r, g, b];
  } else if (hex.length === 6) {
    // Handle standard hex format (e.g., "#RRGGBB")
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return [r, g, b];
  }

  throw new Error('Invalid hex color format');
};

/**
 * Gets the contrast color (black or white) from a color string (either HSL or hex format).
 * @param {string} colorString - The color string (e.g., "hsl(137, 67%, 47%)" or "#RRGGBB").
 * @returns {"black" | "white"} The contrast color, either 'black' or 'white'.
 */
export const getContrastColor = (colorString: string): 'black' | 'white' => {
  if (colorString.startsWith('hsl(')) {
    // Extract the HSL values from the string using regular expressions
    const hslRegex = /hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/;
    const match = colorString.match(hslRegex);

    if (!match) {
      throw new Error('Invalid HSL color format');
    }

    const hslColor: HSLColor = {
      h: parseInt(match[1]),
      s: parseInt(match[2]),
      l: parseInt(match[3]),
    };

    const [r, g, b] = hslToRgb(hslColor);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? 'black' : 'white';
  } else if (colorString.startsWith('#')) {
    const [r, g, b] = hexToRgb(colorString);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? 'black' : 'white';
  }

  throw new Error('Unsupported color format');
};

//? CONTRAST COLOR FROM HSL ============================================================================================================================

export const getCurrentDate = () => {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
  const year = today.getFullYear();

  return `${day}.${month}.${year}`;
};
