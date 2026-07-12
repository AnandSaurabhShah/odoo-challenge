import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Layers, 
  ArrowLeftRight, 
  CalendarDays, 
  Wrench, 
  ClipboardCheck, 
  BarChart3, 
  FileClock, 
  LogOut, 
  ShieldAlert,
  User as UserIcon
} from 'lucide-react';

export default function Sidebar({ currentUser, onLogout, activeScreen, setActiveScreen, notifications }) {
  const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;

  const navItems = [
    { id: 'dashboard', label: 'System Dashboard', icon: LayoutDashboard },
    { id: 'organization', label: 'Organization Setup', icon: Building2 },
    { id: 'directory', label: 'Asset Directory & Reg.', icon: Layers },
    { id: 'allocation', label: 'Allocation & Transfers', icon: ArrowLeftRight },
    { id: 'booking', label: 'Resource Booking', icon: CalendarDays },
    { id: 'maintenance', label: 'Maintenance Kanban', icon: Wrench },
    { id: 'audit', label: 'Asset Audit Cycle', icon: ClipboardCheck },
    { id: 'analytics', label: 'Analytics Insights', icon: BarChart3 },
    { id: 'logs', label: 'Logs & Notifications', icon: FileClock, badge: unreadCount > 0 ? unreadCount : undefined },
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case 'System Admin': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Department Manager': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Technician': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <aside id="sidebar-panel" className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 text-slate-300">
      {/* Sidebar Header Brand */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-blue-600/10 text-blue-400 rounded-xl border border-blue-500/20">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <span className="text-lg font-bold text-white tracking-tight">AssetFlow</span>
          <span className="block text-[10px] text-slate-500 tracking-wider uppercase font-semibold">Enterprise Suite</span>
        </div>
      </div>

      {/* User Information Profile */}
      <div className="p-4 border-b border-slate-800/60 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <img 
            id="user-avatar"
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="h-10 w-10 rounded-xl object-cover border border-slate-700"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-white truncate leading-tight">{currentUser.name}</span>
            <span className="block text-[11px] text-slate-400 truncate mt-0.5">{currentUser.department}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getRoleColor(currentUser.role)}`}>
            {currentUser.role}
          </span>
          <button 
            id="btn-logout-sidebar"
            onClick={onLogout}
            title="Log Out"
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveScreen(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive 
                  ? 'bg-blue-600/15 text-blue-400 border-l-4 border-blue-500 font-semibold' 
                  : 'hover:bg-slate-800/60 hover:text-white border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-500 flex items-center justify-between">
        <span>System Version 2.4.1</span>
        <span className="flex items-center gap-1 text-emerald-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Operational
        </span>
      </div>
    </aside>
  );
}
