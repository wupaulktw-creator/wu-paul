import React from "react";
import { History, Shield, Filter, Search, User, Clock, CheckCircle2 } from "lucide-react";
import { repository } from "../repositories";

export const AuditLogPage: React.FC = () => {
  const logs = repository.getAuditLogs();

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <History className="w-5 h-5 text-sky-400" />
          <span>全廠資安與變更稽核軌跡 (Audit Log Trail)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          記錄所有圖面版本發行、CAD 審核放行、工單製程跳轉、沖棒狀態變更與 AI 自動推論紀錄
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-950/40 font-mono">
          <span>共記錄 {logs.length} 筆關鍵操作事件</span>
          <span className="text-emerald-400">不可竄改日誌安全層級：Grade A</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {logs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-850/50 transition-colors text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{log.userName}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 font-mono text-slate-300">
                      {log.entityType}: {log.entityId}
                    </span>
                  </div>
                  <div className="text-slate-300 mt-0.5">{log.action}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 shrink-0">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
