export interface PreprocessingOptions {
  grayscale: boolean;
  contrast: boolean;
  contrastIntensity: number; // 0-200
  noiseRemoval: boolean;
  sharpen: boolean;
  sharpenAmount: number; // 0.1-2.0
  deskew: boolean;
  binarize: boolean;
  binarizeThreshold: number; // 0-255, -1 = auto (Otsu's)
}

export const defaultPreprocessingOptions: PreprocessingOptions = {
  grayscale: true,
  contrast: true,
  contrastIntensity: 120,
  noiseRemoval: false,
  sharpen: true,
  sharpenAmount: 0.5,
  deskew: false,
  binarize: true,
  binarizeThreshold: -1, // Auto (Otsu's method)
};

/**
 * Otsu's Adaptive Thresholding
 * Automatically determines the optimal binarization threshold by maximizing
 * inter-class variance between foreground and background pixels.
 * Much better than fixed threshold for scanned PDFs with uneven lighting.
 */
export function otsuThreshold(imageData: ImageData): number {
  const histogram = new Array(256).fill(0);
  const data = imageData.data;
  const total = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    histogram[gray]++;
  }

  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * histogram[i];

  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let maxVariance = 0;
  let threshold = 128;

  for (let t = 0; t < 256; t++) {
    wB += histogram[t];
    if (wB === 0) continue;
    wF = total - wB;
    if (wF === 0) break;
    sumB += t * histogram[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const variance = wB * wF * (mB - mF) * (mB - mF);
    if (variance > maxVariance) {
      maxVariance = variance;
      threshold = t;
    }
  }

  return threshold;
}

/**
 * Contrast Enhancement - Histogram Stretching
 * Find min/max pixel values, stretch histogram to full 0-255 range,
 * apply intensity multiplier (0-200, 100=normal)
 */
export function enhanceContrast(imageData: ImageData, intensity: number): ImageData {
  const data = imageData.data;
  const len = data.length;
  let minVal = 255;
  let maxVal = 0;

  // Find min/max luminance values
  for (let i = 0; i < len; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (lum < minVal) minVal = lum;
    if (lum > maxVal) maxVal = lum;
  }

  const range = maxVal - minVal;
  if (range === 0) return imageData;

  const factor = (intensity / 100);

  for (let i = 0; i < len; i += 4) {
    for (let c = 0; c < 3; c++) {
      const stretched = ((data[i + c] - minVal) / range) * 255;
      const adjusted = 128 + (stretched - 128) * factor;
      data[i + c] = Math.max(0, Math.min(255, Math.round(adjusted)));
    }
  }

  return imageData;
}

/**
 * Grayscale Conversion
 * Use luminance formula: 0.299*R + 0.587*G + 0.114*B
 */
export function toGrayscale(imageData: ImageData): ImageData {
  const data = imageData.data;
  const len = data.length;

  for (let i = 0; i < len; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  return imageData;
}

/**
 * Noise Removal - Median Filter
 * 3x3 kernel default, sort neighborhood pixels, take median for each channel
 */
export function medianFilter(imageData: ImageData, kernelSize: number = 3): ImageData {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data);
  const half = Math.floor(kernelSize / 2);

  for (let y = half; y < height - half; y++) {
    for (let x = half; x < width - half; x++) {
      for (let c = 0; c < 3; c++) {
        const neighbors: number[] = [];
        for (let ky = -half; ky <= half; ky++) {
          for (let kx = -half; kx <= half; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            neighbors.push(data[idx]);
          }
        }
        neighbors.sort((a, b) => a - b);
        const medianIdx = Math.floor(neighbors.length / 2);
        output[(y * width + x) * 4 + c] = neighbors[medianIdx];
      }
    }
  }

  return new ImageData(output, width, height);
}

/**
 * Unsharp Mask Sharpening
 * Applies a 3x3 sharpening convolution kernel to enhance text edges.
 * Amount controls sharpening intensity (0.1 = subtle, 2.0 = aggressive).
 * Applied before binarization to improve text edge definition for OCR.
 */
export function sharpenImage(imageData: ImageData, amount: number = 0.5): ImageData {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data);

  const k = amount;
  const kernel = [
    0, -k, 0,
    -k, 1 + 4 * k, -k,
    0, -k, 0,
  ];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let val = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            const ki = (ky + 1) * 3 + (kx + 1);
            val += data[idx] * kernel[ki];
          }
        }
        output[(y * width + x) * 4 + c] = Math.max(0, Math.min(255, Math.round(val)));
      }
    }
  }

  return new ImageData(output, width, height);
}

/**
 * Deskew - Projection Profile
 * Binarize first, compute horizontal projection at angles -15 to +15 (0.5 degree steps)
 * Find angle with maximum variance in projection, return angle in degrees
 */
export function detectSkewAngle(imageData: ImageData): number {
  const { width, height, data } = imageData;

  // Create binary array (1 = dark pixel, 0 = light)
  const binary: number[] = new Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
    binary[i] = lum < 128 ? 1 : 0;
  }

  let bestAngle = 0;
  let bestVariance = 0;

  for (let angleDeg = -15; angleDeg <= 15; angleDeg += 0.5) {
    const angleRad = (angleDeg * Math.PI) / 180;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);
    const projection: number[] = new Array(height).fill(0);

    const cx = width / 2;
    const cy = height / 2;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (binary[y * width + x] === 1) {
          const rotY = Math.round(-sinA * (x - cx) + cosA * (y - cy) + cy);
          if (rotY >= 0 && rotY < height) {
            projection[rotY]++;
          }
        }
      }
    }

    const mean = projection.reduce((s, v) => s + v, 0) / height;
    const variance = projection.reduce((s, v) => s + (v - mean) * (v - mean), 0) / height;

    if (variance > bestVariance) {
      bestVariance = variance;
      bestAngle = angleDeg;
    }
  }

  return bestAngle;
}

/**
 * Deskew Image
 * Create new canvas, rotate by -angle, draw image
 */
export function deskewImage(canvas: HTMLCanvasElement, angle: number): HTMLCanvasElement {
  if (Math.abs(angle) < 0.1) return canvas;

  const angleRad = (-angle * Math.PI) / 180;
  const newCanvas = document.createElement('canvas');
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height;
  const ctx = newCanvas.getContext('2d')!;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(angleRad);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

  return newCanvas;
}

/**
 * Binarize - Threshold
 * Convert each pixel to black (0) or white (255) based on threshold.
 * When threshold is -1, automatically determines optimal threshold using Otsu's method.
 */
export function binarizeImage(imageData: ImageData, threshold: number): ImageData {
  const effectiveThreshold = threshold < 0 ? otsuThreshold(imageData) : threshold;

  const data = imageData.data;
  const len = data.length;

  for (let i = 0; i < len; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const val = lum >= effectiveThreshold ? 255 : 0;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
  }

  return imageData;
}

/**
 * Apply all enabled preprocessing to a canvas
 * Pipeline order: Grayscale -> Contrast -> Noise Removal -> Sharpen -> Deskew -> Binarize
 */
export function applyPreprocessing(
  sourceCanvas: HTMLCanvasElement,
  options: PreprocessingOptions
): HTMLCanvasElement {
  let canvas = document.createElement('canvas');
  canvas.width = sourceCanvas.width;
  canvas.height = sourceCanvas.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(sourceCanvas, 0, 0);

  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // 1. Grayscale
  if (options.grayscale) {
    imageData = toGrayscale(imageData);
  }

  // 2. Contrast Enhancement
  if (options.contrast) {
    imageData = enhanceContrast(imageData, options.contrastIntensity);
  }

  // 3. Noise Removal
  if (options.noiseRemoval) {
    imageData = medianFilter(imageData);
  }

  // 4. Sharpen (after noise removal, before binarization)
  if (options.sharpen) {
    imageData = sharpenImage(imageData, options.sharpenAmount);
  }

  // Write back before deskew (deskew operates on canvas)
  ctx.putImageData(imageData, 0, 0);

  // 5. Deskew
  if (options.deskew) {
    const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const angle = detectSkewAngle(currentData);
    if (Math.abs(angle) > 0.1) {
      canvas = deskewImage(canvas, angle);
      const newCtx = canvas.getContext('2d')!;
      imageData = newCtx.getImageData(0, 0, canvas.width, canvas.height);
    } else {
      imageData = currentData;
    }
  } else {
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  // 6. Binarize (apply last)
  if (options.binarize) {
    imageData = binarizeImage(imageData, options.binarizeThreshold);
  }

  // Final write
  const finalCtx = canvas.getContext('2d')!;
  finalCtx.putImageData(imageData, 0, 0);

  return canvas;
}
