/**
 * Color Utilities
 *
 * Provides color manipulation utilities for the visualization engine.
 *
 * @version 1.0.0
 */

/**
 * RGB color
 */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * HSL color
 */
export interface HSL {
  h: number;
  s: number;
  l: number;
}

/**
 * Color utilities
 */
export const colorUtils = {
  /**
   * Convert hex color to RGB
   * @param hex - Hex color string
   * @returns RGB color
   */
  hexToRgb(hex: string): RGB {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    return { r, g, b };
  },
  
  /**
   * Convert RGB color to hex
   * @param rgb - RGB color
   * @returns Hex color string
   */
  rgbToHex(rgb: RGB): string {
    // Convert to 0-255 range
    const r = Math.round(rgb.r * 255);
    const g = Math.round(rgb.g * 255);
    const b = Math.round(rgb.b * 255);
    
    // Convert to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },
  
  /**
   * Convert RGB color to HSL
   * @param rgb - RGB color
   * @returns HSL color
   */
  rgbToHsl(rgb: RGB): HSL {
    const r = rgb.r;
    const g = rgb.g;
    const b = rgb.b;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      
      h /= 6;
    }
    
    return { h, s, l };
  },  
  /**
   * Convert HSL color to RGB
   * @param hsl - HSL color
   * @returns RGB color
   */
  hslToRgb(hsl: HSL): RGB {
    const h = hsl.h;
    const s = hsl.s;
    const l = hsl.l;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
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
    
    return { r, g, b };
  },
  
  /**
   * Interpolate between two colors
   * @param color1 - First color
   * @param color2 - Second color
   * @param t - Interpolation factor (0-1)
   * @returns Interpolated color
   */
  interpolate(color1: RGB, color2: RGB, t: number): RGB {
    return {
      r: color1.r + (color2.r - color1.r) * t,
      g: color1.g + (color2.g - color1.g) * t,
      b: color1.b + (color2.b - color1.b) * t,
    };
  },
  
  /**
   * Generate a color palette
   * @param baseColor - Base color
   * @param count - Number of colors
   * @param variation - Color variation (0-1)
   * @returns Color palette
   */
  generatePalette(baseColor: RGB, count: number, variation: number = 0.2): RGB[] {
    const palette: RGB[] = [];
    const baseHsl = this.rgbToHsl(baseColor);
    
    for (let i = 0; i < count; i++) {
      // Vary hue, saturation, and lightness
      const hue = (baseHsl.h + (i / count) * variation * 2) % 1;
      const saturation = Math.min(1, Math.max(0, baseHsl.s + (Math.random() - 0.5) * variation));
      const lightness = Math.min(0.9, Math.max(0.1, baseHsl.l + (Math.random() - 0.5) * variation));
      
      // Convert back to RGB
      const rgb = this.hslToRgb({ h: hue, s: saturation, l: lightness });
      
      palette.push(rgb);
    }
    
    return palette;
  },  
  /**
   * Generate a gradient palette
   * @param startColor - Start color
   * @param endColor - End color
   * @param count - Number of colors
   * @returns Gradient palette
   */
  generateGradient(startColor: RGB, endColor: RGB, count: number): RGB[] {
    const palette: RGB[] = [];
    
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      palette.push(this.interpolate(startColor, endColor, t));
    }
    
    return palette;
  },
  
  /**
   * Generate a rainbow palette
   * @param count - Number of colors
   * @param saturation - Saturation (0-1)
   * @param lightness - Lightness (0-1)
   * @returns Rainbow palette
   */
  generateRainbow(count: number, saturation: number = 0.8, lightness: number = 0.5): RGB[] {
    const palette: RGB[] = [];
    
    for (let i = 0; i < count; i++) {
      const hue = i / count;
      palette.push(this.hslToRgb({ h: hue, s: saturation, l: lightness }));
    }
    
    return palette;
  },
  
  /**
   * Generate a quantum palette
   * @param count - Number of colors
   * @returns Quantum palette
   */
  generateQuantumPalette(count: number): RGB[] {
    // Quantum-inspired color palette
    const baseColors: RGB[] = [
      { r: 0.2, g: 0.4, b: 0.8 }, // Blue
      { r: 0.8, g: 0.2, b: 0.8 }, // Purple
      { r: 0.2, g: 0.8, b: 0.8 }, // Cyan
      { r: 0.8, g: 0.4, b: 0.2 }, // Orange
      { r: 0.2, g: 0.8, b: 0.4 }, // Green
    ];
    
    const palette: RGB[] = [];
    
    for (let i = 0; i < count; i++) {
      const baseIndex = i % baseColors.length;
      const nextIndex = (baseIndex + 1) % baseColors.length;
      const t = (i % (count / baseColors.length)) / (count / baseColors.length);
      
      palette.push(this.interpolate(baseColors[baseIndex], baseColors[nextIndex], t));
    }
    
    return palette;
  },
  
  /**
   * Convert temperature to RGB color
   * @param temperature - Temperature in Kelvin
   * @returns RGB color
   */
  temperatureToRgb(temperature: number): RGB {
    // Approximate RGB values for star temperature
    // Based on blackbody radiation
    
    let r, g, b;
    
    // Normalize temperature
    const temp = temperature / 100;
    
    // Calculate red component
    if (temp <= 66) {
      r = 1;
    } else {
      r = temp - 60;
      r = 329.698727446 * Math.pow(r, -0.1332047592);
      r = Math.max(0, Math.min(1, r / 255));
    }
    
    // Calculate green component
    if (temp <= 66) {
      g = temp;
      g = 99.4708025861 * Math.log(g) - 161.1195681661;
      g = Math.max(0, Math.min(1, g / 255));
    } else {
      g = temp - 60;
      g = 288.1221695283 * Math.pow(g, -0.0755148492);
      g = Math.max(0, Math.min(1, g / 255));
    }
    
    // Calculate blue component
    if (temp >= 66) {
      b = 1;
    } else if (temp <= 19) {
      b = 0;
    } else {
      b = temp - 10;
      b = 138.5177312231 * Math.log(b) - 305.0447927307;
      b = Math.max(0, Math.min(1, b / 255));
    }
    
    return { r, g, b };
  },
};