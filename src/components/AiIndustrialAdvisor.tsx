import React, { useState } from "react";
import { 
  Bot, 
  Sparkles, 
  Send, 
  Wrench, 
  AlertCircle, 
  ShieldAlert, 
  Lightbulb,
  CheckCircle2,
  Cpu
} from "lucide-react";

export const AiIndustrialAdvisor: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [advisorType, setAdvisorType] = useState<string>("failure_analysis");
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);

  const presetQuestions = [
    {
      label: "打 SUS304 不鏽鋼十字沖棒微崩刃對策",
      query: "我們現場用 ASP-23 十字#2 二衝打 SUS304 筆電螺絲，打到約 3.2 萬衝時十字刃口出現微崩刃，請問如何升級材料、倒角與鍍膜？",
      type: "failure_analysis"
    },
    {
      label: "打乾壁螺絲 1022A 沖頭高溫黏模咬死",
      query: "機台高速打 1022A 乾壁螺絲 (轉速 280 rpm)，TiN 金色鍍膜在 5 萬衝時尖端產生黑化脫膜與金屬咬附，如何解決冷鍛熱回火？",
      type: "coating_optimization"
    },
    {
      label: "一衝與二衝冷鍛金屬流動變形量配比",
      query: "在 1模2衝 打外六角法蘭螺栓時，一衝預鍛與二衝終鍛的頭部變形量比例應該如何分配，才能避免沖棒折斷？",
      type: "process_guidance"
    },
    {
      label: "微型梅花星型 T6 沖棒同心度公差要求",
      query: "光學級微型梅花 T6 沖棒，在鎢鋼 (Carbide) 研磨時，外徑與六角星刃的同心度、粗糙度建議多少才能避免偏心？",
      type: "tolerance_standard"
    }
  ];

  const handleAskAdvisor = async (queryText?: string, type?: string) => {
    const textToSubmit = queryText || prompt;
    if (!textToSubmit.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSubmit,
          type: type || advisorType,
          toolingContext: {
            industry: "Fastener & Tooling Manufacturing",
            location: "Taiwan Fastener Cluster (Gangshan)",
            materials: ["SKH-9", "SKH-51", "ASP-23", "ASP-60", "Tungsten Carbide"],
            coatings: ["TiN", "TiCN", "AlTiN", "DLC"]
          }
        })
      });

      const data = await response.json();
      setResult(data.result);
      setIsUsingFallback(Boolean(data.fallback));
    } catch (err) {
      console.error(err);
      setResult(`### 【模具沖棒工程專家離線建議】\n1. **冷鍛崩刃主因**：通常來自瞬間應力峰值與熱疲勞累積。\n2. **改善對策**：建議改用粉末高速鋼 ASP-23 或 ASP-60，表面升級為紫黑 AlTiN 或黑鑽 DLC 鍍膜。\n3. **幾何尺寸**：沖尖轉折處增加 R0.08~0.12mm 微圓角，可使衝次壽命延長 150% 以上。`);
      setIsUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-5 space-y-5">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Gemini AI 模具與沖棒工程診斷顧問
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-500/50 text-indigo-300 font-mono">
                Gemini 3.8 Flash Industrial Agent
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              專精螺絲冷鍛模具、沖棒斷針/崩牙根因分析 (RCA)、PVD奈米鍍膜升級與國際標準建議
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 text-xs">
          {[
            { id: "failure_analysis", label: "崩刃/失效診斷" },
            { id: "coating_optimization", label: "PVD鍍膜選型" },
            { id: "tolerance_standard", label: "公差與標準" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setAdvisorType(cat.id)}
              className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
                advisorType === cat.id
                  ? "bg-indigo-950 border-indigo-500 text-indigo-300"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Fast Queries */}
      <div>
        <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          現場工程師高頻諮詢範例（點擊即時診斷）：
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(q.query);
                setAdvisorType(q.type);
                handleAskAdvisor(q.query, q.type);
              }}
              className="text-left p-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-xs text-slate-200 transition-all flex items-start justify-between group"
            >
              <span className="group-hover:text-sky-300 font-medium">{q.label}</span>
              <span className="text-[10px] text-slate-500 shrink-0 ml-2 font-mono">快速診斷 →</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Input */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-300">
          輸入現場沖棒問題、螺絲鍛造異音、或詢問模具設計參數：
        </label>
        <div className="flex gap-2">
          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例如：機台打 SCM435 汽車輪圈螺栓，二衝梅花頭打到 1.5 萬次時產生側向磨痕，請問模具同心度或脫料角該如何修正？"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleAskAdvisor()}
            disabled={loading || !prompt.trim()}
            className="px-5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 shadow-lg shadow-indigo-950 transition-all shrink-0"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>專家分析</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className="bg-slate-950 border border-indigo-900/50 rounded-xl p-5 shadow-inner space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" />
              AI 工業總工程師 · 診斷分析與工藝對策報告
            </span>
            {isUsingFallback && (
              <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                內建模具工程知識庫模式
              </span>
            )}
          </div>

          <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
            {result}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>建議採納後，可點選頂部「智慧訂製」直接向模具廠更新 CAD 圖面與公差要求。</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(result);
                alert("診斷報告已複製至剪貼簿！");
              }}
              className="text-sky-400 hover:underline"
            >
              複製報告
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
