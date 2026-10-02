import React from "react";
import { TrendingUp, Activity, CheckCircle2, AlertTriangle, Disc, Wrench } from "lucide-react";

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sky-400" />
          <span>冷鍛模具與沖棒壽命營運分析看板 (Analytics & Insights)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          沖棒平均打擊衝次、材質失效比率 (SKH-51 vs ASP-23 vs 鎢鋼)、準時達交率與成本趨勢
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400">平均沖棒衝次 (Hits / Tool)</span>
          <div className="text-2xl font-black font-mono text-emerald-400">46,800 hits</div>
          <div className="text-[11px] text-slate-400">ASP-23 AlTiN 導入後壽命成長 +145%</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400">模具急件準時達交率 (OTD)</span>
          <div className="text-2xl font-black font-mono text-sky-400">96.4%</div>
          <div className="text-[11px] text-slate-400">跨廠線上協同縮短報價確認 18 小時</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400">異常微崩刃率 (Chipping Rate)</span>
          <div className="text-2xl font-black font-mono text-amber-400">3.2%</div>
          <div className="text-[11px] text-slate-400">8D 永久對策改善後降低 68%</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400">單件扣件模具均攤成本</span>
          <div className="text-2xl font-black font-mono text-indigo-400">NT$ 0.031</div>
          <div className="text-[11px] text-slate-400">低於國際汽車緊固件目標限額</div>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
          <h3 className="font-bold text-white text-sm">沖棒材質耐用度衝次比較 (Tool Material Benchmark)</h3>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>ASP-23 + AlTiN (粉末鋼紫黑膜)</span>
                <span className="font-mono font-bold text-emerald-400">52,000 hits (平均)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[95%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>SKH-9 + TiN (傳統黃金鍍膜)</span>
                <span className="font-mono text-slate-300">28,000 hits (平均)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full w-[55%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>SKH-51 (一般無鍍膜)</span>
                <span className="font-mono text-slate-400">14,000 hits (平均)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-600 h-full w-[30%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
          <h3 className="font-bold text-white text-sm">沖棒失效形態佔比 (Defect Mode Breakdown)</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg">
              <span className="text-slate-300">尖部微崩刃 (Chipping)</span>
              <span className="font-mono font-bold text-amber-400">54%</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg">
              <span className="text-slate-300">正常端面磨耗 (Abrasive Wear)</span>
              <span className="font-mono font-bold text-emerald-400">32%</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg">
              <span className="text-slate-300">脫膜拉傷咬死 (Galling)</span>
              <span className="font-mono font-bold text-rose-400">10%</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg">
              <span className="text-slate-300">沖棒桿部斷裂 (Breakage)</span>
              <span className="font-mono font-bold text-slate-400">4%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
