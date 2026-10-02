import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, HardDrive, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-950/95 border border-amber-600 px-3.5 py-2 text-xs font-medium text-amber-200 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-2">
      <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
      <div>
        <span className="font-bold">離線模式運作中：</span>
        <span className="text-amber-300/90 ml-1">現場資料已由本地 Service Worker 與 LocalStorage 自動雙重快取</span>
      </div>
    </div>
  );
};
