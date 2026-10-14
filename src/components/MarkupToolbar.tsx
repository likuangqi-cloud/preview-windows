import React from 'react';
import {
  MousePointer,
  Square,
  Circle,
  ArrowUpRight,
  Minus,
  PenTool,
  Type,
  FileSignature,
  StickyNote,
  Highlighter,
  Palette,
} from 'lucide-react';
import { ActiveTool } from '../types';

interface MarkupToolbarProps {
  activeTool: ActiveTool;
  onSelectTool: (tool: ActiveTool) => void;
  strokeColor: string;
  onChangeStrokeColor: (color: string) => void;
  fillColor: string;
  onChangeFillColor: (color: string) => void;
  strokeWidth: number;
  onChangeStrokeWidth: (w: number) => void;
}

export const MarkupToolbar: React.FC<MarkupToolbarProps> = ({
  activeTool,
  onSelectTool,
  strokeColor,
  onChangeStrokeColor,
  fillColor,
  onChangeFillColor,
  strokeWidth,
  onChangeStrokeWidth,
}) => {
  const colors = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#007aff', '#5856d6', '#af52de', '#ffffff', '#000000'];

  return (
    <div className="h-10 bg-[#252526] border-b border-[#3e3e3e] flex items-center justify-between px-4 select-none text-[#cfcfcf]">
      {/* Left: Drawing & Annotation Tools */}
      <div className="flex items-center space-x-1">
        {/* Pointer / Select */}
        <button
          onClick={() => onSelectTool('select')}
          title="选择指针 (V)"
          className={`p-1.5 rounded transition-colors ${
            activeTool === 'select' ? 'bg-[#0a84ff] text-white' : 'hover:bg-[#383838] text-[#888888]'
          }`}
        >
          <MousePointer size={15} />
        </button>

        <div className="w-[1px] h-4 bg-[#3e3e3e] mx-1" />

        {/* Freehand Sketch */}
        <button
          onClick={() => onSelectTool('sketch')}
          title="涂鸦画笔 (P)"
          className={`p-1.5 rounded transition-colors ${
            activeTool === 'sketch' ? 'bg-[#0a84ff] text-white' : 'hover:bg-[#383838] text-[#888888]'
          }`}
        >
          <PenTool size={15} />
        </button>

        {/* Highlight Tool */}
        <button
          onClick={() => onSelectTool('highlight')}
          title="荧光高亮笔 (H)"
          className={`p-1.5 rounded transition-colors ${
            activeTool === 'highlight' ? 'bg-[#0a84ff] text-white' : 'hover:bg-[#383838] text-[#888888]'
          }`}
        >
          <Highlighter size={15} />
        </button>

        <div className="w-[1px] h-4 bg-[#3e3e3e] mx-1" />

        {/* Rectangle Shape */}
        <button
          onClick={() => onSelectTool('rect')}
          title="矩形 (R)"
          className={`p-1.5 rounded transition-colors ${
            activeTool === 'rect' ? 'bg-[#0a84ff] text-white' : 'hover:bg-[#383838] text-[#888888]'
          }`}
        >
          <Square size={15} />
        </button>

        {/* Circle / Oval Shape */}
        <button
          onClick={() => onSelectTool('circle')}
          title="圆形 / 椭圆 (O)"
          className={`p-1.5 rounded transition-colors ${
            activeTool === 'circle' ? 'bg-[#0a84ff] text-white' : 'hover:bg-[#383838] text-[#888888]'
          }`}
        >
          <Circle size={15} />
        </button>

        {/* Line */}
        <button
          onClick={() => onSelectTool('line')}
          title="直线 (L)"
          className={`p-1.5 rounded transition-colors ${
            activeTool === 'line' ? 'bg-[#0a84ff] text-white' : 'hover:bg-[#383838] text-[#888888]'
          }`}
        >
          <Minus size={15} />
        </button>

        {/* Arrow */}
        <button
          onClick={() => onSelectTool('arrow')}
          title="箭头 (A)"
          className={`p-1.5 rounded transition-colors ${
            activeTool === 'arrow' ? 'bg-[#0a84ff] text-white' : 'hover:bg-[#383838] text-[#888888]'
          }`}
        >
          <ArrowUpRight size={15} />
        </button>

        <div className="w-[1px] h-4 bg-[#3e3e3e] mx-1" />

        {/* Text */}
        <button
          onClick={() => onSelectTool('text')}
          title="文本批注 (T)"
          className={`p-1.5 rounded transition-colors ${
            activeTool === 'text' ? 'bg-[#0a84ff] text-white' : 'hover:bg-[#383838] text-[#888888]'
          }`}
        >
          <Type size={15} />
        </button>

        {/* Sticky Note */}
        <button
          onClick={() => onSelectTool('note')}
          title="便利贴备注 (N)"
          className={`p-1.5 rounded transition-colors ${
            activeTool === 'note' ? 'bg-[#0a84ff] text-white' : 'hover:bg-[#383838] text-[#888888]'
          }`}
        >
          <StickyNote size={15} />
        </button>

        {/* Signature */}
        <button
          onClick={() => onSelectTool('signature')}
          title="插入签名 (S)"
          className={`p-1.5 rounded transition-colors ${
            activeTool === 'signature' ? 'bg-[#0a84ff] text-white' : 'hover:bg-[#383838] text-[#888888]'
          }`}
        >
          <FileSignature size={15} />
        </button>
      </div>

      {/* Right: Styles (Stroke Color, Fill Color, Stroke Width) */}
      <div className="flex items-center space-x-3 text-xs">
        {/* Stroke Width Picker */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[#888888]">线宽:</span>
          <select
            value={strokeWidth}
            onChange={(e) => onChangeStrokeWidth(Number(e.target.value))}
            className="bg-[#1e1e1e] border border-[#3e3e3e] rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
          >
            <option value={1}>1 pt (细)</option>
            <option value={2}>2 pt (标准)</option>
            <option value={4}>4 pt (粗)</option>
            <option value={8}>8 pt (特粗)</option>
          </select>
        </div>

        {/* Color Palette */}
        <div className="flex items-center space-x-1">
          <Palette size={14} className="text-[#888888] mr-0.5" />
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => onChangeStrokeColor(c)}
              className={`w-4 h-4 rounded-full border transition-transform ${
                strokeColor === c ? 'scale-125 border-white shadow-sm' : 'border-transparent hover:scale-110'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
