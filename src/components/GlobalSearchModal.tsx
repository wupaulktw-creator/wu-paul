import React, { useState } from "react";
import { Search, X, Briefcase, Wrench, FileCode2, AlertTriangle, ArrowRight, ExternalLink } from "lucide-react";
import { repository } from "../repositories";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, id?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const jobs = repository.getJobs();
  const punches = repository.getPunches();
  const drawings = repository.getDrawings();
  const ncrs = repository.getNCRs();

  const q = query.trim().toLowerCase();

  const matchedJobs = q
    ? jobs.filter(
        (j) =>
          j.jobNumber.toLowerCase().includes(q) ||
          j.productName.toLowerCase().includes(q) ||
          j.customerName.toLowerCase().includes(q) ||
          j.drawingNumber.toLowerCase().includes(q)
      )
    : jobs.slice(0, 3);

  const matchedPunches = q
    ? punches.filter(
        (p) =>
          p.punchNumber.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.coating.toLowerCase().includes(q) ||
          p.applicableProduct?.toLowerCase().includes(q)
      )
    : punches.slice(0, 3);

  const matchedDrawings = q
    ? drawings.filter(
        (d) =>
          d.drawingNumber.toLowerCase().includes(q) ||
          d.currentRevision.toLowerCase().includes(q)
      )
    : drawings.slice(0, 2);

  const matchedNCRs = q
    ? ncrs.filter(
        (n) =>
          n.ncrNumber.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q)
      )
    : ncrs.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜尋工單 (FTL-2026-00882)、沖棒 (P-3921)、圖面 (CAD-M8)、NCR、產品..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900/50 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400">推薦快搜:</span>
          {["FTL-2026-00882", "P-2026-003921", "M8 Torx", "CAD-2026-M8-T40", "NCR-2026-0042"].map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Jobs */}
          {matchedJobs.length > 0 && (
            <div>
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                <span>工單 Jobs ({matchedJobs.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedJobs.map((j) => (
                  <div
                    key={j.id}
                    onClick={() => {
                      onNavigate("job_detail", j.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/70 border border-slate-800 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-sky-400 group-hover:text-sky-300">
                          {j.jobNumber}
                        </span>
                        <span className="text-xs text-white font-medium">
                          {j.productName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 rounded font-mono text-slate-300">
                          {j.drawingRev}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {j.customerName} · 交期: {j.plannedDeliveryDate} · 進度: {j.progressPercent}%
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-400 transition-transform group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Punches */}
          {matchedPunches.length > 0 && (
            <div>
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                <span>沖棒 Digital Passport ({matchedPunches.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedPunches.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onNavigate("passport", p.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/70 border border-slate-800 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400">
                          {p.punchNumber}
                        </span>
                        <span className="text-xs text-slate-200">
                          {p.applicableProduct || p.material}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-indigo-950 border border-indigo-700 text-indigo-300 rounded font-mono">
                          {p.coating}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        衝次: {p.currentHits.toLocaleString()} / {p.expectedLifeHits.toLocaleString()} (剩餘 {p.remainingLifePercent}%)
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drawings */}
          {matchedDrawings.length > 0 && (
            <div>
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase mb-2 flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>工程圖面 Drawings</span>
              </div>
              <div className="space-y-1.5">
                {matchedDrawings.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      onNavigate("drawings", d.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/70 border border-slate-800 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {d.drawingNumber}
                      </span>
                      <span className="text-xs text-slate-200 font-medium">
                        最新版次: {d.currentRevision}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NCR */}
          {matchedNCRs.length > 0 && (
            <div>
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>品質異常單 NCR</span>
              </div>
              <div className="space-y-1.5">
                {matchedNCRs.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onNavigate("ncr", n.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/70 border border-slate-800 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-rose-400">
                          {n.ncrNumber}
                        </span>
                        <span className="text-xs text-slate-300 truncate max-w-sm">
                          {n.description}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-transform group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
