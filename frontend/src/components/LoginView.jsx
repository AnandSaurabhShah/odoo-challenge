import React, { useState } from "react";
import {
  Shield,
  Key,
  Mail,
  User as UserIcon,
  Briefcase,
  ChevronRight,
  Layers,
} from "lucide-react";

export default function LoginView({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("Engineering & DevOps");
  const [role, setRole] = useState("System Admin");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) {
      setError("Please fill out all required fields.");
      return;
    }

    // Process mock login or register
    const loggedUser = {
      id: isSignUp ? "u_" + Date.now() : "u_preset",
      name: isSignUp
        ? name
        : email.includes("admin")
          ? "Administrator"
          : email.includes("manager")
            ? "Marcus Vance"
            : email.includes("tech")
              ? "James Carter"
              : "Alice Smith",
      email: email,
      department: isSignUp
        ? department
        : email.includes("manager")
          ? "Product & Design"
          : "Engineering & DevOps",
      role: isSignUp
        ? role
        : email.includes("admin")
          ? "System Admin"
          : email.includes("manager")
            ? "Department Manager"
            : email.includes("tech")
              ? "Technician"
              : "System Admin",
      avatar: isSignUp
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
        : email.includes("manager")
          ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
          : email.includes("tech")
            ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
            : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    };

    onLogin(loggedUser);
  };

  const handleQuickFill = (preset) => {
    setIsSignUp(false);
    setError("");
    if (preset === "admin") {
      setEmail("admin@assetflow.corp");
      setPassword("admin123");
    } else if (preset === "manager") {
      setEmail("manager.marcus@assetflow.corp");
      setPassword("manager123");
    } else if (preset === "tech") {
      setEmail("tech.james@assetflow.corp");
      setPassword("tech123");
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
          {/* Custom Switch Tab */}
          <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-800 mb-6">
            <button
              id="tab-signin"
              onClick={() => {
                setIsSignUp(false);
                setError("");
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${!isSignUp ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
            >
              Sign In
            </button>
            <button
              id="tab-signup"
              onClick={() => {
                setIsSignUp(true);
                setError("");
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${isSignUp ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div
              id="auth-error"
              className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-200 text-xs"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    id="input-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Connor"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

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
                  placeholder="name@assetflow.corp"
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

            {isSignUp && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Department
                  </label>
                  <select
                    id="select-department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option>Engineering & DevOps</option>
                    <option>Product & Design</option>
                    <option>Operations & Logistics</option>
                    <option>Marketing & Sales</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    System Role
                  </label>
                  <select
                    id="select-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="System Admin">System Admin</option>
                    <option value="Department Manager">Dept Manager</option>
                    <option value="Technician">Technician</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>
              </div>
            )}

            <button
              id="btn-auth-submit"
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>
                {isSignUp
                  ? "Create Enterprise Account"
                  : "Sign In to Workspace"}
              </span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick-Fill Presets helper */}
          {!isSignUp && (
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
                  Technician
                </button>
              </div>
              <span className="block text-center text-[10px] text-slate-500 mt-2">
                Auto-populates mock role-based dashboard configurations.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
