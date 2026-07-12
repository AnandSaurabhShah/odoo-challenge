import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLoginMutation } from "../hooks/useAuth.js";
import {
  Shield,
  Key,
  Mail,
  User as UserIcon,
  Briefcase,
  ChevronRight,
  Layers,
  CheckCircle,
} from "lucide-react";

export default function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [searchParams] = useSearchParams();

  // Show a success notice when redirected from signup
  const justRegistered = searchParams.get("registered") === "1";

  const loginMutation = useLoginMutation();

  // Derive a user-friendly error message from the mutation error
  const serverError = loginMutation.error?.message ?? null;
  const error = localError || serverError;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError("Please enter your email and password.");
      return;
    }

    loginMutation.mutate({ email, password });
  };

  const handleQuickFill = (preset) => {
    setLocalError("");
    loginMutation.reset();
    if (preset === "admin") {
      setEmail("admin@assetflow.com");
      setPassword("password123");
    } else if (preset === "manager") {
      setEmail("manager@assetflow.com");
      setPassword("password123");
    } else if (preset === "tech") {
      setEmail("rahul@assetflow.com");
      setPassword("password123");
    }
  };

  return (
    <div
      id="login-container"
      className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden"
    >
      {/* Decorative grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>

      {/* Abstract Glowing shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30 shadow-lg shadow-blue-500/10 mb-4">
            <Layers className="h-8 w-8" />
          </div>
          <h1
            id="brand-title"
            className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent"
          >
            Asset<span className="text-blue-500">Flow</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Enterprise Asset Management Suite
          </p>
        </div>

        {/* Authentication Card */}
        <div
          id="auth-card"
          className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
        >
          {/* Title */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Sign in to your workspace</h2>
            <p className="text-xs text-slate-400 mt-0.5">Enter your corporate credentials to continue</p>
          </div>

          {/* Post-signup success notice */}
          {justRegistered && (
            <div className="mb-4 p-3 bg-emerald-900/30 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-200 text-xs">
              <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-400" />
              Account created successfully! Sign in with your new credentials.
            </div>
          )}

          {error && (
            <div
              id="auth-error"
              className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-200 text-xs"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Corporate Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  id="input-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  id="input-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              id="btn-auth-submit"
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {loginMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick-Fill Presets helper */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <span className="block text-center text-xs text-slate-400 font-medium mb-3">
              Reviewer Quick Sign-In Presets
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="fill-admin"
                onClick={() => handleQuickFill("admin")}
                className="px-2 py-1.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-700/40 rounded-lg text-slate-300 hover:text-white text-[11px] font-medium flex flex-col items-center justify-center transition-all duration-150"
              >
                <Shield className="h-3.5 w-3.5 text-amber-400 mb-1" />
                Admin
              </button>
              <button
                id="fill-manager"
                onClick={() => handleQuickFill("manager")}
                className="px-2 py-1.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-700/40 rounded-lg text-slate-300 hover:text-white text-[11px] font-medium flex flex-col items-center justify-center transition-all duration-150"
              >
                <Briefcase className="h-3.5 w-3.5 text-blue-400 mb-1" />
                Manager
              </button>
              <button
                id="fill-tech"
                onClick={() => handleQuickFill("tech")}
                className="px-2 py-1.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-700/40 rounded-lg text-slate-300 hover:text-white text-[11px] font-medium flex flex-col items-center justify-center transition-all duration-150"
              >
                <UserIcon className="h-3.5 w-3.5 text-emerald-400 mb-1" />
                Dept Head
              </button>
            </div>
            <span className="block text-center text-[10px] text-slate-500 mt-2">
              Fills credentials — still authenticates against the real backend.
            </span>
          </div>
        </div>

        {/* Create Account Link */}
        <p className="text-center text-xs text-slate-500 mt-4">
          Don&apos;t have an account?{" "}
          <Link
            id="link-create-account"
            to="/signup"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors font-medium"
          >
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
}
