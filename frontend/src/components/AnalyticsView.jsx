import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Award,
  DollarSign,
  ShieldAlert,
  Info,
} from "lucide-react";

export default function AnalyticsView({ assets, departments }) {
  // 1. Compute Department Allocations dynamically
  const deptData = departments.map((dept) => {
    // calculate actual value sum from assets dynamically
    const deptAssets = assets.filter((a) => a.department === dept.name);
    const valueSum = deptAssets.reduce((sum, a) => sum + a.purchaseValue, 0);
    return {
      name: dept.code,
      fullName: dept.name,
      Value: valueSum,
      Count: deptAssets.length,
    };
  });

  // 2. Compute Category Distributions
  const categories = [
    "Computing",
    "Media Equipment",
    "Infrastructure",
    "Vehicles",
  ];
  const categoryData = categories.map((cat) => {
    const catAssets = assets.filter((a) => a.category === cat);
    const valueSum = catAssets.reduce((sum, a) => sum + a.purchaseValue, 0);
    return {
      name: cat,
      Value: valueSum,
      Count: catAssets.length,
    };
  });

  // 3. Compute Status Distributions
  const statuses = ["Active", "Allocated", "In Maintenance", "Retired"];
  const statusData = statuses.map((st) => {
    return {
      name: st,
      Count: assets.filter((a) => a.status === st).length,
    };
  });

  const COLORS = ["#3b82f6", "#6366f1", "#ec4899", "#f59e0b", "#10b981"];

  // Overall calculations
  const totalValue = assets.reduce((sum, a) => sum + a.purchaseValue, 0);
  const avgValue =
    assets.length > 0 ? Math.round(totalValue / assets.length) : 0;
  const mostExpensiveAsset = [...assets].sort(
    (a, b) => b.purchaseValue - a.purchaseValue,
  )[0];

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1
          id="analytics-title"
          className="text-xl font-bold text-white tracking-tight"
        >
          Analytics & Intelligence
        </h1>
        <p className="text-xs text-slate-400">
          Review real-time asset capital values, structural class breakdowns,
          and division logistics telemetry.
        </p>
      </div>

      {/* Top row: Summary widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/40 border border-slate-700/40 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">
              Total Capital Under Monitoring
            </span>
            <span className="block text-lg font-black text-white mt-0.5">
              ${totalValue.toLocaleString()} USD
            </span>
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/40 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">
              Average Hardware Value
            </span>
            <span className="block text-lg font-black text-white mt-0.5">
              ${avgValue.toLocaleString()} USD / Unit
            </span>
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/40 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-600/10 text-amber-400 border border-amber-500/20 rounded-xl">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">
              Highest Capital Node
            </span>
            <span className="block text-xs font-bold text-white mt-1 truncate max-w-[200px]">
              {mostExpensiveAsset ? mostExpensiveAsset.name : "N/A"}
            </span>
            <span className="block text-[10px] text-emerald-400 font-semibold mt-0.5">
              $
              {mostExpensiveAsset
                ? mostExpensiveAsset.purchaseValue.toLocaleString()
                : "0"}
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Bento Grid Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Capital value per department */}
        <div
          id="chart-dept-value"
          className="bg-slate-800/30 border border-slate-800 p-6 rounded-2xl flex flex-col"
        >
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white">
              Division Value Allocation
            </h3>
            <p className="text-xs text-slate-400">
              Total capital cost value of assets locked under each division
            </p>
          </div>
          <div className="h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={deptData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                  }}
                  labelStyle={{
                    color: "#94a3b8",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                  itemStyle={{ color: "#ffffff", fontSize: "12px" }}
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    "Total Capital Value",
                  ]}
                />
                <Bar dataKey="Value" radius={[6, 6, 0, 0]}>
                  {deptData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category volume distribution */}
        <div
          id="chart-category-dist"
          className="bg-slate-800/30 border border-slate-800 p-6 rounded-2xl flex flex-col"
        >
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white">
              Asset Classification Distribution
            </h3>
            <p className="text-xs text-slate-400">
              Quantity distribution of hardware nodes based on class tags
            </p>
          </div>
          <div className="h-72 w-full mt-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="Count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                  }}
                  itemStyle={{ color: "#ffffff", fontSize: "12px" }}
                  formatter={(value, name) => [`${value} Units`, name]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Active vs Maintenance statuses */}
        <div
          id="chart-status-breakdown"
          className="bg-slate-800/30 border border-slate-800 p-6 rounded-2xl flex flex-col"
        >
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white">
              Asset Status Telemetry
            </h3>
            <p className="text-xs text-slate-400">
              Breakdown of inventory nodes by current operational status
            </p>
          </div>
          <div className="h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusData}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <XAxis
                  type="number"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                  }}
                  itemStyle={{ color: "#ffffff", fontSize: "12px" }}
                  formatter={(value) => [`${value} Units`, "Quantity"]}
                />
                <Bar dataKey="Count" radius={[0, 4, 4, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[(index + 2) % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Asset purchase value scale distribution */}
        <div
          id="chart-value-density"
          className="bg-slate-800/30 border border-slate-800 p-6 rounded-2xl flex flex-col"
        >
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white">
              Capital Concentration Mapping
            </h3>
            <p className="text-xs text-slate-400">
              Value of assets concentrated under categories
            </p>
          </div>
          <div className="h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={categoryData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                  }}
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    "Concentration Value",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="Value"
                  stroke="#6366f1"
                  fillOpacity={0.2}
                  fill="#6366f1"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
