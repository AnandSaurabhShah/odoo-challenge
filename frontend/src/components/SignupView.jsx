import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation } from "../hooks/useAuth.js";
import { useDepartmentsPublic } from "../hooks/useAssetQueries.js";
import {
  Shield,
  Key,
  Mail,
  User as UserIcon,
  Building2,
  ChevronRight,
  Layers,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

export default function SignupView() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);

  const registerMutation = useRegisterMutation();
  const { data: departments = [] } = useDepartmentsPublic();

  const serverError = registerMutation.error?.message ?? null;
  const error = localError || serverError;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");
    registerMutation.reset();

    if (!fullName || !email || !password) {
      setLocalError("Please fill in all required fields.");
      return;
    }
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    registerMutation.mutate(
      { fullName, email, password, departmentId: departmentId || null },
      {
        onSuccess: () => {
          setSuccess(true);
          // Auto-redirect to login after 2 seconds
          setTimeout(() => navigate("/login?registered=1"), 2000);
        },
      }
    );
  };

  return (
    <div
      id="signup-container"
      className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden"
    >
      {/* Decorative grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />

      {/* Glowing shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-600/20 text-emerald-400 rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-500/10 mb-4">
            <Layers className="h-8 w-8" />
          </div>
          <h1
            id="brand-title-signup"
            className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent"
          >
            Asset<span className="text-emerald-500">Flow</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Enterprise Asset Management Suite
          </p>
        </div>

        {/* Card */}
        <div
          id="signup-card"
          className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
        >
          {success ? (
            /* ── Success State ── */
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Account Created!</h2>
              <p className="text-sm text-slate-400">
                Your employee account is ready. Redirecting you to sign in…
              </p>
              <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mt-2" />
            </div>
          ) : (
            /* ── Form State ── */
            <>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Create your account</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    You'll be registered as an <span className="text-emerald-400 font-medium">Employee</span>
                  </p>
                </div>
                <Link
                  to="/login"
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Sign In
                </Link>
              </div>

              {error && (
                <div
                  id="signup-error"
                  className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-200 text-xs"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      id="input-fullname"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Smith"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      id="input-signup-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@company.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Department <span className="text-slate-500 text-[10px]">(optional)</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
                    <select
                      id="input-department"
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 appearance-none"
                    >
                      <option value="">— Auto-assigned —</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      id="input-signup-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      id="input-confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Role badge — informational */}
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-900/20 border border-emerald-500/20 rounded-lg">
                  <Shield className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                  <p className="text-[11px] text-emerald-300">
                    New accounts are registered as <strong>Employee</strong>. An admin can update your role later.
                  </p>
                </div>

                <button
                  id="btn-signup-submit"
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {registerMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Employee Account</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
