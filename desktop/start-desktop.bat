@echo off
chcp 65001 >nul
title FastenerTool Link V2 - 工業桌面可執行檔模式
color 0B

echo ========================================================
echo   FastenerTool Link V2 - 模具沖棒與螺絲工廠即時協同系統
echo   【電腦獨立執行檔模式】正在啟動中...
echo ========================================================
echo.

cd /d "%~dp0\.."

:: 檢查 Node.js 環境
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [錯誤] 系統未檢測到 Node.js 環境！
    echo 請先安裝 Node.js 18+ 或使用免安裝便攜式獨立運行包。
    pause
    exit /b
)

:: 執行桌面獨立啟動器
node desktop/desktop-runner.cjs

if %errorlevel% neq 0 (
    echo.
    echo 啟動時發生錯誤，請按任意鍵檢視日誌...
    pause
)
