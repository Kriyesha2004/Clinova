import React, { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  Phone,
  FileWarning,
  Info,
  ArrowRight,
  MapPin,
  Mail,
  Menu,
  X,
  ChevronDown,
  Activity,
  Bell,
  Users,
} from "lucide-react";
import Login from './Login';

const LOGO_PLACEHOLDER = null;

/* =========================
   SCROLL REVEAL HOOK
========================= */

function useScrollReveal(): [
  React.RefObject<HTMLDivElement | null>,
  boolean
] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.12 }
    );

    if (ref.current) {
      obs.observe(ref.current);
    }

    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

/* =========================
   REVEAL SECTION
========================= */

type RevealSectionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

function RevealSection({
  children,
  className = "",
  delay = 0,
}: RevealSectionProps) {
  const [ref, visible] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0)"
          : "translateY(32px)",
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* =========================
   STAT COUNTER
========================= */

type StatCounterProps = {
  end: number;
  suffix?: string;
  label: string;
};

function StatCounter({
  end,
  suffix = "",
  label,
}: StatCounterProps) {
  const [count, setCount] = useState<number>(0);
  const [ref, visible] = useScrollReveal();

  useEffect(() => {
    if (!visible) return;

    let start = 0;
    const duration = 1800;
    const step = Math.ceil(end / (duration / 16));

    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setCount(start);

      if (start >= end) {
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [visible, end]);

  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 700,
          fontFamily: "'Syne', sans-serif",
          color: "#00e5c3",
          lineHeight: 1,
        }}
      >
        {count.toLocaleString()}
        {suffix}
      </div>

      <div
        style={{
          fontSize: "0.875rem",
          color: "#94a3b8",
          marginTop: "0.5rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* =========================
   MAIN APP
========================= */

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'login'>('home');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const handler = () =>
      setScrolled(window.scrollY > 40);

    window.addEventListener("scroll", handler);

    return () =>
      window.removeEventListener("scroll", handler);
  }, []);

  /* =========================
     FORM SUBMIT
  ========================= */

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);

    setFormState({
      name: "",
      email: "",
      message: "",
    });
  };

  const navLinks: string[] = [
    "About",
    "Monitor",
    "Report",
    "Contact",
  ];

  /* =========================
     CONDITIONAL ROUTING VIEW
  ========================= */
  if (currentView === 'login') {
    return <Login onBackToHome={() => setCurrentView('home')} />;
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#040d1a", color: "#e2e8f0", overflowX: "hidden", position: "relative" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #040d1a; }
        ::-webkit-scrollbar-thumb { background: #00e5c3; border-radius: 10px; }

        .nav-link {
          color: #94a3b8; font-size: 0.9rem; font-weight: 500; cursor: pointer;
          text-decoration: none; letter-spacing: 0.02em;
          transition: color 0.2s; position: relative; padding-bottom: 2px;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 0; height: 1.5px; background: #00e5c3;
          transition: width 0.3s ease;
        }
        .nav-link:hover { color: #fff; }
        .nav-link:hover::after { width: 100%; }

        .btn-primary {
          background: linear-gradient(135deg, #00e5c3, #0096ff);
          color: #040d1a; font-weight: 700; font-size: 0.95rem;
          padding: 0.75rem 1.75rem; border-radius: 100px;
          border: none; cursor: pointer; letter-spacing: 0.01em;
          transition: transform 0.2s, box-shadow 0.2s;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 30px rgba(0,229,195,0.35); }

        .btn-outline {
          background: transparent;
          color: #e2e8f0; font-weight: 500; font-size: 0.95rem;
          padding: 0.75rem 1.75rem; border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.18); cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-outline:hover { border-color: #00e5c3; background: rgba(0,229,195,0.06); transform: translateY(-2px); }

        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 2.25rem 2rem;
          transition: border-color 0.3s, transform 0.3s, background 0.3s;
          cursor: default;
        }
        .feature-card:hover {
          border-color: rgba(0,229,195,0.3);
          background: rgba(0,229,195,0.04);
          transform: translateY(-6px);
        }

        .glass-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
        }

        .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
        .grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 1.5rem; }
        .grid-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 2rem; }

        .input-field {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
          padding: 0.9rem 1.2rem; color: #e2e8f0; font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, background 0.2s; outline: none;
        }
        .input-field:focus { border-color: #00e5c3; background: rgba(0,229,195,0.04); }
        .input-field::placeholder { color: #4a5568; }

        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(0,229,195,0.1); border: 1px solid rgba(0,229,195,0.25);
          color: #00e5c3; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; padding: 0.35rem 0.9rem; border-radius: 100px;
        }

        .glow-line {
          height: 1px; background: linear-gradient(90deg, transparent, rgba(0,229,195,0.4), transparent);
        }

        .mobile-menu {
          position: fixed; top: 0; right: 0; bottom: 0; width: 280px;
          background: #060f20; border-left: 1px solid rgba(255,255,255,0.07);
          z-index: 200; padding: 2rem 1.5rem;
          transform: translateX(100%); transition: transform 0.35s ease;
          display: flex; flex-direction: column; gap: 1.5rem;
        }
        .mobile-menu.open { transform: translateX(0); }
        .menu-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          z-index: 199; opacity: 0; pointer-events: none; transition: opacity 0.3s;
        }
        .menu-overlay.open { opacity: 1; pointer-events: all; }

        @keyframes floatUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(0,229,195,0.4); } 70% { box-shadow: 0 0 0 16px rgba(0,229,195,0); } 100% { box-shadow: 0 0 0 0 rgba(0,229,195,0); } }
        @keyframes orb { 0%,100% { transform: scale(1) translate(0,0); } 33% { transform: scale(1.08) translate(20px,-30px); } 66% { transform: scale(0.95) translate(-15px,20px); } }
        @keyframes scanline { 0% { transform: translateY(-100%); opacity: 0.06; } 100% { transform: translateY(100vh); opacity: 0; } }

        .hero-orb { animation: orb 12s ease-in-out infinite; }
        .pulse-ring { animation: pulse-ring 2.5s ease-out infinite; }

        @media (max-width: 900px) {
          .grid-3, .grid-stats { grid-template-columns: 1fr 1fr !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .grid-3, .grid-2, .grid-stats { grid-template-columns: 1fr !important; }
          .nav-links-desktop { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 601px) { .hamburger { display: none !important; } }
      `}</style>

      {/* BG AMBIENT ORBS */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div className="hero-orb" style={{ position: "absolute", top: "-15%", left: "-10%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(0,229,195,0.06) 0%, transparent 65%)", borderRadius: "50%" }} />
        <div className="hero-orb" style={{ position: "absolute", bottom: "10%", right: "-15%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(0,150,255,0.07) 0%, transparent 65%)", borderRadius: "50%", animationDelay: "4s" }} />
        <div style={{ position: "absolute", top: "40%", left: "45%", width: "30vw", height: "30vw", background: "radial-gradient(circle, rgba(80,0,200,0.04) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100,
        background: scrolled ? "rgba(4,13,26,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        transition: "all 0.4s ease",
        padding: "0 clamp(1rem, 4vw, 3rem)",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
          <div className="pulse-ring" style={{
            width: 40, height: 40, borderRadius: "12px",
            background: "linear-gradient(135deg, #00e5c3, #0096ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Activity size={20} color="#040d1a" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.02em" }}>
            Clinova <span style={{ color: "#00e5c3" }}>SL</span>
          </span>
        </div>

        {/* Desktop nav */}
        <div className="nav-links-desktop" style={{ display: "flex", gap: "2.5rem" }}>
          {navLinks.map(l => <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>)}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            className="btn-primary"
            style={{ padding: "0.6rem 1.4rem", fontSize: "0.88rem" }}
            onClick={() => setCurrentView('login')}
          >
            Login <ArrowRight size={14} />
          </button>
          <button className="hamburger" onClick={() => setMenuOpen(true)}
            style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "8px", cursor: "pointer", color: "#e2e8f0" }}>
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`menu-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem" }}>Menu</span>
          <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
            <X size={22} />
          </button>
        </div>
        <div className="glow-line" />
        {navLinks.map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} className="nav-link" onClick={() => setMenuOpen(false)}
            style={{ fontSize: "1.1rem", padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{l}</a>
        ))}
        <button className="btn-primary" style={{ marginTop: "auto", justifyContent: "center" }} onClick={() => { setMenuOpen(false); setCurrentView('login'); }}>
          Login <ArrowRight size={14} />
        </button>
      </div>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", zIndex: 1, padding: "100px clamp(1rem, 4vw, 3rem) 60px" }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", width: "100%", maxWidth: 1200, margin: "0 auto" }}>

          {/* Left */}
          <div style={{ animation: "floatUp 0.9s ease forwards" }}>
            <div className="badge" style={{ marginBottom: "1.75rem" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00e5c3", display: "inline-block" }} />
              AI-Powered Health Platform
            </div>

            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
              Predict Dengue.<br />
              <span style={{ color: "#00e5c3" }}>Protect Lives.</span><br />
              Save Sri Lanka.
            </h1>

            <p style={{ fontSize: "1.05rem", color: "#94a3b8", lineHeight: 1.75, maxWidth: 480, marginBottom: "2.5rem" }}>
              An intelligent surveillance and early-warning platform powered by AI and real-time environmental data — helping communities and health authorities act before outbreaks happen.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button className="btn-primary">
                Explore Portal <ArrowRight size={16} />
              </button>
              <button className="btn-outline">
                Watch Demo
              </button>
            </div>

            <div style={{ display: "flex", gap: "2.5rem", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {[["98%", "Prediction Accuracy"], ["47", "Districts Monitored"], ["24/7", "Live Surveillance"]].map(([val, lbl]) => (
                <div key={lbl}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "#00e5c3" }}>{val}</div>
                  <div style={{ fontSize: "0.78rem", color: "#64748b", letterSpacing: "0.04em", marginTop: "2px" }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — visual panel */}
          <div style={{ animation: "floatUp 0.9s 0.2s ease both" }}>
            <div className="glass-card" style={{ padding: "2rem", position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <div style={{ fontSize: "0.78rem", color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>Risk Index — Colombo District</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "2rem", color: "#f59e0b", marginTop: "4px" }}>HIGH</div>
                </div>
                <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "12px", padding: "0.5rem 1rem" }}>
                  <Bell size={20} color="#f59e0b" />
                </div>
              </div>

              {/* Bar chart simulation */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: 120, marginBottom: "0.75rem" }}>
                {[45, 62, 55, 80, 75, 95, 88, 72, 60, 85, 92, 100].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                    <div style={{
                      height: `${h}%`,
                      borderRadius: "4px 4px 0 0",
                      background: i === 11 ? "linear-gradient(0deg, #00e5c3, #0096ff)" : i > 8 ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.06)",
                      transition: "height 0.8s ease",
                    }} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#4a5568" }}>
                <span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Now</span>
              </div>

              <div className="glow-line" style={{ margin: "1.5rem 0" }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  { icon: <MapPin size={16} />, label: "Active Zones", val: "12 Areas", color: "#f87171" },
                  { icon: <Users size={16} />, label: "Cases Today", val: "+34 New", color: "#f59e0b" },
                  { icon: <Activity size={16} />, label: "AI Confidence", val: "97.2%", color: "#00e5c3" },
                  { icon: <ShieldCheck size={16} />, label: "Alerts Sent", val: "1,204", color: "#818cf8" },
                ].map(({ icon, label, val, color }) => (
                  <div key={label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "0.9rem 1rem", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ color, display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", fontSize: "0.8rem" }}>
                      {icon} <span>{label}</span>
                    </div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", opacity: 0.4 }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Scroll</span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* STATS BAND */}
      <section style={{ position: "relative", zIndex: 1, padding: "4rem clamp(1rem, 4vw, 3rem)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="grid-stats" style={{ maxWidth: 1000, margin: "0 auto" }}>
          <StatCounter end={1200} suffix="+" label="Reports Filed" />
          <StatCounter end={47} label="Districts Covered" />
          <StatCounter end={98} suffix="%" label="AI Accuracy" />
          <StatCounter end={250000} suffix="+" label="People Protected" />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "7rem clamp(1rem, 4vw, 3rem)", position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
        <RevealSection>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div className="badge" style={{ marginBottom: "1.25rem" }}>What We Do</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", marginBottom: "1.25rem" }}>
              Intelligence at Every Layer
            </h2>
            <p style={{ color: "#64748b", maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
              Clinova combines machine learning, satellite weather data, and community reports to give Sri Lanka's health officials a real-time edge against dengue outbreaks.
            </p>
          </div>
        </RevealSection>

        <div className="grid-3">
          {[
            {
              icon: <ShieldCheck size={24} />,
              color: "#00e5c3",
              bg: "rgba(0,229,195,0.08)",
              title: "Risk Prediction",
              desc: "Our ML models analyze rainfall, temperature, population density, and historical case data to forecast high-risk zones up to 2 weeks in advance.",
              tag: "AI / ML"
            },
            {
              icon: <FileWarning size={24} />,
              color: "#f59e0b",
              bg: "rgba(245,158,11,0.08)",
              title: "Smart Monitoring",
              desc: "Real-time dashboards aggregate data from hospitals, community reports, and IoT sensors to give authorities a complete situational picture instantly.",
              tag: "Real-Time"
            },
            {
              icon: <Info size={24} />,
              color: "#818cf8",
              bg: "rgba(129,140,248,0.08)",
              title: "Public Awareness",
              desc: "Targeted alerts, prevention guides, and interactive maps delivered to citizens via mobile — in Sinhala, Tamil, and English.",
              tag: "Community"
            },
          ].map(({ icon, color, bg, title, desc, tag }, i) => (
            <RevealSection key={title} delay={i * 100}>
              <div className="feature-card">
                <div style={{ width: 52, height: 52, borderRadius: "14px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", color }}>
                  {icon}
                </div>
                <div style={{ fontSize: "0.72rem", color, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.75rem" }}>{tag}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.9rem" }}>{title}</h3>
                <p style={{ color: "#64748b", lineHeight: 1.75, fontSize: "0.93rem" }}>{desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* REPORT CTA */}
      <section id="report" style={{ padding: "0 clamp(1rem, 4vw, 3rem) 7rem", position: "relative", zIndex: 1 }}>
        <RevealSection>
          <div style={{
            maxWidth: 1200, margin: "0 auto",
            background: "linear-gradient(135deg, rgba(0,229,195,0.08) 0%, rgba(0,150,255,0.08) 100%)",
            border: "1px solid rgba(0,229,195,0.15)",
            borderRadius: "28px", padding: "clamp(2.5rem, 5vw, 4.5rem) clamp(1.5rem, 4vw, 4rem)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: "-30%", right: "-5%", width: "40%", height: "200%", background: "radial-gradient(ellipse, rgba(0,229,195,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

            <div style={{ flex: 1, minWidth: 260 }}>
              <div className="badge" style={{ marginBottom: "1.25rem" }}>📋 Community Action</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", letterSpacing: "-0.02em", marginBottom: "1rem" }}>
                Spotted a Breeding Site?
              </h2>
              <p style={{ color: "#64748b", lineHeight: 1.75, maxWidth: 500 }}>
                Your report matters. Every submission is geo-tagged, analyzed by our AI, and forwarded to local health teams within minutes — turning citizens into first responders.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
              <button className="btn-primary" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
                Submit a Report <ArrowRight size={18} />
              </button>
              <span style={{ fontSize: "0.8rem", color: "#4a5568", paddingLeft: "0.25rem" }}>Takes less than 2 minutes • Anonymous option available</span>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "0 clamp(1rem, 4vw, 3rem) 8rem", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <RevealSection>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <div className="badge" style={{ marginBottom: "1.25rem" }}>Get In Touch</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}>
                We're Here to Help
              </h2>
            </div>
          </RevealSection>

          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "2rem" }}>
            {/* Info */}
            <RevealSection>
              <div className="glass-card" style={{ padding: "2.5rem", height: "100%" }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.3rem", marginBottom: "2rem" }}>Contact Details</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {[
                    { icon: <Phone size={18} />, label: "Phone", val: "+94 77 123 4567", color: "#00e5c3" },
                    { icon: <Mail size={18} />, label: "Email", val: "support@clinova.lk", color: "#818cf8" },
                    { icon: <MapPin size={18} />, label: "Location", val: "Colombo, Sri Lanka", color: "#f87171" },
                  ].map(({ icon, label, val, color }) => (
                    <div key={label} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "10px", background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color }}>
                        {icon}
                      </div>
                      <div>
                        <div style={{ fontSize: "0.75rem", color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>{label}</div>
                        <div style={{ fontWeight: 500 }}>{val}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glow-line" style={{ margin: "2rem 0" }} />
                <div style={{ fontSize: "0.85rem", color: "#4a5568", lineHeight: 1.7 }}>
                  Response times: <span style={{ color: "#00e5c3" }}>Under 4 hours</span> on business days. Emergency health alerts are handled 24/7.
                </div>
              </div>
            </RevealSection>

            {/* Form */}
            <RevealSection delay={100}>
              <div className="glass-card" style={{ padding: "2.5rem" }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.3rem", marginBottom: "2rem" }}>Send a Message</h3>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <input className="input-field" placeholder="Your name" value={formState.name} onChange={e => setFormState(s => ({ ...s, name: e.target.value }))} required />
                    <input className="input-field" type="email" placeholder="Email address" value={formState.email} onChange={e => setFormState(s => ({ ...s, email: e.target.value }))} required />
                  </div>
                  <textarea className="input-field" rows={5} placeholder="How can we help you?" value={formState.message} onChange={e => setFormState(s => ({ ...s, message: e.target.value }))} required style={{ resize: "vertical" }} />
                  <button type="submit" className="btn-primary" style={{ justifyContent: "center", padding: "0.9rem" }}>
                    {submitted ? "✓ Message Sent!" : <>Send Message <ArrowRight size={16} /></>}
                  </button>
                </form>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "3rem clamp(1rem, 4vw, 3rem)",
        position: "relative", zIndex: 1,
        background: "rgba(0,0,0,0.2)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem", marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: 38, height: 38, borderRadius: "10px", background: "linear-gradient(135deg, #00e5c3, #0096ff)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Activity size={18} color="#040d1a" strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem" }}>
                Clinova <span style={{ color: "#00e5c3" }}>SL</span>
              </span>
            </div>
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              {navLinks.map(l => <a key={l} href={`#${l.toLowerCase()}`} className="nav-link" style={{ fontSize: "0.85rem" }}>{l}</a>)}
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {["f", "𝕏", "in"].map(s => (
                <a key={s} href="#" style={{
                  width: 38, height: 38, borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#64748b", fontSize: "0.9rem", textDecoration: "none",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#00e5c3"; e.currentTarget.style.color = "#00e5c3"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#64748b"; }}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="glow-line" style={{ marginBottom: "1.5rem" }} />

          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", fontSize: "0.8rem", color: "#334155" }}>
            <span>© 2026 Clinova Sri Lanka. All rights reserved.</span>
            <span style={{ color: "#1e40af" }}>Built with care for public health in Sri Lanka 🇱🇰</span>
          </div>
        </div>
      </footer>
    </div>
  );
}