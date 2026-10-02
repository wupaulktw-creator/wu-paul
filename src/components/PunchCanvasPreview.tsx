import React from "react";
import { HeadProfile, CoatingType, PunchMaterial, PunchType } from "../types";

interface PunchCanvasPreviewProps {
  punchType: PunchType;
  headProfile: HeadProfile;
  material: PunchMaterial;
  coating: CoatingType;
  outerDiameter: number; // mm, e.g. 14
  totalLength: number;   // mm, e.g. 45
  headDepth: number;     // mm, e.g. 1.4
  concentricity: number; // mm, e.g. 0.002
  toleranceLevel: string;
  showDimensions?: boolean;
}

export const PunchCanvasPreview: React.FC<PunchCanvasPreviewProps> = ({
  punchType,
  headProfile,
  material,
  coating,
  outerDiameter,
  totalLength,
  headDepth,
  concentricity,
  toleranceLevel,
  showDimensions = true
}) => {
  // Coating color representations
  const getCoatingGradient = (c: CoatingType) => {
    switch (c) {
      case "TiN":
        return {
          id: "tin-grad",
          stops: [
            { offset: "0%", color: "#fef08a" },
            { offset: "50%", color: "#eab308" },
            { offset: "100%", color: "#a16207" }
          ],
          accent: "#ca8a04",
          label: "TiN 氮化鈦金黃色"
        };
      case "TiCN":
        return {
          id: "ticn-grad",
          stops: [
            { offset: "0%", color: "#f5d0fe" },
            { offset: "50%", color: "#c084fc" },
            { offset: "100%", color: "#7e22ce" }
          ],
          accent: "#a855f7",
          label: "TiCN 碳氮化鈦紫粉色"
        };
      case "AlTiN":
        return {
          id: "altin-grad",
          stops: [
            { offset: "0%", color: "#818cf8" },
            { offset: "40%", color: "#4338ca" },
            { offset: "100%", color: "#1e1b4b" }
          ],
          accent: "#4f46e5",
          label: "AlTiN 氮化鋁鈦深黑紫"
        };
      case "DLC":
        return {
          id: "dlc-grad",
          stops: [
            { offset: "0%", color: "#52525b" },
            { offset: "50%", color: "#27272a" },
            { offset: "100%", color: "#09090b" }
          ],
          accent: "#27272a",
          label: "DLC 類鑽碳鏡面黑"
        };
      case "CrN":
        return {
          id: "crn-grad",
          stops: [
            { offset: "0%", color: "#f1f5f9" },
            { offset: "50%", color: "#94a3b8" },
            { offset: "100%", color: "#475569" }
          ],
          accent: "#64748b",
          label: "CrN 氮化鉻銀灰"
        };
      default:
        return {
          id: "steel-grad",
          stops: [
            { offset: "0%", color: "#f8fafc" },
            { offset: "40%", color: "#cbd5e1" },
            { offset: "100%", color: "#64748b" }
          ],
          accent: "#94a3b8",
          label: "原色精密微拋光"
        };
    }
  };

  const coatConfig = getCoatingGradient(coating);

  // SVG dimensions
  const svgWidth = 460;
  const svgHeight = 220;

  // Punch drawing coordinates
  const shankX = 140;
  const shankY = 65;
  const shankLength = 220;
  const shankHeight = 80;

  const headTipX = 60;
  const headTipLength = 80;
  const tipHeight = 48;

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 text-slate-100 flex flex-col items-center select-none relative overflow-hidden shadow-inner">
      {/* CAD Grid Background */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      {/* Top Spec Badges */}
      <div className="w-full flex items-center justify-between text-xs mb-1 z-10">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-sky-950 border border-sky-600/50 text-sky-400 font-mono font-semibold rounded">
            CAD-LIVE 2D 沖棒截面
          </span>
          <span className="font-mono text-slate-400">
            D{outerDiameter} × L{totalLength}mm
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-slate-800 border border-slate-600 text-amber-300 font-mono rounded">
            {material}
          </span>
          <span className="px-2 py-0.5 bg-slate-800 border border-slate-600 text-emerald-400 font-mono rounded">
            {coatConfig.label}
          </span>
        </div>
      </div>

      {/* SVG Vector Drawing */}
      <svg 
        viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
        className="w-full max-h-56 z-10 filter drop-shadow-md"
      >
        <defs>
          {/* Main Body Gradient */}
          <linearGradient id={coatConfig.id} x1="0%" y1="0%" x2="0%" y2="100%">
            {coatConfig.stops.map((s, idx) => (
              <stop key={idx} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>

          {/* Steel Shank Gradient */}
          <linearGradient id="shank-steel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="35%" stopColor="#cbd5e1" />
            <stop offset="70%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Tip Working Zone Coating Gradient */}
          <linearGradient id="tip-coating" x1="0%" y1="0%" x2="0%" y2="100%">
            {coatConfig.stops.map((s, idx) => (
              <stop key={idx} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>

        {/* Centerline (Dash dot) */}
        <line 
          x1="30" y1="105" x2="390" y2="105" 
          stroke="#38bdf8" 
          strokeWidth="1" 
          strokeDasharray="16,4,4,4" 
          opacity="0.6" 
        />

        {/* Shank clamping body (Tool Shank) */}
        <rect 
          x={shankX} 
          y={shankY} 
          width={shankLength} 
          height={shankHeight} 
          rx="2" 
          fill="url(#shank-steel)" 
          stroke="#475569" 
          strokeWidth="1.5" 
        />

        {/* Chamfer at rear end */}
        <polygon 
          points={`${shankX + shankLength},${shankY} ${shankX + shankLength + 8},${shankY + 6} ${shankX + shankLength + 8},${shankY + shankHeight - 6} ${shankX + shankLength},${shankY + shankHeight}`} 
          fill="#64748b" 
        />

        {/* Transition shoulder taper */}
        <polygon 
          points={`
            ${shankX},${shankY} 
            ${headTipX + headTipLength},${shankY + 16} 
            ${headTipX + headTipLength},${shankY + shankHeight - 16} 
            ${shankX},${shankY + shankHeight}
          `}
          fill="url(#shank-steel)" 
          stroke="#475569" 
          strokeWidth="1.5"
        />

        {/* Working Head Punch with PVD Coating */}
        <polygon 
          points={`
            ${headTipX + headTipLength},${shankY + 16} 
            ${headTipX + 15},${shankY + 16} 
            ${headTipX},${shankY + 24} 
            ${headTipX},${shankY + shankHeight - 24} 
            ${headTipX + 15},${shankY + shankHeight - 16} 
            ${headTipX + headTipLength},${shankY + shankHeight - 16}
          `}
          fill={`url(#${coatConfig.id})`}
          stroke={coatConfig.accent}
          strokeWidth="1.8"
        />

        {/* Punch Head Working Profile Detail (Left Face) */}
        <g transform={`translate(${headTipX}, ${shankY + shankHeight / 2})`}>
          {/* Profile Engraved Shape Visualizer */}
          {headProfile === "phillips" && (
            <g>
              <line x1="0" y1="-14" x2="0" y2="14" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="-10" y1="0" x2="6" y2="0" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
              {/* Cone taper */}
              <polygon points="0,-12 -6,-4 -6,4 0,12 8,6 8,-6" fill="rgba(255,255,255,0.25)" />
            </g>
          )}

          {headProfile === "torx" && (
            <g>
              {/* 6-Lobe Torx star */}
              <polygon 
                points="
                  -4,-14 2,-11 6,-14 6,-8 10,-6 6,-2 8,4 3,4 0,12 -3,4 -8,4 -6,-2 -10,-6 -6,-8
                " 
                fill="#ffffff" 
                stroke="#0f172a" 
                strokeWidth="0.8"
              />
            </g>
          )}

          {headProfile === "hex_socket" && (
            <polygon 
              points="-8,-12 4,-12 10,0 4,12 -8,12 -12,0" 
              fill="#ffffff" 
              stroke="#0f172a" 
              strokeWidth="1"
            />
          )}

          {headProfile === "pozidriv" && (
            <g>
              <line x1="0" y1="-14" x2="0" y2="14" stroke="#ffffff" strokeWidth="3" />
              <line x1="-10" y1="0" x2="6" y2="0" stroke="#ffffff" strokeWidth="3" />
              {/* 45 degree ribs */}
              <line x1="-7" y1="-7" x2="4" y2="4" stroke="#38bdf8" strokeWidth="2" />
              <line x1="-7" y1="7" x2="4" y2="-4" stroke="#38bdf8" strokeWidth="2" />
            </g>
          )}

          {headProfile === "slotted" && (
            <rect x="-8" y="-12" width="14" height="24" rx="2" fill="#ffffff" stroke="#0f172a" />
          )}

          {headProfile === "tamper_torx" && (
            <g>
              <polygon 
                points="-4,-14 2,-11 6,-14 6,-8 10,-6 6,-2 8,4 3,4 0,12 -3,4 -8,4 -6,-2 -10,-6 -6,-8" 
                fill="#ffffff" 
              />
              <circle cx="0" cy="0" r="3" fill="#ef4444" stroke="#ffffff" strokeWidth="0.5" />
            </g>
          )}

          {(headProfile === "custom" || headProfile === "square") && (
            <polygon points="-8,-8 4,-8 4,8 -8,8" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
          )}
        </g>

        {/* Laser Engraved Spec Marking on Shank */}
        <text 
          x={shankX + 45} 
          y={shankY + shankHeight / 2 - 4} 
          fill="#334155" 
          fontFamily="monospace" 
          fontSize="9" 
          fontWeight="600"
          letterSpacing="1"
        >
          FTL · {material} · {headProfile.toUpperCase()}
        </text>
        <text 
          x={shankX + 45} 
          y={shankY + shankHeight / 2 + 10} 
          fill="#475569" 
          fontFamily="monospace" 
          fontSize="8" 
          letterSpacing="0.5"
        >
          D{outerDiameter} L{totalLength} · HRC 64-66
        </text>

        {/* Technical Dimension Callouts */}
        {showDimensions && (
          <g>
            {/* Total Length (L) Dimension Line */}
            <line x1={headTipX} y1={shankY + shankHeight + 25} x2={shankX + shankLength} y2={shankY + shankHeight + 25} stroke="#38bdf8" strokeWidth="1" />
            <line x1={headTipX} y1={shankY + shankHeight + 15} x2={headTipX} y2={shankY + shankHeight + 35} stroke="#38bdf8" strokeWidth="1" />
            <line x1={shankX + shankLength} y1={shankY + shankHeight + 15} x2={shankX + shankLength} y2={shankY + shankHeight + 35} stroke="#38bdf8" strokeWidth="1" />
            <text 
              x={(headTipX + shankX + shankLength) / 2} 
              y={shankY + shankHeight + 40} 
              fill="#38bdf8" 
              fontSize="10" 
              fontFamily="monospace" 
              textAnchor="middle"
              fontWeight="600"
            >
              L = {totalLength} mm (±0.05)
            </text>

            {/* Outer Diameter (D) Dimension Callout */}
            <line x1={shankX + shankLength + 20} y1={shankY} x2={shankX + shankLength + 20} y2={shankY + shankHeight} stroke="#fbbf24" strokeWidth="1" />
            <line x1={shankX + shankLength + 10} y1={shankY} x2={shankX + shankLength + 30} y2={shankY} stroke="#fbbf24" strokeWidth="1" />
            <line x1={shankX + shankLength + 10} y1={shankY + shankHeight} x2={shankX + shankLength + 30} y2={shankY + shankHeight} stroke="#fbbf24" strokeWidth="1" />
            <text 
              x={shankX + shankLength + 35} 
              y={shankY + shankHeight / 2 + 3} 
              fill="#fbbf24" 
              fontSize="10" 
              fontFamily="monospace"
              fontWeight="600"
            >
              ØD {outerDiameter}.00 {toleranceLevel}
            </text>

            {/* Head Depth (H) Callout */}
            <line x1={headTipX} y1={shankY - 15} x2={headTipX + 15} y2={shankY - 15} stroke="#34d399" strokeWidth="1" />
            <line x1={headTipX} y1={shankY - 22} x2={headTipX} y2={shankY - 8} stroke="#34d399" strokeWidth="1" />
            <line x1={headTipX + 15} y1={shankY - 22} x2={headTipX + 15} y2={shankY - 8} stroke="#34d399" strokeWidth="1" />
            <text 
              x={headTipX + 8} 
              y={shankY - 26} 
              fill="#34d399" 
              fontSize="9" 
              fontFamily="monospace"
              textAnchor="middle"
              fontWeight="600"
            >
              H {headDepth}
            </text>

            {/* Concentricity indicator */}
            <g transform={`translate(${shankX + 220}, ${shankY - 20})`}>
              <rect x="0" y="0" width="72" height="18" fill="#1e293b" stroke="#94a3b8" strokeWidth="0.8" rx="2" />
              <text x="6" y="13" fill="#cbd5e1" fontSize="9" fontFamily="monospace">◎</text>
              <text x="20" y="13" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">{concentricity}</text>
              <text x="56" y="13" fill="#cbd5e1" fontSize="9" fontFamily="monospace">A</text>
            </g>
          </g>
        )}
      </svg>

      {/* Engineering Footer Specs */}
      <div className="w-full flex items-center justify-between border-t border-slate-800 pt-2 mt-1 text-[11px] text-slate-400 font-mono">
        <div>
          表面處理：<span className="text-slate-200 font-semibold">{coatConfig.label}</span>
        </div>
        <div>
          硬度要求：<span className="text-amber-400">HRC 64.5 ±1.0</span>
        </div>
        <div>
          端面粗糙度：<span className="text-emerald-400">Ra ≤ 0.08 μm</span>
        </div>
      </div>
    </div>
  );
};
