import React, { useState } from "react";
import { MachinePunchState, DefectTicket } from "../types";
import { 
  X, 
  AlertTriangle, 
  Check, 
  Camera, 
  ShieldAlert, 
  FileWarning 
} from "lucide-react";

interface DefectReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  machine: MachinePunchState | null;
  onSubmitDefect: (ticket: Partial<DefectTicket>) => void;
}

export const DefectReportModal: React.FC<DefectReportModalProps> = ({
  isOpen,
  onClose,
  machine,
  onSubmitDefect
}) => {
  const [defectType, setDefectType] = useState<DefectTicket["defectType"]>("chipping");
  const [description, setDescription] = useState("");
  const [screwMaterial, setScrewMaterial] = useState(machine?.screwMaterial || "1022A 碳鋼");
  const [hitsAtFailure, setHitsAtFailure] = useState(machine?.currentHits || 50000);

  if (!isOpen || !machine) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitDefect({
      machineId: machine.machineId,
      punchSpec: machine.punchSpec,
      defectType,
      hitsAtFailure,
      expectedHits: machine.expectedLifeHits,
      screwMaterial,
      description: description || "冷鍛打擊現場回報沖棒異常，請模具廠工程師協助鑑定並補製備品。",
      status: "investigating"
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-100 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                沖棒品質異常與崩模回報單
              </h3>
              <p className="text-xs text-slate-400">
                連線模具製造廠品保課 · 啟動 RCA 原因分析與急件補發
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Machine & Punch Spec Banner */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">出事機台：</span>
              <span className="font-mono text-white font-bold">{machine.machineId} ({machine.machineName})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">掛載沖棒：</span>
              <span className="font-mono text-sky-400">{machine.punchSpec}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">發生衝次：</span>
              <span className="font-mono text-amber-300 font-bold">{machine.currentHits.toLocaleString()} Hits</span>
            </div>
          </div>

          {/* Failure Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">異常失效特徵分類</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "chipping", label: "頭部微崩刃 / 崩牙", sub: "成型刃口微裂、缺角" },
                { id: "fracture", label: "沖尖斷針 / 斷裂", sub: "瞬間應力過大脆性斷針" },
                { id: "severe_wear", label: "過度磨損 / 尺寸變大", sub: "打擊面磨損、螺絲孔深不足" },
                { id: "concentricity_runout", label: "偏心 / 同心度偏差", sub: "頭部偏歪 > 0.02mm" },
                { id: "coating_peel", label: "PVD 鍍膜剝落 / 咬死", sub: "金屬高溫熱黏著" },
              ].map((ft) => (
                <button
                  type="button"
                  key={ft.id}
                  onClick={() => setDefectType(ft.id as any)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    defectType === ft.id
                      ? "bg-rose-950/60 border-rose-500 text-rose-200 shadow"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750"
                  }`}
                >
                  <div className="text-xs font-bold">{ft.label}</div>
                  <div className="text-[10px] text-slate-400">{ft.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Failure description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              現場操作員描述 (異音、鍛打材料狀況)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="請描述沖棒崩裂時的打擊轉速、被鍛鋼材硬度、或是是否有冷鍛油斷流現象..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Simulated Photo Attachment */}
          <div className="p-3 bg-slate-950 border border-dashed border-slate-700 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Camera className="w-4 h-4 text-sky-400" />
              <span>現場顯微照片已自動關聯機台相簿 (50X 崩刃照片)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              已就緒
            </span>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs rounded-lg text-slate-400 hover:text-white"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 rounded-lg shadow-lg shadow-rose-950 flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              立即送出異常通報
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
