import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Monitor, CheckCircle2, Download, Laptop, Sparkles, X, ChevronRight } from 'lucide-react';

interface DesktopInstallButtonProps {
  variant?: 'header' | 'sidebar' | 'banner' | 'card';
  onOpenDesktopCenter?: () => void;
}

export const DesktopInstallButton: React.FC<DesktopInstallButtonProps> = ({
  variant = 'header',
  onOpenDesktopCenter
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  const handleInstallClick = async () => {
    if (isInstalled) {
      if (onOpenDesktopCenter) onOpenDesktopCenter();
      return;
    }

    if (isInstallable) {
      setInstalling(true);
      await install();
      setInstalling(false);
    } else if (onOpenDesktopCenter) {
      onOpenDesktopCenter();
    }
  };

  // 1. Variant: Header compact button
  if (variant === 'header') {
    if (isInstalled) {
      return (
        <button
          onClick={onOpenDesktopCenter}
          title="電腦桌面獨立執行檔模式已啟動 (點擊開啟控制台)"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/80 border border-emerald-600/70 text-emerald-300 text-xs font-semibold hover:bg-emerald-900 transition-all shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Monitor className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline">桌面執行檔模式</span>
        </button>
      );
    }

    return (
      <>
        <button
          onClick={isIOS ? () => setShowIOSGuide(true) : handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-sky-950/50 transition-all active:scale-95 animate-pulse"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">安裝為電腦桌面版</span>
          <span className="sm:hidden">桌面版</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-sky-400" />
                  <h3 className="text-sm font-bold text-white">安裝為獨立桌面/主畫面</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 text-xs space-y-2.5 text-slate-300">
                <p>1. 點擊瀏覽器工具列中的 <strong>「分享」</strong> 或 <strong>「設定」</strong> 按鈕。</p>
                <p>2. 選擇 <strong>「安裝 FastenerTool Link」</strong> 或 <strong>「加入主畫面」</strong>。</p>
                <p>3. 即可以無邊框獨立視窗、離線快取於電腦/平板桌面執行！</p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-sky-600 py-2 text-xs font-bold text-white hover:bg-sky-500 transition-colors"
              >
                我知道了
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // 2. Variant: Sidebar widget
  if (variant === 'sidebar') {
    return (
      <div 
        onClick={onOpenDesktopCenter}
        className="mx-3 my-2 p-2.5 rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 hover:border-indigo-500/60 cursor-pointer transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-white group-hover:text-sky-300 transition-colors flex items-center gap-1">
                <span>電腦執行檔模式</span>
                {isInstalled && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
              </div>
              <div className="text-[10px] text-slate-400">
                {isInstalled ? '獨立視窗 · 離線快取就緒' : '點擊安裝 / 啟動便攜版'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    );
  }

  // 3. Variant: Card
  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Monitor className="w-5 h-5 text-sky-400" />
        <div>
          <div className="text-xs font-bold text-white">電腦桌面獨立應用程式</div>
          <div className="text-[11px] text-slate-400">
            {isInstalled ? '已於獨立原生視窗模式執行' : '可建立桌面捷徑並享有離線快取'}
          </div>
        </div>
      </div>
      <button
        onClick={handleInstallClick}
        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold"
      >
        {isInstalled ? '檢視狀態' : '立即安裝'}
      </button>
    </div>
  );
};
