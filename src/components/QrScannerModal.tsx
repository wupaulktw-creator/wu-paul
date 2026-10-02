import React, { useState } from "react";
import { QrCode, X, Scan, CheckCircle2, ArrowRight, Camera, Smartphone } from "lucide-react";
import { repository } from "../repositories";

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (punchId: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess
}) => {
  const [selectedPunch, setSelectedPunch] = useState("P-2026-003921");
  const punches = repository.getPunches();

  if (!isOpen) return null;

  const handleSimulateScan = (id: string) => {
    onScanSuccess(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <QrCode className="w-5 h-5 text-indigo-400" />
            <span>沖棒 QR Code Digital Passport 掃描</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-center">
          {/* Simulated Scanner Viewfinder */}
          <div className="relative mx-auto w-48 h-48 rounded-2xl bg-slate-950 border-2 border-dashed border-indigo-500/60 flex flex-col items-center justify-center p-4 overflow-hidden shadow-inner">
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse top-1/2 -translate-y-1/2 shadow-[0_0_12px_cyan]" />
            <Scan className="w-16 h-16 text-indigo-400/60" />
            <span className="text-[11px] font-mono text-slate-400 mt-2">
              對準沖棒柄部雷雕 QR
            </span>
          </div>

          <div className="text-xs text-slate-300">
            <p className="font-semibold text-white">現場手機 / 平板數位履歷通行證</p>
            <p className="text-slate-400 text-[11px] mt-1">
              掃描沖棒柄部雷射雕刻碼即可即刻調閱：打擊累積衝次、剩餘壽命預警、檢驗報告與領退刀換模。
            </p>
          </div>

          {/* Quick Select Buttons */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              選擇現場現有沖棒直接載入履歷:
            </label>
            <div className="space-y-1.5">
              {punches.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSimulateScan(p.id)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 flex items-center justify-between text-xs transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sky-400">{p.punchNumber}</span>
                      <span className="text-slate-200">{p.material} · {p.coating}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      目前衝次: {p.currentHits.toLocaleString()} · 剩餘 {p.remainingLifePercent}%
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
