import React, { useState } from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileCheck2, 
  GitBranch, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Sparkles,
  Shield
} from "lucide-react";
import { repository } from "../repositories";
import { NCR, QCInspection } from "../types";

interface QualityPageProps {
  onNavigateToJob: (jobId: string) => void;
  onNavigateToPunch: (punchId: string) => void;
}

export const QualityPage: React.FC<QualityPageProps> = ({
  onNavigateToJob,
  onNavigateToPunch
}) => {
  const [subTab, setSubTab] = useState<"qc" | "ncr" | "eight_d" | "traceability">("ncr");

  const qcs = repository.getQCs();
  const ncrs = repository.getNCRs();
  const eightD = repository.getEightDReport("NCR-2026-0042");

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>品質保證、三次元檢驗、異常 (NCR) 與 8D 對策中心</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            落實出廠檢驗 (QC)、現場失效通報 (NCR)、8D 永久對策分析與一物一碼全鏈追溯
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: "ncr", label: "異常單 (NCR)", icon: AlertTriangle, badge: `${ncrs.length}` },
            { id: "eight_d", label: "8D 報告", icon: FileCheck2 },
            { id: "qc", label: "三次元檢驗", icon: ShieldCheck, badge: `${qcs.length}` },
            { id: "traceability", label: "履歷追溯", icon: GitBranch }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${isActive ? "bg-white/20" : "bg-slate-800 text-slate-300"}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. NCR */}
      {subTab === "ncr" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ncrs.map((ncr) => (
              <div
                key={ncr.id}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-700/80 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-400 text-sm">{ncr.ncrNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono text-[10px] font-bold">
                      {ncr.defectType} ({ncr.severity})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">{ncr.createdAt}</span>
                </div>

                <div className="text-xs text-slate-200">
                  <p className="font-medium">{ncr.description}</p>
                  <div className="mt-2 text-slate-400 flex items-center gap-3">
                    <span>沖棒: <strong className="text-amber-400 font-mono">{ncr.punchId}</strong></span>
                    <span>·</span>
                    <span>機台: <strong className="text-slate-200 font-mono">{ncr.machineId}</strong></span>
                    <span>·</span>
                    <span>失效衝次: <strong className="text-slate-200 font-mono">{ncr.hitsAtFailure?.toLocaleString()} 衝</strong></span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg text-xs space-y-1">
                  <div className="text-rose-400 font-semibold">圍堵對策 (D3):</div>
                  <div className="text-slate-300 text-[11px]">{ncr.containmentAction}</div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <button
                    onClick={() => onNavigateToPunch(ncr.punchId || "P-2026-003921")}
                    className="text-amber-400 hover:underline font-semibold"
                  >
                    調閱沖棒履歷
                  </button>
                  <button
                    onClick={() => setSubTab("eight_d")}
                    className="text-sky-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>檢視 8D 報告</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. 8D Report */}
      {subTab === "eight_d" && eightD && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-black text-sky-400">{eightD.reportNumber}</span>
                <span className="px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700 font-mono text-xs font-bold">
                  8D 永久對策改善專案
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                關聯異常: {eightD.ncrId} · 成立小組: 長宏岡山廠品保課 + 精耐特模具技術中心
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold self-start sm:self-auto">
              狀態: {eightD.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
              <span className="font-mono text-sky-400 font-bold">D1. 改善團隊成員 (Team)</span>
              <p className="text-slate-300">{eightD.teamD1}</p>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
              <span className="font-mono text-sky-400 font-bold">D2. 問題描述 (Problem Description)</span>
              <p className="text-slate-300">{eightD.problemDescriptionD2}</p>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
              <span className="font-mono text-rose-400 font-bold">D4. 根本真因分析 (Root Cause RCA)</span>
              <p className="text-slate-300 leading-relaxed">{eightD.rootCauseD4}</p>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
              <span className="font-mono text-emerald-400 font-bold">D5. 永久矯正措施 (Corrective Action)</span>
              <p className="text-slate-300 leading-relaxed">{eightD.correctiveActionD5}</p>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
              <span className="font-mono text-amber-400 font-bold">D6. 效果驗證 (Verification of Effectiveness)</span>
              <p className="text-slate-300">{eightD.verificationD6}</p>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
              <span className="font-mono text-indigo-400 font-bold">D7. 再發防止與標準化 (Preventive Action)</span>
              <p className="text-slate-300 leading-relaxed">{eightD.preventiveActionD7}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. QC Inspections */}
      {subTab === "qc" && (
        <div className="space-y-4">
          <div className="space-y-3">
            {qcs.map((qc) => (
              <div key={qc.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-400">{qc.qcNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono font-bold">
                      {qc.result}
                    </span>
                  </div>
                  <span className="text-slate-400">{qc.inspectedAt} · 檢驗員: {qc.inspectorName}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-lg">
                  <div><span className="text-slate-400">硬度:</span> <strong className="text-white font-mono">{qc.hardness}</strong></div>
                  <div><span className="text-slate-400">同心度:</span> <strong className="text-emerald-400 font-mono">{qc.concentricity}</strong></div>
                  <div><span className="text-slate-400">鍍膜規格:</span> <strong className="text-indigo-400 font-mono">{qc.coating}</strong></div>
                  <div><span className="text-slate-400">表面外觀:</span> <strong className="text-slate-200">{qc.appearance}</strong></div>
                </div>

                <p className="text-slate-400 text-[11px]">{qc.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Traceability */}
      {subTab === "traceability" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-sky-400" />
            <span>冷鍛緊固件全流程數位履歷溯源 (Traceability Chain)</span>
          </h3>
          <p className="text-xs text-slate-300">
            從客戶採購單 ➔ CAD 圖面 Rev.B ➔ 精耐特模具/沖棒製造 (P-3921) ➔ 岡山廠 HM-01 機台打擊 ➔ 三次元品檢 ➔ 出貨報告，全鏈閉環防偽可追溯。
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-emerald-400">✓ RFQ-20260918-01 (線上詢價)</div>
            <div className="text-emerald-400">✓ CAD-2026-M8-T40 Rev.B (雙方工程簽核)</div>
            <div className="text-emerald-400">✓ QUO-20260918-01 (10項成本透明拆解)</div>
            <div className="text-emerald-400">✓ FTL-2026-00882 (12站流水在製工單)</div>
            <div className="text-emerald-400">✓ P-2026-003921 (ASP-23 AlTiN 專用沖棒 Digital Passport)</div>
            <div className="text-emerald-400">✓ QC-20260920-01 (光學三次元投影檢驗 PASS)</div>
          </div>
        </div>
      )}
    </div>
  );
};
