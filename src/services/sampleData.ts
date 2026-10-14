import { PreviewDocument, defaultColorAdjustments } from '../types';

/**
 * Creates an initial sample image document with simulated camera EXIF and GPS metadata
 */
export function createSampleImageDocument(): PreviewDocument {
  // Generate a high-contrast scenic SVG converted to Data URL for instant rendering
  const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1a2a6c"/>
        <stop offset="50%" stop-color="#b21f1f"/>
        <stop offset="100%" stop-color="#fdbb2d"/>
      </linearGradient>
      <linearGradient id="sun" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff59d"/>
        <stop offset="100%" stop-color="#ffb74d"/>
      </linearGradient>
      <linearGradient id="mountain1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2d3436"/>
        <stop offset="100%" stop-color="#1e272e"/>
      </linearGradient>
      <linearGradient id="mountain2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#485460"/>
        <stop offset="100%" stop-color="#1e272e"/>
      </linearGradient>
      <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0984e3" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#00cec9" stop-opacity="0.9"/>
      </linearGradient>
    </defs>
    <!-- Sky -->
    <rect width="1600" height="700" fill="url(#sky)"/>
    <!-- Glowing Sun -->
    <circle cx="800" cy="400" r="120" fill="url(#sun)" filter="drop-shadow(0 0 40px #ffb74d)"/>
    <!-- Distant Mountains -->
    <polygon points="100,700 450,300 800,700" fill="url(#mountain2)" opacity="0.85"/>
    <polygon points="650,700 1050,250 1450,700" fill="url(#mountain2)" opacity="0.85"/>
    <!-- Foreground Mountains -->
    <polygon points="-50,700 300,380 650,700" fill="url(#mountain1)"/>
    <polygon points="900,700 1250,340 1650,700" fill="url(#mountain1)"/>
    <polygon points="400,700 800,420 1200,700" fill="#1e272e"/>
    <!-- Lake Water -->
    <rect y="700" width="1600" height="300" fill="url(#water)"/>
    <!-- Sun Reflection -->
    <ellipse cx="800" cy="780" rx="140" ry="25" fill="#fff59d" opacity="0.6"/>
    <ellipse cx="800" cy="840" rx="90" ry="15" fill="#fdbb2d" opacity="0.5"/>
    <ellipse cx="800" cy="900" rx="50" ry="8" fill="#ffb74d" opacity="0.4"/>
    <!-- Title Text -->
    <text x="800" y="160" font-family="-apple-system, sans-serif" font-size="44" font-weight="600" fill="#ffffff" text-anchor="middle" letter-spacing="2">YOSEMITE SUNSET — macOS PREVIEW REPLICA</text>
    <text x="800" y="210" font-family="-apple-system, sans-serif" font-size="20" fill="#ffffff" opacity="0.8" text-anchor="middle">Shot on Apple iPhone 16 Pro Max · 24mm f/1.78 ISO 50</text>
  </svg>`;

  const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sampleSvg)}`;

  return {
    id: 'sample-yosemite-image',
    name: 'Yosemite-Sunset-2026.heic',
    type: 'image',
    fileSizeBytes: 3482910, // ~3.3 MB
    filePath: '/Users/apple/Pictures/Yosemite-Sunset-2026.heic',
    url: svgDataUrl,
    pages: [
      {
        pageNumber: 1,
        width: 1600,
        height: 1000,
        rotation: 0,
        thumbnailUrl: svgDataUrl,
      },
    ],
    currentPageIndex: 0,
    zoom: 1.0,
    fitMode: 'fit',
    rotation: 0,
    colorAdjustments: { ...defaultColorAdjustments },
    annotations: [
      {
        id: 'ann-1',
        pageIndex: 0,
        type: 'rect',
        x: 650,
        y: 260,
        width: 300,
        height: 280,
        color: '#ff3b30',
        strokeWidth: 3,
        createdAt: Date.now() - 3600000,
      },
      {
        id: 'ann-2',
        pageIndex: 0,
        type: 'text',
        x: 660,
        y: 230,
        width: 200,
        height: 30,
        color: '#ff3b30',
        strokeWidth: 1,
        text: 'Peak Sun Alignment',
        fontSize: 18,
        fontFamily: 'Helvetica Neue',
        createdAt: Date.now() - 3600000,
      },
    ],
    metadata: {
      fileName: 'Yosemite-Sunset-2026.heic',
      fileSizeBytes: 3482910,
      format: 'HEIF / HEIC',
      dimensions: { width: 1600, height: 1000 },
      colorSpace: 'Display P3',
      resolutionDpi: 300,
      createdAt: '2026-10-12 18:42:15',
      modifiedAt: '2026-10-12 18:42:15',
      make: 'Apple',
      model: 'iPhone 16 Pro Max',
      lensModel: 'iPhone 16 Pro Max back triple camera 6.765mm f/1.78',
      exposureTime: '1/320s',
      fNumber: 'f/1.78',
      iso: 'ISO 50',
      focalLength: '24mm (equiv)',
      flash: 'Off, did not fire',
      meteringMode: 'Multi-segment',
      latitude: 37.7455,
      longitude: -119.5936,
      altitude: 1220.5,
    },
  };
}
