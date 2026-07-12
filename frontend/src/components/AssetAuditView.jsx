import React, { useState } from "react";
import {
  ClipboardCheck,
  Check,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  User as UserIcon,
  Search,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function AssetAuditView({
  currentUser,
  audits,
  onVerifyChecklistItem,
  onResolveDiscrepancy,
}) {
  const [search, setSearch] = useState("");

  if (audits.length === 0) {
    return (
      <div className="py-16 text-center bg-slate-800/10 border border-dashed border-slate-800 rounded-2xl">
        <ClipboardCheck className="h-10 w-10 text-slate-600 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-400">
          No Active Compliance Cycles
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Global audit scans are scheduled periodically.
        </p>
      </div>
    );
  }

  // Focus on the first active audit
  const activeAudit = audits[0];

  const totalItems = activeAudit.checklist.length;
  const checkedItems = activeAudit.checklist.filter(
    (item) => item.checked,
  ).length;
  const progressPct =
    totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  const pendingDiscrepancies = activeAudit.discrepancies.filter(
    (d) => d.status === "Pending",
  );
  const resolvedDiscrepancies = activeAudit.discrepancies.filter(
    (d) => d.status === "Resolved",
  );

  const filteredChecklist = activeAudit.checklist.filter(
    (item) =>
      item.assetName.toLowerCase().includes(search.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(search.toLowerCase()),
  );

  const getSeverityColor = (sev) => {
    switch (sev) {
      case "High":
        return "bg-rose-500/15 text-rose-400 border-rose-500/20";
      case "Medium":
        return "bg-amber-500/15 text-amber-400 border-amber-500/20";
      default:
        return "bg-blue-500/15 text-blue-400 border-blue-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1
          id="audit-title"
          className="text-xl font-bold text-white tracking-tight"
        >
          Compliance & Auditing
        </h1>
        <p className="text-xs text-slate-400">
          Validate physical hardware holdings against global financial records
          and reconcile location mismatches.
        </p>
      </div>

      {/* Audit Banner Panel */}
      <div
        id="audit-banner"
        className="bg-slate-800/40 border border-slate-700/40 p-6 rounded-2xl relative overflow-hidden shadow"
      >
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-1">
            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[11px] font-semibold">
              {activeAudit.status} Compliance Cycle
            </span>
            <h2 className="text-lg font-bold text-white mt-1.5">
              {activeAudit.title}
            </h2>
            <p className="text-xs text-slate-400">
              Cycle Duration: {activeAudit.startDate} &mdash;{" "}
              {activeAudit.endDate}
            </p>
          </div>

          <div className="md:w-64 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Completion Metrics</span>
              <span className="text-white">
                {progressPct}% ({checkedItems}/{totalItems} Checked)
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Splits layout: Checklist validation vs discrepancies reconciling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Asset Checklist Verification */}
        <div
          id="audit-checklist-col"
          className="bg-slate-800/40 border border-slate-700/40 p-6 rounded-2xl flex flex-col"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                Physical Holdings Verification Checklist
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Check off assets located and scanned in your workspace area.
              </p>
            </div>
            {/* Simple Search */}
            <div className="relative w-full sm:w-48">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
              <input
                id="search-audit-checklist"
                type="text"
                placeholder="Search checklist..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1 pl-8 pr-2.5 text-[11px] text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {filteredChecklist.map((item) => (
              <div
                key={item.id}
                className={`p-3 border rounded-xl flex items-center justify-between gap-4 transition-all ${
                  item.checked
                    ? "bg-slate-900/30 border-slate-800 text-slate-400"
                    : "bg-slate-800 border-slate-700/60 hover:border-slate-600"
                }`}
              >
                <div className="min-w-0">
                  <p
                    className={`text-xs font-bold leading-tight ${item.checked ? "text-slate-500 line-through" : "text-white"}`}
                  >
                    {item.assetName}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    SN: {item.serialNumber}
                  </p>
                  {item.checked && item.checkedBy && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
                      <Check className="h-3 w-3" />
                      Verified by {item.checkedBy}
                    </span>
                  )}
                </div>

                {!item.checked ? (
                  <button
                    id={`btn-verify-item-${item.id}`}
                    onClick={() =>
                      onVerifyChecklistItem(
                        activeAudit.id,
                        item.id,
                        currentUser.name,
                      )
                    }
                    className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                    title="Mark Asset Verified"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Verify</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                    Validated
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Asset Mismatches & Discrepancies */}
        <div
          id="audit-discrepancies-col"
          className="bg-slate-800/40 border border-slate-700/40 p-6 rounded-2xl flex flex-col"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                Asset Discrepancies & Audit Mismatches
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Investigate and reconcile serial errors and warehouse
                mismatches.
              </p>
            </div>
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[10px] font-bold">
              {pendingDiscrepancies.length} Alerts
            </span>
          </div>

          <div className="flex-1 space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {activeAudit.discrepancies.map((dc) => (
              <div
                key={dc.id}
                className={`p-4 border rounded-xl space-y-2.5 transition-colors ${
                  dc.status === "Resolved"
                    ? "bg-slate-900/10 border-slate-800/80 opacity-60"
                    : "bg-slate-800 border-slate-700/60"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {dc.assetName}
                    </h4>
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold border uppercase tracking-wider mt-1 ${getSeverityColor(dc.severity)}`}
                    >
                      {dc.severity} Severity
                    </span>
                  </div>

                  {dc.status === "Resolved" ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/15">
                      <CheckCircle2 className="h-3 w-3" />
                      Resolved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/15">
                      <AlertCircle className="h-3 w-3 animate-pulse" />
                      Pending Review
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                  {dc.issue}
                </p>

                {dc.status === "Pending" &&
                  currentUser.role === "System Admin" && (
                    <button
                      id={`btn-resolve-disc-${dc.id}`}
                      onClick={() =>
                        onResolveDiscrepancy(activeAudit.id, dc.id)
                      }
                      className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-all"
                    >
                      Resolve Discrepancy (Reconcile Serial Registry)
                    </button>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
