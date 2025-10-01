export interface RGB {
    r: number;
    g: number;
    b: number;
  }
  
  export function getAverageRGB(imgEl: HTMLImageElement): RGB {
    const blockSize = 5; // only visit every 5 pixels
    const defaultRGB: RGB = { r: 0, g: 0, b: 0 }; // for non-supporting envs
    const canvas = document.createElement('canvas');
    const context = canvas.getContext && canvas.getContext('2d');
    let data: ImageData;
    let i = -4;
    const rgb: RGB = { r: 0, g: 0, b: 0 };
    let count = 0;
  
    if (!context) {
      console.info('no context');
      return defaultRGB;
    }
  
    const height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    const width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
  
    context.drawImage(imgEl, 0, 0);
  
    try {
      data = context.getImageData(0, 0, width, height);
    } catch (e) {
      /* security error, img on diff domain */
      console.log(e);
      return defaultRGB;
    }
  
    const length = data.data.length;
  
    while ((i += blockSize * 4) < length) {
      ++count;
      rgb.r += data.data[i];
      rgb.g += data.data[i + 1];
      rgb.b += data.data[i + 2];
    }
  
    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);
  
    return rgb;
  }

// Additional interfaces for color formats
export interface HSL {
  h: number; // hue (0-360)
  s: number; // saturation (0-100)
  l: number; // lightness (0-100)
}

export interface HSV {
  h: number; // hue (0-360)
  s: number; // saturation (0-100)
  v: number; // value/brightness (0-100)
}

// Random color generation functions

/**
 * Generate a completely random RGB color
 */
export function randomRGB(): RGB {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256)
  };
}

/**
 * Generate a random color in hexadecimal format
 */
export function randomHex(): string {
  const rgb = randomRGB();
  return rgbToHex(rgb);
}

/**
 * Generate a random HSL color
 */
export function randomHSL(): HSL {
  return {
    h: Math.floor(Math.random() * 361), // 0-360
    s: Math.floor(Math.random() * 101), // 0-100
    l: Math.floor(Math.random() * 101)  // 0-100
  };
}

/**
 * Generate a random pastel color (high lightness, medium saturation)
 */
export function randomPastel(): HSL {
  return {
    h: Math.floor(Math.random() * 361),
    s: 40 + Math.floor(Math.random() * 31), // 40-70% saturation
    l: 70 + Math.floor(Math.random() * 21)  // 70-90% lightness
  };
}

/**
 * Generate a random vibrant color (high saturation)
 */
export function randomVibrant(): HSL {
  return {
    h: Math.floor(Math.random() * 361),
    s: 70 + Math.floor(Math.random() * 31), // 70-100% saturation
    l: 40 + Math.floor(Math.random() * 31)  // 40-70% lightness
  };
}

/**
 * Generate a random dark color (low lightness)
 */
export function randomDark(): HSL {
  return {
    h: Math.floor(Math.random() * 361),
    s: 30 + Math.floor(Math.random() * 71), // 30-100% saturation
    l: 10 + Math.floor(Math.random() * 31)  // 10-40% lightness
  };
}

/**
 * Generate a random color within a specific hue range
 */
export function randomHueRange(minHue: number, maxHue: number): HSL {
  const hueRange = maxHue - minHue;
  return {
    h: minHue + Math.floor(Math.random() * hueRange),
    s: Math.floor(Math.random() * 101),
    l: Math.floor(Math.random() * 101)
  };
}

/**
 * Generate random warm colors (reds, oranges, yellows)
 */
export function randomWarm(): HSL {
  // Warm hues: 0-60 (red to yellow) or 300-360 (purple-red to red)
  const ranges = [
    { min: 0, max: 60 },
    { min: 300, max: 360 }
  ];
  const range = ranges[Math.floor(Math.random() * ranges.length)];
  return randomHueRange(range.min, range.max);
}

/**
 * Generate random cool colors (blues, greens, purples)
 */
export function randomCool(): HSL {
  // Cool hues: 120-300 (green to blue to purple)
  return randomHueRange(120, 300);
}

/**
 * Generate a random grayscale color
 */
export function randomGrayscale(): RGB {
  const value = Math.floor(Math.random() * 256);
  return { r: value, g: value, b: value };
}

/**
 * Generate a color palette with specified number of colors
 */
export function generateColorPalette(count: number, type: 'random' | 'pastel' | 'vibrant' | 'warm' | 'cool' = 'random'): HSL[] {
  const colors: HSL[] = [];
  for (let i = 0; i < count; i++) {
    switch (type) {
      case 'pastel':
        colors.push(randomPastel());
        break;
      case 'vibrant':
        colors.push(randomVibrant());
        break;
      case 'warm':
        colors.push(randomWarm());
        break;
      case 'cool':
        colors.push(randomCool());
        break;
      default:
        colors.push(randomHSL());
    }
  }
  return colors;
}

/**
 * Generate harmonious color palette using complementary colors
 */
export function generateComplementaryPalette(baseHue: number, count: number = 5): HSL[] {
  const colors: HSL[] = [];
  const complement = (baseHue + 180) % 360;
  
  for (let i = 0; i < count; i++) {
    const hue = i % 2 === 0 ? baseHue : complement;
    const variation = (Math.random() - 0.5) * 30; // ±15 degree variation
    colors.push({
      h: (hue + variation + 360) % 360,
      s: 60 + Math.random() * 40, // 60-100%
      l: 40 + Math.random() * 40  // 40-80%
    });
  }
  return colors;
}

/**
 * Generate analogous color palette (adjacent hues)
 */
export function generateAnalogousPalette(baseHue: number, count: number = 5): HSL[] {
  const colors: HSL[] = [];
  const spread = 30; // degrees
  
  for (let i = 0; i < count; i++) {
    const hueOffset = (i - Math.floor(count / 2)) * (spread / count);
    colors.push({
      h: (baseHue + hueOffset + 360) % 360,
      s: 50 + Math.random() * 40, // 50-90%
      l: 40 + Math.random() * 40  // 40-80%
    });
  }
  return colors;
}

// Color conversion utilities

/**
 * Convert RGB to hexadecimal
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Convert hexadecimal to RGB
 */
export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  const hueToRgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  if (s === 0) {
    // Achromatic (gray)
    const value = Math.round(l * 255);
    return { r: value, g: value, b: value };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hueToRgb(p, q, h + 1/3) * 255),
    g: Math.round(hueToRgb(p, q, h) * 255),
    b: Math.round(hueToRgb(p, q, h - 1/3) * 255)
  };
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const sum = max + min;
  const l = sum / 2;

  if (diff === 0) {
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  const s = l > 0.5 ? diff / (2 - sum) : diff / sum;

  let h = 0;
  switch (max) {
    case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
    case g: h = (b - r) / diff + 2; break;
    case b: h = (r - g) / diff + 4; break;
  }
  h /= 6;

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Convert HSL to CSS string
 */
export function hslToString(hsl: HSL): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

/**
 * Convert RGB to CSS string
 */
export function rgbToString(rgb: RGB): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

/**
 * Generate a random color with transparency
 */
export function randomRGBA(alpha: number = Math.random()): string {
  const rgb = randomRGB();
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

/**
 * Generate a random gradient (linear)
 */
export function randomGradient(direction: string = '45deg'): string {
  const color1 = randomHex();
  const color2 = randomHex();
  return `linear-gradient(${direction}, ${color1}, ${color2})`;
}

/**
 * Generate a random gradient with multiple stops
 */
export function randomMultiGradient(stops: number = 3, direction: string = '45deg'): string {
  const colors = Array.from({ length: stops }, () => randomHex());
  return `linear-gradient(${direction}, ${colors.join(', ')})`;
}

export const addAlphaToColor = (color: string | null, alpha: number): string => {
  if (!color) return '';
  if (color.startsWith('rgba')) {
    return color;
  }
  const rgb = hexToRgb(color);
  if (!rgb) {
    return color;
  }
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}