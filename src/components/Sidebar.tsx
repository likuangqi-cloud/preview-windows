import React from 'react';
import {
  Grid,
  List,
  Highlighter,
  Bookmark,
  Search,
  RotateCw,
  Trash2,
} from 'lucide-react';
import { PreviewDocument, SidebarTab } from '../types';

interface SidebarProps {
  document: PreviewDocument | null;
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  onSelectPage: (index: number) => void;
  onRotatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
  searchQuery: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  document,
  activeTab,
  onSelectTab,
  onSelectPage,
  onRotatePage,
  onDeletePage,
  searchQuery,
}) => {
  if (!document) {
    return (
      <aside className="w-56 bg-[#252526] border-r border-[#333333] flex flex-col items-center justify-center text-[#777777] text-xs">
        无打开的文档
      </aside>
    );
  }

  const pages = document.pages;

  return (
    <aside className="w-60 bg-[#252526] border-r border-[#333333] flex flex-col h-full select-none text-[#cfcfcf]">
      {/* Sidebar Header Mode Switcher */}
      <div className="h-9 border-b border-[#333333] flex items-center justify-around px-2 bg-[#202020]">
        <button
          onClick={() => onSelectTab('thumbnails')}
          title="缩略图"
          className={`p-1 rounded ${activeTab === 'thumbnails' ? 'text-[#0a84ff]' : 'text-[#888888] hover:text-white'}`}
        >
          <Grid size={15} />
        </button>
        <button
          onClick={() => onSelectTab('outline')}
          title="目录 / 大纲"
          className={`p-1 rounded ${activeTab === 'outline' ? 'text-[#0a84ff]' : 'text-[#888888] hover:text-white'}`}
        >
          <List size={15} />
        </button>
        <button
          onClick={() => onSelectTab('highlights')}
          title="高亮与备注"
          className={`p-1 rounded ${activeTab === 'highlights' ? 'text-[#0a84ff]' : 'text-[#888888] hover:text-white'}`}
        >
          <Highlighter size={15} />
        </button>
        <button
          onClick={() => onSelectTab('bookmarks')}
          title="书签"
          className={`p-1 rounded ${activeTab === 'bookmarks' ? 'text-[#0a84ff]' : 'text-[#888888] hover:text-white'}`}
        >
          <Bookmark size={15} />
        </button>
        <button
          onClick={() => onSelectTab('search')}
          title="搜索结果"
          className={`p-1 rounded ${activeTab === 'search' ? 'text-[#0a84ff]' : 'text-[#888888] hover:text-white'}`}
        >
          <Search size={15} />
        </button>
      </div>

      {/* Sidebar Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Tab 1: Thumbnails */}
        {activeTab === 'thumbnails' && (
          <div className="space-y-4">
            {pages.map((page, idx) => {
              const isSelected = idx === document.currentPageIndex;
              return (
                <div
                  key={idx}
                  onClick={() => onSelectPage(idx)}
                  className={`group relative rounded-lg p-2 transition-all cursor-pointer flex flex-col items-center ${
                    isSelected
                      ? 'bg-[#0a84ff]/20 border-2 border-[#0a84ff]'
                      : 'hover:bg-[#333333] border border-transparent'
                  }`}
                >
                  {/* Thumbnail Card */}
                  <div className="w-full aspect-[4/3] bg-[#1a1a1a] rounded overflow-hidden flex items-center justify-center border border-[#3e3e3e] shadow-sm">
                    {page.thumbnailUrl ? (
                      <img
                        src={page.thumbnailUrl}
                        alt={`Page ${idx + 1}`}
                        className="max-h-full max-w-full object-contain pointer-events-none"
                        style={{ transform: `rotate(${page.rotation}deg)` }}
                      />
                    ) : (
                      <div className="text-xs text-[#666666] font-mono">
                        第 {idx + 1} 页
                      </div>
                    )}
                  </div>

                  {/* Page Label & Actions */}
                  <div className="mt-1.5 flex items-center justify-between w-full px-1">
                    <span className="text-xs font-medium text-[#b0b0b0]">
                      {idx + 1}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRotatePage(idx);
                        }}
                        title="单独旋转此页"
                        className="p-0.5 rounded hover:bg-[#444444] text-[#888888] hover:text-white"
                      >
                        <RotateCw size={12} />
                      </button>
                      {pages.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePage(idx);
                          }}
                          title="删除此页"
                          className="p-0.5 rounded hover:bg-[#ff3b30]/30 text-[#888888] hover:text-[#ff3b30]"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Outline */}
        {activeTab === 'outline' && (
          <div className="text-xs space-y-2 text-[#999999]">
            <div className="font-semibold text-white mb-2">目录大纲</div>
            <div className="p-2 hover:bg-[#333333] rounded cursor-pointer text-white flex justify-between">
              <span>封面与引言</span>
              <span className="text-[#666666]">1</span>
            </div>
            <div className="p-2 hover:bg-[#333333] rounded cursor-pointer text-white flex justify-between">
              <span>第 1 章：系统架构概览</span>
              <span className="text-[#666666]">2</span>
            </div>
            <div className="p-2 hover:bg-[#333333] rounded cursor-pointer text-white flex justify-between">
              <span>第 2 章：图形与文档容器</span>
              <span className="text-[#666666]">3</span>
            </div>
          </div>
        )}

        {/* Tab 3: Highlights & Notes */}
        {activeTab === 'highlights' && (
          <div className="text-xs space-y-2">
            <div className="font-semibold text-white mb-2">高亮与批注 ({document.annotations.length})</div>
            {document.annotations.length === 0 ? (
              <div className="text-[#666666] py-4 text-center">暂无批注记录</div>
            ) : (
              document.annotations.map((ann) => (
                <div key={ann.id} className="p-2.5 bg-[#202020] border border-[#333333] rounded-md space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#0a84ff] uppercase text-[10px]">
                      {ann.type}
                    </span>
                    <span className="text-[10px] text-[#777777]">第 {ann.pageIndex + 1} 页</span>
                  </div>
                  <div className="text-white text-xs">{ann.text || `形状标注 (${Math.round(ann.width)}×${Math.round(ann.height)})`}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Bookmarks */}
        {activeTab === 'bookmarks' && (
          <div className="text-xs space-y-2">
            <div className="font-semibold text-white mb-2">书签</div>
            <div className="p-2 bg-[#202020] rounded border border-[#333333] flex items-center justify-between">
              <span>第 1 页书签</span>
              <span className="text-[#777777] text-[10px]">默认</span>
            </div>
          </div>
        )}

        {/* Tab 5: Search Results */}
        {activeTab === 'search' && (
          <div className="text-xs space-y-2">
            <div className="font-semibold text-white mb-2">
              搜索结果 {searchQuery ? `("${searchQuery}")` : ''}
            </div>
            {searchQuery ? (
              <div className="p-2.5 bg-[#202020] rounded border border-[#0a84ff]/30 text-white space-y-1">
                <div className="text-[11px] text-[#0a84ff] font-medium">第 1 页匹配</div>
                <div className="text-xs text-[#cccccc]">
                  ...匹配到关键词 <span className="bg-[#ffcc00] text-black font-semibold px-1 rounded">{searchQuery}</span>...
                </div>
              </div>
            ) : (
              <div className="text-[#666666] py-4 text-center">请输入关键词在文档中搜索</div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
