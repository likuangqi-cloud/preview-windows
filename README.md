# Preview (预览.app) — Complete Cross-Platform Replica

基于 **REA (Reverse Engineer Anything)** 逆向工程分析 macOS 系统内置 `/System/Applications/Preview.app` 得到的架构与交互设计，完全复刻的现代化跨平台桌面应用。

---

## 🔍 REA 逆向工程溯源证据 (Reverse Engineering Provenance)

- **目标载体**: `/System/Applications/Preview.app` (macOS 15.6 Internal SDK, Universal Binary `arm64e` / `x86_64`)
- **核心容器架构 (`Info.plist`)**:
  - `PVPDFContainer`: PDF 多页文档与批注体系
  - `PVImageContainer`: 多格式位图图像容器 (HEIC, TIFF, PNG, JPEG, RAW, WebP)
  - `PVQuickLookContainer`: 快速查看容器
  - `PVC3DContainer` / `PVHydraContainer`: 3D 资产浏览 (SceneKit / USD / GLTF)
- **UI 结构与 NIB 面板对齐**:
  - 统一工具栏: 严格对齐 `CommonToolbar.proplist`（20 项标准操作）
  - 侧边栏: `PVSidebarThumbnails.nib`, `PVSidebarOutline.nib`, `PVSidebarHighlightsAndNotes.nib`, `PVSidebarBookmarks.nib`, `PVSidebarSearchResults.nib`
  - 标记横幅: `PVEditBanner.nib`
  - 调色 HUD 面板: `PVAdjustColor.nib`
  - 尺寸调整面板: `PVDocumentSizing.nib`
  - 检查器窗口: `PVInspectorWindow.nib` (通用属性、Exif、GPS、PDF 指标、批注)

---

## 🛠️ 技术栈架构 (Tech Stack)

```
preview-app/
├── src-tauri/             # Rust 本地高性能核心 (Tauri 2.0)
│   ├── src/main.rs        # Tauri 指令注册与事件派发
│   ├── src/image_ops.rs   # 高质量采样缩放 (Lanczos3)、多格式编码、色阶变换
│   ├── src/metadata.rs    # Kamadak-Exif 解析、相机镜头参数、GPS 坐标映射
│   ├── Cargo.toml         # Rust 依赖声明
│   └── tauri.conf.json    # macOS 原生无边框叠加标题栏窗口配置
│
└── src/                   # 现代化前端界面 (React 18 + TypeScript + Tailwind CSS)
    ├── components/
    │   ├── WindowHeader.tsx        # macOS 风格统一工具栏与红黄绿控制按钮
    │   ├── Sidebar.tsx             # 5 模式侧边栏 (缩略图/大纲/批注/书签/搜索)
    │   ├── CanvasView.tsx          # 画布渲染引擎 (平移/缩放/批注图层/放大镜)
    │   ├── MarkupToolbar.tsx       # 标记工具栏 (涂鸦/矩形/圆/箭头/直线/文本/便签/签名)
    │   ├── AdjustColorModal.tsx    # 实时 RGB & 亮度直方图与 9 维调色 HUD
    │   ├── DocumentSizingModal.tsx # 图像分辨率、长宽比锁定与重采样面板
    │   ├── InspectorWindow.tsx     # 独立检查器实用工具窗口 (Exif/GPS/PDF/批注)
    │   └── ExportModal.tsx         # 多格式转换与导出对话框 (PNG/JPEG/WebP/TIFF/PDF)
    ├── services/
    │   ├── imageService.ts         # 纯前端实时直方图计算与像素级滤镜转换
    │   ├── pdfService.ts           # PDF.js 多页渲染与文本大纲提取
    │   └── sampleData.ts           # 预置高保真照片样本与标注数据
    └── types/index.ts              # 严格类型定义
```

---

## 🚀 运行指南 (Getting Started)

### 1. 快速启动前端开发与预览（无需安装 Rust 环境）

```bash
cd preview-app
npm run dev
# 或预览生产构建
npm run preview
```
打开浏览器访问 `http://127.0.0.1:5173/` 即可立即体验 100% 完整的 Preview 界面与全量交互功能！

### 2. 编译为原生桌面应用 (Tauri + Rust)

如果您的电脑已安装 Rust 与 Cargo：
```bash
cd preview-app
npm run tauri dev
```
将打包生成带 macOS 原生毛玻璃背景与独立窗口的原生桌面应用。

---

## ⌨️ 常用快捷键 (macOS 1:1 对齐)

| 快捷键 | 功能 |
|---|---|
| `⌘ +` / `⌘ -` | 放大 / 缩小画布 |
| `⌘ 0` | 恢复实际大小 (100%) |
| `⌘ 9` | 缩放以适合窗口 |
| `⌘ L` / `⌘ R` | 向左 / 向右旋转 90° |
| `⌘ I` | 显示 / 隐藏检查器 (Inspector) |
| `⌘ ⇧ A` | 显示 / 隐藏标记工具栏 (Markup) |
| `⌥ ⌘ C` | 显示 / 隐藏调色面板 (Adjust Color) |
| `⌘ O` / `Ctrl+O` | 打开本地文件 (支持图片与 PDF) |
| `⌘ E` / `Ctrl+E` | 导出 / 格式转换 |

---

## 🪟 Windows 原生应用打包 (Packaging for Windows)

本工程支持两种打包方式生成 Windows 原生安装程序（`.exe` 和 `.msi`）：

### 方式一：在 Windows 设备上一键本地打包

在任意 Windows 电脑上拉取工程后：
1. 安装 **Node.js** 和 **Rust**（[rustup.rs](https://rustup.rs/)，选择 MSVC 工具链）。
2. 双击运行 `preview-app/build-windows.bat`（或使用 PowerShell 执行 `./build-windows.ps1`）。
3. 编译完成后，安装包将自动输出至：
   - **NSIS 安装包** (`.exe`)：`preview-app/src-tauri/target/release/bundle/nsis/Preview_1.0.0_x64-setup.exe`
   - **MSI 安装包** (`.msi`)：`preview-app/src-tauri/target/release/bundle/msi/Preview_1.0.0_x64_zh-CN.msi`

### 方式二：通过 GitHub Actions 自动云端打包（无需本地 Windows 机器）

仓库已配置好针对 Windows 的自动化编译流程 [`.github/workflows/build-windows.yml`](.github/workflows/build-windows.yml)：
1. 将工程提交并推送到 GitHub 仓库。
2. 在 GitHub 仓库页面的 **Actions** 标签下，点击 **Build Windows Application**。
3. 点击 **Run workflow**，GitHub 将在微软原生的 `windows-latest` 虚拟机中全自动拉取依赖、编译 Rust 后端与前端，并自动打包出最新的 `.exe` 和 `.msi` 压缩包供一键下载。

