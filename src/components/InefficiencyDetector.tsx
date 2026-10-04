import React, { useState } from 'react';
import { InefficiencyLog } from '../types';
import { PackageX, AlertTriangle, Cpu, TrendingUp, CheckCircle, Flame, ShieldAlert, Sparkles } from 'lucide-react';

interface InefficiencyDetectorProps {
  logs: InefficiencyLog[];
}

export const InefficiencyDetector: React.FC<InefficiencyDetectorProps> = ({ logs: initialLogs }) => {
  const [logs, setLogs] = useState<InefficiencyLog[]>(initialLogs);
  const [filterType, setFilterType] = useState<string>('all');
  const [isAuditing, setIsAuditing] = useState(false);
  const [aiAuditResult, setAiAuditResult] = useState<any | null>(null);

  const filteredLogs = logs.filter((log) => {
    if (filterType === 'all') return true;
    return log.type === filterType;
  });

  const handleRunAiAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/ai/detect-inefficiencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facilityType: 'Institutional Catering Kitchen, Banquet & Regional Cold Hub',
          inputTelemetry: logs,
        }),
      });
      const data = await res.json();
      if (data.success && data.diagnosis) {
        setAiAuditResult(data.diagnosis);
      }
    } catch (err: any) {
      alert('Error running AI audit: ' + err.message);
    } finally {
      setIsAuditing(false);
    }
  };

  const toggleActionTaken = (id: string) => {
    setLogs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, actionTaken: !item.actionTaken } : item))
    );
  };

  const totalLoss = logs.reduce((acc, curr) => (curr.actionTaken ? acc : acc + curr.lossEstimateRs), 0);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-r from-[#0c1c10] via-[#1d0e1c] to-[#1c2e12] p-6 sm:p-8 shadow-xl shadow-pink-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-pink-400">
              <PackageX className="h-4 w-4 text-pink-400" />
              <span className="bg-pink-500/15 text-pink-300 px-2.5 py-0.5 rounded-md border border-pink-500/30">
                FACILITY TELEMETRY & ROOT-CAUSE ANOMALY DETECTION
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center p-1.5 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
                <PackageX className="h-6 w-6 stroke-[2.2]" />
              </span>
              <span>Zero Inventory</span>
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Continuously monitors commercial kitchens, banquet prep centers, and cold storage marts for overproduction, raw material pantry decay, compressor machine downtime, and excessive HVAC electrical surges with AI root-cause mitigation.
            </p>
          </div>

          <button
            onClick={handleRunAiAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black transition-all shadow-lg shadow-emerald-500/25 cursor-pointer self-start md:self-auto shrink-0 disabled:opacity-50 border border-emerald-300/70"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isAuditing ? 'Auditing Telemetry...' : 'Run Deep AI Facility Diagnostics'}</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="rounded-xl border border-pink-500/30 bg-[#121013] p-4 shadow-sm">
          <span className="text-pink-300/80 font-medium">Unresolved Loss Exposure</span>
          <div className="text-xl font-bold font-mono text-pink-400 mt-1">
            ₹{totalLoss.toLocaleString()}
          </div>
          <p className="text-[11px] text-pink-400/60 mt-1">Across 4 active facility vectors</p>
        </div>

        <div className="rounded-xl border border-emerald-800/40 bg-[#0d1d11] p-4 shadow-sm">
          <span className="text-emerald-200/70 font-medium">Overproduction Incidents</span>
          <div className="text-xl font-bold font-mono text-amber-300 mt-1">
            1 Critical (38% surplus)
          </div>
          <p className="text-[11px] text-emerald-400/60 mt-1">Banquet headcount formula drift</p>
        </div>

        <div className="rounded-xl border border-emerald-800/40 bg-[#0d1d11] p-4 shadow-sm">
          <span className="text-emerald-200/70 font-medium">Machine Compressor Cycling</span>
          <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
            14 cycles/hr (Alert)
          </div>
          <p className="text-[11px] text-emerald-400/60 mt-1">Walk-In Chiller #3 door gasket</p>
        </div>

        <div className="rounded-xl border border-emerald-800/40 bg-[#0d1d11] p-4 shadow-sm">
          <span className="text-emerald-200/70 font-medium">Excess Power Draw</span>
          <div className="text-xl font-bold font-mono text-yellow-300 mt-1">
            +34% over baseline
          </div>
          <p className="text-[11px] text-emerald-400/60 mt-1">Dust clogged condenser coils</p>
        </div>
      </div>

      {/* AI Diagnostic Report (if run) */}
      {aiAuditResult && (
        <div className="rounded-2xl border border-yellow-500/40 bg-[#071109] p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/60 pb-3">
            <div>
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                AI ROOT CAUSE AUDIT REPORT
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Primary Vector: {aiAuditResult.primaryLossVector}
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-emerald-200/70">Facility Health Index:</span>
              <span className="text-lg font-black text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded-lg border border-yellow-400/30">
                {aiAuditResult.overallHealthIndex}/100
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiAuditResult.insights?.map((insight: any, i: number) => (
              <div key={i} className="rounded-xl bg-[#0c1c10] p-4 border border-emerald-800/50 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{insight.category}</span>
                  <span className="text-yellow-400 font-mono font-bold text-[11px] bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">{insight.severity}</span>
                </div>
                <p className="text-emerald-100/90"><strong className="text-emerald-300">Observed:</strong> {insight.observedAnomaly}</p>
                <p className="text-amber-200/90"><strong className="text-amber-400">Root Cause:</strong> {insight.rootCause}</p>
                <p className="text-emerald-300 font-medium"><strong className="text-emerald-200/60">Mitigation:</strong> {insight.preventiveAction}</p>
                <div className="text-right font-mono text-yellow-300 font-semibold pt-2 border-t border-emerald-800/40 text-[11px]">
                  Potential Savings: +₹{insight.expectedSavingsRs?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-emerald-800/60 text-xs text-emerald-100">
            <span className="font-bold text-white">Chief Engineer Directives:</span>
            <ul className="list-disc list-inside mt-1.5 space-y-1 text-emerald-200/80">
              {aiAuditResult.operationalDirectives?.map((dir: string, idx: number) => (
                <li key={idx}>{dir}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-800/40 pb-3">
        <div className="flex items-center gap-1.5 bg-[#0a180e] p-1.5 rounded-xl border border-emerald-800/50">
          {[
            { id: 'all', label: 'All Inefficiencies' },
            { id: 'overproduction', label: 'Overproduction' },
            { id: 'raw_material_loss', label: 'Raw Material Losses' },
            { id: 'machine_downtime', label: 'Machine Downtime' },
            { id: 'excessive_energy', label: 'Energy Surges' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30 border border-emerald-400/60'
                  : 'text-emerald-200/70 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Anomaly Log Cards */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className={`rounded-2xl border p-5 transition-all space-y-3 ${
              log.actionTaken
                ? 'border-emerald-900/40 bg-[#071109]/70 opacity-60'
                : 'border-emerald-800/50 bg-[#0d1d11] hover:border-yellow-500/40 shadow-sm'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">{log.id}</span>
                <span aria-hidden="true" className="text-emerald-700">·</span>
                <span className="font-semibold text-white">{log.facility}</span>
                <span aria-hidden="true" className="text-emerald-700">·</span>
                <span className="capitalize text-emerald-300/80">{log.type.replace('_', ' ')}</span>
              </div>

              <div className="flex items-center gap-3 font-mono">
                <span className="text-yellow-400 font-bold">₹{log.lossEstimateRs.toLocaleString()} Impact</span>
                <span className="text-emerald-400/60">{log.detectedAt}</span>
              </div>
            </div>

            <div className="text-sm font-bold text-emerald-50">
              {log.metric}
            </div>

            <div className="rounded-xl bg-[#08140a] p-3.5 border border-emerald-800/40 text-xs text-emerald-100/90">
              <span className="text-yellow-400 font-bold">AI Diagnostic Diagnosis: </span>
              {log.aiDiagnosis}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-emerald-800/40 text-xs">
              <span className="text-emerald-300/60 text-[11px]">
                Status: {log.actionTaken ? 'Mitigation Action Applied' : 'Pending Engineer Verification'}
              </span>

              <button
                onClick={() => toggleActionTaken(log.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  log.actionTaken
                    ? 'bg-emerald-950 text-emerald-400 hover:text-white border border-emerald-800/50'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                }`}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>{log.actionTaken ? 'Mark as Unresolved' : 'Mark Directives Implemented'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
