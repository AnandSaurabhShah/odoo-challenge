import React, { useState } from 'react';
import { 
  FileClock, 
  Bell, 
  Search, 
  Trash2, 
  CheckCheck, 
  Layers, 
  ArrowLeftRight, 
  Wrench, 
  CalendarDays,
  ShieldAlert,
  Info
} from 'lucide-react';

export default function LogsNotificationsView({ 
  logs, 
  notifications, 
  onMarkNotificationRead, 
  onClearNotifications 
}) {
  const [logSearch, setLogSearch] = useState('');
  const [logCategory, setLogCategory] = useState('All');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(logSearch.toLowerCase()) ||
                          log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
                          log.user.toLowerCase().includes(logSearch.toLowerCase());
    const matchesCat = logCategory === 'All' || log.category === logCategory;
    return matchesSearch && matchesCat;
  });

  const getLogIcon = (cat) => {
    switch (cat) {
      case 'Asset':
        return <Layers className="h-4 w-4 text-blue-400" />;
      case 'Transfer':
        return <ArrowLeftRight className="h-4 w-4 text-indigo-400" />;
      case 'Maintenance':
        return <Wrench className="h-4 w-4 text-amber-400" />;
      case 'Booking':
        return <CalendarDays className="h-4 w-4 text-emerald-400" />;
      default:
        return <FileClock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getNotificationBadgeColor = (type) => {
    switch (type) {
      case 'warning': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 id="logs-view-title" className="text-xl font-bold text-white tracking-tight">Audit Trails & Notifications</h1>
        <p className="text-xs text-slate-400">Review absolute system telemetry logs, operational history events, and clear unread warning cards.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns (Span 2): Absolute System Telemetry Logs */}
        <div id="logs-column" className="lg:col-span-2 bg-slate-800/40 border border-slate-700/40 p-6 rounded-2xl flex flex-col">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileClock className="h-4.5 w-4.5 text-blue-400" />
                Historical Event Registry
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Absolute immutable logs of inventory movements and updates.</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                id="filter-log-category"
                value={logCategory}
                onChange={(e) => setLogCategory(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg text-xs py-1.5 px-2 text-white focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Asset">Asset Nodes</option>
                <option value="Transfer">Transfers</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Booking">Bookings</option>
              </select>
            </div>
          </div>

          {/* Search box */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              id="search-logs-input"
              type="text"
              placeholder="Filter logs by details, username, transaction type..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Logs List */}
          <div className="flex-1 space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs italic">
                No matching logs found.
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-800 border border-slate-700/40 rounded-xl flex items-start gap-3 hover:border-slate-600/70 transition-all">
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg flex-shrink-0">
                    {getLogIcon(log.category)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white">{log.action}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{log.details}</p>
                    <span className="inline-block text-[10px] text-slate-500 mt-1.5 font-medium">
                      Executed by <strong className="text-slate-400">{log.user}</strong>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Alerts & Active Notifications panel */}
        <div id="notifications-column" className="bg-slate-800/40 border border-slate-700/40 p-6 rounded-2xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Bell className="h-4.5 w-4.5 text-amber-400" />
                Active Alerts Panel
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time status updates.</p>
            </div>

            {notifications.length > 0 && (
              <button
                id="btn-clear-notifications"
                onClick={onClearNotifications}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded transition-colors"
                title="Clear All Notifications"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex-1 space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs italic flex flex-col items-center justify-center">
                <CheckCheck className="h-8 w-8 text-emerald-500/60 mb-2" />
                <span>All caught up! No unread alerts.</span>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  id={`notification-${notif.id}`}
                  className={`p-4 border rounded-xl space-y-2 relative transition-all ${
                    notif.read 
                      ? 'bg-slate-900/20 border-slate-800/80 text-slate-500' 
                      : 'bg-slate-850 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold border uppercase tracking-wider ${getNotificationBadgeColor(notif.type)}`}>
                      {notif.type}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">{notif.timestamp.split(' ')[1]}</span>
                  </div>

                  <div>
                    <h4 className={`text-xs font-bold leading-tight ${notif.read ? 'text-slate-500' : 'text-white'}`}>
                      {notif.title}
                    </h4>
                    <p className={`text-[11px] mt-1 ${notif.read ? 'text-slate-500' : 'text-slate-400'}`}>
                      {notif.message}
                    </p>
                  </div>

                  {!notif.read && (
                    <button
                      id={`btn-read-notification-${notif.id}`}
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className="absolute top-3 right-3 text-slate-500 hover:text-emerald-400"
                      title="Mark as Read"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
