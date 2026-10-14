Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Preview (预览) - Windows 原生应用打包构建脚本 (PowerShell)" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# 1. 检查 Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "未检测到 Node.js，请先安装 Node.js (https://nodejs.org/)"
    Exit 1
}

# 2. 检查 Rust 和 Cargo
if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) {
    Write-Error "未检测到 Cargo/Rust，请先安装 Rust (https://rustup.rs/)"
    Exit 1
}

Write-Host "`n[1/3] 安装前端依赖..." -ForegroundColor Yellow
npm install --legacy-peer-deps

Write-Host "`n[2/3] 编译前端生产静态资源..." -ForegroundColor Yellow
npm run build

Write-Host "`n[3/3] 启动 Tauri 打包 Windows 安装包 (.exe / .msi)..." -ForegroundColor Yellow
npm run tauri build

Write-Host "`n===================================================" -ForegroundColor Green
Write-Host " 打包成功完成！" -ForegroundColor Green
Write-Host " 输出文件目录:" -ForegroundColor White
Write-Host "  NSIS .exe 安装包: src-tauri\target\release\bundle\nsis\" -ForegroundColor White
Write-Host "  MSI 安装包:      src-tauri\target\release\bundle\msi\" -ForegroundColor White
Write-Host "===================================================" -ForegroundColor Green
