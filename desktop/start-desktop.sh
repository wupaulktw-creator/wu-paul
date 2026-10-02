#!/usr/bin/env bash

# FastenerTool Link V2 - macOS / Linux Desktop Launcher
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$DIR"

echo "========================================================"
echo "  FastenerTool Link V2 - 模具沖棒與螺絲工廠即時協同系統"
echo "  【電腦獨立執行檔模式】正在啟動中..."
echo "========================================================"

if ! command -v node &> /dev/null; then
    echo "[錯誤] 系統未檢測到 Node.js 環境！"
    echo "請先安裝 Node.js 18+ 或使用 PWA 獨立桌面安裝模式。"
    exit 1
fi

node desktop/desktop-runner.cjs
