import {
  Company,
  User,
  ScrewProduct,
  Drawing,
  RFQ,
  Quote,
  Job,
  Mold,
  Punch,
  Machine,
  ProductionJob,
  QCInspection,
  NCR,
  EightDReport,
  AuditLog,
  TimelineEvent,
  ChatMessage,
  AppNotification,
  Role,
  OrderStage,
  MachinePunchState,
  OrderItem,
  DefectTicket
} from "../types";
import {
  SEED_COMPANIES,
  SEED_USERS,
  SEED_PRODUCTS,
  SEED_DRAWINGS,
  SEED_RFQS,
  SEED_QUOTES,
  SEED_JOBS,
  SEED_MOLDS,
  SEED_PUNCHES,
  SEED_MACHINES,
  SEED_PRODUCTION_PROCESSES,
  SEED_QCS,
  SEED_NCRS,
  SEED_EIGHT_D,
  SEED_AUDIT_LOGS,
  SEED_TIMELINE_EVENTS,
  SEED_NOTIFICATIONS
} from "./mockDataStore";
import { INITIAL_MACHINES, INITIAL_ORDERS, INITIAL_MESSAGES, INITIAL_DEFECTS, STAGE_CONFIGS } from "../mockData";

class FastenerToolRepository {
  private getItem<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(`ftl_v2_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      console.warn(`Failed reading ftl_v2_${key} from storage:`, e);
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`ftl_v2_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed writing ftl_v2_${key} to storage:`, e);
    }
  }

  // Current session persona
  getCurrentRole(): Role {
    return this.getItem<Role>("current_role", "screw_factory");
  }

  setCurrentRole(role: Role): void {
    this.setItem("current_role", role);
  }

  getCurrentUser(): User {
    const role = this.getCurrentRole();
    const users = this.getUsers();
    if (role === "screw_factory") {
      return users.find((u) => u.companyId === "COMP-01") || users[0];
    } else {
      return users.find((u) => u.companyId === "COMP-02") || users[1];
    }
  }

  // Companies & Users
  getCompanies(): Company[] {
    return this.getItem<Company[]>("companies", SEED_COMPANIES);
  }

  getUsers(): User[] {
    return this.getItem<User[]>("users", SEED_USERS);
  }

  // Products
  getProducts(): ScrewProduct[] {
    return this.getItem<ScrewProduct[]>("products", SEED_PRODUCTS);
  }

  getProductById(id: string): ScrewProduct | undefined {
    return this.getProducts().find((p) => p.id === id);
  }

  saveProduct(product: ScrewProduct): void {
    const list = this.getProducts();
    const idx = list.findIndex((p) => p.id === product.id);
    if (idx >= 0) list[idx] = product;
    else list.unshift(product);
    this.setItem("products", list);
  }

  // Drawings
  getDrawings(): Drawing[] {
    return this.getItem<Drawing[]>("drawings", SEED_DRAWINGS);
  }

  getDrawingById(id: string): Drawing | undefined {
    return this.getDrawings().find((d) => d.id === id);
  }

  approveDrawingRevision(drawingId: string, revId: string, approverName: string): void {
    const drawings = this.getDrawings();
    const dwg = drawings.find((d) => d.id === drawingId);
    if (!dwg) return;

    dwg.revisions = dwg.revisions.map((r) => {
      if (r.id === revId) {
        return {
          ...r,
          status: "approved",
          approvedBy: approverName,
          approvedAt: new Date().toLocaleString("zh-TW", { hour12: false })
        };
      }
      return r;
    });
    dwg.status = "active";
    this.setItem("drawings", drawings);

    this.addAuditLog({
      companyId: "COMP-02",
      userId: "USER-02",
      userName: approverName,
      action: `核准圖面 ${dwg.drawingNumber} 版本 ${revId}`,
      entityType: "Drawing",
      entityId: drawingId,
      timestamp: new Date().toLocaleString("zh-TW", { hour12: false })
    });
  }

  // RFQ
  getRFQs(): RFQ[] {
    return this.getItem<RFQ[]>("rfqs", SEED_RFQS);
  }

  getRFQById(id: string): RFQ | undefined {
    return this.getRFQs().find((r) => r.id === id);
  }

  createRFQ(newRfq: Partial<RFQ>): RFQ {
    const rfqs = this.getRFQs();
    const rfqNumber = `RFQ-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(Math.random() * 90 + 10)}`;
    const fullRfq: RFQ = {
      id: `RFQ-${Date.now()}`,
      rfqNumber,
      requesterCompanyId: newRfq.requesterCompanyId || "COMP-01",
      supplierCompanyId: newRfq.supplierCompanyId || "COMP-02",
      jobId: newRfq.jobId,
      productId: newRfq.productId || "PROD-M8-TORX",
      drawingRevisionId: newRfq.drawingRevisionId || "REV-00882-B",
      targetPartName: newRfq.targetPartName || "沖棒客製規格",
      punchType: newRfq.punchType || "second_punch",
      headProfile: newRfq.headProfile || "torx",
      material: newRfq.material || "ASP-23",
      coating: newRfq.coating || "AlTiN",
      requestedQuantity: newRfq.requestedQuantity || 20,
      requestedDeliveryDate: newRfq.requestedDeliveryDate || new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
      urgency: newRfq.urgency || "normal",
      status: "submitted",
      notes: newRfq.notes || "",
      createdAt: new Date().toLocaleString("zh-TW", { hour12: false })
    };

    rfqs.unshift(fullRfq);
    this.setItem("rfqs", rfqs);

    this.addAuditLog({
      companyId: "COMP-01",
      userId: "USER-01",
      userName: "長宏生管",
      action: `開立新沖棒 RFQ 【${rfqNumber}】`,
      entityType: "RFQ",
      entityId: fullRfq.id,
      timestamp: new Date().toLocaleString("zh-TW", { hour12: false })
    });

    return fullRfq;
  }

  // Quotes
  getQuotes(): Quote[] {
    return this.getItem<Quote[]>("quotes", SEED_QUOTES);
  }

  getQuoteById(id: string): Quote | undefined {
    return this.getQuotes().find((q) => q.id === id);
  }

  createQuote(newQuote: Partial<Quote>): Quote {
    const quotes = this.getQuotes();
    const quoteNumber = `QUO-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(Math.random() * 90 + 10)}`;
    const fullQuote: Quote = {
      id: `QUO-${Date.now()}`,
      quoteNumber,
      rfqId: newQuote.rfqId || "RFQ-MANUAL",
      supplierCompanyId: "COMP-02",
      materialCost: newQuote.materialCost || 300,
      machiningCost: newQuote.machiningCost || 180,
      heatTreatmentCost: newQuote.heatTreatmentCost || 90,
      grindingCost: newQuote.grindingCost || 110,
      edmCost: newQuote.edmCost || 150,
      polishingCost: newQuote.polishingCost || 60,
      coatingCost: newQuote.coatingCost || 150,
      qcCost: newQuote.qcCost || 40,
      packagingCost: newQuote.packagingCost || 20,
      logisticsCost: newQuote.logisticsCost || 30,
      rushFee: newQuote.rushFee || 0,
      overheadCost: newQuote.overheadCost || 80,
      margin: newQuote.margin || 250,
      unitPrice: newQuote.unitPrice || 1460,
      totalPrice: newQuote.totalPrice || 29200,
      leadTimeDays: newQuote.leadTimeDays || 4,
      validUntil: newQuote.validUntil || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      status: "submitted",
      notes: newQuote.notes || "精耐特標準高工藝報價",
      createdAt: new Date().toLocaleString("zh-TW", { hour12: false })
    };

    quotes.unshift(fullQuote);
    this.setItem("quotes", quotes);

    this.addAuditLog({
      companyId: "COMP-02",
      userId: "USER-02",
      userName: "精耐特業務部",
      action: `提交沖棒詳細成本拆解報價單 【${quoteNumber}】`,
      entityType: "Quote",
      entityId: fullQuote.id,
      timestamp: new Date().toLocaleString("zh-TW", { hour12: false })
    });

    return fullQuote;
  }

  // Jobs
  getJobs(): Job[] {
    return this.getItem<Job[]>("jobs", SEED_JOBS);
  }

  getJobById(id: string): Job | undefined {
    return this.getJobs().find((j) => j.id === id || j.jobNumber === id);
  }

  updateJob(id: string, updates: Partial<Job>): Job | undefined {
    const jobs = this.getJobs();
    const idx = jobs.findIndex((j) => j.id === id || j.jobNumber === id);
    if (idx === -1) return undefined;

    jobs[idx] = {
      ...jobs[idx],
      ...updates,
      updatedAt: new Date().toLocaleString("zh-TW", { hour12: false })
    };
    this.setItem("jobs", jobs);

    this.addAuditLog({
      companyId: "COMP-01",
      userId: "USER-01",
      userName: "生管工程員",
      action: `更新工單 ${jobs[idx].jobNumber} 狀態`,
      entityType: "Job",
      entityId: jobs[idx].id,
      afterData: updates,
      timestamp: new Date().toLocaleString("zh-TW", { hour12: false })
    });

    return jobs[idx];
  }

  advanceJobStage(jobId: string, nextStage: OrderStage): Job | undefined {
    const jobs = this.getJobs();
    const target = jobs.find((j) => j.id === jobId || j.jobNumber === jobId);
    if (!target) return undefined;

    const stageMeta = STAGE_CONFIGS[nextStage];
    const totalStages = Object.keys(STAGE_CONFIGS).length;
    const nextPercent = Math.min(100, Math.round((stageMeta.step / totalStages) * 100));

    target.currentStage = nextStage;
    target.progressPercent = nextPercent;
    target.updatedAt = new Date().toLocaleString("zh-TW", { hour12: false });
    this.setItem("jobs", jobs);

    this.addTimelineEvent({
      jobId: target.id,
      type: "production_milestone",
      actor: "精耐特生管排程",
      message: `工單 ${target.jobNumber} 推進至第 ${stageMeta.step} 站：【${stageMeta.label}】(${stageMeta.dept})，進度 ${nextPercent}%`
    });

    // Also update order item if matching
    const orders = this.getOrders();
    const ord = orders.find((o) => o.orderNumber === target.jobNumber || o.id === target.orderId);
    if (ord) {
      ord.currentStage = nextStage;
      ord.stageProgressPercent = nextPercent;
      this.saveOrders(orders);
    }

    return target;
  }

  // Molds
  getMolds(): Mold[] {
    return this.getItem<Mold[]>("molds", SEED_MOLDS);
  }

  getMoldById(id: string): Mold | undefined {
    return this.getMolds().find((m) => m.id === id || m.moldNumber === id);
  }

  // Punches (Digital Passport)
  getPunches(): Punch[] {
    return this.getItem<Punch[]>("punches", SEED_PUNCHES);
  }

  getPunchById(id: string): Punch | undefined {
    return this.getPunches().find((p) => p.id === id || p.punchNumber === id);
  }

  updatePunch(id: string, updates: Partial<Punch>): Punch | undefined {
    const punches = this.getPunches();
    const idx = punches.findIndex((p) => p.id === id || p.punchNumber === id);
    if (idx === -1) return undefined;

    punches[idx] = {
      ...punches[idx],
      ...updates,
      updatedAt: new Date().toLocaleString("zh-TW", { hour12: false })
    };
    this.setItem("punches", punches);

    this.addAuditLog({
      companyId: "COMP-02",
      userId: "USER-02",
      userName: "精耐特模具管理室",
      action: `更新沖棒 ${punches[idx].punchNumber} 履歷狀態`,
      entityType: "Punch",
      entityId: punches[idx].id,
      afterData: updates,
      timestamp: new Date().toLocaleString("zh-TW", { hour12: false })
    });

    return punches[idx];
  }

  updatePunchHits(punchId: string, newHits: number): Punch | undefined {
    const punches = this.getPunches();
    const punch = punches.find((p) => p.id === punchId || p.punchNumber === punchId);
    if (!punch) return undefined;

    punch.currentHits = newHits;
    punch.remainingLifePercent = Math.max(0, Math.round(((punch.expectedLifeHits - newHits) / punch.expectedLifeHits) * 100));
    punch.updatedAt = new Date().toLocaleString("zh-TW", { hour12: false });
    this.setItem("punches", punches);
    return punch;
  }

  // Machines
  getMachines(): Machine[] {
    return this.getItem<Machine[]>("machines", SEED_MACHINES);
  }

  getMachinePunchStates(): MachinePunchState[] {
    return this.getItem<MachinePunchState[]>("machine_states", INITIAL_MACHINES);
  }

  saveMachinePunchStates(states: MachinePunchState[]): void {
    this.setItem("machine_states", states);
  }

  // Orders (Backwards compatibility)
  getOrders(): OrderItem[] {
    return this.getItem<OrderItem[]>("orders", INITIAL_ORDERS);
  }

  saveOrders(orders: OrderItem[]): void {
    this.setItem("orders", orders);
  }

  // Production processes
  getProductionProcesses(jobId?: string): ProductionJob[] {
    const list = this.getItem<ProductionJob[]>("production_processes", SEED_PRODUCTION_PROCESSES);
    if (jobId) {
      return list.filter((p) => p.jobId === jobId);
    }
    return list;
  }

  // QC
  getQCs(jobId?: string): QCInspection[] {
    const list = this.getItem<QCInspection[]>("qcs", SEED_QCS);
    if (jobId) {
      return list.filter((q) => q.jobId === jobId);
    }
    return list;
  }

  createQC(newQC: Partial<QCInspection>): QCInspection {
    const list = this.getQCs();
    const qcNumber = `QC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(Math.random() * 90 + 10)}`;
    const fullQC: QCInspection = {
      id: `QC-${Date.now()}`,
      qcNumber,
      jobId: newQC.jobId || "JOB-2026-00882",
      punchId: newQC.punchId || "P-2026-003921",
      inspectorId: "USER-02",
      inspectorName: newQC.inspectorName || "精耐特品保課 鄭副理",
      inspectionType: newQC.inspectionType || "final",
      dimensionResults: newQC.dimensionResults || [
        { item: "外徑 (OD)", nominal: "14.000mm", tolerance: "0/-0.003mm", measured: "13.998mm", passed: true },
        { item: "同心度 (Runout)", nominal: "≤0.002mm", tolerance: "Max 0.002mm", measured: "0.0018mm", passed: true }
      ],
      hardness: newQC.hardness || "64.5 HRC",
      concentricity: newQC.concentricity || "0.0018 mm",
      appearance: newQC.appearance || "鏡面無痕",
      coating: newQC.coating || "AlTiN 膜厚 2.8μm",
      result: newQC.result || "PASS",
      inspectedAt: new Date().toLocaleString("zh-TW", { hour12: false }),
      notes: newQC.notes || "出廠前光學投影三次元檢驗合格"
    };

    list.unshift(fullQC);
    this.setItem("qcs", list);

    this.addTimelineEvent({
      jobId: fullQC.jobId,
      type: fullQC.result === "PASS" ? "qc_pass" : "qc_fail",
      actor: fullQC.inspectorName,
      message: `品檢報告 ${fullQC.qcNumber} 判定為 【${fullQC.result}】 (同心度: ${fullQC.concentricity}, 硬度: ${fullQC.hardness})`
    });

    return fullQC;
  }

  // NCR & 8D
  getNCRs(jobId?: string): NCR[] {
    const list = this.getItem<NCR[]>("ncrs", SEED_NCRS);
    if (jobId) {
      return list.filter((n) => n.jobId === jobId);
    }
    return list;
  }

  getEightDReport(ncrId: string): EightDReport | undefined {
    const stored = this.getItem<EightDReport>("eight_d_" + ncrId, SEED_EIGHT_D);
    return stored?.ncrId === ncrId ? stored : undefined;
  }

  createNCR(newNcr: Partial<NCR>): NCR {
    const list = this.getNCRs();
    const ncrNumber = `NCR-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const fullNcr: NCR = {
      id: `NCR-${Date.now()}`,
      ncrNumber,
      jobId: newNcr.jobId || "JOB-2026-00882",
      punchId: newNcr.punchId || "P-2026-003921",
      machineId: newNcr.machineId || "HM-01",
      reportedBy: newNcr.reportedBy || "長宏現場品保課",
      defectType: newNcr.defectType || "chipping",
      severity: newNcr.severity || "major",
      description: newNcr.description || "沖棒頭部異常崩裂",
      hitsAtFailure: newNcr.hitsAtFailure || 30000,
      expectedHits: newNcr.expectedHits || 50000,
      containmentAction: newNcr.containmentAction || "立即停機更換備刀並隔離不良品",
      rootCause: newNcr.rootCause,
      correctiveAction: newNcr.correctiveAction,
      preventiveAction: newNcr.preventiveAction,
      status: "open",
      createdAt: new Date().toLocaleString("zh-TW", { hour12: false })
    };

    list.unshift(fullNcr);
    this.setItem("ncrs", list);

    this.addTimelineEvent({
      jobId: fullNcr.jobId,
      type: "ncr_created",
      actor: fullNcr.reportedBy,
      message: `通報異常【${fullNcr.ncrNumber}】: ${fullNcr.description}`
    });

    return fullNcr;
  }

  updateNCR(id: string, updates: Partial<NCR>): NCR | undefined {
    const list = this.getNCRs();
    const idx = list.findIndex((n) => n.id === id || n.ncrNumber === id);
    if (idx === -1) return undefined;

    list[idx] = { ...list[idx], ...updates };
    this.setItem("ncrs", list);
    return list[idx];
  }

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return this.getItem<AuditLog[]>("audit_logs", SEED_AUDIT_LOGS);
  }

  addAuditLog(entry: Omit<AuditLog, "id">): void {
    const list = this.getAuditLogs();
    const fullEntry: AuditLog = {
      ...entry,
      id: `LOG-${Date.now()}`
    };
    list.unshift(fullEntry);
    this.setItem("audit_logs", list.slice(0, 100)); // Cap at 100
  }

  // Timeline Events
  getTimelineEvents(jobId?: string): TimelineEvent[] {
    const list = this.getItem<TimelineEvent[]>("timeline_events", SEED_TIMELINE_EVENTS);
    if (jobId) {
      return list.filter((e) => e.jobId === jobId);
    }
    return list;
  }

  addTimelineEvent(event: Omit<TimelineEvent, "id" | "timestamp">): void {
    const list = this.getTimelineEvents();
    const fullEvent: TimelineEvent = {
      ...event,
      id: `EVT-${Date.now()}`,
      timestamp: new Date().toLocaleString("zh-TW", { hour12: false })
    };
    list.unshift(fullEvent);
    this.setItem("timeline_events", list);
  }

  // Messages
  getMessages(jobId?: string): ChatMessage[] {
    const list = this.getItem<ChatMessage[]>("messages", INITIAL_MESSAGES);
    if (jobId) {
      return list.filter((m) => m.jobId === jobId || m.orderId === jobId);
    }
    return list;
  }

  saveMessages(messages: ChatMessage[]): void {
    this.setItem("messages", messages);
  }

  sendMessage(msg: Partial<ChatMessage>): ChatMessage {
    const list = this.getMessages();
    const fullMsg: ChatMessage = {
      id: `MSG-${Date.now()}`,
      senderRole: msg.senderRole || this.getCurrentRole(),
      senderName: msg.senderName || (this.getCurrentRole() === "screw_factory" ? "長宏生管/現場" : "精耐特廠長/工程課"),
      timestamp: new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" }),
      content: msg.content || "",
      orderId: msg.orderId,
      jobId: msg.jobId,
      type: msg.type || "message",
      attachmentType: msg.attachmentType,
      attachmentData: msg.attachmentData
    };
    list.push(fullMsg);
    this.saveMessages(list);
    return fullMsg;
  }

  // Notifications
  getNotifications(): AppNotification[] {
    return this.getItem<AppNotification[]>("notifications", SEED_NOTIFICATIONS);
  }

  markNotificationRead(id: string): void {
    const list = this.getNotifications();
    const target = list.find((n) => n.id === id);
    if (target) {
      target.read = true;
      this.setItem("notifications", list);
    }
  }

  // One-click Seed Demo Scenario
  resetToSeedScenario(): void {
    this.setItem("companies", SEED_COMPANIES);
    this.setItem("users", SEED_USERS);
    this.setItem("products", SEED_PRODUCTS);
    this.setItem("drawings", SEED_DRAWINGS);
    this.setItem("rfqs", SEED_RFQS);
    this.setItem("quotes", SEED_QUOTES);
    this.setItem("jobs", SEED_JOBS);
    this.setItem("molds", SEED_MOLDS);
    this.setItem("punches", SEED_PUNCHES);
    this.setItem("machines", SEED_MACHINES);
    this.setItem("machine_states", INITIAL_MACHINES);
    this.setItem("orders", INITIAL_ORDERS);
    this.setItem("production_processes", SEED_PRODUCTION_PROCESSES);
    this.setItem("qcs", SEED_QCS);
    this.setItem("ncrs", SEED_NCRS);
    this.setItem("eight_d_NCR-2026-0042", SEED_EIGHT_D);
    this.setItem("audit_logs", SEED_AUDIT_LOGS);
    this.setItem("timeline_events", SEED_TIMELINE_EVENTS);
    this.setItem("notifications", SEED_NOTIFICATIONS);
    this.setItem("messages", INITIAL_MESSAGES);
  }
}

export const repository = new FastenerToolRepository();
