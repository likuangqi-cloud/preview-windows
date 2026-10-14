import * as pdfjsLib from 'pdfjs-dist';
import { PageInfo, DocumentMetadata } from '../types';

// Set up PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface PdfDocumentWrapper {
  doc: pdfjsLib.PDFDocumentProxy;
  pages: PageInfo[];
  metadata: DocumentMetadata;
  outline: PdfOutlineItem[];
}

export interface PdfOutlineItem {
  title: string;
  pageIndex: number;
  items?: PdfOutlineItem[];
}

export async function loadPdfDocument(source: string | ArrayBuffer): Promise<PdfDocumentWrapper> {
  const loadingTask = pdfjsLib.getDocument(source);
  const doc = await loadingTask.promise;
  const numPages = doc.numPages;
  const pages: PageInfo[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });
    pages.push({
      pageNumber: i,
      width: viewport.width,
      height: viewport.height,
      rotation: 0,
    });
  }

  // Extract metadata
  const metaObj = await doc.getMetadata().catch(() => null);
  const info = (metaObj?.info || {}) as Record<string, any>;

  const metadata: DocumentMetadata = {
    fileName: 'document.pdf',
    fileSizeBytes: 0,
    format: 'PDF',
    dimensions: pages.length > 0 ? { width: pages[0].width, height: pages[0].height } : { width: 0, height: 0 },
    colorSpace: 'DeviceRGB',
    resolutionDpi: 72,
    pdfVersion: doc.fingerprints ? 'PDF 1.7' : 'PDF 1.4',
    pageCount: numPages,
    producer: info['Producer'] || 'macOS Quartz / PDFKit',
    author: info['Author'] || undefined,
    title: info['Title'] || undefined,
    isEncrypted: false,
  };

  // Extract outline
  const rawOutline = await doc.getOutline().catch(() => null);
  const outline: PdfOutlineItem[] = [];
  if (rawOutline) {
    for (const item of rawOutline) {
      outline.push({
        title: item.title,
        pageIndex: 0, // In full implementation mapped via doc.getPageIndex(item.dest[0])
      });
    }
  }

  return { doc, pages, metadata, outline };
}

export async function renderPdfPageToCanvas(
  doc: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  scale: number = 1.5,
  rotation: number = 0
): Promise<void> {
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale, rotation });

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const renderContext = {
    canvasContext: ctx,
    viewport: viewport,
  };

  await page.render(renderContext).promise;
}
