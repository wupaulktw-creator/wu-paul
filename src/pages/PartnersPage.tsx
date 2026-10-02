import React from "react";
import { Building2, MapPin, Users, Phone, ShieldCheck, ArrowRight } from "lucide-react";
import { repository } from "../repositories";

export const PartnersPage: React.FC = () => {
  const companies = repository.getCompanies();

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Building2 className="w-5 h-5 text-sky-400" />
          <span>產業聚落協同夥伴 (Eco-System Partners)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          高雄岡山螺絲產業聚落與本洲精密模具園區數位鏈結
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companies.map((comp) => (
          <div key={comp.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-bold">
                  {comp.code}
                </span>
                <h3 className="font-bold text-white text-base">{comp.name}</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {comp.type === "screw_manufacturer" ? "螺絲製造廠 (買方)" : "模具沖棒製造廠 (賣方)"}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{comp.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{comp.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>數位憑證認證合格 · 專用通道已加密連線</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 text-xs text-slate-400 flex items-center justify-between">
              <span>雙方協同中工單: 3 筆</span>
              <span className="text-sky-400 font-bold">即時連線中</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
