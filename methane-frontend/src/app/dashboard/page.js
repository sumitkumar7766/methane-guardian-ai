"use client";

import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",  icon: "⊞" },
  { id: "alerts",    label: "Alerts",     icon: "◎", badge: 5 },
  { id: "facilities",label: "Facilities", icon: "⬡" },
  { id: "api",       label: "API Data",   icon: "⟨⟩" },
  { id: "about",     label: "About",      icon: "◈" },
];

const METRICS = [
  { label: "Total Emissions",    value: "2.84 Mt",   delta: "+12.4%", up: true,  icon: "☁", color: "emerald", sub: "CO₂ equivalent" },
  { label: "Active Plumes",      value: "1,247",     delta: "+8.1%",  up: true,  icon: "◉", color: "cyan",    sub: "Across 34 regions" },
  { label: "High-Risk Facilities",value: "389",      delta: "-3.2%",  up: false, icon: "⚠", color: "rose",    sub: "Immediate attention" },
  { label: "Avg Confidence",     value: "94.7%",     delta: "+1.8%",  up: true,  icon: "✦", color: "teal",    sub: "AI model accuracy" },
  { label: "Satellites Active",  value: "28",        delta: "0.0%",   up: true,  icon: "◈", color: "blue",    sub: "Global coverage" },
  { label: "Alerts Today",       value: "1,853",     delta: "+22.6%", up: true,  icon: "◎", color: "amber",   sub: "Last 24 hours" },
];

const ALERTS = [
  { id:1, location:"Permian Basin, TX",    severity:"critical", conf:98.2, time:"2m ago",  plume:"847 kg/hr" },
  { id:2, location:"Marcellus Shale, PA",  severity:"high",     conf:91.4, time:"7m ago",  plume:"412 kg/hr" },
  { id:3, location:"Haynesville, LA",      severity:"critical", conf:96.7, time:"11m ago", plume:"703 kg/hr" },
  { id:4, location:"Bowen Basin, AUS",     severity:"medium",   conf:82.1, time:"18m ago", plume:"234 kg/hr" },
  { id:5, location:"Kuznetsk, Russia",     severity:"high",     conf:89.3, time:"24m ago", plume:"589 kg/hr" },
  { id:6, location:"Jharia, India",        severity:"medium",   conf:77.8, time:"31m ago", plume:"198 kg/hr" },
];

const FACILITIES = [
  { name:"Permian Hub Alpha",    loc:"Texas, USA",       risk:97, status:"critical", type:"Oil & Gas" },
  { name:"Yamal LNG Terminal",   loc:"Russia",           risk:91, status:"high",     type:"LNG" },
  { name:"Marcellus Station 4",  loc:"Pennsylvania, USA",risk:88, status:"high",     type:"Shale Gas" },
  { name:"Bowen Coal Complex",   loc:"Queensland, AUS",  risk:79, status:"medium",   type:"Coal Mining" },
  { name:"Haynesville Central",  loc:"Louisiana, USA",   risk:76, status:"medium",   type:"Shale Gas" },
  { name:"Jharia Colliery",      loc:"Jharkhand, India", risk:71, status:"medium",   type:"Coal Mining" },
  { name:"Eagle Ford South",     loc:"Texas, USA",       risk:58, status:"low",      type:"Oil & Gas" },
  { name:"Barnett Shale West",   loc:"Texas, USA",       risk:43, status:"low",      type:"Shale Gas" },
];

const EMISSION_DATA = [42,58,51,67,73,61,88,79,95,82,91,87,103,98,112,106,119,114,128,121,135,129,142,138];
const BAR_DATA = [
  { name:"Permian",   val:847 },
  { name:"Haynesville",val:703 },
  { name:"Marcellus", val:412 },
  { name:"Yamal",     val:589 },
  { name:"Kuznetsk",  val:489 },
  { name:"Jharia",    val:198 },
];
const PIE_DATA = [
  { label:"Critical", val:18, color:"#f43f5e" },
  { label:"High",     val:29, color:"#f59e0b" },
  { label:"Medium",   val:35, color:"#06b6d4" },
  { label:"Low",      val:18, color:"#10b981" },
];

// ─── Color Maps ──────────────────────────────────────────────────────────────

const severityStyle = {
  critical: { dot:"bg-rose-500",   badge:"bg-rose-500/10 text-rose-400 border-rose-500/30",   ring:"ring-rose-500/30" },
  high:     { dot:"bg-amber-400",  badge:"bg-amber-400/10 text-amber-400 border-amber-400/30", ring:"ring-amber-400/30" },
  medium:   { dot:"bg-cyan-400",   badge:"bg-cyan-400/10 text-cyan-400 border-cyan-400/30",   ring:"ring-cyan-400/30" },
  low:      { dot:"bg-emerald-400",badge:"bg-emerald-400/10 text-emerald-400 border-emerald-400/30",ring:"ring-emerald-400/30" },
};

const metricAccent = {
  emerald: { bg:"bg-emerald-500/10", border:"border-emerald-500/20", icon:"text-emerald-400", glow:"shadow-emerald-500/10", delta:"text-emerald-400", text:"text-emerald-400" },
  cyan:    { bg:"bg-cyan-500/10",    border:"border-cyan-500/20",    icon:"text-cyan-400",    glow:"shadow-cyan-500/10",    delta:"text-cyan-400",    text:"text-cyan-400" },
  rose:    { bg:"bg-rose-500/10",    border:"border-rose-500/20",    icon:"text-rose-400",    glow:"shadow-rose-500/10",    delta:"text-rose-400",    text:"text-rose-400" },
  teal:    { bg:"bg-teal-500/10",    border:"border-teal-500/20",    icon:"text-teal-400",    glow:"shadow-teal-500/10",    delta:"text-teal-400",    text:"text-teal-400" },
  blue:    { bg:"bg-blue-500/10",    border:"border-blue-500/20",    icon:"text-blue-400",    glow:"shadow-blue-500/10",    delta:"text-blue-400",    text:"text-blue-400" },
  amber:   { bg:"bg-amber-500/10",   border:"border-amber-500/20",   icon:"text-amber-400",   glow:"shadow-amber-500/10",   delta:"text-amber-400",   text:"text-amber-400" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono tracking-wider">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      LIVE
    </span>
  );
}

function MetricCard({ m }) {
  const a = metricAccent[m.color];
  return (
    <div className={`relative group rounded-2xl border ${a.border} ${a.bg} p-5 backdrop-blur-sm shadow-lg ${a.glow} hover:scale-[1.02] transition-all duration-300 cursor-default overflow-hidden`}>
      {/* subtle top glow line */}
      <div className={`absolute top-0 left-4 right-4 h-px ${a.bg} opacity-60`} />
      <div className="flex items-start justify-between mb-4">
        <span className={`text-2xl ${a.icon}`}>{m.icon}</span>
        <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${a.bg} ${a.text} border ${a.border}`}>
          {m.up ? "↑" : "↓"} {m.delta}
        </span>
      </div>
      <p className="text-3xl font-bold text-white tracking-tight mb-1">{m.value}</p>
      <p className="text-xs text-slate-400 font-medium">{m.label}</p>
      <p className="text-xs text-slate-600 mt-0.5">{m.sub}</p>
    </div>
  );
}

function LineChart({ data }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const W = 600, H = 120, pad = 8;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - 2 * pad);
    const y = H - pad - ((v - min) / (max - min)) * (H - 2 * pad);
    return `${x},${y}`;
  });
  const pathD = `M ${pts.join(" L ")}`;
  const areaD = `M ${pts[0]} L ${pts.join(" L ")} L ${600 - pad},${H} L ${pad},${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path d={areaD} fill="url(#lineGrad)" />
      <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
      {data.map((v, i) => {
        const [x, y] = pts[i].split(",").map(Number);
        return i % 4 === 0
          ? <circle key={i} cx={x} cy={y} r="3" fill="#10b981" filter="url(#glow)" />
          : null;
      })}
    </svg>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.val));
  return (
    <div className="flex items-end gap-2 h-28 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <span className="text-[9px] text-slate-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity">{d.val}</span>
          <div className="w-full rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-500 hover:from-cyan-500 hover:to-cyan-300"
            style={{ height: `${(d.val / max) * 100}%` }} />
          <span className="text-[9px] text-slate-500 truncate w-full text-center">{d.name}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.val, 0);
  let cum = 0;
  const R = 40, cx = 60, cy = 60, stroke = 16;
  const slices = data.map(d => {
    const pct = d.val / total;
    const start = cum;
    cum += pct;
    const a1 = (start * 2 - 0.5) * Math.PI;
    const a2 = ((start + pct) * 2 - 0.5) * Math.PI;
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    const x2 = cx + R * Math.cos(a2), y2 = cy + R * Math.sin(a2);
    const large = pct > 0.5 ? 1 : 0;
    return { ...d, d: `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z` };
  });

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 120 120" className="w-28 h-28 flex-shrink-0">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#0f1c27" strokeWidth={stroke} />
        {slices.map((s, i) => (
          <path key={i} d={s.d} fill={s.color} opacity="0.85"
            className="hover:opacity-100 transition-opacity cursor-pointer" />
        ))}
        <circle cx={cx} cy={cy} r={R - stroke / 2} fill="#070c10" />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700" fontFamily="Space Grotesk">{total}%</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#4a6070" fontSize="7" fontFamily="Space Grotesk">RISK MIX</text>
      </svg>
      <div className="flex flex-col gap-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: d.color }} />
            <span className="text-slate-400 w-14">{d.label}</span>
            <span className="text-white font-bold font-mono">{d.val}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertCard({ a }) {
  const s = severityStyle[a.severity];
  const isCritical = a.severity === "critical";
  return (
    <div className={`relative rounded-xl border bg-slate-900/50 p-3 transition-all duration-200 hover:bg-slate-800/50 ${isCritical ? "border-rose-500/30 " + s.ring + " ring-1 animate-pulse-border" : "border-white/5"}`}>
      {isCritical && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-500/60 to-transparent rounded-t-xl" />}
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot} ${isCritical ? "animate-pulse" : ""}`} />
          <span className="text-white text-xs font-semibold leading-tight">{a.location}</span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium capitalize ${s.badge}`}>{a.severity}</span>
      </div>
      <div className="flex items-center justify-between pl-4">
        <span className="text-slate-500 text-[10px] font-mono">{a.plume}</span>
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 text-[10px] font-mono">{a.conf}%</span>
          <span className="text-slate-600 text-[10px]">{a.time}</span>
        </div>
      </div>
    </div>
  );
}

function RiskBar({ val }) {
  const color = val >= 80 ? "bg-rose-500" : val >= 60 ? "bg-amber-400" : "bg-emerald-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${val}%` }} />
      </div>
      <span className="text-xs font-mono text-slate-300 w-6">{val}</span>
    </div>
  );
}

function WorldMap() {
  // SVG world map with hotspot overlays
  const hotspots = [
    { x: 195, y: 115, r: 22, label: "Permian, USA",     val: "847 kg/hr", conf: 98, color: "#f43f5e" },
    { x: 310, y: 90,  r: 14, label: "Marcellus, USA",   val: "412 kg/hr", conf: 91, color: "#f43f5e" },
    { x: 520, y: 85,  r: 18, label: "Kuznetsk, Russia", val: "589 kg/hr", conf: 89, color: "#f59e0b" },
    { x: 600, y: 150, r: 12, label: "Jharia, India",    val: "198 kg/hr", conf: 78, color: "#f59e0b" },
    { x: 680, y: 220, r: 16, label: "Bowen, AUS",       val: "234 kg/hr", conf: 82, color: "#06b6d4" },
    { x: 140, y: 110, r: 10, label: "Haynesville, USA", val: "703 kg/hr", conf: 97, color: "#f43f5e" },
    { x: 440, y: 75,  r: 8,  label: "Yamal, Russia",    val: "502 kg/hr", conf: 86, color: "#f59e0b" },
    { x: 245, y: 180, r: 7,  label: "La Paz, Bolivia",  val: "118 kg/hr", conf: 72, color: "#10b981" },
  ];

  return (
    <div className="relative w-full h-56 rounded-xl overflow-hidden bg-slate-950 border border-white/5">
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 66} y1="0" x2={i * 66} y2="300" stroke="#10b981" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} stroke="#10b981" strokeWidth="0.5" />
        ))}
      </svg>

      {/* Continent blobs (simplified) */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">
        {/* NA */}
        <path d="M 120 60 Q 200 40 280 70 Q 310 100 290 140 Q 250 160 180 150 Q 130 130 120 60Z" fill="#1e3a4a" />
        {/* SA */}
        <path d="M 200 165 Q 240 160 260 185 Q 265 230 240 255 Q 215 265 195 240 Q 185 210 200 165Z" fill="#1e3a4a" />
        {/* EU */}
        <path d="M 390 55 Q 440 48 480 60 Q 490 75 475 95 Q 450 100 415 90 Q 395 75 390 55Z" fill="#1e3a4a" />
        {/* Africa */}
        <path d="M 400 100 Q 460 95 480 120 Q 490 165 465 205 Q 440 225 415 210 Q 395 175 390 140 Q 385 115 400 100Z" fill="#1e3a4a" />
        {/* Asia */}
        <path d="M 490 45 Q 620 35 700 55 Q 730 80 720 120 Q 680 140 620 130 Q 560 125 510 100 Q 485 80 490 45Z" fill="#1e3a4a" />
        {/* Australia */}
        <path d="M 645 185 Q 700 180 730 200 Q 745 225 720 245 Q 690 255 660 240 Q 640 220 645 185Z" fill="#1e3a4a" />
      </svg>

      {/* Hotspots */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          {hotspots.map((h, i) => (
            <radialGradient key={i} id={`hg${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={h.color} stopOpacity="0.7" />
              <stop offset="100%" stopColor={h.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>
        {hotspots.map((h, i) => (
          <g key={i} className="group cursor-pointer">
            <circle cx={h.x} cy={h.y} r={h.r * 2.5} fill={`url(#hg${i})`} className="animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
            <circle cx={h.x} cy={h.y} r={h.r * 0.7} fill={h.color} opacity="0.9" />
            <circle cx={h.x} cy={h.y} r={h.r * 1.2} fill="none" stroke={h.color} strokeWidth="1" opacity="0.5" />
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-3 flex items-center gap-3">
        <span className="text-[9px] text-slate-500 uppercase tracking-widest">Intensity</span>
        <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500" />
        <span className="text-[9px] text-slate-500">High</span>
      </div>
      <div className="absolute top-2 right-3 flex gap-1">
        <button className="w-5 h-5 rounded bg-slate-800/80 border border-white/10 text-white text-xs flex items-center justify-center hover:bg-slate-700/80 transition-colors">+</button>
        <button className="w-5 h-5 rounded bg-slate-800/80 border border-white/10 text-white text-xs flex items-center justify-center hover:bg-slate-700/80 transition-colors">−</button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function MethaneGuardianDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCol, setSortCol] = useState("risk");
  const [sortAsc, setSortAsc] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = currentTime.toLocaleTimeString("en-US", { hour12: false });
  const dateStr = currentTime.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const filteredFacilities = FACILITIES
    .filter(f =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.loc.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const v = sortCol === "risk" ? a.risk - b.risk : a.name.localeCompare(b.name);
      return sortAsc ? v : -v;
    });

  const handleSort = (col) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(false); }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">

      {/* ── TOP NAV ── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 gap-3 bg-slate-950/90 backdrop-blur border-b border-white/5">
        {/* Hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-8 h-8 flex flex-col justify-center gap-1.5 cursor-pointer group"
        >
          <span className={`h-0.5 bg-slate-400 rounded transition-all duration-300 ${sidebarOpen ? "w-5 group-hover:bg-emerald-400" : "w-4 group-hover:bg-emerald-400"}`} />
          <span className="h-0.5 w-5 bg-slate-400 rounded transition-all duration-300 group-hover:bg-emerald-400" />
          <span className={`h-0.5 bg-slate-400 rounded transition-all duration-300 ${sidebarOpen ? "w-3 group-hover:bg-emerald-400" : "w-5 group-hover:bg-emerald-400"}`} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-sm shadow-lg shadow-emerald-500/20">
            ⬡
          </div>
          <div className="leading-none">
            <p className="text-xs font-bold tracking-wide bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">METHANE GUARDIAN</p>
            <p className="text-[9px] text-slate-600 tracking-widest uppercase">AI Monitoring System</p>
          </div>
        </div>

        <div className="w-px h-6 bg-white/5 mx-1" />
        <LiveBadge />

        <div className="flex-1" />

        {/* Time */}
        <div className="hidden sm:flex flex-col items-end leading-none">
          <span className="text-xs font-mono text-slate-300 tabular-nums">{timeStr} UTC</span>
          <span className="text-[10px] text-slate-600">{dateStr}</span>
        </div>

        {/* Icon buttons */}
        <div className="flex gap-1.5">
          {[["◎", "5"], ["◈", ""], ["○", ""]].map(([ico, badge], i) => (
            <button key={i} className="relative w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/15 transition-all">
              <span className="text-sm">{ico}</span>
              {badge && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-[8px] text-white font-bold flex items-center justify-center">{badge}</span>
              )}
            </button>
          ))}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-xs font-bold cursor-pointer">MG</div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="flex flex-1 pt-14 overflow-hidden">

        {/* ── SIDEBAR ── */}
        <aside className={`flex-shrink-0 flex flex-col bg-slate-950 border-r border-white/5 transition-all duration-300 overflow-hidden ${sidebarOpen ? "w-52" : "w-0 sm:w-14"}`}>
          <nav className="flex-1 py-4 px-2 flex flex-col gap-0.5">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => router.push(`/${item.id}`)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
                  ${activeNav === item.id
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                  }`}
              >
                <span className="text-base flex-shrink-0 w-5 text-center">{item.icon}</span>
                <span className={`whitespace-nowrap transition-all duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>{item.label}</span>
                {item.badge && sidebarOpen && (
                  <span className="ml-auto text-[9px] bg-rose-500/90 text-white font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
                )}
                {activeNav === item.id && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-emerald-400 rounded-r-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar footer */}
          {sidebarOpen && (
            <div className="p-3 border-t border-white/5">
              <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3">
                <p className="text-[10px] text-emerald-400 font-mono mb-1">System Health</p>
                <div className="space-y-1">
                  {[["API", 99], ["Satellite", 97], ["ML Model", 100]].map(([label, val]) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-500 w-12">{label}</span>
                      <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 space-y-6 max-w-screen-2xl mx-auto">

            {/* ── HERO ── */}
            <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6">
              {/* Background glow */}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <LiveBadge />
                    <span className="text-xs text-slate-500 font-mono">Satellite uplink nominal — 28 sensors active</span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-1">
                    Global Methane Monitoring
                    <span className="text-emerald-400"> Overview</span>
                  </h1>
                  <p className="text-slate-400 text-sm">Real-time AI-driven super-emitter detection across 47 active satellite passes</p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all">
                    Export Report
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold hover:bg-white/10 transition-all">
                    Configure
                  </button>
                </div>
              </div>

              {/* Mini stats row */}
              <div className="relative mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Data Latency",   val: "1.4s",   col: "text-emerald-400" },
                  { label: "Coverage",        val: "94.2%",  col: "text-cyan-400" },
                  { label: "Model Version",   val: "v4.2.1", col: "text-blue-400" },
                  { label: "Last Scan",       val: "32s ago",col: "text-amber-400" },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col bg-white/3 border border-white/5 rounded-xl p-3">
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">{s.label}</span>
                    <span className={`text-sm font-bold font-mono ${s.col}`}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── METRICS GRID ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              {METRICS.map((m, i) => <MetricCard key={i} m={m} />)}
            </div>

            {/* ── MAP + ALERTS ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {/* Map */}
              <div className="xl:col-span-2 rounded-2xl border border-white/5 bg-slate-900/50 p-4 backdrop-blur">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-bold text-white">Live Emission Heatmap</h2>
                    <p className="text-xs text-slate-500">Real-time satellite overlay — {ALERTS.length} active hotspots</p>
                  </div>
                  <div className="flex gap-1.5">
                    {["Satellite", "Terrain", "Heat"].map((v, i) => (
                      <button key={i} className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${i === 2 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "border-white/5 text-slate-500 hover:text-slate-300"}`}>{v}</button>
                    ))}
                  </div>
                </div>
                <WorldMap />
              </div>

              {/* Alerts */}
              <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-4 backdrop-blur flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-bold text-white">Real-Time Alerts</h2>
                    <p className="text-xs text-slate-500">Updated continuously</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono animate-pulse">
                    {ALERTS.filter(a => a.severity === "critical").length} CRITICAL
                  </span>
                </div>
                <div className="flex flex-col gap-2 overflow-y-auto flex-1" style={{ maxHeight: "270px" }}>
                  {ALERTS.map(a => <AlertCard key={a.id} a={a} />)}
                </div>
              </div>
            </div>

            {/* ── CHARTS ROW ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Line Chart */}
              <div className="lg:col-span-1 rounded-2xl border border-white/5 bg-slate-900/50 p-4 backdrop-blur">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-bold text-white">Emissions Over Time</h2>
                    <p className="text-xs text-slate-500">Past 24 hours — Mt CO₂e</p>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">↑ 12.4%</span>
                </div>
                <div className="h-32">
                  <LineChart data={EMISSION_DATA} />
                </div>
                <div className="mt-2 flex gap-3 text-[10px] text-slate-600">
                  {["00:00","06:00","12:00","18:00","Now"].map(t => <span key={t} className="flex-1 text-center">{t}</span>)}
                </div>
              </div>

              {/* Bar Chart */}
              <div className="lg:col-span-1 rounded-2xl border border-white/5 bg-slate-900/50 p-4 backdrop-blur">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-bold text-white">Top Emitting Regions</h2>
                    <p className="text-xs text-slate-500">kg/hr — Current cycle</p>
                  </div>
                </div>
                <BarChart data={BAR_DATA} />
              </div>

              {/* Donut */}
              <div className="lg:col-span-1 rounded-2xl border border-white/5 bg-slate-900/50 p-4 backdrop-blur">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-bold text-white">Risk Distribution</h2>
                    <p className="text-xs text-slate-500">Across all facilities</p>
                  </div>
                </div>
                <DonutChart data={PIE_DATA} />
              </div>
            </div>

            {/* ── FACILITY TABLE ── */}
            <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-4 backdrop-blur">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-white">Monitored Facilities</h2>
                  <p className="text-xs text-slate-500">{filteredFacilities.length} facilities — sorted by risk score</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">⊕</span>
                    <input
                      type="text"
                      placeholder="Search facilities..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-2 text-xs bg-slate-800/80 border border-white/5 rounded-xl text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 w-44 transition-all"
                    />
                  </div>
                  <button className="px-3 py-2 text-xs rounded-xl bg-slate-800/80 border border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/15 transition-all">
                    Filter ▾
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/5">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-800/30">
                      {[["name","Facility"], ["loc","Location"], ["type","Type"], ["risk","Risk Score"], ["status","Status"]].map(([col, label]) => (
                        <th key={col} onClick={() => handleSort(col)}
                          className="text-left px-4 py-3 text-slate-500 font-semibold uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors select-none">
                          {label} {sortCol === col ? (sortAsc ? "↑" : "↓") : ""}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/3">
                    {filteredFacilities.map((f, i) => {
                      const s = severityStyle[f.status];
                      return (
                        <tr key={i} className="hover:bg-white/3 transition-colors group">
                          <td className="px-4 py-3 text-white font-medium group-hover:text-emerald-300 transition-colors">{f.name}</td>
                          <td className="px-4 py-3 text-slate-400">{f.loc}</td>
                          <td className="px-4 py-3 text-slate-500">{f.type}</td>
                          <td className="px-4 py-3 w-36">
                            <RiskBar val={f.risk} />
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium capitalize ${s.badge}`}>{f.status}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredFacilities.length === 0 && (
                <p className="text-center text-slate-600 text-xs py-8">No facilities match your search.</p>
              )}
            </div>

            {/* Footer spacer */}
            <div className="h-4" />
          </div>
        </main>
      </div>
    </div>
  );
}