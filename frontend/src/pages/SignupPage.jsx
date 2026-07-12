import React from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useAuth.js";
import SignupView from "../components/SignupView.jsx";

/**
 * /signup page.
 * If the user is already authenticated, redirect to the dashboard.
 * Otherwise render the signup form.
 */
export default function SignupPage() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-950 items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Already logged in → no reason to be on signup
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <SignupView />;
}
