import React from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useAuth.js";
import LoginView from "../components/LoginView.jsx";

/**
 * /login page.
 * If the user is already authenticated, redirect to the dashboard.
 * Otherwise render the login form.
 */
export default function LoginPage() {
  const { data: user, isLoading } = useCurrentUser();

  // While checking session, show nothing (ProtectedRoute handles the global spinner)
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-950 items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Already logged in → send to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <LoginView />;
}
