@echo off
echo ===================================================
echo   Preview (预览) - Windows 原生应用打包构建脚本
echo ===================================================
echo.

REM 1. 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js (推荐 v20 或 v22)。
    pause
    exit /b 1
)

REM 2. 检查 Rust 和 Cargo
where cargo >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Rust/Cargo。
    echo 请访问 https://rustup.rs 下载安装 Rust (x86_64-pc-windows-msvc)。
    pause
    exit /b 1
)

echo [1/3] 安装前端依赖...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo [错误] npm install 失败
    pause
    exit /b %errorlevel%
)

echo [2/3] 编译前端代码...
call npm run build
if %errorlevel% neq 0 (
    echo [错误] npm run build 失败
    pause
    exit /b %errorlevel%
)

echo [3/3] 打包 Tauri Windows 原生安装程序 (.exe 和 .msi)...
call npm run tauri build
if %errorlevel% neq 0 (
    echo [错误] tauri build 失败
    pause
    exit /b %errorlevel%
)

echo.
echo ===================================================
echo  打包完成！生成文件位于:
echo  src-tauri\target\release\bundle\nsis\ (安装包 .exe)
echo  src-tauri\target\release\bundle\msi\  (MSI 安装包)
echo ===================================================
pause
