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
  MachinePunchState,
  OrderItem,
  DefectTicket
} from "../types";
import { INITIAL_MACHINES, INITIAL_ORDERS, INITIAL_MESSAGES, INITIAL_DEFECTS } from "../mockData";

export const SEED_COMPANIES: Company[] = [
  {
    id: "COMP-01",
    companyCode: "CH-FASTENER",
    name: "長宏精密螺絲工業 (岡山總廠)",
    companyType: "screw_factory",
    taxId: "84729103",
    address: "高雄市岡山區本工五路 88 號",
    phone: "07-6228899",
    email: "rfq@changhong-screw.com.tw",
    status: "active",
    createdAt: "2024-01-15"
  },
  {
    id: "COMP-02",
    companyCode: "JNT-MOLD",
    name: "精耐特精密沖棒模具廠 (本洲工業區)",
    companyType: "mold_factory",
    taxId: "53892014",
    address: "高雄市岡山區本洲工業區精工路 16 號",
    phone: "07-6953322",
    email: "sales@jnt-precision.com.tw",
    status: "active",
    createdAt: "2024-01-10"
  },
  {
    id: "COMP-03",
    companyCode: "OERLIKON-TW",
    name: "歐瑞康高階 PVD 表面鍍膜 (高科廠)",
    companyType: "coating_supplier",
    taxId: "24891042",
    address: "高雄市路竹區高科園區科技一路 5 號",
    phone: "07-6955000",
    email: "coating@oerlikon.tw",
    status: "active",
    createdAt: "2024-03-01"
  }
];

export const SEED_USERS: User[] = [
  {
    id: "USER-01",
    companyId: "COMP-01",
    name: "陳志豪 (長宏生管組長)",
    email: "ch.chen@changhong-screw.com.tw",
    role: "production_manager",
    status: "active",
    createdAt: "2024-01-15",
    permissions: [
      "company.view", "product.view", "product.create", "drawing.view", "drawing.upload",
      "rfq.create", "rfq.view", "quote.approve", "order.create", "order.view", "job.view",
      "punch.view", "production.view", "qc.view", "ncr.create", "ai.use", "message.send"
    ]
  },
  {
    id: "USER-02",
    companyId: "COMP-02",
    name: "蔡廠長 / 廖工 (精耐特資深總工)",
    email: "boss.tsai@jnt-precision.com.tw",
    role: "tooling_engineer",
    status: "active",
    createdAt: "2024-01-10",
    permissions: [
      "company.view", "product.view", "drawing.view", "drawing.approve",
      "rfq.view", "rfq.respond", "quote.create", "order.view", "job.view", "job.update",
      "mold.view", "mold.manage", "punch.view", "punch.manage", "punch.retire",
      "production.view", "production.update", "qc.view", "qc.create", "ncr.manage",
      "ai.use", "message.send", "report.view"
    ]
  }
];

export const SEED_PRODUCTS: ScrewProduct[] = [
  {
    id: "PROD-M8-TORX",
    companyId: "COMP-01",
    productCode: "SCR-M8-30-T40",
    customerPartNumber: "TESLA-FAST-882",
    name: "M8 × 30 梅花星型沉頭冷鍛螺絲",
    screwType: "Torx Countersunk Screw",
    nominalDiameter: "M8.0",
    pitch: "1.25",
    length: 30,
    headProfile: "torx",
    material: "SCM435 高抗拉合金鋼",
    strengthClass: "10.9級",
    surfaceTreatment: "達克羅防鏽塗層 (Dacromet)",
    standard: "ISO 14581 / DIN 965",
    status: "active",
    createdAt: "2026-08-10",
    updatedAt: "2026-09-15"
  },
  {
    id: "PROD-M35-DRYWALL",
    companyId: "COMP-01",
    productCode: "SCR-M35-25-PH2",
    name: "M3.5 × 25 喇叭頭十字粗牙乾壁螺絲",
    screwType: "Bugle Head Drywall Screw",
    nominalDiameter: "M3.5",
    pitch: "1.8",
    length: 25,
    headProfile: "phillips",
    material: "1022A 碳鋼滲碳淬火",
    strengthClass: "表面硬度 HV 550 min",
    surfaceTreatment: "磷酸鹽發黑 (Black Phosphate)",
    standard: "DIN 7981 / ASTM C1002",
    status: "active",
    createdAt: "2026-07-01",
    updatedAt: "2026-09-12"
  },
  {
    id: "PROD-M2-MICRO",
    companyId: "COMP-01",
    productCode: "SCR-M2-04-T6",
    name: "M2 × 4 超薄頭筆電微型梅花星型螺絲",
    screwType: "Wafer Head Micro Screw",
    nominalDiameter: "M2.0",
    pitch: "0.4",
    length: 4,
    headProfile: "torx",
    material: "SUS304 不鏽鋼",
    strengthClass: "A2-70",
    surfaceTreatment: "耐落防鬆膠 (Nylok)",
    standard: "ASME B18.6.3",
    status: "active",
    createdAt: "2026-09-01",
    updatedAt: "2026-09-16"
  }
];

export const SEED_DRAWINGS: Drawing[] = [
  {
    id: "DWG-2026-00882",
    productId: "PROD-M8-TORX",
    drawingNumber: "CAD-2026-M8-T40",
    currentRevision: "Rev.B",
    status: "active",
    createdBy: "長宏工程部 廖立綱",
    approvedBy: "精耐特模具技術總監 蔡廠長",
    createdAt: "2026-08-12",
    updatedAt: "2026-09-15",
    revisions: [
      {
        id: "REV-00882-B",
        drawingId: "DWG-2026-00882",
        revision: "Rev.B",
        fileName: "CAD-2026-M8-T40-RevB.dwg",
        uploadedBy: "長宏工程部 廖立綱",
        uploadedAt: "2026-09-15 10:30",
        approvedBy: "精耐特 蔡廠長",
        approvedAt: "2026-09-15 14:00",
        status: "approved",
        notes: "依冷鍛金屬回彈測試修正：沉頭成型深由 1.20mm 增至 1.40mm，同心度公差由 ±0.005mm 收斂至 ±0.002mm",
        dimensionsDiff: [
          { parameter: "沉頭成型深度 (Head Depth)", oldVal: "1.20 mm", newVal: "1.40 mm", tolerance: "±0.01 mm" },
          { parameter: "同心度 (Concentricity)", oldVal: "0.005 mm", newVal: "0.002 mm", tolerance: "Max 0.002 mm" },
          { parameter: "沖棒基材 (Material)", oldVal: "SKH-51", newVal: "ASP-23 (粉末高韌)", tolerance: "HRC 64-65" },
          { parameter: "表面鍍膜 (Coating)", oldVal: "TiN (金色)", newVal: "AlTiN (紫黑耐熱)", tolerance: "膜厚 2.5~3.0μm" }
        ]
      },
      {
        id: "REV-00882-A",
        drawingId: "DWG-2026-00882",
        revision: "Rev.A",
        fileName: "CAD-2026-M8-T40-RevA.dwg",
        uploadedBy: "長宏工程部 廖立綱",
        uploadedAt: "2026-08-12 09:00",
        approvedBy: "長宏主管核准",
        approvedAt: "2026-08-12 11:30",
        status: "superseded",
        notes: "初始工程打樣圖面，首次在 1模2衝打頭機試鍛。"
      }
    ]
  }
];

export const SEED_RFQS: RFQ[] = [
  {
    id: "RFQ-2026-0917-01",
    rfqNumber: "RFQ-2026-0917-01",
    requesterCompanyId: "COMP-01",
    supplierCompanyId: "COMP-02",
    jobId: "JOB-2026-00882",
    productId: "PROD-M8-TORX",
    drawingRevisionId: "REV-00882-B",
    targetPartName: "M8 梅花星型二衝精密成型沖棒",
    punchType: "second_punch",
    headProfile: "torx",
    material: "ASP-23",
    coating: "AlTiN",
    requestedQuantity: 20,
    requestedDeliveryDate: "2026-09-25",
    urgency: "urgent",
    status: "accepted",
    notes: "配合特斯拉汽車底盤抗拉螺栓緊急訂單，需嚴格要求同心度 ≤ 0.002mm",
    createdAt: "2026-09-17 09:15"
  },
  {
    id: "RFQ-2026-0918-02",
    rfqNumber: "RFQ-2026-0918-02",
    requesterCompanyId: "COMP-01",
    supplierCompanyId: "COMP-02",
    productId: "PROD-M2-MICRO",
    targetPartName: "T6 超微型筆電專用二衝",
    punchType: "second_punch",
    headProfile: "torx",
    material: "ASP-60",
    coating: "DLC",
    requestedQuantity: 30,
    requestedDeliveryDate: "2026-09-21",
    urgency: "rush_critical",
    status: "reviewing",
    notes: "【現場 HM-03 機台急需】壽命剩餘 4%，需要加急排產專車配送",
    createdAt: "2026-09-18 08:30"
  }
];

export const SEED_QUOTES: Quote[] = [
  {
    id: "QUO-2026-0917-01",
    quoteNumber: "QUO-2026-0917-01",
    rfqId: "RFQ-2026-0917-01",
    supplierCompanyId: "COMP-02",
    materialCost: 320,
    machiningCost: 180,
    heatTreatmentCost: 90,
    grindingCost: 110,
    edmCost: 160,
    polishingCost: 60,
    coatingCost: 150,
    qcCost: 40,
    packagingCost: 20,
    logisticsCost: 30,
    rushFee: 150,
    overheadCost: 80,
    margin: 260,
    unitPrice: 1650,
    totalPrice: 33000,
    leadTimeDays: 4,
    validUntil: "2026-10-01",
    status: "accepted",
    notes: "採用頂級瑞典一勝百 (Uddeholm) ASP-23 粉末高速鋼棒材，搭配歐瑞康高耐溫 AlTiN 紫黑鍍膜",
    createdAt: "2026-09-17 11:40"
  }
];

export const SEED_MOLDS: Mold[] = [
  {
    id: "M-00882",
    moldNumber: "M-00882",
    companyId: "COMP-02",
    jobId: "JOB-2026-00882",
    productId: "PROD-M8-TORX",
    moldType: "second_punch_holder",
    name: "M8 專用高剛性自定心沖棒夾持套筒",
    material: "SKD-61 氮化調質處理",
    dimensions: "OD 45mm x ID 14mm x L 75mm",
    designRevision: "Rev.2",
    expectedLifeHits: 300000,
    currentHits: 124000,
    remainingLifePercent: 58.6,
    status: "mounted",
    createdAt: "2026-02-10",
    updatedAt: "2026-09-15"
  },
  {
    id: "M-00741",
    moldNumber: "M-00741",
    companyId: "COMP-02",
    productId: "PROD-M35-DRYWALL",
    moldType: "heading_die",
    name: "M3.5 鎢鋼主模 (Carbide Heading Die)",
    material: "G5 級微粒鎢鋼 + SCM440 鍛造套套",
    dimensions: "OD 50mm x L 80mm",
    expectedLifeHits: 500000,
    currentHits: 388000,
    remainingLifePercent: 22.4,
    status: "mounted",
    createdAt: "2026-01-05",
    updatedAt: "2026-09-14"
  }
];

export const SEED_PUNCHES: Punch[] = [
  {
    id: "P-2026-003921",
    punchNumber: "P-2026-003921",
    companyId: "COMP-02",
    jobId: "JOB-2026-00882",
    moldId: "M-00882",
    applicableProduct: "M8 × 30 Torx 沉頭冷鍛螺絲",
    punchType: "second_punch",
    material: "ASP-23",
    coating: "AlTiN",
    hardnessHrc: 64.5,
    headProfile: "torx",
    outerDiameter: 14.0,
    totalLength: 45.0,
    headDepth: 1.40,
    concentricity: 0.0018,
    toleranceLevel: "±0.002mm",
    expectedLifeHits: 50000,
    currentHits: 31280,
    remainingLifePercent: 37.4,
    status: "in_use",
    qrCode: "FTL-PASSPORT://P-2026-003921",
    lastMaintenanceDate: "2026-08-20",
    lastQcResult: "PASS",
    ncrCount: 1,
    currentMachineId: "HM-01",
    operator: "陳志豪 (組長)",
    createdAt: "2026-08-15",
    updatedAt: "2026-09-18",
    usageHistory: [
      {
        id: "USE-01",
        machineId: "HM-01",
        jobId: "JOB-2026-00882",
        operator: "陳志豪",
        startHits: 0,
        endHits: 18500,
        totalHits: 18500,
        date: "2026-08-18",
        notes: "首批量產正常，同心度穩定"
      },
      {
        id: "USE-02",
        machineId: "HM-01",
        jobId: "JOB-2026-00882",
        operator: "陳志豪",
        startHits: 18500,
        endHits: 31280,
        totalHits: 12780,
        date: "2026-09-14",
        notes: "於 31,280 衝次時發現刃角輕微應力痕跡，經微修研磨後繼續使用"
      }
    ],
    maintenanceHistory: [
      {
        id: "MNT-01",
        date: "2026-08-20",
        type: "micro_polish",
        operator: "精耐特拋光技師 林工",
        facility: "精耐特廠內精密拋光課",
        result: "PASS",
        notes: "超音波鏡面精拋 Ra 0.04，消除放電加工白硬層"
      }
    ]
  },
  {
    id: "PCH-2026-901",
    punchNumber: "PCH-2026-901",
    companyId: "COMP-02",
    applicableProduct: "M3.5 乾壁螺絲 十字#2",
    punchType: "second_punch",
    material: "ASP-23",
    coating: "AlTiN",
    hardnessHrc: 64.0,
    headProfile: "phillips",
    outerDiameter: 14.0,
    totalLength: 45.0,
    headDepth: 1.42,
    concentricity: 0.0025,
    toleranceLevel: "±0.003mm",
    expectedLifeHits: 100000,
    currentHits: 88450,
    remainingLifePercent: 11.5,
    status: "in_use",
    qrCode: "FTL-PASSPORT://PCH-2026-901",
    lastMaintenanceDate: "2026-09-12",
    lastQcResult: "PASS",
    ncrCount: 0,
    currentMachineId: "HM-01",
    operator: "陳志豪",
    createdAt: "2026-08-01",
    updatedAt: "2026-09-17",
    usageHistory: [],
    maintenanceHistory: []
  },
  {
    id: "PCH-2026-920",
    punchNumber: "PCH-2026-920",
    companyId: "COMP-02",
    applicableProduct: "M2 超微型筆電螺絲 T6",
    punchType: "second_punch",
    material: "ASP-60",
    coating: "DLC",
    hardnessHrc: 67.0,
    headProfile: "torx",
    outerDiameter: 10.0,
    totalLength: 35.0,
    headDepth: 0.95,
    concentricity: 0.0015,
    toleranceLevel: "±0.002mm",
    expectedLifeHits: 30000,
    currentHits: 28900,
    remainingLifePercent: 3.7,
    status: "in_use",
    qrCode: "FTL-PASSPORT://PCH-2026-920",
    lastMaintenanceDate: "2026-09-16",
    lastQcResult: "PASS",
    ncrCount: 0,
    currentMachineId: "HM-03",
    operator: "王建宏",
    createdAt: "2026-09-02",
    updatedAt: "2026-09-18",
    usageHistory: [],
    maintenanceHistory: []
  }
];

export const SEED_MACHINES: Machine[] = [
  {
    id: "HM-01",
    companyId: "COMP-01",
    machineNumber: "HM-01",
    machineName: "1模2衝打頭機 #01",
    model: "正雄 JSN-2B 80型",
    station: "二衝成型工位",
    status: "warning",
    currentPunchId: "P-2026-003921",
    speedRpm: 240,
    operator: "陳志豪 (組長)"
  },
  {
    id: "HM-02",
    companyId: "COMP-01",
    machineNumber: "HM-02",
    machineName: "多工位冷鍛打頭機 #02",
    model: "國菱 4模4衝 65B",
    station: "第四站 內六角成型沖",
    status: "running",
    currentPunchId: "PCH-2026-884",
    speedRpm: 190,
    operator: "林士閔 (技師)"
  },
  {
    id: "HM-03",
    companyId: "COMP-01",
    machineNumber: "HM-03",
    machineName: "高速微型打頭機 #03",
    model: "朝陽 CY-1B 精密微螺絲機",
    station: "二衝梅花成型工位",
    status: "critical",
    currentPunchId: "PCH-2026-920",
    speedRpm: 310,
    operator: "王建宏"
  },
  {
    id: "HM-04",
    companyId: "COMP-01",
    machineNumber: "HM-04",
    machineName: "1模2衝打頭機 #04",
    model: "友信 2B-6S",
    station: "一衝預鍛打頭工位",
    status: "running",
    currentPunchId: "PCH-2026-790",
    speedRpm: 210,
    operator: "黃俊偉"
  }
];

export const SEED_JOBS: Job[] = [
  {
    id: "JOB-2026-00882",
    jobNumber: "FTL-2026-00882",
    customerCompanyId: "COMP-01",
    supplierCompanyId: "COMP-02",
    customerName: "長宏精密螺絲工業 (岡山廠)",
    supplierName: "精耐特精密沖棒模具廠 (本洲工業區)",
    productId: "PROD-M8-TORX",
    productName: "M8 × 30 梅花星型沉頭冷鍛螺絲",
    screwSpec: "M8 x 30 Torx 10.9級 SCM435",
    drawingRevisionId: "REV-00882-B",
    drawingNumber: "CAD-2026-M8-T40",
    drawingRev: "Rev.B",
    rfqId: "RFQ-2026-0917-01",
    quoteId: "QUO-2026-0917-01",
    moldId: "M-00882",
    punchId: "P-2026-003921",
    machineId: "HM-01",
    priority: "urgent",
    plannedStartDate: "2026-09-17 08:00",
    plannedDeliveryDate: "2026-09-25",
    actualStartDate: "2026-09-17 09:30",
    status: "production",
    currentStage: "pvd_coating",
    progressPercent: 78,
    riskLevel: "yellow",
    riskReason: "PVD 表面鍍膜外協排程壅塞，熱處理後檢驗已延誤 2h 20m，交期需緊盯",
    quantity: 20,
    notes: "特斯拉底盤冷鍛專案，ASP-23 + AlTiN 膜厚 ≥ 2.8μm，同心度嚴控 0.002mm 內",
    createdAt: "2026-09-17 09:00",
    updatedAt: "2026-09-18 10:15"
  },
  {
    id: "JOB-2026-00883",
    jobNumber: "FTL-2026-00883",
    customerCompanyId: "COMP-01",
    supplierCompanyId: "COMP-02",
    customerName: "長宏精密螺絲工業 (岡山廠)",
    supplierName: "精耐特精密沖棒模具廠 (本洲工業區)",
    productId: "PROD-M2-MICRO",
    productName: "M2 × 4 超薄頭筆電微型梅花星型螺絲",
    screwSpec: "M2 x 4 Torx T6 SUS304",
    drawingRevisionId: "REV-00882-A",
    drawingNumber: "CAD-2026-T06-V2",
    drawingRev: "Rev.A",
    priority: "rush_critical",
    plannedStartDate: "2026-09-18 09:00",
    plannedDeliveryDate: "2026-09-20",
    status: "production",
    currentStage: "profile_edm",
    progressPercent: 62,
    riskLevel: "red",
    riskReason: "現場 HM-03 機台壽命僅剩 4%，急需此批沖棒上機接替，目前放電中",
    quantity: 30,
    notes: "特急單！明日專車派送送達長宏廠區",
    createdAt: "2026-09-18 08:00",
    updatedAt: "2026-09-18 11:30"
  },
  {
    id: "JOB-2026-00880",
    jobNumber: "FTL-2026-00880",
    customerCompanyId: "COMP-01",
    supplierCompanyId: "COMP-02",
    customerName: "長宏精密螺絲工業 (岡山廠)",
    supplierName: "精耐特精密沖棒模具廠 (本洲工業區)",
    productId: "PROD-M35-DRYWALL",
    productName: "M3.5 × 25 乾壁十字螺絲二衝",
    screwSpec: "M3.5 x 25 十字#2 1022A",
    drawingNumber: "CAD-2026-PH2-1445",
    drawingRev: "Rev.C",
    priority: "normal",
    plannedStartDate: "2026-09-14 08:00",
    plannedDeliveryDate: "2026-09-22",
    actualStartDate: "2026-09-14 08:00",
    status: "qc",
    currentStage: "qc_inspection",
    progressPercent: 92,
    riskLevel: "green",
    riskReason: "進度完全符合排程，QC 三次元尺寸全數在公差中值內",
    quantity: 50,
    notes: "乾壁標準批量訂製，ASP-23 AlTiN",
    createdAt: "2026-09-14 08:00",
    updatedAt: "2026-09-18 09:40"
  }
];

export const SEED_PRODUCTION_PROCESSES: ProductionJob[] = [
  {
    id: "PROC-01",
    jobId: "JOB-2026-00882",
    processCode: "RFQ",
    processName: "線上需求確認與自動計價",
    sequence: 1,
    plannedStart: "2026-09-17 08:00",
    plannedEnd: "2026-09-17 09:00",
    actualStart: "2026-09-17 08:15",
    actualEnd: "2026-09-17 08:50",
    varianceMinutes: -10,
    varianceText: "-10m (提前)",
    risk: "green",
    progressPercent: 100,
    status: "completed",
    operatorName: "系統自動核算"
  },
  {
    id: "PROC-02",
    jobId: "JOB-2026-00882",
    processCode: "DWG_REV",
    processName: "工程審圖與 Rev.B 公差覆核",
    sequence: 2,
    plannedStart: "2026-09-17 09:00",
    plannedEnd: "2026-09-17 11:00",
    actualStart: "2026-09-17 09:10",
    actualEnd: "2026-09-17 10:45",
    varianceMinutes: -15,
    varianceText: "-15m (提前)",
    risk: "green",
    progressPercent: 100,
    status: "completed",
    operatorName: "精耐特 蔡總工"
  },
  {
    id: "PROC-03",
    jobId: "JOB-2026-00882",
    processCode: "MAT_CUT",
    processName: "瑞典 ASP-23 粉末鋼棒材下料",
    sequence: 3,
    plannedStart: "2026-09-17 11:00",
    plannedEnd: "2026-09-17 13:00",
    actualStart: "2026-09-17 11:30",
    actualEnd: "2026-09-17 13:10",
    varianceMinutes: 10,
    varianceText: "+10m",
    risk: "green",
    progressPercent: 100,
    status: "completed",
    operatorName: "王師傅 (下料組)"
  },
  {
    id: "PROC-04",
    jobId: "JOB-2026-00882",
    processCode: "CNC_LATHE",
    processName: "CNC 高速車銑外徑粗胚成型",
    sequence: 4,
    plannedStart: "2026-09-17 13:00",
    plannedEnd: "2026-09-17 17:00",
    actualStart: "2026-09-17 13:20",
    actualEnd: "2026-09-17 17:15",
    varianceMinutes: 15,
    varianceText: "+15m",
    risk: "green",
    progressPercent: 100,
    status: "completed",
    machineId: "CNC-03",
    operatorName: "林師傅"
  },
  {
    id: "PROC-05",
    jobId: "JOB-2026-00882",
    processCode: "VAC_HEAT",
    processName: "真空三次回火熱處理 (HRC 64.5)",
    sequence: 5,
    plannedStart: "2026-09-17 18:00",
    plannedEnd: "2026-09-18 04:00",
    actualStart: "2026-09-17 18:30",
    actualEnd: "2026-09-18 06:50",
    varianceMinutes: 140,
    varianceText: "+2h 20m (延遲)",
    risk: "yellow",
    progressPercent: 100,
    status: "completed",
    operatorName: "真空熱處理爐組",
    notes: "低溫冷作退火段回溫時間稍微拉長以確保深層金相組織均勻，硬度達成 64.5 HRC"
  },
  {
    id: "PROC-06",
    jobId: "JOB-2026-00882",
    processCode: "CYL_GRIND",
    processName: "外圓精磨 (D14 0/-0.003mm)",
    sequence: 6,
    plannedStart: "2026-09-18 07:00",
    plannedEnd: "2026-09-18 10:00",
    actualStart: "2026-09-18 07:15",
    actualEnd: "2026-09-18 10:10",
    varianceMinutes: 10,
    varianceText: "+10m",
    risk: "green",
    progressPercent: 100,
    status: "completed",
    operatorName: "研磨課 張技師"
  },
  {
    id: "PROC-07",
    jobId: "JOB-2026-00882",
    processCode: "OPT_EDM",
    processName: "光學曲線放電 Torx 梅花頭型",
    sequence: 7,
    plannedStart: "2026-09-18 10:00",
    plannedEnd: "2026-09-18 14:00",
    actualStart: "2026-09-18 10:15",
    actualEnd: "2026-09-18 14:05",
    varianceMinutes: 5,
    varianceText: "+5m",
    risk: "green",
    progressPercent: 100,
    status: "completed",
    operatorName: "放電組 廖工程師"
  },
  {
    id: "PROC-08",
    jobId: "JOB-2026-00882",
    processCode: "ULTRA_POLISH",
    processName: "超音波鏡面拋光 (Ra 0.04μm)",
    sequence: 8,
    plannedStart: "2026-09-18 14:00",
    plannedEnd: "2026-09-18 16:30",
    actualStart: "2026-09-18 14:10",
    actualEnd: "2026-09-18 16:25",
    varianceMinutes: -5,
    varianceText: "-5m",
    risk: "green",
    progressPercent: 100,
    status: "completed",
    operatorName: "拋光技師 林工"
  },
  {
    id: "PROC-09",
    jobId: "JOB-2026-00882",
    processCode: "PVD_COAT",
    processName: "PVD 物理鍍膜 (歐瑞康 AlTiN 紫黑耐熱膜)",
    sequence: 9,
    plannedStart: "2026-09-18 17:00",
    plannedEnd: "2026-09-19 03:00",
    actualStart: "2026-09-18 18:00",
    varianceMinutes: 60,
    varianceText: "+1h 00m (爐批排隊)",
    risk: "yellow",
    progressPercent: 65,
    status: "in_progress",
    operatorName: "外協 歐瑞康高科廠",
    notes: "第 4 爐批次進入真空沉積鍍膜，預計明日清晨 03:00 出爐冷卻"
  },
  {
    id: "PROC-10",
    jobId: "JOB-2026-00882",
    processCode: "QC_MEASURE",
    processName: "三次元精密量測與同心度檢驗",
    sequence: 10,
    plannedStart: "2026-09-19 06:00",
    plannedEnd: "2026-09-19 09:00",
    risk: "green",
    progressPercent: 0,
    status: "pending",
    operatorName: "精耐特品保課"
  },
  {
    id: "PROC-11",
    jobId: "JOB-2026-00882",
    processCode: "EXP_SHIP",
    processName: "工業級防鏽包裝與急件專車物流",
    sequence: 11,
    plannedStart: "2026-09-19 10:00",
    plannedEnd: "2026-09-19 12:00",
    risk: "green",
    progressPercent: 0,
    status: "pending",
    operatorName: "精耐特專車直送"
  },
  {
    id: "PROC-12",
    jobId: "JOB-2026-00882",
    processCode: "DELIVERED",
    processName: "長宏岡山廠上機打頭驗收與衝次履歷啟動",
    sequence: 12,
    plannedStart: "2026-09-19 13:00",
    plannedEnd: "2026-09-19 14:00",
    risk: "green",
    progressPercent: 0,
    status: "pending",
    operatorName: "長宏組長 陳志豪"
  }
];

export const SEED_QCS: QCInspection[] = [
  {
    id: "QC-2026-0882-01",
    qcNumber: "QC-2026-0882-01",
    jobId: "JOB-2026-00882",
    punchId: "P-2026-003921",
    inspectorId: "USER-02",
    inspectorName: "精耐特品保副理 鄭文彬",
    inspectionType: "in_process",
    dimensionResults: [
      { item: "外徑 (OD)", nominal: "14.000 mm", tolerance: "0 / -0.003 mm", measured: "13.998 mm", passed: true },
      { item: "全長 (OAL)", nominal: "45.00 mm", tolerance: "±0.05 mm", measured: "45.02 mm", passed: true },
      { item: "梅花頭深 (Depth)", nominal: "1.40 mm", tolerance: "±0.01 mm", measured: "1.403 mm", passed: true },
      { item: "同心度 (Runout)", nominal: "≤0.002 mm", tolerance: "Max 0.002 mm", measured: "0.0018 mm", passed: true }
    ],
    hardness: "64.5 HRC (規格要求: 64.0 ~ 65.0 HRC)",
    concentricity: "0.0018 mm (合格)",
    appearance: "放電加工面無白硬層，超音波鏡面 Ra 0.038μm",
    coating: "待 PVD 出爐後複驗附著力",
    result: "PASS",
    inspectedAt: "2026-09-18 16:40",
    notes: "半成品全檢尺寸合格，已放行移交歐瑞康鍍膜廠"
  }
];

export const SEED_NCRS: NCR[] = [
  {
    id: "NCR-2026-0042",
    ncrNumber: "NCR-2026-0042",
    jobId: "JOB-2026-00882",
    punchId: "P-2026-003921",
    machineId: "HM-01",
    reportedBy: "長宏現場品管課 廖立綱",
    defectType: "chipping",
    severity: "major",
    description: "沖棒 P-2026-003921 於打擊 31,280 衝時，二衝梅花星型其中一刃產生微崩刃 (Chipping 0.08mm)，造成螺絲頭部溝槽起毛邊。",
    hitsAtFailure: 31280,
    expectedHits: 50000,
    containmentAction: "現場立即停機換刀，隔離該批螺絲 1,200 支，啟動 100% 人工光學投影抽檢。",
    rootCause: "經高倍顯微鏡金相分析，成型角 R0.08mm 處有殘留放電白硬層，且冷鍛油沖洗冷卻流量不足，瞬時摩擦高溫達 480°C 誘發熱疲勞微裂紋。",
    correctiveAction: "1. 模具放電後增加低應力回火與微倒角 R0.12mm。\n2. 表面鍍膜改為 AlTiN 紫黑膜 (耐溫達 800°C)。\n3. 機台調整冷鍛油噴嘴正對沖棒中心。",
    preventiveAction: "修改 SOP：打擊高拉力鋼材 (SCM435) 全面強制作業前 15 分鐘冷鍛油循環預熱，並於圖面 Rev.B 標註 R0.12mm 最低倒角標準。",
    status: "root_cause_identified",
    eightDId: "8D-2026-0012",
    createdAt: "2026-09-15 11:20"
  }
];

export const SEED_EIGHT_D: EightDReport = {
  id: "8D-2026-0012",
  ncrId: "NCR-2026-0042",
  d1Team: "隊長: 精耐特 蔡廠長 | 成員: 長宏 陳志豪(生管)、廖立綱(品保)、歐瑞康 鍍膜工程師",
  d2Problem: "P-2026-003921 打頭機 HM-01 於 31,280 衝次梅花刃尖崩落 0.08mm，未達預期 50,000 衝次。",
  d3Containment: "1. 隔離批號 260915-A 螺絲。\n2. 調派同規格備刀更換。\n3. 模具廠 24 小時急件補製 10 支同款沖棒。",
  d4RootCause: "5-Whys 分析：放電加工白硬層脆化 + 內角應力集中 + 冷鍛瞬間高溫回火軟化。",
  d5CorrectiveAction: "全面導入超音波鏡面拋光去除白硬層，加大內角 R 角至 0.12mm，鍍膜提升為 AlTiN。",
  d6Verification: "新規格 Rev.B 沖棒上機打擊 42,000 衝無任何微崩，外觀鏡面完整，目標達成率 120%。",
  d7Prevention: "圖面納入工程規範標準書 STD-TL-09，往後凡 SCM435 / SUS304 強制選用 ASP-23 以上等級與紫黑耐熱膜。",
  d8Closure: "跨廠聯合小組審查簽核，長宏與精耐特主管共同結案，核發工程改進獎勵。",
  status: "in_progress"
};

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: "LOG-01",
    companyId: "COMP-01",
    userId: "USER-01",
    userName: "陳志豪 (長宏生管)",
    action: "RFQ 建立與自動成本預估",
    entityType: "RFQ",
    entityId: "RFQ-2026-0917-01",
    beforeData: null,
    afterData: { quantity: 20, product: "M8 Torx", urgency: "urgent" },
    timestamp: "2026-09-17 09:15",
    ip: "211.20.45.12"
  },
  {
    id: "LOG-02",
    companyId: "COMP-02",
    userId: "USER-02",
    userName: "蔡廠長 (精耐特)",
    action: "核准圖面 Rev.B 並建立正式工單",
    entityType: "Drawing",
    entityId: "DWG-2026-00882",
    beforeData: { revision: "Rev.A" },
    afterData: { revision: "Rev.B", status: "approved" },
    timestamp: "2026-09-17 10:00",
    ip: "61.221.112.8"
  },
  {
    id: "LOG-03",
    companyId: "COMP-02",
    userId: "USER-02",
    userName: "蔡廠長 (精耐特)",
    action: "完成真空熱處理三次回火檢驗",
    entityType: "Job",
    entityId: "JOB-2026-00882",
    beforeData: { stage: "cnc_machining" },
    afterData: { stage: "heat_treatment", hrc: 64.5 },
    timestamp: "2026-09-18 07:00",
    ip: "61.221.112.8"
  },
  {
    id: "LOG-04",
    companyId: "COMP-01",
    userId: "USER-01",
    userName: "廖立綱 (長宏品保)",
    action: "開立沖棒微崩刃品質異常單 NCR",
    entityType: "NCR",
    entityId: "NCR-2026-0042",
    beforeData: null,
    afterData: { punchId: "P-2026-003921", defectType: "chipping" },
    timestamp: "2026-09-15 11:20",
    ip: "211.20.45.12"
  }
];

export const SEED_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "EVT-01",
    jobId: "JOB-2026-00882",
    type: "status_change",
    actor: "系統連動 (長宏螺絲)",
    message: "發出沖棒 RFQ-2026-0917-01 需求詢價單 (20 支 M8 Torx ASP-23 AlTiN)",
    timestamp: "2026-09-17 09:15"
  },
  {
    id: "EVT-02",
    jobId: "JOB-2026-00882",
    type: "quote",
    actor: "精耐特蔡廠長",
    message: "完成拆解報價 QUO-2026-0917-01 (單支 NT$1,650，工期 4 天，含真空三次回火與紫黑耐熱鍍膜)",
    timestamp: "2026-09-17 11:40"
  },
  {
    id: "EVT-03",
    jobId: "JOB-2026-00882",
    type: "drawing_revision",
    actor: "精耐特工程部",
    message: "核准圖面 Rev.B：成型深確認為 1.40mm，同心度公差 ≤0.002mm",
    timestamp: "2026-09-17 14:00"
  },
  {
    id: "EVT-04",
    jobId: "JOB-2026-00882",
    type: "production_milestone",
    actor: "精耐特生管排程",
    message: "第 5 站【真空熱處理】完成，實測硬度 HRC 64.5，稍有延誤 +2h 20m",
    timestamp: "2026-09-18 07:00"
  },
  {
    id: "EVT-05",
    jobId: "JOB-2026-00882",
    type: "qc_pass",
    actor: "精耐特品保副理",
    message: "第 8 站【光學研磨放電後 QC 全檢】PASS：外徑 13.998mm，同心度 0.0018mm",
    timestamp: "2026-09-18 16:40"
  },
  {
    id: "EVT-06",
    jobId: "JOB-2026-00882",
    type: "ai_action",
    actor: "Gemini AI 工業顧問",
    message: "檢測到外協 PVD 排程壅塞，交期風險評定為【黃燈 (Yellow)】，建議持續追蹤冷卻進度",
    timestamp: "2026-09-18 18:30"
  }
];

export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: "NOTIF-01",
    title: "機台打擊壽命臨界警報",
    message: "高速微型機 HM-03 梅花 T6 沖棒 (PCH-2026-920) 壽命僅剩 3.7%，請立刻安排換刀備料！",
    type: "critical",
    timestamp: "10分鐘前",
    read: false,
    entityLink: { type: "punch", id: "PCH-2026-920" }
  },
  {
    id: "NOTIF-02",
    title: "交期風險預警 (Yellow)",
    message: "工單 FTL-2026-00882 因真空熱處理延誤 2h 20m，PVD 鍍膜產能目前 85%，預估可能壓縮出貨緩衝。",
    type: "warning",
    timestamp: "35分鐘前",
    read: false,
    entityLink: { type: "job", id: "JOB-2026-00882" }
  },
  {
    id: "NOTIF-03",
    title: "圖面 Rev.B 審查通過",
    message: "特斯拉 M8 Torx 沉頭螺絲工程圖 CAD-2026-M8-T40 經精耐特模具技術總監簽核放行。",
    type: "success",
    timestamp: "2小時前",
    read: true,
    entityLink: { type: "job", id: "JOB-2026-00882" }
  },
  {
    id: "NOTIF-04",
    title: "品質異常 RCA 對策已建立",
    message: "NCR-2026-0042 (沖尖微崩刃) 8D 永久對策小組已完成真因分析與材料升級驗證。",
    type: "info",
    timestamp: "4小時前",
    read: true,
    entityLink: { type: "ncr", id: "NCR-2026-0042" }
  }
];
