import React, { useState } from 'react';
import { X, Download } from 'lucide-react';
import { PreviewDocument } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: PreviewDocument | null;
  onExportFile: (format: string, quality: number, scale: number) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  document,
  onExportFile,
}) => {
  if (!isOpen || !document) return null;

  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(90);
  const [scale, setScale] = useState(1);

  const handleExport = () => {
    onExportFile(format, quality / 100, scale);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center select-none text-xs text-[#cfcfcf]">
      <div className="w-96 bg-[#2a2a2a] border border-[#444444] rounded-xl shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#3e3e3e]">
          <span className="text-sm font-semibold text-white">导出 / 转换格式</span>
          <button onClick={onClose} className="p-1 hover:bg-[#383838] rounded text-[#888888] hover:text-white">
            <X size={14} />
          </button>
        </div>

        {/* Format Select */}
        <div className="space-y-3 bg-[#202020] p-3.5 rounded-lg border border-[#383838]">
          <div className="flex items-center justify-between">
            <span>目标格式 (Format):</span>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="bg-[#1a1a1a] border border-[#3e3e3e] rounded px-3 py-1 text-white font-mono focus:outline-none focus:border-[#0a84ff]"
            >
              <option value="png">PNG (无损透明图)</option>
              <option value="jpeg">JPEG (照片压缩格式)</option>
              <option value="webp">WebP (下一代网络格式)</option>
              <option value="tiff">TIFF (高保真印刷)</option>
              <option value="bmp">BMP (位图)</option>
              <option value="pdf">PDF (文档格式)</option>
            </select>
          </div>

          {/* Quality Slider for JPEG / WebP */}
          {(format === 'jpeg' || format === 'webp') && (
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>压缩质量 (Quality):</span>
                <span className="font-mono text-white">{quality}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-[#0a84ff] h-1.5 bg-[#1a1a1a] rounded cursor-pointer"
              />
            </div>
          )}

          {/* Scale Resolution Preset */}
          <div className="flex items-center justify-between pt-1">
            <span>缩放比例 (Scale):</span>
            <select
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="bg-[#1a1a1a] border border-[#3e3e3e] rounded px-3 py-1 text-white focus:outline-none focus:border-[#0a84ff]"
            >
              <option value={1}>100% (原始尺寸)</option>
              <option value={0.75}>75%</option>
              <option value={0.5}>50%</option>
              <option value={0.25}>25%</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#383838] hover:bg-[#444444] rounded text-white transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-[#0a84ff] hover:bg-[#0070e0] rounded text-white font-medium transition-colors"
          >
            <Download size={14} />
            <span>导出文件</span>
          </button>
        </div>
      </div>
    </div>
  );
};
