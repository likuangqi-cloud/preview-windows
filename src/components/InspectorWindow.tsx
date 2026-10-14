import React, { useState } from 'react';
import { X, Info, Camera, MapPin, FileText, Edit } from 'lucide-react';
import { PreviewDocument } from '../types';

interface InspectorWindowProps {
  isOpen: boolean;
  onClose: () => void;
  document: PreviewDocument | null;
}

type InspectorTab = 'general' | 'exif' | 'gps' | 'pdf' | 'annotations';

export const InspectorWindow: React.FC<InspectorWindowProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<InspectorTab>('general');
  const meta = document?.metadata;
  const isPdf = document?.type === 'pdf';

  return (
    <div className="absolute top-16 right-16 w-88 bg-[#282828]/95 backdrop-blur-xl border border-[#444444] rounded-xl shadow-2xl z-50 select-none text-[#cfcfcf] p-4 text-xs">
      {/* Title Bar */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#3e3e3e]">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] cursor-pointer" onClick={onClose} />
          <span className="font-semibold text-white tracking-wide">检查器 (Inspector)</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-[#383838] rounded text-[#888888] hover:text-white">
          <X size={14} />
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center justify-around border-b border-[#3e3e3e] py-2 bg-[#202020] rounded-lg mt-2 px-1">
        <button
          onClick={() => setActiveTab('general')}
          title="常规信息"
          className={`p-1.5 rounded transition-colors ${activeTab === 'general' ? 'bg-[#383838] text-[#0a84ff]' : 'text-[#888888] hover:text-white'}`}
        >
          <Info size={15} />
        </button>
        {!isPdf && (
          <button
            onClick={() => setActiveTab('exif')}
            title="Exif 属性"
            className={`p-1.5 rounded transition-colors ${activeTab === 'exif' ? 'bg-[#383838] text-[#0a84ff]' : 'text-[#888888] hover:text-white'}`}
          >
            <Camera size={15} />
          </button>
        )}
        {!isPdf && meta?.latitude && (
          <button
            onClick={() => setActiveTab('gps')}
            title="GPS 位置"
            className={`p-1.5 rounded transition-colors ${activeTab === 'gps' ? 'bg-[#383838] text-[#0a84ff]' : 'text-[#888888] hover:text-white'}`}
          >
            <MapPin size={15} />
          </button>
        )}
        {isPdf && (
          <button
            onClick={() => setActiveTab('pdf')}
            title="PDF 属性"
            className={`p-1.5 rounded transition-colors ${activeTab === 'pdf' ? 'bg-[#383838] text-[#0a84ff]' : 'text-[#888888] hover:text-white'}`}
          >
            <FileText size={15} />
          </button>
        )}
        <button
          onClick={() => setActiveTab('annotations')}
          title="批注"
          className={`p-1.5 rounded transition-colors ${activeTab === 'annotations' ? 'bg-[#383838] text-[#0a84ff]' : 'text-[#888888] hover:text-white'}`}
        >
          <Edit size={15} />
        </button>
      </div>

      {/* Tab Contents */}
      <div className="mt-3 space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {/* Tab: General */}
        {activeTab === 'general' && (
          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">文件名称:</span>
              <span className="text-white font-medium truncate max-w-[180px]">{document?.name || '无'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">文档格式:</span>
              <span className="text-white font-mono">{meta?.format || 'Unknown'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">文件大小:</span>
              <span className="text-white font-mono">
                {document ? (document.fileSizeBytes / (1024 * 1024)).toFixed(2) + ' MB' : '0 KB'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">图像尺寸:</span>
              <span className="text-white font-mono">
                {meta?.dimensions.width} × {meta?.dimensions.height} 像素
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">色彩空间:</span>
              <span className="text-white">{meta?.colorSpace || 'RGB'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">分辨率:</span>
              <span className="text-white font-mono">{meta?.resolutionDpi || 72} DPI</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">创建时间:</span>
              <span className="text-white font-mono">{meta?.createdAt || '2026-10-12 18:42:15'}</span>
            </div>
          </div>
        )}

        {/* Tab: Exif */}
        {activeTab === 'exif' && (
          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">相机品牌:</span>
              <span className="text-white">{meta?.make || 'Apple'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">设备型号:</span>
              <span className="text-white">{meta?.model || 'iPhone 16 Pro Max'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">镜头型号:</span>
              <span className="text-white truncate max-w-[170px]">{meta?.lensModel || '24mm f/1.78'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">快门速度:</span>
              <span className="text-white font-mono">{meta?.exposureTime || '1/320s'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">光圈值:</span>
              <span className="text-white font-mono">{meta?.fNumber || 'f/1.78'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">感光度 (ISO):</span>
              <span className="text-white font-mono">{meta?.iso || 'ISO 50'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">等效焦距:</span>
              <span className="text-white font-mono">{meta?.focalLength || '24mm'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">闪光灯:</span>
              <span className="text-white">{meta?.flash || '未开启'}</span>
            </div>
          </div>
        )}

        {/* Tab: GPS */}
        {activeTab === 'gps' && (
          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">纬度 (Latitude):</span>
              <span className="text-white font-mono">{meta?.latitude?.toFixed(6) || '37.745500'}° N</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">经度 (Longitude):</span>
              <span className="text-white font-mono">{meta?.longitude?.toFixed(6) || '-119.593600'}° W</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">海拔 (Altitude):</span>
              <span className="text-white font-mono">{meta?.altitude || 1220.5} 米</span>
            </div>
            <div className="pt-2">
              <a
                href={`https://maps.apple.com/?q=${meta?.latitude || 37.7455},${meta?.longitude || -119.5936}`}
                target="_blank"
                rel="noreferrer"
                className="block text-center py-1.5 bg-[#0a84ff] text-white rounded font-medium hover:bg-[#0070e0] transition-colors"
              >
                在地图中查看定位
              </a>
            </div>
          </div>
        )}

        {/* Tab: PDF */}
        {activeTab === 'pdf' && (
          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">PDF 版本:</span>
              <span className="text-white font-mono">{meta?.pdfVersion || 'PDF 1.7'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">总页数:</span>
              <span className="text-white font-mono">{meta?.pageCount || 1} 页</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">生产者 (Producer):</span>
              <span className="text-white truncate max-w-[170px]">{meta?.producer || 'macOS Quartz / PDFKit'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#333333]">
              <span className="text-[#888888]">加密状态:</span>
              <span className="text-[#34c759] font-medium">{meta?.isEncrypted ? '已加密' : '未加密'}</span>
            </div>
          </div>
        )}

        {/* Tab: Annotations */}
        {activeTab === 'annotations' && (
          <div className="space-y-2 text-[11px]">
            <div className="text-[#888888]">当前共有 {document?.annotations.length || 0} 个标记</div>
            {document?.annotations.map((ann, idx) => (
              <div key={ann.id} className="p-2 bg-[#202020] rounded border border-[#333333] flex justify-between items-center">
                <span className="text-white font-medium">#{idx + 1} {ann.type}</span>
                <span className="text-[#888888] font-mono">
                  {Math.round(ann.x)}, {Math.round(ann.y)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
