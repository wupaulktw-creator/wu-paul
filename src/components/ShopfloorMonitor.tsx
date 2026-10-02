import React, { useState, useEffect } from "react";
import { MachinePunchState, Role } from "../types";
import { 
  Gauge, 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  Zap, 
  CheckCircle2, 
  Wrench, 
  ArrowUpRight,
  Sparkles
} from "lucide-react";

interface ShopfloorMonitorProps {
  machines: MachinePunchState[];
  onUpdateMachineHits: (machineId: string, newHits: number) => void;
  onResetMachinePunch: (machineId: string) => void;
  onTriggerReorder: (machine: MachinePunchState) => void;
  onReportDefect: (machine: MachinePunchState) => void;
  currentRole: Role;
}

export const ShopfloorMonitor: React.FC<ShopfloorMonitorProps> = ({
  machines,
  onUpdateMachineHits,
  onResetMachinePunch,
  onTriggerReorder,
  onReportDefect,
  currentRole
}) => {
  const [isLiveSimulating, setIsLiveSimulating] = useState<boolean>(true);

  // Real-time ticking simulation of heading machines
  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      machines.forEach((m) => {
        if (m.status !== "idle" && m.status !== "tool_changing") {
          // Increment hits based on speed (simulated accelerated for demonstration, ~3-8 hits per second)
          const addedHits = Math.floor(Math.random() * 4) + 3;
          const nextHits = m.currentHits + addedHits;
          onUpdateMachineHits(m.machineId, nextHits);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLiveSimulating, machines, onUpdateMachineHits]);

  return (
    <div className="space-y-4">
      {/* Top Banner Control */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              螺絲打頭冷鍛現場 · 沖棒實時打擊壽命監控
              {isLiveSimulating && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              即時統計打擊次數 · 模具磨耗極限預警 · 雙向連動模具廠生管排程
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsLiveSimulating(!isLiveSimulating)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-colors ${
              isLiveSimulating
                ? "bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/50"
                : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50"
            }`}
          >
            {isLiveSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5" /> 暫停實時打擊
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> 啟動實時打擊模擬
              </>
            )}
          </button>
        </div>
      </div>

      {/* Machine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {machines.map((m) => {
          const usagePercent = Math.min(100, Math.round((m.currentHits / m.expectedLifeHits) * 100));
          const remainingHits = Math.max(0, m.expectedLifeHits - m.currentHits);
          const isCritical = usagePercent >= 95;
          const isWarning = usagePercent >= 85 && usagePercent < 95;

          return (
            <div
              key={m.machineId}
              className={`bg-slate-900 border rounded-xl p-4 shadow-md transition-all relative overflow-hidden ${
                isCritical 
                  ? "border-rose-500/70 shadow-rose-950/20" 
                  : isWarning 
                  ? "border-amber-500/60 shadow-amber-950/10" 
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Corner Status Badge */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-white">
                      {m.machineId}
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      {m.machineName}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {m.machineModel}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>工位：<strong className="text-slate-200">{m.station}</strong></span>
                    <span>·</span>
                    <span>轉速：<strong className="text-sky-400 font-mono">{m.speedRpm} rpm</strong></span>
                  </div>
                </div>

                {isCritical ? (
                  <span className="px-2 py-1 rounded-full bg-rose-950/80 border border-rose-500 text-rose-300 text-[11px] font-bold flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" /> 壽命警報 (需換針)
                  </span>
                ) : isWarning ? (
                  <span className="px-2 py-1 rounded-full bg-amber-950/80 border border-amber-500 text-amber-300 text-[11px] font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> 磨耗預警 (備料)
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 正常衝壓打頭
                  </span>
                )}
              </div>

              {/* Workpiece & Tool Details */}
              <div className="bg-slate-950/60 rounded-lg p-2.5 mb-3 border border-slate-800/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">目前生產規格：</span>
                  <span className="font-semibold text-slate-200">{m.screwSpec}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">螺絲鋼材：</span>
                  <span className="text-amber-300 font-mono">{m.screwMaterial}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-1">
                  <span className="text-slate-400">掛載沖棒型號：</span>
                  <span className="font-mono text-sky-300 font-medium">{m.punchSpec}</span>
                </div>
              </div>

              {/* Hitting Counter & Wear Gauge */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-end justify-between font-mono">
                  <div>
                    <span className="text-[11px] text-slate-400 block uppercase">累計打頭衝次 (Hits)</span>
                    <span className="text-2xl font-bold tracking-tight text-white">
                      {m.currentHits.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">
                      / {m.expectedLifeHits.toLocaleString()} 次
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">模具磨耗度</span>
                    <span
                      className={`text-lg font-bold ${
                        isCritical 
                          ? "text-rose-400" 
                          : isWarning 
                          ? "text-amber-400" 
                          : "text-emerald-400"
                      }`}
                    >
                      {usagePercent}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isCritical
                        ? "bg-rose-500 animate-pulse"
                        : isWarning
                        ? "bg-amber-400"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>預估剩餘衝次：<strong className={isCritical ? "text-rose-300" : "text-slate-200"}>{remainingHits.toLocaleString()} 衝</strong></span>
                  <span>操作員：{m.operator}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => onTriggerReorder(m)}
                  className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isCritical
                      ? "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950"
                      : isWarning
                      ? "bg-amber-600 hover:bg-amber-500 text-white"
                      : "bg-sky-700 hover:bg-sky-600 text-white"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  {isCritical ? "緊急向模具廠叫料" : "連動叫料備品"}
                </button>

                <button
                  onClick={() => onReportDefect(m)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1"
                  title="回報崩模或同心度異常"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  異常回報
                </button>

                <button
                  onClick={() => onResetMachinePunch(m.machineId)}
                  className="p-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white border border-slate-700"
                  title="完成換針，重設打擊計數"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
