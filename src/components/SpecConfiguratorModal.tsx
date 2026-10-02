import React, { useState } from "react";
import { 
  PunchType, 
  HeadProfile, 
  PunchMaterial, 
  CoatingType, 
  OrderItem 
} from "../types";
import { PunchCanvasPreview } from "./PunchCanvasPreview";
import { 
  X, 
  Check, 
  Zap, 
  Calculator, 
  FileText, 
  ShieldCheck, 
  AlertTriangle 
} from "lucide-react";

interface SpecConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitOrder: (order: Partial<OrderItem>) => void;
  initialValues?: {
    machineId?: string;
    screwSpec?: string;
    urgency?: "normal" | "urgent" | "rush_critical";
    headProfile?: HeadProfile;
  };
}

export const SpecConfiguratorModal: React.FC<SpecConfiguratorModalProps> = ({
  isOpen,
  onClose,
  onSubmitOrder,
  initialValues
}) => {
  const [punchType, setPunchType] = useState<PunchType>("second_punch");
  const [headProfile, setHeadProfile] = useState<HeadProfile>(initialValues?.headProfile || "torx");
  const [material, setMaterial] = useState<PunchMaterial>("ASP-23");
  const [coating, setCoating] = useState<CoatingType>("AlTiN");
  const [outerDiameter, setOuterDiameter] = useState<number>(14);
  const [totalLength, setTotalLength] = useState<number>(45);
  const [headDepth, setHeadDepth] = useState<number>(1.40);
  const [concentricity, setConcentricity] = useState<number>(0.002);
  const [toleranceLevel, setToleranceLevel] = useState<string>("±0.002mm");
  const [targetScrewStandard, setTargetScrewStandard] = useState<string>("DIN 7981 十字 / 梅花");
  const [targetScrewMaterial, setTargetScrewMaterial] = useState<string>("1022A 滲碳鋼");
  const [quantity, setQuantity] = useState<number>(30);
  const [urgency, setUrgency] = useState<"normal" | "urgent" | "rush_critical">(initialValues?.urgency || "normal");
  const [notes, setNotes] = useState<string>(
    initialValues?.machineId ? `機台【${initialValues.machineId}】更換備料急件，請優先排程。` : ""
  );

  if (!isOpen) return null;

  // Real-time industrial price calculation algorithm
  const calculateEstimate = () => {
    let basePrice = 450;
    if (punchType === "first_punch") basePrice = 400;
    if (punchType === "carbide_die") basePrice = 2800;
    if (punchType === "thread_die") basePrice = 3200;

    // Material cost factor
    let matMultiplier = 1.0;
    if (material === "SKH-51") matMultiplier = 1.15;
    if (material === "ASP-23") matMultiplier = 1.6;
    if (material === "ASP-60") matMultiplier = 2.4;
    if (material === "Tungsten_Carbide") matMultiplier = 3.2;

    // Coating cost
    let coatAddon = 0;
    if (coating === "TiN") coatAddon = 90;
    if (coating === "TiCN") coatAddon = 140;
    if (coating === "AlTiN") coatAddon = 190;
    if (coating === "DLC") coatAddon = 380;
    if (coating === "CrN") coatAddon = 160;

    // Tolerance precision factor
    let tolFactor = 1.0;
    if (concentricity <= 0.002) tolFactor = 1.25;

    // Urgency surcharge
    let urgencyFactor = 1.0;
    if (urgency === "urgent") urgencyFactor = 1.25;
    if (urgency === "rush_critical") urgencyFactor = 1.6;

    const unitPrice = Math.round((basePrice * matMultiplier * tolFactor + coatAddon) * urgencyFactor);
    const totalAmount = unitPrice * quantity;

    // Estimated delivery days
    let days = 5;
    if (urgency === "urgent") days = 2;
    if (urgency === "rush_critical") days = 1;
    if (material === "Tungsten_Carbide") days += 2;

    return { unitPrice, totalAmount, days };
  };

  const { unitPrice, totalAmount, days } = calculateEstimate();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitOrder({
      punchType,
      headProfile,
      material,
      coating,
      outerDiameter,
      totalLength,
      headDepth,
      concentricity,
      toleranceLevel,
      targetScrewStandard,
      quantity,
      unitPrice,
      totalAmount,
      urgency,
      notes,
      currentStage: "rfq_pending",
      stageProgressPercent: 5,
      cadDrawingNumber: `CAD-${headProfile.toUpperCase()}-D${outerDiameter}L${totalLength}.dwg`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl text-slate-100 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                智慧沖棒規格訂製與即時詢價
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-900 text-sky-300 border border-sky-600/50">
                  即時試算引擎
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                螺絲打頭沖棒參數配置 · 即時 2D 工程預覽 · 材料鍍膜推薦
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
          {/* Top Row: Live CAD Preview Component */}
          <div>
            <PunchCanvasPreview
              punchType={punchType}
              headProfile={headProfile}
              material={material}
              coating={coating}
              outerDiameter={outerDiameter}
              totalLength={totalLength}
              headDepth={headDepth}
              concentricity={concentricity}
              toleranceLevel={toleranceLevel}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Mechanical Specifications */}
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                沖棒構造與頭型規格
              </div>

              {/* Punch Category */}
              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-medium">模具種類</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "second_punch", label: "二衝 (成型沖)" },
                    { id: "first_punch", label: "一衝 (預鍛沖)" },
                    { id: "carbide_die", label: "鎢鋼主模" },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setPunchType(item.id as PunchType)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                        punchType === item.id
                          ? "bg-sky-600 border-sky-400 text-white shadow-md"
                          : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Head Profile */}
              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-medium">螺絲槽型 / 沖頭孔型</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "phillips", label: "十字 (Phillips)" },
                    { id: "torx", label: "梅花 (Torx)" },
                    { id: "hex_socket", label: "內六角 (Hex)" },
                    { id: "pozidriv", label: "米字 (Pozidriv)" },
                    { id: "tamper_torx", label: "防盜梅花" },
                    { id: "slotted", label: "一字 (Slotted)" },
                    { id: "square", label: "方孔 (Robertson)" },
                    { id: "custom", label: "特殊客製" },
                  ].map((hp) => (
                    <button
                      type="button"
                      key={hp.id}
                      onClick={() => setHeadProfile(hp.id as HeadProfile)}
                      className={`px-2.5 py-2 text-xs font-medium rounded-lg border transition-all text-center ${
                        headProfile === hp.id
                          ? "bg-indigo-600 border-indigo-400 text-white shadow"
                          : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750"
                      }`}
                    >
                      {hp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dimensional inputs */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">外徑 D (mm)</label>
                  <input
                    type="number"
                    min="6"
                    max="40"
                    step="0.5"
                    value={outerDiameter}
                    onChange={(e) => setOuterDiameter(parseFloat(e.target.value) || 12)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">全長 L (mm)</label>
                  <input
                    type="number"
                    min="20"
                    max="120"
                    step="1"
                    value={totalLength}
                    onChange={(e) => setTotalLength(parseFloat(e.target.value) || 45)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">頭深 H (mm)</label>
                  <input
                    type="number"
                    min="0.4"
                    max="6.0"
                    step="0.05"
                    value={headDepth}
                    onChange={(e) => setHeadDepth(parseFloat(e.target.value) || 1.4)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Precision & Concentricity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">同心度要求 (◎)</label>
                  <select
                    value={concentricity}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setConcentricity(v);
                      setToleranceLevel(`±${v}mm`);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                  >
                    <option value={0.002}>≤ 0.002mm (超高精密光學級)</option>
                    <option value={0.003}>≤ 0.003mm (精密級標準)</option>
                    <option value={0.005}>≤ 0.005mm (一般級)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">適用螺絲材質 (被鍛材)</label>
                  <select
                    value={targetScrewMaterial}
                    onChange={(e) => setTargetScrewMaterial(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                  >
                    <option value="1022A 滲碳鋼">1022A 碳鋼 / 乾壁螺絲</option>
                    <option value="SUS304 不鏽鋼">SUS304 不鏽鋼 (高加工硬化)</option>
                    <option value="SUS316 不鏽鋼">SUS316 耐酸鹼不鏽鋼</option>
                    <option value="SCM435 高張力鋼">SCM435 汽車高拉力合金鋼</option>
                    <option value="Ti 鈦合金">鈦合金 / 電子微型螺絲</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column: Material, Coating & Commercial Terms */}
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                熱處理材質、PVD 鍍膜與交期
              </div>

              {/* Material Selection */}
              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-medium">沖棒鋼材</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "ASP-23", label: "ASP-23 (粉末高速鋼)", desc: "耐磨抗崩首選" },
                    { id: "ASP-60", label: "ASP-60 (極高硬度)", desc: "打不鏽鋼/超耐久" },
                    { id: "Tungsten_Carbide", label: "鎢鋼 (UF-09)", desc: "高抗壓極限壽命" },
                    { id: "SKH-9", label: "SKH-9 (M2 高速鋼)", desc: "經濟適用" },
                    { id: "SKH-51", label: "SKH-51", desc: "韌性優" },
                    { id: "SKD-11", label: "SKD-11", desc: "主模用鋼" },
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setMaterial(m.id as PunchMaterial)}
                      className={`p-2 text-left rounded-lg border transition-all ${
                        material === m.id
                          ? "bg-amber-950/60 border-amber-500 text-amber-200 shadow"
                          : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750"
                      }`}
                    >
                      <div className="text-xs font-bold font-mono">{m.id}</div>
                      <div className="text-[10px] text-slate-400">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Coating Selection */}
              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-medium">PVD 奈米表面鍍膜</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "AlTiN", name: "AlTiN 氮化鋁鈦", color: "text-indigo-400", sub: "紫黑 · 耐溫800°C" },
                    { id: "DLC", name: "DLC 類鑽碳", color: "text-zinc-300", sub: "黑色 · 打不鏽鋼首選" },
                    { id: "TiN", name: "TiN 氮化鈦", color: "text-amber-400", sub: "金黃 · 通用耐磨" },
                    { id: "TiCN", name: "TiCN 碳氮化鈦", color: "text-purple-400", sub: "粉紫 · 高韌性" },
                    { id: "CrN", name: "CrN 氮化鉻", color: "text-slate-300", sub: "銀白 · 抗咬死" },
                    { id: "none", name: "原色鏡面", color: "text-slate-400", sub: "超音波拋光" },
                  ].map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setCoating(c.id as CoatingType)}
                      className={`p-2 text-left rounded-lg border transition-all ${
                        coating === c.id
                          ? "bg-slate-800 border-emerald-500 shadow ring-1 ring-emerald-500/50"
                          : "bg-slate-850 border-slate-700 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <div className={`text-xs font-semibold ${c.color}`}>{c.name}</div>
                      <div className="text-[10px] text-slate-400">{c.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Urgency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">訂購數量 (支/pcs)</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    step="5"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 10)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">優先級與交期要求</label>
                  <div className="flex gap-1">
                    {[
                      { id: "normal", label: "標準", color: "text-slate-300" },
                      { id: "urgent", label: "急件", color: "text-amber-400" },
                      { id: "rush_critical", label: "停機特急", color: "text-rose-400" },
                    ].map((urg) => (
                      <button
                        type="button"
                        key={urg.id}
                        onClick={() => setUrgency(urg.id as any)}
                        className={`flex-1 py-1.5 text-[11px] font-semibold rounded border transition-all ${
                          urgency === urg.id
                            ? "bg-slate-800 border-amber-400 text-amber-300"
                            : "bg-slate-850 border-slate-700 text-slate-400"
                        }`}
                      >
                        {urg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs text-slate-300 mb-1">備註 / 機台換料要求</label>
                <input
                  type="text"
                  placeholder="例如：機台 HM-01 更換備用，公差嚴格控制..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Estimation Summary Bar */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[11px] text-slate-400 block">預估單支單價</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  NT$ {unitPrice.toLocaleString()}
                </span>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div>
                <span className="text-[11px] text-slate-400 block">總金額 ({quantity} 支)</span>
                <span className="text-xl font-bold font-mono text-white">
                  NT$ {totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div>
                <span className="text-[11px] text-slate-400 block">預計加工天數</span>
                <span className="text-base font-bold font-mono text-amber-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  {days} 個工作天出貨
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-700 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 active:bg-sky-700 rounded-lg shadow-lg shadow-sky-900/30 flex items-center justify-center gap-2 transition-all"
              >
                <Check className="w-4 h-4" />
                送出正式詢價單 (連動模具廠生管)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
