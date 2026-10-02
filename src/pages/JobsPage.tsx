import React, { useState } from "react";
import { 
  Briefcase, 
  Search, 
  Filter, 
  ArrowRight, 
  Plus, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Calendar,
  Layers
} from "lucide-react";
import { repository } from "../repositories";
import { Job } from "../types";

interface JobsPageProps {
  onSelectJob: (jobId: string) => void;
  onOpenNewJob: () => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({
  onSelectJob,
  onOpenNewJob
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [search, setSearch] = useState("");

  const jobs = repository.getJobs();

  const filteredJobs = jobs.filter((j) => {
    if (filterStatus !== "all" && j.status !== filterStatus) return false;
    if (filterPriority !== "all" && j.priority !== filterPriority) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        j.jobNumber.toLowerCase().includes(q) ||
        j.productName.toLowerCase().includes(q) ||
        j.customerName.toLowerCase().includes(q) ||
        j.drawingNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5 pb-16 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-sky-400" />
            <span>JOB 工單全生命週期管理 (Job-Centric Hub)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            以 Job 為核心聚合：客戶、產品、圖面版本、模具、沖棒履歷、製程、品保檢驗與 8D
          </p>
        </div>

        <button
          onClick={onOpenNewJob}
          className="px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>開立新沖棒加工單 / RFQ</span>
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜尋工單號 (FTL-00882)、產品、客戶..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-slate-400 font-mono text-[11px]">狀態:</span>
            {["all", "production", "engineering", "completed"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded font-mono ${
                  filterStatus === st
                    ? "bg-sky-600 text-white font-bold"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {st === "all" ? "全部" : st === "production" ? "在製" : st === "engineering" ? "工程/審圖" : "已結案"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            <span className="text-slate-400 font-mono text-[11px]">優先權:</span>
            {["all", "rush_critical", "urgent", "normal"].map((pr) => (
              <button
                key={pr}
                onClick={() => setFilterPriority(pr)}
                className={`px-2 py-1 rounded font-mono ${
                  filterPriority === pr
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {pr === "all" ? "全部" : pr === "rush_critical" ? "特急" : pr === "urgent" ? "急件" : "一般"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            onClick={() => onSelectJob(job.id)}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-600/80 cursor-pointer transition-all shadow-sm flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono font-bold text-sky-400 group-hover:text-sky-300 text-sm">
                  {job.jobNumber}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  job.priority === "rush_critical"
                    ? "bg-rose-950 border border-rose-500 text-rose-300"
                    : job.priority === "urgent"
                    ? "bg-amber-950 border border-amber-500 text-amber-300"
                    : "bg-slate-800 text-slate-300"
                }`}>
                  {job.priority === "rush_critical" ? "特急特派" : job.priority === "urgent" ? "緊急" : "正常"}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-sky-200">
                {job.productName}
              </h3>

              <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                <div>客戶: <strong className="text-slate-200">{job.customerName}</strong></div>
                <div>圖號: <span className="font-mono text-slate-300">{job.drawingNumber}</span> (Rev: {job.drawingRev})</div>
                <div>交期: <span className="font-mono text-sky-300">{job.plannedDeliveryDate}</span></div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">目前站點: <strong className="text-white font-mono">{job.currentStage}</strong></span>
                <span className="font-mono font-bold text-sky-400">{job.progressPercent}%</span>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500"
                  style={{ width: `${job.progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className={`font-mono font-bold ${
                  job.riskLevel === "red" ? "text-rose-400" : job.riskLevel === "yellow" ? "text-amber-400" : "text-emerald-400"
                }`}>
                  Risk: {job.riskLevel?.toUpperCase()}
                </span>
                <span className="text-slate-400 flex items-center gap-1 group-hover:text-sky-300 font-semibold">
                  <span>進入工單總覽</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
