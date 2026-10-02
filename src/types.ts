// FastenerTool Link V2 - Industrial Digital Collaboration Platform Domain Types

export type Role = "screw_factory" | "mold_factory";

export type CompanyType = 
  | "screw_factory"
  | "mold_factory"
  | "punch_factory"
  | "heat_treatment"
  | "coating_supplier"
  | "logistics"
  | "customer"
  | "admin";

export interface Company {
  id: string;
  companyCode: string;
  name: string;
  companyType: CompanyType;
  taxId?: string;
  address?: string;
  phone?: string;
  email?: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  // Compatibility aliases
  code?: string;
  type?: string;
  contactPhone?: string;
}

export type UserRole = 
  | "platform_admin"
  | "company_owner"
  | "sales"
  | "production_manager"
  | "tooling_engineer"
  | "qc_engineer"
  | "operator"
  | "viewer";

export type Permission = 
  | "company.view"
  | "company.manage"
  | "product.view"
  | "product.create"
  | "product.edit"
  | "drawing.view"
  | "drawing.upload"
  | "drawing.approve"
  | "rfq.create"
  | "rfq.view"
  | "rfq.respond"
  | "quote.create"
  | "quote.approve"
  | "order.create"
  | "order.view"
  | "order.edit"
  | "job.view"
  | "job.update"
  | "mold.view"
  | "mold.manage"
  | "punch.view"
  | "punch.manage"
  | "punch.retire"
  | "production.view"
  | "production.update"
  | "qc.view"
  | "qc.create"
  | "ncr.create"
  | "ncr.manage"
  | "ai.use"
  | "message.send"
  | "attachment.upload"
  | "report.view";

export interface User {
  id: string;
  companyId: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: "active" | "inactive";
  createdAt: string;
  lastLoginAt?: string;
  permissions?: Permission[];
}

export type PunchType = 
  | "first_punch"       // 一衝 (預鍛沖棒)
  | "second_punch"      // 二衝 (成型沖棒)
  | "carbide_die"       // 鎢鋼主模/套模
  | "thread_die"        // 搓牙板
  | "cut_knife"         // 切刀/剪刀
  | "knockout_pin";     // 頂針

export type HeadProfile = 
  | "phillips"          // 十字頭 (Phillips)
  | "torx"              // 梅花星型 (Torx / 6-Lobe)
  | "hex_socket"        // 內六角 (Hex Socket)
  | "pozidriv"          // 米字頭 (Pozidriv)
  | "slotted"           // 割溝一字 (Slotted)
  | "square"            // 方孔 (Robertson)
  | "tamper_torx"       // 防盜梅花 (帶中心銷)
  | "custom";           // 特殊客製頭型

export type PunchMaterial = 
  | "SKH-9"             // M2 高速鋼
  | "SKH-51"            // 高韌性高速鋼
  | "ASP-23"            // 粉末高速鋼 (耐磨抗崩)
  | "ASP-60"            // 超微細粉末高合金鋼
  | "Tungsten_Carbide"  // 鎢鋼 (UF-09 / G5)
  | "SKD-11";           // 冷作模具鋼

export type CoatingType = 
  | "none"              // 原色拋光
  | "TiN"               // 氮化鈦 (金黃)
  | "TiCN"              // 碳氮化鈦 (粉紫)
  | "AlTiN"             // 氮化鋁鈦 (紫黑 / 高溫高耐磨)
  | "DLC"               // 類鑽碳 (超低摩擦 / 打不鏽鋼首選)
  | "CrN";              // 氮化鉻 (銀白 / 防黏著)

export type MachineStatus = "running" | "warning" | "critical" | "idle" | "tool_changing";

export interface MachinePunchState {
  machineId: string;
  machineName: string;
  machineModel: string;
  station: string;
  screwSpec: string;
  screwMaterial: string;
  mountedPunchId: string;
  punchName: string;
  punchSpec: string;
  currentHits: number;
  expectedLifeHits: number;
  healthPercent: number;
  speedRpm: number;
  status: MachineStatus;
  lastChangedDate: string;
  operator: string;
}

export type OrderStage = 
  | "rfq_pending"       // 詢價待確認
  | "drawing_review"    // 審圖與公差確認
  | "material_cutting"  // 下料領料
  | "cnc_machining"     // CNC 車銑加工
  | "heat_treatment"    // 真空熱處理
  | "grinding"          // 精密研磨 (外圓/內孔)
  | "profile_edm"       // 光學研磨 / 放電頭型
  | "polishing"         // 鏡面超音波拋光
  | "pvd_coating"       // PVD 物理鍍膜
  | "qc_inspection"     // QC 三次元量測
  | "shipping"          // 物流派送中
  | "delivered";        // 已到廠簽收

export interface OrderItem {
  id: string;
  orderNumber: string;
  createdAt: string;
  requiredDeliveryDate: string;
  screwFactoryName: string;
  moldFactoryName: string;
  urgency: "normal" | "urgent" | "rush_critical";
  punchType: PunchType;
  headProfile: HeadProfile;
  material: PunchMaterial;
  coating: CoatingType;
  outerDiameter: number;
  totalLength: number;
  headDepth: number;
  concentricity: number;
  toleranceLevel: string;
  targetScrewStandard: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  currentStage: OrderStage;
  stageProgressPercent: number;
  cadDrawingNumber: string;
  notes: string;
  qcPassedCount?: number;
  defectReason?: string;
}

// ----------------------------------------------------
// V2 Core Domain Entities
// ----------------------------------------------------

export interface ScrewProduct {
  id: string;
  companyId: string;
  productCode: string;
  customerPartNumber?: string;
  name: string;
  screwType: string;
  nominalDiameter?: string;
  pitch?: string;
  length?: number;
  headProfile: HeadProfile;
  material: string;
  strengthClass?: string;
  surfaceTreatment?: string;
  standard?: string;
  status: "active" | "obsolete" | "development";
  createdAt: string;
  updatedAt: string;
}

export interface DrawingRevision {
  id: string;
  drawingId: string;
  revision: string; // "Rev.A", "Rev.B", "Rev.C"
  fileName: string;
  fileUrl?: string;
  checksum?: string;
  notes?: string;
  uploadedBy: string;
  uploadedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  status: "draft" | "submitted" | "review" | "approved" | "superseded";
  revisionNumber?: string; // Compatibility alias
  dimensionsDiff?: {
    parameter: string;
    oldVal: string;
    newVal: string;
    tolerance: string;
  }[];
}

export interface Drawing {
  id: string;
  productId: string;
  drawingNumber: string;
  currentRevision: string;
  status: "active" | "pending_review" | "archived";
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  revisions: DrawingRevision[];
  targetPartName?: string; // Compatibility alias
}

export type RFQUrgency = "normal" | "urgent" | "rush_critical";

export type RFQStatus = 
  | "draft"
  | "submitted"
  | "reviewing"
  | "quoted"
  | "accepted"
  | "rejected"
  | "expired"
  | "cancelled";

export interface RFQ {
  id: string;
  rfqNumber: string;
  requesterCompanyId: string;
  supplierCompanyId: string;
  jobId?: string;
  productId: string;
  drawingRevisionId?: string;
  targetPartName: string;
  punchType: PunchType;
  headProfile: HeadProfile;
  material: PunchMaterial;
  coating: CoatingType;
  requestedQuantity: number;
  requestedDeliveryDate: string;
  urgency: RFQUrgency;
  status: RFQStatus;
  notes?: string;
  createdAt: string;
  expiresAt?: string;
}

export type QuoteStatus = 
  | "draft"
  | "submitted"
  | "accepted"
  | "rejected"
  | "expired";

export interface Quote {
  id: string;
  quoteNumber: string;
  rfqId: string;
  supplierCompanyId: string;
  // Cost breakdown
  materialCost: number;
  machiningCost: number;
  heatTreatmentCost: number;
  grindingCost: number;
  edmCost: number;
  polishingCost: number;
  coatingCost: number;
  qcCost: number;
  packagingCost: number;
  logisticsCost: number;
  rushFee: number;
  overheadCost: number;
  margin: number;
  unitPrice: number;
  totalPrice: number;
  leadTimeDays: number;
  validUntil: string;
  status: QuoteStatus;
  notes?: string;
  createdAt: string;
}

export type JobStatus = 
  | "pending"
  | "engineering"
  | "production"
  | "qc"
  | "shipping"
  | "delivered"
  | "closed"
  | "blocked"
  | "cancelled";

export type JobPriority = "low" | "normal" | "urgent" | "rush_critical";
export type RiskLevel = "green" | "yellow" | "red";

export interface Job {
  id: string;
  jobNumber: string; // e.g. "FTL-2026-00882"
  customerCompanyId: string;
  supplierCompanyId: string;
  customerName: string;
  supplierName: string;
  productId: string;
  productName: string;
  screwSpec: string;
  drawingId?: string; // Compatibility alias
  drawingRevisionId?: string;
  drawingNumber: string;
  drawingRev: string;
  rfqId?: string;
  quoteId?: string;
  orderId?: string;
  moldId?: string;
  punchId?: string;
  machineId?: string;
  priority: JobPriority;
  plannedStartDate?: string;
  plannedDeliveryDate: string;
  actualStartDate?: string;
  actualDeliveryDate?: string;
  status: JobStatus;
  currentStage: OrderStage;
  progressPercent: number;
  riskLevel: RiskLevel;
  riskReason?: string;
  quantity: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type MoldType = "heading_die" | "first_punch_case" | "second_punch_holder" | "trimming_die" | "thread_block";

export interface Mold {
  id: string;
  moldNumber: string; // e.g. "M-00882"
  companyId: string;
  jobId?: string;
  productId?: string;
  moldType: MoldType;
  name: string;
  material: string;
  dimensions?: string;
  designRevision?: string;
  expectedLifeHits: number;
  currentHits: number;
  remainingLifePercent: number;
  status: "available" | "mounted" | "maintenance" | "scrapped" | "ready";
  createdAt: string;
  updatedAt: string;
}

export type PunchStatus = 
  | "available"
  | "reserved"
  | "in_use"
  | "maintenance"
  | "coating"
  | "inspection"
  | "retired"
  | "scrapped"
  | "standby"
  | "regrinding"
  | "recoating"
  | "qc_pending"
  | "scrap";

export interface PunchUsageRecord {
  id: string;
  machineId: string;
  jobId: string;
  operator: string;
  startHits: number;
  endHits: number;
  totalHits: number;
  date: string;
  notes?: string;
}

export interface PunchMaintenanceRecord {
  id: string;
  date: string;
  type: "regrind" | "recoating" | "micro_polish" | "geometry_correction";
  operator: string;
  facility: string;
  result: "PASS" | "FAIL";
  notes: string;
}

export interface Punch {
  id: string;
  punchNumber: string; // e.g. "P-2026-003921"
  companyId: string;
  jobId?: string;
  moldId?: string;
  applicableProduct?: string;
  punchType: PunchType;
  material: PunchMaterial;
  coating: CoatingType;
  hardnessHrc?: number; // e.g. 64.5
  hardness?: string;
  manufacturedDate?: string;
  headProfile: HeadProfile;
  outerDiameter: number;
  totalLength: number;
  headDepth: number;
  concentricity: number; // e.g. 0.002
  toleranceLevel: string; // e.g. "±0.002mm"
  expectedLifeHits: number;
  currentHits: number;
  remainingLifePercent: number;
  status: PunchStatus;
  qrCode: string; // "FTL-PASSPORT://P-2026-003921"
  lastMaintenanceDate?: string;
  lastQcResult?: "PASS" | "FAIL" | "CONDITIONAL";
  ncrCount?: number;
  currentMachineId?: string;
  operator?: string;
  createdAt: string;
  updatedAt: string;
  usageHistory: PunchUsageRecord[];
  maintenanceHistory: PunchMaintenanceRecord[];
}

export interface Machine {
  id: string;
  companyId: string;
  machineNumber: string; // e.g. "HM-01"
  machineName: string;
  model: string;
  station: string;
  status: MachineStatus;
  currentPunchId?: string;
  speedRpm: number;
  operator: string;
}

export interface MachinePunchUsage {
  id: string;
  machineId: string;
  punchId: string;
  jobId: string;
  operatorId: string;
  startAt: string;
  endAt?: string;
  startHits: number;
  endHits?: number;
}

export interface ProductionJob {
  id: string;
  jobId: string;
  processCode: string;
  processName: string;
  department?: string;
  sequence: number;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  varianceMinutes?: number; // positive = delay, negative = ahead
  varianceHours?: number;
  varianceText?: string;   // e.g. "+2h 20m"
  risk: "green" | "yellow" | "red";
  progressPercent: number;
  status: "pending" | "in_progress" | "completed" | "delayed" | "paused";
  machineId?: string;
  operatorId?: string;
  operatorName?: string;
  notes?: string;
}

export type QCInspectionType = "incoming" | "in_process" | "final" | "outgoing" | "post_coating";
export type QCResult = "PASS" | "FAIL" | "CONDITIONAL";

export interface QCInspection {
  id: string;
  qcNumber: string; // e.g. "QC-2026-0882-01"
  jobId: string;
  punchId?: string;
  inspectorId: string;
  inspectorName: string;
  inspectionType: QCInspectionType;
  dimensionResults: {
    item: string;
    nominal: string;
    tolerance: string;
    measured: string;
    passed: boolean;
  }[];
  hardness?: string;       // e.g. "64.8 HRC (SPEC: 64-65)"
  concentricity?: string; // e.g. "0.0018 mm (SPEC: ≤0.002mm)"
  appearance?: string;     // e.g. "超音波鏡面 Ra 0.04，無孔隙"
  coating?: string;        // e.g. "AlTiN 膜厚 2.8μm 結合力良好"
  result: QCResult;
  reportUrl?: string;
  inspectedAt: string;
  notes?: string;
}

export type NCRDefectType = 
  | "chipping" 
  | "fracture" 
  | "severe_wear" 
  | "concentricity_runout" 
  | "coating_peel" 
  | "dimension_out_of_spec";

export type NCRSeverity = "minor" | "major" | "critical";

export interface EightDReport {
  id: string;
  reportNumber?: string;
  ncrId: string;
  d1Team: string;              // 跨部門對策小組
  teamD1?: string;
  d2Problem: string;           // 問題詳細描述
  problemDescriptionD2?: string;
  d3Containment: string;       // 圍堵應急措施
  d4RootCause: string;         // 真因分析 (5-Whys & 魚骨圖)
  rootCauseD4?: string;
  d5CorrectiveAction: string;  // 永久對策改善
  correctiveActionD5?: string;
  d6Verification: string;      // 效果驗證 (衝次追蹤)
  verificationD6?: string;
  d7Prevention: string;        // 再發防止標準化
  preventiveActionD7?: string;
  d8Closure: string;           // 結案與小組肯定
  status: "in_progress" | "completed";
  completedAt?: string;
}

export interface NCR {
  id: string;
  ncrNumber: string; // e.g. "NCR-2026-0042"
  jobId: string;
  punchId?: string;
  machineId?: string;
  reportedBy: string;
  defectType: NCRDefectType;
  severity: NCRSeverity;
  description: string;
  hitsAtFailure?: number;
  expectedHits?: number;
  containmentAction?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  status: "open" | "containment" | "root_cause_identified" | "corrective_action" | "closed";
  eightDId?: string;
  createdAt: string;
  closedAt?: string;
}

export interface AuditLog {
  id: string;
  companyId: string;
  userId: string;
  userName: string;
  action: string;
  entityType: "Job" | "Punch" | "Mold" | "Drawing" | "Quote" | "RFQ" | "QC" | "NCR" | "Order";
  entityId: string;
  beforeData?: any;
  afterData?: any;
  timestamp: string;
  ip?: string;
}

export interface TimelineEvent {
  id: string;
  jobId: string;
  type: 
    | "status_change" 
    | "approval" 
    | "quote" 
    | "drawing_revision" 
    | "production_milestone" 
    | "qc_pass" 
    | "qc_fail" 
    | "ncr_created" 
    | "ai_action" 
    | "message";
  actor: string;
  message: string;
  entityType?: string;
  entityId?: string;
  timestamp: string;
}

export type ChatMessageType = 
  | "message"
  | "status_update"
  | "drawing_uploaded"
  | "drawing_approved"
  | "quote_submitted"
  | "order_created"
  | "production_update"
  | "qc_result"
  | "ncr_created"
  | "ai_alert"
  | "system_event";

export interface ChatMessage {
  id: string;
  senderRole: Role;
  senderName: string;
  timestamp: string;
  content: string;
  orderId?: string;
  jobId?: string;
  type?: ChatMessageType;
  attachmentType?: "drawing" | "punch_spec" | "defect_photo" | "qc_report" | "punch_passport";
  attachmentData?: {
    title: string;
    url?: string;
    badge?: string;
    details?: string;
  };
}

export interface DefectTicket {
  id: string;
  reportedAt: string;
  machineId: string;
  punchSpec: string;
  defectType: "chipping" | "fracture" | "severe_wear" | "concentricity_runout" | "coating_peel";
  hitsAtFailure: number;
  expectedHits: number;
  screwMaterial: string;
  description: string;
  status: "investigating" | "root_cause_identified" | "remake_dispatched" | "closed";
  analysisSummary?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "critical";
  timestamp: string;
  read: boolean;
  entityLink?: {
    type: "job" | "punch" | "rfq" | "ncr";
    id: string;
  };
}

export interface AIResponse {
  success: boolean;
  answer: string;
  confidence: "High" | "Medium" | "Low";
  facts: string[];
  recommendations: string[];
  actions: {
    id: string;
    label: string;
    type: "create_ncr" | "notify_engineer" | "create_rfq" | "approve_drawing" | "adjust_process";
    payload: any;
  }[];
  warnings: string[];
  fallback?: boolean;
}
