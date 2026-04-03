"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, Map as MapIcon, AlertTriangle, Wind, 
  Database, Download, Menu, X, CheckCircle, 
  ChevronRight, Search, Bell, User, CloudLightning,
  Settings, Layers, TrendingUp, ShieldAlert, Zap,
  Filter, Clock, SlidersHorizontal, MapPin, Eye,
  RefreshCw, BarChart2
} from "lucide-react";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

// --- MOCK DATA ---
const INITIAL_ALERTS = [
  { id: 'ALT-1042', location: 'Permian Basin Sector 4', coords: '31.9973° N, 102.0779° W', severity: 'High', value: 850.4, conf: 98, time: '2 min ago', type: 'Equipment Leak', status: 'Unread' },
  { id: 'ALT-1041', location: 'Marcellus Shale Site B', coords: '41.2033° N, 77.1945° W', severity: 'Medium', value: 340.2, conf: 85, time: '14 min ago', type: 'Venting', status: 'Unread' },
  { id: 'ALT-1040', location: 'Eagle Ford Facility 9', coords: '28.4381° N, 99.8032° W', severity: 'High', value: 620.1, conf: 95, time: '32 min ago', type: 'Flaring Issue', status: 'Reviewed' },
  { id: 'ALT-1039', location: 'Bakken Extraction Alpha', coords: '48.1120° N, 102.8055° W', severity: 'Low', value: 110.5, conf: 72, time: '1 hr ago', type: 'Unknown', status: 'Unread' },
  { id: 'ALT-1038', location: 'Permian Basin Sector 1', coords: '31.8521° N, 102.1054° W', severity: 'Medium', value: 290.8, conf: 88, time: '2 hrs ago', type: 'Equipment Leak', status: 'Reviewed' },
  { id: 'ALT-1037', location: 'Anadarko Basin Site X', coords: '35.4676° N, 97.5164° W', severity: 'Low', value: 95.2, conf: 65, time: '3 hrs ago', type: 'Venting', status: 'Reviewed' },
];

const ALERTS_OVER_TIME = [
  { time: '00:00', high: 1, medium: 3, low: 5 },
  { time: '04:00', high: 0, medium: 2, low: 4 },
  { time: '08:00', high: 2, medium: 5, low: 8 },
  { time: '12:00', high: 5, medium: 8, low: 12 },
  { time: '16:00', high: 3, medium: 6, low: 9 },
  { time: '20:00', high: 1, medium: 4, low: 6 },
];

const SEVERITY_DISTRIBUTION = [
  { name: 'High', value: 12 },
  { name: 'Medium', value: 28 },
  { name: 'Low', value: 44 },
];

const ALERT_TREND_DATA = [
  { time: '-60m', val: 400 },
  { time: '-50m', val: 450 },
  { time: '-40m', val: 420 },
  { time: '-30m', val: 580 },
  { time: '-20m', val: 720 },
  { time: '-10m', val: 810 },
  { time: 'Now', val: 850 },
];

const COLORS = {
  high: '#ef4444', // red-500
  medium: '#f59e0b', // amber-500
  low: '#10b981', // emerald-500
  info: '#0ea5e9', // sky-500
  panel: 'rgba(15, 23, 42, 0.8)',
};

// --- COMPONENTS ---

const Badge = ({ severity, className = '' }) => {
  const styles = {
    High: 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${styles[severity]} ${className}`}>
      {severity}
    </span>
  );
};

const SummaryCard = ({ title, value, subtitle, icon: Icon, type }) => {
  const styles = {
    total: 'border-cyan-500/20 shadow-[0_0_20px_-5px_rgba(6,182,212,0.2)] text-cyan-400',
    high: 'border-red-500/30 shadow-[0_0_25px_-5px_rgba(239,68,68,0.3)] text-red-400',
    medium: 'border-amber-500/20 shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)] text-amber-400',
    low: 'border-emerald-500/20 shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)] text-emerald-400',
    conf: 'border-purple-500/20 shadow-[0_0_20px_-5px_rgba(168,85,247,0.2)] text-purple-400',
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-md border p-5 transition-all duration-300 hover:-translate-y-1 group ${styles[type]}`}>
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-10 bg-current`}></div>
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</div>
        <div className={`p-1.5 rounded-lg bg-white/5 border border-white/10 text-current`}>
          <Icon size={16} />
        </div>
      </div>
      <div className="relative z-10">
        <div className="text-3xl font-black text-white tracking-tight">{value}</div>
        {subtitle && <div className="text-slate-500 text-xs mt-1">{subtitle}</div>}
      </div>
    </div>
  );
};

const MiniTelemetryMap = () => (
  <div className="relative w-full h-48 bg-[#08080c] rounded-xl overflow-hidden border border-white/5 flex items-center justify-center mt-4 mb-6">
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
    {/* Map scanning effect */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-[200%] animate-[scan_3s_linear_infinite] pointer-events-none"></div>
    {/* Target */}
    <div className="relative z-10 flex flex-col items-center">
      <div className="absolute w-24 h-24 bg-red-500/20 blur-xl rounded-full mix-blend-screen animate-pulse"></div>
      <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)] z-20"></div>
      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
      {/* Radar rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-cyan-500/30 rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-cyan-500/20 rounded-full"></div>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('24h');
  const [highConfOnly, setHighConfOnly] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate incoming live alerts
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      const isHigh = Math.random() > 0.8;
      const newAlert = {
        id: `ALT-${Math.floor(Math.random() * 9000) + 1000}`,
        location: `Detected Anomaly Sector ${Math.floor(Math.random() * 99)}`,
        coords: `${(30 + Math.random() * 20).toFixed(4)}° N, ${(90 + Math.random() * 20).toFixed(4)}° W`,
        severity: isHigh ? 'High' : (Math.random() > 0.5 ? 'Medium' : 'Low'),
        value: (Math.random() * 800 + 50).toFixed(1),
        conf: Math.floor(Math.random() * 30) + 70,
        time: 'Just now',
        type: 'Real-time Detection',
        status: 'Unread',
        isNew: true // For entrance animation
      };
      setAlerts(prev => [newAlert, ...prev].slice(0, 50)); // Keep last 50
    }, 12000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Derived state
  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      const matchSearch = a.location.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase());
      const matchSeverity = severityFilter === 'All' || a.severity === severityFilter;
      const matchConf = !highConfOnly || a.conf >= 90;
      return matchSearch && matchSeverity && matchConf;
    });
  }, [alerts, search, severityFilter, highConfOnly]);

  const stats = useMemo(() => ({
    total: alerts.length,
    high: alerts.filter(a => a.severity === 'High').length,
    medium: alerts.filter(a => a.severity === 'Medium').length,
    low: alerts.filter(a => a.severity === 'Low').length,
    avgConf: Math.round(alerts.reduce((acc, curr) => acc + curr.conf, 0) / alerts.length) || 0
  }), [alerts]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
      {/* Global Styles for Custom Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #334155; }
        .bg-grid {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(50%); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in { animation: slideInUp 0.4s ease-out forwards; }
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(239, 68, 68, 0.3); box-shadow: 0 0 15px rgba(239, 68, 68, 0.1); }
          50% { border-color: rgba(239, 68, 68, 0.8); box-shadow: 0 0 25px rgba(239, 68, 68, 0.4); }
        }
        .pulse-critical { animation: pulse-border 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}} />

      {/* TOP NAVBAR */}
      <header className="h-16 border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <CloudLightning size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white hidden sm:block">Methane<span className="text-cyan-400 font-light">Guardian AI</span></span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-2 bg-slate-900/50 border border-white/10 rounded-full px-3 py-1.5 hidden md:flex">
            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
            <span className="text-xs font-medium text-slate-400 mr-2">Live Stream</span>
            <button onClick={() => setAutoRefresh(!autoRefresh)} className="text-slate-500 hover:text-white transition-colors" title="Toggle Auto-Refresh">
              <RefreshCw size={14} className={autoRefresh ? 'animate-[spin_3s_linear_infinite]' : ''} />
            </button>
          </div>
          <button className="p-2 relative text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full border border-white/5">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-[#0a0a0f] rounded-full"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer hover:border-cyan-500/50 transition-colors">
            <User size={16} className="text-slate-400" />
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid pointer-events-none z-0 opacity-50"></div>
        <div className="absolute top-0 left-1/3 w-[800px] h-[600px] bg-red-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
        
        {/* SIDEBAR */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'} transition-all duration-300 ease-in-out border-r border-white/5 bg-[#0a0a0f]/90 backdrop-blur-xl z-40 flex flex-col shrink-0 absolute lg:relative h-full`}>
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">Main Menu</div>
            {[
              { icon: Activity, label: 'Dashboard' },
              { icon: AlertTriangle, label: 'Alerts', badge: stats.high > 0 ? stats.high : null, active: true },
              { icon: MapIcon, label: 'Facilities' },
              { icon: Database, label: 'API Data' },
            ].map((item, idx) => (
              <a key={idx} href="#" className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                item.active 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}>
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {item.badge && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-[0_0_10px_rgba(239,68,68,0.5)]">{item.badge}</span>}
              </a>
            ))}
            
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-4 px-3">System</div>
            {[
              { icon: Settings, label: 'Settings' },
              { icon: Layers, label: 'About' },
            ].map((item, idx) => (
              <a key={idx} href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all">
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto relative z-10 p-4 lg:p-6 xl:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">Real-Time Alerts</h1>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Live</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm">Live anomaly detection from satellite and AI models</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 border border-white/10 hover:bg-slate-700 text-white transition-all flex items-center gap-2">
                  <Download size={16} /> Export CSV
                </button>
              </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              <SummaryCard type="total" title="Total Today" value={stats.total} icon={Database} subtitle="+12% vs yesterday" />
              <SummaryCard type="high" title="High Severity" value={stats.high} icon={AlertTriangle} subtitle="Requires action" />
              <SummaryCard type="medium" title="Medium" value={stats.medium} icon={Wind} subtitle="Under observation" />
              <SummaryCard type="low" title="Low Severity" value={stats.low} icon={CheckCircle} subtitle="Background noise" />
              <SummaryCard type="conf" title="Avg Confidence" value={`${stats.avgConf}%`} icon={Zap} subtitle="AI precision metric" />
            </div>

            {/* CHARTS & FILTERS ROW */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Filter Panel (Col 1) */}
              <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-cyan-400" /> Control Panel
                </h3>
                
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search locations or IDs..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 mb-1.5 block">Severity</label>
                    <select 
                      value={severityFilter}
                      onChange={(e) => setSeverityFilter(e.target.value)}
                      className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-cyan-500/50 text-white appearance-none"
                    >
                      <option value="All">All Levels</option>
                      <option value="High">High Only</option>
                      <option value="Medium">Medium Only</option>
                      <option value="Low">Low Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1.5 block">Time Range</label>
                    <select 
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-cyan-500/50 text-white appearance-none"
                    >
                      <option value="1h">Last 1 Hour</option>
                      <option value="6h">Last 6 Hours</option>
                      <option value="24h">Last 24 Hours</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-950/30 cursor-pointer hover:bg-slate-900 transition-colors mt-auto">
                  <span className="text-sm text-slate-300 font-medium">High Confidence Only (&gt;90%)</span>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${highConfOnly ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                    <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${highConfOnly ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <input type="checkbox" className="hidden" checked={highConfOnly} onChange={() => setHighConfOnly(!highConfOnly)} />
                </label>
              </div>

              {/* Charts (Col 2 & 3) */}
              <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
                    <Activity size={16} className="text-cyan-400" /> Alert Volume (24h)
                  </h3>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ALERTS_OVER_TIME} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.high} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={COLORS.high} stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.medium} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={COLORS.medium} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#475569" tick={{fill: '#64748b', fontSize: 10}} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" tick={{fill: '#64748b', fontSize: 10}} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="high" stackId="1" stroke={COLORS.high} fill="url(#colorHigh)" />
                        <Area type="monotone" dataKey="medium" stackId="1" stroke={COLORS.medium} fill="url(#colorMedium)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
                    <BarChart2 size={16} className="text-cyan-400" /> Severity Breakdown
                  </h3>
                  <div className="flex-1 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={140}>
                      <PieChart>
                        <Pie data={SEVERITY_DISTRIBUTION} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={5} dataKey="value" stroke="none">
                          {SEVERITY_DISTRIBUTION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={[COLORS.high, COLORS.medium, COLORS.low][index]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Legend */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 text-xs">
                      {SEVERITY_DISTRIBUTION.map((item, idx) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: [COLORS.high, COLORS.medium, COLORS.low][idx]}}></div>
                          <span className="text-slate-300">{item.name}</span>
                          <span className="text-slate-500 font-mono ml-auto">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ALERTS FEED */}
            <div className="space-y-4 pb-10">
              <div className="flex justify-between items-center px-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock size={18} className="text-slate-400" /> Live Feed
                </h2>
                <span className="text-xs font-medium text-slate-500 bg-slate-900 px-2.5 py-1 rounded-full border border-white/5">
                  Showing {filteredAlerts.length} events
                </span>
              </div>

              {filteredAlerts.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/30 border border-white/5 rounded-2xl border-dashed">
                  <Filter size={32} className="mx-auto text-slate-600 mb-3" />
                  <p className="text-slate-400 font-medium">No alerts match current filters.</p>
                  <button onClick={() => {setSeverityFilter('All'); setSearch(''); setHighConfOnly(false);}} className="text-cyan-400 text-sm mt-2 hover:underline">Clear Filters</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {filteredAlerts.map((alert) => (
                    <div 
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      className={`group flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-slate-900/60 backdrop-blur-sm border cursor-pointer transition-all duration-300 hover:bg-slate-800/80 hover:-translate-y-0.5
                        ${alert.severity === 'High' ? 'border-red-500/30 pulse-critical' : 'border-white/5 hover:border-white/20'}
                        ${alert.isNew ? 'animate-slide-in' : ''}
                      `}
                    >
                      {/* Left: Icon & Core Info */}
                      <div className="flex gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border 
                          ${alert.severity === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                            alert.severity === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 
                            'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}
                        >
                          <AlertTriangle size={20} />
                        </div>
                        <div className="flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">{alert.location}</h3>
                            {alert.status === 'Unread' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1 font-mono"><MapPin size={10} /> {alert.coords}</span>
                            <span className="text-slate-600">•</span>
                            <span>{alert.id}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Metrics & Badges */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
                        <div className="flex flex-col items-start sm:items-end gap-1">
                          <Badge severity={alert.severity} />
                          <span className="text-[10px] text-slate-500 font-medium">{alert.time}</span>
                        </div>
                        
                        <div className="text-right min-w-[80px]">
                          <div className="text-lg font-black text-white">{alert.value}</div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider">kg/hr</div>
                        </div>

                        <div className="hidden md:flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-slate-950 border border-white/5">
                          <span className={`text-sm font-bold ${alert.conf >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{alert.conf}%</span>
                          <span className="text-[8px] text-slate-500 uppercase">Conf</span>
                        </div>
                        
                        <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ALERT DETAILS PANEL (SLIDE-OVER) */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-[#0a0a0f]/95 backdrop-blur-2xl border-l border-white/10 z-[100] transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-2xl flex flex-col ${selectedAlert ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedAlert && (
          <>
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${selectedAlert.severity === 'High' ? 'text-red-400' : selectedAlert.severity === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg tracking-tight">Alert Details</h2>
                  <p className="text-xs text-slate-400 font-mono">{selectedAlert.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAlert(null)}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Core Info Header */}
              <div>
                <Badge severity={selectedAlert.severity} className="mb-3 inline-block" />
                <h1 className="text-2xl font-black text-white mb-2">{selectedAlert.location}</h1>
                <div className="flex items-center gap-2 text-sm text-slate-400 font-mono bg-slate-900/50 p-2 rounded-lg border border-white/5">
                  <MapPin size={14} className="text-cyan-400" /> {selectedAlert.coords}
                </div>
              </div>

              <MiniTelemetryMap />

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/50 border border-white/5 p-4 rounded-xl">
                  <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Emission Rate</div>
                  <div className="text-2xl font-bold text-white flex items-baseline gap-1">
                    {selectedAlert.value} <span className="text-xs text-slate-400">kg/hr</span>
                  </div>
                </div>
                <div className="bg-slate-900/50 border border-white/5 p-4 rounded-xl">
                  <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">AI Confidence</div>
                  <div className="text-2xl font-bold text-white flex items-baseline gap-1">
                    {selectedAlert.conf}% 
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full mt-2">
                    <div className="h-full bg-cyan-500 rounded-full" style={{width: `${selectedAlert.conf}%`}}></div>
                  </div>
                </div>
                <div className="bg-slate-900/50 border border-white/5 p-4 rounded-xl col-span-2 flex justify-between items-center">
                   <div>
                     <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Classification</div>
                     <div className="text-sm font-medium text-white">{selectedAlert.type}</div>
                   </div>
                   <div className="text-right">
                     <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Time Detected</div>
                     <div className="text-sm font-medium text-white">{selectedAlert.time}</div>
                   </div>
                </div>
              </div>

              {/* Trend Chart */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3">60-Minute Trend</h3>
                <div className="h-32 bg-slate-900/30 rounded-xl border border-white/5 p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ALERT_TREND_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="time" hide />
                      <YAxis domain={['dataMin - 100', 'dataMax + 100']} hide />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                      <Line type="monotone" dataKey="val" stroke={selectedAlert.severity === 'High' ? COLORS.high : COLORS.medium} strokeWidth={3} dot={{ r: 3, fill: '#0a0a0f' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-white/10 bg-slate-950/50 grid grid-cols-2 gap-3 shrink-0">
              <button 
                onClick={() => setSelectedAlert(null)}
                className="py-3 rounded-xl text-sm font-bold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                Dismiss
              </button>
              <button 
                className="py-3 rounded-xl text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-colors flex items-center justify-center gap-2"
              >
                <Eye size={16} /> Mark Reviewed
              </button>
            </div>
          </>
        )}
      </div>

      {/* Overlay for panel */}
      {selectedAlert && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity"
          onClick={() => setSelectedAlert(null)}
        />
      )}

    </div>
  );
}