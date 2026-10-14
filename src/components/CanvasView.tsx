import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PreviewDocument, ActiveTool, AnnotationItem } from '../types';
import { getCssFilterString } from '../services/imageService';

interface CanvasViewProps {
  document: PreviewDocument | null;
  activeTool: ActiveTool;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  loupeActive: boolean;
  onAddAnnotation: (ann: AnnotationItem) => void;
  onUpdateZoom: (newZoom: number) => void;
}

export const CanvasView: React.FC<CanvasViewProps> = ({
  document: doc,
  activeTool,
  strokeColor,
  fillColor,
  strokeWidth,
  loupeActive,
  onAddAnnotation,
  onUpdateZoom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentDraw, setCurrentDraw] = useState<{ x: number; y: number } | null>(null);
  const [sketchPoints, setSketchPoints] = useState<{ x: number; y: number }[]>([]);

  // Loupe position
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Render document image onto canvas
  useEffect(() => {
    if (!doc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = doc.url;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  }, [doc?.url, doc?.currentPageIndex]);

  // Handle Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.min(5.0, Math.max(0.1, (doc?.zoom || 1.0) + delta));
      onUpdateZoom(newZoom);
    } else {
      // Pan scroll
      setPan((prev) => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  };

  // Convert client mouse coords to document image coordinate space
  const getDocCoords = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current || !doc) return { x: 0, y: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2 + pan.x;
      const centerY = rect.height / 2 + pan.y;

      const page = doc.pages[doc.currentPageIndex] || { width: 1600, height: 1000 };
      const docW = page.width * doc.zoom;
      const docH = page.height * doc.zoom;

      const topLeftX = centerX - docW / 2;
      const topLeftY = centerY - docH / 2;

      const imgX = (clientX - rect.left - topLeftX) / doc.zoom;
      const imgY = (clientY - rect.top - topLeftY) / doc.zoom;

      return { x: imgX, y: imgY };
    },
    [doc, pan]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    // Space or middle button for panning
    if (e.button === 1 || activeTool === 'select') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    const docCoords = getDocCoords(e.clientX, e.clientY);
    setIsDrawing(true);
    setDrawStart(docCoords);
    setCurrentDraw(docCoords);

    if (activeTool === 'sketch' || activeTool === 'highlight') {
      setSketchPoints([docCoords]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Loupe tracking
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }

    if (isDrawing && drawStart) {
      const docCoords = getDocCoords(e.clientX, e.clientY);
      setCurrentDraw(docCoords);

      if (activeTool === 'sketch' || activeTool === 'highlight') {
        setSketchPoints((prev) => [...prev, docCoords]);
      }
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (isDrawing && drawStart && currentDraw && doc) {
      const minX = Math.min(drawStart.x, currentDraw.x);
      const minY = Math.min(drawStart.y, currentDraw.y);
      const w = Math.abs(currentDraw.x - drawStart.x);
      const h = Math.abs(currentDraw.y - drawStart.y);

      let newAnn: AnnotationItem | null = null;

      if (activeTool === 'rect') {
        newAnn = {
          id: `ann-${Date.now()}`,
          pageIndex: doc.currentPageIndex,
          type: 'rect',
          x: minX,
          y: minY,
          width: Math.max(10, w),
          height: Math.max(10, h),
          color: strokeColor,
          fillColor: fillColor || 'transparent',
          strokeWidth,
          createdAt: Date.now(),
        };
      } else if (activeTool === 'circle') {
        newAnn = {
          id: `ann-${Date.now()}`,
          pageIndex: doc.currentPageIndex,
          type: 'circle',
          x: minX,
          y: minY,
          width: Math.max(10, w),
          height: Math.max(10, h),
          color: strokeColor,
          fillColor: fillColor || 'transparent',
          strokeWidth,
          createdAt: Date.now(),
        };
      } else if (activeTool === 'line' || activeTool === 'arrow') {
        newAnn = {
          id: `ann-${Date.now()}`,
          pageIndex: doc.currentPageIndex,
          type: activeTool,
          x: drawStart.x,
          y: drawStart.y,
          width: w,
          height: h,
          points: [drawStart, currentDraw],
          color: strokeColor,
          strokeWidth,
          createdAt: Date.now(),
        };
      } else if (activeTool === 'sketch' || activeTool === 'highlight') {
        newAnn = {
          id: `ann-${Date.now()}`,
          pageIndex: doc.currentPageIndex,
          type: activeTool === 'highlight' ? 'highlight' : 'freehand',
          x: minX,
          y: minY,
          width: w,
          height: h,
          points: sketchPoints,
          color: activeTool === 'highlight' ? '#ffeb3b88' : strokeColor,
          strokeWidth: activeTool === 'highlight' ? strokeWidth * 4 : strokeWidth,
          createdAt: Date.now(),
        };
      } else if (activeTool === 'text') {
        const textContent = prompt('请输入批注文字:', '批注文本');
        if (textContent) {
          newAnn = {
            id: `ann-${Date.now()}`,
            pageIndex: doc.currentPageIndex,
            type: 'text',
            x: drawStart.x,
            y: drawStart.y,
            width: 150,
            height: 30,
            text: textContent,
            color: strokeColor,
            fontSize: 16,
            strokeWidth: 1,
            createdAt: Date.now(),
          };
        }
      }

      if (newAnn) {
        onAddAnnotation(newAnn);
      }
    }

    setIsDrawing(false);
    setDrawStart(null);
    setCurrentDraw(null);
    setSketchPoints([]);
  };

  if (!doc) {
    return (
      <main className="flex-1 bg-[#1a1a1a] flex flex-col items-center justify-center select-none text-[#666666]">
        <div className="w-20 h-20 rounded-2xl bg-[#242424] border border-[#333333] flex items-center justify-center mb-3 shadow-lg">
          <span className="text-3xl">📄</span>
        </div>
        <p className="text-sm font-medium text-[#999999]">拖移图片或 PDF 到此处打开</p>
        <p className="text-xs text-[#555555] mt-1">支持 HEIC, PNG, JPEG, TIFF, WebP, PDF 等</p>
      </main>
    );
  }

  const page = doc.pages[doc.currentPageIndex] || { width: 1600, height: 1000 };
  const filterStyle = getCssFilterString(doc.colorAdjustments);

  return (
    <main
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setIsPanning(false);
        setIsDrawing(false);
      }}
      className={`flex-1 relative overflow-hidden bg-[#181818] flex items-center justify-center select-none ${
        activeTool === 'select' ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'
      }`}
    >
      {/* Centered Document Wrapper */}
      <div
        className="relative transition-transform duration-75 shadow-2xl rounded"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${doc.zoom}) rotate(${doc.rotation}deg)`,
          width: page.width,
          height: page.height,
        }}
      >
        {/* Document Content Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block rounded bg-white shadow-2xl"
          style={{ filter: filterStyle }}
        />

        {/* Existing Annotations Overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${page.width} ${page.height}`}
        >
          {doc.annotations
            .filter((a) => a.pageIndex === doc.currentPageIndex)
            .map((ann) => {
              if (ann.type === 'rect') {
                return (
                  <rect
                    key={ann.id}
                    x={ann.x}
                    y={ann.y}
                    width={ann.width}
                    height={ann.height}
                    stroke={ann.color}
                    fill={ann.fillColor || 'transparent'}
                    strokeWidth={ann.strokeWidth}
                    rx="4"
                  />
                );
              }
              if (ann.type === 'circle') {
                return (
                  <ellipse
                    key={ann.id}
                    cx={ann.x + ann.width / 2}
                    cy={ann.y + ann.height / 2}
                    rx={ann.width / 2}
                    ry={ann.height / 2}
                    stroke={ann.color}
                    fill={ann.fillColor || 'transparent'}
                    strokeWidth={ann.strokeWidth}
                  />
                );
              }
              if (ann.type === 'line' && ann.points && ann.points.length >= 2) {
                return (
                  <line
                    key={ann.id}
                    x1={ann.points[0].x}
                    y1={ann.points[0].y}
                    x2={ann.points[1].x}
                    y2={ann.points[1].y}
                    stroke={ann.color}
                    strokeWidth={ann.strokeWidth}
                    strokeLinecap="round"
                  />
                );
              }
              if (ann.type === 'arrow' && ann.points && ann.points.length >= 2) {
                return (
                  <g key={ann.id}>
                    <line
                      x1={ann.points[0].x}
                      y1={ann.points[0].y}
                      x2={ann.points[1].x}
                      y2={ann.points[1].y}
                      stroke={ann.color}
                      strokeWidth={ann.strokeWidth}
                      strokeLinecap="round"
                    />
                    <circle cx={ann.points[1].x} cy={ann.points[1].y} r={ann.strokeWidth * 2} fill={ann.color} />
                  </g>
                );
              }
              if ((ann.type === 'freehand' || ann.type === 'highlight') && ann.points) {
                const pts = ann.points.map((p) => `${p.x},${p.y}`).join(' ');
                return (
                  <polyline
                    key={ann.id}
                    points={pts}
                    fill="none"
                    stroke={ann.color}
                    strokeWidth={ann.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              }
              if (ann.type === 'text') {
                return (
                  <text
                    key={ann.id}
                    x={ann.x}
                    y={ann.y + (ann.fontSize || 16)}
                    fill={ann.color}
                    fontSize={ann.fontSize || 16}
                    fontFamily={ann.fontFamily || '-apple-system'}
                    fontWeight="500"
                  >
                    {ann.text}
                  </text>
                );
              }
              return null;
            })}

          {/* Active Drawing Preview */}
          {isDrawing && drawStart && currentDraw && (
            <>
              {activeTool === 'rect' && (
                <rect
                  x={Math.min(drawStart.x, currentDraw.x)}
                  y={Math.min(drawStart.y, currentDraw.y)}
                  width={Math.abs(currentDraw.x - drawStart.x)}
                  height={Math.abs(currentDraw.y - drawStart.y)}
                  stroke={strokeColor}
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeDasharray="4 2"
                />
              )}
              {activeTool === 'circle' && (
                <ellipse
                  cx={(drawStart.x + currentDraw.x) / 2}
                  cy={(drawStart.y + currentDraw.y) / 2}
                  rx={Math.abs(currentDraw.x - drawStart.x) / 2}
                  ry={Math.abs(currentDraw.y - drawStart.y) / 2}
                  stroke={strokeColor}
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeDasharray="4 2"
                />
              )}
              {activeTool === 'line' && (
                <line
                  x1={drawStart.x}
                  y1={drawStart.y}
                  x2={currentDraw.x}
                  y2={currentDraw.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                />
              )}
              {activeTool === 'arrow' && (
                <line
                  x1={drawStart.x}
                  y1={drawStart.y}
                  x2={currentDraw.x}
                  y2={currentDraw.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                />
              )}
              {(activeTool === 'sketch' || activeTool === 'highlight') && sketchPoints.length > 1 && (
                <polyline
                  points={sketchPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke={activeTool === 'highlight' ? '#ffeb3b88' : strokeColor}
                  strokeWidth={activeTool === 'highlight' ? strokeWidth * 4 : strokeWidth}
                  strokeLinecap="round"
                />
              )}
            </>
          )}
        </svg>
      </div>

      {/* Loupe / Magnifier Lens Overlay */}
      {loupeActive && isHovering && (
        <div
          className="absolute pointer-events-none rounded-full border-4 border-white/80 shadow-2xl overflow-hidden z-40 bg-[#1e1e1e]"
          style={{
            width: 160,
            height: 160,
            left: mousePos.x - 80,
            top: mousePos.y - 80,
            boxShadow: '0 10px 40px rgba(0,0,0,0.8), inset 0 0 10px rgba(0,0,0,0.5)',
          }}
        >
          {/* Magnified preview canvas */}
          <div
            className="absolute"
            style={{
              width: page.width * doc.zoom * 2.5,
              height: page.height * doc.zoom * 2.5,
              left: 80 - (mousePos.x - (containerRef.current?.clientWidth || 0) / 2 - pan.x + (page.width * doc.zoom) / 2) * 2.5,
              top: 80 - (mousePos.y - (containerRef.current?.clientHeight || 0) / 2 - pan.y + (page.height * doc.zoom) / 2) * 2.5,
            }}
          >
            <canvas
              ref={(c) => {
                if (c && canvasRef.current) {
                  c.width = canvasRef.current.width;
                  c.height = canvasRef.current.height;
                  const ctx = c.getContext('2d');
                  if (ctx) ctx.drawImage(canvasRef.current, 0, 0);
                }
              }}
              className="w-full h-full"
            />
          </div>
          {/* Crosshairs */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-[1px] bg-red-500/80" />
            <div className="h-4 w-[1px] bg-red-500/80 -ml-2" />
          </div>
        </div>
      )}
    </main>
  );
};
