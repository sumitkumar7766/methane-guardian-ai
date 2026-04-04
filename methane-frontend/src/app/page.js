"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Upload,
  Globe,
  ShieldAlert,
  BarChart2,
  Wind,
  Map as MapIcon,
  ChevronRight,
  Activity,
  AlertCircle,
  Info,
  Database,
  Layers,
  Target,
  CheckCircle,
  FileText,
  Satellite,
  MapPin,
  TrendingUp,
  Flame,
  Zap,
  ShieldCheck,
  Map as MapDetail,
  Sparkles,
  BrainCircuit,
  ListChecks,
  WindIcon,
  Send,
  Scale,
  TreePine,
  Newspaper,
  PinIcon,
  InfoIcon,
  XIcon,
  DownloadIcon,
} from "lucide-react";

import WarningIcon from "@mui/icons-material/Warning";
import ReactMarkdown from "react-markdown";

export default function App() {
  const [activeTab, setActiveTab] = useState("scan");
  const [lat, setLat] = useState("23.2599");
  const [lng, setLng] = useState("77.4126");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // AI States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  const [aiPlan, setAiPlan] = useState("");
  const [aiCompliance, setAiCompliance] = useState("");
  const [aiImpact, setAiImpact] = useState("");
  const [aiNews, setAiNews] = useState("");
  const [showAiHub, setShowAiHub] = useState(false);
  const [activeAiTool, setActiveAiTool] = useState("narrative");
  const [alerts, setAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const [newAlert, setNewAlert] = useState(null);

  const fetchAlerts = async () => {
    try {
      setLoadingAlerts(true);

      const res = await fetch("http://127.0.0.1:8000/alerts?count=10");
      const data = await res.json();

      if (Array.isArray(data)) {
        // 🆕 New Alert Detection
        if (alerts.length && data[0]?.id !== alerts[0]?.id) {
          setNewAlert(data[0]);
          setTimeout(() => setNewAlert(null), 6000);
        }

        setAlerts(data);
      } else {
        console.error("API Error:", data);
      }
    } catch (err) {
      console.log("Fetch error:", err.message);
    } finally {
      setLoadingAlerts(false);
    }
  };

  useEffect(
    () => {
      if (activeTab === "alerts") {
        fetchAlerts();

        const interval = setInterval(fetchAlerts, 30000); // 30 sec auto refresh

        return () => clearInterval(interval);
      }
    },
    [activeTab],
    800000,
  );

  const fetchReport = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/report");
      const data = await res.json();

      if (Array.isArray(data)) {
        setReportData(data);
        setShowPopup(true); // popup open
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const mapRef = useRef(null);
  const leafletMap = useRef(null);

  const heatmapPoints = [
    {
      pos: [31.9686, -99.9018],
      risk: "High",
      ppm: 5.4,
      loc: "Texas, USA",
      trend: "+12%",
    },
    {
      pos: [22.2587, 71.1924],
      risk: "Medium",
      ppm: 3.2,
      loc: "Gujarat, IN",
      trend: "-2%",
    },
    {
      pos: [26.0667, 50.5577],
      risk: "High",
      ppm: 6.8,
      loc: "Awali, BH",
      trend: "+24%",
    },
    {
      pos: [53.5461, -113.4938],
      risk: "Low",
      ppm: 1.2,
      loc: "Alberta, CA",
      trend: "Stable",
    },
  ];

  // --- Gemini API Configuration ---
  // Make sure your .env.local has: NEXT_PUBLIC_GEMINI_API_KEY=your_key
  // const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  // console.log("Using Gemini API Key:", apiKey ? "✅ Present" : "❌ Missing");
  // const GEMINI_MODEL = "gemini-1.5-flash";
  // const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  // --- Corrected callGemini Function ---
  // const callGemini = async (
  //   prompt,
  //   systemPrompt = "You are an expert environmental scientist.",
  // ) => {
  //   try {
  //     const response = await fetch(BASE_URL, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         // System instruction ko alag se pass karna padta hai
  //         system_instruction: {
  //           parts: [{ text: systemPrompt }],
  //         },
  //         contents: [
  //           {
  //             parts: [{ text: prompt }],
  //           },
  //         ],
  //         generationConfig: {
  //           temperature: 0.2, // Analysis ke liye low temperature best hai
  //           topP: 0.8,
  //           maxOutputTokens: 1000,
  //         },
  //       }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       // Agar abhi bhi 404 aaye, toh console check karein
  //       console.error("Gemini API Error Detail:", data);
  //       throw new Error(data.error?.message || "API Error");
  //     }

  //     return (
  //       data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI"
  //     );
  //   } catch (error) {
  //     console.error("Gemini Error:", error);
  //     return "AI Error: " + error.message;
  //   }
  // };

  const callAI = async (prompt) => {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization:
            "Bearer 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",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      console.log("AI Response Data:", data);
      return data.choices?.[0]?.message?.content || "No AI response";
    } catch (err) {
      console.error(err.message);
      return "AI error";
    }
  };

  const generateAIIntelligence = async (data) => {
    setAiLoading(true);
    try {
      const insightPrompt = `
        You are a methane detection AI.

        Analyze this data:
        - Methane: ${data.max_methane_concentration_ppm} ppm
        - Emission: ${data.stage2_physics?.estimated_emission_rate_kg_hr} kg/hr
        - Source: ${data.detected_source?.node_id}

        Return STRICT JSON:
        {
          "risk_level": "Low/Medium/High/Critical",
          "source_type": "",
          "urgency": "",
          "summary": ""
        }
        `;
      const insight = await callAI(insightPrompt);
      setAiInsight(insight);
    } catch (err) {
      setAiInsight("AI analysis unavailable.");
    } finally {
      setAiLoading(false);
    }
  };

  const generateMitigationPlan = async () => {
    setAiLoading(true);
    setActiveAiTool("mitigation");
    try {
      const planPrompt = `Technical mitigation plan for ${results.detected_source?.node_id} at ${results.stage2_physics?.peak_concentration_ppm || results.max_methane_concentration_ppm} PPM and ${results.stage2_physics?.estimated_emission_rate_kg_hr} kg/hr. 3 prioritized technical steps.`;
      const plan = await callAI(planPrompt);
      setAiPlan(plan);
    } catch (err) {
      setAiPlan("Error generating plan.");
    } finally {
      setAiLoading(false);
    }
  };

  const generateComplianceCheck = async () => {
    setAiLoading(true);
    setActiveAiTool("compliance");
    try {
      const prompt = `Evaluate if a leak of ${results.max_methane_concentration_ppm} PPM and ${results.stage2_physics?.estimated_emission_rate_kg_hr} kg/hr violates standard industrial methane regulations (EPA/EU). Give a short legal verdict.`;
      const verdict = await callAI(prompt);
      setAiCompliance(verdict);
    } catch (err) {
      setAiCompliance("Compliance check failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const generateImpactForecast = async () => {
    setAiLoading(true);
    setActiveAiTool("impact");
    try {
      const prompt = `Based on a leak of ${results.stage2_physics?.estimated_emission_rate_kg_hr} kg/hr of methane, calculate the equivalent CO2 impact and the potential local warming effect over 20 years. Be concise.`;
      const forecast = await callAI(prompt);
      setAiImpact(forecast);
    } catch (err) {
      setAiImpact("Impact forecast failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const generateNewsGrounding = async () => {
    setAiLoading(true);
    setActiveAiTool("news");
    try {
      const prompt = `Search for any recent news or reports about gas leaks, industrial accidents, or methane plumes near coordinates ${lat}, ${lng} (Bhopal region). Are there any known historical issues with industrial facilities there?`;
      const news = await callAI(prompt);
      setAiNews(news);
    } catch (err) {
      setAiNews("Grounded search unavailable.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    const loadLeaflet = () => {
      if (window.L) {
        initMap();
        return;
      }
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => initMap();
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || leafletMap.current) return;
      const L = window.L;
      leafletMap.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([20, 0], 2);
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 19 },
      ).addTo(leafletMap.current);
      heatmapPoints.forEach((p) => {
        L.circle(p.pos, {
          color: p.risk === "High" ? "#ef4444" : "#f59e0b",
          fillOpacity: 0.2,
          radius: 200000,
        })
          .addTo(leafletMap.current)
          .bindPopup(`<b>${p.loc}</b><br/>CH4: ${p.ppm} ppm`);
      });
    };
    loadLeaflet();
  }, []);

  const handleAction = async () => {
    setLoading(true);
    setResults(null);
    setShowAiHub(false);
    setActiveAiTool("narrative");
    const L = window.L;

    try {
      const response = await fetch("http://localhost:8000/predict-location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // API Key ki line maine hata di hai kyunki aapke backend mein nahi hai
        },
        body: JSON.stringify({
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        }),
      });

      if (!response.ok) throw new Error("Backend connection failed");

      const data = await response.json();

      // ✅ Sabse zaroori step: Backend se data extract karna
      // Aapka backend "pipeline_results" key ke andar sara data bhej raha hai
      const aiResults = data.pipeline_results;

      setResults(aiResults);
      setShowAiHub(true);

      // Map Logic
      if (leafletMap.current && L) {
        // Backend se mili exact primary source ki location
        const sourceLat = aiResults.stage3_graph.primary_source.lat;
        const sourceLng = aiResults.stage3_graph.primary_source.lng;

        leafletMap.current.flyTo([sourceLat, sourceLng], 13, {
          duration: 2,
        });

        L.marker([sourceLat, sourceLng])
          .addTo(leafletMap.current)
          .bindPopup(
            `<b>Target:</b> ${aiResults.stage3_graph.primary_source.infrastructure_type}`,
          )
          .openPopup();

        L.circle([sourceLat, sourceLng], {
          color:
            aiResults.final_assessment.alert_level === "CRITICAL"
              ? "#ef4444"
              : "#eab308",
          fillOpacity: 0.4,
          radius: 800,
        }).addTo(leafletMap.current);
      }

      // Gemini ko data bhejna
      generateAIIntelligence(aiResults);
    } catch (err) {
      console.error("Backend Error:", err);
      alert(
        "Backend se connect nahi ho paya. Make sure uvicorn is running on port 8000",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAction2 = async () => {
    if (!file) return alert("Please select a .nc satellite file first");

    setLoading(true);
    setResults(null);
    setShowAiHub(false);
    setActiveAiTool("narrative");
    const L = window.L;

    // 1. FormData taiyar karein (File upload ke liye zaroori hai)
    const formData = new FormData();
    formData.append("file", file); // 'file' wahi state hai jisme aapne input se file save ki thi

    try {
      // 2. API Call (X-API-Key ki zaroorat nahi hai aapke current backend mein)
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData, // JSON.stringify nahi use karna yahan
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "File processing failed");
      }

      const data = await response.json();

      // 3. Data Extraction
      // Note: Aapka backend "/predict" ke liye direct "pipeline_results" bhej raha hai
      const aiResults = data.pipeline_results;
      setResults(aiResults);
      setShowAiHub(true);

      // 4. Leaflet Map Update
      if (leafletMap.current && L) {
        // Kyunki file upload mein coordinates fixed nahi hote,
        // hum backend se mile x, y coordinates ko use kar sakte hain ya user ke input wale lat/lng
        const targetLat = parseFloat(lat);
        const targetLng = parseFloat(lng);

        leafletMap.current.flyTo([targetLat, targetLng], 14, {
          duration: 2,
        });

        L.marker([targetLat, targetLng])
          .addTo(leafletMap.current)
          .bindPopup(
            `<b>Plume Detected:</b> Node ${aiResults.detected_source.node_id}`,
          )
          .openPopup();

        L.circle([targetLat, targetLng], {
          color: "#ef4444",
          fillOpacity: 0.5,
          radius: 1000, // 1km radius plume visualization
        }).addTo(leafletMap.current);
      }

      // 5. Gemini AI Analysis trigger
      generateAIIntelligence(aiResults);
    } catch (err) {
      console.error("Upload Error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col overflow-hidden">
      {/* 1. HEADER */}
      <nav className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur sticky top-0 z-[1001]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
            <Globe size={24} />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-slate-800">
              Methane<span className="text-emerald-600">Guardian</span>
            </span>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              AI Surveillance Network
            </div>
          </div>
        </div>

        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
          {["scan", "alerts", "upload"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all uppercase ${
                activeTab === tab
                  ? "bg-white shadow-md text-emerald-700"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab === "scan" && "Global Scan"}
              {tab === "alerts" && "Alerts"}
              {tab === "upload" && "Data Analysis"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
              USE Sentinel-5P
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>{" "}
              SYSTEM OFFLINE
            </span>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400">
            <Satellite size={20} />
          </div>
        </div>
      </nav>

      <div className="relative flex flex-1">
        {/* 2. SIDEBAR */}
        <aside className="w-80 border-r border-slate-100 bg-white p-6 flex flex-col gap-6 overflow-y-auto z-20 h-full">
          <button
            onClick={fetchReport}
            disabled={loading}
            className="w-full bg-red-950 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:bg-slate-300 transform active:scale-95"
          >
            {loading ? (
              <Activity className="animate-spin" size={20} />
            ) : (
              <>
                <Search size={18} /> SEE TOP LEAKS REPORT
              </>
            )}
          </button>
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Control Center
              </h3>
              <Info size={14} className="text-slate-300" />
            </div>

            {activeTab === "alerts" && (
              <div className="flex-1 overflow-y-auto bg-slate-50">
                {/* Sticky topbar */}
                <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-[7px] h-[7px] rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-800 leading-tight">
                        Methane alerts
                      </p>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        Auto-refreshes every 30s
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={fetchAlerts}
                    className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5"
                  >
                    {/* <RefreshIcon
                      className={`w-3 h-3 ${loadingAlerts ? "animate-spin" : ""}`}
                    /> */}
                    Refresh
                  </button>
                </div>

                {/* Summary strip */}
                <div className="flex gap-2 px-3.5 py-3 bg-white border-b border-slate-100">
                  {[
                    {
                      label: "High",
                      val: alerts.filter((a) => a.risk === "HIGH").length,
                      color: "text-red-700",
                    },
                    {
                      label: "Medium",
                      val: alerts.filter((a) => a.risk === "MEDIUM").length,
                      color: "text-amber-700",
                    },
                    {
                      label: "Low",
                      val: alerts.filter((a) => a.risk === "LOW").length,
                      color: "text-green-700",
                    },
                    {
                      label: "Total",
                      val: alerts.length,
                      color: "text-slate-800",
                    },
                  ].map(({ label, val, color }) => (
                    <div
                      key={label}
                      className="flex-1 bg-slate-50 rounded-lg px-2.5 py-2"
                    >
                      <p className={`text-lg font-medium ${color}`}>{val}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Alert cards list */}
                <div className="px-3.5 pt-3 pb-4 flex flex-col gap-2">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">
                    Active alerts
                  </p>
                  {loadingAlerts ? (
                    <p className="text-xs text-slate-400 py-6 text-center">
                      Loading...
                    </p>
                  ) : (
                    alerts.map((alert, i) => (
                      <div
                        key={i}
                        className="bg-white border border-slate-100 rounded-xl p-4"
                      >
                        {/* Row 1 — risk + flux + confidence */}
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${
                                alert.risk === "HIGH"
                                  ? "bg-red-50 text-red-700"
                                  : alert.risk === "MEDIUM"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-green-50 text-green-700"
                              }`}
                            >
                              {alert.risk.charAt(0) +
                                alert.risk.slice(1).toLowerCase()}
                            </span>
                            <span className="text-[22px] font-medium text-slate-800 leading-none">
                              {alert.methane_flux.toFixed(2)}
                              <span className="text-[11px] font-normal text-slate-400 ml-0.5">
                                ppb
                              </span>
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {Math.round(alert.confidence * 100)}% conf.
                          </span>
                        </div>

                        {/* Row 2 — status dot + label + timestamp */}
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                alert.status === "ACTIVE"
                                  ? "bg-red-500 animate-pulse"
                                  : alert.status === "RESOLVED"
                                    ? "bg-green-600"
                                    : alert.status === "MONITORING"
                                      ? "bg-amber-500"
                                      : "bg-slate-400"
                              }`}
                            />
                            <span className="text-[11px] text-slate-500 capitalize">
                              {alert.status.charAt(0) +
                                alert.status.slice(1).toLowerCase()}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {new Date(alert.timestamp).toLocaleDateString(
                              "en-IN",
                              { day: "2-digit", month: "short" },
                            )}
                            {" · "}
                            {new Date(alert.timestamp).toLocaleTimeString(
                              "en-IN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              },
                            )}
                          </span>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-100 mb-3" />

                        {/* Row 3 — location + wind */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <PinIcon className="w-3 h-3 opacity-40 flex-shrink-0" />
                            <span className="text-slate-400 mr-0.5">
                              Lat/Lon
                            </span>
                            {alert.location.latitude.toFixed(4)}° N,{" "}
                            {alert.location.longitude.toFixed(4)}° E
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <WindIcon className="w-3 h-3 opacity-40 flex-shrink-0" />
                            <span className="text-slate-400 mr-0.5">Wind</span>
                            {alert.wind.speed.toFixed(2)} m/s ·{" "}
                            {alert.wind.direction}°
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "scan" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="group">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5 ml-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-2.5 text-xs font-bold focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5 ml-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-2.5 text-xs font-bold focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAction}
                  disabled={loading}
                  className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:bg-slate-300 transform active:scale-95"
                >
                  {loading ? (
                    <Activity className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Search size={18} /> EXECUTE SCAN
                    </>
                  )}
                </button>
              </div>
            )}
            {activeTab === "upload" && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer relative">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="text-slate-400 mx-auto mb-2" size={20} />
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    {file ? file.name : "Select Dataset"}
                  </p>
                </div>
                <button
                  onClick={handleAction2}
                  disabled={!file || loading}
                  className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all disabled:bg-slate-200"
                >
                  <Database size={18} /> START ANALYSIS
                </button>
              </div>
            )}
          </section>

          {showPopup && (
            <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-6">
              <div className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden border border-slate-100">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      <WarningIcon className="w-4 h-4 text-red-700" />
                    </div>
                    <div>
                      <h2 className="text-sm font-medium text-slate-800">
                        Regulatory intervention report
                      </h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {reportData.length} facilities · ranked by danger score
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-[12px]">
                    <thead>
                      <tr className="bg-slate-50">
                        {[
                          "#",
                          "Facility",
                          "Flux",
                          "Confidence",
                          "Score",
                          "Action",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-3 py-2.5 text-left text-[10px] font-medium text-slate-400 uppercase tracking-wide border-b border-slate-100 whitespace-nowrap first:text-center first:w-10"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((r, i) => (
                        <tr
                          key={i}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                        >
                          {/* Rank */}
                          <td className="px-3 py-3 text-center">
                            <span
                              className={`w-[22px] h-[22px] rounded-full inline-flex items-center justify-center text-[11px] font-medium border
                    ${r.rank <= 2 ? "bg-red-50 border-red-200 text-red-700" : "bg-slate-100 border-slate-200 text-slate-500"}`}
                            >
                              {r.rank}
                            </span>
                          </td>

                          {/* Facility */}
                          <td className="px-3 py-3">
                            <p className="font-medium text-slate-800">
                              {r.facility}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {r.facility_type}
                            </p>
                          </td>

                          {/* Flux */}
                          <td className="px-3 py-3">
                            <span className="font-medium text-slate-800">
                              {r.methane_flux.toFixed(1)}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-0.5">
                              ppb
                            </span>
                          </td>

                          {/* Confidence bar */}
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden min-w-[40px]">
                                <div
                                  className="h-full bg-green-600 rounded-full"
                                  style={{
                                    width: `${Math.round(r.confidence * 100)}%`,
                                  }}
                                />
                              </div>
                              <span className="text-[11px] text-slate-500 whitespace-nowrap">
                                {Math.round(r.confidence * 100)}%
                              </span>
                            </div>
                          </td>

                          {/* Score */}
                          <td className="px-3 py-3">
                            <span
                              className={`font-medium ${
                                r.danger_score >= 8
                                  ? "text-red-700"
                                  : r.danger_score >= 5
                                    ? "text-amber-700"
                                    : "text-green-700"
                              }`}
                            >
                              {r.danger_score}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-3 py-3">
                            <span className="inline-block text-[10px] bg-amber-50 text-amber-800 rounded-md px-2 py-1 leading-relaxed max-w-[130px]">
                              {r.recommended_action}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">
                    Generated ·{" "}
                    {new Date().toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {newAlert && (
            <div className="mx-3.5 mt-3 bg-white border border-red-200 rounded-xl p-3 flex gap-2.5 items-start">
              <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <WarningIcon className="w-3.5 h-3.5 text-red-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-slate-800">
                  New {newAlert.risk.toLowerCase()} alert detected
                </p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {newAlert.methane_flux} at{" "}
                  {newAlert.location.latitude.toFixed(1)}° N,{" "}
                  {newAlert.location.longitude.toFixed(1)}° E
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Just now</p>
              </div>
              <button
                onClick={() => setNewAlert(null)}
                className="text-slate-300 text-base leading-none mt-0.5"
              >
                ×
              </button>
            </div>
          )}

          {/* ✨ AI INTELLIGENCE HUB */}
          {showAiHub && (
            <section className="pt-4 border-t-2 border-emerald-100 animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                  <BrainCircuit size={16} /> ✨ AI Intelligence Hub
                </h3>
              </div>

              {/* Result Area */}
              <div className="bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl p-4 border border-emerald-100 shadow-sm mb-4 min-h-[100px] flex flex-col justify-center">
                {aiLoading ? (
                  <div className="flex items-center gap-3 text-slate-400">
                    <Activity size={14} className="animate-spin" />
                    <span className="text-[10px] font-bold animate-pulse uppercase">
                      AI Processing Tool...
                    </span>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-700 font-medium leading-relaxed prose prose-sm max-w-none">
                    <ReactMarkdown>
                      {activeAiTool === "narrative"
                        ? aiInsight || "Generating expert narrative..."
                        : activeAiTool === "mitigation"
                          ? aiPlan || "Awaiting mitigation strategy..."
                          : activeAiTool === "compliance"
                            ? aiCompliance || "Awaiting legal audit..."
                            : activeAiTool === "impact"
                              ? aiImpact || "Awaiting impact forecast..."
                              : activeAiTool === "news"
                                ? aiNews || "Searching grounded incidents..."
                                : ""}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {/* Tool Grid */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setActiveAiTool("narrative");
                    generateAIIntelligence(results);
                  }}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${activeAiTool === "narrative" ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-100 text-slate-500 hover:border-emerald-200"}`}
                >
                  <Sparkles size={14} />
                  <span className="text-[8px] font-black uppercase">
                    ✨ Narrative
                  </span>
                </button>
                <button
                  onClick={generateMitigationPlan}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${activeAiTool === "mitigation" ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-100 text-slate-500 hover:border-blue-200"}`}
                >
                  <ListChecks size={14} />
                  <span className="text-[8px] font-black uppercase">
                    ✨ Plan
                  </span>
                </button>
                <button
                  onClick={generateComplianceCheck}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${activeAiTool === "compliance" ? "bg-amber-600 border-amber-600 text-white" : "bg-white border-slate-100 text-slate-500 hover:border-amber-200"}`}
                >
                  <Scale size={14} />
                  <span className="text-[8px] font-black uppercase">
                    ✨ Compliance
                  </span>
                </button>
                <button
                  onClick={generateImpactForecast}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${activeAiTool === "impact" ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-100 text-slate-500 hover:border-emerald-200"}`}
                >
                  <TreePine size={14} />
                  <span className="text-[8px] font-black uppercase">
                    ✨ Forecast
                  </span>
                </button>
                <button
                  onClick={generateNewsGrounding}
                  className={`p-2.5 rounded-xl border col-span-2 flex items-center justify-center gap-2 transition-all ${activeAiTool === "news" ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"}`}
                >
                  <Newspaper size={14} />
                  <span className="text-[8px] font-black uppercase">
                    ✨ Grounded Incident Search
                  </span>
                </button>
              </div>
            </section>
          )}

          {/* SYSTEM ALERTS */}
          {results && (
            <section className="pt-4 border-t border-slate-100">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                <ShieldAlert size={14} className="text-red-500" /> Critical
                Alerts
              </h3>
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Flame size={12} className="text-red-600" />
                  <span className="text-[10px] font-black text-red-800 uppercase tracking-tighter">
                    Super-Emitter Detected
                  </span>
                </div>
                <p className="text-[9px] text-red-700/80 font-bold leading-tight">
                  Detected at {results.detected_source?.node_id}. Facility ID
                  verified.
                </p>
              </div>
            </section>
          )}

          {/* HEAT MAP DISTRIBUTION */}
          {results && (
            <section className="pt-4 border-t border-slate-100 mb-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                <MapDetail size={14} className="text-blue-500" /> Global
                Hotspots
              </h3>
              <div className="space-y-2">
                {heatmapPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${point.risk === "High" ? "bg-red-500" : "bg-amber-500"}`}
                      />
                      <span className="text-[10px] font-bold text-slate-800">
                        {point.loc}
                      </span>
                    </div>
                    <span className="text-[9px] font-black text-slate-400">
                      {point.ppm} PPM
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* 3. MAIN DISPLAY */}
        <main className="fixed inset-0 z-0">
          {/* FLOATING INTERFACE */}
          <div className="absolute top-6 left-6 z-[1000] space-y-3">
            <div className="bg-white/90 backdrop-blur-xl shadow-2xl border border-white p-4 rounded-3xl flex items-center gap-5">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-400">
                <Target size={24} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                  Target Coordinates
                </p>
                <p className="text-base font-black text-slate-800 leading-none">
                  {lat}°N, {lng}°E
                </p>
              </div>
            </div>

            {loading && (
              <div className="bg-white/90 backdrop-blur-xl shadow-2xl border border-white p-4 rounded-3xl flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
                  Processing Satellite Data...
                </span>
              </div>
            )}
          </div>

          {/* RESULTS OVERLAY */}
          {results && !loading && (
            <div className="absolute bottom-8 left-[340px] right-8 z-[1000] grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom-10 duration-500">
              {" "}
              <div className="bg-white p-5 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Peak Concentration
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {results.stage2_physics?.peak_concentration_ppm ||
                      results.max_methane_concentration_ppm}{" "}
                    <span className="text-[10px] text-slate-400 font-bold">
                      PPM
                    </span>
                  </p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Wind size={24} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Estimated Flux
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {results.stage2_physics?.estimated_emission_rate_kg_hr}{" "}
                    <span className="text-[10px] text-slate-400 font-bold">
                      KG/H
                    </span>
                  </p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-4 col-span-2 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <ShieldAlert size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Attributed Facility
                    </p>

                    <span className="text-[9px] font-black px-2 py-1 bg-emerald-600 text-white rounded-lg uppercase">
                      {results.confidence_score_percent || 0}% Conf.
                    </span>
                  </div>

                  {/* Facility Name */}
                  <p className="text-lg font-black text-slate-900 leading-tight">
                    {results.attributed_facility?.name ||
                      results.detected_source?.node_id ||
                      "Unknown Facility"}
                  </p>

                  {/* 🔥 NEW: Facility Type + Location */}
                  {results.attributed_facility && (
                    <p className="text-xs text-slate-400 mt-1">
                      {results.attributed_facility.type} •{" "}
                      {results.attributed_facility.lat?.toFixed(2)},{" "}
                      {results.attributed_facility.lng?.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="absolute top-6 right-6 z-[1000] bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white text-[9px] font-black space-y-3">
            <p className="text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-2">
              Sensor Legend
            </p>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>{" "}
              CRITICAL PLUME
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>{" "}
              TRACE ANOMALY
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>{" "}
              SENSOR STABLE
            </div>
          </div>

          <div ref={mapRef} className="h-full w-full z-0" />
        </main>
      </div>

      <footer className="h-12 bg-white border-t border-slate-100 flex items-center justify-between px-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        <div className="flex gap-8">
          <span className="flex items-center gap-2">
            <Database size={14} className="text-slate-300" /> SENTINEL-5P
            TROPOMI
          </span>
          <span className="flex items-center gap-2">
            <Layers size={14} className="text-slate-300" /> PHYSICS-GRAPH AI
            V4.1
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Activity size={12} className="text-emerald-500" /> Surveillance Feed
          Live
        </div>
      </footer>

      <style>{`
        .leaflet-popup-content-wrapper { border-radius: 1.5rem !important; padding: 0.5rem !important; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15) !important; }
        .leaflet-popup-tip-container { display: none; }
        .leaflet-container { font-family: inherit !important; background: #f1f5f9 !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}
