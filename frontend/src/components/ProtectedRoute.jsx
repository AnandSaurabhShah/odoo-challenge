import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../hooks/useAuth.js";

/**
 * Wraps protected pages. Shows a spinner while auth is resolving,
 * redirects to /login if there's no authenticated user, otherwise
 * renders the nested route via <Outlet />.
 */
export default function ProtectedRoute() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-950 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <div className="absolute w-6 h-6 border-4 border-emerald-500/10 border-b-emerald-500 rounded-full animate-spin" />
          </div>
          <p className="text-slate-400 text-sm">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
