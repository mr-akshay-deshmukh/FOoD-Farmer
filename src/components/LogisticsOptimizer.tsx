import React, { useState } from 'react';
import { Route, Navigation, Truck, Zap, ShieldCheck, Play, RotateCcw, Sparkles } from 'lucide-react';

interface LogisticsOptimizerProps {
  dispatchQueue: any[];
}

export const LogisticsOptimizer: React.FC<LogisticsOptimizerProps> = ({ dispatchQueue }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('Electric Insulated Reefer EV Van');
  const [trafficLevel, setTrafficLevel] = useState('Moderate peak city traffic');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiOptimizedPlan, setAiOptimizedPlan] = useState<any | null>(null);
  const [simulationActive, setSimulationActive] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const handleRunAiOptimization = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/ai/optimize-routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleType: selectedVehicle,
          trafficLevel,
        }),
      });
      const data = await res.json();
      if (data.success && data.plan) {
        setAiOptimizedPlan(data.plan);
        setCurrentStepIdx(0);
        setSimulationActive(false);
      }
    } catch (err: any) {
      alert('Error optimizing routes: ' + err.message);
    } finally {
      setIsOptimizing(false);
    }
  };

  const currentPlan = aiOptimizedPlan || {
    routeTitle: 'Unified Multi-Stream Dispatch: Hot Food + Zero-Fridge Cold-Chain Cluster',
    totalDistanceKm: 18.4,
    estimatedDurationMins: 38,
    co2ReductionKg: 46.8,
    coldChainIntegrityScore: '99.4% (Active Dual-Zone Telemetry)',
    summary: 'Optimized multi-stop dispatch combining ₹1 hot surplus food rescue with Zero-Fridge dairy transfer on an EV reefer van to eliminate deadhead runs.',
    waypoints: [
      {
        sequence: 1,
        type: 'PICKUP',
        location: 'Shree Krishna Grand Hall, Sector 14',
        cargo: '180 Portions Basmati Pulao & Paneer Butter Masala (Thermal Cambros)',
        stream: '1 Outlet',
        timeWindow: 'Next 25 mins',
        temperatureMonitoring: '68.5°C (Upper Insulated Hot Bay)',
        instructions: 'Check tamper-evident seals and digital temperature probes before signing handover token.',
      },
      {
        sequence: 2,
        type: 'PICKUP',
        location: 'Subzi & Dairy Corner Express, HSR Layout',
        cargo: '160kg Chilled Paneer, Butter & Frozen Ice Cream Tubs',
        stream: 'Zero Fridge',
        timeWindow: 'Next 45 mins',
        temperatureMonitoring: '-18°C / 4°C (Lower Cold Reefer Bay)',
        instructions: 'Transfer crates directly from failing chiller to onboard -18°C freezer compartment.',
      },
      {
        sequence: 3,
        type: 'DROPOFF',
        location: 'Asha Deep Children Home & Community Shelter',
        cargo: '180 Hot Meals Handover for Dinner Distribution',
        stream: '1 Outlet',
        timeWindow: 'Within 60 mins',
        temperatureMonitoring: '64.2°C at delivery',
        instructions: 'Scan NGO verification QR code and disburse hot meals in stainless banquet trays.',
      },
      {
        sequence: 4,
        type: 'DROPOFF',
        location: 'Mega Cold-Chain Hub Central (Singasandra)',
        cargo: '160kg Chilled Inventory Intake',
        stream: 'Zero Fridge',
        timeWindow: 'Within 80 mins',
        temperatureMonitoring: '3.8°C / -18.2°C verified',
        instructions: 'Offload to Cold Storage Bay B racks. Update inter-mart transfer ledger.',
      },
    ],
    driverDirectives: [
      'Maintain thermal divider curtain between Hot Food Cambro zone and -18°C freezer bay.',
      'Use regenerative braking mode along Ring Road elevated corridor to save 12% EV battery.',
      'Notify recipient NGO 10 minutes prior to arrival via automated FOOD FARMER SMS ping.',
    ],
  };

  const handleNextSimulationStep = () => {
    if (currentStepIdx < currentPlan.waypoints.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      setSimulationActive(false);
      setCurrentStepIdx(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-r from-[#0c1c10] via-[#1c0e1d] to-[#1c2e12] p-6 sm:p-8 shadow-xl shadow-pink-950/30">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-400">
            <Route className="h-4 w-4 text-pink-400" />
            <span className="bg-pink-500/15 text-pink-300 px-2.5 py-0.5 rounded-md border border-pink-500/30">
              AI-POWERED MULTI-STREAM LOGISTICS ENGINE · ECO DISPATCH
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Smart Logistics & Dispatch Optimizer
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Consolidates urgent cooked food pickups (1 Outlet), emergency cold-storage balances (Zero Fridge), and FMCG liquidation cartons (Eat in a Day & Budget Deal) into unified, minimum-carbon dispatch runs with strict thermal compartmentalization.
          </p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="rounded-2xl border border-emerald-800/50 bg-[#0e1f13]/90 p-5 space-y-4 shadow-lg shadow-emerald-950/40">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-emerald-300 font-bold mb-1">Assigned Fleet Vehicle</label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full rounded-xl border border-emerald-800/80 bg-[#071109] px-3.5 py-2 text-white focus:border-yellow-400 focus:outline-hidden"
            >
              <option value="Electric Insulated Reefer EV Van">Electric Insulated Reefer EV Van (Dual-Temp)</option>
              <option value="Heavy Electric Cargo Van">Heavy Electric Cargo Van (Dry Ambient Lots)</option>
              <option value="Rapid Electric 2-Wheeler Fleet">Rapid Electric 2-Wheeler Fleet (Urgent Meals)</option>
            </select>
          </div>

          <div>
            <label className="block text-emerald-300 font-bold mb-1">Urban Traffic Model</label>
            <select
              value={trafficLevel}
              onChange={(e) => setTrafficLevel(e.target.value)}
              className="w-full rounded-xl border border-emerald-800/80 bg-[#071109] px-3.5 py-2 text-white focus:border-yellow-400 focus:outline-hidden"
            >
              <option value="Moderate peak city traffic">Moderate peak city traffic</option>
              <option value="Heavy congestion with flyover blockages">Heavy congestion (Green corridor priority)</option>
              <option value="Light off-peak transit">Light off-peak transit</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunAiOptimization}
              disabled={isOptimizing}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition-transform hover:scale-[1.02] cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-500/25 border border-emerald-300/70"
            >
              <Sparkles className="h-4 w-4 text-slate-950" />
              <span>{isOptimizing ? 'Calculating Eco Routes...' : 'Re-run AI Route Optimization'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Optimization Plan Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Waypoint Timeline */}
        <div className="lg:col-span-2 rounded-2xl border border-emerald-800/50 bg-[#0e1f13]/90 p-6 space-y-6 shadow-lg shadow-emerald-950/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/60 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">{currentPlan.routeTitle}</h2>
              <p className="text-xs text-emerald-200/70 mt-0.5">{currentPlan.summary}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSimulationActive(!simulationActive)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  simulationActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 border border-emerald-300'
                    : 'bg-[#09140c] text-emerald-200 border border-emerald-800 hover:border-emerald-400'
                }`}
              >
                <Play className="h-3.5 w-3.5" />
                <span>{simulationActive ? 'Simulation On' : 'Simulate Run'}</span>
              </button>

              {simulationActive && (
                <button
                  onClick={handleNextSimulationStep}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 text-xs font-black hover:from-emerald-400 hover:to-teal-300 cursor-pointer shadow-md shadow-emerald-500/25 border border-emerald-300/60"
                >
                  Next Step ({currentStepIdx + 1}/{currentPlan.waypoints.length})
                </button>
              )}
            </div>
          </div>

          {/* Metrics bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl bg-[#09140c] p-3 border border-emerald-800/60">
              <span className="text-emerald-400/70">Route Distance</span>
              <div className="text-lg font-bold font-mono text-white mt-1">
                {currentPlan.totalDistanceKm} km
              </div>
            </div>
            <div className="rounded-xl bg-[#09140c] p-3 border border-emerald-800/60">
              <span className="text-emerald-400/70">Est. Trip Duration</span>
              <div className="text-lg font-bold font-mono text-white mt-1">
                {currentPlan.estimatedDurationMins} mins
              </div>
            </div>
            <div className="rounded-xl bg-[#09140c] p-3 border border-emerald-800/60">
              <span className="text-emerald-400/70">CO₂ Avoided</span>
              <div className="text-lg font-bold font-mono text-yellow-300 mt-1">
                {currentPlan.co2ReductionKg} kg
              </div>
            </div>
            <div className="rounded-xl bg-[#09140c] p-3 border border-emerald-800/60">
              <span className="text-emerald-400/70">Cold Chain Integrity</span>
              <div className="text-sm font-bold font-mono text-emerald-300 mt-1 truncate">
                {currentPlan.coldChainIntegrityScore}
              </div>
            </div>
          </div>

          {/* Turn-by-Turn Waypoints */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-yellow-300">Turn-by-Turn Sequential Waypoints:</div>
            <div className="space-y-3">
              {currentPlan.waypoints.map((wp: any, idx: number) => {
                const isCurrent = simulationActive && currentStepIdx === idx;
                const isCompleted = simulationActive && currentStepIdx > idx;

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-4 transition-all ${
                      isCurrent
                        ? 'border-yellow-400 bg-yellow-400/10 ring-1 ring-yellow-400/50 shadow-md shadow-yellow-500/10'
                        : isCompleted
                        ? 'border-emerald-950 bg-[#071109]/50 opacity-60'
                        : 'border-emerald-800/50 bg-[#09140c]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-extrabold ${
                            isCurrent
                              ? 'bg-yellow-400 text-slate-950 animate-bounce'
                              : isCompleted
                              ? 'bg-emerald-900 text-emerald-300'
                              : 'bg-emerald-800/80 text-yellow-200'
                          }`}
                        >
                          {wp.sequence}
                        </div>
                        <span
                          className={`font-mono font-extrabold uppercase tracking-wider text-[11px] ${
                            wp.type === 'PICKUP' ? 'text-yellow-400' : 'text-emerald-400'
                          }`}
                        >
                          {wp.type}
                        </span>
                        <span aria-hidden="true" className="text-emerald-700">·</span>
                        <span className="font-bold text-white">{wp.location}</span>
                      </div>

                      <div className="font-mono text-emerald-300 font-semibold shrink-0">{wp.timeWindow}</div>
                    </div>

                    <div className="mt-2 pl-8 space-y-1 text-xs">
                      <div className="text-emerald-100 font-medium">Cargo: {wp.cargo}</div>
                      <div className="flex flex-wrap items-center gap-3 text-emerald-200/70 font-mono text-[11px]">
                        <span>Stream: <strong className="text-yellow-300">{wp.stream}</strong></span>
                        <span>·</span>
                        <span>Thermal Zone: <strong className="text-emerald-300">{wp.temperatureMonitoring}</strong></span>
                      </div>
                      <p className="text-[11px] text-emerald-300/60 italic pt-1">{wp.instructions}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Driver Directives & Thermal Compartment Visualizer */}
        <div className="space-y-6">
          {/* Thermal Compartment Status */}
          <div className="rounded-2xl border border-emerald-800/50 bg-[#0e1f13]/90 p-5 space-y-4 shadow-lg shadow-emerald-950/40">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span>EV Reefer Compartments</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-[#09140c] p-3.5 border border-yellow-500/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-yellow-400">Zone A: Hot Surplus Insulated Box</span>
                  <span className="font-mono font-bold text-white">68.5°C</span>
                </div>
                <p className="text-[11px] text-emerald-200/70">Holding 180 cooked banquet meals (FSSAI thermal target: &gt;60°C).</p>
              </div>

              <div className="rounded-xl bg-[#09140c] p-3.5 border border-emerald-700/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-300">Zone B: Deep Chiller Bay</span>
                  <span className="font-mono font-bold text-white">-18.2°C</span>
                </div>
                <p className="text-[11px] text-emerald-200/70">Holding 160kg dairy & ice cream batches from Zero Fridge transfer.</p>
              </div>

              <div className="rounded-xl bg-[#09140c] p-3.5 border border-yellow-600/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-yellow-300">Zone C: Ambient Dry Cargo</span>
                  <span className="font-mono font-bold text-white">24.0°C</span>
                </div>
                <p className="text-[11px] text-emerald-200/70">Holding FMCG clearance cartons (Maaza juice & lotions).</p>
              </div>
            </div>
          </div>

          {/* AI Driver Directives */}
          <div className="rounded-2xl border border-emerald-800/50 bg-[#0e1f13]/90 p-5 space-y-3 shadow-lg shadow-emerald-950/40">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Navigation className="h-4 w-4 text-yellow-400" />
              <span>AI Route Directives</span>
            </h3>

            <ul className="space-y-2 text-xs text-emerald-200/80">
              {currentPlan.driverDirectives?.map((dir: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-yellow-400 font-bold shrink-0">•</span>
                  <span>{dir}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
