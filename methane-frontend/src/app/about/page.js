"use client";
import React, { useState, useEffect } from "react";
import { 
  Activity, Map as MapIcon, AlertTriangle, Database, 
  Menu, X, Bell, User, CloudLightning, Settings, Layers,
  Globe, Shield, Zap, Target, Users, Cpu, Code, Leaf, Award, ArrowRight
} from "lucide-react";

// --- CUSTOM HOOKS ---
// Hook to animate numbers counting up
const useCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Ease out expo
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

// --- COMPONENTS ---

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="group bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:bg-slate-800/80 hover:-translate-y-1 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] hover:border-cyan-500/30">
    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-all duration-300">
      <Icon size={24} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const TeamMember = ({ name, role, color, delay }) => (
  <div className={`group bg-slate-900/50 backdrop-blur border border-white/5 rounded-2xl p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:bg-slate-800 animate-fade-in-up`} style={{ animationDelay: delay }}>
    <div className="relative w-24 h-24 mx-auto mb-4">
      <div className={`absolute inset-0 rounded-full blur-xl opacity-40 bg-gradient-to-br ${color} group-hover:opacity-70 transition-opacity`}></div>
      <div className={`relative w-full h-full rounded-full border-2 border-slate-800 bg-gradient-to-br ${color} flex items-center justify-center shadow-xl`}>
         <User size={32} className="text-white/80" />
      </div>
    </div>
    <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
    <p className="text-sm font-medium text-cyan-400 mb-3">{role}</p>
    {/* <div className="flex justify-center gap-3">
      <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">< size={14} /></a>
      <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-[#0077b5] hover:bg-white/10 transition-colors"><Linkedin size={14} /></a>
    </div> */}
  </div>
);

const TechBadge = ({ icon: Icon, name }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
    <Icon size={16} className="text-cyan-400" />
    <span className="text-sm font-medium">{name}</span>
  </div>
);

// --- MAIN APP ---

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Counters
  const emissionsDetected = useCounter(12450, 2500);
  const facilitiesTracked = useCounter(842, 2500);
  const alertsSent = useCounter(3910, 2500);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans selection:bg-emerald-500/30 flex flex-col overflow-hidden relative scroll-smooth">
      
      {/* Global CSS for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #030712; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; border: 2px solid #030712; }
        ::-webkit-scrollbar-thumb:hover { background: #334155; }
        
        .bg-grid {
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { 
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
          opacity: 0;
        }

        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}} />

      {/* TOP NAVBAR */}
      <header className="h-16 border-b border-white/5 bg-[#080b14]/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 z-50 shrink-0 absolute top-0 w-full">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CloudLightning size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white hidden sm:block">Methane<span className="text-emerald-400 font-light">Guardian AI</span></span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/5">
            <Bell size={18} />
          </button>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-slate-800 cursor-pointer hover:border-emerald-500/50 transition-colors">
            <User size={14} className="text-slate-400" />
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden pt-16">
        
        {/* Fixed Background Elements */}
        <div className="fixed inset-0 bg-grid pointer-events-none z-0 opacity-50"></div>
        <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

        {/* SIDEBAR */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'} transition-all duration-300 ease-in-out border-r border-white/5 bg-[#080b14]/90 backdrop-blur-xl z-40 flex flex-col shrink-0 absolute lg:relative h-full`}>
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">Platform</div>
            {[
              { icon: Activity, label: 'Dashboard' },
              { icon: AlertTriangle, label: 'Alerts' },
              { icon: MapIcon, label: 'Facilities' },
              { icon: Database, label: 'API Data Explorer' },
            ].map((item, idx) => (
              <a key={idx} href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200`}>
                <item.icon size={18} /> {item.label}
              </a>
            ))}
            
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-8 mb-4 px-3">Organization</div>
            {[
              { icon: Layers, label: 'About Us', active: true },
              { icon: Settings, label: 'Settings' },
            ].map((item, idx) => (
              <a key={idx} href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                item.active 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}>
                <item.icon size={18} /> {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* MAIN SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
          
          {/* HERO SECTION */}
          <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
            
            {/* Animated Particles/Orbs behind Hero */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none">
              <div className="absolute top-0 left-1/2 w-4 h-4 bg-emerald-500 rounded-full blur-[2px] shadow-[0_0_20px_#10b981]"></div>
              <div className="absolute bottom-0 right-1/4 w-3 h-3 bg-cyan-500 rounded-full blur-[2px] shadow-[0_0_20px_#06b6d4]"></div>
            </div>
            
            <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-8 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Leaf size={14} /> Mission Control
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight">
                We Are Building the <br className="hidden md:block"/>
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-gradient pb-2 inline-block">Future of Methane Monitoring</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Combining artificial intelligence, hyperspectral satellite data, and real-time analytics to detect, visualize, and drastically reduce super-emitter events globally.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-105 flex items-center gap-2">
                  Explore the System <ArrowRight size={18} />
                </button>
                <button className="px-8 py-4 rounded-xl font-bold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  Read Our Manifesto
                </button>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-2 text-slate-500 opacity-70">
              <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
              <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-transparent"></div>
            </div>
          </section>

          {/* OUR STORY / PROBLEM SECTION */}
          <section className="py-24 px-6 lg:px-12 relative border-t border-white/5 bg-[#050810]/50 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-3xl lg:text-4xl font-black text-white mb-6">The Invisible Crisis.</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-6">
                  Methane is over <strong className="text-emerald-400 font-semibold">80 times more potent</strong> than carbon dioxide at trapping heat in the short term. Yet, industrial super-emitters constantly leak thousands of kilograms per hour completely undetected.
                </p>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  We started Methane Guardian AI because you cannot fix what you cannot see. Our inspiration came from the gap between raw, complex satellite telemetry and the actionable insights needed by environmental agencies to actually stop the leaks.
                </p>
                <div className="flex items-center gap-4 text-sm font-bold text-white uppercase tracking-widest">
                  <span className="w-12 h-px bg-cyan-500"></span> See the unseen
                </div>
              </div>
              
              <div className="relative animate-float" style={{ animationDelay: '0.4s' }}>
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 blur-3xl rounded-full"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                   {/* Abstract Data Viz Graphic */}
                   <div className="flex items-end justify-between h-48 gap-2 border-b border-white/10 pb-4 mb-4">
                     {[30, 45, 25, 85, 40, 60, 95, 50].map((h, i) => (
                       <div key={i} className={`w-full rounded-t-sm ${h > 70 ? 'bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : h > 50 ? 'bg-amber-500/80' : 'bg-cyan-500/80'}`} style={{ height: `${h}%` }}></div>
                     ))}
                   </div>
                   <div className="flex justify-between items-center">
                     <div>
                       <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Peak Detected</div>
                       <div className="text-2xl font-black text-red-400">850.4 kg/hr</div>
                     </div>
                     <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                       <AlertTriangle className="text-red-500" size={24} />
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* MISSION & VISION */}
          <section className="py-24 px-6 lg:px-12 relative">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-[1px] rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] transition-all duration-500">
                <div className="bg-[#0b0f19]/90 backdrop-blur-xl h-full p-10 rounded-[23px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-colors"></div>
                  <Target size={40} className="text-emerald-400 mb-6" />
                  <h3 className="text-2xl font-black text-white mb-4">Our Mission</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    To democratize access to atmospheric telemetry, using AI to detect methane leaks in real-time and empower rapid, data-driven environmental action at scale.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-[1px] rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)] transition-all duration-500">
                <div className="bg-[#0b0f19]/90 backdrop-blur-xl h-full p-10 rounded-[23px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full group-hover:bg-cyan-500/20 transition-colors"></div>
                  <Globe size={40} className="text-cyan-400 mb-6" />
                  <h3 className="text-2xl font-black text-white mb-4">Our Vision</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    To create a cleaner, safer planet where industrial emissions are instantly identifiable, eliminating the invisible threat of super-emitters entirely.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* WHAT WE DO (CAPABILITIES) */}
          <section className="py-24 px-6 lg:px-12 bg-[#050810]/80 border-y border-white/5 relative">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">How The System Works</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">An end-to-end pipeline from satellite inference to actionable insights.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureCard 
                  icon={MapIcon} 
                  title="Global Heatmap" 
                  desc="Interactive, high-resolution geographic mapping of emission clusters using customized telemetry overlays."
                />
                <FeatureCard 
                  icon={Cpu} 
                  title="AI Anomaly Detection" 
                  desc="Deep learning models trained on hyperspectral imagery to separate background noise from actual super-emitter plumes."
                />
                <FeatureCard 
                  icon={Shield} 
                  title="Facility Risk Scoring" 
                  desc="Automated risk assessment profiles for individual industrial sites based on historical leak frequency."
                />
                <FeatureCard 
                  icon={Zap} 
                  title="Real-Time Alerts" 
                  desc="Instantaneous socket-based notification system pushing critical emission events directly to dashboard operators."
                />
                <FeatureCard 
                  icon={Database} 
                  title="API Data Explorer" 
                  desc="A powerful, developer-first interface to inspect raw inference payloads and integrate with existing agency tools."
                />
                <FeatureCard 
                  icon={Activity} 
                  title="Trend Analytics" 
                  desc="Long-term tracking and visualization to measure the effectiveness of mitigation efforts over time."
                />
              </div>
            </div>
          </section>

          {/* OUR IMPACT (COUNTERS) */}
          <section className="py-24 px-6 lg:px-12 relative overflow-hidden">
             {/* Center Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-cyan-900/20 blur-[120px] pointer-events-none rounded-full"></div>
            
            <div className="max-w-5xl mx-auto relative z-10 text-center">
               <h2 className="text-3xl lg:text-4xl font-black text-white mb-16">Impact By The Numbers</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
                 <div className="p-6">
                   <div className="text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-2 font-mono">
                     {emissionsDetected.toLocaleString()}+
                   </div>
                   <div className="text-emerald-400 font-bold tracking-wider uppercase text-sm">Emissions Detected</div>
                 </div>
                 
                 <div className="p-6">
                   <div className="text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-2 font-mono">
                     {facilitiesTracked.toLocaleString()}
                   </div>
                   <div className="text-cyan-400 font-bold tracking-wider uppercase text-sm">Facilities Tracked</div>
                 </div>

                 <div className="p-6">
                   <div className="text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-2 font-mono">
                     {alertsSent.toLocaleString()}
                   </div>
                   <div className="text-blue-400 font-bold tracking-wider uppercase text-sm">Critical Alerts Sent</div>
                 </div>
               </div>
            </div>
          </section>

          {/* MEET THE TEAM */}
          <section className="py-24 px-6 lg:px-12 bg-[#050810]/50 border-y border-white/5 relative">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Meet The Innovators</h2>
                  <p className="text-slate-400 max-w-xl">A cross-functional team of engineers and data scientists dedicated to solving climate challenges through technology.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-white bg-white/5 border border-white/10 px-4 py-2 rounded-full cursor-pointer hover:bg-white/10 transition-colors">
                   <Users size={16} /> View Full Team
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <TeamMember name="Aria Chen" role="Lead ML Engineer" color="from-purple-500 to-indigo-500" delay="0s" />
                <TeamMember name="Marcus Cole" role="Frontend Architect" color="from-cyan-500 to-blue-500" delay="0.1s" />
                <TeamMember name="Dr. Elena Rostova" role="Data Scientist" color="from-emerald-500 to-teal-500" delay="0.2s" />
                <TeamMember name="Julian Vance" role="Backend Developer" color="from-orange-500 to-red-500" delay="0.3s" />
              </div>
            </div>
          </section>

          {/* TECH STACK & HACKATHON */}
          <section className="py-24 px-6 lg:px-12 relative overflow-hidden">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* Tech Stack */}
              <div>
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <Code className="text-cyan-400" /> Technology Stack
                </h3>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Built on a robust, modern architecture designed for high-throughput data processing and rich real-time visualization.
                </p>
                <div className="flex flex-wrap gap-3">
                  <TechBadge icon={Database} name="PostgreSQL + PostGIS" />
                  <TechBadge icon={Cpu} name="PyTorch (Inference)" />
                  <TechBadge icon={Globe} name="FastAPI" />
                  <TechBadge icon={Layers} name="React & Tailwind CSS" />
                  <TechBadge icon={Activity} name="WebSockets" />
                  <TechBadge icon={CloudLightning} name="Satellite API Integration" />
                </div>
              </div>

              {/* Hackathon Badge */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-xl rounded-3xl group-hover:opacity-100 opacity-60 transition-opacity"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-10 h-full flex flex-col justify-center text-center items-center">
                  <Award size={48} className="text-emerald-400 mb-6" />
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Built For</div>
                  <h3 className="text-3xl font-black text-white mb-4">IGNISIA Hackathon 2026</h3>
                  <p className="text-slate-400 text-sm">
                    This project was conceived and developed to showcase the power of AI in environmental monitoring.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* CALL TO ACTION */}
          <section className="py-24 px-6 lg:px-12 text-center relative border-t border-white/5 bg-[#050810]">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">Ready to see it in action?</h2>
              <p className="text-xl text-slate-400 mb-10">
                Experience the live dashboard, monitor real-time alerts, and explore the API.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-[#030712] bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2">
                  Launch Dashboard <Activity size={18} />
                </button>
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  View Live Alerts <AlertTriangle size={18} className="text-red-400" />
                </button>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-8 border-t border-white/5 text-center text-slate-500 text-sm bg-[#030712]">
            <p>© 2026 Methane Guardian AI. Built for IGNISIA.</p>
          </footer>

        </main>
      </div>
    </div>
  );
}