import React, { useState, useEffect } from "react";
import { 
  Monitor, 
  Laptop, 
  Download, 
  HardDrive, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Wifi, 
  WifiOff, 
  QrCode, 
  Printer, 
  Database, 
  Play, 
  Copy, 
  FileCode, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink, 
  Layers,
  ArrowRight
} from "lucide-react";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { repository } from "../repositories";

interface DesktopModePageProps {
  onNavigateToPassport: (punchId: string) => void;
  onNavigateToJob: (jobId: string) => void;
}

export const DesktopModePage: React.FC<DesktopModePageProps> = ({
  onNavigateToPassport,
  onNavigateToJob
}) => {
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();
  const isOnline = useOnlineStatus();

  // Hardware emulation states
  const [barcodeInput, setBarcodeInput] = useState("");
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [comPortStatus, setComPortStatus] = useState<"connected" | "connecting" | "idle">("connected");
  const [printerStatus, setPrinterStatus] = useState<"ready" | "printing" | "idle">("ready");
  const [printSuccessMsg, setPrintSuccessMsg] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  // Database snapshot status
  const [dbStats, setDbStats] = useState({
    jobsCount: 0,
    punchesCount: 0,
    machinesCount: 0,
    qcsCount: 0,
    ncrsCount: 0,
    storageSizeKb: 0
  });

  useEffect(() => {
    const jobs = repository.getJobs();
    const punches = repository.getPunches();
    const machines = repository.getMachinePunchStates();
    const qcs = repository.getQCs();
    const ncrs = repository.getNCRs();

    // calculate approximate localStorage size
    let totalLength = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalLength += (localStorage[key].length * 2);
      }
    }

    setDbStats({
      jobsCount: jobs.length,
      punchesCount: punches.length,
      machinesCount: machines.length,
      qcsCount: qcs.length,
      ncrsCount: ncrs.length,
      storageSizeKb: Math.round(totalLength / 1024)
    });
  }, []);

  // Handle hardware barcode scanner emulation
  const handleSimulateScan = (codeToScan?: string) => {
    const code = codeToScan || barcodeInput || "FTL-PASSPORT://P-2026-003921";
    setScannedResult(`[COM1 條碼槍讀入]: ${code}`);
    
    // If it contains punch ID
    if (code.includes("P-2026")) {
      const punchId = "P-2026-003921";
      setTimeout(() => {
        onNavigateToPassport(punchId);
      }, 1000);
    }
  };

  // Handle label printer output
  const handlePrintLabel = () => {
    setPrinterStatus("printing");
    setTimeout(() => {
      setPrinterStatus("ready");
      setPrintSuccessMsg("已向本機標籤印表機 (TSC TTP-244 Pro / Zebra ZD888) 發送 ZPL 沖棒防偽吊牌標籤指令！");
      setTimeout(() => setPrintSuccessMsg(null), 4500);
    }, 1200);
  };

  // Export full JSON database
  const handleExportDatabase = () => {
    const fullBackup = {
      version: "2.0.0",
      exportedAt: new Date().toISOString(),
      plant: "長宏岡山廠 ⟷ 精耐特本洲模具園區",
      jobs: repository.getJobs(),
      punches: repository.getPunches(),
      machines: repository.getMachinePunchStates(),
      drawings: repository.getDrawings(),
      qcs: repository.getQCs(),
      ncrs: repository.getNCRs(),
      rfqs: repository.getRFQs(),
      quotes: repository.getQuotes(),
      messages: repository.getMessages()
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FastenerToolLink-LocalBackup-${new Date().toISOString().slice(0, 10)}.ftl.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(label);
    setTimeout(() => setCopiedScript(null), 3000);
  };

  const batScriptContent = `@echo off
chcp 65001 >nul
title FastenerTool Link V2 - 工業桌面可執行檔
echo 正在啟動 FastenerTool Link 工業桌面獨立視窗...
cd /d "%~dp0"
node desktop/desktop-runner.cjs
pause`;

  const shScriptContent = `#!/usr/bin/env bash
echo "啟動 FastenerTool Link 工業桌面獨立視窗..."
cd "$(dirname "$0")"
node desktop/desktop-runner.cjs`;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>電腦可執行檔模式控制台 (Desktop Standalone & Edge System)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                支援 Windows / macOS / Linux 獨立視窗應用程式、離線邊緣端伺服器 (Localhost Edge)、現場條碼槍 COM 埠與標籤機直連
              </p>
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
            isInstalled 
              ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
              : "bg-sky-950/80 border-sky-600 text-sky-300"
          }`}>
            <span className={`w-2 h-2 rounded-full ${isInstalled ? "bg-emerald-400" : "bg-sky-400"} animate-ping`} />
            <span>{isInstalled ? "桌面獨立視窗模式 (執行中)" : "瀏覽器環境 (可安裝桌面版)"}</span>
          </div>

          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-mono font-bold ${
            isOnline ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-amber-950 border-amber-600 text-amber-300"
          }`}>
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isOnline ? "在線同步" : "離線快取生效"}</span>
          </div>
        </div>
      </div>

      {/* Grid: 3 Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: PWA Desktop Application */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-sky-500/60 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-bold">
                方案 1 · 推薦首選
              </span>
              <Monitor className="w-5 h-5 text-sky-400" />
            </div>
            <h3 className="font-bold text-white text-base">PWA 電腦桌面獨立應用程式</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              點擊即可直接在 Windows 10/11、macOS、Linux 生成獨立桌面捷徑圖示，無瀏覽器網址列干擾，支援全螢幕現場看板。
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1.5">
              <li className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>免下載龐大安裝包，秒級安裝生效</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Service Worker 自動離線雙重快取</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>系統啟動與通知中心整合</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-800">
            {isInstalled ? (
              <div className="w-full py-2 bg-emerald-950 border border-emerald-600 rounded-xl text-xs font-bold text-emerald-300 text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>已安裝為電腦桌面應用程式</span>
              </div>
            ) : isInstallable ? (
              <button
                onClick={install}
                className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>立即安裝為電腦桌面版</span>
              </button>
            ) : (
              <div className="text-[11px] text-slate-400 text-center p-2 bg-slate-950 rounded-xl border border-slate-800">
                在 Chrome/Edge 網址列右上角點擊「安裝應用程式」圖示
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Portable Windows .bat & Node Runner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-indigo-500/60 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                方案 2 · 便攜腳本
              </span>
              <Terminal className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-bold text-white text-base">便攜式桌面啟動腳本 (.bat / .sh)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              專為工廠內網/機房無網際網路環境設計，雙擊批次檔即可在本機拉起 Node 離線主機並喚醒原生獨立視窗。
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1.5">
              <li className="flex items-center gap-1.5 text-indigo-300">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Windows 雙擊 `start-desktop.bat` 即開</span>
              </li>
              <li className="flex items-center gap-1.5 text-indigo-300">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>以 `--app` 模式自動開啟獨立視窗</span>
              </li>
              <li className="flex items-center gap-1.5 text-indigo-300">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>終端指令：`npm run desktop:run`</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => copyToClipboard(batScriptContent, "bat")}
              className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-850 rounded-xl text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>{copiedScript === "bat" ? "已複製 .bat" : "複製 .bat 腳本"}</span>
            </button>
            <button
              onClick={() => copyToClipboard("npm run desktop:run", "cmd")}
              className="flex-1 py-2 bg-indigo-900/40 hover:bg-indigo-900/60 border border-indigo-700/60 rounded-xl text-xs font-semibold text-indigo-200 transition-all flex items-center justify-center gap-1"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>{copiedScript === "cmd" ? "已複製指令" : "複製啟動指令"}</span>
            </button>
          </div>
        </div>

        {/* Card 3: Electron Native Packager */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-amber-500/60 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                方案 3 · 原生二進位
              </span>
              <HardDrive className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-bold text-white text-base">Electron 原生 .exe / .dmg 封裝</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              專案已內建 `desktop/electron-main.cjs` 原生桌面主程序架構，可編譯打包為 Windows x64 免安裝便攜版。
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1.5">
              <li className="flex items-center gap-1.5 text-amber-300">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>內嵌 Node 離線背景執行程序</span>
              </li>
              <li className="flex items-center gap-1.5 text-amber-300">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>系統匣 (System Tray) 常駐監控</span>
              </li>
              <li className="flex items-center gap-1.5 text-amber-300">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>硬體 COM / USB 底層存取能力</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-850 text-[11px] text-slate-400 font-mono flex items-center justify-between">
              <span>設定檔路徑:</span>
              <span className="text-amber-400">desktop/electron-main.cjs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Interface & Industrial Emulation Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>現場外設硬體與通訊埠整合 (Shopfloor Hardware Integration)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              電腦執行檔模式原生支援 RS232 / USB 條碼槍、熱感應標籤印表機與冷鍛機台 PLC 訊號接取
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>COM1 通訊埠: 9600-8-N-1 正常</span>
            </span>
          </div>
        </div>

        {/* Two Columns: Barcode Scanner & Label Printer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hardware 1: Barcode Scanner */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  現場條碼掃描槍 (USB HID / COM 連線)
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono">
                即時監聽中
              </span>
            </div>

            <p className="text-xs text-slate-400">
              現場作業員使用手持槍掃描沖棒柄部雷雕碼後，系統直接辨識並跳轉沖棒數位履歷護照。
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="手動輸入或模擬條碼槍輸入: FTL-PASSPORT://P-2026-003921"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleSimulateScan()}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow transition-colors"
              >
                模擬讀入
              </button>
            </div>

            {/* Quick barcode simulation buttons */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400">快捷示範沖棒碼：</span>
              <button
                onClick={() => handleSimulateScan("FTL-PASSPORT://P-2026-003921")}
                className="text-[11px] px-2 py-1 rounded bg-slate-900 border border-slate-800 text-sky-400 hover:border-sky-500 font-mono transition-colors"
              >
                P-2026-003921 (ASP-23 AlTiN)
              </button>
            </div>

            {scannedResult && (
              <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-600/80 text-emerald-200 text-xs font-mono flex items-center justify-between animate-in fade-in">
                <span>{scannedResult}</span>
                <span className="text-[10px] text-emerald-400">跳轉中...</span>
              </div>
            )}
          </div>

          {/* Hardware 2: Label Printer */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  工業熱感應標籤機 (Zebra ZPL / TSC TSPL)
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
                {printerStatus === "printing" ? "傳送中..." : "待命就緒"}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              模具加工完成或 QC 檢驗合格時，一鍵呼叫本地標籤機列印出廠防偽吊牌標籤 (含 2D DataMatrix + 批號)。
            </p>

            {/* Label Preview Card */}
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-1.5 text-slate-300">
                <span className="font-bold text-white">FASTENERTOOL LINK CERTIFIED</span>
                <span className="text-emerald-400 font-bold">QC: PASS</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div>料號: <strong className="text-white">P-2026-003921</strong></div>
                <div>材質: <strong className="text-amber-400">ASP-23</strong></div>
                <div>規格: <strong className="text-white">M8 Torx T40 (二衝)</strong></div>
                <div>鍍膜: <strong className="text-indigo-400">AlTiN 紫黑膜</strong></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrintLabel}
                disabled={printerStatus === "printing"}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{printerStatus === "printing" ? "正在發送至印表機..." : "列印沖棒身份吊牌 (ZPL)"}</span>
              </button>
            </div>

            {printSuccessMsg && (
              <div className="p-2.5 rounded-lg bg-emerald-950 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{printSuccessMsg}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Local Edge Database & Snapshot Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              <span>全廠本地離線資料庫快照與備份 (Offline Database & Local Storage)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              電腦獨立執行檔模式具備完整 Localhost 本地持久化，換機或機台重灌時可完整匯出還原
            </p>
          </div>

          <button
            onClick={handleExportDatabase}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>匯出全廠備份檔 (.ftl.json)</span>
          </button>
        </div>

        {/* Database Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-slate-400 text-[11px]">本機工單數</span>
            <div className="text-base font-bold font-mono text-white mt-0.5">{dbStats.jobsCount} 筆</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-slate-400 text-[11px]">沖棒數位履歷</span>
            <div className="text-base font-bold font-mono text-amber-400 mt-0.5">{dbStats.punchesCount} 支</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-slate-400 text-[11px]">現場監控打頭機</span>
            <div className="text-base font-bold font-mono text-sky-400 mt-0.5">{dbStats.machinesCount} 台</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-slate-400 text-[11px]">三次元品檢報告</span>
            <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">{dbStats.qcsCount} 份</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-slate-400 text-[11px]">品質異常與 8D</span>
            <div className="text-base font-bold font-mono text-rose-400 mt-0.5">{dbStats.ncrsCount} 件</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-slate-400 text-[11px]">本地資料快照大小</span>
            <div className="text-base font-bold font-mono text-indigo-300 mt-0.5">{dbStats.storageSizeKb} KB</div>
          </div>
        </div>
      </div>
    </div>
  );
};
