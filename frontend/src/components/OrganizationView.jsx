import React, { useState } from "react";
import {
  Building2,
  FolderTree,
  Users,
  Plus,
  Search,
  Mail,
  Trash2,
} from "lucide-react";

export default function OrganizationView({
  currentUser,
  departments,
  employees,
  onAddDepartment,
  onAddEmployee,
  onDeleteEmployee,
}) {
  const [activeTab, setActiveTab] = useState("depts");

  // Department state
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [deptManager, setDeptManager] = useState("");
  const [deptHeadcount, setDeptHeadcount] = useState(1);

  // Employee state
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [empName, setEmpName] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empDept, setEmpDept] = useState(
    departments[0]?.name || "Engineering & DevOps",
  );
  const [empRole, setEmpRole] = useState("");
  const [empAvatar, setEmpAvatar] = useState("");
  const [empSearch, setEmpSearch] = useState("");

  // Handle department submit
  const handleAddDept = (e) => {
    e.preventDefault();
    if (!deptName || !deptCode || !deptManager) return;
    onAddDepartment({
      name: deptName,
      code: deptCode.toUpperCase(),
      manager: deptManager,
      headcount: Number(deptHeadcount) || 1,
    });
    // Reset
    setDeptName("");
    setDeptCode("");
    setDeptManager("");
    setDeptHeadcount(1);
    setShowAddDeptModal(false);
  };

  // Handle employee submit
  const handleAddEmp = (e) => {
    e.preventDefault();
    if (!empName || !empEmail || !empRole) return;
    onAddEmployee({
      name: empName,
      email: empEmail,
      department: empDept,
      role: empRole,
      avatar:
        empAvatar ||
        `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?w=150`,
    });
    // Reset
    setEmpName("");
    setEmpEmail("");
    setEmpRole("");
    setEmpAvatar("");
    setShowAddEmpModal(false);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(empSearch.toLowerCase()) ||
      emp.email.toLowerCase().includes(empSearch.toLowerCase()) ||
      emp.role.toLowerCase().includes(empSearch.toLowerCase()) ||
      emp.department.toLowerCase().includes(empSearch.toLowerCase()),
  );

  const categories = [
    {
      name: "Computing",
      code: "CMP",
      count: 3,
      description: "Laptops, Developer workstations, tablets, and test phones.",
      color: "border-blue-500/20 text-blue-400 bg-blue-500/5",
    },
    {
      name: "Media Equipment",
      code: "MED",
      count: 2,
      description:
        "Cameras, Drones, stabilizers, studio lighting, and audio rigs.",
      color: "border-indigo-500/20 text-indigo-400 bg-indigo-500/5",
    },
    {
      name: "Infrastructure",
      code: "INF",
      count: 1,
      description: "Server racks, switches, routers, HVAC monitoring nodes.",
      color: "border-rose-500/20 text-rose-400 bg-rose-500/5",
    },
    {
      name: "Vehicles",
      code: "VEH",
      count: 1,
      description: "Transit vans, transport trucks, field testing cars.",
      color: "border-amber-500/20 text-amber-400 bg-amber-500/5",
    },
  ];

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1
            id="org-view-title"
            className="text-xl font-bold text-white tracking-tight"
          >
            Organization Setup
          </h1>
          <p className="text-xs text-slate-400">
            Configure company hierarchies, department scopes, and workspace
            directory lists.
          </p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            id="tab-depts"
            onClick={() => setActiveTab("depts")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 ${activeTab === "depts" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
          >
            <Building2 className="h-3.5 w-3.5" />
            Active Departments
          </button>
          <button
            id="tab-categories"
            onClick={() => setActiveTab("categories")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 ${activeTab === "categories" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
          >
            <FolderTree className="h-3.5 w-3.5" />
            Asset Categories
          </button>
          <button
            id="tab-employees"
            onClick={() => setActiveTab("employees")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 ${activeTab === "employees" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
          >
            <Users className="h-3.5 w-3.5" />
            Employee Directory
          </button>
        </div>
      </div>

      {/* TAB 1: ACTIVE DEPARTMENTS */}
      {activeTab === "depts" && (
        <div id="panel-depts" className="space-y-4">
          <div className="flex justify-between items-center bg-slate-850/40 p-4 border border-slate-800 rounded-xl">
            <div>
              <h2 className="text-sm font-bold text-white">
                Active Corporate Divisions
              </h2>
              <p className="text-xs text-slate-400">
                Operational divisions holding physical hardware and capital
                assets.
              </p>
            </div>
            {currentUser.role === "System Admin" && (
              <button
                id="btn-add-dept"
                onClick={() => setShowAddDeptModal(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Plus className="h-4 w-4" />
                Add Department
              </button>
            )}
          </div>

          <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Department Name</th>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Manager / Director</th>
                    <th className="py-3 px-4 text-center">Headcount</th>
                    <th className="py-3 px-4 text-right">
                      Asset Inventory Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {departments.map((dept) => (
                    <tr
                      key={dept.id}
                      className="hover:bg-slate-850/35 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-white">
                        {dept.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-slate-900 border border-slate-700/50 rounded font-mono text-slate-300">
                          {dept.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{dept.manager}</td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-200">
                        {dept.headcount} Staff
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                        ${dept.totalAssetsValue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Create Department Inline / Modal */}
          {showAddDeptModal && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
              <div className="bg-slate-850 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
                  <h3 className="text-base font-bold text-white">
                    Configure New Department
                  </h3>
                  <button
                    onClick={() => setShowAddDeptModal(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    &times;
                  </button>
                </div>
                <form onSubmit={handleAddDept} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Department Name
                    </label>
                    <input
                      id="form-dept-name"
                      type="text"
                      required
                      value={deptName}
                      onChange={(e) => setDeptName(e.target.value)}
                      placeholder="Facilities & Security"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Division Code (3 Letters)
                      </label>
                      <input
                        id="form-dept-code"
                        type="text"
                        required
                        maxLength={3}
                        value={deptCode}
                        onChange={(e) => setDeptCode(e.target.value)}
                        placeholder="FAC"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Initial Headcount
                      </label>
                      <input
                        id="form-dept-headcount"
                        type="number"
                        min={1}
                        required
                        value={deptHeadcount}
                        onChange={(e) =>
                          setDeptHeadcount(Number(e.target.value))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Appointed Director / Manager
                    </label>
                    <input
                      id="form-dept-manager"
                      type="text"
                      required
                      value={deptManager}
                      onChange={(e) => setDeptManager(e.target.value)}
                      placeholder="Diana Prince"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      id="btn-cancel-dept"
                      type="button"
                      onClick={() => setShowAddDeptModal(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      id="btn-save-dept"
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
                    >
                      Establish Division
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ASSET CATEGORIES */}
      {activeTab === "categories" && (
        <div id="panel-categories" className="space-y-4">
          <div className="bg-slate-850/40 p-4 border border-slate-800 rounded-xl">
            <h2 className="text-sm font-bold text-white">
              Registered Asset Classifications
            </h2>
            <p className="text-xs text-slate-400">
              Structural classification schema for inventory logging and
              compliance policies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className={`border p-5 rounded-2xl flex flex-col justify-between ${cat.color} hover:border-slate-600 transition-all shadow-md`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 border border-slate-700/60 rounded text-slate-300">
                      {cat.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800/40 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">
                    Policy Lifecycle:
                  </span>
                  <span className="font-bold text-white">
                    36-60 Months Replacement
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EMPLOYEE DIRECTORY */}
      {activeTab === "employees" && (
        <div id="panel-employees" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between bg-slate-850/40 p-4 border border-slate-800 rounded-xl">
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                id="search-employee-input"
                type="text"
                placeholder="Search staff, email, role..."
                value={empSearch}
                onChange={(e) => setEmpSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            {currentUser.role === "System Admin" && (
              <button
                id="btn-add-employee"
                onClick={() => setShowAddEmpModal(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all self-end sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                Add Employee
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className="p-4 bg-slate-800/60 border border-slate-700/40 rounded-2xl relative overflow-hidden group hover:border-slate-600 transition-all shadow"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="h-11 w-11 rounded-xl object-cover border border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate leading-tight">
                      {emp.name}
                    </h4>
                    <span className="inline-block text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-semibold mt-1">
                      {emp.role}
                    </span>

                    <div className="mt-3.5 space-y-1.5 text-[11px] text-slate-400">
                      <p className="flex items-center gap-1.5 truncate">
                        <Building2 className="h-3 w-3 text-slate-500 flex-shrink-0" />
                        <span>{emp.department}</span>
                      </p>
                      <p className="flex items-center gap-1.5 truncate">
                        <Mail className="h-3 w-3 text-slate-500 flex-shrink-0" />
                        <span>{emp.email}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {currentUser.role === "System Admin" && (
                  <button
                    id={`btn-delete-emp-${emp.id}`}
                    onClick={() => onDeleteEmployee(emp.id)}
                    className="absolute top-2 right-2 p-1.5 bg-slate-900/60 text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove Employee"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Employee Modal */}
          {showAddEmpModal && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
              <div className="bg-slate-850 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
                  <h3 className="text-base font-bold text-white">
                    Add Employee Profile
                  </h3>
                  <button
                    onClick={() => setShowAddEmpModal(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    &times;
                  </button>
                </div>
                <form onSubmit={handleAddEmp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="form-emp-name"
                      type="text"
                      required
                      value={empName}
                      onChange={(e) => setEmpName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Corporate Email
                    </label>
                    <input
                      id="form-emp-email"
                      type="email"
                      required
                      value={empEmail}
                      onChange={(e) => setEmpEmail(e.target.value)}
                      placeholder="jane.doe@assetflow.corp"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Department Assignment
                      </label>
                      <select
                        id="form-emp-dept"
                        value={empDept}
                        onChange={(e) => setEmpDept(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        {departments.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Role / Position
                      </label>
                      <input
                        id="form-emp-role"
                        type="text"
                        required
                        value={empRole}
                        onChange={(e) => setEmpRole(e.target.value)}
                        placeholder="Security Analyst"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Avatar Image URL (Optional)
                    </label>
                    <input
                      id="form-emp-avatar"
                      type="text"
                      value={empAvatar}
                      onChange={(e) => setEmpAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      id="btn-cancel-emp"
                      type="button"
                      onClick={() => setShowAddEmpModal(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      id="btn-save-employee"
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
                    >
                      Add to Directory
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
