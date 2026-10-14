import React, { useState, useEffect, useRef } from 'react';
import { WindowHeader } from './components/WindowHeader';
import { Sidebar } from './components/Sidebar';
import { MarkupToolbar } from './components/MarkupToolbar';
import { CanvasView } from './components/CanvasView';
import { AdjustColorModal } from './components/AdjustColorModal';
import { DocumentSizingModal } from './components/DocumentSizingModal';
import { InspectorWindow } from './components/InspectorWindow';
import { ExportModal } from './components/ExportModal';
import {
  PreviewDocument,
  SidebarTab,
  ActiveTool,
  AnnotationItem,
  ColorAdjustments,
} from './types';
import { createSampleImageDocument } from './services/sampleData';
import { computeHistogram, HistogramData } from './services/imageService';
import { loadPdfDocument } from './services/pdfService';

export const App: React.FC = () => {
  const [doc, setDoc] = useState<PreviewDocument | null>(() => createSampleImageDocument());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('thumbnails');
  const [markupActive, setMarkupActive] = useState(false);
  const [adjustColorOpen, setAdjustColorOpen] = useState(false);
  const [sizingOpen, setSizingOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [loupeActive, setLoupeActive] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Markup tool settings
  const [activeTool, setActiveTool] = useState<ActiveTool>('select');
  const [strokeColor, setStrokeColor] = useState('#ff3b30');
  const [fillColor, setFillColor] = useState('transparent');
  const [strokeWidth, setStrokeWidth] = useState(2);

  // Histogram
  const [histogram, setHistogram] = useState<HistogramData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute histogram when document changes
  useEffect(() => {
    if (!doc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = doc.url;
    img.onload = () => {
      setHistogram(computeHistogram(img));
    };
  }, [doc?.url, doc?.colorAdjustments]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmd = e.metaKey || e.ctrlKey;
      if (!isCmd) return;

      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        handleZoomActual();
      } else if (e.key === '9') {
        e.preventDefault();
        handleZoomFit();
      } else if (e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleRotateCcw();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleRotateCw();
      } else if (e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setInspectorOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'c' && e.altKey) {
        e.preventDefault();
        setAdjustColorOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'a' && e.shiftKey) {
        e.preventDefault();
        setMarkupActive((prev) => !prev);
      } else if (e.key.toLowerCase() === 'o') {
        e.preventDefault();
        fileInputRef.current?.click();
      } else if (e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setExportOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Zoom handlers
  const handleZoomIn = () => {
    setDoc((prev) => (prev ? { ...prev, zoom: Math.min(5.0, prev.zoom + 0.25) } : null));
  };
  const handleZoomOut = () => {
    setDoc((prev) => (prev ? { ...prev, zoom: Math.max(0.1, prev.zoom - 0.25) } : null));
  };
  const handleZoomActual = () => {
    setDoc((prev) => (prev ? { ...prev, zoom: 1.0, fitMode: 'actual' } : null));
  };
  const handleZoomFit = () => {
    setDoc((prev) => (prev ? { ...prev, zoom: 0.8, fitMode: 'fit' } : null));
  };

  // Rotate handlers
  const handleRotateCcw = () => {
    setDoc((prev) => (prev ? { ...prev, rotation: (prev.rotation - 90 + 360) % 360 } : null));
  };
  const handleRotateCw = () => {
    setDoc((prev) => (prev ? { ...prev, rotation: (prev.rotation + 90) % 360 } : null));
  };

  // Page Navigation
  const handlePrevPage = () => {
    setDoc((prev) =>
      prev ? { ...prev, currentPageIndex: Math.max(0, prev.currentPageIndex - 1) } : null
    );
  };
  const handleNextPage = () => {
    setDoc((prev) =>
      prev
        ? { ...prev, currentPageIndex: Math.min(prev.pages.length - 1, prev.currentPageIndex + 1) }
        : null
    );
  };
  const handleSelectPage = (index: number) => {
    setDoc((prev) => (prev ? { ...prev, currentPageIndex: index } : null));
  };
  const handleRotateSinglePage = (index: number) => {
    setDoc((prev) => {
      if (!prev) return null;
      const updatedPages = [...prev.pages];
      updatedPages[index] = {
        ...updatedPages[index],
        rotation: (updatedPages[index].rotation + 90) % 360,
      };
      return { ...prev, pages: updatedPages };
    });
  };
  const handleDeletePage = (index: number) => {
    setDoc((prev) => {
      if (!prev || prev.pages.length <= 1) return prev;
      const updatedPages = prev.pages.filter((_, idx) => idx !== index);
      return {
        ...prev,
        pages: updatedPages,
        currentPageIndex: Math.min(prev.currentPageIndex, updatedPages.length - 1),
      };
    });
  };

  // Color Adjustment update
  const handleColorChange = (newAdj: ColorAdjustments) => {
    setDoc((prev) => (prev ? { ...prev, colorAdjustments: newAdj } : null));
  };

  // Image resizing update
  const handleApplyResize = (newW: number, newH: number) => {
    setDoc((prev) => {
      if (!prev) return null;
      const updatedPages = [...prev.pages];
      updatedPages[prev.currentPageIndex] = {
        ...updatedPages[prev.currentPageIndex],
        width: newW,
        height: newH,
      };
      return {
        ...prev,
        pages: updatedPages,
        metadata: prev.metadata
          ? {
              ...prev.metadata,
              dimensions: { width: newW, height: newH },
            }
          : undefined,
      };
    });
  };

  // Annotations
  const handleAddAnnotation = (ann: AnnotationItem) => {
    setDoc((prev) => (prev ? { ...prev, annotations: [...prev.annotations, ann] } : null));
  };

  // Open Local File
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    openFileObject(file);
  };

  const openFileObject = async (file: File) => {
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    if (isPdf) {
      try {
        const buffer = await file.arrayBuffer();
        const { pages, metadata } = await loadPdfDocument(buffer);
        const url = URL.createObjectURL(file);
        setDoc({
          id: `doc-${Date.now()}`,
          name: file.name,
          type: 'pdf',
          fileSizeBytes: file.size,
          filePath: file.name,
          url,
          pages,
          currentPageIndex: 0,
          zoom: 1.0,
          fitMode: 'fit',
          rotation: 0,
          colorAdjustments: {
            exposure: 0,
            contrast: 0,
            highlights: 0,
            shadows: 0,
            saturation: 0,
            temperature: 0,
            tint: 0,
            sepia: 0,
            sharpness: 0,
          },
          annotations: [],
          metadata,
        });
      } catch (err) {
        console.error('PDF Load Error:', err);
      }
    } else {
      // Image file
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setDoc({
          id: `img-${Date.now()}`,
          name: file.name,
          type: 'image',
          fileSizeBytes: file.size,
          filePath: file.name,
          url,
          pages: [
            {
              pageNumber: 1,
              width: img.width,
              height: img.height,
              rotation: 0,
              thumbnailUrl: url,
            },
          ],
          currentPageIndex: 0,
          zoom: 1.0,
          fitMode: 'fit',
          rotation: 0,
          colorAdjustments: {
            exposure: 0,
            contrast: 0,
            highlights: 0,
            shadows: 0,
            saturation: 0,
            temperature: 0,
            tint: 0,
            sepia: 0,
            sharpness: 0,
          },
          annotations: [],
          metadata: {
            fileName: file.name,
            fileSizeBytes: file.size,
            format: file.type || 'IMAGE',
            dimensions: { width: img.width, height: img.height },
            colorSpace: 'sRGB',
            resolutionDpi: 72,
            createdAt: new Date(file.lastModified).toISOString(),
          },
        });
      };
    }
  };

  // Export File Download
  const handleExportFile = (format: string, quality: number, scale: number) => {
    if (!doc) return;
    const canvas = document.createElement('canvas');
    const page = doc.pages[doc.currentPageIndex];
    canvas.width = Math.round(page.width * scale);
    canvas.height = Math.round(page.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = doc.url;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const mime = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      const dataUrl = canvas.toDataURL(mime, quality);

      const a = document.createElement('a');
      a.href = dataUrl;
      const baseName = doc.name.replace(/\.[^/.]+$/, '');
      a.download = `${baseName}_exported.${format}`;
      a.click();
    };
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) openFileObject(file);
      }}
      className="flex flex-col h-screen w-screen overflow-hidden bg-[#1e1e1e] text-[#cfcfcf]"
    >
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.heic,.tiff,.bmp"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Main Unified Header Toolbar */}
      <WindowHeader
        document={doc}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        markupActive={markupActive}
        onToggleMarkup={() => setMarkupActive((prev) => !prev)}
        adjustColorOpen={adjustColorOpen}
        onToggleAdjustColor={() => setAdjustColorOpen((prev) => !prev)}
        sizingOpen={sizingOpen}
        onToggleSizing={() => setSizingOpen((prev) => !prev)}
        inspectorOpen={inspectorOpen}
        onToggleInspector={() => setInspectorOpen((prev) => !prev)}
        loupeActive={loupeActive}
        onToggleLoupe={() => setLoupeActive((prev) => !prev)}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomFit={handleZoomFit}
        onZoomActual={handleZoomActual}
        onRotateCcw={handleRotateCcw}
        onRotateCw={handleRotateCw}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onOpenFile={() => fileInputRef.current?.click()}
        onExport={() => setExportOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Secondary Markup Banner (PVEditBanner) */}
      {markupActive && (
        <MarkupToolbar
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          strokeColor={strokeColor}
          onChangeStrokeColor={setStrokeColor}
          fillColor={fillColor}
          onChangeFillColor={setFillColor}
          strokeWidth={strokeWidth}
          onChangeStrokeWidth={setStrokeWidth}
        />
      )}

      {/* Workspace Area: Sidebar + Canvas */}
      <div className="flex-1 flex overflow-hidden relative">
        {sidebarOpen && (
          <Sidebar
            document={doc}
            activeTab={sidebarTab}
            onSelectTab={setSidebarTab}
            onSelectPage={handleSelectPage}
            onRotatePage={handleRotateSinglePage}
            onDeletePage={handleDeletePage}
            searchQuery={searchQuery}
          />
        )}

        {/* Central Canvas View */}
        <CanvasView
          document={doc}
          activeTool={activeTool}
          strokeColor={strokeColor}
          fillColor={fillColor}
          strokeWidth={strokeWidth}
          loupeActive={loupeActive}
          onAddAnnotation={handleAddAnnotation}
          onUpdateZoom={(z) => setDoc((prev) => (prev ? { ...prev, zoom: z } : null))}
        />

        {/* Floating Adjust Color HUD Panel */}
        <AdjustColorModal
          isOpen={adjustColorOpen}
          onClose={() => setAdjustColorOpen(false)}
          adjustments={doc?.colorAdjustments || {
            exposure: 0,
            contrast: 0,
            highlights: 0,
            shadows: 0,
            saturation: 0,
            temperature: 0,
            tint: 0,
            sepia: 0,
            sharpness: 0,
          }}
          onChange={handleColorChange}
          histogram={histogram}
        />

        {/* Floating Inspector Panel */}
        <InspectorWindow
          isOpen={inspectorOpen}
          onClose={() => setInspectorOpen(false)}
          document={doc}
        />

        {/* Modal: Document Sizing Sheet */}
        <DocumentSizingModal
          isOpen={sizingOpen}
          onClose={() => setSizingOpen(false)}
          document={doc}
          onApplyResize={handleApplyResize}
        />

        {/* Modal: Format Conversion & Export */}
        <ExportModal
          isOpen={exportOpen}
          onClose={() => setExportOpen(false)}
          document={doc}
          onExportFile={handleExportFile}
        />
      </div>
    </div>
  );
};
