import React, { useState } from "react";
import {
  ArrowLeftRight,
  Plus,
  Check,
  X,
  Clock,
  HelpCircle,
  CheckCircle2,
  XCircle,
  User as UserIcon,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function AllocationTransfersView({
  currentUser,
  assets,
  departments,
  transfers,
  onRequestTransfer,
  onApproveTransfer,
  onRejectTransfer,
}) {
  const [showForm, setShowForm] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || "");
  const [toDept, setToDept] = useState(
    departments[0]?.name || "Marketing & Sales",
  );
  const [notes, setNotes] = useState("");

  const selectedAsset = assets.find((a) => a.id === selectedAssetId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAssetId || !toDept) return;

    onRequestTransfer({
      assetId: selectedAssetId,
      assetName: selectedAsset?.name || "Unknown Asset",
      fromDept: selectedAsset?.department || "Active Pool",
      toDept,
      requestedBy: currentUser.name,
      notes,
    });

    setNotes("");
    setShowForm(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Approved":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Rejected":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4 text-amber-400 animate-pulse" />;
      case "Approved":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "Rejected":
        return <XCircle className="h-4 w-4 text-rose-400" />;
      default:
        return <HelpCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1
            id="allocation-title"
            className="text-xl font-bold text-white tracking-tight"
          >
            Allocation & Transfers
          </h1>
          <p className="text-xs text-slate-400">
            Reassign corporate assets between staff and request structural
            cross-department transfers.
          </p>
        </div>
        <button
          id="btn-trigger-transfer"
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all self-end sm:self-auto shadow-lg shadow-blue-500/20"
        >
          <ArrowLeftRight className="h-4 w-4" />
          Request Asset Transfer
        </button>
      </div>

      {/* Transfer Request Form */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-slate-850 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  Transfer Request Form
                </h3>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Select Asset to Transfer
                </label>
                <select
                  id="trans-asset-select"
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} (SN: {a.serialNumber} &bull; Dept: {a.department}
                      )
                    </option>
                  ))}
                </select>
              </div>

              {selectedAsset && (
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1.5 text-xs text-slate-400">
                  <p>
                    <span className="font-semibold text-slate-300">
                      Current Division:
                    </span>{" "}
                    {selectedAsset.department}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-300">
                      Custodian / Keeper:
                    </span>{" "}
                    {selectedAsset.assignedTo || "Unassigned Pool"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-300">
                      Purchase Value:
                    </span>{" "}
                    ${selectedAsset.purchaseValue.toLocaleString()}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Destination Department
                </label>
                <select
                  id="trans-dest-dept"
                  value={toDept}
                  onChange={(e) => setToDept(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                >
                  {departments
                    .filter(
                      (d) =>
                        !selectedAsset || d.name !== selectedAsset.department,
                    )
                    .map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Justification Notes
                </label>
                <textarea
                  id="trans-notes"
                  required
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide brief details on why this asset needs to be re-allocated..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-trans-req"
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                >
                  Initiate Handover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer List Section */}
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden shadow">
        <div className="p-5 border-b border-slate-800 bg-slate-900/40">
          <h2 className="text-sm font-bold text-white">
            Transfer Requests & Handovers
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Authorization logs for moving hardware between organizational
            borders.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Asset Transfer Target</th>
                <th className="py-3.5 px-5">From Department</th>
                <th className="py-3.5 px-5">To Department</th>
                <th className="py-3.5 px-5">Requested By</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Justification</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transfers.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-slate-850/35 transition-colors"
                >
                  <td className="py-3.5 px-5 font-bold text-white">
                    {req.assetName}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded">
                      {req.fromDept}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 bg-slate-900 border border-indigo-950/65 text-indigo-300 rounded font-semibold">
                      {req.toDept}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="flex items-center gap-1.5 font-medium">
                      <UserIcon className="h-3 w-3 text-slate-500" />
                      {req.requestedBy}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-400">
                    {req.requestedDate}
                  </td>
                  <td
                    className="py-3.5 px-5 max-w-[200px] truncate text-slate-400 italic"
                    title={req.notes}
                  >
                    "{req.notes || "No comments provided."}"
                  </td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(req.status)}`}
                    >
                      {getStatusIcon(req.status)}
                      <span>{req.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {req.status === "Pending" ? (
                      <div className="flex justify-end gap-1.5">
                        <button
                          id={`btn-approve-trans-${req.id}`}
                          onClick={() => onApproveTransfer(req.id)}
                          className="p-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded transition-colors border border-emerald-500/30"
                          title="Approve"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          id={`btn-reject-trans-${req.id}`}
                          onClick={() => onRejectTransfer(req.id)}
                          className="p-1 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white rounded transition-colors border border-rose-500/30"
                          title="Reject"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">
                        Resolved
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
