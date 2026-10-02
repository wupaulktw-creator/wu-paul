import { repository } from "../repositories";
import { 
  Job, 
  Punch, 
  Mold, 
  ScrewProduct, 
  Drawing, 
  RFQ, 
  Quote, 
  ProductionJob, 
  QCInspection, 
  NCR, 
  EightDReport, 
  AuditLog, 
  TimelineEvent, 
  ChatMessage, 
  AppNotification, 
  Role,
  MachinePunchState,
  OrderItem,
  DefectTicket,
  OrderStage
} from "../types";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export const api = {
  // Current session & auth
  getRole: (): Role => repository.getCurrentRole(),
  setRole: (role: Role) => repository.setCurrentRole(role),
  getCurrentUser: () => repository.getCurrentUser(),

  // Jobs
  getJobs: async (): Promise<Job[]> => repository.getJobs(),
  getJobById: async (id: string): Promise<Job | undefined> => repository.getJobById(id),
  updateJob: async (id: string, updates: Partial<Job>): Promise<Job | undefined> => repository.updateJob(id, updates),
  advanceJobStage: async (id: string, nextStage: OrderStage): Promise<Job | undefined> => repository.advanceJobStage(id, nextStage),

  // Punches (Digital Passport)
  getPunches: async (): Promise<Punch[]> => repository.getPunches(),
  getPunchById: async (id: string): Promise<Punch | undefined> => repository.getPunchById(id),
  updatePunch: async (id: string, updates: Partial<Punch>): Promise<Punch | undefined> => repository.updatePunch(id, updates),
  updatePunchHits: async (id: string, hits: number): Promise<Punch | undefined> => repository.updatePunchHits(id, hits),

  // Molds
  getMolds: async (): Promise<Mold[]> => repository.getMolds(),
  getMoldById: async (id: string): Promise<Mold | undefined> => repository.getMoldById(id),

  // Products & Drawings
  getProducts: async (): Promise<ScrewProduct[]> => repository.getProducts(),
  getProductById: async (id: string): Promise<ScrewProduct | undefined> => repository.getProductById(id),
  saveProduct: async (product: ScrewProduct) => repository.saveProduct(product),
  getDrawings: async (): Promise<Drawing[]> => repository.getDrawings(),
  getDrawingById: async (id: string): Promise<Drawing | undefined> => repository.getDrawingById(id),
  approveDrawingRevision: async (dwgId: string, revId: string, approver: string) => repository.approveDrawingRevision(dwgId, revId, approver),

  // RFQ & Quotes
  getRFQs: async (): Promise<RFQ[]> => repository.getRFQs(),
  createRFQ: async (data: Partial<RFQ>): Promise<RFQ> => repository.createRFQ(data),
  getQuotes: async (): Promise<Quote[]> => repository.getQuotes(),
  createQuote: async (data: Partial<Quote>): Promise<Quote> => repository.createQuote(data),

  // Production & Machines
  getProductionProcesses: async (jobId?: string): Promise<ProductionJob[]> => repository.getProductionProcesses(jobId),
  getMachines: async () => repository.getMachines(),
  getMachinePunchStates: async (): Promise<MachinePunchState[]> => repository.getMachinePunchStates(),
  saveMachinePunchStates: async (states: MachinePunchState[]) => repository.saveMachinePunchStates(states),

  // Quality: QC & NCR
  getQCs: async (jobId?: string): Promise<QCInspection[]> => repository.getQCs(jobId),
  createQC: async (qc: Partial<QCInspection>): Promise<QCInspection> => repository.createQC(qc),
  getNCRs: async (jobId?: string): Promise<NCR[]> => repository.getNCRs(jobId),
  createNCR: async (ncr: Partial<NCR>): Promise<NCR> => repository.createNCR(ncr),
  updateNCR: async (id: string, updates: Partial<NCR>): Promise<NCR | undefined> => repository.updateNCR(id, updates),
  getEightDReport: async (ncrId: string): Promise<EightDReport | undefined> => repository.getEightDReport(ncrId),

  // Collaboration: Timeline, Messages, Audit
  getTimelineEvents: async (jobId?: string): Promise<TimelineEvent[]> => repository.getTimelineEvents(jobId),
  addTimelineEvent: async (evt: Omit<TimelineEvent, "id" | "timestamp">) => repository.addTimelineEvent(evt),
  getMessages: async (jobId?: string): Promise<ChatMessage[]> => repository.getMessages(jobId),
  sendMessage: async (msg: Partial<ChatMessage>): Promise<ChatMessage> => repository.sendMessage(msg),
  getAuditLogs: async (): Promise<AuditLog[]> => repository.getAuditLogs(),
  getNotifications: async (): Promise<AppNotification[]> => repository.getNotifications(),
  markNotificationRead: async (id: string) => repository.markNotificationRead(id),

  // Backwards compatibility
  getOrders: async (): Promise<OrderItem[]> => repository.getOrders(),
  saveOrders: async (orders: OrderItem[]) => repository.saveOrders(orders),

  // One click seed scenario
  resetToSeedScenario: async () => repository.resetToSeedScenario(),

  // AI Server Endpoints with Resilient Static Fallbacks
  ai: {
    advisor: async (prompt: string, type: string, toolingContext?: any) => {
      try {
        const res = await fetch("/api/gemini/advisor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, type, toolingContext })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("AI advisor offline fallback:", e);
      }
      return {
        success: true,
        fallback: true,
        result: `### 【FastenerTool Link 工業模具專家離線工程建議】\n1. **冷鍛成型與材料推薦**：對於 SCM435 / 合金鋼螺絲，強烈建議沖棒基材採用 **ASP-23** 或 **ASP-60** 粉末高速鋼，兼顧高硬度 (HRC 64~65) 與優異韌性。\n2. **鍍膜升級**：表面升級為紫黑 **AlTiN** 或黑鑽 **DLC** 奈米塗層，耐溫高達 800°C，顯著降低高頻打擊（>250 rpm）之熱咬死與黏結磨損。\n3. **公差與幾何防呆**：模具同心度須嚴格管控在 ≤ 0.002mm，沖尖微倒角 R0.08~0.12mm 可有效釋放放電加工殘留白硬層之微應力，壽命預計提升 150% 以上。`
      };
    },

    failureAnalysis: async (payload: {
      punchId?: string;
      defectType?: string;
      hitsAtFailure?: number;
      expectedHits?: number;
      screwMaterial?: string;
      description?: string;
      machineId?: string;
    }) => {
      try {
        const res = await fetch("/api/ai/failure-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("AI failure analysis offline fallback:", e);
      }
      return {
        success: true,
        fallback: true,
        data: {
          summary: `針對沖棒 ${payload.punchId || "P-2026-003921"} 在 ${payload.hitsAtFailure || 31280} 衝發生 ${payload.defectType || "微崩刃"} 之結構化根因分析完成。`,
          potentialCauses: [
            "放電加工 (EDM) 表面微細白硬層 (White Layer) 誘發初始熱疲勞微裂紋",
            "機台一衝預鍛與二衝中心線偏差 > 0.003mm 產生非對稱剪切應力矩",
            "高壓冷鍛油流量瞬間不足，局部乾磨擦導致沖尖微焊合剝離"
          ],
          confidence: "High",
          recommendedActions: [
            "換裝備用沖棒 (ASP-23 AlTiN)，並立即開立 8D 品質異常分析報告",
            "檢查冷鍛機台下模套筒同心度，校正公差至 ≤ 0.002mm",
            "沖頭尖端幾何轉折增加 R0.10mm 微修圓角並實施鏡面拋光"
          ]
        }
      };
    },

    drawingAnalysis: async (drawingName: string) => {
      try {
        const res = await fetch("/api/ai/drawing-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ drawingName })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("AI drawing analysis offline fallback:", e);
      }
      return {
        success: true,
        fallback: true,
        data: {
          productCode: "SCR-M8-30-T40",
          drawingNumber: drawingName || "CAD-2026-M8-T40",
          currentRev: "Rev.B",
          screwType: "Torx 皿頭沉頭螺絲 (Countersunk)",
          nominalDiameter: "M8.0",
          pitch: "1.25",
          length: 30.0,
          headProfile: "torx",
          headProfileCode: "T40",
          headDepth: 1.40,
          material: "SCM435 (合金鋼)",
          tolerance: "±0.002mm",
          concentricity: 0.002,
          recommendedPunchMaterial: "ASP-23 (粉末高速鋼)",
          recommendedCoating: "AlTiN (紫黑耐熱塗層)",
          standard: "ISO 14581 / DIN 965",
          confidence: "High",
          revisionChanges: [
            { item: "成型深度 (Head Depth)", revA: "1.20 mm", revB: "1.40 mm", diff: "+0.20 mm (配合螺絲金屬回彈)" },
            { item: "同心度公差 (Concentricity)", revA: "0.005 mm", revB: "0.002 mm", diff: "收斂公差，要求光學精磨" },
            { item: "建議基材規格", revA: "SKH-51", revB: "ASP-23", diff: "改用粉末鋼抗衝擊防微崩" }
          ]
        }
      };
    },

    punchRecommendation: async (payload: {
      screwMaterial?: string;
      headProfile?: string;
      diameter?: number;
      machineType?: string;
      expectedBatchVolume?: number;
    }) => {
      try {
        const res = await fetch("/api/ai/punch-recommendation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("AI punch recommendation offline fallback:", e);
      }
      return {
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
          confidence: "High",
          justification: `針對 ${payload.screwMaterial || "SCM435"} 高強度冷鍛變形抗力較大之工況，ASP-23 提供高抗衝擊韌性防崩裂，AlTiN 於高溫乾式鍛打下有效抑制金屬黏結咬死。`
        }
      };
    },

    deliveryRisk: async (payload: {
      jobId?: string;
      plannedDelivery?: string;
      processes?: any[];
    }) => {
      try {
        const res = await fetch("/api/ai/delivery-risk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("AI delivery risk offline fallback:", e);
      }
      return {
        success: true,
        fallback: true,
        data: {
          jobId: payload.jobId || "JOB-2026-00882",
          riskLevel: "yellow",
          riskScore: 68,
          plannedDeliveryDate: payload.plannedDelivery || "2026-09-25",
          estimatedDelayHours: 2.5,
          primaryDelayFactors: [
            "真空熱處理站實際延誤 +2h 20m (退火緩冷循環負荷較高)",
            "外協 PVD 鍍膜爐次排程負載率達 85%，夜班需插單預約",
            "同心度 ≤ 0.002mm 需全數上光學三次元投影儀，QC 耗時估計增加 1.5h"
          ],
          confidence: "High",
          mitigationActions: [
            "精耐特生管預約歐瑞康明早第一批專車提件",
            "品保課安排雙人雙機同步檢測同心度與頭深",
            "出貨端調派專車直送岡山，節省一般貨運集貨半天時間"
          ]
        }
      };
    }
  }
};
