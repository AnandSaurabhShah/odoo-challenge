import React, { useState } from "react";
import {
  Search,
  Plus,
  Grid,
  List,
  Tag,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  User as UserIcon,
  Sparkles,
  Info,
} from "lucide-react";

export default function AssetDirectoryView({
  currentUser,
  assets,
  departments,
  employees,
  onAddAsset,
}) {
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Registration form state
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Computing");
  const [serialNumber, setSerialNumber] = useState("");
  const [model, setModel] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [purchaseValue, setPurchaseValue] = useState("");
  const [deptName, setDeptName] = useState(
    departments[0]?.name || "Engineering & DevOps",
  );
  const [location, setLocation] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !serialNumber || !purchaseValue) return;

    onAddAsset({
      name,
      category,
      serialNumber: serialNumber.toUpperCase(),
      model: model || "N/A",
      purchaseDate,
      purchaseValue: Number(purchaseValue),
      department: deptName,
      location: location || "HQ - Office",
      assignedTo: assignedTo || undefined,
      status: assignedTo ? "Allocated" : "Active",
      image:
        imageUrl ||
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300",
    });

    // Reset fields
    setName("");
    setCategory("Computing");
    setSerialNumber("");
    setModel("");
    setPurchaseValue("");
    setDeptName(departments[0]?.name || "Engineering & DevOps");
    setLocation("");
    setAssignedTo("");
    setImageUrl("");
    setShowForm(false);
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      (asset.model && asset.model.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = catFilter === "All" || asset.category === catFilter;
    const matchesDept = deptFilter === "All" || asset.department === deptFilter;
    const matchesStatus =
      statusFilter === "All" || asset.status === statusFilter;
    return matchesSearch && matchesCat && matchesDept && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Allocated":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "In Maintenance":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Retired":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1
            id="directory-title"
            className="text-xl font-bold text-white tracking-tight"
          >
            Asset Directory
          </h1>
          <p className="text-xs text-slate-400">
            View, monitor, audit and register all physical hardware, tech
            equipment, and vehicles.
          </p>
        </div>
        <button
          id="btn-trigger-register"
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all self-end sm:self-auto shadow-lg shadow-blue-500/20"
        >
          <Plus className="h-4 w-4" />
          Register New Asset
        </button>
      </div>

      {/* Asset Registration Dialog */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-slate-850 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Active Asset Registration Form
                </h3>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Asset Name *
                  </label>
                  <input
                    id="reg-asset-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Apple Studio Display 27"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    id="reg-asset-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option>Computing</option>
                    <option>Media Equipment</option>
                    <option>Infrastructure</option>
                    <option>Vehicles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Model Number
                  </label>
                  <input
                    id="reg-asset-model"
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g., A2615"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Serial Number / VIN *
                  </label>
                  <input
                    id="reg-asset-serial"
                    type="text"
                    required
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="e.g., C02FD32XQ05"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Purchase Value (USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 text-sm">
                      $
                    </span>
                    <input
                      id="reg-asset-value"
                      type="number"
                      required
                      min="1"
                      value={purchaseValue}
                      onChange={(e) => setPurchaseValue(e.target.value)}
                      placeholder="1599"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-7 pr-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Purchase Date *
                  </label>
                  <input
                    id="reg-asset-date"
                    type="date"
                    required
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Allocated Department *
                  </label>
                  <select
                    id="reg-asset-dept"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none"
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
                    Asset Location / Desk
                  </label>
                  <input
                    id="reg-asset-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., HQ - Floor 3 - Desk 304"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Assign To Employee (Optional)
                  </label>
                  <select
                    id="reg-asset-assign"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none"
                  >
                    <option value="">
                      -- Leave Unassigned (Active Pool) --
                    </option>
                    {employees.map((e) => (
                      <option key={e.id} value={e.name}>
                        {e.name} ({e.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Hardware Image URL (Optional)
                  </label>
                  <input
                    id="reg-asset-image"
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  id="btn-reg-cancel"
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="btn-reg-submit"
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
                >
                  Register Asset Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Controls Bar */}
      <div className="bg-slate-800/30 p-4 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            id="search-assets"
            type="text"
            placeholder="Search by asset name, serial, model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-bold uppercase">
              Category
            </span>
            <select
              id="filter-category"
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/60 rounded-lg text-xs py-1.5 px-2 text-white focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Computing">Computing</option>
              <option value="Media Equipment">Media Equipment</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Vehicles">Vehicles</option>
            </select>
          </div>

          {/* Department */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-bold uppercase">
              Division
            </span>
            <select
              id="filter-department"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/60 rounded-lg text-xs py-1.5 px-2 text-white focus:outline-none"
            >
              <option value="All">All Divisions</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.code}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-bold uppercase">
              Status
            </span>
            <select
              id="filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/60 rounded-lg text-xs py-1.5 px-2 text-white focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Allocated">Allocated</option>
              <option value="In Maintenance">In Maintenance</option>
              <option value="Retired">Retired</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700/60">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"}`}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"}`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List Display */}
      {filteredAssets.length === 0 ? (
        <div className="py-16 text-center bg-slate-800/10 border border-dashed border-slate-800 rounded-2xl">
          <Info className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-400">
            No Assets Match Your Query
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your filters or search keywords.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div
          id="assets-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden flex flex-col hover:border-slate-600 transition-all shadow group"
            >
              <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                <img
                  src={asset.image}
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                <span
                  className={`absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${getStatusBadge(asset.status)}`}
                >
                  {asset.status}
                </span>
                <span className="absolute bottom-3 left-3 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950/80 border border-slate-800 text-slate-400">
                  {asset.serialNumber}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase">
                    <Tag className="h-3 w-3 text-slate-500" />
                    <span>{asset.category}</span>
                    {asset.model && asset.model !== "N/A" && (
                      <span className="text-slate-500">({asset.model})</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1 group-hover:text-blue-400 transition-colors">
                    {asset.name}
                  </h3>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-400 border-t border-slate-800/50 pt-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-slate-500" />
                    <span className="truncate">{asset.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-500" />
                    <span className="truncate">{asset.location}</span>
                  </div>
                  {asset.assignedTo && (
                    <div className="flex items-center gap-2 text-blue-300 font-medium">
                      <UserIcon className="h-3.5 w-3.5 text-blue-400" />
                      <span className="truncate">
                        Custodian: {asset.assignedTo}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/50 pt-3 text-xs">
                  <span className="text-slate-500 font-medium">Value</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    ${asset.purchaseValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          id="assets-list"
          className="bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Asset Details</th>
                  <th className="py-3 px-4">Serial Number</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Custodian</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Purchase Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="hover:bg-slate-850/35 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={asset.image}
                          alt={asset.name}
                          className="h-8 w-8 rounded object-cover border border-slate-700 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">
                            {asset.name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {asset.model}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {asset.serialNumber}
                    </td>
                    <td className="py-3 px-4">{asset.category}</td>
                    <td className="py-3 px-4 font-medium">
                      {asset.department}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {asset.location}
                    </td>
                    <td className="py-3 px-4 font-medium text-blue-300">
                      {asset.assignedTo || "-- Pool --"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold border ${getStatusBadge(asset.status)}`}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400">
                      ${asset.purchaseValue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
