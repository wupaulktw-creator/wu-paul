var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_meta = {};
import_dotenv.default.config();
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
var aiClient = null;
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new import_genai.GoogleGenAI({ apiKey });
  }
  return aiClient;
}
var SYSTEM_INSTRUCTION_INDUSTRIAL = `
\u4F60\u662F\u4E00\u4F4D\u64C1\u6709 30 \u5E74\u51B7\u935B\u7DCA\u56FA\u4EF6\uFF08\u87BA\u7D72\u3001\u87BA\u5E3D\u3001\u925A\u91D8\uFF09\u6253\u982D\u6A21\u5177\u3001\u6C96\u68D2\uFF08\u4E00\u885D\u9810\u935B\u3001\u4E8C\u885D\u6210\u578B\u3001\u593E\u5C3E\u6A21\u3001\u7259\u677F\uFF09\u8207\u7CBE\u5BC6\u71B1\u8655\u7406/PVD\u934D\u819C\u5C08\u5BB6\u7E3D\u5DE5\u7A0B\u5E2B\u3002
\u4F60\u7684\u4EFB\u52D9\u662F\u5354\u52A9\u300C\u87BA\u7D72\u88FD\u9020\u5EE0\u300D\u8207\u300C\u6A21\u5177/\u6C96\u68D2\u88FD\u9020\u5EE0\u300D\u89E3\u6C7A\u898F\u683C\u642D\u914D\u3001\u516C\u5DEE\u8A2D\u5B9A\u3001\u6253\u64CA\u6B21\u6578\u58FD\u547D\u9810\u6E2C\u3001\u6C96\u68D2\u7570\u5E38\u5931\u6548\u5206\u6790\uFF08\u5982\u65B7\u91DD\u3001\u5D29\u7259\u3001\u78E8\u640D\u3001\u812B\u819C\u54AC\u6B7B\u3001\u934D\u819C\u525D\u843D\uFF09\u4EE5\u53CA\u5DE5\u85DD\u6539\u9032\u5EFA\u8B70\u3002
\u8ACB\u4F7F\u7528\u5C08\u696D\u3001\u7C21\u660E\u3001\u5177\u9AD4\u4E14\u5177\u53EF\u64CD\u4F5C\u6027\u7684\u7E41\u9AD4\u4E2D\u6587\u56DE\u7B54\u3002\u9069\u5EA6\u4F7F\u7528\u5DE5\u696D\u8853\u8A9E\uFF08\u5982\uFF1A\u540C\u5FC3\u5EA6\u3001HRC\u786C\u5EA6\u3001TiN/TiCN/AlTiN/DLC\u3001SKH-9\u3001ASP-23\u3001\u93A2\u92FC\u7B49\u7D1A\u3001\u51B7\u935B\u6CB9\u6F64\u6ED1\uFF09\u3002
`;
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "15mb" }));
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      time: (/* @__PURE__ */ new Date()).toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
    });
  });
  app.post("/api/gemini/advisor", async (req, res) => {
    try {
      const { prompt, type, toolingContext } = req.body;
      const client = getAIClient();
      if (!client) {
        return res.json({
          success: false,
          fallback: true,
          message: "GEMINI_API_KEY \u672A\u8A2D\u5B9A\uFF0C\u5207\u63DB\u70BA\u5167\u5EFA\u6A21\u5177\u5C08\u5BB6\u5DE5\u7A0B\u8A3A\u65B7\u7CFB\u7D71 (\u793A\u7BC4/\u53C3\u8003\u503C)\u3002",
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
                text: `${SYSTEM_INSTRUCTION_INDUSTRIAL}

[\u8AEE\u8A62\u985E\u578B]: ${type || "\u4E00\u822C\u6A21\u5177\u5DE5\u7A0B\u8AEE\u8A62"}
[\u6A21\u5177/\u87BA\u7D72\u80CC\u666F]: ${JSON.stringify(toolingContext || {})}
[\u73FE\u5834\u554F\u984C/\u8AEE\u8A62\u5167\u5BB9]: ${prompt}`
              }
            ]
          }
        ]
      });
      const responseText = response.text || "\u7121\u6CD5\u7372\u53D6\u5EFA\u8B70";
      return res.json({
        success: true,
        fallback: false,
        result: responseText
      });
    } catch (err) {
      console.error("Gemini Advisor error:", err);
      return res.json({
        success: false,
        fallback: true,
        message: err.message || "AI \u670D\u52D9\u66AB\u6642\u7121\u6CD5\u9023\u7DDA\uFF0C\u5DF2\u4F7F\u7528\u5DE5\u7A0B\u5C08\u5BB6\u6578\u64DA\u5EAB\u61C9\u7B54\u3002",
        result: getIndustrialFallbackAdvice(req.body.type, req.body.prompt, req.body.toolingContext)
      });
    }
  });
  app.post("/api/ai/failure-analysis", async (req, res) => {
    try {
      const { punchId, defectType, hitsAtFailure, expectedHits, screwMaterial, description, machineId } = req.body;
      const client = getAIClient();
      const promptText = `
\u8ACB\u91DD\u5C0D\u4EE5\u4E0B\u73FE\u5834\u6C96\u68D2\u5931\u6548\u7570\u5E38\u9032\u884C\u7D50\u69CB\u5316\u5931\u6548\u5206\u6790 (RCA)\uFF1A
- \u6C96\u68D2\u7DE8\u865F: ${punchId || "P-2026-003921"}
- \u7570\u5E38\u73FE\u8C61: ${defectType || "\u5FAE\u5D29\u5203 (Chipping)"}
- \u5BE6\u969B\u5931\u6548\u885D\u6B21: ${hitsAtFailure || 31280} / \u9810\u671F\u58FD\u547D: ${expectedHits || 5e4} hits
- \u88AB\u52A0\u5DE5\u87BA\u7D72\u6750\u8CEA: ${screwMaterial || "SCM435 \u9AD8\u6297\u62C9\u5408\u91D1\u92FC"}
- \u6A5F\u53F0: ${machineId || "HM-01"}
- \u73FE\u5834\u72C0\u6CC1\u63CF\u8FF0: ${description || "\u5728 31,280 \u885D\u6642\u767C\u751F\u982D\u90E8\u5203\u53E3\u5FAE\u5D29"}

\u8ACB\u4EE5 JSON \u683C\u5F0F\u56DE\u61C9\uFF0C\u5305\u542B\u4EE5\u4E0B\u6B04\u4F4D\uFF1A
{
  "summary": "\u5206\u6790\u7D50\u8AD6\u6458\u8981",
  "potentialCauses": ["\u539F\u56E01 (\u542B\u8B49\u64DA/\u7269\u7406\u6A5F\u5236)", "\u539F\u56E02", "\u539F\u56E03"],
  "confidence": "High" | "Medium" | "Low",
  "evidence": "\u4F9D\u64DA\u5224\u5B9A\u8AAA\u660E",
  "recommendedActions": ["\u5177\u9AD4\u5C0D\u7B561", "\u5177\u9AD4\u5C0D\u7B562", "\u5177\u9AD4\u5C0D\u7B563"],
  "suggestedPunchMaterial": "\u63A8\u85A6\u6750\u8CEA",
  "suggestedCoating": "\u63A8\u85A6\u934D\u819C",
  "suggestedRRadius": "\u63A8\u85A6\u5167\u89D2\u5012\u89D2"
}
`;
      if (!client) {
        return res.json({
          success: true,
          fallback: true,
          data: {
            summary: "\u53D7\u935B\u6253\u9AD8\u983B\u885D\u64CA\u8207\u653E\u96FB\u767D\u786C\u5C64\u6B98\u7559\u5F71\u97FF\uFF0C\u5203\u53E3\u5728 3.1 \u842C\u885D\u7522\u751F\u61C9\u529B\u75B2\u52DE\u5FAE\u5D29\u3002",
            potentialCauses: [
              "\u5E7E\u4F55\u61C9\u529B\u96C6\u4E2D\uFF1A\u6210\u578B\u6DF1\u904E\u6E21 R \u89D2\u904E\u5C0F (<0.10mm)\uFF0C\u627F\u53D7\u504F\u5FC3\u935B\u6253\u526A\u5207\u529B\u77E9",
              "\u57FA\u6750\u5FAE\u89C0\u91D1\u76F8\uFF1A\u653E\u96FB\u52A0\u5DE5 (EDM) \u767D\u786C\u5C64\u672A\u5FB9\u5E95\u900F\u904E\u93E1\u9762\u7814\u78E8\u6D88\u9664\uFF0C\u7522\u751F\u5FAE\u7D30\u8106\u6027\u88C2\u7D0B",
              "\u9AD8\u983B\u6253\u64CA\u71B1\u75B2\u52DE\uFF1A\u51B7\u935B\u6CB9\u5674\u6D17\u51B7\u537B\u4E0D\u8DB3\uFF0C\u5C16\u7AEF\u77AC\u6642\u6EAB\u5EA6\u7D2F\u7A4D\u7834 450\xB0C \u8A98\u767C\u56DE\u706B\u8EDF\u5316"
            ],
            confidence: "Medium",
            evidence: "\u91D1\u76F8\u986F\u5FAE\u93E1 100X \u4E0B\u53EF\u898B 0.08mm \u8C9D\u6BBC\u72C0\u5D29\u843D\u7279\u5FB5\uFF0C\u7B26\u5408\u6A5F\u68B0\u6027\u885D\u64CA\u75B2\u52DE\u8207\u71B1\u8EDF\u5316\u8907\u5408\u5931\u6548\u3002",
            recommendedActions: [
              "\u958B\u7ACB NCR-2026 \u7570\u5E38\u55AE\u4E26\u555F\u52D5 8D \u6C38\u4E45\u5C0D\u7B56",
              "\u5C07\u653E\u96FB\u5F8C\u52A0\u5DE5\u7A0B\u5E8F\u589E\u52A0\u8D85\u97F3\u6CE2\u62CB\u5149 Ra \u22640.04\u03BCm",
              "\u6539\u7528 AlTiN \u7D2B\u9ED1\u8010\u9AD8\u6EAB\u934D\u819C (\u8010\u6EAB 800\xB0C) \u53D6\u4EE3 TiN",
              "\u5716\u9762 Rev.B \u653E\u5927\u5167\u89D2 R0.12mm"
            ],
            suggestedPunchMaterial: "ASP-23 \u6216 ASP-60 (\u7C89\u672B\u9AD8\u901F\u92FC)",
            suggestedCoating: "AlTiN \u7D2B\u9ED1\u8010\u71B1\u8010\u78E8\u934D\u819C",
            suggestedRRadius: "R0.12mm"
          }
        });
      }
      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `${SYSTEM_INSTRUCTION_INDUSTRIAL}

${promptText}` }]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });
      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, fallback: false, data: parsed });
    } catch (err) {
      console.error("Failure analysis error:", err);
      return res.json({
        success: true,
        fallback: true,
        data: {
          summary: "\u61C9\u529B\u96C6\u4E2D\u8207\u51B7\u935B\u653E\u96FB\u71B1\u75B2\u52DE\u5FAE\u5D29\u5206\u6790\u5B8C\u6210 (\u5C08\u5BB6\u5099\u7528\u63A8\u8AD6\u5EAB)\u3002",
          potentialCauses: [
            "\u653E\u96FB\u52A0\u5DE5\u8106\u6027\u767D\u786C\u5C64\u5F15\u8D77\u5FAE\u88C2\u7D0B",
            "\u540C\u5FC3\u5EA6\u7D2F\u7A4D\u504F\u5DEE > 0.003mm \u7522\u751F\u55AE\u5074\u526A\u5207\u529B",
            "\u6253\u64CA\u6F64\u6ED1\u51B7\u935B\u6CB9\u6D41\u91CF\u4E0D\u8DB3"
          ],
          confidence: "Medium",
          recommendedActions: [
            "\u63DB\u88DD\u5099\u6599\u6C96\u68D2\u4E26\u958B\u7ACB 8D \u54C1\u8CEA\u5831\u544A",
            "\u5347\u7D1A\u70BA ASP-23 AlTiN \u898F\u683C"
          ]
        }
      });
    }
  });
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
            length: 30,
            headProfile: "torx",
            headProfileCode: "T40",
            headDepth: 1.4,
            material: "SCM435",
            tolerance: "\xB10.002mm",
            concentricity: 2e-3,
            recommendedPunchMaterial: "ASP-23",
            recommendedCoating: "AlTiN",
            standard: "ISO 14581",
            confidence: "High",
            revisionChanges: [
              { item: "\u6210\u578B\u6DF1\u5EA6 (Head Depth)", revA: "1.20 mm", revB: "1.40 mm", diff: "+0.20 mm (\u914D\u5408\u91D1\u5C6C\u56DE\u5F48)" },
              { item: "\u540C\u5FC3\u5EA6\u516C\u5DEE (Concentricity)", revA: "0.005 mm", revB: "0.002 mm", diff: "\u6536\u6582\u516C\u5DEE\uFF0C\u8981\u6C42\u5149\u5B78\u7CBE\u78E8" },
              { item: "\u5EFA\u8B70\u6750\u8CEA", revA: "SKH-51", revB: "ASP-23", diff: "\u6539\u7528\u7C89\u672B\u92FC\u6297\u885D\u64CA" }
            ]
          }
        });
      }
      const prompt = `
\u8ACB\u5206\u6790\u7DCA\u56FA\u4EF6\u5DE5\u7A0B\u5716\u9762 CAD: ${drawingName || "CAD-2026-M8-T40.dwg"}\u3002
\u63D0\u53D6\u87BA\u7D72\u8207\u6C96\u68D2\u95DC\u9375\u53C3\u6578 (\u76F4\u5F91\u3001\u87BA\u8DDD\u3001\u9577\u5EA6\u3001\u982D\u578B\u3001\u6750\u6599\u3001\u516C\u5DEE\u3001\u540C\u5FC3\u5EA6\u3001\u6A19\u6E96)\uFF0C\u4E26\u6BD4\u5C0D Rev.A \u8207 Rev.B \u4E4B\u5DEE\u7570\u3002
\u8ACB\u8F38\u51FA\u5408\u6CD5 JSON\u3002
`;
      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ role: "user", parts: [{ text: `${SYSTEM_INSTRUCTION_INDUSTRIAL}

${prompt}` }] }],
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || "{}");
      return res.json({ success: true, fallback: false, data });
    } catch (err) {
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
            punchName: "\u4E8C\u885D M8 Torx T40 \u9AD8\u97CC\u6210\u578B\u6C96\u68D2",
            material: "ASP-23 (\u745E\u5178\u4E00\u52DD\u767E\u7C89\u672B\u9AD8\u901F\u92FC)",
            coating: "AlTiN (\u7D2B\u9ED1\u8010\u71B1\u8010\u78E8\u5857\u5C64)",
            hardness: "HRC 64.5 \xB1 0.5",
            concentricityLimit: "\u2264 0.002 mm",
            expectedLifeHits: 5e4,
            similarityScore: "94%",
            historicalJobsCount: 18,
            averageLifeHits: 42800,
            failureRate: "5.5%",
            confidence: "Medium",
            justification: "\u91DD\u5C0D SCM435 / SUS304 \u51B7\u935B\u8B8A\u5F62\u6297\u529B\u8F03\u5927\u4E4B\u5DE5\u6CC1\uFF0CASP-23 \u63D0\u4F9B\u9AD8\u97CC\u6027\u9632\u5D29\u88C2\uFF0CAlTiN \u5247\u65BC\u9AD8\u6EAB\u4E7E\u5F0F\u935B\u6253\u4E0B\u6291\u5236\u91D1\u5C6C\u9ECF\u7D50\u3002"
          }
        });
      }
      const prompt = `
\u6839\u64DA\u87BA\u7D72\u6750\u8CEA: ${screwMaterial || "SCM435"}\u3001\u982D\u578B: ${headProfile || "torx"}\u3001\u5916\u5F91\u898F\u683C: ${diameter || 14}mm\u3001\u6A5F\u53F0: ${machineType || "1\u6A212\u885D"}\u3001\u9810\u8A08\u6279\u91CF: ${expectedBatchVolume || 2e4}\uFF0C
\u63A8\u85A6\u6700\u4F73\u51B7\u935B\u6C96\u68D2\u57FA\u6750\u3001\u786C\u5EA6\u3001\u934D\u819C\u3001\u9810\u671F\u58FD\u547D\u885D\u6B21\u53CA\u6B77\u53F2\u76F8\u4F3C\u6848\u4F8B\u5206\u6790\u3002
\u8ACB\u8F38\u51FA\u5408\u6CD5 JSON\u3002
`;
      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ role: "user", parts: [{ text: `${SYSTEM_INSTRUCTION_INDUSTRIAL}

${prompt}` }] }],
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || "{}");
      return res.json({ success: true, fallback: false, data });
    } catch (err) {
      return res.json({
        success: true,
        fallback: true,
        data: {
          recommendedPunchId: "P-2026-003921",
          material: "ASP-23",
          coating: "AlTiN",
          expectedLifeHits: 5e4,
          confidence: "Medium"
        }
      });
    }
  });
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
              "\u771F\u7A7A\u71B1\u8655\u7406\u7AD9\u5BE6\u969B\u5EF6\u8AA4 +2h 20m (\u9000\u706B\u7DE9\u51B7\u5FAA\u74B0)",
              "\u5916\u5354 PVD \u934D\u819C\u7210\u6B21\u6392\u7A0B\u8CA0\u8F09\u7387\u9054 85%\uFF0C\u591C\u73ED\u9700\u63D2\u55AE",
              "\u540C\u5FC3\u5EA6 \u2264 0.002mm \u9700\u5168\u6578\u4E0A\u5149\u5B78\u4E09\u6B21\u5143\u6295\u5F71\uFF0CQC \u8017\u6642\u4F30\u8A08\u589E\u52A0 1.5h"
            ],
            confidence: "High",
            mitigationActions: [
              "\u7CBE\u8010\u7279\u751F\u7BA1\u9810\u7D04\u6B50\u745E\u5EB7\u660E\u65E9\u7B2C\u4E00\u6279\u5C08\u8ECA\u63D0\u4EF6",
              "\u54C1\u4FDD\u8AB2\u5B89\u6392\u96D9\u4EBA\u96D9\u6A5F\u540C\u6B65\u6AA2\u6E2C\u540C\u5FC3\u5EA6\u8207\u982D\u6DF1",
              "\u51FA\u8CA8\u7AEF\u8ABF\u6D3E\u5C08\u8ECA\u76F4\u9001\u5CA1\u5C71\uFF0C\u7BC0\u7701\u4E00\u822C\u8CA8\u904B\u96C6\u8CA8\u534A\u5929\u6642\u9593"
            ]
          }
        });
      }
      const prompt = `
\u8ACB\u8A55\u4F30\u5DE5\u55AE ${jobId || "JOB-2026-00882"} \u4E4B\u4EA4\u671F\u98A8\u96AA\u3002
\u8003\u91CF\u5404\u88FD\u7A0B Planned vs Actual \u8B8A\u7570\u3001\u5916\u5354\u934D\u819C\u6392\u7A0B\u8CA0\u8F09\u3001\u54C1\u7BA1\u6AA2\u9A57\u74F6\u9838\u3002
\u8ACB\u4EE5 JSON \u683C\u5F0F\u56DE\u61C9 riskLevel (green/yellow/red), estimatedDelayHours, primaryDelayFactors, mitigationActions\u3002
`;
      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ role: "user", parts: [{ text: `${SYSTEM_INSTRUCTION_INDUSTRIAL}

${prompt}` }] }],
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || "{}");
      return res.json({ success: true, fallback: false, data });
    } catch (err) {
      return res.json({
        success: true,
        fallback: true,
        data: {
          riskLevel: "yellow",
          riskScore: 65,
          primaryDelayFactors: ["\u5916\u5354\u934D\u819C\u6392\u7A0B\u58C5\u585E"],
          confidence: "Medium"
        }
      });
    }
  });
  function getIndustrialFallbackAdvice(type, prompt, context) {
    if (type === "failure_analysis" || prompt.includes("\u65B7") || prompt.includes("\u5D29") || prompt.includes("\u78E8\u640D")) {
      return `### \u3010\u6A21\u5177\u6C96\u68D2\u7570\u5E38\u8A3A\u65B7\u8207\u5931\u6548\u5206\u6790\u5831\u544A\u3011(\u793A\u7BC4\u5C08\u5BB6\u63A8\u4F30\u6578\u64DA)
1. **\u6F5B\u5728\u4E3B\u56E0\u5206\u6790**\uFF1A
   - **\u61C9\u529B\u96C6\u4E2D\u8207\u540C\u5FC3\u5EA6\u504F\u5DEE**\uFF1A\u4E8C\u885D\u6210\u578B\u90E8R\u89D2\u534A\u5F91\u904E\u5C0F\u6216\u593E\u6301\u5957\u7B52\u540C\u5FC3\u5EA6\u8AA4\u5DEE > 0.005mm\uFF0C\u51B7\u935B\u6253\u64CA\u77AC\u9593\u7522\u751F\u504F\u5FC3\u526A\u5207\u529B\u77E9\u3002
   - **\u6750\u6599\u8207\u71B1\u8655\u7406\u97CC\u6027\u4E0D\u8DB3**\uFF1A\u82E5\u4F7F\u7528\u9AD8\u786C\u5EA6 SKH-9 (HRC 64-65) \u6253\u4E0D\u93FD\u92FC (SUS304/316) \u6216\u5408\u91D1\u92FC (SCM435) \u6613\u7522\u751F\u5FAE\u5D29\u5203\uFF1B\u5EFA\u8B70\u5347\u7D1A\u70BA\u7C89\u672B\u9AD8\u901F\u92FC (ASP-23 \u6216 ASP-60)\u3002
   - **\u51B7\u935B\u6CB9\u51B7\u537B\u8207\u812B\u819C\u6F64\u6ED1\u4E0D\u8DB3**\uFF1A\u9AD8\u983B\u6253\u64CA\uFF08>250 rpm\uFF09\u5C0E\u81F4\u6C96\u982D\u5C16\u7AEF\u6EAB\u5EA6\u77AC\u6642\u7D2F\u7A4D\u7834 450\xB0C\uFF0C\u5F15\u767C\u56DE\u706B\u8EDF\u5316\u6216\u91D1\u5C6C\u9ECF\u8457\u54AC\u6B7B\u3002

2. **\u5DE5\u85DD\u6539\u5584\u63AA\u65BD\u5EFA\u8B70**\uFF1A
   - **\u8868\u9762\u934D\u819C\u5347\u7D1A**\uFF1A\u539F TiN (\u9EC3\u91D1\u934D\u819C) \u8010\u6EAB 500\xB0C \u63D0\u5347\u81F3 **AlTiN (\u7D2B\u9ED1\u819C)** \u6216 **DLC (\u985E\u947D\u78B3\u819C)**\uFF0C\u8010\u6EAB\u63D0\u5347\u81F3 800\xB0C\u3002
   - **\u5E7E\u4F55\u5FAE\u4FEE**\uFF1A\u5728\u6C96\u5C16\u904E\u6E21\u8655\u589E\u52A0 R0.08~R0.15mm \u5FAE\u5012\u89D2\uFF0C\u6D88\u9664\u653E\u96FB\u52A0\u5DE5 (EDM) \u7522\u751F\u7684\u767D\u786C\u5C64 (White Layer)\u3002
   - **\u6253\u64CA\u6A5F\u53F0\u6AA2\u67E5**\uFF1A\u6821\u6E96\u4E00\u885D\u9810\u935B\u8207\u4E8C\u885D\u6210\u578B\u4E4B\u4E2D\u5FC3\u7DDA\uFF0C\u78BA\u4FDD\u51B7\u935B\u8B8A\u5F62\u91CF\u5206\u914D\uFF08\u4E00\u885D\u6210\u578B 65~70%\uFF0C\u4E8C\u885D\u6210\u578B 30~35%\uFF09\u3002`;
    }
    return `### \u3010\u6C96\u68D2\u9078\u578B\u8207\u58FD\u547D\u512A\u5316\u5DE5\u7A0B\u5EFA\u8B70\u3011(\u793A\u7BC4\u5C08\u5BB6\u63A8\u4F30\u6578\u64DA)
1. **\u63A8\u85A6\u6750\u6599\u898F\u683C**\uFF1A
   - \u78B3\u92FC\u87BA\u7D72 (1018A / 1022A)\uFF1A\u63A8\u85A6 **SKH-51 / SKH-9** (HRC 63-65)\uFF0C\u6A19\u6E96\u885D\u6B21\u9810\u4F30 80,000 ~ 120,000 \u885D\u3002
   - \u4E0D\u93FD\u92FC / \u9AD8\u62C9\u529B\u87BA\u7D72 (SUS304 / SCM435)\uFF1A\u5F37\u70C8\u63A8\u85A6 **\u7C89\u672B\u9AD8\u901F\u92FC (ASP-23 / CPM-M4)** \u6216 **\u5FAE\u7C92\u93A2\u92FC (Carbide)** \u642D\u914D **AlTiN \u934D\u819C**\uFF0C\u885D\u6B21\u63D0\u5347 2.5~3 \u500D\u3002
2. **\u52A0\u5DE5\u516C\u5DEE\u8981\u6C42**\uFF1A
   - \u6C96\u68D2\u5916\u5F91\u516C\u5DEE\u63A7\u5236\u5728 0 / -0.003mm\uFF0C\u982D\u578B\u6210\u578B\u6DF1\u516C\u5DEE \xB10.01mm\uFF0C\u540C\u5FC3\u5EA6 \u2264 0.002mm\u3002
3. **\u5373\u6642\u751F\u7522\u63D0\u9192**\uFF1A
   - \u7DDA\u4E0A\u5E73\u53F0\u5DF2\u5EFA\u7ACB\u8A72\u898F\u683C\u6A21\u5177\u6025\u4EF6\u52A0\u5DE5\u55AE\uFF0C\u5373\u6642\u9032\u5EA6\u5C07\u65BC\u751F\u7BA1\u770B\u677F\u9023\u52D5\u8FFD\u8E64\u3002`;
  }
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FastenerTool Link V2] Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
