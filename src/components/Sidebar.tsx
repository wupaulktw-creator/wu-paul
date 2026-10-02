import React from "react";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Bell, 
  Building2, 
  Package, 
  FileCode2, 
  FileText, 
  Receipt, 
  Briefcase, 
  Cpu, 
  Disc, 
  Wrench, 
  Activity, 
  Kanban, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  FileCheck2, 
  GitBranch, 
  MessageSquare, 
  Clock, 
  Bot, 
  ScanLine, 
  Lightbulb, 
  TrendingUp, 
  ShieldAlert, 
  History, 
  Settings, 
  QrCode,
  Sparkles,
  ChevronRight,
  Monitor
} from "lucide-react";
import { DesktopInstallButton } from "./DesktopInstallButton";

interface SidebarProps {
  activeView: string;
  onSelectView: (view: string) => void;
  unreadNotificationsCount?: number;
  criticalMachineCount?: number;
  activeJobCount?: number;
  pendingRfqCount?: number;
  ncrCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  unreadNotificationsCount = 2,
  criticalMachineCount = 1,
  activeJobCount = 3,
  pendingRfqCount = 1,
  ncrCount = 1
}) => {
  const navSections = [
    {
      title: "WORKSPACE",
      items: [
        { id: "dashboard", label: "今日工廠工作台", icon: LayoutDashboard },
        { id: "my_tasks", label: "待辦派工任務", icon: CheckSquare, badge: "3" },
        { id: "notifications", label: "通知預警中心", icon: Bell, badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : null, badgeColor: "bg-rose-500 text-white animate-pulse" }
      ]
    },
    {
      title: "BUSINESS 業務協同",
      items: [
        { id: "customers", label: "螺絲與模具夥伴", icon: Building2 },
        { id: "products", label: "螺絲扣件規格庫", icon: Package },
        { id: "drawings", label: "工程圖面版本 (Rev)", icon: FileCode2, badge: "Rev.B" },
        { id: "rfqs", label: "RFQ 線上詢價單", icon: FileText, badge: pendingRfqCount > 0 ? `${pendingRfqCount}` : null },
        { id: "quotes", label: "成本拆解報價單", icon: Receipt },
        { id: "jobs", label: "JOB 工單核心", icon: Briefcase, badge: `${activeJobCount}`, badgeColor: "bg-sky-500 text-white font-bold" }
      ]
    },
    {
      title: "TOOLING 模具與沖棒",
      items: [
        { id: "molds", label: "冷鍛成型模具庫", icon: Disc },
        { id: "punches", label: "沖棒清單與庫存", icon: Wrench },
        { id: "passport", label: "沖棒 Digital Passport", icon: QrCode, badge: "QR 履歷", badgeColor: "bg-indigo-600 text-white" },
        { id: "machines", label: "打頭冷鍛機台", icon: Activity, badge: criticalMachineCount > 0 ? "急" : null, badgeColor: "bg-rose-500 text-white" }
      ]
    },
    {
      title: "PRODUCTION 生產管理",
      items: [
        { id: "production_board", label: "在製加工排程看板", icon: Kanban },
        { id: "schedule", label: "12站製程計畫 (P vs A)", icon: Calendar },
        { id: "shopfloor", label: "現場打擊壽命監控", icon: Activity }
      ]
    },
    {
      title: "QUALITY 品質與追溯",
      items: [
        { id: "qc", label: "QC 三次元品檢", icon: ShieldCheck },
        { id: "ncr", label: "品質異常 (NCR)", icon: AlertTriangle, badge: ncrCount > 0 ? `${ncrCount}` : null, badgeColor: "bg-amber-500 text-slate-950 font-bold" },
        { id: "eight_d", label: "8D 永久對策分析", icon: FileCheck2 },
        { id: "traceability", label: "數位履歷全鏈追溯", icon: GitBranch }
      ]
    },
    {
      title: "COLLABORATION 協同溝通",
      items: [
        { id: "messages", label: "工程即時協同室", icon: MessageSquare, badge: "Live" },
        { id: "timeline", label: "全廠事件動態軸", icon: Clock }
      ]
    },
    {
      title: "AI 工業智能引擎",
      items: [
        { id: "ai_advisor", label: "Gemini 模具顧問", icon: Bot, badge: "AI", badgeColor: "bg-gradient-to-r from-sky-500 to-indigo-500 text-white" },
        { id: "ai_drawing", label: "CAD 圖面智能抽取", icon: ScanLine },
        { id: "ai_punch", label: "沖棒智慧選型推薦", icon: Lightbulb },
        { id: "ai_failure", label: "失效診斷與 RCA", icon: ShieldAlert },
        { id: "ai_risk", label: "交期風險預警引擎", icon: TrendingUp }
      ]
    },
    {
      title: "ANALYTICS & ADMIN",
      items: [
        { id: "analytics", label: "營運與品質數據", icon: TrendingUp },
        { id: "desktop_mode", label: "電腦執行檔模式", icon: Monitor, badge: "桌面版", badgeColor: "bg-emerald-600 text-white font-bold" },
        { id: "audit_log", label: "稽核軌跡 Audit Log", icon: History },
        { id: "settings", label: "系統與權限設定", icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-61px)] sticky top-[61px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
      <div className="p-3 space-y-5">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <div className="px-2.5 mb-1.5 text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectView(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? "bg-sky-600/90 text-white shadow-sm font-semibold"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-sky-400"}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold leading-none ${item.badgeColor || "bg-slate-800 text-slate-300"}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Mode Sidebar Widget */}
      <DesktopInstallButton 
        variant="sidebar" 
        onOpenDesktopCenter={() => onSelectView("desktop_mode")} 
      />

      {/* Bottom info badge */}
      <div className="mt-auto p-3 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/40">
        <div className="flex items-center gap-1.5 font-semibold text-sky-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FastenerTool Link V2</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Job-Centric 工業協同平台
        </p>
      </div>
    </aside>
  );
};
