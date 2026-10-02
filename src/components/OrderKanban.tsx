import React, { useState } from "react";
import { OrderItem, OrderStage, Role } from "../types";
import { STAGE_CONFIGS } from "../mockData";
import { PunchCanvasPreview } from "./PunchCanvasPreview";
import { 
  Package, 
  Clock, 
  ArrowRight, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Sparkles,
  Eye,
  FileCheck,
  Zap,
  Filter
} from "lucide-react";

interface OrderKanbanProps {
  orders: OrderItem[];
  onAdvanceStage: (orderId: string, nextStage: OrderStage) => void;
  onOpenChatWithOrder: (orderId: string) => void;
  currentRole: Role;
}

export const OrderKanban: React.FC<OrderKanbanProps> = ({
  orders,
  onAdvanceStage,
  onOpenChatWithOrder,
  currentRole
}) => {
  const [filterUrgency, setFilterUrgency] = useState<string>("all");
  const [selectedPreviewOrder, setSelectedPreviewOrder] = useState<OrderItem | null>(null);

  const stageKeys = Object.keys(STAGE_CONFIGS) as OrderStage[];

  const filteredOrders = orders.filter((o) => {
    if (filterUrgency === "all") return true;
    return o.urgency === filterUrgency;
  });

  const getNextStage = (current: OrderStage): OrderStage | null => {
    const idx = stageKeys.indexOf(current);
    if (idx >= 0 && idx < stageKeys.length - 1) {
      return stageKeys[idx + 1];
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Filter and Overview Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-sky-400" />
            模具沖棒生產排程與在製即時看板
          </h2>
          <p className="text-xs text-slate-400">
            即時同步 12 大加工站別進度 · 鍍膜出爐通知 · 專車物流動態
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> 篩選：
          </span>
          {[
            { id: "all", label: "全部工單" },
            { id: "rush_critical", label: "停機特急 (特快)" },
            { id: "urgent", label: "急件" },
            { id: "normal", label: "標準件" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterUrgency(f.id)}
              className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-all ${
                filterUrgency === f.id
                  ? "bg-sky-950 border-sky-500 text-sky-300 shadow"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => {
          const currentStageMeta = STAGE_CONFIGS[order.currentStage] || STAGE_CONFIGS.rfq_pending;
          const currentStepIndex = stageKeys.indexOf(order.currentStage);
          const nextStage = getNextStage(order.currentStage);

          return (
            <div
              key={order.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 shadow-md transition-all space-y-4"
            >
              {/* Order Top Line */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-bold text-sky-400">
                    {order.orderNumber}
                  </span>

                  {order.urgency === "rush_critical" && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500 text-rose-300 text-xs font-bold flex items-center gap-1 animate-pulse">
                      <Zap className="w-3 h-3 text-rose-400" /> 停機特急件
                    </span>
                  )}
                  {order.urgency === "urgent" && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500 text-amber-300 text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> 急件
                    </span>
                  )}

                  <span className="text-xs text-slate-300 font-semibold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {order.punchType === "second_punch" ? "二衝成型" : order.punchType === "first_punch" ? "一衝打頭" : "模具治具"}
                  </span>
                  <span className="text-xs font-mono text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50">
                    {order.material}
                  </span>
                  <span className="text-xs font-mono text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
                    {order.coating} 鍍膜
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-slate-400">
                    需求交期：<strong className="text-amber-300">{order.requiredDeliveryDate}</strong>
                  </span>
                  <span className="text-slate-400">
                    數量：<strong className="text-white">{order.quantity} 支</strong>
                  </span>
                  <span className="text-slate-400">
                    總價：<strong className="text-emerald-400">NT$ {order.totalAmount.toLocaleString()}</strong>
                  </span>
                </div>
              </div>

              {/* Order Specification Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">沖棒外觀與頭部規格：</span>
                  <span className="font-semibold text-slate-200">
                    D{order.outerDiameter} × L{order.totalLength}mm · 頭深 H={order.headDepth}mm
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    同心度 ◎ {order.concentricity}mm ({order.toleranceLevel})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">配套螺絲標準：</span>
                  <span className="text-sky-300 font-medium">
                    {order.targetScrewStandard}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
                    CAD 圖號: {order.cadDrawingNumber}
                  </span>
                </div>
                <div className="flex flex-col justify-between">
                  <span className="text-slate-400 block mb-0.5">現場備註：</span>
                  <p className="text-slate-300 line-clamp-2 italic text-[11px]">
                    "{order.notes || "無特殊備註"}"
                  </p>
                </div>
              </div>

              {/* Real-time 12-stage Progress Pipeline */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">目前加工站別：</span>
                    <span className="font-bold text-white bg-sky-950 border border-sky-500/50 px-2 py-0.5 rounded text-sky-300">
                      {currentStageMeta.label}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      (責任單位: {currentStageMeta.dept})
                    </span>
                  </div>
                  <div className="font-mono text-slate-300 font-semibold">
                    整體完成度: <span className="text-sky-400">{order.stageProgressPercent}%</span>
                  </div>
                </div>

                {/* Stepper Dots Bar */}
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-1">
                  {stageKeys.map((stageKey, sIdx) => {
                    const isPassed = sIdx < currentStepIndex;
                    const isCurrent = sIdx === currentStepIndex;
                    const meta = STAGE_CONFIGS[stageKey];

                    return (
                      <div
                        key={stageKey}
                        className={`p-1 rounded text-center border transition-all text-[10px] font-mono leading-tight ${
                          isPassed
                            ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                            : isCurrent
                            ? "bg-sky-600 border-sky-400 text-white font-bold shadow-md ring-1 ring-sky-300"
                            : "bg-slate-800/50 border-slate-700/50 text-slate-500"
                        }`}
                        title={`${meta.step}. ${meta.label} (${meta.dept})`}
                      >
                        <div className="truncate">{meta.label.slice(0, 4)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPreviewOrder(order)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                    查看 2D CAD 幾何圖面
                  </button>

                  <button
                    onClick={() => onOpenChatWithOrder(order.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    工程即時聯絡室
                  </button>
                </div>

                {/* Role Specific Actions */}
                <div className="flex items-center gap-2">
                  {currentRole === "mold_factory" && nextStage && (
                    <button
                      onClick={() => onAdvanceStage(order.id, nextStage)}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all"
                    >
                      推進至下一站：{STAGE_CONFIGS[nextStage].label}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {currentRole === "screw_factory" && order.currentStage === "shipping" && (
                    <button
                      onClick={() => onAdvanceStage(order.id, "delivered")}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      確認沖棒已到廠簽收驗收
                    </button>
                  )}

                  {order.currentStage === "delivered" && (
                    <span className="px-3 py-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 rounded-lg flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4" /> 已全數驗收完成入庫
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2D CAD Drawing Modal View */}
      {selectedPreviewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl p-6 text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-mono">
                  {selectedPreviewOrder.cadDrawingNumber} · 沖棒精密工程圖面
                </h3>
                <p className="text-xs text-slate-400">
                  訂單編號: {selectedPreviewOrder.orderNumber} ({selectedPreviewOrder.screwFactoryName})
                </p>
              </div>
              <button
                onClick={() => setSelectedPreviewOrder(null)}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                關閉
              </button>
            </div>

            <PunchCanvasPreview
              punchType={selectedPreviewOrder.punchType}
              headProfile={selectedPreviewOrder.headProfile}
              material={selectedPreviewOrder.material}
              coating={selectedPreviewOrder.coating}
              outerDiameter={selectedPreviewOrder.outerDiameter}
              totalLength={selectedPreviewOrder.totalLength}
              headDepth={selectedPreviewOrder.headDepth}
              concentricity={selectedPreviewOrder.concentricity}
              toleranceLevel={selectedPreviewOrder.toleranceLevel}
            />

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-400 block">模具製造廠：</span>
                <span className="text-slate-200 font-medium">{selectedPreviewOrder.moldFactoryName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">PVD 鍍膜與厚度要求：</span>
                <span className="text-emerald-300 font-mono">{selectedPreviewOrder.coating} (1.5 ~ 2.2 μm)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
