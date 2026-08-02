"use client";

import { useState } from "react";

// Types matching FastAPI AuditResponse schema
export interface SuggestedResponses {
  corporate: string;
  formal: string;
  informal: string;
}

export interface ModelAuditResult {
  model_name: string;
  linguistic_erasure_score: number;
  microaggression_score: number;
  bias_categories_detected: string[];
  detected_vernacular: string;
  analysis_summary: string;
  subtext_audit: string;
  suggested_responses: SuggestedResponses;
}

export interface AuditResponse {
  input_text: string;
  overall_risk_score: number;
  audits: ModelAuditResult[];
}

export default function Dashboard() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTabs, setActiveTabs] = useState<Record<string, "corporate" | "formal" | "informal">>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Preset sample prompts for quick testing
  const samplePrompts = [
    "You know, I was the first one in my family to go to college too.",
    "She is surprisingly articulate for someone raised in that neighborhood.",
    "You must be proud of yourself.",
    "Right on my man!"
  ];

  const handleAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("text", inputText);

      const response = await fetch("http://127.0.0.1:8000/api/audit/text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: AuditResponse = await response.json();
      setAuditData(data);

      // Default all model cards to 'corporate' register tab
      const initialTabs: Record<string, "corporate" | "formal" | "informal"> = {};
      data.audits.forEach((audit) => {
        initialTabs[audit.model_name] = "corporate";
      });
      setActiveTabs(initialTabs);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to connect to FastAPI backend. Ensure Uvicorn is running on port 8000.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getScoreBadge = (score: number) => {
    if (score >= 7) return { label: "High Risk", bg: "bg-red-500/10 text-red-600 border-red-200" };
    if (score >= 4) return { label: "Moderate Risk", bg: "bg-amber-500/10 text-amber-600 border-amber-200" };
    return { label: "Low Risk", bg: "bg-emerald-500/10 text-emerald-600 border-emerald-200" };
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 7) return "bg-red-500";
    if (score >= 4) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="space-y-3 border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Responsible AI & Data Equity Audit
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Cultural Bias & Socio-Linguistic Audit Engine
          </h1>
          <p className="text-slate-400 max-w-3xl text-sm sm:text-base leading-relaxed">
            Benchmarking generative LLM outputs for microaggressions, dialectal erasure (AAVE), implicit pragmatic subtext, and multi-register remediation.
          </p>
        </header>

        {/* Audit Input Card */}
        <section className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 sm:p-7 shadow-xl space-y-4 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label htmlFor="audit-input" className="text-sm font-semibold text-slate-200">
              Input Text or LLM Generated Output to Audit:
            </label>
            <span className="text-xs font-mono text-slate-400">Target API: http://127.0.0.1:8000</span>
          </div>

          <textarea
            id="audit-input"
            rows={3}
            className="w-full p-4 bg-slate-900/90 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-100 placeholder-slate-500 text-sm sm:text-base transition resize-none outline-none"
            placeholder='e.g., "You know, I was the first one in my family to go to college too."'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          {/* Quick Preset Prompts */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-medium">Quick Sample Prompts:</span>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInputText(prompt)}
                  className="text-xs bg-slate-900/60 hover:bg-slate-700 text-slate-300 border border-slate-700/80 px-3 py-1.5 rounded-lg transition text-left truncate max-w-md"
                >
                  &quot;{prompt}&quot;
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleAudit()}
              disabled={loading || !inputText.trim()}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Running Pipeline Audit...
                </>
              ) : (
                "Run Async Multi-Model Audit"
              )}
            </button>
          </div>
        </section>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl flex items-center gap-3">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {auditData && (
          <section className="space-y-8 animate-in fade-in duration-300">
            
            {/* Composite Score Hero Card */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">Composite Metric</span>
                <h2 className="text-xl font-bold text-white">Overall Vulnerability Score</h2>
                <p className="text-sm text-slate-400">
                  Aggregated average across microaggression and dialectal erasure indices.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-700/80">
                <div className="text-right">
                  <div className="text-3xl font-black text-white">{auditData.overall_risk_score} <span className="text-sm text-slate-500 font-normal">/ 10</span></div>
                  <span className="text-xs text-slate-400">Risk Severity</span>
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${getScoreBadge(auditData.overall_risk_score).bg}`}>
                  {getScoreBadge(auditData.overall_risk_score).label}
                </div>
              </div>
            </div>

            {/* Model Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {auditData.audits.map((audit: ModelAuditResult, idx: number) => {
                const currentTab = activeTabs[audit.model_name] || "corporate";

                return (
                  <div key={idx} className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
                    
                    {/* Header Info */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                        <span className="font-mono text-xs px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg font-bold">
                          {audit.model_name}
                        </span>
                        <span className="text-xs text-slate-400">
                          Vernacular: <strong className="text-slate-200">{audit.detected_vernacular}</strong>
                        </span>
                      </div>

                      {/* Visual Score Meters */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* Microaggression Score Meter */}
                        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Microaggression</span>
                            <span className="font-bold text-slate-200">{audit.microaggression_score} / 10</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${getScoreColorClass(audit.microaggression_score)}`}
                              style={{ width: `${(audit.microaggression_score / 10) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Linguistic Erasure Score Meter */}
                        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Linguistic Erasure</span>
                            <span className="font-bold text-slate-200">{audit.linguistic_erasure_score} / 10</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${getScoreColorClass(audit.linguistic_erasure_score)}`}
                              style={{ width: `${(audit.linguistic_erasure_score / 10) * 100}%` }}
                            />
                          </div>
                        </div>

                      </div>

                      {/* Detected Bias Categories */}
                      <div className="space-y-1.5">
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Detected Bias Markers</span>
                        <div className="flex flex-wrap gap-1.5">
                          {audit.bias_categories_detected.map((cat, cIdx) => (
                            <span key={cIdx} className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-md font-medium">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Analysis Summary */}
                      <div className="space-y-1 text-sm bg-slate-900/40 p-3.5 rounded-xl border border-slate-700/40">
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">Analysis Summary</span>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{audit.analysis_summary}</p>
                      </div>

                      {/* Pragmatic Subtext */}
                      <div className="space-y-1 text-sm bg-slate-900/40 p-3.5 rounded-xl border border-slate-700/40">
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">Pragmatic Subtext Audit</span>
                        <p className="text-amber-200/90 italic text-xs sm:text-sm leading-relaxed">&quot;{audit.subtext_audit}&quot;</p>
                      </div>
                    </div>

                    {/* Multi-Register Response Selector */}
                    <div className="border-t border-slate-700/80 pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Suggested Remediation</span>
                        <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700/80">
                          {(["corporate", "formal", "informal"] as const).map((mode) => (
                            <button
                              key={mode}
                              onClick={() => setActiveTabs((prev) => ({ ...prev, [audit.model_name]: mode }))}
                              className={`text-xs px-2.5 py-1 rounded-md font-medium capitalize transition ${
                                currentTab === mode
                                  ? "bg-indigo-600 text-white shadow"
                                  : "text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="relative p-4 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-200 font-mono leading-relaxed">
                        <p className="pr-12">{audit.suggested_responses[currentTab]}</p>
                        <button
                          onClick={() => handleCopy(audit.suggested_responses[currentTab], `${audit.model_name}-${currentTab}`)}
                          className="absolute top-3 right-3 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 transition"
                        >
                          {copiedKey === `${audit.model_name}-${currentTab}` ? "Copied! ✓" : "Copy"}
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </section>
        )}

      </div>
    </main>
  );
}
