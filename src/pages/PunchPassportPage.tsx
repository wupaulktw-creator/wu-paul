import React, { useState } from "react";
import { 
  QrCode, 
  ArrowLeft, 
  Wrench, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  History, 
  Play, 
  Square, 
  RotateCw, 
  Sparkles, 
  Trash2, 
  Send,
  Cpu,
  Layers,
  CheckCircle2
} from "lucide-react";
import { repository } from "../repositories";
import { Punch, PunchStatus } from "../types";

interface PunchPassportPageProps {
  punchId: string;
  onBack: () => void;
  onNavigateToJob: (jobId: string) => void;
}

export const PunchPassportPage: React.FC<PunchPassportPageProps> = ({
  punchId,
  onBack,
  onNavigateToJob
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "history" | "machines" | "jobs" | "maintenance" | "qc" | "ncr" | "timeline"
  >("overview");

  const [currentPunch, setCurrentPunch] = useState<Punch>(() => {
    return repository.getPunchById(punchId) || repository.getPunches()[0];
  });

  const handleUpdateStatus = (status: PunchStatus) => {
    const updated = repository.updatePunch(currentPunch.id, { status });
    if (updated) {
      setCurrentPunch({ ...updated });
    }
  };

  const handleSimulateHits = (increment: number) => {
    const newHits = currentPunch.currentHits + increment;
    const updated = repository.updatePunchHits(currentPunch.id, newHits);
    if (updated) {
      setCurrentPunch({ ...updated });
    }
  };

  const tabs = [
    { id: "overview", label: "沖棒基材與規格", icon: Wrench },
    { id: "history", label: "打擊衝次歷程", icon: Activity, badge: `${currentPunch.currentHits.toLocaleString()}` },
    { id: "machines", label: "機台裝拆紀錄", icon: Layers },
    { id: "jobs", label: "生產關聯工單", icon: History, badge: "FTL-00882" },
    { id: "maintenance", label: "修磨與重新鍍膜", icon: RotateCw },
    { id: "qc", label: "出廠與在線檢驗", icon: ShieldCheck },
    { id: "ncr", label: "失效異常紀錄", icon: AlertTriangle, badge: "1案" },
    { id: "timeline", label: "全歷程事件鏈", icon: Clock }
  ];

  return (
    <div className="space-y-5 pb-16 animate-in fade-in duration-200">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回上一頁</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 font-mono text-xs flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5" />
            <span>柄部雷射雕刻數位履歷碼：{currentPunch.punchNumber}</span>
          </span>
        </div>
      </div>

      {/* Main Passport Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            {/* Visual QR Code Box */}
            <div className="p-3 bg-white rounded-xl shrink-0 shadow-md">
              <QrCode className="w-16 h-16 text-slate-950" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-2xl font-black text-amber-400">
                  {currentPunch.punchNumber}
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700">
                  {currentPunch.coating} 紫黑鍍膜
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded font-mono font-bold ${
                  currentPunch.status === "in_use"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                    : currentPunch.status === "scrap"
                    ? "bg-rose-950 text-rose-300 border border-rose-700"
                    : "bg-slate-800 text-slate-300"
                }`}>
                  狀態: {currentPunch.status.toUpperCase()}
                </span>
              </div>

              <div className="text-xs text-slate-300">
                <span>基材: <strong className="text-white font-mono">{currentPunch.material}</strong></span>
                <span className="mx-2">·</span>
                <span>硬度: <strong className="text-white font-mono">{currentPunch.hardness}</strong></span>
                <span className="mx-2">·</span>
                <span>同心度: <strong className="text-emerald-400 font-mono">{currentPunch.concentricity}</strong></span>
                <span className="mx-2">·</span>
                <span>適用: <strong className="text-sky-300">{currentPunch.applicableProduct}</strong></span>
              </div>

              <div className="text-[11px] text-slate-400">
                出廠日期: {currentPunch.manufacturedDate} · 製造商: 精耐特模具 (本洲廠)
              </div>
            </div>
          </div>

          {/* Life Percent Box */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-right sm:min-w-[200px]">
            <span className="text-[11px] text-slate-400 font-mono uppercase">剩餘壽命比例</span>
            <div className={`text-3xl font-black font-mono mt-0.5 ${
              currentPunch.remainingLifePercent <= 15
                ? "text-rose-400"
                : currentPunch.remainingLifePercent <= 40
                ? "text-amber-400"
                : "text-emerald-400"
            }`}>
              {currentPunch.remainingLifePercent}%
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              {currentPunch.currentHits.toLocaleString()} / {currentPunch.expectedLifeHits.toLocaleString()} hits
            </div>
          </div>
        </div>

        {/* Visual Life Meter Bar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              打擊衝次進度 (Hits Counter)
            </span>
            <span className="text-slate-200">
              已使用: {Math.round((currentPunch.currentHits / currentPunch.expectedLifeHits) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                currentPunch.remainingLifePercent <= 15
                  ? "bg-rose-500"
                  : currentPunch.remainingLifePercent <= 40
                  ? "bg-gradient-to-r from-emerald-500 via-amber-500 to-amber-400"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(100, (currentPunch.currentHits / currentPunch.expectedLifeHits) * 100)}%` }}
            />
          </div>
        </div>

        {/* 6 Action Buttons (Section 28) */}
        <div className="flex items-center gap-2 flex-wrap pt-2">
          <button
            onClick={() => handleUpdateStatus("in_use")}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>開始使用 (裝機打頭)</span>
          </button>

          <button
            onClick={() => handleUpdateStatus("standby")}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Square className="w-3.5 h-3.5" />
            <span>停止使用 (卸刀入庫)</span>
          </button>

          <button
            onClick={() => handleUpdateStatus("regrinding")}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>送修磨 (Regrinding)</span>
          </button>

          <button
            onClick={() => handleUpdateStatus("recoating")}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>送重新鍍膜 (PVD)</span>
          </button>

          <button
            onClick={() => handleUpdateStatus("qc_pending")}
            className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>送檢驗室 (QC)</span>
          </button>

          <button
            onClick={() => handleUpdateStatus("scrap")}
            className="px-3.5 py-1.5 rounded-lg bg-rose-950 border border-rose-800 hover:bg-rose-900 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>報廢 (Scrap)</span>
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin border-b border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300"
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-sm min-h-[380px]">
        {/* 1. Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400">幾何參數與規格</span>
                <div className="text-sm font-bold text-white mt-1">二衝成型 梅花 (Torx T40)</div>
                <div className="text-xs text-slate-400 mt-1">外徑 OD: 14.0mm · 刃部深度 1.40mm</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400">同心度要求 (Concentricity)</span>
                <div className="text-sm font-bold text-emerald-400 mt-1 font-mono">{currentPunch.concentricity}</div>
                <div className="text-xs text-slate-400 mt-1">雷射全跳動檢驗合格</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400">熱處理與硬度</span>
                <div className="text-sm font-bold text-amber-400 mt-1 font-mono">{currentPunch.hardness}</div>
                <div className="text-xs text-slate-400 mt-1">真空淬火 + 3次回火超深冷處理</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400">推薦冷鍛潤滑油</span>
                <div className="text-sm font-bold text-sky-400 mt-1">高極壓氯化合成冷鍛油</div>
                <div className="text-xs text-slate-400 mt-1">黏度 46cSt · 噴油壓力 ≥ 4.5 bar</div>
              </div>
            </div>

            {/* Quick Simulate Hits tool for Demo testing */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white">示範機台打擊模擬 (Simulate Punch Hits)</span>
                <p className="text-[11px] text-slate-400 mt-0.5">點擊即時增加打擊次數並觸發壽命曲線更新</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSimulateHits(1000)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 rounded-lg"
                >
                  +1,000 衝
                </button>
                <button
                  onClick={() => handleSimulateHits(5000)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 rounded-lg"
                >
                  +5,000 衝
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. History */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">沖棒打擊衝次歷程 (Strike History)</h4>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-300">2026/09/18 08:30 ~ 16:00 (日班)</span>
                <span className="font-mono text-sky-400 font-bold">+18,400 衝 (HM-01 機台)</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-300">2026/09/17 20:00 ~ 04:30 (夜班)</span>
                <span className="font-mono text-sky-400 font-bold">+12,880 衝 (HM-01 機台)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>累計打擊總數</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">{currentPunch.currentHits.toLocaleString()} hits</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. Machines */}
        {activeTab === "machines" && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">機台裝卸紀錄 (Machine Mounting Logs)</h4>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-400">HM-01 (中聯 2 模 4 衝 螺絲成型機)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">目前在裝</span>
              </div>
              <p className="text-slate-300">安裝日期: 2026/09/17 19:30 · 安裝工程師: 長宏現場 謝組長</p>
              <p className="text-slate-400">夾持套筒校驗跳動: 0.0016 mm (在 0.003mm 限度內)</p>
            </div>
          </div>
        )}

        {/* 4. Jobs */}
        {activeTab === "jobs" && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">關聯生產工單 (Associated Jobs)</h4>
            <div 
              onClick={() => onNavigateToJob("JOB-2026-00882")}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs space-y-2 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sky-400 group-hover:text-sky-300">FTL-2026-00882</span>
                <span className="text-slate-400">交期: 2026/09/25</span>
              </div>
              <p className="text-slate-200 font-semibold">M8 × 30 梅花頭內六角螺絲 (特斯拉底盤特急件)</p>
              <div className="text-slate-400">數量: 20,000 pcs · 進度: 68%</div>
            </div>
          </div>
        )}

        {/* 5. Maintenance */}
        {activeTab === "maintenance" && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">修磨與維護履歷 (Regrinding & Maintenance)</h4>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400">第一次微修磨 (Regrind #1)</span>
                <span className="text-slate-400 font-mono">2026/09/10</span>
              </div>
              <p className="text-slate-300">端面修磨研磨量: 0.03mm · 光學投影同心度維持 0.0018mm</p>
              <p className="text-slate-400">修磨廠: 精耐特模具技術中心 (研磨組 陳技師)</p>
            </div>
          </div>
        )}

        {/* 6. QC */}
        {activeTab === "qc" && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">三次元投影檢驗與出廠合格證 (QC Certificate)</h4>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-white">QC-20260905-01 (出廠終檢)</span>
                <span className="text-emerald-400 font-bold">判定: PASS</span>
              </div>
              <div className="text-slate-300">同心度: 0.0018mm · 硬度: 64.5 HRC · 鍍膜厚度: 2.8μm</div>
            </div>
          </div>
        )}

        {/* 7. NCR */}
        {activeTab === "ncr" && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">異常失效記錄 (NCRs)</h4>
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-rose-300">NCR-2026-0042</span>
                <span className="text-rose-400">沖棒微崩刃 (Chipping)</span>
              </div>
              <p className="text-slate-300">31,280 衝時刃口微崩 0.08mm，已啟動 8D 分析升級 ASP-23 AlTiN。</p>
            </div>
          </div>
        )}

        {/* 8. Timeline */}
        {activeTab === "timeline" && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">沖棒全生命週期事件鏈 (Punch Digital Timeline)</h4>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800 text-xs">
              <div className="relative">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-slate-900" />
                <span className="text-slate-400 font-mono text-[10px]">2026/09/18 16:00</span>
                <p className="text-slate-200 font-semibold mt-0.5">打擊達到 31,280 衝，觸發 AI 預警提醒模具廠預備下一把備刀</p>
              </div>
              <div className="relative">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-slate-900" />
                <span className="text-slate-400 font-mono text-[10px]">2026/09/17 19:30</span>
                <p className="text-slate-200 font-semibold mt-0.5">安裝上線至岡山廠 HM-01 機台二衝座，啟動特斯拉急單冷鍛生產</p>
              </div>
              <div className="relative">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-sky-500 ring-4 ring-slate-900" />
                <span className="text-slate-400 font-mono text-[10px]">2026/09/15 11:20</span>
                <p className="text-slate-200 font-semibold mt-0.5">歐瑞康完成 AlTiN 紫黑耐熱鍍膜加工，經三次元投影同心度 0.0018mm 合格出廠</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
