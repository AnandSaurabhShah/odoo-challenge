import React from "react";
import { ShieldOff, Home } from "lucide-react";

/**
 * Shown when a user navigates to a screen they don't have permission to access.
 * Acts as a safe fallback — never a hard crash.
 */
export default function AccessDenied({ screenLabel = "this section", onGoHome }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <ShieldOff className="h-9 w-9 text-rose-400" />
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-rose-500/5 blur-xl pointer-events-none" />
      </div>

      {/* Text */}
      <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
      <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-1">
        You don&apos;t have permission to view{" "}
        <span className="text-slate-300 font-medium">{screenLabel}</span>.
      </p>
      <p className="text-slate-500 text-xs mb-8">
        Contact your system administrator if you believe this is a mistake.
      </p>

      {/* Action */}
      <button
        id="btn-access-denied-home"
        onClick={onGoHome}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-sm font-medium rounded-xl transition-all duration-150 active:scale-[0.97]"
      >
        <Home className="h-4 w-4" />
        Back to Dashboard
      </button>
    </div>
  );
}
