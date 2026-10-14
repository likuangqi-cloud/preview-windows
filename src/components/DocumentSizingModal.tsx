import React, { useState } from 'react';
import { X, Lock, Unlock } from 'lucide-react';
import { PreviewDocument } from '../types';

interface DocumentSizingModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: PreviewDocument | null;
  onApplyResize: (newWidth: number, newHeight: number) => void;
}

export const DocumentSizingModal: React.FC<DocumentSizingModalProps> = ({
  isOpen,
  onClose,
  document,
  onApplyResize,
}) => {
  if (!isOpen || !document) return null;

  const currentW = document.pages[document.currentPageIndex]?.width || 1600;
  const currentH = document.pages[document.currentPageIndex]?.height || 1000;
  const aspectRatio = currentW / currentH;

  const [width, setWidth] = useState(currentW);
  const [height, setHeight] = useState(currentH);
  const [lockRatio, setLockRatio] = useState(true);
  const [resolution, setResolution] = useState(300);
  const [resample, setResample] = useState(true);

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockRatio) {
      setHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockRatio) {
      setWidth(Math.round(val * aspectRatio));
    }
  };

  const handleOk = () => {
    onApplyResize(width, height);
    onClose();
  };

  const origSizeMb = (document.fileSizeBytes / (1024 * 1024)).toFixed(2);
  const newSizeMb = ((document.fileSizeBytes * (width * height)) / (currentW * currentH) / (1024 * 1024)).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center select-none text-xs text-[#cfcfcf]">
      <div className="w-[420px] bg-[#2a2a2a] border border-[#444444] rounded-xl shadow-2xl p-5 space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between pb-3 border-b border-[#3e3e3e]">
          <span className="text-sm font-semibold text-white">图像大小 (Image Dimensions)</span>
          <button onClick={onClose} className="p-1 hover:bg-[#383838] rounded text-[#888888] hover:text-white">
            <X size={14} />
          </button>
        </div>

        {/* Dimensions Settings */}
        <div className="space-y-3 bg-[#202020] p-3.5 rounded-lg border border-[#383838]">
          <div className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-2">图像尺寸</div>

          {/* Width */}
          <div className="flex items-center justify-between">
            <span>宽度 (Width):</span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(Math.max(1, Number(e.target.value)))}
                className="w-24 bg-[#1a1a1a] border border-[#3e3e3e] rounded px-2 py-1 text-right text-white font-mono focus:outline-none focus:border-[#0a84ff]"
              />
              <span className="text-[#888888] w-12 text-left">像素</span>
            </div>
          </div>

          {/* Height */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span>高度 (Height):</span>
              <button
                onClick={() => setLockRatio(!lockRatio)}
                title={lockRatio ? '保持长宽比' : '自由调整长宽'}
                className="p-1 hover:bg-[#333333] rounded text-[#888888] hover:text-white"
              >
                {lockRatio ? <Lock size={12} className="text-[#0a84ff]" /> : <Unlock size={12} />}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(Math.max(1, Number(e.target.value)))}
                className="w-24 bg-[#1a1a1a] border border-[#3e3e3e] rounded px-2 py-1 text-right text-white font-mono focus:outline-none focus:border-[#0a84ff]"
              />
              <span className="text-[#888888] w-12 text-left">像素</span>
            </div>
          </div>

          {/* Resolution */}
          <div className="flex items-center justify-between pt-1">
            <span>分辨率 (Resolution):</span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={resolution}
                onChange={(e) => setResolution(Number(e.target.value))}
                className="w-24 bg-[#1a1a1a] border border-[#3e3e3e] rounded px-2 py-1 text-right text-white font-mono focus:outline-none focus:border-[#0a84ff]"
              />
              <span className="text-[#888888] w-12 text-left">像素/英寸</span>
            </div>
          </div>

          {/* Resample Toggle */}
          <div className="flex items-center space-x-2 pt-2 border-t border-[#333333]">
            <input
              type="checkbox"
              id="resample"
              checked={resample}
              onChange={(e) => setResample(e.target.checked)}
              className="accent-[#0a84ff] rounded cursor-pointer"
            />
            <label htmlFor="resample" className="cursor-pointer text-white">
              重新取样图像 (Resample image)
            </label>
          </div>
        </div>

        {/* Size Estimate Info */}
        <div className="bg-[#1f1f1f] rounded p-2.5 text-[11px] text-[#999999] space-y-1 border border-[#333333]">
          <div className="flex justify-between">
            <span>原尺寸大小:</span>
            <span className="font-mono text-white">{currentW} × {currentH} 像素 ({origSizeMb} MB)</span>
          </div>
          <div className="flex justify-between">
            <span>调整后大小:</span>
            <span className="font-mono text-[#0a84ff]">{width} × {height} 像素 (~{newSizeMb} MB)</span>
          </div>
        </div>

        {/* Dialog Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#383838] hover:bg-[#444444] rounded text-white transition-colors"
          >
            取消 (Cancel)
          </button>
          <button
            onClick={handleOk}
            className="px-4 py-1.5 bg-[#0a84ff] hover:bg-[#0070e0] rounded text-white font-medium transition-colors"
          >
            好 (OK)
          </button>
        </div>
      </div>
    </div>
  );
};
