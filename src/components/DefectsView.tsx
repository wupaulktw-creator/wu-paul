import React from "react";
import { DefectTicket, Role } from "../types";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  FileText,
  Camera
} from "lucide-react";

interface DefectsViewProps {
  defects: DefectTicket[];
  onUpdateDefectStatus: (defectId: string, newStatus: DefectTicket["status"]) => void;
  onOpenAdvisorWithDefect: (defect: DefectTicket) => void;
  currentRole: Role;
}

export const DefectsView: React.FC<DefectsViewProps> = ({
  defects,
  onUpdateDefectStatus,
  onOpenAdvisorWithDefect,
  currentRole
}) => {
  const getDefectTypeLabel = (type: DefectTicket["defectType"]) => {
    switch (type) {
      case "chipping":
        return { label: "頭部微崩刃 / 崩牙", color: "text-amber-400 bg-amber-950/60 border-amber-800" };
      case "fracture":
        return { label: "沖尖斷裂 / 斷針", color: "text-rose-400 bg-rose-950/60 border-rose-800" };
      case "severe_wear":
        return { label: "過度磨損", color: "text-orange-400 bg-orange-950/60 border-orange-800" };
      case "concentricity_runout":
        return { label: "偏心 / 同心度偏差", color: "text-yellow-400 bg-yellow-950/60 border-yellow-800" };
      case "coating_peel":
        return { label: "PVD 鍍膜剝落 / 咬死", color: "text-purple-400 bg-purple-950/60 border-purple-800" };
      default:
        return { label: "其他異常", color: "text-slate-400 bg-slate-800 border-slate-700" };
    }
  };

  const getStatusLabel = (status: DefectTicket["status"]) => {
    switch (status) {
      case "investigating":
        return { text: "模具廠品保調查中", icon: Clock, bg: "bg-amber-950 border-amber-500 text-amber-300" };
      case "root_cause_identified":
        return { text: "已確認成因與對策", icon: Sparkles, bg: "bg-sky-950 border-sky-500 text-sky-300" };
      case "remake_dispatched":
        return { text: "急件補製專車送出", icon: AlertTriangle, bg: "bg-indigo-950 border-indigo-500 text-indigo-300" };
      case "closed":
        return { text: "已結案 (量產驗證通過)", icon: CheckCircle2, bg: "bg-emerald-950 border-emerald-500 text-emerald-300" };
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            沖棒異常追蹤、根因分析 (RCA) 與急件補製
          </h2>
          <p className="text-xs text-slate-400">
            結合現場崩模照片 · 模具廠品保工程分析 · 跨廠責任判定與壽命改善
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {defects.map((d) => {
          const typeMeta = getDefectTypeLabel(d.defectType);
          const statusMeta = getStatusLabel(d.status);
          const StatusIcon = statusMeta.icon;

          return (
            <div
              key={d.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-sky-400 text-xs">
                    {d.id}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${typeMeta.color}`}>
                    {typeMeta.label}
                  </span>
                  <span className="text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded font-mono">
                    機台: {d.machineId}
                  </span>
                  <span className="text-xs text-slate-400">
                    沖棒規格: <strong className="text-slate-200">{d.punchSpec}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold flex items-center gap-1.5 ${statusMeta.bg}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusMeta.text}
                  </span>
                </div>
              </div>

              {/* Defect Description and stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">鍛造被加工材料：</span>
                  <span className="font-mono text-amber-300 font-semibold">{d.screwMaterial}</span>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    發生時間：{d.reportedAt}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">失效時累計衝次：</span>
                  <span className="font-mono text-rose-400 font-bold text-sm">
                    {d.hitsAtFailure.toLocaleString()}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px] ml-1">
                    / 預期 {d.expectedHits.toLocaleString()} 衝 ({Math.round((d.hitsAtFailure / d.expectedHits) * 100)}%)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">現場描述：</span>
                  <p className="text-slate-300 italic text-[11px]">
                    "{d.description}"
                  </p>
                </div>
              </div>

              {/* RCA Analysis Summary */}
              {d.analysisSummary && (
                <div className="bg-slate-950 p-3 rounded-lg border border-indigo-900/50 text-xs space-y-1">
                  <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    模具廠品保課 RCA 根因分析與改善結論：
                  </div>
                  <p className="text-slate-200 leading-relaxed pl-5">
                    {d.analysisSummary}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                <button
                  onClick={() => onOpenAdvisorWithDefect(d)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-300 flex items-center gap-1.5 font-medium transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  啟用 AI 模具專家深入診斷此案
                </button>

                {currentRole === "mold_factory" && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">推進處理狀態：</span>
                    {d.status === "investigating" && (
                      <button
                        onClick={() => onUpdateDefectStatus(d.id, "root_cause_identified")}
                        className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium"
                      >
                        已完成成因分析
                      </button>
                    )}
                    {d.status === "root_cause_identified" && (
                      <button
                        onClick={() => onUpdateDefectStatus(d.id, "remake_dispatched")}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
                      >
                        標記急件已發車補送
                      </button>
                    )}
                    {d.status === "remake_dispatched" && (
                      <button
                        onClick={() => onUpdateDefectStatus(d.id, "closed")}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                      >
                        正式結案
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
