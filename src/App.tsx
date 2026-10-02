import React, { useState, useEffect, useCallback } from "react";
import { 
  Role, 
  MachinePunchState, 
  OrderItem, 
  ChatMessage, 
  DefectTicket, 
  OrderStage 
} from "./types";
import { STAGE_CONFIGS } from "./mockData";
import { repository } from "./repositories";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ShopfloorMonitor } from "./components/ShopfloorMonitor";
import { OrderKanban } from "./components/OrderKanban";
import { ChatCollaboration } from "./components/ChatCollaboration";
import { AiIndustrialAdvisor } from "./components/AiIndustrialAdvisor";
import { DefectsView } from "./components/DefectsView";
import { SpecConfiguratorModal } from "./components/SpecConfiguratorModal";
import { DefectReportModal } from "./components/DefectReportModal";
import { GlobalSearchModal } from "./components/GlobalSearchModal";
import { QrScannerModal } from "./components/QrScannerModal";

// V2 Pages
import { DashboardPage } from "./pages/DashboardPage";
import { JobDetailPage } from "./pages/JobDetailPage";
import { PunchPassportPage } from "./pages/PunchPassportPage";
import { JobsPage } from "./pages/JobsPage";
import { DrawingsPage } from "./pages/DrawingsPage";
import { AIPage } from "./pages/AIPage";
import { QualityPage } from "./pages/QualityPage";
import { RfqsQuotesPage } from "./pages/RfqsQuotesPage";
import { AuditLogPage } from "./pages/AuditLogPage";
import { PartnersPage } from "./pages/PartnersPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { DesktopModePage } from "./pages/DesktopModePage";
import { OfflineIndicator } from "./components/OfflineIndicator";

import { 
  Bell, 
  Zap, 
  AlertTriangle, 
  Briefcase,
  Layers,
  ArrowRight,
  RotateCcw
} from "lucide-react";

export default function App() {
  // Current active persona
  const [currentRole, setCurrentRole] = useState<Role>(() => repository.getCurrentRole());
  
  // Navigation view state
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [selectedJobId, setSelectedJobId] = useState<string>("JOB-2026-00882");
  const [selectedPunchId, setSelectedPunchId] = useState<string>("P-2026-003921");
  const [selectedDrawingId, setSelectedDrawingId] = useState<string>("DWG-2026-00882");

  // Core domain states with Repository persistence
  const [machines, setMachines] = useState<MachinePunchState[]>(() => repository.getMachinePunchStates());
  const [orders, setOrders] = useState<OrderItem[]>(() => repository.getOrders());
  const [messages, setMessages] = useState<ChatMessage[]>(() => repository.getMessages());
  const [defects, setDefects] = useState<DefectTicket[]>(() => {
    // Transform NCRs to defect tickets for backwards compatibility
    const ncrs = repository.getNCRs();
    return ncrs.map((n) => ({
      id: n.id,
      reportedAt: n.createdAt,
      machineId: n.machineId || "HM-01",
      punchSpec: n.punchId || "二衝成型",
      defectType: n.defectType as any,
      hitsAtFailure: n.hitsAtFailure || 31280,
      expectedHits: n.expectedHits || 50000,
      screwMaterial: "SCM435",
      description: n.description,
      status: (n.status === "open" ? "investigating" : n.status === "root_cause_identified" ? "root_cause_identified" : "remake_dispatched") as any,
      analysisSummary: n.containmentAction
    }));
  });

  // Modal controls
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [configuratorInitials, setConfiguratorInitials] = useState<any>(null);
  const [isDefectModalOpen, setIsDefectModalOpen] = useState(false);
  const [selectedMachineForDefect, setSelectedMachineForDefect] = useState<MachinePunchState | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  // Live Toast Notification
  const [notification, setNotification] = useState<{
    id: string;
    text: string;
    type: "info" | "warning" | "success" | "critical";
  } | null>(null);

  const showToast = useCallback((text: string, type: "info" | "warning" | "success" | "critical" = "info") => {
    const id = Date.now().toString();
    setNotification({ id, text, type });
    setTimeout(() => {
      setNotification((cur) => (cur?.id === id ? null : cur));
    }, 4500);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sync to repository
  useEffect(() => {
    repository.saveMachinePunchStates(machines);
  }, [machines]);

  useEffect(() => {
    repository.saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    repository.saveMessages(messages);
  }, [messages]);

  // Update machine hits
  const handleUpdateMachineHits = (machineId: string, newHits: number) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.machineId !== machineId) return m;

        const health = Math.max(0, Math.round(((m.expectedLifeHits - newHits) / m.expectedLifeHits) * 100));
        let status = m.status;
        if (health <= 5) status = "critical";
        else if (health <= 15) status = "warning";
        else status = "running";

        return {
          ...m,
          currentHits: newHits,
          healthPercent: health,
          status
        };
      })
    );
  };

  // Reset machine punch
  const handleResetMachinePunch = (machineId: string) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.machineId !== machineId) return m;
        return {
          ...m,
          currentHits: 0,
          healthPercent: 100,
          status: "running",
          lastChangedDate: new Date().toISOString().split("T")[0]
        };
      })
    );
    showToast(`機台 ${machineId} 沖棒已完成換刀，打擊次數重設為 0！`, "success");
  };

  // Trigger re-order
  const handleTriggerReorder = (machine: MachinePunchState) => {
    setConfiguratorInitials({
      machineId: machine.machineId,
      screwSpec: machine.screwSpec,
      urgency: machine.status === "critical" ? "rush_critical" : "urgent",
      headProfile: machine.punchSpec.includes("Torx") ? "torx" : machine.punchSpec.includes("Hex") ? "hex_socket" : "phillips"
    });
    setIsConfiguratorOpen(true);
  };

  // Report defect
  const handleReportDefect = (machine: MachinePunchState) => {
    setSelectedMachineForDefect(machine);
    setIsDefectModalOpen(true);
  };

  // Submit new order from configurator
  const handleSubmitNewOrder = (newOrderData: Partial<OrderItem>) => {
    const orderNumber = `FTL-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${Math.floor(Math.random() * 90 + 10)}`;
    const newOrder: OrderItem = {
      id: `ORD-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toLocaleString("zh-TW", { hour12: false }),
      requiredDeliveryDate: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
      screwFactoryName: "長宏精密螺絲工業 (岡山廠)",
      moldFactoryName: "精耐特精密沖棒模具廠 (本洲工業區)",
      urgency: newOrderData.urgency || "normal",
      punchType: newOrderData.punchType || "second_punch",
      headProfile: newOrderData.headProfile || "torx",
      material: newOrderData.material || "ASP-23",
      coating: newOrderData.coating || "AlTiN",
      outerDiameter: newOrderData.outerDiameter || 14,
      totalLength: newOrderData.totalLength || 45,
      headDepth: newOrderData.headDepth || 1.4,
      concentricity: newOrderData.concentricity || 0.002,
      toleranceLevel: newOrderData.toleranceLevel || "±0.002mm",
      targetScrewStandard: newOrderData.targetScrewStandard || "DIN 7981",
      quantity: newOrderData.quantity || 20,
      unitPrice: newOrderData.unitPrice || 900,
      totalAmount: newOrderData.totalAmount || 18000,
      currentStage: "rfq_pending",
      stageProgressPercent: 10,
      cadDrawingNumber: newOrderData.cadDrawingNumber || "CAD-CUSTOM.dwg",
      notes: newOrderData.notes || ""
    };

    setOrders([newOrder, ...orders]);
    repository.createRFQ({
      targetPartName: `${newOrder.headProfile.toUpperCase()} ${newOrder.material} 沖棒`,
      requestedQuantity: newOrder.quantity,
      requestedDeliveryDate: newOrder.requiredDeliveryDate,
      urgency: newOrder.urgency
    });

    showToast(`新詢價單【${orderNumber}】已即時同步發送至模具廠生管看板！`, "success");

    // Chat notification
    const autoMsg = repository.sendMessage({
      content: `【即時新單】已發出沖棒詢價單 ${orderNumber} (${newOrder.quantity} 支 ${newOrder.headProfile.toUpperCase()} ${newOrder.material} ${newOrder.coating})，需求交期: ${newOrder.requiredDeliveryDate}。`,
      orderId: newOrder.id,
      attachmentType: "punch_spec",
      attachmentData: {
        title: `工單 ${orderNumber}`,
        badge: newOrder.urgency === "rush_critical" ? "特急單" : "新單",
        details: `外徑 D${newOrder.outerDiameter} L${newOrder.totalLength} · 同心度 ${newOrder.toleranceLevel}`
      }
    });
    setMessages((prev) => [...prev, autoMsg]);
  };

  // Advance stage
  const handleAdvanceStage = (orderId: string, nextStage: OrderStage) => {
    const stageMeta = STAGE_CONFIGS[nextStage];
    const totalStages = Object.keys(STAGE_CONFIGS).length;
    const nextPercent = Math.min(100, Math.round((stageMeta.step / totalStages) * 100));

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          currentStage: nextStage,
          stageProgressPercent: nextPercent
        };
      })
    );

    showToast(`工單已成功推進至第 ${stageMeta.step} 站：【${stageMeta.label}】(${stageMeta.dept})！`, "info");

    const orderObj = orders.find((o) => o.id === orderId);
    if (orderObj) {
      const stageNotice = repository.sendMessage({
        senderRole: "mold_factory",
        senderName: "生管派工系統 (精耐特)",
        content: `【進度更新】工單 ${orderObj.orderNumber} 沖棒已加工至第 ${stageMeta.step} 站：【${stageMeta.label}】，目前總進度 ${nextPercent}%。`,
        orderId
      });
      setMessages((prev) => [...prev, stageNotice]);
    }
  };

  // Send message
  const handleSendMessage = (content: string, attachmentType?: any, attachmentData?: any) => {
    const newMsg = repository.sendMessage({
      content,
      attachmentType,
      attachmentData
    });
    setMessages((prev) => [...prev, newMsg]);

    if (currentRole === "screw_factory") {
      setTimeout(() => {
        const autoReply = repository.sendMessage({
          senderRole: "mold_factory",
          senderName: "精耐特蔡廠長",
          content: "收到長宏生管通知！我們現場工程師與機台已經同步鎖定此規格，進度如有變更將即時在此看板更新！"
        });
        setMessages((prev) => [...prev, autoReply]);
      }, 1500);
    }
  };

  // Submit defect
  const handleSubmitDefect = (newDefect: Partial<DefectTicket>) => {
    const createdNcr = repository.createNCR({
      machineId: newDefect.machineId || "HM-01",
      punchId: "P-2026-003921",
      defectType: newDefect.defectType as any,
      hitsAtFailure: newDefect.hitsAtFailure || 0,
      expectedHits: newDefect.expectedHits || 50000,
      description: newDefect.description || "沖棒微崩刃異常",
      containmentAction: "停機換備刀並隔離不良品"
    });

    const ticket: DefectTicket = {
      id: createdNcr.ncrNumber,
      reportedAt: createdNcr.createdAt,
      machineId: createdNcr.machineId || "HM-01",
      punchSpec: createdNcr.punchId || "二衝",
      defectType: createdNcr.defectType as any,
      hitsAtFailure: createdNcr.hitsAtFailure || 0,
      expectedHits: createdNcr.expectedHits || 50000,
      screwMaterial: "SCM435",
      description: createdNcr.description,
      status: "investigating",
      analysisSummary: "已啟動精耐特品保課顯微硬度與金相分析，預計 2 小時內回傳 RCA 結論。"
    };

    setDefects([ticket, ...defects]);
    showToast(`品質異常單【${ticket.id}】已成功開立並連動 NCR 系統！`, "warning");

    const defectMsg = repository.sendMessage({
      content: `【品質異常通報】機台 ${ticket.machineId} 掛載沖棒於 ${ticket.hitsAtFailure.toLocaleString()} 衝時發生【${ticket.defectType}】，現場相片與描述已建檔，請協助分析。`,
      attachmentType: "defect_photo",
      attachmentData: {
        title: `異常工單 ${ticket.id}`,
        badge: "緊急判定",
        details: ticket.description
      }
    });
    setMessages((prev) => [...prev, defectMsg]);
  };

  // Update defect status
  const handleUpdateDefectStatus = (defectId: string, newStatus: DefectTicket["status"]) => {
    setDefects((prev) =>
      prev.map((d) => {
        if (d.id !== defectId) return d;
        let updateSummary = d.analysisSummary;
        if (newStatus === "root_cause_identified") {
          updateSummary = "經顯微鏡 100X 檢測，確認主要為鍛打高溫熱疲勞導致微剝落，建議下批全面改用 AlTiN 紫黑耐熱鍍膜並放大內角 R0.12mm。";
        } else if (newStatus === "remake_dispatched") {
          updateSummary = "已由精耐特急件專車派送 10 支同規格備料前往長宏岡山廠。";
        }
        return {
          ...d,
          status: newStatus,
          analysisSummary: updateSummary
        };
      })
    );
    showToast(`異常單 ${defectId} 處理狀態已更新！`, "info");
  };

  // One-click Seed Demo Scenario
  const handleTriggerSeedDemo = () => {
    repository.resetToSeedScenario();
    setMachines(repository.getMachinePunchStates());
    setOrders(repository.getOrders());
    setMessages(repository.getMessages());
    setSelectedJobId("JOB-2026-00882");
    setSelectedPunchId("P-2026-003921");
    setSelectedDrawingId("DWG-2026-00882");
    setActiveView("job_detail");
    showToast("已成功重置並載入【特斯拉 M8 Torx 特急沖棒】全流程示範情境！", "success");
  };

  // Navigation handler
  const handleNavigate = (view: string, id?: string) => {
    if (view === "job_detail") {
      if (id) setSelectedJobId(id);
      setActiveView("job_detail");
    } else if (view === "passport") {
      if (id) setSelectedPunchId(id);
      setActiveView("passport");
    } else if (view === "drawings") {
      if (id) setSelectedDrawingId(id);
      setActiveView("drawings");
    } else if (view === "ncr") {
      setActiveView("ncr");
    } else {
      setActiveView(view);
    }
  };

  const criticalMachines = machines.filter((m) => m.status === "critical").length;
  const warningMachines = machines.filter((m) => m.status === "warning").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-16 right-4 z-50 animate-in slide-in-from-top-4 duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 text-xs font-medium ${
            notification.type === "critical"
              ? "bg-rose-950 border-rose-500 text-rose-200 shadow-rose-950/50"
              : notification.type === "warning"
              ? "bg-amber-950 border-amber-500 text-amber-200 shadow-amber-950/50"
              : notification.type === "success"
              ? "bg-emerald-950 border-emerald-500 text-emerald-200 shadow-emerald-950/50"
              : "bg-slate-900 border-sky-500 text-sky-200 shadow-sky-950/50"
          }`}>
            <Bell className="w-4 h-4 shrink-0 animate-bounce" />
            <span>{notification.text}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        currentRole={currentRole}
        onSwitchRole={(r) => {
          setCurrentRole(r);
          repository.setCurrentRole(r);
          showToast(`已切換操作身分至：【${r === "screw_factory" ? "長宏精密螺絲廠 (買方)" : "精耐特沖棒模具廠 (賣方)"}】`, "info");
        }}
        activeTab={activeView}
        onSelectTab={setActiveView}
        onOpenNewOrder={() => {
          setConfiguratorInitials(null);
          setIsConfiguratorOpen(true);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenQrScanner={() => setIsQrScannerOpen(true)}
        onTriggerSeedDemo={handleTriggerSeedDemo}
        onOpenDesktopMode={() => setActiveView("desktop_mode")}
        warningCount={warningMachines}
        criticalCount={criticalMachines}
        totalActiveOrders={orders.length}
      />

      {/* Layout Body: Sidebar + Main Content Area */}
      <div className="flex-1 flex w-full">
        <Sidebar
          activeView={activeView}
          onSelectView={setActiveView}
          criticalMachineCount={criticalMachines}
          activeJobCount={repository.getJobs().length}
          pendingRfqCount={repository.getRFQs().filter((r) => r.status === "submitted").length}
          ncrCount={repository.getNCRs().filter((n) => n.status !== "closed").length}
        />

        {/* Center Main View Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Urgent Alert Banner if HM-03 critical */}
          {criticalMachines > 0 && activeView === "dashboard" && (
            <div className="mb-5 bg-rose-950/80 border border-rose-500/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-rose-950/40 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-rose-300 mr-2">【緊急停機警戒】</span>
                  <span className="text-slate-200">
                    高速打頭機 #03 (HM-03) 梅花 T6 沖棒已達 28,900 衝（剩餘壽命 3.7%），需立即換針避免斷針崩牙！
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  const targetM = machines.find((m) => m.machineId === "HM-03");
                  if (targetM) handleTriggerReorder(targetM);
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold whitespace-nowrap shadow transition-colors flex items-center gap-1.5 self-end sm:self-auto"
              >
                <Zap className="w-3.5 h-3.5" />
                向模具廠發出特急件叫料
              </button>
            </div>
          )}

          {/* 1. Dashboard */}
          {activeView === "dashboard" && (
            <DashboardPage
              onNavigate={handleNavigate}
              onOpenNewOrder={() => setIsConfiguratorOpen(true)}
              onTriggerSeedDemo={handleTriggerSeedDemo}
            />
          )}

          {/* 2. Job Detail */}
          {activeView === "job_detail" && (
            <JobDetailPage
              jobId={selectedJobId}
              onBack={() => setActiveView("jobs")}
              onNavigateToPunch={(pId) => {
                setSelectedPunchId(pId);
                setActiveView("passport");
              }}
              onNavigateToDrawing={(dId) => {
                setSelectedDrawingId(dId);
                setActiveView("drawings");
              }}
            />
          )}

          {/* 3. Jobs List */}
          {activeView === "jobs" && (
            <JobsPage
              onSelectJob={(jId) => {
                setSelectedJobId(jId);
                setActiveView("job_detail");
              }}
              onOpenNewJob={() => setIsConfiguratorOpen(true)}
            />
          )}

          {/* 4. Punch Digital Passport */}
          {activeView === "passport" && (
            <PunchPassportPage
              punchId={selectedPunchId}
              onBack={() => setActiveView("dashboard")}
              onNavigateToJob={(jId) => {
                setSelectedJobId(jId);
                setActiveView("job_detail");
              }}
            />
          )}

          {/* 5. Punches List */}
          {activeView === "punches" && (
            <PunchPassportPage
              punchId={selectedPunchId}
              onBack={() => setActiveView("dashboard")}
              onNavigateToJob={(jId) => {
                setSelectedJobId(jId);
                setActiveView("job_detail");
              }}
            />
          )}

          {/* 6. Drawings Center */}
          {activeView === "drawings" && (
            <DrawingsPage
              initialDrawingId={selectedDrawingId}
              onNavigateToJob={(jId) => {
                setSelectedJobId(jId);
                setActiveView("job_detail");
              }}
            />
          )}

          {/* 7. RFQ & Quotes */}
          {(activeView === "rfqs" || activeView === "quotes") && (
            <RfqsQuotesPage
              initialTab={activeView === "rfqs" ? "rfqs" : "quotes"}
              onOpenNewRfq={() => setIsConfiguratorOpen(true)}
              onNavigateToJob={(jId) => {
                setSelectedJobId(jId);
                setActiveView("job_detail");
              }}
            />
          )}

          {/* 8. Quality Center */}
          {(activeView === "qc" || activeView === "ncr" || activeView === "eight_d" || activeView === "traceability") && (
            <QualityPage
              onNavigateToJob={(jId) => {
                setSelectedJobId(jId);
                setActiveView("job_detail");
              }}
              onNavigateToPunch={(pId) => {
                setSelectedPunchId(pId);
                setActiveView("passport");
              }}
            />
          )}

          {/* 9. AI Industrial Engine */}
          {(activeView === "ai_advisor" || activeView === "ai_drawing" || activeView === "ai_punch" || activeView === "ai_failure" || activeView === "ai_risk") && (
            <AIPage
              initialTool={
                activeView === "ai_drawing"
                  ? "drawing"
                  : activeView === "ai_punch"
                  ? "punch"
                  : activeView === "ai_failure"
                  ? "failure"
                  : activeView === "ai_risk"
                  ? "risk"
                  : "advisor"
              }
              onNavigateToNCR={() => setActiveView("ncr")}
              onNavigateToJob={(jId) => {
                setSelectedJobId(jId);
                setActiveView("job_detail");
              }}
            />
          )}

          {/* 10. Existing Shopfloor Monitor */}
          {(activeView === "shopfloor" || activeView === "machines") && (
            <ShopfloorMonitor
              machines={machines}
              onUpdateMachineHits={handleUpdateMachineHits}
              onResetMachinePunch={handleResetMachinePunch}
              onTriggerReorder={handleTriggerReorder}
              onReportDefect={handleReportDefect}
              currentRole={currentRole}
            />
          )}

          {/* 11. Existing Production Kanban */}
          {(activeView === "production_board" || activeView === "schedule" || activeView === "orders") && (
            <OrderKanban
              orders={orders}
              onAdvanceStage={handleAdvanceStage}
              onOpenChatWithOrder={() => setActiveView("messages")}
              currentRole={currentRole}
            />
          )}

          {/* 12. Existing Chat Collaboration */}
          {activeView === "messages" && (
            <ChatCollaboration
              messages={messages}
              onSendMessage={handleSendMessage}
              currentRole={currentRole}
              orders={orders}
            />
          )}

          {/* 13. Partners */}
          {activeView === "customers" && <PartnersPage />}

          {/* 14. Analytics */}
          {activeView === "analytics" && <AnalyticsPage />}

          {/* 15. Audit Log */}
          {activeView === "audit_log" && <AuditLogPage />}

          {/* 16. Fallbacks for other nav items */}
          {activeView === "my_tasks" && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white">待辦派工任務清單 (My Tasks)</h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-white">審核 CAD-2026-M8-T40 Rev.B 圖面</strong>
                    <div className="text-slate-400">長宏螺絲研發技術部提出成型頭深放大 0.20mm</div>
                  </div>
                  <button onClick={() => setActiveView("drawings")} className="px-3 py-1 bg-sky-600 text-white rounded-lg font-bold">
                    立即審核
                  </button>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-white">HM-03 梅花 T6 沖棒臨界換刀</strong>
                    <div className="text-slate-400">已達 28,900 衝，預約模具廠專車提件</div>
                  </div>
                  <button onClick={() => setActiveView("passport")} className="px-3 py-1 bg-amber-600 text-white rounded-lg font-bold">
                    調閱沖棒
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeView === "notifications" && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white">即時通知預警中心 (Notification Center)</h3>
              <div className="space-y-2 text-xs">
                {repository.getNotifications().map((n) => (
                  <div key={n.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-200">{n.title}</div>
                      <div className="text-slate-400">{n.message}</div>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500">{n.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === "settings" && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white">系統權限與整合設定 (Settings & Integration)</h3>
              <div className="text-xs text-slate-300 space-y-2">
                <p>· 租戶隔離：已啟用 Multi-Tenant 資料架構 (長宏 COMP-01 / 精耐特 COMP-02)</p>
                <p>· Gemini AI 引擎模型：gemini-3.8-flash (伺服器代理模式)</p>
                <p>· 權限機制：RBAC (生管、現場操作員、模具師傅、品保課長)</p>
                <p>· 離線桌面端：支援 PWA 獨立視窗與 Node.js 本機離線邊緣運行</p>
              </div>
            </div>
          )}

          {activeView === "desktop_mode" && (
            <DesktopModePage
              onNavigateToPassport={(punchId) => {
                setSelectedPunchId(punchId);
                setActiveView("passport");
              }}
              onNavigateToJob={(jobId) => {
                setSelectedJobId(jobId);
                setActiveView("job_detail");
              }}
            />
          )}
        </main>
      </div>

      {/* Offline connectivity status banner */}
      <OfflineIndicator />

      {/* Modals */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onScanSuccess={(pId) => {
          setSelectedPunchId(pId);
          setActiveView("passport");
          showToast(`已成功掃描載入沖棒 ${pId} 數位履歷！`, "success");
        }}
      />

      <SpecConfiguratorModal
        isOpen={isConfiguratorOpen}
        onClose={() => setIsConfiguratorOpen(false)}
        onSubmitOrder={handleSubmitNewOrder}
        initialValues={configuratorInitials}
      />

      <DefectReportModal
        isOpen={isDefectModalOpen}
        onClose={() => setIsDefectModalOpen(false)}
        machine={selectedMachineForDefect}
        onSubmitDefect={handleSubmitDefect}
      />
    </div>
  );
}
