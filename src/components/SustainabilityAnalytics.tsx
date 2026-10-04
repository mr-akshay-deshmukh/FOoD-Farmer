import React, { useState } from 'react';
import { SustainabilityMetrics } from '../types';
import { Award, Leaf, Droplets, Utensils, Globe, FileText, Printer, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

interface SustainabilityAnalyticsProps {
  metrics: SustainabilityMetrics;
}

export const SustainabilityAnalytics: React.FC<SustainabilityAnalyticsProps> = ({ metrics }) => {
  const [selectedEntityName, setSelectedEntityName] = useState('Shree Krishna Grand Convention Hall');
  const [selectedBadgeType, setSelectedBadgeType] = useState('Zero Leftover Platinum Champion');
  const [selectedRole, setSelectedRole] = useState<'seller_outlet' | 'food_bank' | 'community_kitchen' | 'retail_mart'>('seller_outlet');
  const [showPrintModal, setShowPrintModal] = useState(false);

  const badgeTiers = [
    {
      id: 'zero_leftover_plat',
      title: 'Zero Leftover Platinum Champion',
      target: 'Kitchens & Banquet Halls',
      criteria: 'Over 10,000 Meals Rescued via 1 Outlet & >90% Landfill Diversion',
      color: 'from-amber-400 to-yellow-600',
      badgeBorder: 'border-amber-400/80',
    },
    {
      id: 'cold_chain_green',
      title: 'Green Cold-Chain Pioneer',
      target: 'Retail Marts & Chilled Warehouses',
      criteria: 'Zero Perishable Loss through automated Zero-Fridge inter-mart transfers',
      color: 'from-cyan-400 to-blue-600',
      badgeBorder: 'border-cyan-400/80',
    },
    {
      id: 'rupee_angel',
      title: '₹1 Community Relief Angel',
      target: 'NGOs & Community Relief Kitchens',
      criteria: 'Daily food security distribution to underprivileged shelters and children homes',
      color: 'from-emerald-400 to-teal-600',
      badgeBorder: 'border-emerald-400/80',
    },
    {
      id: 'circular_retail',
      title: 'Circular Retail Pioneer',
      target: 'Kiranas & FMCG Dealers',
      criteria: 'Rapid liquidation of near-expiry FMCG cartons via Eat-in-a-Day',
      color: 'from-purple-400 to-indigo-600',
      badgeBorder: 'border-purple-400/80',
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-r from-[#0c1c10] via-[#1d0e1c] to-[#1c2e12] p-6 sm:p-8 shadow-xl shadow-pink-950/30">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-400">
            <Award className="h-4 w-4 text-pink-400" />
            <span className="bg-pink-500/15 text-pink-300 px-2.5 py-0.5 rounded-md border border-pink-500/30">
              ESG COMPLIANCE, IMPACT LEDGER & CERTIFICATION BADGES
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Sustainability & ESG Analytics
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Quantifies carbon footprint reduction, food mass saved from anaerobic landfill decomposition, water conserved, and generates accredited dynamic sustainability badges for seller outlets, food banks, and logistics partners.
          </p>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-emerald-800/40 bg-[#0d1d11] p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-200/70 font-medium">
            <span>Carbon Avoidance</span>
            <Leaf className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {(metrics.co2PreventedKg / 1000).toFixed(1)} MT <span className="text-xs font-normal text-emerald-300/70">CO₂e</span>
          </div>
          <div className="text-xs text-emerald-400/70">
            {metrics.co2PreventedKg.toLocaleString()} kg carbon footprint averted
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-800/40 bg-[#0d1d11] p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-200/70 font-medium">
            <span>Food Mass Rescued</span>
            <Utensils className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-black font-mono text-yellow-400">
            {metrics.totalFoodSavedKg.toLocaleString()} kg
          </div>
          <div className="text-xs text-emerald-400/70">
            {metrics.mealsProvidedToNeedy.toLocaleString()} wholesome meals served
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-800/40 bg-[#0d1d11] p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-200/70 font-medium">
            <span>Embedded Water Conserved</span>
            <Droplets className="h-4 w-4 text-teal-300" />
          </div>
          <div className="text-2xl font-black font-mono text-teal-300">
            {(metrics.waterConservedM3 / 1000).toFixed(1)}k m³
          </div>
          <div className="text-xs text-emerald-400/70">
            Equivalent to 38 Olympic swimming pools
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-800/40 bg-[#0d1d11] p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-200/70 font-medium">
            <span>Landfill Diversion Rate</span>
            <Globe className="h-4 w-4 text-yellow-300" />
          </div>
          <div className="text-2xl font-black font-mono text-yellow-300">
            {metrics.landfillDiversionPercent}%
          </div>
          <div className="text-xs text-emerald-400/70">
            ₹{(metrics.financialLossAvoidedRs / 100000).toFixed(1)}L value preserved
          </div>
        </div>
      </div>

      {/* Sustainability Badge Generator Section */}
      <div className="rounded-2xl border border-yellow-500/30 bg-[#0a180e] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/60 pb-4">
          <div>
            <h2 className="text-base font-bold text-white">Dynamic Sustainability Badges & Credentials</h2>
            <p className="text-xs text-emerald-200/70 mt-0.5">
              Issue and display verified digital sustainability seals for participating kitchens, marts, and food banks.
            </p>
          </div>

          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/25 cursor-pointer self-start sm:self-auto border border-emerald-300/70"
          >
            <Printer className="h-4 w-4 text-slate-950 stroke-[2.5]" />
            <span>Generate Official ESG Certificate</span>
          </button>
        </div>

        {/* Customizer Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-emerald-200/80 font-semibold mb-1">Outlet / Facility Name</label>
            <input
              type="text"
              value={selectedEntityName}
              onChange={(e) => setSelectedEntityName(e.target.value)}
              className="w-full rounded-xl border border-emerald-800/70 bg-[#061208] px-3.5 py-2 text-white focus:outline-hidden focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-emerald-200/80 font-semibold mb-1">Facility Role Type</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="w-full rounded-xl border border-emerald-800/70 bg-[#061208] px-3.5 py-2 text-white focus:outline-hidden focus:border-yellow-400"
            >
              <option value="seller_outlet">Seller Outlet / Commercial Banquet</option>
              <option value="food_bank">Food Bank / Community Charity</option>
              <option value="retail_mart">Retail SuperMart / Kirana Dealer</option>
              <option value="community_kitchen">Institutional Campus Kitchen</option>
            </select>
          </div>

          <div>
            <label className="block text-emerald-200/80 font-semibold mb-1">Accreditation Badge Tier</label>
            <select
              value={selectedBadgeType}
              onChange={(e) => setSelectedBadgeType(e.target.value)}
              className="w-full rounded-xl border border-emerald-800/70 bg-[#061208] px-3.5 py-2 text-white focus:outline-hidden focus:border-yellow-400"
            >
              {badgeTiers.map((b) => (
                <option key={b.id} value={b.title}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Badge Preview Card */}
        <div className="rounded-2xl border-2 border-pink-500/30 bg-gradient-to-br from-[#0c1f12] via-[#150d18] to-[#132815] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg shadow-pink-950/20">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* Circular High-Aesthetic Badge Seal with Pink, Yellow, and Green */}
            <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-yellow-400 to-emerald-400 p-1.5 shadow-2xl shadow-pink-500/20">
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#071309] p-2 text-center border-2 border-yellow-400/60">
                <Leaf className="h-7 w-7 text-pink-400 mb-0.5" />
                <span className="text-[10px] font-black uppercase tracking-wider text-yellow-300">
                  VERIFIED
                </span>
                <span className="text-[9px] font-mono text-emerald-300 font-bold leading-none">
                  ZERO LEFTOVER
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-extrabold text-yellow-400 uppercase tracking-widest">
                  ACCREDITED SUSTAINABILITY PARTNER
                </span>
                <span className="text-emerald-700">·</span>
                <span className="text-xs font-mono text-emerald-300/80">FSSAI / ESG Compliant</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">{selectedEntityName}</h3>
              <p className="text-xs text-yellow-300 font-bold">{selectedBadgeType}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-emerald-200/70 pt-1 font-mono">
                <span>Verified ID: <strong className="text-yellow-400">FF-ESG-2026-9921</strong></span>
                <span>·</span>
                <span>Active Since: <strong className="text-white">Oct 2026</strong></span>
              </div>
            </div>
          </div>

          {/* QR Verification Mock */}
          <div className="flex flex-col items-center gap-2 p-3.5 bg-[#061208] rounded-2xl border border-yellow-500/30 shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white p-2">
              <QrCode className="h-16 w-16 text-slate-950" />
            </div>
            <span className="text-[10px] font-mono text-yellow-400 font-semibold">Scan to Verify Audit</span>
          </div>
        </div>

        {/* Badges Grid for All Roles */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-emerald-100">Standard Framework Accreditation Badges:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badgeTiers.map((tier) => (
              <div
                key={tier.id}
                onClick={() => setSelectedBadgeType(tier.title)}
                className={`rounded-2xl border p-4 cursor-pointer transition-all space-y-2 ${
                  selectedBadgeType === tier.title
                    ? 'border-yellow-400 bg-[#0e2413] ring-2 ring-yellow-400/40 shadow-lg shadow-yellow-500/10'
                    : 'border-emerald-800/40 bg-[#071309]/80 hover:border-emerald-600/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-yellow-400/80">{tier.target}</span>
                  <Award className="h-4 w-4 text-yellow-400" />
                </div>
                <h4 className="text-sm font-bold text-white">{tier.title}</h4>
                <p className="text-xs text-emerald-200/70 leading-relaxed">{tier.criteria}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Structured ESG Compliance Reporting Table */}
      <div className="rounded-2xl border border-emerald-800/50 bg-[#0a180e] p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Annual ESG Compliance Report Table</h3>
            <p className="text-xs text-emerald-200/70 mt-0.5">
              Audited according to GHG Protocol Corporate Value Chain (Scope 3) and BRSR Sustainability Standards.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-yellow-400 font-mono font-bold">
            <CheckCircle2 className="h-4 w-4" />
            <span>Auditor Signed</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-emerald-100">
            <thead className="border-b border-emerald-800/80 bg-[#061208] text-emerald-300/80">
              <tr>
                <th className="py-3 px-4 font-bold">ESG Pillar</th>
                <th className="py-3 px-4 font-bold">Target UN SDG</th>
                <th className="py-3 px-4 font-bold">Current Metric</th>
                <th className="py-3 px-4 font-bold">Verification Method</th>
                <th className="py-3 px-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-800/40">
              <tr className="hover:bg-emerald-950/40">
                <td className="py-3 px-4 font-bold text-white">Environmental (E)</td>
                <td className="py-3 px-4 text-emerald-200/80">SDG 12: Responsible Consumption</td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-400">38.74 MT CO₂e Avoided</td>
                <td className="py-3 px-4 text-emerald-200/70">Real-time Methane & EV Logistics Telemetry</td>
                <td className="py-3 px-4 text-yellow-400 font-bold">Compliant</td>
              </tr>
              <tr className="hover:bg-emerald-950/40">
                <td className="py-3 px-4 font-bold text-white">Social (S)</td>
                <td className="py-3 px-4 text-emerald-200/80">SDG 2: Zero Hunger</td>
                <td className="py-3 px-4 font-mono font-bold text-yellow-400">36,900 Meals via 1 Outlet</td>
                <td className="py-3 px-4 text-emerald-200/70">Registered Darpan NGO Receipts & Gate Passes</td>
                <td className="py-3 px-4 text-yellow-400 font-bold">Compliant</td>
              </tr>
              <tr className="hover:bg-emerald-950/40">
                <td className="py-3 px-4 font-bold text-white">Governance (G)</td>
                <td className="py-3 px-4 text-emerald-200/80">SDG 9: Industry Innovation</td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-300">100% Traceable FSSAI Cold Chain</td>
                <td className="py-3 px-4 text-emerald-200/70">Automated HACCP IoT Probes</td>
                <td className="py-3 px-4 text-yellow-400 font-bold">Certified</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Certificate Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border border-yellow-500/40 bg-[#09150b] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">ESG CERTIFICATE EXPORT VIEW</span>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-emerald-300 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Printable Certificate Layout */}
            <div className="rounded-2xl border-4 border-double border-yellow-400/70 bg-[#050e07] p-8 text-center space-y-4 shadow-xl">
              <div className="text-xs font-black uppercase tracking-widest text-yellow-400">
                Official Certificate of ESG Sustainability
              </div>
              <h2 className="text-2xl font-black text-white">{selectedEntityName}</h2>
              <p className="text-xs text-emerald-200/70">has been conferred the accreditation of</p>
              <div className="text-lg font-black text-yellow-400 uppercase tracking-wide">
                {selectedBadgeType}
              </div>
              <p className="text-xs text-emerald-100 max-w-md mx-auto leading-relaxed">
                For demonstrating measurable leadership in zero food waste diversion, cold chain optimization, and ethical food redistribution via <strong className="text-emerald-400 font-bold">FOOD FARMER</strong> platform.
              </p>

              <div className="flex items-center justify-around border-t border-emerald-800/60 pt-6 text-xs text-emerald-200/70 font-mono">
                <div>
                  <div className="text-yellow-400 font-bold">FF-ESG-9921</div>
                  <div className="text-[10px] text-emerald-400/60">Credential Token</div>
                </div>
                <div>
                  <div className="text-white font-bold">October 2026</div>
                  <div className="text-[10px] text-emerald-400/60">Issuance Date</div>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold">FSSAI & GHG Validated</div>
                  <div className="text-[10px] text-emerald-400/60">Verification Protocol</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-xl border border-emerald-800 text-emerald-300 hover:bg-emerald-900/40 cursor-pointer text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-emerald-500/25 border border-emerald-300/60"
              >
                <Printer className="h-4 w-4" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
