import React, { useState } from "react";
import { 
  Bot, 
  ScanLine, 
  Lightbulb, 
  ShieldAlert, 
  TrendingUp, 
  Send, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck2, 
  Cpu,
  Layers,
  Wrench,
  Clock,
  RotateCcw
} from "lucide-react";
import { api } from "../api/client";
import { repository } from "../repositories";

interface AIPageProps {
  initialTool?: "advisor" | "drawing" | "punch" | "failure" | "risk";
  onNavigateToNCR: (ncrId: string) => void;
  onNavigateToJob: (jobId: string) => void;
}

export const AIPage: React.FC<AIPageProps> = ({
  initialTool = "advisor",
  onNavigateToNCR,
  onNavigateToJob
}) => {
  const [activeTool, setActiveTool] = useState<
    "advisor" | "drawing" | "punch" | "failure" | "risk"
  >(initialTool);

  // Tool 1: Advisor Chat state
  const [advisorPrompt, setAdvisorPrompt] = useState("");
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [advisorHistory, setAdvisorHistory] = useState<Array<{ role: "user" | "ai"; text: string }>>([
    {
      role: "ai",
      text: "您好！我是 FastenerTool Link 工業模具與沖棒 AI 專家顧問。您可以詢問我關於冷鍛成型、沖棒基材選用 (SKH-9 / ASP-23 / 鎢鋼)、PVD 鍍膜 (TiN / AlTiN / DLC)、同心度與打頭機台異常失效對策。"
    }
  ]);

  // Tool 2: Drawing Analysis state
  const [drawingLoading, setDrawingLoading] = useState(false);
  const [drawingResult, setDrawingResult] = useState<any>(null);

  // Tool 3: Punch Recommendation state
  const [punchScrewMaterial, setPunchScrewMaterial] = useState("SCM435");
  const [punchHeadProfile, setPunchHeadProfile] = useState("torx");
  const [punchLoading, setPunchLoading] = useState(false);
  const [punchResult, setPunchResult] = useState<any>(null);

  // Tool 4: Failure Analysis state
  const [failurePunchId, setFailurePunchId] = useState("P-2026-003921");
  const [failureDefectType, setFailureDefectType] = useState("微崩刃 (Chipping)");
  const [failureHits, setFailureHits] = useState(31280);
  const [failureLoading, setFailureLoading] = useState(false);
  const [failureResult, setFailureResult] = useState<any>(null);
  const [createdNcrId, setCreatedNcrId] = useState<string | null>(null);

  // Tool 5: Delivery Risk state
  const [riskLoading, setRiskLoading] = useState(false);
  const [riskResult, setRiskResult] = useState<any>(null);

  // Handlers
  const handleAdvisorSubmit = async () => {
    if (!advisorPrompt.trim() || advisorLoading) return;
    const userText = advisorPrompt;
    setAdvisorPrompt("");
    setAdvisorHistory((prev) => [...prev, { role: "user", text: userText }]);
    setAdvisorLoading(true);

    try {
      const res = await api.ai.advisor(userText, "general_engineering", {
        jobId: "FTL-2026-00882",
        product: "M8 Torx Countersunk Screw",
        screwMaterial: "SCM435"
      });
      setAdvisorHistory((prev) => [...prev, { role: "ai", text: res.result || res.message }]);
    } catch (e: any) {
      setAdvisorHistory((prev) => [
        ...prev,
        { role: "ai", text: `AI 連線錯誤: ${e.message || "請稍後重試"}` }
      ]);
    } finally {
      setAdvisorLoading(false);
    }
  };

  const handleRunDrawingAnalysis = async () => {
    setDrawingLoading(true);
    try {
      const res = await api.ai.drawingAnalysis("CAD-2026-M8-T40.dwg");
      setDrawingResult(res.data);
    } finally {
      setDrawingLoading(false);
    }
  };

  const handleRunPunchRecommendation = async () => {
    setPunchLoading(true);
    try {
      const res = await api.ai.punchRecommendation({
        screwMaterial: punchScrewMaterial,
        headProfile: punchHeadProfile,
        diameter: 14,
        machineType: "1模2衝",
        expectedBatchVolume: 20000
      });
      setPunchResult(res.data);
    } finally {
      setPunchLoading(false);
    }
  };

  const handleRunFailureAnalysis = async () => {
    setFailureLoading(true);
    try {
      const res = await api.ai.failureAnalysis({
        punchId: failurePunchId,
        defectType: failureDefectType,
        hitsAtFailure: failureHits,
        expectedHits: 50000,
        screwMaterial: "SCM435",
        description: "刃部在 31,280 衝發生微崩刃，現場螺絲頭部出現偏心毛邊"
      });
      setFailureResult(res.data);
    } finally {
      setFailureLoading(false);
    }
  };

  const handleCreateNcrFromFailure = () => {
    const newNcr = repository.createNCR({
      jobId: "JOB-2026-00882",
      punchId: failurePunchId,
      defectType: "chipping",
      severity: "major",
      description: failureResult?.summary || "沖棒在 31,280 衝發生刃口微崩",
      hitsAtFailure: failureHits,
      expectedHits: 50000,
      containmentAction: "停機換備刀，啟動 8D 異常分析",
      rootCause: failureResult?.potentialCauses?.[0],
      correctiveAction: failureResult?.recommendedActions?.[0]
    });
    setCreatedNcrId(newNcr.id);
  };

  const handleRunDeliveryRisk = async () => {
    setRiskLoading(true);
    try {
      const res = await api.ai.deliveryRisk({
        jobId: "JOB-2026-00882",
        plannedDelivery: "2026-09-25"
      });
      setRiskResult(res.data);
    } finally {
      setRiskLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-16 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Gemini AI 工業模具與沖棒智能引擎 (AI Industrial Co-pilot)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            5 大專屬工業工具：工程顧問、CAD 圖面特徵提取、沖棒選型推薦、失效分析 RCA 與交期風險預測
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: "advisor", label: "模具顧問", icon: Bot },
            { id: "drawing", label: "圖面抽取", icon: ScanLine },
            { id: "punch", label: "選型推薦", icon: Lightbulb },
            { id: "failure", label: "失效 RCA", icon: ShieldAlert },
            { id: "risk", label: "交期風險", icon: TrendingUp }
          ].map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tool 1: AI Advisor */}
      {activeTool === "advisor" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>工業專家對話 (Gemini 3.8 Flash Industrial Engine)</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              預設搭載 30 年冷鍛模具、熱處理與 PVD 鍍膜領域知識庫
            </span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {advisorHistory.map((msg, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl text-xs space-y-1 ${
                  msg.role === "ai"
                    ? "bg-slate-950/80 border border-indigo-900/60 text-slate-200"
                    : "bg-sky-950/40 border border-sky-800/80 text-white ml-8"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold font-mono text-[11px]">
                  {msg.role === "ai" ? (
                    <span className="text-indigo-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Gemini 工業顧問
                    </span>
                  ) : (
                    <span className="text-sky-400">現場工程師</span>
                  )}
                </div>
                <div className="whitespace-pre-wrap leading-relaxed text-xs">
                  {msg.text}
                </div>
              </div>
            ))}
            {advisorLoading && (
              <div className="p-3 rounded-xl bg-slate-950/60 text-indigo-400 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>AI 專家正在推算冷鍛應力與模具壽命模型...</span>
              </div>
            )}
          </div>

          {/* Prompt input */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              value={advisorPrompt}
              onChange={(e) => setAdvisorPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdvisorSubmit()}
              placeholder="輸入模具或沖棒問題，例如：SUS304 打頭沖棒易微崩，該用 ASP-23 還是鎢鋼？"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleAdvisorSubmit}
              disabled={advisorLoading}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>諮詢</span>
            </button>
          </div>
        </div>
      )}

      {/* Tool 2: Drawing Analysis */}
      {activeTool === "drawing" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-sky-400" />
              <span>CAD 工程圖面特徵智能提取 (Drawing OCR & Spec Extractor)</span>
            </h3>
            <button
              onClick={handleRunDrawingAnalysis}
              disabled={drawingLoading}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>分析 CAD-2026-M8-T40.dwg</span>
            </button>
          </div>

          {drawingLoading && (
            <div className="p-8 text-center text-xs text-slate-400">
              <Sparkles className="w-6 h-6 text-sky-400 mx-auto animate-spin mb-2" />
              <span>正在光學辨識圖面幾何特徵與公差標註...</span>
            </div>
          )}

          {drawingResult && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">產品規格</span>
                  <div className="font-bold text-white mt-1">{drawingResult.productCode}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">頭型代碼</span>
                  <div className="font-bold text-sky-400 mt-1">{drawingResult.headProfileCode} ({drawingResult.headProfile})</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">成型頭深</span>
                  <div className="font-bold text-emerald-400 font-mono mt-1">{drawingResult.headDepth} mm</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">同心度公差</span>
                  <div className="font-bold text-amber-400 font-mono mt-1">{drawingResult.tolerance}</div>
                </div>
              </div>

              {drawingResult.revisionChanges && (
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <span className="font-bold text-sky-400 font-mono">版次變更比對 (Rev.A ⟷ Rev.B)</span>
                  <div className="space-y-1">
                    {drawingResult.revisionChanges.map((ch: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-slate-300 border-b border-slate-850 pb-1">
                        <span>{ch.item}</span>
                        <span className="font-mono text-emerald-400">{ch.diff}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tool 3: Punch Recommendation */}
      {activeTool === "punch" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>冷鍛沖棒基材與鍍膜智慧推薦 (Smart Tooling Selector)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-mono block mb-1">螺絲材質 (Screw Material)</label>
              <select
                value={punchScrewMaterial}
                onChange={(e) => setPunchScrewMaterial(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="SCM435">SCM435 (合金結構鋼 - 變形阻力大)</option>
                <option value="SUS304">SUS304 (奧氏體不鏽鋼 - 高黏著性)</option>
                <option value="1022A">1022A (低碳鋼 - 一般標準品)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-mono block mb-1">頭型特徵 (Head Profile)</label>
              <select
                value={punchHeadProfile}
                onChange={(e) => setPunchHeadProfile(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="torx">梅花頭 (Torx / 6-Lobe)</option>
                <option value="hex_socket">內六角 (Hex Socket)</option>
                <option value="phillips">十字槽 (Phillips)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleRunPunchRecommendation}
                disabled={punchLoading}
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>執行專家選型演算</span>
              </button>
            </div>
          </div>

          {punchResult && (
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-800/60 space-y-3 text-xs animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-amber-400 text-sm">{punchResult.punchName}</span>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono font-bold">
                  相似匹配度: {punchResult.similarityScore}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-3 rounded-lg">
                <div><span className="text-slate-400">推薦基材:</span> <strong className="text-white font-mono">{punchResult.material}</strong></div>
                <div><span className="text-slate-400">推薦鍍膜:</span> <strong className="text-indigo-400 font-mono">{punchResult.coating}</strong></div>
                <div><span className="text-slate-400">硬度標準:</span> <strong className="text-emerald-400 font-mono">{punchResult.hardness}</strong></div>
                <div><span className="text-slate-400">預期壽命:</span> <strong className="text-amber-400 font-mono">{punchResult.expectedLifeHits?.toLocaleString()} 衝</strong></div>
              </div>
              <p className="text-slate-300 leading-relaxed">{punchResult.justification}</p>
            </div>
          )}
        </div>
      )}

      {/* Tool 4: Failure Analysis (RCA & 8D) */}
      {activeTool === "failure" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>現場沖棒異常診斷與根本原因分析 (Failure Diagnosis & RCA)</span>
            </h3>
            <button
              onClick={handleRunFailureAnalysis}
              disabled={failureLoading}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>執行 RCA 失效分析</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-mono block mb-1">沖棒編號 (Punch No)</label>
              <input
                type="text"
                value={failurePunchId}
                onChange={(e) => setFailurePunchId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 font-mono block mb-1">異常現象 (Defect Type)</label>
              <select
                value={failureDefectType}
                onChange={(e) => setFailureDefectType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="微崩刃 (Chipping)">微崩刃 (Chipping)</option>
                <option value="斷針 (Breakage)">沖尖斷裂 (Breakage)</option>
                <option value="脫膜咬死 (Galling)">脫膜咬死/拉傷 (Galling)</option>
                <option value="鍍膜剝落 (Flaking)">鍍膜剝落 (Flaking)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 font-mono block mb-1">實際失效衝次 (Hits at Failure)</label>
              <input
                type="number"
                value={failureHits}
                onChange={(e) => setFailureHits(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          {failureResult && (
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-800/70 space-y-4 text-xs animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300 text-sm">RCA 診斷報告：{failureResult.summary}</span>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono font-bold">
                  Confidence: {failureResult.confidence}
                </span>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-300 font-mono">潛在根本原因 (Potential Root Causes - 物理機制):</span>
                {failureResult.potentialCauses?.map((c: string, idx: number) => (
                  <div key={idx} className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    {idx + 1}. {c}
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/80 space-y-1">
                <span className="font-bold text-indigo-300">永久改進建議 (Corrective Actions):</span>
                <p className="text-slate-300">{failureResult.recommendedActions?.join("； ")}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                {!createdNcrId ? (
                  <button
                    onClick={handleCreateNcrFromFailure}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>根據 AI 分析開立 NCR 異常單</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>已開立 NCR-2026 異常單！</span>
                    <button
                      onClick={() => onNavigateToNCR(createdNcrId)}
                      className="text-xs text-sky-400 underline ml-2"
                    >
                      前往查看
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tool 5: Delivery Risk */}
      {activeTool === "risk" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>12 站動態交期風險預測引擎 (Delivery Risk Prediction Engine)</span>
            </h3>
            <button
              onClick={handleRunDeliveryRisk}
              disabled={riskLoading}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>評估 JOB-2026-00882 交期風險</span>
            </button>
          </div>

          {riskResult && (
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-800/80 space-y-3 text-xs animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">工單: {riskResult.jobId}</span>
                  <span className="px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 font-mono font-bold border border-amber-700">
                    風險等級: {riskResult.riskLevel?.toUpperCase()} ({riskResult.riskScore} 分)
                  </span>
                </div>
                <span className="font-mono text-rose-400 font-bold">
                  預估延誤: +{riskResult.estimatedDelayHours} 小時
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-300 font-mono">延誤主因 (Key Bottlenecks):</span>
                {riskResult.primaryDelayFactors?.map((f: string, i: number) => (
                  <div key={i} className="text-slate-300">
                    · {f}
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-sky-400 font-mono">推薦緩解處方 (Mitigation Actions):</span>
                {riskResult.mitigationActions?.map((m: string, i: number) => (
                  <div key={i} className="text-slate-300">
                    ✓ {m}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
