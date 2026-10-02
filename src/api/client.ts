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

  // AI Server Endpoints
  ai: {
    advisor: async (prompt: string, type: string, toolingContext?: any) => {
      const res = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type, toolingContext })
      });
      return res.json();
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
      const res = await fetch("/api/ai/failure-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      return res.json();
    },

    drawingAnalysis: async (drawingName: string) => {
      const res = await fetch("/api/ai/drawing-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drawingName })
      });
      return res.json();
    },

    punchRecommendation: async (payload: {
      screwMaterial?: string;
      headProfile?: string;
      diameter?: number;
      machineType?: string;
      expectedBatchVolume?: number;
    }) => {
      const res = await fetch("/api/ai/punch-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      return res.json();
    },

    deliveryRisk: async (payload: {
      jobId?: string;
      plannedDelivery?: string;
      processes?: any[];
    }) => {
      const res = await fetch("/api/ai/delivery-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      return res.json();
    }
  }
};
