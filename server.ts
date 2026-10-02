import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION_INDUSTRIAL = `
你是一位擁有 30 年冷鍛緊固件（螺絲、螺帽、鉚釘）打頭模具、沖棒（一衝預鍛、二衝成型、夾尾模、牙板）與精密熱處理/PVD鍍膜專家總工程師。
你的任務是協助「螺絲製造廠」與「模具/沖棒製造廠」解決規格搭配、公差設定、打擊次數壽命預測、沖棒異常失效分析（如斷針、崩牙、磨損、脫膜咬死、鍍膜剝落）以及工藝改進建議。
請使用專業、簡明、具體且具可操作性的繁體中文回答。適度使用工業術語（如：同心度、HRC硬度、TiN/TiCN/AlTiN/DLC、SKH-9、ASP-23、鎢鋼等級、冷鍛油潤滑）。
`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: "ok", 
      time: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // 1. Legacy & Direct Advisor endpoint (Maintained for existing components)
  app.post("/api/gemini/advisor", async (req, res) => {
    try {
      const { prompt, type, toolingContext } = req.body;
      const client = getAIClient();

      if (!client) {
        return res.json({
          success: false,
          fallback: true,
          message: "GEMINI_API_KEY 未設定，切換為內建模具專家工程診斷系統 (示範/參考值)。",
          result: getIndustrialFallbackAdvice(type, prompt, toolingContext)
        });
      }

      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${SYSTEM_INSTRUCTION_INDUSTRIAL}\n\n[諮詢類型]: ${type || "一般模具工程諮詢"}\n[模具/螺絲背景]: ${JSON.stringify(toolingContext || {})}\n[現場問題/諮詢內容]: ${prompt}`
              }
            ]
          }
        ]
      });

      const responseText = response.text || "無法獲取建議";
      return res.json({
        success: true,
        fallback: false,
        result: responseText
      });
    } catch (err: any) {
      console.error("Gemini Advisor error:", err);
      return res.json({
        success: false,
        fallback: true,
        message: err.message || "AI 服務暫時無法連線，已使用工程專家數據庫應答。",
        result: getIndustrialFallbackAdvice(req.body.type, req.body.prompt, req.body.toolingContext)
      });
    }
  });

  // 2. Structured Failure Diagnosis & NCR Advisor
  app.post("/api/ai/failure-analysis", async (req, res) => {
    try {
      const { punchId, defectType, hitsAtFailure, expectedHits, screwMaterial, description, machineId } = req.body;
      const client = getAIClient();

      const promptText = `
請針對以下現場沖棒失效異常進行結構化失效分析 (RCA)：
- 沖棒編號: ${punchId || "P-2026-003921"}
- 異常現象: ${defectType || "微崩刃 (Chipping)"}
- 實際失效衝次: ${hitsAtFailure || 31280} / 預期壽命: ${expectedHits || 50000} hits
- 被加工螺絲材質: ${screwMaterial || "SCM435 高抗拉合金鋼"}
- 機台: ${machineId || "HM-01"}
- 現場狀況描述: ${description || "在 31,280 衝時發生頭部刃口微崩"}

請以 JSON 格式回應，包含以下欄位：
{
  "summary": "分析結論摘要",
  "potentialCauses": ["原因1 (含證據/物理機制)", "原因2", "原因3"],
  "confidence": "High" | "Medium" | "Low",
  "evidence": "依據判定說明",
  "recommendedActions": ["具體對策1", "具體對策2", "具體對策3"],
  "suggestedPunchMaterial": "推薦材質",
  "suggestedCoating": "推薦鍍膜",
  "suggestedRRadius": "推薦內角倒角"
}
`;

      if (!client) {
        return res.json({
          success: true,
          fallback: true,
          data: {
            summary: "受鍛打高頻衝擊與放電白硬層殘留影響，刃口在 3.1 萬衝產生應力疲勞微崩。",
            potentialCauses: [
              "幾何應力集中：成型深過渡 R 角過小 (<0.10mm)，承受偏心鍛打剪切力矩",
              "基材微觀金相：放電加工 (EDM) 白硬層未徹底透過鏡面研磨消除，產生微細脆性裂紋",
              "高頻打擊熱疲勞：冷鍛油噴洗冷卻不足，尖端瞬時溫度累積破 450°C 誘發回火軟化"
            ],
            confidence: "Medium",
            evidence: "金相顯微鏡 100X 下可見 0.08mm 貝殼狀崩落特徵，符合機械性衝擊疲勞與熱軟化複合失效。",
            recommendedActions: [
              "開立 NCR-2026 異常單並啟動 8D 永久對策",
              "將放電後加工程序增加超音波拋光 Ra ≤0.04μm",
              "改用 AlTiN 紫黑耐高溫鍍膜 (耐溫 800°C) 取代 TiN",
              "圖面 Rev.B 放大內角 R0.12mm"
            ],
            suggestedPunchMaterial: "ASP-23 或 ASP-60 (粉末高速鋼)",
            suggestedCoating: "AlTiN 紫黑耐熱耐磨鍍膜",
            suggestedRRadius: "R0.12mm"
          }
        });
      }

      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `${SYSTEM_INSTRUCTION_INDUSTRIAL}\n\n${promptText}` }]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, fallback: false, data: parsed });
    } catch (err: any) {
      console.error("Failure analysis error:", err);
      return res.json({
        success: true,
        fallback: true,
        data: {
          summary: "應力集中與冷鍛放電熱疲勞微崩分析完成 (專家備用推論庫)。",
          potentialCauses: [
            "放電加工脆性白硬層引起微裂紋",
            "同心度累積偏差 > 0.003mm 產生單側剪切力",
            "打擊潤滑冷鍛油流量不足"
          ],
          confidence: "Medium",
          recommendedActions: [
            "換裝備料沖棒並開立 8D 品質報告",
            "升級為 ASP-23 AlTiN 規格"
          ]
        }
      });
    }
  });

  // 3. AI Drawing Analysis & Spec Extraction
  app.post("/api/ai/drawing-analysis", async (req, res) => {
    try {
      const { drawingName, mockExtract } = req.body;
      const client = getAIClient();

      if (!client || mockExtract) {
        return res.json({
          success: true,
          fallback: true,
          data: {
            productCode: "SCR-M8-30-T40",
            drawingNumber: "CAD-2026-M8-T40",
            currentRev: "Rev.B",
            screwType: "Torx Countersunk Screw",
            nominalDiameter: "M8.0",
            pitch: "1.25",
            length: 30.0,
            headProfile: "torx",
            headProfileCode: "T40",
            headDepth: 1.40,
            material: "SCM435",
            tolerance: "±0.002mm",
            concentricity: 0.002,
            recommendedPunchMaterial: "ASP-23",
            recommendedCoating: "AlTiN",
            standard: "ISO 14581",
            confidence: "High",
            revisionChanges: [
              { item: "成型深度 (Head Depth)", revA: "1.20 mm", revB: "1.40 mm", diff: "+0.20 mm (配合金屬回彈)" },
              { item: "同心度公差 (Concentricity)", revA: "0.005 mm", revB: "0.002 mm", diff: "收斂公差，要求光學精磨" },
              { item: "建議材質", revA: "SKH-51", revB: "ASP-23", diff: "改用粉末鋼抗衝擊" }
            ]
          }
        });
      }

      const prompt = `
請分析緊固件工程圖面 CAD: ${drawingName || "CAD-2026-M8-T40.dwg"}。
提取螺絲與沖棒關鍵參數 (直徑、螺距、長度、頭型、材料、公差、同心度、標準)，並比對 Rev.A 與 Rev.B 之差異。
請輸出合法 JSON。
`;
      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ role: "user", parts: [{ text: `${SYSTEM_INSTRUCTION_INDUSTRIAL}\n\n${prompt}` }] }],
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || "{}");
      return res.json({ success: true, fallback: false, data });
    } catch (err: any) {
      return res.json({
        success: true,
        fallback: true,
        data: {
          productCode: "SCR-M8-30-T40",
          currentRev: "Rev.B",
          headProfile: "torx",
          confidence: "Medium"
        }
      });
    }
  });

  // 4. AI Punch Recommendation
  app.post("/api/ai/punch-recommendation", async (req, res) => {
    try {
      const { screwMaterial, headProfile, diameter, machineType, expectedBatchVolume } = req.body;
      const client = getAIClient();

      if (!client) {
        return res.json({
          success: true,
          fallback: true,
          data: {
            recommendedPunchId: "P-2026-003921",
            punchName: "二衝 M8 Torx T40 高韌成型沖棒",
            material: "ASP-23 (瑞典一勝百粉末高速鋼)",
            coating: "AlTiN (紫黑耐熱耐磨塗層)",
            hardness: "HRC 64.5 ± 0.5",
            concentricityLimit: "≤ 0.002 mm",
            expectedLifeHits: 50000,
            similarityScore: "94%",
            historicalJobsCount: 18,
            averageLifeHits: 42800,
            failureRate: "5.5%",
            confidence: "Medium",
            justification: "針對 SCM435 / SUS304 冷鍛變形抗力較大之工況，ASP-23 提供高韌性防崩裂，AlTiN 則於高溫乾式鍛打下抑制金屬黏結。"
          }
        });
      }

      const prompt = `
根據螺絲材質: ${screwMaterial || "SCM435"}、頭型: ${headProfile || "torx"}、外徑規格: ${diameter || 14}mm、機台: ${machineType || "1模2衝"}、預計批量: ${expectedBatchVolume || 20000}，
推薦最佳冷鍛沖棒基材、硬度、鍍膜、預期壽命衝次及歷史相似案例分析。
請輸出合法 JSON。
`;
      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ role: "user", parts: [{ text: `${SYSTEM_INSTRUCTION_INDUSTRIAL}\n\n${prompt}` }] }],
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || "{}");
      return res.json({ success: true, fallback: false, data });
    } catch (err: any) {
      return res.json({
        success: true,
        fallback: true,
        data: {
          recommendedPunchId: "P-2026-003921",
          material: "ASP-23",
          coating: "AlTiN",
          expectedLifeHits: 50000,
          confidence: "Medium"
        }
      });
    }
  });

  // 5. AI Delivery Risk Prediction
  app.post("/api/ai/delivery-risk", async (req, res) => {
    try {
      const { jobId, plannedDelivery, processes } = req.body;
      const client = getAIClient();

      if (!client) {
        return res.json({
          success: true,
          fallback: true,
          data: {
            jobId: jobId || "JOB-2026-00882",
            riskLevel: "yellow",
            riskScore: 68,
            plannedDeliveryDate: plannedDelivery || "2026-09-25",
            estimatedDelayHours: 2.5,
            primaryDelayFactors: [
              "真空熱處理站實際延誤 +2h 20m (退火緩冷循環)",
              "外協 PVD 鍍膜爐次排程負載率達 85%，夜班需插單",
              "同心度 ≤ 0.002mm 需全數上光學三次元投影，QC 耗時估計增加 1.5h"
            ],
            confidence: "High",
            mitigationActions: [
              "精耐特生管預約歐瑞康明早第一批專車提件",
              "品保課安排雙人雙機同步檢測同心度與頭深",
              "出貨端調派專車直送岡山，節省一般貨運集貨半天時間"
            ]
          }
        });
      }

      const prompt = `
請評估工單 ${jobId || "JOB-2026-00882"} 之交期風險。
考量各製程 Planned vs Actual 變異、外協鍍膜排程負載、品管檢驗瓶頸。
請以 JSON 格式回應 riskLevel (green/yellow/red), estimatedDelayHours, primaryDelayFactors, mitigationActions。
`;
      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ role: "user", parts: [{ text: `${SYSTEM_INSTRUCTION_INDUSTRIAL}\n\n${prompt}` }] }],
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || "{}");
      return res.json({ success: true, fallback: false, data });
    } catch (err: any) {
      return res.json({
        success: true,
        fallback: true,
        data: {
          riskLevel: "yellow",
          riskScore: 65,
          primaryDelayFactors: ["外協鍍膜排程壅塞"],
          confidence: "Medium"
        }
      });
    }
  });

  // Fallback function for domain knowledge
  function getIndustrialFallbackAdvice(type: string, prompt: string, context: any) {
    if (type === "failure_analysis" || prompt.includes("斷") || prompt.includes("崩") || prompt.includes("磨損")) {
      return `### 【模具沖棒異常診斷與失效分析報告】(示範專家推估數據)
1. **潛在主因分析**：
   - **應力集中與同心度偏差**：二衝成型部R角半徑過小或夾持套筒同心度誤差 > 0.005mm，冷鍛打擊瞬間產生偏心剪切力矩。
   - **材料與熱處理韌性不足**：若使用高硬度 SKH-9 (HRC 64-65) 打不鏽鋼 (SUS304/316) 或合金鋼 (SCM435) 易產生微崩刃；建議升級為粉末高速鋼 (ASP-23 或 ASP-60)。
   - **冷鍛油冷卻與脫膜潤滑不足**：高頻打擊（>250 rpm）導致沖頭尖端溫度瞬時累積破 450°C，引發回火軟化或金屬黏著咬死。

2. **工藝改善措施建議**：
   - **表面鍍膜升級**：原 TiN (黃金鍍膜) 耐溫 500°C 提升至 **AlTiN (紫黑膜)** 或 **DLC (類鑽碳膜)**，耐溫提升至 800°C。
   - **幾何微修**：在沖尖過渡處增加 R0.08~R0.15mm 微倒角，消除放電加工 (EDM) 產生的白硬層 (White Layer)。
   - **打擊機台檢查**：校準一衝預鍛與二衝成型之中心線，確保冷鍛變形量分配（一衝成型 65~70%，二衝成型 30~35%）。`;
    }

    return `### 【沖棒選型與壽命優化工程建議】(示範專家推估數據)
1. **推薦材料規格**：
   - 碳鋼螺絲 (1018A / 1022A)：推薦 **SKH-51 / SKH-9** (HRC 63-65)，標準衝次預估 80,000 ~ 120,000 衝。
   - 不鏽鋼 / 高拉力螺絲 (SUS304 / SCM435)：強烈推薦 **粉末高速鋼 (ASP-23 / CPM-M4)** 或 **微粒鎢鋼 (Carbide)** 搭配 **AlTiN 鍍膜**，衝次提升 2.5~3 倍。
2. **加工公差要求**：
   - 沖棒外徑公差控制在 0 / -0.003mm，頭型成型深公差 ±0.01mm，同心度 ≤ 0.002mm。
3. **即時生產提醒**：
   - 線上平台已建立該規格模具急件加工單，即時進度將於生管看板連動追蹤。`;
  }

  // Vite middleware in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FastenerTool Link V2] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
