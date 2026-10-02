import React, { useState } from "react";
import { 
  FileCode2, 
  CheckCircle2, 
  Clock, 
  GitBranch, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  ScanLine,
  FileCheck2,
  Lock,
  Layers
} from "lucide-react";
import { repository } from "../repositories";
import { Drawing } from "../types";

interface DrawingsPageProps {
  initialDrawingId?: string;
  onNavigateToJob: (jobId: string) => void;
}

export const DrawingsPage: React.FC<DrawingsPageProps> = ({
  initialDrawingId,
  onNavigateToJob
}) => {
  const drawings = repository.getDrawings();
  const [selectedDwg, setSelectedDwg] = useState<Drawing>(() => {
    return drawings.find((d) => d.id === initialDrawingId) || drawings[0];
  });

  const [approvedSuccess, setApprovedSuccess] = useState<string | null>(null);

  const handleApproveRev = (revId: string) => {
    const approver = repository.getCurrentRole() === "screw_factory" ? "長宏岡山廠 研發技術部 謝協理" : "精耐特模具 工程部 總工程師";
    repository.approveDrawingRevision(selectedDwg.id, revId, approver);
    const updated = repository.getDrawingById(selectedDwg.id);
    if (updated) setSelectedDwg({ ...updated });
    setApprovedSuccess(`版本 ${revId} 已成功核准放行生效！`);
    setTimeout(() => setApprovedSuccess(null), 4000);
  };

  const activeRev = selectedDwg.revisions.find((r) => r.revisionNumber === selectedDwg.currentRevision) || selectedDwg.revisions[selectedDwg.revisions.length - 1];
  const prevRev = selectedDwg.revisions.find((r) => r.revisionNumber !== selectedDwg.currentRevision);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-sky-400" />
            <span>工程圖面版本歷程與雙方會審中心 (CAD Revision Center)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            圖面版本 (Rev.A / Rev.B) 嚴格控制，變更歷程、公差收斂比對與跨廠雙方共同核准放行
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
            當前審核身分: {repository.getCurrentRole() === "screw_factory" ? "長宏 (買方)" : "精耐特 (模具賣方)"}
          </span>
        </div>
      </div>

      {approvedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{approvedSuccess}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Drawings List */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase">
            圖面清單 ({drawings.length})
          </div>
          <div className="space-y-2">
            {drawings.map((dwg) => (
              <div
                key={dwg.id}
                onClick={() => setSelectedDwg(dwg)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedDwg.id === dwg.id
                    ? "bg-slate-900 border-sky-500 shadow-sm"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sky-400 text-xs">
                    {dwg.drawingNumber}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 font-mono text-slate-300">
                    最新: {dwg.currentRevision}
                  </span>
                </div>
                <div className="text-xs text-white font-semibold mt-1">
                  {dwg.targetPartName}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>版本數: {dwg.revisions.length} 個</span>
                  <span className="text-emerald-400 font-mono">狀態: {dwg.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Revision Diff & Approval Card */}
        <div className="lg:col-span-2 space-y-5">
          {/* Drawing Detail Header */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-black text-sky-400">
                    {selectedDwg.drawingNumber}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono font-bold">
                    當前生效: {selectedDwg.currentRevision}
                  </span>
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  零件名稱: <strong className="text-white">{selectedDwg.targetPartName}</strong>
                </div>
              </div>

              {activeRev.status !== "approved" && (
                <button
                  onClick={() => handleApproveRev(activeRev.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>核准最新版次 ({activeRev.revisionNumber})</span>
                </button>
              )}
            </div>

            {/* CAD Schematic Preview Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>CAD 向量示意工程圖檔：{selectedDwg.drawingNumber}.dwg</span>
                <span className="text-sky-400">比例 1:1 · ISO 14581 標準</span>
              </div>
              <div className="h-40 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="text-center space-y-1 relative z-10">
                  <ScanLine className="w-8 h-8 text-sky-400/80 mx-auto animate-pulse" />
                  <span className="text-xs font-mono text-slate-300 font-bold">
                    M8 × 30 Torx T40 螺絲與成型沖棒端面特徵圖
                  </span>
                  <p className="text-[10px] text-slate-400">
                    直徑 Ø14.000 (-0.003) · 成型深度 1.40mm · 內同心度 ≤ 0.002mm
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rev Diff Side-by-Side Comparison */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-indigo-400" />
              <span>版本差異比對 (Revision Parameter Diff)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Previous Revision */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-400">
                    {prevRev ? prevRev.revisionNumber : "Rev.A"} (上一版本)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    歷史版本
                  </span>
                </div>

                <div className="space-y-2 text-slate-300">
                  <div>· 成型頭深: <strong className="font-mono text-slate-200">1.20 mm</strong></div>
                  <div>· 沖棒同心度公差: <strong className="font-mono text-slate-200">±0.005 mm</strong></div>
                  <div>· 沖棒材質: <strong className="font-mono text-slate-200">SKH-51</strong></div>
                  <div>· 塗層鍍膜: <strong className="font-mono text-slate-200">TiN (黃金鍍膜)</strong></div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  變更原因: 現場反應打擊 1.8 萬衝即發生頭深偏淺，且螺絲頭部偏心咬花。
                </div>
              </div>

              {/* Current Active Revision */}
              <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-800/80 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sky-400">
                    {activeRev.revisionNumber} (目前生效版次)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono font-bold">
                    {activeRev.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2 text-slate-200">
                  <div>· 成型頭深: <strong className="font-mono text-sky-300">1.40 mm (+0.20mm 補償冷鍛回彈)</strong></div>
                  <div>· 沖棒同心度公差: <strong className="font-mono text-emerald-400">±0.002 mm (大幅收斂提升精密度)</strong></div>
                  <div>· 沖棒材質: <strong className="font-mono text-amber-300">ASP-23 (粉末鋼抗衝擊)</strong></div>
                  <div>· 塗層鍍膜: <strong className="font-mono text-indigo-300">AlTiN (紫黑膜耐溫 800°C)</strong></div>
                </div>

                <div className="pt-2 border-t border-sky-900/60 text-[11px] text-emerald-300">
                  審核核准人: {activeRev.approvedBy || "長宏 謝協理 / 精耐特 總工程師"} ({activeRev.approvedAt || "2026/09/18"})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
