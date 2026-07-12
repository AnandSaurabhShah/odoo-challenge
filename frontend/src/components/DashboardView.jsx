import React from "react";
import {
  Boxes,
  Wrench,
  ArrowLeftRight,
  ClipboardCheck,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  PlusCircle,
  CalendarRange,
  Clock,
  Check,
  X,
} from "lucide-react";

export default function DashboardView({
  currentUser,
  assets,
  transfers,
  audits,
  maintenance,
  onQuickAction,
  onApproveTransfer,
  onRejectTransfer,
}) {
  // Compute Stats
  const totalAssetsCount = assets.length;
  const totalAssetsValue = assets.reduce(
    (sum, item) => sum + item.purchaseValue,
    0,
  );
  const inMaintenanceCount = assets.filter(
    (item) => item.status === "In Maintenance",
  ).length;
  const allocatedCount = assets.filter(
    (item) => item.status === "Allocated",
  ).length;
  const pendingTransfers = transfers.filter((t) => t.status === "Pending");
  const activeAudits = audits.filter((a) => a.status === "Active");
  const criticalMaintenance = maintenance.filter(
    (m) => m.priority === "High" && m.status !== "Completed",
  );

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1
            id="dashboard-welcome"
            className="text-2xl font-bold text-white tracking-tight"
          >
            Welcome Back, {currentUser.name}
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Role:{" "}
            <span className="text-blue-400 font-semibold">
              {currentUser.role}
            </span>{" "}
            &bull; Department:{" "}
            <span className="text-blue-400 font-semibold">
              {currentUser.department}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/60">
            System Status:{" "}
            <span className="text-emerald-400 font-bold">Synchronized</span>
          </span>
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/60">
            Node Zone: <span className="text-blue-400 font-bold">HQ-WEST</span>
          </span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Portfolio Value */}
        <div
          id="stat-card-total"
          className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-2xl relative overflow-hidden shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Portfolio Value
              </span>
              <h3 className="text-2xl font-bold text-white mt-1.5">
                ${totalAssetsValue.toLocaleString()}
              </h3>
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-2">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+4.2% Growth (Q3)</span>
              </p>
            </div>
            <div className="p-3 bg-blue-600/15 text-blue-400 rounded-xl border border-blue-500/10">
              <Boxes className="h-5 w-5" />
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-blue-500"></div>
        </div>

        {/* Assets Monitored */}
        <div
          id="stat-card-monitored"
          className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-2xl relative overflow-hidden shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Monitored Assets
              </span>
              <h3 className="text-2xl font-bold text-white mt-1.5">
                {totalAssetsCount} Units
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                <span className="text-blue-400 font-semibold">
                  {allocatedCount}
                </span>{" "}
                active allocations
              </p>
            </div>
            <div className="p-3 bg-emerald-600/15 text-emerald-400 rounded-xl border border-emerald-500/10">
              <Check className="h-5 w-5" />
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-emerald-500"></div>
        </div>

        {/* Under Maintenance */}
        <div
          id="stat-card-maintenance"
          className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-2xl relative overflow-hidden shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                In Maintenance
              </span>
              <h3 className="text-2xl font-bold text-amber-400 mt-1.5">
                {inMaintenanceCount} Units
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                <span className="text-amber-400 font-semibold">
                  {criticalMaintenance.length}
                </span>{" "}
                high priority logs
              </p>
            </div>
            <div className="p-3 bg-amber-600/15 text-amber-400 rounded-xl border border-amber-500/10">
              <Wrench className="h-5 w-5" />
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-amber-400"></div>
        </div>

        {/* Transfer Action Items */}
        <div
          id="stat-card-transfers"
          className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-2xl relative overflow-hidden shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Pending Action Items
              </span>
              <h3 className="text-2xl font-bold text-rose-400 mt-1.5">
                {pendingTransfers.length} Requests
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Requires managerial approval
              </p>
            </div>
            <div className="p-3 bg-rose-600/15 text-rose-400 rounded-xl border border-rose-500/10">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-rose-500"></div>
        </div>
      </div>

      {/* Critical System Warnings Alert */}
      {criticalMaintenance.length > 0 && (
        <div
          id="dashboard-critical-warning"
          className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl flex items-start gap-3"
        >
          <ShieldAlert className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-rose-200">
              Critical Maintenance Alerts Detected
            </h4>
            <p className="text-xs text-rose-300/80 mt-1">
              There are {criticalMaintenance.length} critical fleet or machinery
              assets flagged with High-Priority issues. Technicians are advised
              to review the Maintenance Kanban Board.
            </p>
          </div>
        </div>
      )}

      {/* Quick Launch Panel */}
      <div
        id="quick-launch-section"
        className="bg-slate-800/30 border border-slate-800 p-6 rounded-2xl"
      >
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <PlusCircle className="h-4.5 w-4.5 text-blue-500" />
          Enterprise Quick Actions Shortcuts
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            id="action-register"
            onClick={() => onQuickAction("directory")}
            className="flex flex-col items-center justify-center p-4 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/40 rounded-xl transition-all group hover:scale-[1.02]"
          >
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg mb-2.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Boxes className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-white">
              Register Asset
            </span>
            <span className="text-[10px] text-slate-500 mt-1">
              Add new hardware
            </span>
          </button>

          <button
            id="action-transfer"
            onClick={() => onQuickAction("allocation")}
            className="flex flex-col items-center justify-center p-4 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/40 rounded-xl transition-all group hover:scale-[1.02]"
          >
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg mb-2.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-white">
              Allocate / Transfer
            </span>
            <span className="text-[10px] text-slate-500 mt-1">
              Reassign department
            </span>
          </button>

          <button
            id="action-maintenance"
            onClick={() => onQuickAction("maintenance")}
            className="flex flex-col items-center justify-center p-4 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/40 rounded-xl transition-all group hover:scale-[1.02]"
          >
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg mb-2.5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Wrench className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-white">
              Maintenance Log
            </span>
            <span className="text-[10px] text-slate-500 mt-1">
              File work request
            </span>
          </button>

          <button
            id="action-booking"
            onClick={() => onQuickAction("booking")}
            className="flex flex-col items-center justify-center p-4 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/40 rounded-xl transition-all group hover:scale-[1.02]"
          >
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg mb-2.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CalendarRange className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-white">
              Book Resource
            </span>
            <span className="text-[10px] text-slate-500 mt-1">
              Reserve shared asset
            </span>
          </button>

          <button
            id="action-audit"
            onClick={() => onQuickAction("audit")}
            className="flex flex-col items-center justify-center p-4 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/40 rounded-xl transition-all col-span-2 sm:col-span-1 group hover:scale-[1.02]"
          >
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg mb-2.5 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-white">
              Launch Audit
            </span>
            <span className="text-[10px] text-slate-500 mt-1">
              Trigger compliance
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Splitted Widget Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Interactive Direct Transfer Approvals */}
        <div
          id="widget-transfer-approvals"
          className="bg-slate-800/40 border border-slate-700/40 p-6 rounded-2xl flex flex-col"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Pending Transfer Requests
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Asset handovers awaiting department authorization
              </p>
            </div>
            <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-semibold">
              {pendingTransfers.length} Actionable
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] pr-1">
            {pendingTransfers.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-10 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-xl">
                <Check className="h-8 w-8 text-emerald-500/60 mb-2" />
                <p className="text-sm text-slate-400 font-semibold">
                  All clear! No pending transfers
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Handovers are processed and synchronized
                </p>
              </div>
            ) : (
              pendingTransfers.map((req) => (
                <div
                  key={req.id}
                  className="p-4 bg-slate-800 border border-slate-700/60 rounded-xl hover:border-slate-600 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                        Asset Handover
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1 truncate">
                        {req.assetName}
                      </h4>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                        <span className="bg-slate-900 px-2 py-0.5 rounded text-slate-300 font-medium truncate max-w-[120px]">
                          {req.fromDept}
                        </span>
                        <ArrowUpRight className="h-3 w-3 text-slate-500 flex-shrink-0" />
                        <span className="bg-slate-900 px-2 py-0.5 rounded text-blue-300 font-medium truncate max-w-[120px]">
                          {req.toDept}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 italic mt-2.5 border-l-2 border-slate-600 pl-2">
                        "{req.notes || "No notes provided."}"
                      </p>
                      <span className="block text-[10px] text-slate-500 mt-2 font-medium">
                        Requested by {req.requestedBy} &bull;{" "}
                        {req.requestedDate}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                      <button
                        id={`btn-approve-transfer-${req.id}`}
                        onClick={() => onApproveTransfer(req.id)}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                        title="Approve Reassignment"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        id={`btn-reject-transfer-${req.id}`}
                        onClick={() => onRejectTransfer(req.id)}
                        className="p-1.5 bg-slate-700 hover:bg-rose-600 hover:text-white text-slate-300 rounded-lg transition-colors"
                        title="Reject Request"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Active Compliance & Audits */}
        <div
          id="widget-audits"
          className="bg-slate-800/40 border border-slate-700/40 p-6 rounded-2xl flex flex-col"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Active Audit Cycles
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Asset verification and discrepancy matching
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
              Live Compliance
            </span>
          </div>

          <div className="flex-1 space-y-4">
            {activeAudits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-xl">
                <ClipboardCheck className="h-8 w-8 text-slate-600 mb-2" />
                <p className="text-sm text-slate-400 font-semibold">
                  No active compliance cycles
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Next global asset scan scheduled for next month
                </p>
              </div>
            ) : (
              activeAudits.map((aud) => {
                const totalItems = aud.checklist.length;
                const checkedItems = aud.checklist.filter(
                  (item) => item.checked,
                ).length;
                const progressPct =
                  totalItems > 0
                    ? Math.round((checkedItems / totalItems) * 100)
                    : 0;
                const openDiscrepancies = aud.discrepancies.filter(
                  (d) => d.status === "Pending",
                ).length;

                return (
                  <div
                    key={aud.id}
                    className="p-4 bg-slate-800 border border-slate-700/60 rounded-xl"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {aud.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-500" />
                          <span>Ends on {aud.endDate}</span>
                        </p>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[11px] font-medium">
                        Active
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400">Scan Progress</span>
                        <span className="text-white">
                          {progressPct}% ({checkedItems}/{totalItems} verified)
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Stats panel in audit */}
                    <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase tracking-wider">
                          Unverified Items
                        </span>
                        <span className="text-sm font-bold text-slate-300 mt-0.5">
                          {totalItems - checkedItems} Devices
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase tracking-wider">
                          Open Discrepancies
                        </span>
                        <span className="text-sm font-bold text-amber-400 mt-0.5">
                          {openDiscrepancies} Alerts
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
