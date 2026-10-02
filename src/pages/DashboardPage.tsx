import React from "react";
import { 
  AlertTriangle, 
  Briefcase, 
  FileText, 
  Clock, 
  ShieldAlert, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Sparkles, 
  Activity, 
  TrendingUp, 
  Cpu, 
  Wrench, 
  QrCode, 
  Layers,
  Flame,
  RotateCcw
} from "lucide-react";
import { repository } from "../repositories";

interface DashboardPageProps {
  onNavigate: (view: string, id?: string) => void;
  onOpenNewOrder: () => void;
  onTriggerSeedDemo: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenNewOrder,
  onTriggerSeedDemo
}) => {
  const jobs = repository.getJobs();
  const rfqs = repository.getRFQs();
  const punches = repository.getPunches();
  const ncrs = repository.getNCRs();
  const machines = repository.getMachinePunchStates();
  const messages = repository.getMessages();

  // Metrics
  const pendingRfqs = rfqs.filter((r) => r.status === "submitted" || r.status === "reviewing").length;
  const activeJobs = jobs.filter((j) => j.status === "production" || j.status === "engineering" || j.status === "qc").length;
  const criticalPunches = punches.filter((p) => p.remainingLifePercent <= 15).length;
  const deliveryRisks = jobs.filter((j) => j.riskLevel === "yellow" || j.riskLevel === "red").length;
  const openNcrs = ncrs.filter((n) => n.status !== "closed").length;
  const recentMessagesCount = messages.length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner: Factory Identity & Seed Demo Launcher */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight font-sans">
              今日工廠協同工作台
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 bg-sky-950 border border-sky-500/40 text-sky-300 rounded font-semibold">
              Live Real-time
            </span>
          </div>
          <p className="text-xs text-slate-400">
            螺絲冷鍛廠 (長宏岡山廠) ⟷ 精密模具加工廠 (精耐特本洲廠) · 全流程數位協同
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onTriggerSeedDemo}
            className="px-3.5 py-2 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-all active:scale-95"
            title="一鍵重置並載入 M8 Torx 特斯拉急單示範情境"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span>載入示範情境 (Demo Scenario)</span>
          </button>

          <button
            onClick={onOpenNewOrder}
            className="px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>沖棒線上詢價 / RFQ</span>
          </button>
        </div>
      </div>

      {/* 第一區：待處理即時指標 (Zone 1 - Clickable Counters) */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-sky-400" />
          <span>營運即時態勢 (Zone 1 · KPI Counters)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "待處理 RFQ", count: `${pendingRfqs} 筆`, sub: "線上待報價", icon: FileText, color: "sky", view: "rfqs" },
            { label: "生產中 JOB", count: `${activeJobs} 件`, sub: "加工工單", icon: Briefcase, color: "emerald", view: "jobs" },
            { label: "今日到期/交期", count: "1 筆", sub: "嚴密追蹤", icon: Clock, color: "amber", view: "schedule" },
            { label: "交期風險 (Risk)", count: `${deliveryRisks} 件`, sub: "PVD產能排隊", icon: TrendingUp, color: "rose", view: "jobs" },
            { label: "品質異常 (NCR)", count: `${openNcrs} 案`, sub: "微崩刃調查", icon: AlertTriangle, color: "amber", view: "ncr" },
            { label: "工程訊息", count: `${recentMessagesCount} 則`, sub: "跨廠即時連動", icon: MessageSquare, color: "indigo", view: "messages" }
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                onClick={() => onNavigate(card.view)}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 cursor-pointer transition-all shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">{card.label}</span>
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-sky-400 transition-colors" />
                </div>
                <div className="text-lg font-bold text-white mt-1 font-mono">
                  {card.count}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {card.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 第二區：必須處理項目 (Zone 2 - Must Act Items) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>必須處理事項 (Action Required)</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-mono">
                {criticalPunches + (deliveryRisks > 0 ? 1 : 0) + openNcrs} 件急件
              </span>
            </h3>
          </div>
          <span className="text-xs text-slate-400">點擊卡片直接進入對應工單 / 沖棒履歷</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Action Item 1: Machine Critical Life */}
          <div 
            onClick={() => onNavigate("passport", "PCH-2026-920")}
            className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/80 hover:border-rose-600 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="px-2 py-0.5 rounded bg-rose-900 text-rose-200 font-bold font-mono">
                  沖棒壽命臨界 3.7%
                </span>
                <span className="text-[11px] font-mono text-rose-400 font-semibold">機台 HM-03</span>
              </div>
              <h4 className="text-xs font-bold text-white mt-1 group-hover:text-rose-300">
                PCH-2026-920 (梅花 T6 ASP-60 DLC)
              </h4>
              <p className="text-[11px] text-slate-300 mt-1">
                打擊已達 28,900 衝 (上限 30,000 衝)，需立即通知模具廠備料交件！
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-rose-900/60 flex items-center justify-between text-xs text-rose-300 font-semibold">
              <span>開立急件沖棒換刀</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action Item 2: CAD Revision Pending Review */}
          <div 
            onClick={() => onNavigate("drawings", "DWG-2026-00882")}
            className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-800/80 hover:border-sky-600 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="px-2 py-0.5 rounded bg-sky-900 text-sky-200 font-bold font-mono">
                  CAD Rev.B 待放行
                </span>
                <span className="text-[11px] font-mono text-sky-400">DWG-00882</span>
              </div>
              <h4 className="text-xs font-bold text-white mt-1 group-hover:text-sky-300">
                M8 × 30 Torx 特斯拉底盤螺絲
              </h4>
              <p className="text-[11px] text-slate-300 mt-1">
                成型深增至 1.40mm，同心度公差由 ±0.005mm 改為 ±0.002mm。
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-sky-900/60 flex items-center justify-between text-xs text-sky-300 font-semibold">
              <span>檢視圖面差異並簽核</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action Item 3: Delivery Risk Alert */}
          <div 
            onClick={() => onNavigate("job_detail", "JOB-2026-00882")}
            className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/80 hover:border-amber-600 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="px-2 py-0.5 rounded bg-amber-900 text-amber-200 font-bold font-mono">
                  交期黃燈 (Yellow)
                </span>
                <span className="text-[11px] font-mono text-amber-400">FTL-2026-00882</span>
              </div>
              <h4 className="text-xs font-bold text-white mt-1 group-hover:text-amber-300">
                真空熱處理延誤 +2h 20m · PVD 排程中
              </h4>
              <p className="text-[11px] text-slate-300 mt-1">
                外協鍍膜廠負載率 85%，預估出貨緩衝壓縮，建議專車直送岡山。
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-900/60 flex items-center justify-between text-xs text-amber-300 font-semibold">
              <span>進入工單生產進度與對策</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 第三區 & 第四區：雙欄架構 (Zone 3: 生產進度 Planned vs Actual / Zone 4: AI 智能建議) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Zone 3: 生產進度 (Planned vs Actual) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white">
                在製工單進度與 Planned vs Actual 變異 (Zone 3)
              </h3>
            </div>
            <button
              onClick={() => onNavigate("jobs")}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
            >
              <span>查看全部工單</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => onNavigate("job_detail", job.id)}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-sky-400 group-hover:text-sky-300">
                      {job.jobNumber}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {job.productName}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      job.priority === "rush_critical"
                        ? "bg-rose-950 border border-rose-500 text-rose-300"
                        : job.priority === "urgent"
                        ? "bg-amber-950 border border-amber-500 text-amber-300"
                        : "bg-slate-800 text-slate-300"
                    }`}>
                      {job.priority === "rush_critical" ? "特急單" : job.priority === "urgent" ? "急件" : "一般"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400">交期: <strong className="text-slate-200">{job.plannedDeliveryDate}</strong></span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                      job.riskLevel === "red"
                        ? "bg-rose-950 border border-rose-500 text-rose-300"
                        : job.riskLevel === "yellow"
                        ? "bg-amber-950 border border-amber-500 text-amber-300"
                        : "bg-emerald-950 border border-emerald-500 text-emerald-300"
                    }`}>
                      {job.riskLevel === "red" ? "Risk: RED" : job.riskLevel === "yellow" ? "Risk: YELLOW" : "Risk: GREEN"}
                    </span>
                  </div>
                </div>

                {/* Progress bar and details */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      目前製程: <strong className="text-white">{job.currentStage}</strong>
                    </span>
                    <span className="font-mono font-bold text-sky-400">
                      {job.progressPercent}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        job.riskLevel === "red"
                          ? "bg-gradient-to-r from-rose-500 to-amber-500"
                          : job.riskLevel === "yellow"
                          ? "bg-gradient-to-r from-amber-500 to-sky-500"
                          : "bg-gradient-to-r from-sky-500 to-emerald-500"
                      }`}
                      style={{ width: `${job.progressPercent}%` }}
                    />
                  </div>

                  {job.riskReason && (
                    <div className="text-[11px] text-amber-400/90 flex items-center gap-1.5 mt-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{job.riskReason}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone 4: AI 智能建議與工程決策引擎 (Zone 4) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">
                  Gemini AI 工程決策 (Zone 4)
                </h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700">
                Confidence: High
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* AI Insight 1 */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>沖棒壽命預警：P-3921 已達 62.6% 累積負荷</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  比對歷史 18 批 SCM435 冷鍛工況，ASP-23 AlTiN 沖棒於 3.5 萬衝易產生微裂紋，建議提前安排下批備刀。
                </p>
                <div className="pt-1 flex gap-2">
                  <button 
                    onClick={() => onNavigate("passport", "P-2026-003921")}
                    className="text-[11px] text-sky-400 hover:underline font-semibold"
                  >
                    開啟沖棒履歷
                  </button>
                  <span className="text-slate-600">·</span>
                  <button 
                    onClick={() => onNavigate("ai_failure")}
                    className="text-[11px] text-indigo-400 hover:underline font-semibold"
                  >
                    進行預測性 RCA
                  </button>
                </div>
              </div>

              {/* AI Insight 2 */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>交期瓶頸估算：JOB-00882 可能延遲 2.5h</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  熱處理退火段比原排程多耗時 140 分鐘，外協 PVD 需排隊至清晨 03:00。建議明早改採專車派送岡山。
                </p>
              </div>

              {/* AI Insight 3 */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>CAD Rev.B 比對完成：頭深 +0.20mm</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  尺寸變異符合冷鍛反彈工程經驗模型，同心度公差由 ±0.005mm 縮減至 ±0.002mm，建議准予生產。
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">工業助理隨時待命</span>
            <button
              onClick={() => onNavigate("ai_advisor")}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>啟動 AI 顧問</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
