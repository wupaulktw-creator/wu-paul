import { MachinePunchState, OrderItem, ChatMessage, DefectTicket, OrderStage } from "./types";

export const INITIAL_MACHINES: MachinePunchState[] = [
  {
    machineId: "HM-01",
    machineName: "1模2衝打頭機 #01",
    machineModel: "正雄 JSN-2B 80型",
    station: "二衝成型工位",
    screwSpec: "M3.5 x 25 喇叭頭十字乾壁螺絲",
    screwMaterial: "1022A 低碳合金",
    mountedPunchId: "PCH-2026-901",
    punchName: "十字 #2 預硬成型二衝",
    punchSpec: "二衝 D14 x L45 十字#2 ASP-23 (AlTiN)",
    currentHits: 88450,
    expectedLifeHits: 100000,
    healthPercent: 12, // 12% remaining -> warning threshold
    speedRpm: 240,
    status: "warning",
    lastChangedDate: "2026-09-12",
    operator: "陳志豪 (組長)"
  },
  {
    machineId: "HM-02",
    machineName: "多工位冷鍛打頭機 #02",
    machineModel: "國菱 4模4衝 65B",
    station: "第四站 內六角成型沖",
    screwSpec: "M4 x 16 圓柱頭內六角汽車螺栓",
    screwMaterial: "SCM435 高張力合金鋼",
    mountedPunchId: "PCH-2026-884",
    punchName: "內六角 3mm 高扭矩沖棒",
    punchSpec: "二衝 D18 x L55 Hex 3mm 鎢鋼UF-09 (DLC鍍膜)",
    currentHits: 34200,
    expectedLifeHits: 60000,
    healthPercent: 43,
    speedRpm: 190,
    status: "running",
    lastChangedDate: "2026-09-14",
    operator: "林士閔 (技師)"
  },
  {
    machineId: "HM-03",
    machineName: "高速微型打頭機 #03",
    machineModel: "朝陽 CY-1B 精密微螺絲機",
    station: "二衝梅花成型工位",
    screwSpec: "M2 x 4 筆電薄型梅花星型螺絲",
    screwMaterial: "SUS304 不鏽鋼",
    mountedPunchId: "PCH-2026-920",
    punchName: "梅花 T6 微型高精沖棒",
    punchSpec: "二衝 D10 x L35 Torx T6 ASP-60 (DLC類鑽石)",
    currentHits: 28900,
    expectedLifeHits: 30000,
    healthPercent: 4, // Critical threshold!
    speedRpm: 310,
    status: "critical",
    lastChangedDate: "2026-09-16",
    operator: "王建宏"
  },
  {
    machineId: "HM-04",
    machineName: "1模2衝打頭機 #04",
    machineModel: "友信 2B-6S",
    station: "一衝預鍛打頭工位",
    screwSpec: "M5 x 40 外六角法蘭木螺絲",
    screwMaterial: "1018A 冷作鋼",
    mountedPunchId: "PCH-2026-790",
    punchName: "一衝 錐度圓孔粗打頭",
    punchSpec: "一衝 D18 x L50 錐度 Ø6.2 SKH-9 (TiN金色)",
    currentHits: 42100,
    expectedLifeHits: 120000,
    healthPercent: 65,
    speedRpm: 210,
    status: "running",
    lastChangedDate: "2026-09-10",
    operator: "黃俊偉"
  }
];

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "ORD-8801",
    orderNumber: "FTL-2026-0917-01",
    createdAt: "2026-09-17 09:30",
    requiredDeliveryDate: "2026-09-19",
    screwFactoryName: "長宏精密螺絲工業 (岡山廠)",
    moldFactoryName: "精耐特精密沖棒模具廠 (本洲工業區)",
    urgency: "rush_critical",
    punchType: "second_punch",
    headProfile: "torx",
    material: "ASP-60",
    coating: "DLC",
    outerDiameter: 10,
    totalLength: 35,
    headDepth: 0.95,
    concentricity: 0.002,
    toleranceLevel: "±0.002mm",
    targetScrewStandard: "ISO 14581 M2 精密梅花",
    quantity: 20,
    unitPrice: 1650,
    totalAmount: 33000,
    currentStage: "pvd_coating",
    stageProgressPercent: 85,
    cadDrawingNumber: "CAD-2026-T06-V2.dwg",
    notes: "【現場 HM-03 機台急需】壽命剩餘 4%，請鍍膜廠插單排 PVD 批次，明日上午派專車取件！",
    qcPassedCount: 20
  },
  {
    id: "ORD-8802",
    orderNumber: "FTL-2026-0916-04",
    createdAt: "2026-09-16 14:15",
    requiredDeliveryDate: "2026-09-21",
    screwFactoryName: "長宏精密螺絲工業 (岡山廠)",
    moldFactoryName: "精耐特精密沖棒模具廠 (本洲工業區)",
    urgency: "urgent",
    punchType: "second_punch",
    headProfile: "phillips",
    material: "ASP-23",
    coating: "AlTiN",
    outerDiameter: 14,
    totalLength: 45,
    headDepth: 1.42,
    concentricity: 0.003,
    toleranceLevel: "±0.003mm",
    targetScrewStandard: "DIN 7981 十字#2",
    quantity: 50,
    unitPrice: 880,
    totalAmount: 44000,
    currentStage: "profile_edm",
    stageProgressPercent: 65,
    cadDrawingNumber: "CAD-2026-PH2-1445.dwg",
    notes: "打乾壁螺絲 1022A 專用，同心度請務必控制在 0.003mm 內，避免跳線斷針。"
  },
  {
    id: "ORD-8803",
    orderNumber: "FTL-2026-0915-02",
    createdAt: "2026-09-15 11:00",
    requiredDeliveryDate: "2026-09-22",
    screwFactoryName: "長宏精密螺絲工業 (岡山廠)",
    moldFactoryName: "精耐特精密沖棒模具廠 (本洲工業區)",
    urgency: "normal",
    punchType: "second_punch",
    headProfile: "hex_socket",
    material: "Tungsten_Carbide",
    coating: "TiCN",
    outerDiameter: 18,
    totalLength: 55,
    headDepth: 2.10,
    concentricity: 0.002,
    toleranceLevel: "±0.002mm",
    targetScrewStandard: "DIN 912 M4 內六角",
    quantity: 15,
    unitPrice: 2400,
    totalAmount: 36000,
    currentStage: "grinding",
    stageProgressPercent: 50,
    cadDrawingNumber: "CAD-2026-HEX3-WC.dwg",
    notes: "鎢鋼UF-09微粒材質，配合超音波精拋光 Ra 0.05。"
  },
  {
    id: "ORD-8804",
    orderNumber: "FTL-2026-0914-08",
    createdAt: "2026-09-14 16:30",
    requiredDeliveryDate: "2026-09-18",
    screwFactoryName: "長宏精密螺絲工業 (岡山廠)",
    moldFactoryName: "精耐特精密沖棒模具廠 (本洲工業區)",
    urgency: "normal",
    punchType: "first_punch",
    headProfile: "custom",
    material: "SKH-9",
    coating: "TiN",
    outerDiameter: 18,
    totalLength: 50,
    headDepth: 3.20,
    concentricity: 0.004,
    toleranceLevel: "±0.005mm",
    targetScrewStandard: "客製預鍛錐模 M5",
    quantity: 30,
    unitPrice: 650,
    totalAmount: 19500,
    currentStage: "shipping",
    stageProgressPercent: 95,
    cadDrawingNumber: "CAD-2026-P1-1850.dwg",
    notes: "已由模具廠專車配送中，物流單號：FTL-EXP-9921",
    qcPassedCount: 30
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "MSG-01",
    senderRole: "screw_factory",
    senderName: "陳生管 (長宏螺絲)",
    timestamp: "10:15",
    content: "精耐特蔡廠長您好，我們 HM-03 機台正在打筆電用 SUS304 M2薄頭梅花螺絲，剛看打擊次數已經衝到 28,900 次，預估今天下午三點前就會到壽命極限！請問訂單 ORD-8801 的 20 支 T6 沖棒鍍膜好了嗎？",
    orderId: "ORD-8801"
  },
  {
    id: "MSG-02",
    senderRole: "mold_factory",
    senderName: "蔡廠長 (精耐特沖棒)",
    timestamp: "10:18",
    content: "陳生管您好！我們生管系統有同步收到 HM-03 的警報。這批 ASP-60 搭配黑鑽 DLC 鍍膜已經進 PVD 真空爐了，預計 13:30 出爐進行三次元投影檢驗，下午 14:30 派專人送達貴廠產線！",
    orderId: "ORD-8801",
    attachmentType: "qc_report",
    attachmentData: {
      title: "PVD 鍍膜即時監控數據",
      badge: "爐號: PVD-B2",
      details: "塗層厚度 1.8μm | 硬度 HV 3200 | 摩擦係數 0.08"
    }
  },
  {
    id: "MSG-03",
    senderRole: "screw_factory",
    senderName: "王技術員 (長宏生技課)",
    timestamp: "10:45",
    content: "太感謝了！另外附上上週 HM-01 換下來的一支十字沖棒端面磨耗照片，我們發現十字符部有一側微崩，想請模具廠工程師協助看一下是同心度偏差還是熱處理問題？",
    attachmentType: "defect_photo",
    attachmentData: {
      title: "沖棒十字符部微崩裂檢測照 (50X)",
      badge: "機台 HM-01",
      details: "崩刃深度 0.04mm | 打擊材料 1022A | 累計衝次 92,000"
    }
  },
  {
    id: "MSG-04",
    senderRole: "mold_factory",
    senderName: "張工程師 (精耐特研發課)",
    timestamp: "10:52",
    content: "收到！剛看了照片，斷口邊緣呈現貝殼狀疲勞輝紋，沒有大塊脆斷，這主要是打擊到達 9.2 萬次時的正常疲勞擴展。不過右翼壁面有微小金屬黏附，表示打乾壁螺絲時冷鍛油局部高溫退火。下批我們建議升級為紫黑 AlTiN 耐熱鍍膜，並在內角做 R0.1 微導角，壽命預計可破 13 萬衝！"
  }
];

export const INITIAL_DEFECTS: DefectTicket[] = [
  {
    id: "DEF-101",
    reportedAt: "2026-09-17 08:30",
    machineId: "HM-01",
    punchSpec: "二衝 D14 x L45 十字#2 ASP-23 (AlTiN)",
    defectType: "chipping",
    hitsAtFailure: 92400,
    expectedHits: 100000,
    screwMaterial: "1022A 乾壁螺絲",
    description: "十字符部單側邊緣微崩刃，造成螺絲十字孔深量規微卡住。",
    status: "root_cause_identified",
    analysisSummary: "正常高循環交變應力疲勞，建議沖尖內角 R角由 R0.05 修整至 R0.10，並加強冷鍛模溫冷卻。"
  },
  {
    id: "DEF-102",
    reportedAt: "2026-09-15 15:40",
    machineId: "HM-02",
    punchSpec: "二衝 D18 x L55 Hex 3mm 鎢鋼 (DLC)",
    defectType: "concentricity_runout",
    hitsAtFailure: 48000,
    expectedHits: 60000,
    screwMaterial: "SCM435",
    description: "螺絲頭部內六角偏心 0.035mm，超出客規 0.02mm 要求。",
    status: "closed",
    analysisSummary: "經查為打頭機二衝座微偏滑動，機台夾座重新校心並更換銅襯套後恢復正常。"
  }
];

export const STAGE_CONFIGS: { [key in OrderStage]: { label: string; step: number; dept: string } } = {
  rfq_pending: { label: "詢價審核", step: 1, dept: "業務課" },
  drawing_review: { label: "CAD審圖確認", step: 2, dept: "工程課" },
  material_cutting: { label: "下料領料", step: 3, dept: "備料庫" },
  cnc_machining: { label: "CNC車銑粗精加工", step: 4, dept: "加工一課" },
  heat_treatment: { label: "真空熱處理淬回火", step: 5, dept: "熱處理課" },
  grinding: { label: "外圓/內孔精密研磨", step: 6, dept: "研磨二課" },
  profile_edm: { label: "頭型光學磨/放電", step: 7, dept: "成型課" },
  polishing: { label: "超音波鏡面拋光", step: 8, dept: "研發試作課" },
  pvd_coating: { label: "PVD 超硬奈米鍍膜", step: 9, dept: "表面工程課" },
  qc_inspection: { label: "三次元/投影QC檢驗", step: 10, dept: "品保部" },
  shipping: { label: "物流派送中", step: 11, dept: "倉管出貨" },
  delivered: { label: "已到廠驗收", step: 12, dept: "螺絲廠驗收" }
};
