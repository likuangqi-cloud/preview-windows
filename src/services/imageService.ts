import { ColorAdjustments } from '../types';

export interface HistogramData {
  r: number[];
  g: number[];
  b: number[];
  lum: number[];
}

/**
 * Calculates a 256-bucket RGB and Luminance histogram from an image element or canvas.
 */
export function computeHistogram(source: HTMLImageElement | HTMLCanvasElement): HistogramData {
  const canvas = document.createElement('canvas');
  const maxDim = 300; // Downsample for real-time responsiveness
  const scale = Math.min(1, maxDim / Math.max(source.width, source.height));
  canvas.width = Math.max(1, Math.floor(source.width * scale));
  canvas.height = Math.max(1, Math.floor(source.height * scale));

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { r: new Array(256).fill(0), g: new Array(256).fill(0), b: new Array(256).fill(0), lum: new Array(256).fill(0) };
  }

  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  const r = new Array(256).fill(0);
  const g = new Array(256).fill(0);
  const b = new Array(256).fill(0);
  const lum = new Array(256).fill(0);

  for (let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];
    const l = Math.round(0.299 * red + 0.587 * green + 0.114 * blue);

    r[red]++;
    g[green]++;
    b[blue]++;
    lum[l]++;
  }

  return { r, g, b, lum };
}

/**
 * Generates CSS filter string for real-time preview of adjustments
 */
export function getCssFilterString(adj: ColorAdjustments): string {
  const brightness = 1 + adj.exposure / 100;
  const contrast = 1 + adj.contrast / 100;
  const saturate = Math.max(0, 1 + adj.saturation / 100);
  const sepia = adj.sepia / 100;
  const hueRotate = adj.tint * 0.5; // degrees

  return `brightness(${brightness}) contrast(${contrast}) saturate(${saturate}) sepia(${sepia}) hue-rotate(${hueRotate}deg)`;
}

/**
 * Applies full pixel-level adjustments to an image source and renders to target canvas
 */
export function renderAdjustedImage(
  source: HTMLImageElement | HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement,
  adj: ColorAdjustments
) {
  targetCanvas.width = source.width;
  targetCanvas.height = source.height;
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  // Use hardware-accelerated canvas filter
  ctx.filter = getCssFilterString(adj);
  ctx.drawImage(source, 0, 0);
  ctx.filter = 'none';
}

/**
 * Resizes an image canvas using high-quality bi-cubic / lanczos resampling
 */
export function resizeCanvas(
  sourceCanvas: HTMLCanvasElement,
  newWidth: number,
  newHeight: number
): HTMLCanvasElement {
  const result = document.createElement('canvas');
  result.width = newWidth;
  result.height = newHeight;
  const ctx = result.getContext('2d');
  if (!ctx) return result;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(sourceCanvas, 0, 0, newWidth, newHeight);
  return result;
}

/**
 * Rotates an image canvas by 90, 180, 270 degrees
 */
export function rotateCanvas(source: HTMLCanvasElement, degrees: number): HTMLCanvasElement {
  const normalized = ((degrees % 360) + 360) % 360;
  const result = document.createElement('canvas');
  const ctx = result.getContext('2d');
  if (!ctx) return result;

  if (normalized === 90 || normalized === 270) {
    result.width = source.height;
    result.height = source.width;
  } else {
    result.width = source.width;
    result.height = source.height;
  }

  ctx.translate(result.width / 2, result.height / 2);
  ctx.rotate((normalized * Math.PI) / 180);
  ctx.drawImage(source, -source.width / 2, -source.height / 2);

  return result;
}

/**
 * Flips an image canvas horizontally or vertically
 */
export function flipCanvas(source: HTMLCanvasElement, horizontal: boolean): HTMLCanvasElement {
  const result = document.createElement('canvas');
  result.width = source.width;
  result.height = source.height;
  const ctx = result.getContext('2d');
  if (!ctx) return result;

  ctx.save();
  if (horizontal) {
    ctx.scale(-1, 1);
    ctx.drawImage(source, -source.width, 0);
  } else {
    ctx.scale(1, -1);
    ctx.drawImage(source, 0, -source.height);
  }
  ctx.restore();
  return result;
}
