import React, { useState } from "react";
import {
  Wrench,
  Plus,
  MessageSquare,
  Clock,
  User as UserIcon,
  AlertTriangle,
  UserPlus,
  CheckCircle,
  ChevronRight,
  Play,
  Sparkles,
} from "lucide-react";

export default function MaintenanceKanbanView({
  currentUser,
  maintenance,
  assets,
  employees,
  onAddMaintenanceTask,
  onUpdateMaintenanceStatus,
  onAddComment,
}) {
  const [showForm, setShowForm] = useState(false);
  const [assetId, setAssetId] = useState(assets[0]?.id || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  // Comment box state
  const [activeTaskIdForComment, setActiveTaskIdForComment] = useState(null);
  const [commentText, setCommentText] = useState("");

  const [activeTaskIdForTech, setActiveTaskIdForTech] = useState(null);

  const columns = [
    {
      id: "Pending",
      label: "Pending Review",
      color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    },
    {
      id: "Approved",
      label: "Approved",
      color: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    },
    {
      id: "Technician Assigned",
      label: "In Progress / Assigned",
      color: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    },
    {
      id: "Completed",
      label: "Completed",
      color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!assetId || !title || !description) return;

    const selectedAsset = assets.find((a) => a.id === assetId);

    onAddMaintenanceTask({
      assetId,
      assetName: selectedAsset?.name || "Unknown Asset",
      title,
      description,
      priority,
      requestedBy: currentUser.name,
      status: "Pending",
      comments: [],
    });

    setTitle("");
    setDescription("");
    setShowForm(false);
  };

  const handleCommentSubmit = (taskId) => {
    if (!commentText.trim()) return;
    onAddComment(taskId, {
      id: "c_" + Date.now(),
      user: currentUser.name,
      text: commentText,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
    });
    setCommentText("");
    setActiveTaskIdForComment(null);
  };

  const handleAssignTech = (taskId, techName) => {
    onUpdateMaintenanceStatus(taskId, "Technician Assigned", techName);
    setActiveTaskIdForTech(null);
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case "High":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1
            id="maintenance-title"
            className="text-xl font-bold text-white tracking-tight"
          >
            Maintenance Kanban Board
          </h1>
          <p className="text-xs text-slate-400">
            Log physical failures, dispatch engineering technicians, add
            diagnostic reports, and monitor task status.
          </p>
        </div>
        <button
          id="btn-trigger-maintenance"
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all self-end sm:self-auto shadow-lg shadow-blue-500/20"
        >
          <Wrench className="h-4 w-4" />
          Log Maintenance Issue
        </button>
      </div>

      {/* Log Issue Dialog Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-slate-850 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  Log Maintenance Task
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
                  Asset Target
                </label>
                <select
                  id="maint-asset-select"
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
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

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Task Title / Fault Header
                </label>
                <input
                  id="maint-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Sticking keyboard keys, oil leak check"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Detailed Fault Description
                </label>
                <textarea
                  id="maint-desc"
                  required
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the failure characteristics, error codes, or physical damages..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Urgency / Priority
                </label>
                <select
                  id="maint-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High / Critical Priority</option>
                </select>
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
                  id="btn-submit-maint"
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
                >
                  File Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Board Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const tasksInCol = maintenance.filter((m) => m.status === col.id);

          return (
            <div
              key={col.id}
              id={`kanban-col-${col.id.replace(/\s+/g, "-")}`}
              className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex flex-col min-h-[480px]"
            >
              {/* Column Header */}
              <div className="pb-3 border-b border-slate-800/80 mb-4 flex justify-between items-center">
                <span
                  className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${col.color}`}
                >
                  {col.label}
                </span>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded">
                  {tasksInCol.length}
                </span>
              </div>

              {/* Tasks List Container */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1">
                {tasksInCol.length === 0 ? (
                  <div className="h-full flex items-center justify-center py-8 text-center text-slate-600 text-xs border border-dashed border-slate-800/50 rounded-xl italic">
                    No active tasks
                  </div>
                ) : (
                  tasksInCol.map((task) => (
                    <div
                      key={task.id}
                      id={`maint-task-${task.id}`}
                      className="bg-slate-800/70 border border-slate-700/40 p-4 rounded-xl space-y-3 relative group hover:border-slate-600 transition-all shadow"
                    >
                      {/* Priority Tag */}
                      <div className="flex justify-between items-center">
                        <span
                          className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority} Priority
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          #{task.id}
                        </span>
                      </div>

                      {/* Content */}
                      <div>
                        <h4 className="text-xs font-bold text-white leading-snug">
                          {task.title}
                        </h4>
                        <span className="block text-[10px] text-blue-400 font-medium truncate mt-0.5">
                          {task.assetName}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed line-clamp-3">
                          {task.description}
                        </p>
                      </div>

                      {/* Technician assignment indicator */}
                      {task.technician && (
                        <div className="p-1.5 bg-slate-900/60 rounded-lg text-[10px] text-slate-300 flex items-center gap-1.5 border border-slate-800">
                          <UserIcon className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">
                            Tech: <strong>{task.technician}</strong>
                          </span>
                        </div>
                      )}

                      {/* Diagnostic Comments section */}
                      {task.comments && task.comments.length > 0 && (
                        <div className="space-y-1.5 border-t border-slate-800 pt-2 text-[10px] text-slate-400">
                          <span className="block text-slate-500 font-semibold flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" /> Comments (
                            {task.comments.length})
                          </span>
                          <div className="max-h-[60px] overflow-y-auto space-y-1 pr-1 bg-slate-900/30 p-1 rounded">
                            {task.comments.map((c) => (
                              <p key={c.id} className="leading-snug">
                                <strong className="text-slate-300">
                                  {c.user}:
                                </strong>{" "}
                                {c.text}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Comments Input Toggle */}
                      {activeTaskIdForComment === task.id ? (
                        <div className="space-y-1.5 pt-2 border-t border-slate-800">
                          <input
                            id={`input-comment-${task.id}`}
                            type="text"
                            required
                            placeholder="Add diagnostic update..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded py-1 px-2 text-[11px] text-white focus:outline-none"
                          />
                          <div className="flex justify-end gap-1.5 text-[10px]">
                            <button
                              onClick={() => setActiveTaskIdForComment(null)}
                              className="text-slate-500"
                            >
                              Cancel
                            </button>
                            <button
                              id={`btn-post-comment-${task.id}`}
                              onClick={() => handleCommentSubmit(task.id)}
                              className="bg-blue-600 text-white px-2 py-0.5 rounded font-semibold"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          id={`btn-trigger-comment-${task.id}`}
                          onClick={() => setActiveTaskIdForComment(task.id)}
                          className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1 transition-colors mt-1"
                        >
                          <MessageSquare className="h-3 w-3" />
                          <span>Add Diagnostic / Comment</span>
                        </button>
                      )}

                      {/* Technician allocator list */}
                      {activeTaskIdForTech === task.id ? (
                        <div className="bg-slate-900/90 absolute inset-0 p-3 rounded-xl flex flex-col justify-between z-10">
                          <div>
                            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                              Assign Fleet Tech
                            </span>
                            <div className="space-y-1 max-h-[100px] overflow-y-auto">
                              {employees
                                .filter(
                                  (emp) =>
                                    emp.role.includes("Technician") ||
                                    emp.role.includes("Manager"),
                                )
                                .map((tech) => (
                                  <button
                                    key={tech.id}
                                    onClick={() =>
                                      handleAssignTech(task.id, tech.name)
                                    }
                                    className="w-full text-left py-1 px-2 bg-slate-800 hover:bg-blue-600/20 text-[10px] text-white rounded truncate"
                                  >
                                    {tech.name} ({tech.role})
                                  </button>
                                ))}
                            </div>
                          </div>
                          <button
                            onClick={() => setActiveTaskIdForTech(null)}
                            className="text-[10px] text-slate-400 text-center w-full mt-1"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : null}

                      {/* Control Handovers (Status advancements) */}
                      <div className="border-t border-slate-800/80 pt-3 flex justify-between items-center text-[11px]">
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Requested by {task.requestedBy.split(" ")[0]}
                        </span>

                        {/* Kanban status advancements */}
                        <div className="flex items-center gap-1">
                          {task.status === "Pending" &&
                            currentUser.role === "System Admin" && (
                              <button
                                id={`btn-approve-task-${task.id}`}
                                onClick={() =>
                                  onUpdateMaintenanceStatus(task.id, "Approved")
                                }
                                className="px-2 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 rounded font-semibold text-[10px] flex items-center gap-0.5"
                                title="Approve Maintenance"
                              >
                                <span>Approve</span>
                                <ChevronRight className="h-3 w-3" />
                              </button>
                            )}

                          {task.status === "Approved" && (
                            <button
                              id={`btn-tech-task-${task.id}`}
                              onClick={() => setActiveTaskIdForTech(task.id)}
                              className="px-2 py-1 bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-500/20 rounded font-semibold text-[10px] flex items-center gap-0.5"
                              title="Dispatch Technician"
                            >
                              <UserPlus className="h-3 w-3" />
                              <span>Dispatch</span>
                            </button>
                          )}

                          {task.status === "Technician Assigned" && (
                            <button
                              id={`btn-complete-task-${task.id}`}
                              onClick={() =>
                                onUpdateMaintenanceStatus(task.id, "Completed")
                              }
                              className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 rounded font-semibold text-[10px] flex items-center gap-0.5"
                              title="Resolve / Mark Done"
                            >
                              <CheckCircle className="h-3 w-3" />
                              <span>Complete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
