"use client";
import React, { useState, useEffect } from 'react';
import { 
  Activity, Map as MapIcon, AlertTriangle, Wind, 
  Database, Download, Menu, X, CheckCircle, 
  ChevronRight, Search, Bell, User, CloudLightning,
  Settings, Layers, TrendingUp, ShieldAlert, Zap
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// --- MOCK DATA ---
const facilityData = {
  id: "FAC-992A",
  name: "Permian Basin Extraction Site Alpha",
  location: "Midland, Texas, USA",
  coordinates: "31.9973° N, 102.0779° W",
  status: "Critical",
  riskScore: 84,
  lastUpdated: "Just now",
  currentEmission: 450.2, // kg/hr
  avgEmission24h: 180.5,
  peakEmission: 620.8,
  confidence: 96,
  totalAlerts: 12,
  investigated: false
};

const historicalData = [
  { time: '00:00', emission: 120, baseline: 50 },
  { time: '04:00', emission: 135, baseline: 50 },
  { time: '08:00', emission: 190, baseline: 50 },
  { time: '10:00', emission: 450, baseline: 50 }, // Spike
  { time: '12:00', emission: 620, baseline: 50 }, // Peak
  { time: '16:00', emission: 380, baseline: 50 },
  { time: '20:00', emission: 210, baseline: 50 },
  { time: '24:00', emission: 150, baseline: 50 },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  intensity: Math.floor(Math.random() * 50) + (i > 9 && i < 15 ? 150 : 20)
}));

const logsData = [
  { id: 'ALT-101', time: '12:05 PM', severity: 'Critical', value: '620.8 kg/hr', conf: '98%', status: 'Unresolved' },
  { id: 'ALT-100', time: '10:15 AM', severity: 'High', value: '450.2 kg/hr', conf: '95%', status: 'Investigating' },
  { id: 'ALT-099', time: '08:30 AM', severity: 'Moderate', value: '190.0 kg/hr', conf: '88%', status: 'Resolved' },
  { id: 'ALT-098', time: 'Yesterday', severity: 'Low', value: '85.5 kg/hr', conf: '92%', status: 'Resolved' },
  { id: 'ALT-097', time: 'Yesterday', severity: 'Moderate', value: '140.2 kg/hr', conf: '90%', status: 'Resolved' },
];

const riskDistribution = [
  { name: 'Equipment Leak', value: 45 },
  { name: 'Venting', value: 30 },
  { name: 'Flaring Issue', value: 15 },
  { name: 'Unknown', value: 10 },
];

const COLORS = {
  safe: '#10b981', // emerald-500
  warning: '#f59e0b', // amber-500
  critical: '#ef4444', // red-500
  info: '#0ea5e9', // sky-500
  accent: '#06b6d4', // cyan-500
  dark: '#0f172a',
  panel: 'rgba(30, 41, 59, 0.7)', // slate-800 with opacity
  border: 'rgba(255, 255, 255, 0.08)'
};

// --- COMPONENTS ---

const Badge = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    safe: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const MetricCard = ({ title, value, unit, icon: Icon, trend, trendValue, variant = 'info' }) => {
  const glowColors = {
    critical: 'shadow-[0_0_30px_-10px_rgba(239,68,68,0.4)] border-red-500/30',
    warning: 'shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)] border-amber-500/30',
    info: 'shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] border-cyan-500/30',
    safe: 'shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)] border-white/5',
  };

  const textColors = {
    critical: 'text-red-400',
    warning: 'text-amber-400',
    info: 'text-cyan-400',
    safe: 'text-emerald-400',
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-md border ${glowColors[variant]} p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-800/80 group`}>
      {/* Background abstract shape */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 bg-current ${textColors[variant]}`}></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="text-slate-400 text-sm font-medium">{title}</div>
        <div className={`p-2 rounded-lg bg-white/5 border border-white/5 ${textColors[variant]}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="relative z-10">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
          {unit && <span className="text-slate-400 text-sm">{unit}</span>}
        </div>
        {trendValue && (
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {trend === 'up' ? (
              <span className="text-red-400 flex items-center bg-red-400/10 px-1.5 py-0.5 rounded">
                <TrendingUp size={12} className="mr-1" /> +{trendValue}
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center bg-emerald-400/10 px-1.5 py-0.5 rounded">
                <TrendingUp size={12} className="mr-1 transform rotate-180" /> -{trendValue}
              </span>
            )}
            <span className="text-slate-500">vs last 24h</span>
          </div>
        )}
      </div>
    </div>
  );
};

const RiskGauge = ({ score }) => {
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const strokeDasharray = `${(normalizedScore / 100) * 283} 283`;
  
  let colorClass = "text-emerald-500";
  if (score > 60) colorClass = "text-amber-500";
  if (score > 80) colorClass = "text-red-500";

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background track */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        {/* Progress */}
        <circle 
          cx="50" cy="50" r="45" fill="none" 
          stroke="currentColor" strokeWidth="8" 
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${colorClass}`}
          style={{ strokeDasharray, strokeDashoffset: 0 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-white">{score}</span>
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Risk Score</span>
      </div>
    </div>
  );
};

// Abstract Telemetry Map Component
const TelemetryMap = () => {
  return (
    <div className="relative w-full h-full bg-[#08080c] rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center">
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>
      
      {/* Abstract map shapes */}
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 800 400" preserveAspectRatio="none">
        <path d="M 0,200 Q 150,100 300,250 T 600,150 T 800,200 L 800,400 L 0,400 Z" fill="rgba(6, 182, 212, 0.05)" />
        <path d="M 0,250 Q 200,150 400,280 T 800,220 L 800,400 L 0,400 Z" fill="rgba(6, 182, 212, 0.03)" />
        <path d="M -50,100 C 150,300 350,-50 550,150 S 750,-50 850,100" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" />
      </svg>

      {/* Crosshairs */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-cyan-500/20 rounded-full flex items-center justify-center">
        <div className="w-32 h-32 border border-cyan-500/10 rounded-full"></div>
        <div className="absolute w-full h-[1px] bg-cyan-500/20"></div>
        <div className="absolute h-full w-[1px] bg-cyan-500/20"></div>
      </div>

      {/* Target Marker & Plume */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group">
        {/* Heatmap Plume simulation */}
        <div className="absolute top-0 right-0 w-48 h-32 bg-red-500/30 blur-[40px] rounded-full mix-blend-screen origin-bottom-left transform -translate-x-8 -translate-y-12 rotate-[-20deg] animate-pulse"></div>
        <div className="absolute top-0 right-0 w-24 h-16 bg-amber-400/40 blur-[20px] rounded-full mix-blend-screen origin-bottom-left transform -translate-x-4 -translate-y-8 rotate-[-15deg]"></div>
        
        {/* Core marker */}
        <div className="relative">
          <div className="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)] z-20"></div>
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full mb-4 w-48 bg-slate-900/90 backdrop-blur border border-red-500/30 rounded-lg p-3 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
          <div className="text-xs text-red-400 font-bold mb-1 flex items-center gap-1">
            <AlertTriangle size={12}/> Critical Emitter
          </div>
          <div className="text-white text-sm font-medium">{facilityData.coordinates}</div>
          <div className="text-slate-400 text-xs mt-1">Est. Source: Sector 4 Valve</div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="w-8 h-8 bg-slate-800/80 backdrop-blur border border-white/10 rounded hover:bg-slate-700 flex items-center justify-center text-white transition-colors">+</button>
        <button className="w-8 h-8 bg-slate-800/80 backdrop-blur border border-white/10 rounded hover:bg-slate-700 flex items-center justify-center text-white transition-colors">-</button>
      </div>
      
      {/* Legend overlay */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-lg p-3 z-10">
        <div className="text-xs font-medium text-slate-300 mb-2">Plume Concentration</div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span>Low</span>
          <div className="w-24 h-1.5 rounded-full bg-gradient-to-r from-emerald-500/50 via-amber-500/70 to-red-500"></div>
          <span>High</span>
        </div>
      </div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isInvestigating, setIsInvestigating] = useState(facilityData.investigated);
  const [timeRange, setTimeRange] = useState('24H');

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
      {/* Global Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #030712; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #334155; }
        .bg-grid {
          background-size: 30px 30px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        }
      `}} />

      {/* TOP NAVBAR */}
      <header className="h-16 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 z-50 shrink-0">
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

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden md:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search facilities..." 
              className="bg-slate-900/50 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 w-64 transition-colors"
            />
          </div>
          <button className="p-2 relative text-slate-400 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
            <User size={16} className="text-slate-400" />
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid pointer-events-none z-0"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
        
        {/* SIDEBAR */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'} transition-all duration-300 ease-in-out border-r border-white/5 bg-[#0a0a0f]/90 backdrop-blur-xl z-40 flex flex-col shrink-0 absolute lg:relative h-full`}>
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">Main Menu</div>
            {[
              { icon: Activity, label: 'Dashboard' },
              { icon: AlertTriangle, label: 'Alerts', badge: '3' },
              { icon: MapIcon, label: 'Facilities', active: true },
              { icon: Database, label: 'API Data' },
            ].map((item, idx) => (
              <a key={idx} href="#" className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                item.active 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}>
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {item.badge && <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-bold">{item.badge}</span>}
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
        <main className="flex-1 overflow-y-auto relative z-10 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
            
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-slate-900/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="critical" className="animate-pulse flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    LIVE MONITORING
                  </Badge>
                  <span className="text-slate-500 text-sm flex items-center gap-1"><MapIcon size={14}/> {facilityData.location}</span>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-2">{facilityData.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5"><Database size={14}/> ID: {facilityData.id}</span>
                    <span className="flex items-center gap-1.5"><Activity size={14}/> Updated: {facilityData.lastUpdated}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <RiskGauge score={facilityData.riskScore} />
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setIsInvestigating(!isInvestigating)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 border ${
                      isInvestigating 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                        : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {isInvestigating ? <CheckCircle size={16} /> : <ShieldAlert size={16} />}
                    {isInvestigating ? 'Investigation Active' : 'Mark to Investigate'}
                  </button>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium bg-cyan-600 hover:bg-cyan-500 text-white transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <Download size={16} /> Data Report
                  </button>
                </div>
              </div>
            </div>

            {/* --- METRICS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <MetricCard 
                title="Current Emission" 
                value={facilityData.currentEmission} 
                unit="kg/hr" 
                icon={Wind} 
                trend="up" 
                trendValue="12%" 
                variant="critical" 
              />
              <MetricCard 
                title="24h Average" 
                value={facilityData.avgEmission24h} 
                unit="kg/hr" 
                icon={Activity} 
                variant="warning" 
              />
              <MetricCard 
                title="Peak Recorded" 
                value={facilityData.peakEmission} 
                unit="kg/hr" 
                icon={Zap} 
                variant="info" 
              />
              <MetricCard 
                title="AI Confidence" 
                value={`${facilityData.confidence}%`} 
                icon={CheckCircle} 
                variant="safe" 
              />
              <div className="hidden xl:block">
                 <MetricCard 
                  title="Total Alerts" 
                  value={facilityData.totalAlerts} 
                  icon={AlertTriangle} 
                  variant="warning" 
                />
              </div>
            </div>

            {/* --- MIDDLE SECTION: MAP & BREAKDOWN --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[400px]">
              {/* Telemetry Map */}
              <div className="lg:col-span-2 relative h-[300px] lg:h-full group rounded-2xl overflow-hidden border border-white/5 bg-slate-900/40">
                <div className="absolute top-4 left-4 z-20 font-semibold text-white flex items-center gap-2">
                   <MapIcon size={18} className="text-cyan-400"/> Sector Telemetry
                </div>
                <TelemetryMap />
              </div>

              {/* Risk Breakdown */}
              <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500" /> Source Probability
                </h3>
                <div className="flex-1 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={[COLORS.critical, COLORS.warning, COLORS.info, COLORS.safe][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-white">45%</span>
                    <span className="text-[10px] text-slate-400 uppercase text-center w-20 leading-tight">Eqp. Leak<br/>Likely</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {riskDistribution.slice(0,3).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: [COLORS.critical, COLORS.warning, COLORS.info][idx]}}></div>
                        {item.name}
                      </div>
                      <span className="font-mono text-slate-400">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* --- ANALYTICS SECTION --- */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <TrendingUp size={18} className="text-cyan-400" /> Emission Analytics
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Real-time kg/hr flow vs established baseline</p>
                </div>
                
                {/* Time Controls */}
                <div className="flex bg-slate-900 border border-white/10 rounded-lg p-1">
                  {['1H', '24H', '7D', '30D'].map(range => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        timeRange === range 
                          ? 'bg-white/10 text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEmission" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.critical} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={COLORS.critical} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.safe} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={COLORS.safe} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                      labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="baseline" stroke={COLORS.safe} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorBaseline)" name="Baseline" />
                    <Area type="monotone" dataKey="emission" stroke={COLORS.critical} strokeWidth={3} fillOpacity={1} fill="url(#colorEmission)" name="Detected Emission" activeDot={{ r: 6, fill: COLORS.critical, stroke: '#fff', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* --- HISTORICAL LOGS --- */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-md overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Database size={18} className="text-slate-400" /> Event Logs
                </h3>
                <button className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
                  View All <ChevronRight size={14} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-900/50 text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-medium">Alert ID</th>
                      <th className="px-6 py-4 font-medium">Timestamp</th>
                      <th className="px-6 py-4 font-medium">Severity</th>
                      <th className="px-6 py-4 font-medium">Detected Value</th>
                      <th className="px-6 py-4 font-medium">AI Confidence</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {logsData.map((log, idx) => (
                      <tr 
                        key={log.id} 
                        className={`transition-colors hover:bg-white/5 ${log.severity === 'Critical' ? 'bg-red-500/5' : ''}`}
                      >
                        <td className="px-6 py-4 font-mono text-slate-400">{log.id}</td>
                        <td className="px-6 py-4">{log.time}</td>
                        <td className="px-6 py-4">
                          <Badge variant={log.severity.toLowerCase()}>{log.severity}</Badge>
                        </td>
                        <td className="px-6 py-4 font-medium text-white">{log.value}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-500 rounded-full" style={{width: log.conf}}></div>
                            </div>
                            <span className="text-xs text-slate-400">{log.conf}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-1.5 text-xs font-medium ${
                            log.status === 'Resolved' ? 'text-emerald-400' : 
                            log.status === 'Investigating' ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {log.status === 'Resolved' ? <CheckCircle size={12}/> : 
                             log.status === 'Investigating' ? <Activity size={12}/> : <AlertTriangle size={12}/>}
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}