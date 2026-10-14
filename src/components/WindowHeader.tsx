import React from 'react';
import {
  PanelLeft,
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCcw,
  RotateCw,
  Sliders,
  Crop,
  Info,
  Edit3,
  Search,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Download,
  SearchCheck,
} from 'lucide-react';
import { PreviewDocument } from '../types';

interface WindowHeaderProps {
  document: PreviewDocument | null;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  markupActive: boolean;
  onToggleMarkup: () => void;
  adjustColorOpen: boolean;
  onToggleAdjustColor: () => void;
  sizingOpen: boolean;
  onToggleSizing: () => void;
  inspectorOpen: boolean;
  onToggleInspector: () => void;
  loupeActive: boolean;
  onToggleLoupe: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  onZoomActual: () => void;
  onRotateCcw: () => void;
  onRotateCw: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onOpenFile: () => void;
  onExport: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const WindowHeader: React.FC<WindowHeaderProps> = ({
  document,
  sidebarOpen,
  onToggleSidebar,
  markupActive,
  onToggleMarkup,
  adjustColorOpen,
  onToggleAdjustColor,
  sizingOpen,
  onToggleSizing,
  inspectorOpen,
  onToggleInspector,
  loupeActive,
  onToggleLoupe,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  onZoomActual,
  onRotateCcw,
  onRotateCw,
  onPrevPage,
  onNextPage,
  onOpenFile,
  onExport,
  searchQuery,
  onSearchChange,
}) => {
  const totalPages = document?.pages.length || 1;
  const currentPage = (document?.currentPageIndex || 0) + 1;
  const zoomPercent = Math.round((document?.zoom || 1) * 100);

  return (
    <header className="h-12 bg-[#2d2d2d] border-b border-[#3e3e3e] flex items-center justify-between px-3 select-none text-[#cfcfcf]">
      {/* Left: Window Controls + Sidebar Toggle + Document Title */}
      <div className="flex items-center space-x-3">
        {/* macOS Traffic Lights */}
        <div className="flex items-center space-x-2 mr-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer hover:opacity-80" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer hover:opacity-80" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer hover:opacity-80" />
        </div>

        {/* Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          title="显示/隐藏侧边栏"
          className={`p-1.5 rounded hover:bg-[#3d3d3d] transition-colors ${
            sidebarOpen ? 'bg-[#3d3d3d] text-white' : 'text-[#8e8e8e]'
          }`}
        >
          <PanelLeft size={16} />
        </button>

        {/* Document Title */}
        <div className="flex items-center space-x-1.5">
          <span className="text-xs font-semibold text-white tracking-wide truncate max-w-[200px]">
            {document ? document.name : '预览 (Preview)'}
          </span>
          {document && (
            <span className="text-[11px] text-[#8e8e8e]">
              — {document.pages[document.currentPageIndex]?.width || 0} × {document.pages[document.currentPageIndex]?.height || 0}
            </span>
          )}
        </div>
      </div>

      {/* Middle: Core Toolbar (Zoom, Navigation, Markup, Tools) */}
      <div className="flex items-center space-x-1">
        {/* Page Navigation */}
        {document && totalPages > 1 && (
          <div className="flex items-center bg-[#242424] rounded border border-[#3e3e3e] px-1 py-0.5 mr-2">
            <button
              onClick={onPrevPage}
              disabled={currentPage <= 1}
              className="p-1 hover:bg-[#383838] rounded disabled:opacity-30"
              title="上一页"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs px-2 text-[#b0b0b0] font-mono">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={onNextPage}
              disabled={currentPage >= totalPages}
              className="p-1 hover:bg-[#383838] rounded disabled:opacity-30"
              title="下一页"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Zoom Group */}
        <div className="flex items-center bg-[#242424] rounded border border-[#3e3e3e] px-1 py-0.5">
          <button onClick={onZoomOut} title="缩小 (⌘-)" className="p-1 hover:bg-[#383838] rounded">
            <ZoomOut size={14} />
          </button>
          <button
            onClick={onZoomActual}
            title="实际大小 (⌘0)"
            className="text-[11px] font-mono px-1.5 hover:text-white"
          >
            {zoomPercent}%
          </button>
          <button onClick={onZoomIn} title="放大 (⌘+)" className="p-1 hover:bg-[#383838] rounded">
            <ZoomIn size={14} />
          </button>
          <div className="w-[1px] h-3 bg-[#3e3e3e] mx-1" />
          <button onClick={onZoomFit} title="缩放以适合窗口 (⌘9)" className="p-1 hover:bg-[#383838] rounded">
            <Maximize size={13} />
          </button>
        </div>

        {/* Rotate Group */}
        <div className="flex items-center bg-[#242424] rounded border border-[#3e3e3e] px-1 py-0.5 ml-2">
          <button onClick={onRotateCcw} title="向左旋转 (⌘L)" className="p-1 hover:bg-[#383838] rounded">
            <RotateCcw size={14} />
          </button>
          <button onClick={onRotateCw} title="向右旋转 (⌘R)" className="p-1 hover:bg-[#383838] rounded">
            <RotateCw size={14} />
          </button>
        </div>

        {/* Loupe / Magnifier */}
        <button
          onClick={onToggleLoupe}
          title="放大镜 (Loupe)"
          className={`p-1.5 rounded ml-2 border border-[#3e3e3e] transition-colors ${
            loupeActive ? 'bg-[#0a84ff] text-white border-[#0a84ff]' : 'bg-[#242424] hover:bg-[#383838]'
          }`}
        >
          <SearchCheck size={14} />
        </button>

        {/* Markup Toolbar Toggle (PVEditBanner) */}
        <button
          onClick={onToggleMarkup}
          title="显示标记工具栏 (⌘⇧A)"
          className={`p-1.5 rounded ml-2 border border-[#3e3e3e] transition-colors flex items-center space-x-1 ${
            markupActive ? 'bg-[#0a84ff] text-white border-[#0a84ff]' : 'bg-[#242424] hover:bg-[#383838]'
          }`}
        >
          <Edit3 size={14} />
        </button>

        {/* Color Adjustments (PVAdjustColor) */}
        <button
          onClick={onToggleAdjustColor}
          title="调整颜色 (⌥⌘C)"
          className={`p-1.5 rounded ml-1 border border-[#3e3e3e] transition-colors ${
            adjustColorOpen ? 'bg-[#0a84ff] text-white border-[#0a84ff]' : 'bg-[#242424] hover:bg-[#383838]'
          }`}
        >
          <Sliders size={14} />
        </button>

        {/* Image Sizing (PVDocumentSizing) */}
        <button
          onClick={onToggleSizing}
          title="调整大小..."
          className={`p-1.5 rounded ml-1 border border-[#3e3e3e] transition-colors ${
            sizingOpen ? 'bg-[#0a84ff] text-white border-[#0a84ff]' : 'bg-[#242424] hover:bg-[#383838]'
          }`}
        >
          <Crop size={14} />
        </button>

        {/* Inspector (PVInspectorWindow) */}
        <button
          onClick={onToggleInspector}
          title="显示检查器 (⌘I)"
          className={`p-1.5 rounded ml-1 border border-[#3e3e3e] transition-colors ${
            inspectorOpen ? 'bg-[#0a84ff] text-white border-[#0a84ff]' : 'bg-[#242424] hover:bg-[#383838]'
          }`}
        >
          <Info size={14} />
        </button>
      </div>

      {/* Right: Search + Open/Export */}
      <div className="flex items-center space-x-2">
        {/* Search Input */}
        <div className="relative flex items-center">
          <Search size={13} className="absolute left-2 text-[#777777]" />
          <input
            type="text"
            placeholder="搜索文本..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-32 focus:w-44 transition-all duration-200 bg-[#1e1e1e] border border-[#3e3e3e] rounded-full pl-6 pr-2 py-0.5 text-xs text-white placeholder-[#666666] focus:outline-none focus:border-[#0a84ff]"
          />
        </div>

        {/* Open Local File */}
        <button
          onClick={onOpenFile}
          title="打开文件... (⌘O)"
          className="p-1.5 rounded bg-[#242424] hover:bg-[#383838] border border-[#3e3e3e] text-[#cfcfcf] hover:text-white"
        >
          <FolderOpen size={14} />
        </button>

        {/* Export / Share */}
        <button
          onClick={onExport}
          title="导出/格式转换... (⌘E)"
          className="p-1.5 rounded bg-[#242424] hover:bg-[#383838] border border-[#3e3e3e] text-[#cfcfcf] hover:text-white"
        >
          <Download size={14} />
        </button>
      </div>
    </header>
  );
};
