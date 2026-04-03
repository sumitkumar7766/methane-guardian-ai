"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, Map as MapIcon, AlertTriangle, Database, 
  Menu, X, CheckCircle, Search, Bell, User, CloudLightning,
  Settings, Layers, RefreshCw, Copy, Download, Code, 
  Table as TableIcon, AlignLeft, Terminal, Play, 
  ArrowRight, Server, Clock, HardDrive, Wifi, Check
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';

// --- MOCK DATA ---

const MOCK_ENDPOINTS = [
  { id: 'e1', method: 'GET', path: '/api/v1/detections/live', status: 200, time: 42, type: 'Stream' },
  { id: 'e2', method: 'GET', path: '/api/v1/alerts/recent', status: 200, time: 18, type: 'JSON' },
  { id: 'e3', method: 'POST', path: '/api/v1/facilities/query', status: 201, time: 124, type: 'JSON' },
  { id: 'e4', method: 'GET', path: '/api/v1/system/health', status: 200, time: 8, type: 'JSON' },
  { id: 'e5', method: 'GET', path: '/api/v1/analytics/trends', status: 200, time: 315, type: 'JSON' },
];

const MOCK_API_RESPONSES = {
  '/api/v1/detections/live': [
    { id: "det_99482A", facilityId: "FAC-001", coordinates: [31.9973, -102.0779], emissionRate: 450.2, unit: "kg/hr", confidence: 0.96, timestamp: "2026-04-03T16:55:01Z", sensorType: "Satellite_Hyperspectral", flagged: true },
    { id: "det_99482B", facilityId: "FAC-042", coordinates: [41.2033, -77.1945], emissionRate: 12.5, unit: "kg/hr", confidence: 0.45, timestamp: "2026-04-03T16:55:04Z", sensorType: "Ground_Station", flagged: false },
    { id: "det_99482C", facilityId: "FAC-019", coordinates: [28.4381, -99.8032], emissionRate: 850.4, unit: "kg/hr", confidence: 0.99, timestamp: "2026-04-03T16:56:12Z", sensorType: "Drone_IR", flagged: true }
  ],
  '/api/v1/alerts/recent': [
    { alertId: "ALT-1042", severity: "CRITICAL", location: "Permian Sector 4", value: 850.4, threshold: 500.0, acknowledged: false },
    { alertId: "ALT-1041", severity: "WARNING", location: "Marcellus Site B", value: 340.2, threshold: 300.0, acknowledged: true }
  ],
  '/api/v1/system/health': {
    status: "healthy",
    uptime: "45d 12h 32m",
    services: {
      ingestionEngine: "operational",
      aiInference: "operational",
      database: "operational",
      websocketStream: "operational"
    },
    systemLoad: 0.42,
    activeConnections: 1284
  }
};

const LATENCY_DATA = [
  { time: '10:00', ms: 42 }, { time: '10:05', ms: 38 },
  { time: '10:10', ms: 45 }, { time: '10:15', ms: 85 },
  { time: '10:20', ms: 40 }, { time: '10:25', ms: 39 },
  { time: '10:30', ms: 42 }
];

const INITIAL_LOGS = [
  { id: 1, time: '16:55:01', level: 'INFO', msg: '200 OK GET /api/v1/detections/live', ms: 42 },
  { id: 2, time: '16:55:04', level: 'INFO', msg: '200 OK GET /api/v1/alerts/recent', ms: 18 },
  { id: 3, time: '16:56:12', level: 'WARN', msg: '429 TOO_MANY_REQUESTS POST /api/v1/facilities/query', ms: 12 },
  { id: 4, time: '16:57:00', level: 'INFO', msg: '200 OK GET /api/v1/system/health', ms: 8 },
];

// --- HELPER FUNCTIONS ---

const syntaxHighlight = (json) => {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'text-purple-400'; // number
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'text-cyan-400 font-semibold'; // key
      } else {
        cls = 'text-emerald-400'; // string
      }
    } else if (/true|false/.test(match)) {
      cls = 'text-amber-400'; // boolean
    } else if (/null/.test(match)) {
      cls = 'text-slate-500'; // null
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
};

// --- COMPONENTS ---

const MethodBadge = ({ method }) => {
  const colors = {
    GET: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    PUT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest border ${colors[method] || colors.GET}`}>
      {method}
    </span>
  );
};

const MetricCard = ({ title, value, icon: Icon, colorClass, borderClass }) => (
  <div className={`relative overflow-hidden rounded-xl bg-slate-900/80 backdrop-blur border ${borderClass} p-4 transition-all hover:bg-slate-800 flex items-center gap-4`}>
    <div className={`p-3 rounded-lg bg-slate-950 border border-white/5 ${colorClass}`}>
      <Icon size={20} />
    </div>
    <div>
      <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</div>
      <div className="text-2xl font-black text-white tracking-tight">{value}</div>
    </div>
  </div>
);

// --- MAIN APP ---

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedEndpoint, setSelectedEndpoint] = useState(MOCK_ENDPOINTS[0]);
  const [viewMode, setViewMode] = useState('json'); // json, table, raw
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState(INITIAL_LOGS);

  const activeData = MOCK_API_RESPONSES[selectedEndpoint.path] || { error: "No mock data available for this endpoint" };

  // Simulate incoming logs
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomEndpoint = MOCK_ENDPOINTS[Math.floor(Math.random() * MOCK_ENDPOINTS.length)];
        const newLog = {
          id: Date.now(),
          time: new Date().toISOString().substring(11, 19),
          level: 'INFO',
          msg: `${randomEndpoint.status} OK ${randomEndpoint.method} ${randomEndpoint.path}`,
          ms: Math.floor(Math.random() * 100) + 10
        };
        setLogs(prev => [newLog, ...prev].slice(0, 20)); // Keep last 20
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(activeData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderDataView = () => {
    let dataToRender = activeData;

    // Basic filtering if search query exists
    if (searchQuery && typeof activeData === 'object') {
      const stringified = JSON.stringify(activeData).toLowerCase();
      if (!stringified.includes(searchQuery.toLowerCase())) {
        dataToRender = { message: "No results matched your search." };
      }
    }

    if (viewMode === 'raw') {
      return (
        <pre className="font-mono text-sm text-slate-300 p-4">
          {JSON.stringify(dataToRender)}
        </pre>
      );
    }

    if (viewMode === 'table' && Array.isArray(dataToRender) && dataToRender.length > 0) {
      const headers = Object.keys(dataToRender[0]);
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap font-mono">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-white/10">
              <tr>
                {headers.map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {dataToRender.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  {headers.map(h => (
                    <td key={h} className="px-4 py-3">
                      {typeof row[h] === 'object' ? JSON.stringify(row[h]) : String(row[h])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (viewMode === 'table') {
      return (
        <div className="flex items-center justify-center h-full text-slate-500 font-mono text-sm">
          Table view requires an array of objects.
        </div>
      );
    }

    // JSON View (Default)
    const highlighted = syntaxHighlight(dataToRender);
    return (
      <pre 
        className="font-mono text-[13px] leading-relaxed p-4 w-full h-full"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans selection:bg-cyan-500/30 flex flex-col overflow-hidden">
      
      {/* Global CSS for scrollbars and custom grid */}
      <style dangerouslySetInnerHTML={{__html: `
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #030712; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; border: 2px solid #030712; }
        ::-webkit-scrollbar-thumb:hover { background: #334155; }
        .bg-grid {
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 32px 32px;
        }
      `}} />

      {/* TOP NAVBAR */}
      <header className="h-14 border-b border-white/10 bg-[#080b14]/90 backdrop-blur-xl flex items-center justify-between px-4 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors">
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <CloudLightning size={14} className="text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-white hidden sm:block">Methane<span className="text-cyan-400 font-light">Guardian AI</span></span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">API Online</span>
          </div>
          <button className="relative text-slate-400 hover:text-white transition-colors p-1">
            <Bell size={18} />
          </button>
          <div className="w-7 h-7 rounded border border-white/10 flex items-center justify-center bg-slate-800 cursor-pointer hover:border-cyan-500/50">
            <User size={14} className="text-slate-400" />
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid pointer-events-none z-0"></div>
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

        {/* SIDEBAR */}
        <aside className={`${sidebarOpen ? 'w-60' : 'w-0 -translate-x-full'} transition-all duration-300 ease-in-out border-r border-white/5 bg-[#080b14]/90 backdrop-blur-xl z-40 flex flex-col shrink-0 absolute lg:relative h-full`}>
          <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3">Applications</div>
            {[
              { icon: Activity, label: 'Dashboard' },
              { icon: AlertTriangle, label: 'Alerts' },
              { icon: MapIcon, label: 'Facilities' },
              { icon: Database, label: 'API Data Explorer', active: true },
            ].map((item, idx) => (
              <a key={idx} href="#" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                item.active 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}>
                <item.icon size={16} /> {item.label}
              </a>
            ))}
            
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-6 mb-3 px-3">System config</div>
            {[
              { icon: Settings, label: 'Settings' },
              { icon: Layers, label: 'Architecture' },
            ].map((item, idx) => (
              <a key={idx} href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all text-sm font-medium">
                <item.icon size={16} /> {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto relative z-10 p-4 lg:p-6 flex flex-col gap-6">
          
          {/* HEADER & STATUS */}
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight mb-1">API Data Explorer</h1>
            <p className="text-slate-400 text-sm mb-6">Inspect real-time telemetry, manage endpoints, and monitor system payloads.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title="System Status" value="Online" icon={Server} colorClass="text-emerald-400" borderClass="border-emerald-500/20" />
              <MetricCard title="Avg Response" value="42ms" icon={Clock} colorClass="text-cyan-400" borderClass="border-cyan-500/20" />
              <MetricCard title="Total Requests" value="1.2M" icon={Wifi} colorClass="text-purple-400" borderClass="border-purple-500/20" />
              <MetricCard title="Active Sockets" value="1,284" icon={HardDrive} colorClass="text-blue-400" borderClass="border-blue-500/20" />
            </div>
          </div>

          {/* MAIN CONSOLE AREA */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-[500px]">
            
            {/* LEFT: ENDPOINTS & REQUEST CONFIG */}
            <div className="xl:col-span-1 flex flex-col gap-4">
              <div className="bg-slate-900/60 backdrop-blur border border-white/10 rounded-xl flex-1 flex flex-col overflow-hidden">
                <div className="p-3 border-b border-white/10 bg-slate-950/50 flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Database size={14} className="text-cyan-400" /> Endpoints
                  </h3>
                </div>
                <div className="p-2 flex-1 overflow-y-auto space-y-1">
                  {MOCK_ENDPOINTS.map(ep => (
                    <button
                      key={ep.id}
                      onClick={() => setSelectedEndpoint(ep)}
                      className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all border ${
                        selectedEndpoint.id === ep.id
                          ? 'bg-cyan-500/10 border-cyan-500/30'
                          : 'border-transparent hover:bg-white/5'
                      }`}
                    >
                      <MethodBadge method={ep.method} />
                      <div className="overflow-hidden">
                        <div className={`text-sm font-mono truncate ${selectedEndpoint.id === ep.id ? 'text-white font-medium' : 'text-slate-400'}`}>
                          {ep.path}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Request Panel */}
              <div className="bg-slate-900/60 backdrop-blur border border-white/10 rounded-xl p-4 flex flex-col">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
                  <Settings size={14} className="text-purple-400" /> Query Parameters
                </h3>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <input type="text" value="limit" readOnly className="w-1/3 bg-slate-950 border border-white/10 rounded p-2 text-slate-400" />
                    <input type="text" defaultValue="100" className="w-2/3 bg-slate-950 border border-cyan-500/30 rounded p-2 text-white focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="text" value="sort" readOnly className="w-1/3 bg-slate-950 border border-white/10 rounded p-2 text-slate-400" />
                    <input type="text" defaultValue="desc" className="w-2/3 bg-slate-950 border border-cyan-500/30 rounded p-2 text-white focus:outline-none focus:border-cyan-500" />
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Endpoint Latency</h3>
                  <div className="h-12 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={LATENCY_DATA}>
                        <Line type="monotone" dataKey="ms" stroke="#06b6d4" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <button className="mt-4 w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <Play size={14} fill="currentColor" /> Send Request
                </button>
              </div>
            </div>

            {/* RIGHT: DATA VIEWER PANEL */}
            <div className="xl:col-span-3 flex flex-col bg-[#0b0f19]/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              
              {/* Toolbar */}
              <div className="h-14 border-b border-white/10 bg-slate-950/80 flex items-center justify-between px-4 shrink-0">
                
                {/* View Toggles */}
                <div className="flex bg-slate-900 border border-white/10 rounded-lg p-1">
                  {[
                    { id: 'json', icon: Code, label: 'JSON' },
                    { id: 'table', icon: TableIcon, label: 'Table' },
                    { id: 'raw', icon: AlignLeft, label: 'Raw' }
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        viewMode === mode.id 
                          ? 'bg-slate-700 text-white shadow' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <mode.icon size={14} className={viewMode === mode.id ? 'text-cyan-400' : ''} />
                      <span className="hidden sm:inline">{mode.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative hidden md:block">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Filter response..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-900 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:border-cyan-500 text-white w-48 font-mono"
                    />
                  </div>
                  
                  <div className="h-6 w-px bg-white/10 mx-1"></div>

                  <button 
                    onClick={handleCopy}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors"
                    title="Copy Response"
                  >
                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors" title="Download JSON">
                    <Download size={16} />
                  </button>
                </div>
              </div>

              {/* Status Bar */}
              <div className="bg-[#0f1423] border-b border-white/5 px-4 py-2 flex items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> {selectedEndpoint.status} OK</span>
                <span>Time: <span className="text-white">{selectedEndpoint.time}ms</span></span>
                <span>Size: <span className="text-white">1.2 KB</span></span>
                <span className="ml-auto text-slate-500">{selectedEndpoint.method} https://api.methaneguardian.ai{selectedEndpoint.path}</span>
              </div>

              {/* Data Content Area */}
              <div className="flex-1 overflow-auto relative custom-scrollbar">
                {/* Line numbers background mock */}
                {viewMode === 'json' && (
                  <div className="absolute left-0 top-0 bottom-0 w-10 bg-slate-950/50 border-r border-white/5 pointer-events-none flex flex-col text-[10px] text-slate-600 font-mono items-center py-4 select-none">
                    {Array.from({length: 30}).map((_, i) => <div key={i} className="leading-relaxed h-[19px]">{i+1}</div>)}
                  </div>
                )}
                
                <div className={`${viewMode === 'json' ? 'pl-10' : ''} h-full`}>
                  {renderDataView()}
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM: LIVE LOGS / CONSOLE */}
          <div className="bg-[#0b0f19]/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shrink-0 h-64 flex flex-col">
            <div className="h-10 border-b border-white/10 bg-slate-950/80 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live API Console</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer group">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">Stream Logs</span>
                <div className={`w-7 h-4 rounded-full relative transition-colors ${autoRefresh ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                  <div className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full transition-transform ${autoRefresh ? 'translate-x-3' : 'translate-x-0'}`} />
                </div>
                <input type="checkbox" className="hidden" checked={autoRefresh} onChange={() => setAutoRefresh(!autoRefresh)} />
              </label>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs flex flex-col gap-1 custom-scrollbar">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 hover:bg-white/5 px-2 py-1 rounded transition-colors">
                  <span className="text-slate-500 shrink-0">[{log.time}]</span>
                  <span className={`shrink-0 w-10 font-bold ${log.level === 'INFO' ? 'text-cyan-400' : log.level === 'WARN' ? 'text-amber-400' : 'text-red-400'}`}>
                    {log.level}
                  </span>
                  <span className="text-slate-300 flex-1">{log.msg}</span>
                  <span className="text-slate-500 shrink-0">{log.ms}ms</span>
                </div>
              ))}
              <div className="animate-pulse flex gap-2 text-slate-500 px-2 mt-2">
                <ArrowRight size={14} /> <span className="w-2 h-4 bg-slate-500 inline-block animate-bounce"></span>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}