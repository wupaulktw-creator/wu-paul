import React, { useState } from "react";
import { ChatMessage, Role, OrderItem } from "../types";
import { 
  Send, 
  Paperclip, 
  MessageSquare, 
  FileText, 
  Image as ImageIcon, 
  CheckCheck, 
  Factory, 
  Wrench,
  Bot
} from "lucide-react";

interface ChatCollaborationProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, attachmentType?: any, attachmentData?: any) => void;
  currentRole: Role;
  orders: OrderItem[];
}

export const ChatCollaboration: React.FC<ChatCollaborationProps> = ({
  messages,
  onSendMessage,
  currentRole,
  orders
}) => {
  const [inputText, setInputText] = useState("");
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    let attachType: any = undefined;
    let attachData: any = undefined;

    if (selectedAttachment === "drawing") {
      attachType = "drawing";
      attachData = {
        title: "CAD-2026-Torx-T6-Rev3.dwg",
        badge: "工程圖面",
        details: "頭型修正: R0.08mm 倒角強化 | 同心度 0.002mm"
      };
    } else if (selectedAttachment === "defect_photo") {
      attachType = "defect_photo";
      attachData = {
        title: "機台實拍：打頭崩刃高倍放大相片 (80X)",
        badge: "現場照片",
        details: "成型部微裂紋 | 累計 31,000 衝次"
      };
    } else if (selectedAttachment === "qc_report") {
      attachType = "qc_report";
      attachData = {
        title: "三次元量測與 PVD 檢驗出廠報告",
        badge: "品保認證",
        details: "硬度 HRC 65.2 | 外徑 Ø14.000 (-0.001) | 全檢合格"
      };
    }

    onSendMessage(inputText, attachType, attachData);
    setInputText("");
    setSelectedAttachment(null);
  };

  const quickResponses = [
    "請問這批 ASP-23 十字二衝出爐了嗎？機台準備換線！",
    "PVD 鍍膜完成，已全數通過投影儀檢驗，正在派專車送達！",
    "同心度請務必控制在 0.002mm 內，避免打不鏽鋼時跳動。",
    "收到現場磨損相片，建議改為 AlTiN 紫黑耐熱鍍膜並做微導角。"
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-[620px]">
      {/* Chat Room Top Bar */}
      <div className="bg-slate-850 border-b border-slate-800 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              長宏螺絲廠 ⟷ 精耐特沖棒模具廠 · 即時工程協同頻道
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h3>
            <p className="text-[11px] text-slate-400">
              即時傳遞圖面、公差標註、鍍膜出爐通知與現場異常回饋
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          目前身分：
          <span className={`ml-1 font-bold ${currentRole === "screw_factory" ? "text-sky-400" : "text-amber-400"}`}>
            {currentRole === "screw_factory" ? "螺絲廠 (長宏生管)" : "模具廠 (精耐特廠長)"}
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/40">
        {messages.map((msg) => {
          const isMyMessage = msg.senderRole === currentRole;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMyMessage ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-2 mb-1 text-[11px]">
                <span className={`font-semibold flex items-center gap-1 ${
                  msg.senderRole === "screw_factory" ? "text-sky-400" : "text-amber-400"
                }`}>
                  {msg.senderRole === "screw_factory" ? (
                    <Factory className="w-3 h-3" />
                  ) : (
                    <Wrench className="w-3 h-3" />
                  )}
                  {msg.senderName}
                </span>
                <span className="text-slate-500 font-mono">{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-md leading-relaxed ${
                  isMyMessage
                    ? "bg-sky-600 text-white rounded-br-xs"
                    : "bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-xs"
                }`}
              >
                {msg.content}

                {/* Attachment Box if any */}
                {msg.attachmentData && (
                  <div className={`mt-2.5 p-2.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                    isMyMessage 
                      ? "bg-sky-700/60 border-sky-400/40 text-sky-100" 
                      : "bg-slate-900 border-slate-700 text-slate-300"
                  }`}>
                    <div className="p-1.5 rounded bg-slate-800/80 shrink-0 text-amber-300">
                      {msg.attachmentType === "drawing" && <FileText className="w-4 h-4" />}
                      {msg.attachmentType === "defect_photo" && <ImageIcon className="w-4 h-4" />}
                      {msg.attachmentType === "qc_report" && <CheckCheck className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 font-semibold">
                        <span className="truncate">{msg.attachmentData.title}</span>
                        {msg.attachmentData.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-black/40 rounded border border-white/20 font-mono">
                            {msg.attachmentData.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] opacity-80 mt-0.5">
                        {msg.attachmentData.details}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-slate-850/60 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-500 whitespace-nowrap">常用快捷語：</span>
        {quickResponses.map((qr, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setInputText(qr)}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 whitespace-nowrap transition-colors"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Attachment selector */}
      {selectedAttachment && (
        <div className="px-4 py-1.5 bg-sky-950/60 border-t border-sky-800/60 flex items-center justify-between text-xs text-sky-300">
          <span className="flex items-center gap-1.5">
            <Paperclip className="w-3.5 h-3.5" />
            已附加：{selectedAttachment === "drawing" ? "CAD 圖面檔案" : selectedAttachment === "defect_photo" ? "崩刃顯微照片" : "三次元 QC 檢驗報告"}
          </span>
          <button
            onClick={() => setSelectedAttachment(null)}
            className="text-slate-400 hover:text-white text-xs"
          >
            取消
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-slate-850 border-t border-slate-800 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSelectedAttachment(selectedAttachment === "drawing" ? null : "drawing")}
            className={`p-2 rounded-lg border transition-colors ${
              selectedAttachment === "drawing"
                ? "bg-sky-900 border-sky-500 text-sky-300"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
            title="附加 CAD 工程圖紙"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setSelectedAttachment(selectedAttachment === "defect_photo" ? null : "defect_photo")}
            className={`p-2 rounded-lg border transition-colors ${
              selectedAttachment === "defect_photo"
                ? "bg-sky-900 border-sky-500 text-sky-300"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
            title="附加現場磨損照片"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setSelectedAttachment(selectedAttachment === "qc_report" ? null : "qc_report")}
            className={`p-2 rounded-lg border transition-colors ${
              selectedAttachment === "qc_report"
                ? "bg-sky-900 border-sky-500 text-sky-300"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
            title="附加 QC 檢驗數據"
          >
            <CheckCheck className="w-4 h-4" />
          </button>
        </div>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`以【${currentRole === "screw_factory" ? "螺絲廠生管" : "模具廠工程師"}】身分發送即時訊息...`}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          傳送
        </button>
      </form>
    </div>
  );
};
