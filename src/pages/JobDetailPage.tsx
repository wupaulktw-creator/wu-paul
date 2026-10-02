import React, { useState } from "react";
import { 
  Briefcase, 
  ArrowLeft, 
  FileCode2, 
  Disc, 
  Wrench, 
  Kanban, 
  ShieldCheck, 
  AlertTriangle, 
  MessageSquare, 
  Clock, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  User, 
  Cpu, 
  Sparkles, 
  ChevronRight,
  Send,
  QrCode,
  ArrowUpRight,
  Layers,
  Shield,
  FileCheck2
} from "lucide-react";
import { repository } from "../repositories";
import { STAGE_CONFIGS } from "../mockData";
import { OrderStage } from "../types";

interface JobDetailPageProps {
  jobId: string;
  onBack: () => void;
  onNavigateToPunch: (punchId: string) => void;
  onNavigateToDrawing: (drawingId: string) => void;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({
  jobId,
  onBack,
  onNavigateToPunch,
  onNavigateToDrawing
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "drawing" | "mold" | "punch" | "production" | "qc" | "ncr" | "messages" | "timeline" | "documents"
  >("overview");
  const [newMsg, setNewMsg] = useState("");

  const job = repository.getJobById(jobId) || repository.getJobs()[0];
  const drawing = repository.getDrawingById(job.drawingId || "DWG-2026-00882");
  const mold = repository.getMoldById(job.moldId || "M-2026-00882");
  const punch = repository.getPunchById(job.punchId || "P-2026-003921");
  const processes = repository.getProductionProcesses(job.id);
  const qcs = repository.getQCs(job.id);
  const ncrs = repository.getNCRs(job.id);
  const eightD = ncrs.length > 0 ? repository.getEightDReport(ncrs[0].id) : undefined;
  const messages = repository.getMessages(job.id);
  const timelineEvents = repository.getTimelineEvents(job.id);

  const tabs = [
    { id: "overview", label: "工單總覽", icon: Briefcase },
    { id: "drawing", label: "圖面版本 (Rev)", icon: FileCode2, badge: job.drawingRev },
    { id: "mold", label: "成型模具", icon: Disc },
    { id: "punch", label: "專用沖棒", icon: Wrench, badge: punch ? "P-3921" : null },
    { id: "production", label: "12站製程計畫", icon: Kanban, badge: `${job.progressPercent}%` },
    { id: "qc", label: "品管檢驗 (QC)", icon: ShieldCheck, badge: qcs.length > 0 ? "合格" : null },
    { id: "ncr", label: "異常與 8D", icon: AlertTriangle, badge: ncrs.length > 0 ? "1案" : null },
    { id: "messages", label: "工單溝通室", icon: MessageSquare, badge: `${messages.length}` },
    { id: "timeline", label: "全歷程事件軸", icon: Clock },
    { id: "documents", label: "文檔證書", icon: FileText }
  ];

  const handleSendMessage = () => {
    if (!newMsg.trim()) return;
    repository.sendMessage({
      content: newMsg,
      jobId: job.id,
      orderId: job.jobNumber
    });
    setNewMsg("");
  };

  const handleAdvanceNextStage = () => {
    const stageKeys = Object.keys(STAGE_CONFIGS) as OrderStage[];
    const currentIdx = stageKeys.indexOf(job.currentStage);
    if (currentIdx < stageKeys.length - 1) {
      const nextStage = stageKeys[currentIdx + 1];
      repository.advanceJobStage(job.id, nextStage);
      // Force reload UI state by switching tab or updating
      setActiveTab("production");
    }
  };

  return (
    <div className="space-y-5 pb-16 animate-in fade-in duration-200">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回工單列表</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">目前權限模式:</span>
          <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-200">
            {repository.getCurrentRole() === "screw_factory" ? "長宏生管/現場 (買方客戶)" : "精耐特廠長/工程師 (賣方模具廠)"}
          </span>
        </div>
      </div>

      {/* Header Banner: Job Master Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xl font-black text-sky-400">
                {job.jobNumber}
              </span>
              <span className="text-sm font-bold text-white">
                {job.productName}
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                Rev: {job.drawingRev}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                job.priority === "rush_critical"
                  ? "bg-rose-950 border border-rose-500 text-rose-300"
                  : "bg-amber-950 border border-amber-500 text-amber-300"
              }`}>
                {job.priority === "rush_critical" ? "特急特派" : "緊急"}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                job.riskLevel === "red"
                  ? "bg-rose-950 border border-rose-500 text-rose-300"
                  : job.riskLevel === "yellow"
                  ? "bg-amber-950 border border-amber-500 text-amber-300"
                  : "bg-emerald-950 border border-emerald-500 text-emerald-300"
              }`}>
                交期風險: {job.riskLevel?.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
              <span>客戶廠商: <strong className="text-slate-200">{job.customerName}</strong></span>
              <span>·</span>
              <span>承製廠: <strong className="text-slate-200">精耐特精密模具</strong></span>
              <span>·</span>
              <span>預定交期: <strong className="text-sky-300 font-mono">{job.plannedDeliveryDate}</strong></span>
              <span>·</span>
              <span>預估批量: <strong className="text-slate-200 font-mono">{job.quantity.toLocaleString()} pcs</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAdvanceNextStage}
              className="px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>推進下一製程站點</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              目前生產站: <strong className="text-white font-mono">{job.currentStage}</strong> (12 站流水製程)
            </span>
            <span className="font-mono font-bold text-sky-400">
              進度: {job.progressPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${job.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sub-tabs Bar */}
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
                  ? "bg-sky-600 text-white shadow-sm"
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

      {/* Tab Content Area */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-sm min-h-[420px]">
        {/* 1. Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400">緊固件品名/用途</span>
                <div className="text-sm font-bold text-white mt-1">{job.productName}</div>
                <div className="text-xs text-slate-400 mt-1">特斯拉 Model Y 底盤懸吊固定件</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400">工程圖號與版本</span>
                <div className="text-sm font-bold text-sky-400 mt-1 font-mono">{job.drawingNumber}</div>
                <div className="text-xs text-slate-400 mt-1">目前生效版本: {job.drawingRev} (通過審查)</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400">配套專用成型沖棒</span>
                <div className="text-sm font-bold text-amber-400 mt-1 font-mono">{punch?.punchNumber || "P-2026-003921"}</div>
                <div className="text-xs text-slate-400 mt-1">ASP-23 粉末高速鋼 + AlTiN 紫黑膜</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400">目前指定打頭機</span>
                <div className="text-sm font-bold text-emerald-400 mt-1 font-mono">HM-01 (中聯 2 模 4 衝)</div>
                <div className="text-xs text-slate-400 mt-1">產速: 280 pcs/min · 油溫 42°C</div>
              </div>
            </div>

            {/* AI Engineering Insights for this Job */}
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/60 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>AI 工單風險評估與工藝建議 (Gemini Industrial Co-pilot)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                本工單加工之 SCM435 螺絲材料硬度較高，鍛造變形阻力大。當前配套二衝成型沖棒 (P-3921) 已累積打擊 31,280 衝，預計尚餘 18,720 衝 (37.4% 壽命)。
                生產站目前處於熱處理與外協真空鍍膜交接，系統預估明日 06:00 前完成出廠檢驗，交期風險評定為黃燈 (Yellow)，建議提前預約專車出貨岡山廠。
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateToPunch(punch?.id || "P-2026-003921")}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span>查看專用沖棒履歷 (Digital Passport)</span>
              </button>
              <button
                onClick={() => setActiveTab("drawing")}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileCode2 className="w-4 h-4" />
                <span>檢視圖面版本比對 (Rev.A ⟷ Rev.B)</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. Drawing Rev A vs Rev B */}
        {activeTab === "drawing" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">工程圖面版本歷程與變更差異比對 (CAD Revision Diff)</h4>
                <p className="text-xs text-slate-400">圖號: {drawing?.drawingNumber || "CAD-2026-M8-T40"}</p>
              </div>
              <button
                onClick={() => onNavigateToDrawing(drawing?.id || "DWG-2026-00882")}
                className="text-xs px-3 py-1.5 rounded-lg bg-sky-950 border border-sky-700 text-sky-300 font-semibold hover:bg-sky-900 flex items-center gap-1"
              >
                <span>開啟全版工程圖面中心</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rev A */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-400">Rev.A (初版)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">已歸檔</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div>· 成型頭深: <strong className="font-mono text-slate-200">1.20 mm</strong></div>
                  <div>· 沖棒同心度公差: <strong className="font-mono text-slate-200">±0.005 mm</strong></div>
                  <div>· 基材建議: <strong className="font-mono text-slate-200">SKH-51</strong></div>
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  現場反饋打擊 1.8 萬衝時頭深偏淺，且產生微量偏心夾傷。
                </div>
              </div>

              {/* Rev B */}
              <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-sky-400">Rev.B (目前生效版次)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono font-bold">
                    雙方核准生效
                  </span>
                </div>
                <div className="text-xs text-slate-200 space-y-1">
                  <div>· 成型頭深: <strong className="font-mono text-sky-300">1.40 mm (+0.20mm 補償金屬回彈)</strong></div>
                  <div>· 沖棒同心度公差: <strong className="font-mono text-sky-300">±0.002 mm (嚴格收斂)</strong></div>
                  <div>· 基材升級: <strong className="font-mono text-amber-300">ASP-23 + AlTiN 鍍膜</strong></div>
                </div>
                <div className="text-[11px] text-emerald-400/90 pt-1">
                  已於 2026/09/18 由長宏工程課與精耐特模具技術總監聯合核准放行。
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Mold */}
        {activeTab === "mold" && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">配套冷鍛成型模具清單 (Molds)</h4>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Disc className="w-5 h-5 text-indigo-400" />
                  <span className="font-mono font-bold text-sm text-white">{mold?.moldNumber || "M-2026-00882"}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono">
                  {mold?.status === "ready" ? "模具备妥 Ready" : mold?.status}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div><span className="text-slate-400">模具類型:</span> <strong className="text-slate-200">{mold?.moldType || "夾尾主模組"}</strong></div>
                <div><span className="text-slate-400">模仁材質:</span> <strong className="text-slate-200">{mold?.material || "G5 鎢鋼 (Carbide)"}</strong></div>
                <div><span className="text-slate-400">外徑/長度:</span> <strong className="text-slate-200">{mold?.dimensions || "OD 45mm × L 90mm"}</strong></div>
                <div><span className="text-slate-400">預計壽命:</span> <strong className="text-slate-200">{mold?.expectedLifeHits?.toLocaleString() || "200,000"} 衝</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Punch Digital Passport */}
        {activeTab === "punch" && punch && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">專用沖棒 Digital Passport 履歷通行證</h4>
              <button
                onClick={() => onNavigateToPunch(punch.id)}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1"
              >
                <span>進入沖棒數位履歷專頁</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-black text-amber-400">{punch.punchNumber}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700 font-mono">
                      {punch.coating}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono">
                      {punch.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    基材: {punch.material} · 硬度: {punch.hardness} · 同心度: {punch.concentricity}
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs text-slate-400">剩餘壽命比例</div>
                  <div className="text-xl font-black text-emerald-400">{punch.remainingLifePercent}%</div>
                </div>
              </div>

              {/* Visual meter */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">已打擊: {punch.currentHits.toLocaleString()} 衝</span>
                  <span className="text-slate-400">目標壽命: {punch.expectedLifeHits.toLocaleString()} 衝</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500"
                    style={{ width: `${(punch.currentHits / punch.expectedLifeHits) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Production (12-Stage Planned vs Actual) */}
        {activeTab === "production" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">12 站流水製程計畫與 Planned vs Actual 變異追蹤</h4>
                <p className="text-xs text-slate-400">從開料、車削、真空熱處理到三次元品檢完整工藝甘特</p>
              </div>
              <button
                onClick={handleAdvanceNextStage}
                className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>推進下一站</span>
              </button>
            </div>

            <div className="space-y-2">
              {processes.map((p, idx) => (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors ${
                    p.status === "completed"
                      ? "bg-slate-950/40 border-slate-800 text-slate-300"
                      : p.status === "in_progress"
                      ? "bg-sky-950/40 border-sky-700 text-white shadow-sm"
                      : "bg-slate-950/20 border-slate-850 text-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-850 flex items-center justify-center font-mono font-bold text-xs text-sky-400 shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        <span>{p.processName}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {p.department}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        預計完成: {p.plannedEnd} · 實際/預估: {p.actualEnd || "進行中"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {p.varianceHours !== undefined && p.varianceHours !== 0 && (
                      <span className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                        p.varianceHours > 0 ? "bg-rose-950 text-rose-300 border border-rose-800" : "bg-emerald-950 text-emerald-300"
                      }`}>
                        {p.varianceHours > 0 ? `+${p.varianceHours}h 延誤` : `${p.varianceHours}h 超前`}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      p.status === "completed"
                        ? "bg-slate-800 text-emerald-400"
                        : p.status === "in_progress"
                        ? "bg-sky-600 text-white"
                        : "bg-slate-850 text-slate-500"
                    }`}>
                      {p.status === "completed" ? "已完成" : p.status === "in_progress" ? "加工中" : "待排程"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. QC */}
        {activeTab === "qc" && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">品保檢驗報告與三次元數據 (QC Inspection)</h4>
            {qcs.map((qc) => (
              <div key={qc.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-mono font-bold text-white">{qc.qcNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono font-bold">
                      {qc.result}
                    </span>
                  </div>
                  <span className="text-slate-400">{qc.inspectedAt} · 檢驗員: {qc.inspectorName}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-3 rounded-lg">
                  <div><span className="text-slate-400">硬度 (Hardness):</span> <strong className="text-slate-200 font-mono">{qc.hardness}</strong></div>
                  <div><span className="text-slate-400">同心度 (Concentricity):</span> <strong className="text-emerald-400 font-mono">{qc.concentricity}</strong></div>
                  <div><span className="text-slate-400">表面塗層:</span> <strong className="text-slate-200 font-mono">{qc.coating}</strong></div>
                  <div><span className="text-slate-400">外觀判定:</span> <strong className="text-slate-200">{qc.appearance}</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 7. NCR & 8D */}
        {activeTab === "ncr" && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">品質異常單 (NCR) 與 8D 對策報告</h4>
            {ncrs.map((ncr) => (
              <div key={ncr.id} className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/80 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <span className="font-mono font-bold text-rose-300">{ncr.ncrNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono font-bold">
                      {ncr.defectType} ({ncr.severity})
                    </span>
                  </div>
                  <span className="text-slate-400">{ncr.createdAt} · 通報: {ncr.reportedBy}</span>
                </div>

                <p className="text-slate-200">{ncr.description}</p>
                <div className="p-2.5 rounded bg-slate-900/80 text-slate-300">
                  <strong className="text-rose-400">圍堵措施 (D3):</strong> {ncr.containmentAction}
                </div>

                {eightD && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sky-400">
                      <FileCheck2 className="w-4 h-4" />
                      <span>{eightD.reportNumber} (8D 永久對策分析)</span>
                    </div>
                    <div className="space-y-1 text-slate-300">
                      <div>· <strong className="text-slate-400">真因分析 (D4):</strong> {eightD.rootCauseD4}</div>
                      <div>· <strong className="text-slate-400">永久對策 (D5):</strong> {eightD.correctiveActionD5}</div>
                      <div>· <strong className="text-slate-400">再發防止 (D7):</strong> {eightD.preventiveActionD7}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 8. Messages */}
        {activeTab === "messages" && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">工單專屬工程即時溝通室</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {messages.map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-bold text-sky-400">{m.senderName}</span>
                    <span className="font-mono text-[10px]">{m.timestamp}</span>
                  </div>
                  <p className="text-slate-200">{m.content}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="發送工單工程備註或通知模具廠..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>發送</span>
              </button>
            </div>
          </div>
        )}

        {/* 9. Timeline */}
        {activeTab === "timeline" && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">工單全生命週期事件軌跡 (Job Audit Timeline)</h4>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {timelineEvents.map((evt) => (
                <div key={evt.id} className="relative text-xs space-y-1">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-sky-500 ring-4 ring-slate-900" />
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-bold text-slate-200">{evt.actor}</span>
                    <span className="font-mono text-[10px]">{evt.timestamp}</span>
                  </div>
                  <p className="text-slate-300">{evt.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. Documents */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">關聯技術文件、報價單與出廠報告 (Documents)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "CAD-2026-M8-T40-RevB.dwg", type: "CAD 工程圖面", date: "2026/09/18", size: "2.4 MB" },
                { title: "QUO-20260918-01 沖棒報價拆解表.pdf", type: "成本報價單", date: "2026/09/18", size: "380 KB" },
                { title: "QC-20260920-01 三次元投影檢測報告.pdf", type: "品檢證明", date: "2026/09/20", size: "1.1 MB" },
                { title: "歐瑞康 AlTiN 塗層硬度與膜厚檢定證.pdf", type: "表面處理證明", date: "2026/09/19", size: "850 KB" }
              ].map((doc, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs group hover:border-slate-700">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-sky-400" />
                    <div>
                      <div className="font-bold text-white group-hover:text-sky-300">{doc.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{doc.type} · {doc.date} · {doc.size}</div>
                    </div>
                  </div>
                  <button className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold">
                    下載檢視
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
