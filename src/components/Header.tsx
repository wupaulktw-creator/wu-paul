import React from "react";
import { Role } from "../types";
import { 
  Factory, 
  Wrench, 
  PlusCircle, 
  Layers, 
  MessageSquare, 
  Cpu, 
  AlertTriangle,
  Activity,
  Search,
  QrCode,
  Bell,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Monitor
} from "lucide-react";
import { DesktopInstallButton } from "./DesktopInstallButton";

interface HeaderProps {
  currentRole: Role;
  onSwitchRole: (role: Role) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenNewOrder: () => void;
  onOpenSearch: () => void;
  onOpenQrScanner: () => void;
  onTriggerSeedDemo: () => void;
  onOpenDesktopMode?: () => void;
  warningCount: number;
  criticalCount: number;
  totalActiveOrders: number;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSwitchRole,
  activeTab,
  onSelectTab,
  onOpenNewOrder,
  onOpenSearch,
  onOpenQrScanner,
  onTriggerSeedDemo,
  onOpenDesktopMode,
  warningCount,
  criticalCount,
  totalActiveOrders,
  unreadNotificationsCount = 2
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top Main Navigation Bar */}
      <div className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Factory Link */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onSelectTab("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-amber-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Wrench className="w-4 h-4 text-sky-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white tracking-tight font-sans">
                  FastenerTool Link
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-sky-950 border border-sky-500/40 text-sky-300 rounded font-semibold">
                  V2 Industrial
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                長宏冷鍛螺絲 ⟷ 精耐特精密模具沖棒
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar Trigger & QR Scanner Button */}
        <div className="flex items-center gap-2 flex-1 max-w-md mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full px-3 py-1.5 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 hover:text-slate-200 flex items-center justify-between transition-colors shadow-inner"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>全域搜尋 (工單 FTL-00882、沖棒 P-3921、圖面...)</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded font-mono">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onOpenQrScanner}
            title="掃描沖棒柄部雷雕 QR Code 調閱數位履歷"
            className="p-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-indigo-400 hover:text-indigo-300 transition-colors shrink-0"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons & Persona Switcher */}
        <div className="flex items-center gap-2">
          {/* Desktop Install / Standalone Mode Button */}
          <DesktopInstallButton 
            variant="header" 
            onOpenDesktopCenter={onOpenDesktopMode} 
          />

          {/* Seed Demo Scenario Button */}
          <button
            onClick={onTriggerSeedDemo}
            title="一鍵載入特斯拉 M8 Torx 特急沖棒示範情境"
            className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-950/70 border border-indigo-700/60 text-indigo-200 text-xs font-semibold hover:bg-indigo-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span>示範情境</span>
          </button>

          {/* Dual Role Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => onSwitchRole("screw_factory")}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all text-[11px] ${
                currentRole === "screw_factory"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Factory className="w-3 h-3" />
              <span>長宏 (買方)</span>
            </button>
            <button
              onClick={() => onSwitchRole("mold_factory")}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all text-[11px] ${
                currentRole === "mold_factory"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Wrench className="w-3 h-3" />
              <span>精耐特 (模具廠)</span>
            </button>
          </div>

          {/* New RFQ Button */}
          <button
            onClick={onOpenNewOrder}
            className="px-3 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow transition-all active:scale-95 shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">線上詢價 / RFQ</span>
            <span className="sm:hidden">詢價</span>
          </button>
        </div>
      </div>
    </header>
  );
};
