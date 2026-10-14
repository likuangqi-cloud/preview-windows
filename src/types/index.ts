export type DocumentType = 'image' | 'pdf' | 'none';

export interface PageInfo {
  pageNumber: number;
  width: number;
  height: number;
  thumbnailUrl?: string;
  rotation: number; // 0, 90, 180, 270
}

export interface PreviewDocument {
  id: string;
  name: string;
  type: DocumentType;
  fileSizeBytes: number;
  filePath?: string;
  url: string;
  pages: PageInfo[];
  currentPageIndex: number;
  zoom: number; // 1.0 = 100%
  fitMode: 'fit' | 'actual' | 'custom';
  rotation: number; // 0, 90, 180, 270
  colorAdjustments: ColorAdjustments;
  annotations: AnnotationItem[];
  metadata?: DocumentMetadata;
}

export interface ColorAdjustments {
  exposure: number;    // -100 to 100
  contrast: number;    // -100 to 100
  highlights: number;  // -100 to 100
  shadows: number;     // -100 to 100
  saturation: number;  // -100 to 100
  temperature: number; // -100 to 100 (warm/cool)
  tint: number;        // -100 to 100 (green/magenta)
  sepia: number;       // 0 to 100
  sharpness: number;   // 0 to 100
}

export const defaultColorAdjustments: ColorAdjustments = {
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  saturation: 0,
  temperature: 0,
  tint: 0,
  sepia: 0,
  sharpness: 0,
};

export type AnnotationType =
  | 'text'
  | 'rect'
  | 'circle'
  | 'line'
  | 'arrow'
  | 'freehand'
  | 'highlight'
  | 'signature'
  | 'note';

export interface AnnotationItem {
  id: string;
  pageIndex: number;
  type: AnnotationType;
  x: number;
  y: number;
  width: number;
  height: number;
  points?: { x: number; y: number }[]; // For freehand/line/arrow
  color: string;
  fillColor?: string;
  strokeWidth: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  createdAt: number;
}

export interface DocumentMetadata {
  fileName: string;
  fileSizeBytes: number;
  format: string;
  dimensions: { width: number; height: number };
  colorSpace: string;
  resolutionDpi: number;
  createdAt?: string;
  modifiedAt?: string;
  // Exif
  make?: string;
  model?: string;
  lensModel?: string;
  exposureTime?: string;
  fNumber?: string;
  iso?: string;
  focalLength?: string;
  flash?: string;
  meteringMode?: string;
  // GPS
  latitude?: number;
  longitude?: number;
  altitude?: number;
  // PDF
  pdfVersion?: string;
  pageCount?: number;
  producer?: string;
  isEncrypted?: boolean;
  author?: string;
  title?: string;
}

export type SidebarTab = 'thumbnails' | 'outline' | 'highlights' | 'bookmarks' | 'search';

export type ActiveTool =
  | 'select'
  | 'marquee'
  | 'loupe'
  | 'sketch'
  | 'rect'
  | 'circle'
  | 'arrow'
  | 'line'
  | 'text'
  | 'signature'
  | 'highlight'
  | 'note';
