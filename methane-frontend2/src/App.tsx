

import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: #ffffff;
      color: #0f172a;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }
    :root {
      --green-primary: #16a34a;
      --green-deep: #166534;
      --green-hover: #15803d;
      --green-mint: #86efac;
      --green-sage: #bbf7d0;
      --green-light: #f0fdf4;
      --green-50: #f0fdf4;
      --green-100: #dcfce7;
      --green-200: #bbf7d0;
      --slate-900: #0f172a;
      --slate-700: #334155;
      --slate-600: #475569;
      --slate-400: #94a3b8;
      --slate-200: #e2e8f0;
      --slate-100: #f1f5f9;
      --white: #ffffff;
      --amber: #f59e0b;
      --red: #ef4444;
      --blue: #3b82f6;
    }
    a { text-decoration: none; color: inherit; }
    button { cursor: pointer; border: none; background: none; font-family: inherit; }
    input, textarea { font-family: inherit; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #f8faf8; }
    ::-webkit-scrollbar-thumb { background: #bbf7d0; border-radius: 3px; }
    .mono { font-family: 'DM Mono', monospace; }
  `}</style>
);

// ─── LOGO ────────────────────────────────────────────────────────────────────
const EarthLogo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <radialGradient id="earthGrad" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#86efac"/>
        <stop offset="100%" stopColor="#16a34a"/>
      </radialGradient>
      <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="#16a34a" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="24" cy="24" r="22" fill="url(#glowGrad)" opacity="0.4"/>
    <circle cx="24" cy="24" r="19" fill="url(#earthGrad)"/>
    <ellipse cx="17" cy="18" rx="5" ry="3" fill="#166534" opacity="0.7"/>
    <ellipse cx="28" cy="14" rx="4" ry="2.5" fill="#166534" opacity="0.7"/>
    <ellipse cx="30" cy="26" rx="6" ry="4" fill="#166534" opacity="0.7"/>
    <ellipse cx="16" cy="30" rx="4" ry="2.5" fill="#166534" opacity="0.6"/>
    <path d="M24 5 Q30 8 32 14 Q28 18 22 16 Q16 14 18 8 Z" fill="#dcfce7" opacity="0.5"/>
    <circle cx="24" cy="24" r="19" fill="none" stroke="#86efac" strokeWidth="1" opacity="0.6"/>
    <circle cx="14" cy="20" r="2" fill="#22c55e" opacity="0.8"/>
    <circle cx="32" cy="30" r="1.5" fill="#22c55e" opacity="0.6"/>
    <circle cx="26" cy="10" r="1.5" fill="#4ade80" opacity="0.7"/>
  </svg>
);

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/detection", label: "Detection" },
    { to: "/analytics", label: "Analytics" },
    { to: "/attribution", label: "Attribution" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.7)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid #e2e8f0",
      transition: "all 0.3s ease",
      boxShadow: scrolled ? "0 1px 20px rgba(22,163,74,0.08)" : "none"
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <EarthLogo size={38}/>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.2 }}>MethaneSense</div>
            <div style={{ fontSize: 10, color: "#16a34a", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>AI Climate Intelligence</div>
          </div>
        </Link>

        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding: "6px 14px", borderRadius: 10, fontSize: 14, fontWeight: 500,
              color: location.pathname === l.to ? "#16a34a" : "#475569",
              background: location.pathname === l.to ? "#f0fdf4" : "transparent",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { if (location.pathname !== l.to) e.currentTarget.style.color = "#16a34a"; }}
              onMouseLeave={e => { if (location.pathname !== l.to) e.currentTarget.style.color = "#475569"; }}>
              {l.label}
            </Link>
          ))}
          <Link to="/dashboard" style={{
            marginLeft: 8, padding: "8px 20px", background: "#16a34a", color: "#fff",
            borderRadius: 10, fontSize: 14, fontWeight: 600,
            boxShadow: "0 2px 12px rgba(22,163,74,0.3)", transition: "all 0.2s"
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#15803d"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(0)"; }}>
            Live Monitor
          </Link>
        </div>
      </div>
    </nav>
  );
};

// ─── CHATBOT ─────────────────────────────────────────────────────────────────
const botResponses = {
  default: "I'm MethaneSense AI — your climate intelligence assistant. I can explain how our platform works, what methane super-emitters are, or how we detect and attribute leaks.",
  methane: "Methane is 80× more potent than CO₂ over 20 years. Super-emitters (>100 kg/hr) account for 20–50% of oil & gas methane emissions despite being <1% of sources. Targeting them is the highest-leverage climate intervention.",
  detection: "Our Stage 1 pipeline uses Vision Transformers (ViT) and U-Net++ for pixel-level plume segmentation in hyperspectral satellite data (Sentinel-5P/TROPOMI, NASA EMIT). Attention mechanisms suppress cloud and reflectance artifacts — achieving F1 > 0.85.",
  quantification: "Stage 2 uses a Physics-Informed Neural Network (PINN) to estimate emission flux in kg/hr. It combines plume morphology from satellite imagery with ECMWF wind vector data and atmospheric radiative transfer principles.",
  attribution: "Stage 3 uses a Graph Neural Network (GNN) to match detected plumes to specific facility polygons from infrastructure maps. This enables facility-level attribution with >80% accuracy — making regulatory enforcement possible.",
  dashboard: "The live dashboard shows a global super-emitter heatmap, facility risk scores (Low/Medium/Critical), confidence-bounded anomaly alerts, and real-time flux estimates. Our REST API accepts a geographic bounding box and returns full detection results.",
  api: "Our REST API accepts: { bbox: [lat1, lon1, lat2, lon2], date_range: [...] } and returns detected plumes with flux estimates (kg/hr), confidence scores, and attributed facility IDs. Docker containerized for reproducibility.",
  cloud: "When cloud cover occludes imagery, we apply spatial interpolation using surrounding valid pixels, combined with historical decay models based on past plume behavior at that location. This ensures robust detection even with incomplete data.",
  accuracy: "Our plume segmentation targets F1 > 0.85. Source attribution achieves >80% accuracy at the facility level. Emission flux quantification integrates physics constraints (radiative transfer) to reduce purely data-driven errors.",
};

const getResponse = (msg) => {
  const m = msg.toLowerCase();
  if (m.includes("methane") || m.includes("super-emitter") || m.includes("greenhouse")) return botResponses.methane;
  if (m.includes("detect") || m.includes("segment") || m.includes("plume") || m.includes("unet") || m.includes("transformer")) return botResponses.detection;
  if (m.includes("quantif") || m.includes("flux") || m.includes("kg") || m.includes("pinn") || m.includes("physics")) return botResponses.quantification;
  if (m.includes("attribu") || m.includes("facility") || m.includes("gnn") || m.includes("graph")) return botResponses.attribution;
  if (m.includes("dashboard") || m.includes("heatmap") || m.includes("alert") || m.includes("monitor")) return botResponses.dashboard;
  if (m.includes("api") || m.includes("docker") || m.includes("rest") || m.includes("endpoint")) return botResponses.api;
  if (m.includes("cloud") || m.includes("occlu") || m.includes("interpolat")) return botResponses.cloud;
  if (m.includes("accur") || m.includes("f1") || m.includes("precision")) return botResponses.accuracy;
  return botResponses.default;
};

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ from: "bot", text: "Hi! I'm your MethaneSense AI guide. Ask me about our detection pipeline, methane super-emitters, or how the platform works!" }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMsgs(p => [...p, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, { from: "bot", text: getResponse(userMsg.text) }]);
    }, 900 + Math.random() * 600);
  };

  const suggestions = ["What are super-emitters?", "How does detection work?", "Explain source attribution", "Tell me about the API"];

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{ position: "fixed", bottom: 90, right: 24, width: 360, background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(22,163,74,0.15), 0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", zIndex: 200, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ background: "linear-gradient(135deg, #16a34a, #166534)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <EarthLogo size={24}/>
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>MethaneSense AI</div>
                <div style={{ color: "#bbf7d0", fontSize: 11 }}>● Online — Climate Intelligence Guide</div>
              </div>
              <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", color: "#fff", fontSize: 20, opacity: 0.7, cursor: "pointer", background: "none", border: "none" }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10, maxHeight: 320, minHeight: 200 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "80%", padding: "10px 14px", borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: m.from === "user" ? "#16a34a" : "#f0fdf4",
                    color: m.from === "user" ? "#fff" : "#0f172a",
                    fontSize: 13, lineHeight: 1.5, border: m.from === "bot" ? "1px solid #dcfce7" : "none"
                  }}>{m.text}</div>
                </div>
              ))}
              {typing && (
                <div style={{ display: "flex", gap: 4, padding: "10px 14px", background: "#f0fdf4", borderRadius: "16px 16px 16px 4px", width: 60, border: "1px solid #dcfce7" }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", animation: "bounce 1s infinite", animationDelay: `${i * 0.15}s` }}/>)}
                </div>
              )}
              <div ref={endRef}/>
            </div>
            <div style={{ padding: "8px 12px", borderTop: "1px solid #f0fdf4", display: "flex", gap: 6, flexWrap: "wrap" }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => { setInput(s); setTimeout(() => send(), 50); }}
                  style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
                  {s}
                </button>
              ))}
            </div>
            <div style={{ padding: "12px", borderTop: "1px solid #e2e8f0", display: "flex", gap: 8 }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Ask about methane detection..."
                style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13, outline: "none", background: "#fafafa" }}/>
              <button onClick={send} style={{ padding: "10px 16px", background: "#16a34a", color: "#fff", borderRadius: 12, fontWeight: 600, fontSize: 13, cursor: "pointer", border: "none" }}>→</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setOpen(o => !o)} style={{
        position: "fixed", bottom: 24, right: 24, width: 58, height: 58, borderRadius: "50%",
        background: "linear-gradient(135deg, #16a34a, #166534)",
        boxShadow: "0 4px 24px rgba(22,163,74,0.4)", display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", border: "none", zIndex: 200, transition: "transform 0.2s"
      }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
        <EarthLogo size={30}/>
        <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }`}</style>
      </button>
    </>
  );
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
const Badge = ({ label, type = "success" }) => {
  const colors = {
    success: { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0", dot: "#22c55e" },
    warning: { bg: "#fffbeb", color: "#92400e", border: "#fde68a", dot: "#f59e0b" },
    danger:  { bg: "#fef2f2", color: "#991b1b", border: "#fecaca", dot: "#ef4444" },
    info:    { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe", dot: "#3b82f6" },
  };
  const c = colors[type];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: c.bg, color: c.color, border: `1px solid ${c.border}`, fontSize: 12, fontWeight: 600 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, display: "inline-block" }}/>
      {label}
    </span>
  );
};

const KpiCard = ({ icon, label, value, sub, type = "success", trend }) => (
  <div style={{ background: "#fff", border: "1px solid #e8f5e9", borderRadius: 20, padding: "20px 24px", boxShadow: "0 4px 20px rgba(22,163,74,0.06)", transition: "all 0.2s" }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(22,163,74,0.12)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(22,163,74,0.06)"; }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
      {trend && <span style={{ fontSize: 13, fontWeight: 600, color: trend > 0 ? "#ef4444" : "#22c55e" }}>{trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%</span>}
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{label}</div>
    {sub && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{sub}</div>}
  </div>
);

const SectionHeader = ({ badge, title, subtitle }) => (
  <div style={{ textAlign: "center", marginBottom: 48 }}>
    {badge && <div style={{ marginBottom: 12 }}><Badge label={badge} type="success" /></div>}
    <h2 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 12 }}>{title}</h2>
    <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>{subtitle}</p>
  </div>
);

// ─── HOME PAGE ───────────────────────────────────────────────────────────────
const HomePage = () => {
  const [count, setCount] = useState({ emitters: 0, reduced: 0, facilities: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => ({
        emitters: Math.min(c.emitters + 3, 247),
        reduced: Math.min(c.reduced + 12, 1240),
        facilities: Math.min(c.facilities + 47, 4700),
      }));
    }, 20);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: "🛰️", title: "Hyperspectral Satellite", desc: "Sentinel-5P/TROPOMI & NASA EMIT data processed in real-time with pixel-level plume segmentation" },
    { icon: "🧠", title: "Vision AI Pipeline", desc: "Vision Transformers + U-Net++ with attention-based artifact removal — F1 score > 0.85" },
    { icon: "⚛️", title: "Physics-Informed PINN", desc: "Emission flux estimation (kg/hr) combining plume morphology with ECMWF wind vectors" },
    { icon: "🕸️", title: "Graph Neural Networks", desc: "Facility-level source attribution matching plumes to infrastructure polygons — >80% accuracy" },
    { icon: "☁️", title: "Cloud Occlusion Handling", desc: "Spatial interpolation and historical decay models for robust detection under cloud cover" },
    { icon: "📡", title: "REST API & Docker", desc: "Containerized pipeline with a public API accepting geographic bounding boxes for instant results" },
  ];

  const steps = [
    { num: "01", title: "Satellite Ingestion", desc: "Hyperspectral data acquired from Sentinel-5P/TROPOMI and NASA EMIT satellites" },
    { num: "02", title: "Plume Segmentation", desc: "Vision Transformer performs pixel-level detection with artifact suppression" },
    { num: "03", title: "Flux Quantification", desc: "PINN estimates emission rate using plume morphology + atmospheric physics" },
    { num: "04", title: "Source Attribution", desc: "GNN matches plume to specific facility polygon from infrastructure maps" },
  ];

  return (
    <div style={{ paddingTop: 68 }}>
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "92vh", display: "flex", alignItems: "center", background: "linear-gradient(150deg, #ffffff 0%, #f0fdf4 50%, #dcfce7 100%)" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(134,239,172,0.25) 0%, transparent 70%)", pointerEvents: "none" }}/>
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(22,163,74,0.1) 0%, transparent 70%)", pointerEvents: "none" }}/>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Badge label="● Live — Global Monitoring Active" type="success"/>
            <h1 style={{ fontSize: 56, fontWeight: 800, color: "#0f172a", lineHeight: 1.1, letterSpacing: "-0.04em", marginTop: 20, marginBottom: 20 }}>
              AI-Powered<br/><span style={{ color: "#16a34a" }}>Methane</span><br/>Intelligence
            </h1>
            <p style={{ fontSize: 19, color: "#475569", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              Detect, quantify, and attribute methane super-emitters in real-time using hyperspectral satellite data, Vision Transformers, and Physics-Informed Neural Networks.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to="/dashboard" style={{ padding: "14px 28px", background: "#16a34a", color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 16, boxShadow: "0 4px 20px rgba(22,163,74,0.35)", transition: "all 0.2s", display: "inline-block" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#15803d"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(0)"; }}>
                View Live Dashboard →
              </Link>
              <Link to="/detection" style={{ padding: "14px 28px", background: "#fff", color: "#16a34a", borderRadius: 12, fontWeight: 700, fontSize: 16, border: "1.5px solid #86efac", transition: "all 0.2s", display: "inline-block" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f0fdf4"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
                Explore Detection
              </Link>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 48 }}>
              {[{ val: `${count.emitters}`, label: "Super-emitters detected" }, { val: `${count.reduced}t`, label: "CO₂eq avoided/day" }, { val: `${count.facilities}+`, label: "Facilities monitored" }].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#16a34a", letterSpacing: "-0.02em" }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #e2e8f0", boxShadow: "0 20px 60px rgba(22,163,74,0.1)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["#ef4444", "#f59e0b", "#22c55e"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }}/>)}
                </div>
                <Badge label="Live Feed" type="success"/>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 16, letterSpacing: "0.05em" }}>ACTIVE DETECTIONS — LAST 24H</div>
                {[
                  { region: "Permian Basin, TX", flux: "847 kg/hr", conf: "94%", type: "danger" },
                  { region: "Marcellus Shale, PA", flux: "312 kg/hr", conf: "89%", type: "warning" },
                  { region: "Eagle Ford, TX", flux: "156 kg/hr", conf: "97%", type: "success" },
                ].map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{d.region}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>Flux: <span className="mono" style={{ color: "#16a34a" }}>{d.flux}</span></div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Badge label={d.type === "danger" ? "Critical" : d.type === "warning" ? "High" : "Moderate"} type={d.type}/>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Conf: {d.conf}</div>
                    </div>
                  </div>
                  //Styling
                ))}
                <div style={{ marginTop: 16, padding: 14, background: "#f0fdf4", borderRadius: 12, border: "1px solid #bbf7d0" }}>
                  <div style={{ fontSize: 12, color: "#166534", fontWeight: 600, marginBottom: 6 }}>🛰️ Stage 1 → Stage 2 → Stage 3</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[85, 90, 95, 100, 88, 72, 100, 95, 82, 100, 90, 87].map((w, i) => (
                      <div key={i} style={{ flex: 1, height: 24, background: `rgba(22,163,74,${w / 130})`, borderRadius: 3 }}/>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{ background: "#166534", padding: "24px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 24 }}>
          {[
            { val: "< 1%", label: "of sources cause 20–50% of emissions" },
            { val: "80×", label: "more potent than CO₂ over 20 years" },
            { val: "100 kg/hr", label: "threshold for super-emitter classification" },
            { val: "F1 > 0.85", label: "plume segmentation accuracy" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#86efac", letterSpacing: "-0.02em" }}>{s.val}</div>
              <div style={{ fontSize: 13, color: "#bbf7d0", marginTop: 4, maxWidth: 160 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PIPELINE STEPS */}
      <section style={{ padding: "100px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionHeader badge="AI Pipeline" title="Three-Stage Detection Engine" subtitle="A multi-stage AI system transforming raw satellite data into actionable climate intelligence"/>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div style={{ background: i % 2 === 0 ? "#fff" : "#f0fdf4", border: "1px solid #e2e8f0", borderRadius: 20, padding: 28, height: "100%", position: "relative", overflow: "hidden" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 48, fontWeight: 700, color: "#dcfce7", position: "absolute", top: 12, right: 20, lineHeight: 1 }}>{s.num}</div>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16, marginBottom: 16 }}>{i + 1}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "80px 24px", background: "#f8faf8" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionHeader badge="Platform Features" title="Enterprise-Grade Climate Monitoring" subtitle="Everything you need to detect, quantify, and act on methane super-emitters"/>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div style={{ background: "#fff", border: "1px solid #e8f5e9", borderRadius: 20, padding: 28, cursor: "default", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(22,163,74,0.1)"; e.currentTarget.style.borderColor = "#bbf7d0"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e8f5e9"; }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(135deg, #16a34a, #166534)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}/>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <EarthLogo size={60}/>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: "#fff", marginTop: 20, marginBottom: 16, letterSpacing: "-0.03em" }}>Start Monitoring Now</h2>
          <p style={{ fontSize: 18, color: "#bbf7d0", marginBottom: 36, lineHeight: 1.6 }}>Join government agencies and energy companies using MethaneSense to eliminate super-emitters and take real climate action.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link to="/dashboard" style={{ padding: "14px 32px", background: "#fff", color: "#16a34a", borderRadius: 12, fontWeight: 700, fontSize: 16, display: "inline-block" }}>Launch Dashboard</Link>
            <Link to="/about" style={{ padding: "14px 32px", background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 16, border: "1.5px solid rgba(255,255,255,0.3)", display: "inline-block" }}>Learn More</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0f172a", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
          <EarthLogo size={28}/>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>MethaneSense</span>
        </div>
        <p style={{ color: "#64748b", fontSize: 13 }}>AI-Powered Methane Intelligence Platform · Built for the Planet</p>
        <div style={{ marginTop: 12, display: "flex", gap: 24, justifyContent: "center" }}>
          {["Privacy", "API Docs", "Contact", "GitHub"].map(l => <span key={l} style={{ color: "#475569", fontSize: 13, cursor: "pointer" }}>{l}</span>)}
        </div>
      </footer>
    </div>
  );
};

// ─── DASHBOARD PAGE ──────────────────────────────────────────────────────────
const emissionsData = [
  { month: "Jan", detected: 180, mitigated: 120 },
  { month: "Feb", detected: 210, mitigated: 145 },
  { month: "Mar", detected: 195, mitigated: 160 },
  { month: "Apr", detected: 260, mitigated: 190 },
  { month: "May", detected: 230, mitigated: 200 },
  { month: "Jun", detected: 290, mitigated: 225 },
  { month: "Jul", detected: 247, mitigated: 218 },
];

const regionData = [
  { name: "Permian Basin", value: 38, color: "#ef4444" },
  { name: "Marcellus Shale", value: 24, color: "#f59e0b" },
  { name: "Eagle Ford", value: 18, color: "#16a34a" },
  { name: "DJ Basin", value: 12, color: "#3b82f6" },
  { name: "Others", value: 8, color: "#94a3b8" },
];

const alerts = [
  { id: "MSE-2024-0847", region: "Permian Basin, TX", facility: "Chevron Well Pad #447", flux: "847 kg/hr", conf: "94%", time: "3 min ago", type: "danger" },
  { id: "MSE-2024-0846", region: "Marcellus Shale, PA", facility: "EQT Compressor Station", flux: "312 kg/hr", conf: "89%", time: "18 min ago", type: "warning" },
  { id: "MSE-2024-0845", region: "Eagle Ford, TX", facility: "Pioneer Natural Storage", flux: "156 kg/hr", conf: "97%", time: "41 min ago", type: "success" },
  { id: "MSE-2024-0844", region: "DJ Basin, CO", facility: "Civitas Resources #12", flux: "203 kg/hr", conf: "91%", time: "1 hr ago", type: "warning" },
];

const DashboardPage = () => {
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1500); };

  return (
    <div style={{ paddingTop: 68, background: "#f8faf8", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>Global Monitoring Dashboard</h1>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Real-time methane super-emitter intelligence · Updated every 90 seconds</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Badge label="● Live" type="success"/>
            <button onClick={handleRefresh} style={{ padding: "8px 18px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer" }}>
              {refreshing ? "Refreshing..." : "↻ Refresh"}
            </button>
            <button style={{ padding: "8px 18px", background: "#16a34a", color: "#fff", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none" }}>Export Report</button>
          </div>
        </div>

        {/* KPI GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 28 }}>
          <KpiCard icon="🔴" label="Active Super-Emitters" value="247" sub="Threshold: >100 kg/hr" trend={12}/>
          <KpiCard icon="📊" label="Total Flux Today" value="84.2t" sub="Metric tonnes/hr" trend={8}/>
          <KpiCard icon="🏭" label="Facilities Monitored" value="4,721" sub="Global coverage"/>
          <KpiCard icon="✅" label="Attribution Accuracy" value="83.4%" sub="Facility-level match"/>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 24 }}>
          {/* CHART */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Detections vs. Mitigations</div>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>Monthly super-emitter activity (kg/hr)</div>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 3, borderRadius: 2, background: "#ef4444", display: "inline-block" }}/> Detected</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 3, borderRadius: 2, background: "#16a34a", display: "inline-block" }}/> Mitigated</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={emissionsData}>
                <defs>
                  <linearGradient id="detGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="mitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }}/>
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }}/>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}/>
                <Area type="monotone" dataKey="detected" stroke="#ef4444" strokeWidth={2} fill="url(#detGrad)"/>
                <Area type="monotone" dataKey="mitigated" stroke="#16a34a" strokeWidth={2} fill="url(#mitGrad)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* PIE */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: 28 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Emissions by Region</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>% of total detected flux</div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={regionData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                  {regionData.map((e, i) => <Cell key={i} fill={e.color}/>)}
                </Pie>
                <Tooltip/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
              {regionData.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: r.color, display: "inline-block" }}/>
                    {r.name}
                  </span>
                  <span style={{ fontWeight: 600 }}>{r.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ALERTS TABLE */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Active Anomaly Alerts</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["All", "Critical", "High", "Moderate"].map(f => (
                <button key={f} style={{ padding: "4px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: f === "All" ? "#16a34a" : "#f8faf8", color: f === "All" ? "#fff" : "#64748b", border: "1px solid #e2e8f0", cursor: "pointer" }}>{f}</button>
              ))}
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                  {["Alert ID", "Region", "Facility", "Flux Rate", "Confidence", "Time", "Status"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alerts.map((a, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8faf8"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 12px", fontSize: 12, fontFamily: "DM Mono, monospace", color: "#16a34a" }}>{a.id}</td>
                    <td style={{ padding: "14px 12px", fontSize: 13, fontWeight: 500 }}>{a.region}</td>
                    <td style={{ padding: "14px 12px", fontSize: 13, color: "#475569" }}>{a.facility}</td>
                    <td style={{ padding: "14px 12px", fontSize: 13, fontFamily: "DM Mono, monospace", fontWeight: 600 }}>{a.flux}</td>
                    <td style={{ padding: "14px 12px", fontSize: 13, fontFamily: "DM Mono, monospace", color: "#16a34a" }}>{a.conf}</td>
                    <td style={{ padding: "14px 12px", fontSize: 12, color: "#94a3b8" }}>{a.time}</td>
                    <td style={{ padding: "14px 12px" }}>
                      <Badge label={a.type === "danger" ? "Critical" : a.type === "warning" ? "High" : "Moderate"} type={a.type}/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DETECTION PAGE ──────────────────────────────────────────────────────────
const DetectionPage = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [confidence, setConfidence] = useState(85);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const stages = [
    { title: "Vision Transformer / U-Net++", color: "#16a34a", desc: "Pixel-level plume segmentation with attention-based artifact removal targeting F1 > 0.85", details: ["Sentinel-5P/TROPOMI hyperspectral input", "Attention gates suppress cloud artifacts", "Surface reflectance noise removal", "Multi-scale feature extraction", "Uncertainty quantification outputs"] },
    { title: "Physics-Informed PINN", color: "#f59e0b", desc: "Emission flux estimation combining plume morphology with ECMWF atmospheric wind data", details: ["Plume morphology analysis (shape, spread, density)", "ECMWF wind vector integration", "Atmospheric radiative transfer principles", "Flux estimation in kg/hr", "Confidence interval computation"] },
    { title: "Graph Neural Network", color: "#3b82f6", desc: "Facility-level source attribution matching plumes to infrastructure polygon maps", details: ["Infrastructure polygon database lookup", "Spatial relationship encoding", "Multi-hop graph message passing", ">80% facility-level attribution accuracy", "Regulatory compliance reporting"] },
  ];

  const handleRun = () => {
    setProcessing(true);
    setProcessed(false);
    let s = 0;
    const iv = setInterval(() => {
      setActiveStage(s);
      s++;
      if (s >= 3) { clearInterval(iv); setProcessing(false); setProcessed(true); }
    }, 1000);
  };

  return (
    <div style={{ paddingTop: 68, minHeight: "100vh", background: "#f8faf8" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        <SectionHeader badge="AI Detection Engine" title="Three-Stage Detection Pipeline" subtitle="From raw satellite pixels to attributed facility emissions — in real-time"/>

        {/* STAGE CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 40 }}>
          {stages.map((s, i) => (
            <div key={i} onClick={() => setActiveStage(i)}
              style={{ background: "#fff", border: `2px solid ${activeStage === i ? s.color : "#e2e8f0"}`, borderRadius: 20, padding: 28, cursor: "pointer", transition: "all 0.2s", boxShadow: activeStage === i ? `0 8px 30px ${s.color}20` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, fontWeight: 800, fontSize: 18 }}>0{i + 1}</div>
                {processing && activeStage === i && <Badge label="Processing..." type="info"/>}
                {processed && <Badge label="Complete" type="success"/>}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, marginBottom: 16 }}>{s.desc}</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {s.details.map((d, j) => (
                  <li key={j} style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "flex-start", gap: 6 }}>
                    <span style={{ color: s.color, fontWeight: 700, marginTop: 1 }}>✓</span> {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* INTERACTIVE DEMO */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 36 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>Interactive Pipeline Simulator</h3>
              <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Simulate the full detection pipeline with configurable parameters</p>
            </div>
            <button onClick={handleRun} disabled={processing}
              style={{ padding: "12px 28px", background: processing ? "#94a3b8" : "#16a34a", color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: processing ? "not-allowed" : "pointer", border: "none", transition: "all 0.2s" }}>
              {processing ? "⟳ Running Pipeline..." : "▶ Run Detection"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 8 }}>Confidence Threshold: {confidence}%</label>
                <input type="range" min={60} max={99} value={confidence} onChange={e => setConfidence(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#16a34a" }}/>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                  <span>60% (High recall)</span><span>99% (High precision)</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Satellite Source", value: "Sentinel-5P" },
                  { label: "Resolution", value: "3.5 × 5.5 km" },
                  { label: "Wind Data", value: "ECMWF ERA5" },
                  { label: "Model", value: "ViT-L/16 + PINN" },
                ].map((p, i) => (
                  <div key={i} style={{ background: "#f8faf8", borderRadius: 12, padding: 14, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>{p.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", fontFamily: "DM Mono, monospace" }}>{p.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {/* PIPELINE VISUALIZATION */}
              <div style={{ background: "#f0fdf4", borderRadius: 16, padding: 20, border: "1px solid #bbf7d0" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#166534", marginBottom: 16 }}>PIPELINE EXECUTION STATUS</div>
                {["Stage 1: Plume Segmentation", "Stage 2: Flux Quantification", "Stage 3: Source Attribution"].map((st, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>
                      <span>{st}</span>
                      <span style={{ color: processed || (processing && activeStage > i) ? "#16a34a" : processing && activeStage === i ? "#f59e0b" : "#94a3b8" }}>
                        {processed || (processing && activeStage > i) ? "✓ Done" : processing && activeStage === i ? "⟳ Running" : "Pending"}
                      </span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: "#e2e8f0", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 3,
                        background: processed || (processing && activeStage > i) ? "#16a34a" : processing && activeStage === i ? "#f59e0b" : "#e2e8f0",
                        width: processed || (processing && activeStage > i) ? "100%" : processing && activeStage === i ? "60%" : "0%",
                        transition: "width 0.8s ease"
                      }}/>
                    </div>
                  </div>
                ))}
                {processed && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 16, padding: 14, background: "#fff", borderRadius: 12, border: "1px solid #bbf7d0" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 8 }}>✓ Detection Complete</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                      <div><span style={{ color: "#94a3b8" }}>Plumes found:</span> <strong>3</strong></div>
                      <div><span style={{ color: "#94a3b8" }}>Total flux:</span> <strong>1,315 kg/hr</strong></div>
                      <div><span style={{ color: "#94a3b8" }}>Attributed:</span> <strong>3/3 facilities</strong></div>
                      <div><span style={{ color: "#94a3b8" }}>Confidence:</span> <strong>{confidence}%</strong></div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ANALYTICS PAGE ──────────────────────────────────────────────────────────
const fluxData = [
  { time: "00:00", flux: 240 }, { time: "03:00", flux: 210 }, { time: "06:00", flux: 280 },
  { time: "09:00", flux: 420 }, { time: "12:00", flux: 390 }, { time: "15:00", flux: 510 },
  { time: "18:00", flux: 460 }, { time: "21:00", flux: 380 }, { time: "24:00", flux: 290 },
];

const facilityData = [
  { name: "Chevron #447", flux: 847 }, { name: "EQT CS-12", flux: 312 },
  { name: "Pioneer S-08", flux: 156 }, { name: "Civitas #12", flux: 203 },
  { name: "Shell Pad-22", flux: 98 }, { name: "BP Wells-7", flux: 134 },
];

const AnalyticsPage = () => (
  <div style={{ paddingTop: 68, background: "#f8faf8", minHeight: "100vh" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
      <SectionHeader badge="Data Analytics" title="Emission Analytics & Trends" subtitle="Deep-dive into flux quantification data, temporal patterns, and facility risk profiling"/>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 28 }}>
        <KpiCard icon="📈" label="Peak Flux Today" value="847 kg/hr" sub="Permian Basin" trend={15}/>
        <KpiCard icon="📉" label="Avg. Flux Rate" value="284 kg/hr" sub="Rolling 24h average"/>
        <KpiCard icon="⚡" label="F1 Score" value="0.87" sub="Plume segmentation"/>
        <KpiCard icon="🎯" label="Attribution Rate" value="83.4%" sub="Facility-level match"/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24, marginBottom: 24 }}>
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: 28 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>24-Hour Flux Profile</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>Total detected methane flux (kg/hr) by hour</div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={fluxData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }}/>
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }}/>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}/>
              <Line type="monotone" dataKey="flux" stroke="#16a34a" strokeWidth={2.5} dot={{ fill: "#16a34a", r: 4 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: 28 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Facility Risk Scores</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>Top emitters by flux (kg/hr)</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={facilityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/>
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }}/>
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#475569" }} width={80}/>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}/>
              <Bar dataKey="flux" fill="#16a34a" radius={[0, 6, 6, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* API SNIPPET */}
      <div style={{ background: "#0f172a", borderRadius: 20, padding: 32, color: "#e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>REST API Endpoint</div>
            <div style={{ fontSize: 13, color: "#64748b" }}>Query detected plumes for any geographic bounding box</div>
          </div>
          <Badge label="v1.0 · Live" type="success"/>
        </div>
        <pre style={{ fontFamily: "DM Mono, monospace", fontSize: 13, lineHeight: 1.8, overflowX: "auto", color: "#94a3b8" }}>
{`POST https://api.methanesense.io/v1/detect

{
  "bbox": [31.8, -104.2, 32.4, -103.6],   // Permian Basin
  "date_range": ["2024-07-01", "2024-07-07"],
  "confidence_threshold": 0.85,
  "include_attribution": true
}

// Response
{
  "detections": [
    {
      "plume_id": "MSE-2024-0847",
      "flux_kghr": 847.3,
      "confidence": 0.94,
      "facility_id": "CHEVRON-PERMIAN-447",
      "facility_name": "Chevron Well Pad #447",
      "bbox": [31.92, -103.97, 31.95, -103.92],
      "timestamp": "2024-07-07T14:23:11Z"
    }
  ],
  "total_flux_kghr": 1315.6,
  "attribution_accuracy": 0.934
}`}
        </pre>
      </div>
    </div>
  </div>
);

// ─── ATTRIBUTION PAGE ─────────────────────────────────────────────────────────
const AttributionPage = () => {
  const [selected, setSelected] = useState(null);
  const facilities = [
    { id: "CVX-447", name: "Chevron Well Pad #447", region: "Permian Basin, TX", type: "Well Pad", flux: "847 kg/hr", risk: "Critical", conf: "94%", lat: "31.93°N", lon: "103.95°W", plumes: 3 },
    { id: "EQT-CS12", name: "EQT Compressor Station 12", region: "Marcellus, PA", type: "Compressor", flux: "312 kg/hr", risk: "High", conf: "89%", lat: "40.12°N", lon: "79.56°W", plumes: 1 },
    { id: "PXD-S08", name: "Pioneer Natural Storage 08", region: "Eagle Ford, TX", type: "Storage", flux: "156 kg/hr", risk: "Moderate", conf: "97%", lat: "28.74°N", lon: "99.23°W", plumes: 2 },
    { id: "CIVI-12", name: "Civitas Resources #12", region: "DJ Basin, CO", type: "Well Pad", flux: "203 kg/hr", risk: "High", conf: "91%", lat: "40.23°N", lon: "104.78°W", plumes: 1 },
  ];

  return (
    <div style={{ paddingTop: 68, background: "#f8faf8", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        <SectionHeader badge="Source Attribution" title="Facility-Level Attribution" subtitle="Graph Neural Networks match detected plumes to specific infrastructure facilities"/>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* FACILITY LIST */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#475569", marginBottom: 12, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 11 }}>Attributed Facilities</div>
            {facilities.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <div onClick={() => setSelected(f === selected ? null : f)}
                  style={{ background: "#fff", border: `1.5px solid ${selected === f ? "#16a34a" : "#e2e8f0"}`, borderRadius: 16, padding: 20, marginBottom: 12, cursor: "pointer", transition: "all 0.2s", boxShadow: selected === f ? "0 4px 20px rgba(22,163,74,0.12)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "#16a34a", fontWeight: 600, marginBottom: 4 }}>{f.id}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{f.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{f.region} · {f.type}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Badge label={f.risk} type={f.risk === "Critical" ? "danger" : f.risk === "High" ? "warning" : "success"}/>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginTop: 8 }}>{f.flux}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>Conf: {f.conf}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* DETAIL PANEL */}
          <div>
            <AnimatePresence>
              {selected ? (
                <motion.div key="detail" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
                  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: 28, marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Facility Detail</h3>
                      <Badge label="GNN Attributed" type="success"/>
                    </div>
                    {[
                      ["Facility ID", selected.id],
                      ["Name", selected.name],
                      ["Region", selected.region],
                      ["Type", selected.type],
                      ["Coordinates", `${selected.lat}, ${selected.lon}`],
                      ["Detected Plumes", selected.plumes],
                      ["Total Flux", selected.flux],
                      ["Attribution Confidence", selected.conf],
                    ].map(([k, v], i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9", fontSize: 14 }}>
                        <span style={{ color: "#64748b", fontWeight: 500 }}>{k}</span>
                        <span style={{ color: "#0f172a", fontWeight: 600, fontFamily: k === "Facility ID" || k === "Coordinates" ? "DM Mono, monospace" : "inherit", fontSize: k === "Facility ID" ? 12 : 14 }}>{v}</span>
                      </div>
                    ))}
                    <button style={{ marginTop: 16, width: "100%", padding: "12px", background: "#16a34a", color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none" }}>
                      Generate Regulatory Report
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ background: "#f0fdf4", border: "2px dashed #bbf7d0", borderRadius: 20, padding: 48, textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🕸️</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#166534", marginBottom: 8 }}>Select a Facility</div>
                    <p style={{ fontSize: 14, color: "#4ade80" }}>Click any facility card to view detailed GNN attribution results and generate regulatory reports</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* GNN EXPLAINER */}
            <div style={{ background: "#0f172a", borderRadius: 20, padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#86efac", marginBottom: 12 }}>⬡ Graph Neural Network Architecture</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { node: "Plume Node", desc: "Encodes: location, shape, flux, wind vector", color: "#ef4444" },
                  { node: "Facility Nodes", desc: "Infrastructure polygons from GIS database", color: "#f59e0b" },
                  { node: "Edge Weights", desc: "Spatial distance + atmospheric transport probability", color: "#3b82f6" },
                  { node: "Attribution Score", desc: "Message passing → softmax → facility match", color: "#16a34a" },
                ].map((n, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: n.color, marginTop: 4, flexShrink: 0 }}/>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{n.node}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{n.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
const AboutPage = () => (
  <div style={{ paddingTop: 68, minHeight: "100vh", background: "#fff" }}>
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <EarthLogo size={80}/>
        <h1 style={{ fontSize: 42, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginTop: 20, marginBottom: 16 }}>About MethaneSense</h1>
        <p style={{ fontSize: 18, color: "#475569", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
          An AI-powered, physics-aware, and graph-enabled system that transforms satellite methane detection into actionable, real-time climate intelligence.
        </p>
      </div>

      <div style={{ background: "#f0fdf4", borderRadius: 24, padding: 40, border: "1px solid #bbf7d0", marginBottom: 40 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#166534", marginBottom: 16 }}>🚨 The Problem</h2>
        <p style={{ color: "#166534", lineHeight: 1.8, fontSize: 16 }}>
          Methane super-emitters — leaks exceeding <strong>100 kg/hour</strong> — account for <strong>20–50%</strong> of the oil and gas sector's total methane emissions, despite representing fewer than <strong>1%</strong> of all emission sources. Methane is <strong>80× more potent</strong> than CO₂ over a 20-year horizon. Current systems suffer from excessive false positives, slow batch processing, and critically weak source attribution.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 40 }}>
        {[
          { icon: "🐢", title: "Slow Batch Processing", desc: "Detection delays of hours to days prevent timely regulatory response", type: "danger" },
          { icon: "❌", title: "High False Positives", desc: "Cloud cover and surface reflectance artifacts mimic plume signatures", type: "warning" },
          { icon: "🔍", title: "Weak Attribution", desc: "Detection without facility-level attribution = zero enforcement", type: "danger" },
        ].map((p, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, padding: 24 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icon}</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{p.title}</h3>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{p.desc}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>Tech Stack</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 }}>
        {[
          { cat: "Satellite Data", items: "Sentinel-5P / TROPOMI · NASA EMIT" },
          { cat: "Plume Segmentation", items: "Vision Transformer (ViT) · U-Net++" },
          { cat: "Flux Quantification", items: "Physics-Informed Neural Network · ECMWF ERA5" },
          { cat: "Source Attribution", items: "Graph Neural Network · GIS Infrastructure Maps" },
          { cat: "Cloud Handling", items: "Spatial Interpolation · Historical Decay Models" },
          { cat: "Infrastructure", items: "Docker · FastAPI · REST API · PostgreSQL" },
        ].map((t, i) => (
          <div key={i} style={{ background: "#f8faf8", borderRadius: 14, padding: 18, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{t.cat}</div>
            <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 500, fontFamily: "DM Mono, monospace" }}>{t.items}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "linear-gradient(135deg, #16a34a, #166534)", borderRadius: 24, padding: 48, textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 12 }}>One-Line Mission</h2>
        <p style={{ fontSize: 18, color: "#bbf7d0", lineHeight: 1.7, fontStyle: "italic" }}>
          "An AI-powered, physics-aware, graph-enabled system that transforms satellite methane detection into actionable, real-time, enforceable climate intelligence."
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 28 }}>
          <Link to="/dashboard" style={{ padding: "12px 28px", background: "#fff", color: "#16a34a", borderRadius: 12, fontWeight: 700, fontSize: 15, display: "inline-block" }}>Launch Dashboard</Link>
          <Link to="/detection" style={{ padding: "12px 28px", background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 15, border: "1px solid rgba(255,255,255,0.3)", display: "inline-block" }}>Explore Detection</Link>
        </div>
      </div>
    </div>
  </div>
);

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Router>
      <GlobalStyle/>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/dashboard" element={<DashboardPage/>}/>
        <Route path="/detection" element={<DetectionPage/>}/>
        <Route path="/analytics" element={<AnalyticsPage/>}/>
        <Route path="/attribution" element={<AttributionPage/>}/>
        <Route path="/about" element={<AboutPage/>}/>
      </Routes>
      <Chatbot/>
    </Router>
  );
}

