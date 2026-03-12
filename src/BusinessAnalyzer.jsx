import { useState } from "react";

const INDUSTRIES = ["Tech", "Retail", "Healthcare", "Finance", "Education", "Real Estate", "Manufacturing", "Other"];

const SAMPLE_DATA = {
  companyName: "TechVision Egypt",
  industry: "Tech",
  revenue: "$500,000",
  employees: "25",
  challenges: "Difficulty finding skilled AI developers, limited marketing budget, strong competition from larger companies",
  goals: "Expand to Gulf market, launch 2 new AI products, increase revenue by 40% this year",
  competitors: "Microsoft, local software companies, freelance developers"
};

// ضعي مفتاح Gemini هنا بس
const AIzaSyANYJIq33u7jx3z5IGBP87f1Ao9G24Z5h4 = process.env.REACT_APP_GEMINI;

function CharCount({ value, max }) {
  const pct = value.length / max;
  const color = pct > 0.9 ? "#ef4444" : pct > 0.7 ? "#f59e0b" : "#64748b";
  return (
    <div style={{ textAlign: "right", fontSize: "11px", color, marginTop: 4 }}>
      {value.length} / {max}
    </div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder, required }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13, color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label} {required && <span style={{ color: "#f59e0b" }}>*</span>}
      </label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f1f5f9",
          fontSize: 14, outline: "none", transition: "all 0.2s", fontFamily: "inherit"
        }}
        onFocus={e => { e.target.style.border = "1px solid #f59e0b"; e.target.style.background = "rgba(245,158,11,0.05)"; }}
        onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
      />
    </div>
  );
}

function Select({ label, value, onChange, options, required }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13, color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label} {required && <span style={{ color: "#f59e0b" }}>*</span>}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "12px 16px", background: "#1e293b",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: value ? "#f1f5f9" : "#64748b",
          fontSize: 14, outline: "none", cursor: "pointer", fontFamily: "inherit"
        }}>
        <option value="">Select industry...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Textarea({ label, value, onChange, max = 500, required }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13, color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label} {required && <span style={{ color: "#f59e0b" }}>*</span>}
      </label>
      <textarea
        value={value} onChange={e => onChange(e.target.value)} maxLength={max} rows={3}
        style={{
          width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f1f5f9",
          fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6
        }}
        onFocus={e => { e.target.style.border = "1px solid #f59e0b"; e.target.style.background = "rgba(245,158,11,0.05)"; }}
        onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
      />
      <CharCount value={value} max={max} />
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%", margin: "0 auto 24px",
        border: "3px solid rgba(245,158,11,0.2)", borderTop: "3px solid #f59e0b",
        animation: "spin 0.8s linear infinite"
      }} />
      <p style={{ color: "#94a3b8", fontSize: 15 }}>🤖 AI is analyzing your business...</p>
      <p style={{ color: "#475569", fontSize: 13, marginTop: 8 }}>This usually takes 10–20 seconds</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState({ companyName: "", industry: "", revenue: "", employees: "", challenges: "", goals: "", competitors: "" });
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const set = key => val => setForm(f => ({ ...f, [key]: val }));
  const loadSample = () => setForm(SAMPLE_DATA);

  const analyze = async () => {
    const missing = !form.companyName || !form.industry || !form.revenue || !form.employees || !form.challenges || !form.goals || !form.competitors;
    if (missing) { setError("Please fill in all fields before generating the analysis."); return; }
    setError(""); setLoading(true); setReport(null);

    try {
      const prompt = `You are an elite business strategy consultant. Analyze the following business and return a JSON object ONLY (no markdown, no explanation, just raw JSON) with these exact keys:

{
  "executiveSummary": "3-sentence paragraph as plain text",
  "swot": {
    "strengths": ["item1", "item2", "item3"],
    "weaknesses": ["item1", "item2", "item3"],
    "opportunities": ["item1", "item2", "item3"],
    "threats": ["item1", "item2", "item3"]
  },
  "recommendations": [
    {"title": "...", "detail": "..."},
    {"title": "...", "detail": "..."},
    {"title": "...", "detail": "..."},
    {"title": "...", "detail": "..."},
    {"title": "...", "detail": "..."}
  ],
  "risks": [
    {"level": "High", "risk": "...", "mitigation": "..."},
    {"level": "Medium", "risk": "...", "mitigation": "..."},
    {"level": "Low", "risk": "...", "mitigation": "..."}
  ],
  "actionPlan": [
    {"period": "Days 1-30", "focus": "...", "actions": ["...", "...", "..."]},
    {"period": "Days 31-60", "focus": "...", "actions": ["...", "...", "..."]},
    {"period": "Days 61-90", "focus": "...", "actions": ["...", "...", "..."]}
  ],
  "kpis": ["KPI 1: ...", "KPI 2: ...", "KPI 3: ...", "KPI 4: ...", "KPI 5: ..."]
}

Business Data:
- Company: ${form.companyName}
- Industry: ${form.industry}
- Annual Revenue: ${form.revenue}
- Employees: ${form.employees}
- Main Challenges: ${form.challenges}
- Goals: ${form.goals}
- Competitors: ${form.competitors}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await res.json();
      const text = data.candidates[0].content.parts[0].text;
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setReport(parsed);
    } catch (e) {
      setError("Something went wrong. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const riskColor = l => l === "High" ? "#ef4444" : l === "Medium" ? "#f59e0b" : "#22c55e";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0f1e 0%, #0f172a 50%, #0a0f1e 100%)", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: "40px 20px" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ display: "inline-block", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 100, padding: "6px 18px", fontSize: 12, color: "#f59e0b", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
          ✦ Powered by Gemini AI
        </div>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontFamily: "'DM Serif Display', serif", color: "#f1f5f9", lineHeight: 1.15, marginBottom: 14 }}>
          AI Business<br /><span style={{ color: "#f59e0b" }}>Analyzer</span>
        </h1>
        <p style={{ color: "#64748b", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
          Enter your business data and get a comprehensive strategic analysis report in seconds.
        </p>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: "36px 40px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <h2 style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 700 }}>Business Information</h2>
            <button onClick={loadSample} style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: "8px 16px", color: "#f59e0b", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
              ⚡ Load Sample
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0 24px" }}>
            <Input label="Company Name" value={form.companyName} onChange={set("companyName")} placeholder="e.g. TechVision Egypt" required />
            <Select label="Industry" value={form.industry} onChange={set("industry")} options={INDUSTRIES} required />
            <Input label="Annual Revenue" value={form.revenue} onChange={set("revenue")} placeholder="e.g. $500,000" required />
            <Input label="Number of Employees" type="number" value={form.employees} onChange={set("employees")} placeholder="e.g. 25" required />
          </div>
          <Textarea label="Main Challenges" value={form.challenges} onChange={set("challenges")} required />
          <Textarea label="Current Goals" value={form.goals} onChange={set("goals")} required />
          <Textarea label="Competitors" value={form.competitors} onChange={set("competitors")} required />

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 16px", color: "#fca5a5", fontSize: 14, marginBottom: 20 }}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={analyze} disabled={loading}
            style={{
              width: "100%", padding: "16px", background: loading ? "rgba(245,158,11,0.3)" : "linear-gradient(135deg, #f59e0b, #d97706)",
              border: "none", borderRadius: 12, color: loading ? "#94a3b8" : "#0a0f1e", fontSize: 16, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s"
            }}>
            {loading ? "⏳ Generating Analysis..." : "🚀 Generate AI Analysis"}
          </button>
        </div>

        {loading && <Spinner />}

        {report && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ display: "inline-block", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 100, padding: "6px 18px", fontSize: 13, color: "#22c55e", fontWeight: 600 }}>
                ✓ Analysis Complete — {form.companyName}
              </div>
            </div>

            {/* Executive Summary */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 28px", marginBottom: 20 }}>
              <h3 style={{ color: "#f59e0b", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📋 Executive Summary</h3>
              <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.8 }}>{report.executiveSummary}</p>
            </div>

            {/* SWOT */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 28px", marginBottom: 20 }}>
              <h3 style={{ color: "#f59e0b", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>⚡ SWOT Analysis</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                {[
                  { key: "strengths", label: "Strengths", color: "#22c55e", bg: "rgba(34,197,94,0.05)" },
                  { key: "weaknesses", label: "Weaknesses", color: "#ef4444", bg: "rgba(239,68,68,0.05)" },
                  { key: "opportunities", label: "Opportunities", color: "#3b82f6", bg: "rgba(59,130,246,0.05)" },
                  { key: "threats", label: "Threats", color: "#f59e0b", bg: "rgba(245,158,11,0.05)" },
                ].map(({ key, label, color, bg }) => (
                  <div key={key} style={{ background: bg, border: `1px solid ${color}30`, borderRadius: 12, padding: 16 }}>
                    <div style={{ color, fontWeight: 700, fontSize: 13, marginBottom: 12, textTransform: "uppercase" }}>{label}</div>
                    {(report.swot[key] || []).map((item, i) => (
                      <div key={i} style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.6, marginBottom: 8, paddingLeft: 12, borderLeft: `2px solid ${color}40` }}>
                        {item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 28px", marginBottom: 20 }}>
              <h3 style={{ color: "#f59e0b", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🎯 Top 5 Recommendations</h3>
              {(report.recommendations || []).map((rec, i) => (
                <div key={i} style={{ display: "flex", gap: 16, marginBottom: 16, padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 12 }}>
                  <div style={{ width: 32, height: 32, minWidth: 32, background: "rgba(245,158,11,0.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", fontWeight: 800, fontSize: 14 }}>{i + 1}</div>
                  <div>
                    <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{rec.title}</div>
                    <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6 }}>{rec.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Risks */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 28px", marginBottom: 20 }}>
              <h3 style={{ color: "#f59e0b", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>⚠️ Risk Assessment</h3>
              {(report.risks || []).map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 14, padding: 14, background: "rgba(255,255,255,0.02)", borderRadius: 10 }}>
                  <span style={{ background: `${riskColor(r.level)}20`, color: riskColor(r.level), border: `1px solid ${riskColor(r.level)}40`, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{r.level}</span>
                  <div>
                    <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{r.risk}</div>
                    <div style={{ color: "#64748b", fontSize: 12, lineHeight: 1.6 }}>Mitigation: {r.mitigation}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 90-Day Plan */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 28px", marginBottom: 20 }}>
              <h3 style={{ color: "#f59e0b", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📅 90-Day Action Plan</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                {(report.actionPlan || []).map((phase, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 16 }}>
                    <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{phase.period}</div>
                    <div style={{ color: "#64748b", fontSize: 12, marginBottom: 12 }}>{phase.focus}</div>
                    {(phase.actions || []).map((a, j) => (
                      <div key={j} style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6, marginBottom: 6, paddingLeft: 10, borderLeft: "2px solid rgba(245,158,11,0.3)" }}>
                        {a}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* KPIs */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 28px", marginBottom: 32 }}>
              <h3 style={{ color: "#f59e0b", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📊 Success Metrics (KPIs)</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
                {(report.kpis || []).map((kpi, i) => (
                  <div key={i} style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 10, padding: "12px 16px", color: "#cbd5e1", fontSize: 13, lineHeight: 1.6 }}>
                    <span style={{ color: "#f59e0b", fontWeight: 700 }}>{i + 1}.</span> {kpi}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: "center", paddingBottom: 20 }}>
              <button onClick={() => { setReport(null); setForm({ companyName: "", industry: "", revenue: "", employees: "", challenges: "", goals: "", competitors: "" }); }}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 28px", color: "#94a3b8", fontSize: 14, cursor: "pointer", fontWeight: 600 }}>
                ← Analyze Another Business
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}