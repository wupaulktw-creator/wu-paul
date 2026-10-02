import React, { useState } from "react";
import { 
  FileText, 
  Receipt, 
  Plus, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  Briefcase,
  Zap
} from "lucide-react";
import { repository } from "../repositories";
import { Quote, RFQ } from "../types";

interface RfqsQuotesPageProps {
  initialTab?: "rfqs" | "quotes";
  onOpenNewRfq: () => void;
  onNavigateToJob: (jobId: string) => void;
}

export const RfqsQuotesPage: React.FC<RfqsQuotesPageProps> = ({
  initialTab = "quotes",
  onOpenNewRfq,
  onNavigateToJob
}) => {
  const [activeTab, setActiveTab] = useState<"rfqs" | "quotes">(initialTab);
  const rfqs = repository.getRFQs();
  const quotes = repository.getQuotes();

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-sky-400" />
            <span>RFQ 線上詢價與精密模具成本拆解報價中心</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            透明化 10 項工藝成本拆解 (材料、車削、放電 EDM、真空熱處理、PVD 鍍膜、急件插單費與合理利潤)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("quotes")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "quotes" ? "bg-sky-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>報價單 Quotes ({quotes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("rfqs")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "rfqs" ? "bg-sky-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>詢價單 RFQs ({rfqs.length})</span>
            </button>
          </div>

          <button
            onClick={onOpenNewRfq}
            className="px-3.5 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>開立新 RFQ</span>
          </button>
        </div>
      </div>

      {/* 1. Quotes with 10 Cost Breakdowns */}
      {activeTab === "quotes" && (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-base font-black text-sky-400">
                    {quote.quoteNumber}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    關聯詢價: {quote.rfqId}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono font-bold">
                    {quote.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs text-slate-400">含稅總計: </span>
                  <span className="text-lg font-black text-emerald-400">
                    NT$ {quote.totalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 ml-2">
                    (單價 NT$ {quote.unitPrice.toLocaleString()} / 支)
                  </span>
                </div>
              </div>

              {/* 10 Cost Breakdown Matrix */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                  工藝成本結構明細拆解 (Cost Breakdown Breakdown):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                    <div className="text-slate-400 text-[11px]">材料費 (ASP-23)</div>
                    <div className="font-mono font-bold text-slate-200 mt-0.5">NT$ {quote.materialCost}</div>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                    <div className="text-slate-400 text-[11px]">粗車/精車削</div>
                    <div className="font-mono font-bold text-slate-200 mt-0.5">NT$ {quote.machiningCost}</div>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                    <div className="text-slate-400 text-[11px]">真空淬火/深冷</div>
                    <div className="font-mono font-bold text-slate-200 mt-0.5">NT$ {quote.heatTreatmentCost}</div>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                    <div className="text-slate-400 text-[11px]">外徑同心度研磨</div>
                    <div className="font-mono font-bold text-slate-200 mt-0.5">NT$ {quote.grindingCost}</div>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                    <div className="text-slate-400 text-[11px]">慢走絲/EDM放電</div>
                    <div className="font-mono font-bold text-slate-200 mt-0.5">NT$ {quote.edmCost}</div>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                    <div className="text-slate-400 text-[11px]">超音波鏡面拋光</div>
                    <div className="font-mono font-bold text-slate-200 mt-0.5">NT$ {quote.polishingCost}</div>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                    <div className="text-slate-400 text-[11px]">PVD 歐瑞康 AlTiN</div>
                    <div className="font-mono font-bold text-indigo-400 mt-0.5">NT$ {quote.coatingCost}</div>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                    <div className="text-slate-400 text-[11px]">三次元品檢 (QC)</div>
                    <div className="font-mono font-bold text-slate-200 mt-0.5">NT$ {quote.qcCost}</div>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                    <div className="text-slate-400 text-[11px]">特急插單費</div>
                    <div className="font-mono font-bold text-amber-400 mt-0.5">NT$ {quote.rushFee}</div>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                    <div className="text-slate-400 text-[11px]">合理毛利空間</div>
                    <div className="font-mono font-bold text-emerald-400 mt-0.5">NT$ {quote.margin}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-400">承諾交期: 4 個工作天 · 有效期至: {quote.validUntil}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onNavigateToJob("JOB-2026-00882")}
                    className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold flex items-center gap-1 transition-all"
                  >
                    <span>檢視執行中工單</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. RFQs */}
      {activeTab === "rfqs" && (
        <div className="space-y-4">
          {rfqs.map((rfq) => (
            <div key={rfq.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sky-400">{rfq.rfqNumber}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  需求量: {rfq.requestedQuantity} 支
                </span>
              </div>
              <div className="text-white font-semibold">{rfq.targetPartName}</div>
              <div className="text-slate-400">
                材質: {rfq.material} · 鍍膜: {rfq.coating} · 希望交期: {rfq.requestedDeliveryDate}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
