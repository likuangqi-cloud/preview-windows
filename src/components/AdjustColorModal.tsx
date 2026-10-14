import React from 'react';
import { X, RotateCcw, Wand2 } from 'lucide-react';
import { ColorAdjustments, defaultColorAdjustments } from '../types';
import { HistogramData } from '../services/imageService';

interface AdjustColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  adjustments: ColorAdjustments;
  onChange: (adj: ColorAdjustments) => void;
  histogram: HistogramData | null;
}

export const AdjustColorModal: React.FC<AdjustColorModalProps> = ({
  isOpen,
  onClose,
  adjustments,
  onChange,
  histogram,
}) => {
  if (!isOpen) return null;

  const updateField = (key: keyof ColorAdjustments, value: number) => {
    onChange({ ...adjustments, [key]: value });
  };

  const resetAll = () => {
    onChange({ ...defaultColorAdjustments });
  };

  const autoLevels = () => {
    onChange({
      ...adjustments,
      exposure: 15,
      contrast: 20,
      saturation: 10,
      shadows: 15,
      highlights: -10,
    });
  };

  return (
    <div className="absolute top-16 right-6 w-80 bg-[#282828]/95 backdrop-blur-xl border border-[#444444] rounded-xl shadow-2xl z-50 select-none text-[#d4d4d4] p-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#3e3e3e]">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] cursor-pointer" onClick={onClose} />
          <span className="font-semibold text-white tracking-wide">调整颜色</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-[#383838] rounded text-[#888888] hover:text-white">
          <X size={14} />
        </button>
      </div>

      {/* Histogram View */}
      <div className="my-3">
        <div className="text-[11px] text-[#888888] mb-1 font-medium">直方图 (Histogram)</div>
        <div className="h-20 w-full bg-[#1b1b1b] rounded border border-[#3e3e3e] relative overflow-hidden flex items-end px-1">
          {histogram ? (
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 256 100">
              {/* Luminance Area */}
              <polyline
                fill="rgba(255, 255, 255, 0.2)"
                stroke="rgba(255, 255, 255, 0.7)"
                strokeWidth="1"
                points={histogram.lum.map((v, i) => `${i},${100 - Math.min(100, (v / 80) * 100)}`).join(' ')}
              />
              {/* Red line */}
              <polyline
                fill="none"
                stroke="rgba(255, 99, 132, 0.6)"
                strokeWidth="1"
                points={histogram.r.map((v, i) => `${i},${100 - Math.min(100, (v / 80) * 100)}`).join(' ')}
              />
              {/* Green line */}
              <polyline
                fill="none"
                stroke="rgba(75, 192, 192, 0.6)"
                strokeWidth="1"
                points={histogram.g.map((v, i) => `${i},${100 - Math.min(100, (v / 80) * 100)}`).join(' ')}
              />
              {/* Blue line */}
              <polyline
                fill="none"
                stroke="rgba(54, 162, 235, 0.6)"
                strokeWidth="1"
                points={histogram.b.map((v, i) => `${i},${100 - Math.min(100, (v / 80) * 100)}`).join(' ')}
              />
            </svg>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-[#555555]">
              计算直方图中...
            </div>
          )}
        </div>
      </div>

      {/* Sliders List */}
      <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
        {/* Exposure */}
        <div>
          <div className="flex justify-between text-[11px] mb-0.5">
            <span>曝光 (Exposure)</span>
            <span className="font-mono text-[#888888]">{adjustments.exposure}</span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            value={adjustments.exposure}
            onChange={(e) => updateField('exposure', Number(e.target.value))}
            className="w-full accent-[#0a84ff] h-1.5 bg-[#1b1b1b] rounded-lg cursor-pointer"
          />
        </div>

        {/* Contrast */}
        <div>
          <div className="flex justify-between text-[11px] mb-0.5">
            <span>对比度 (Contrast)</span>
            <span className="font-mono text-[#888888]">{adjustments.contrast}</span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            value={adjustments.contrast}
            onChange={(e) => updateField('contrast', Number(e.target.value))}
            className="w-full accent-[#0a84ff] h-1.5 bg-[#1b1b1b] rounded-lg cursor-pointer"
          />
        </div>

        {/* Highlights */}
        <div>
          <div className="flex justify-between text-[11px] mb-0.5">
            <span>高光 (Highlights)</span>
            <span className="font-mono text-[#888888]">{adjustments.highlights}</span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            value={adjustments.highlights}
            onChange={(e) => updateField('highlights', Number(e.target.value))}
            className="w-full accent-[#0a84ff] h-1.5 bg-[#1b1b1b] rounded-lg cursor-pointer"
          />
        </div>

        {/* Shadows */}
        <div>
          <div className="flex justify-between text-[11px] mb-0.5">
            <span>阴影 (Shadows)</span>
            <span className="font-mono text-[#888888]">{adjustments.shadows}</span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            value={adjustments.shadows}
            onChange={(e) => updateField('shadows', Number(e.target.value))}
            className="w-full accent-[#0a84ff] h-1.5 bg-[#1b1b1b] rounded-lg cursor-pointer"
          />
        </div>

        {/* Saturation */}
        <div>
          <div className="flex justify-between text-[11px] mb-0.5">
            <span>饱和度 (Saturation)</span>
            <span className="font-mono text-[#888888]">{adjustments.saturation}</span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            value={adjustments.saturation}
            onChange={(e) => updateField('saturation', Number(e.target.value))}
            className="w-full accent-[#0a84ff] h-1.5 bg-[#1b1b1b] rounded-lg cursor-pointer"
          />
        </div>

        {/* Temperature */}
        <div>
          <div className="flex justify-between text-[11px] mb-0.5">
            <span>色温 (Temperature)</span>
            <span className="font-mono text-[#888888]">{adjustments.temperature}</span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            value={adjustments.temperature}
            onChange={(e) => updateField('temperature', Number(e.target.value))}
            className="w-full accent-[#0a84ff] h-1.5 bg-[#1b1b1b] rounded-lg cursor-pointer"
          />
        </div>

        {/* Tint */}
        <div>
          <div className="flex justify-between text-[11px] mb-0.5">
            <span>色调 (Tint)</span>
            <span className="font-mono text-[#888888]">{adjustments.tint}</span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            value={adjustments.tint}
            onChange={(e) => updateField('tint', Number(e.target.value))}
            className="w-full accent-[#0a84ff] h-1.5 bg-[#1b1b1b] rounded-lg cursor-pointer"
          />
        </div>

        {/* Sepia */}
        <div>
          <div className="flex justify-between text-[11px] mb-0.5">
            <span>棕褐色 (Sepia)</span>
            <span className="font-mono text-[#888888]">{adjustments.sepia}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={adjustments.sepia}
            onChange={(e) => updateField('sepia', Number(e.target.value))}
            className="w-full accent-[#0a84ff] h-1.5 bg-[#1b1b1b] rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#3e3e3e]">
        <button
          onClick={autoLevels}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#383838] hover:bg-[#444444] rounded text-white font-medium transition-colors"
        >
          <Wand2 size={13} className="text-[#0a84ff]" />
          <span>自动色阶</span>
        </button>
        <button
          onClick={resetAll}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#383838] hover:bg-[#444444] rounded text-[#aaaaaa] hover:text-white transition-colors"
        >
          <RotateCcw size={13} />
          <span>还原全部</span>
        </button>
      </div>
    </div>
  );
};
