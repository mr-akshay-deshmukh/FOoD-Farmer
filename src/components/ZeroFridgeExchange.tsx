import React, { useState } from 'react';
import { ZeroFridgeTransfer } from '../types';
import { ThermometerSnowflake, AlertOctagon, ArrowRight, Truck, CheckCircle2, ShieldCheck, PlusCircle } from 'lucide-react';

interface ZeroFridgeExchangeProps {
  transfers: ZeroFridgeTransfer[];
  onRequestTransfer: (transfer: any) => Promise<any>;
}

export const ZeroFridgeExchange: React.FC<ZeroFridgeExchangeProps> = ({
  transfers,
  onRequestTransfer,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [senderMart, setSenderMart] = useState('Subzi Mandi Express (Gourmet Branch)');
  const [senderLocation, setSenderLocation] = useState('BTM Layout 2nd Stage, Bengaluru');
  const [tempDegC, setTempDegC] = useState(5.2);
  const [warningReason, setWarningReason] = useState('Compressor high-pressure trip (temperature creeping up from 2°C)');
  const [itemName, setItemName] = useState('Frozen Dairy & Ice Cream Bulk');
  const [quantityKg, setQuantityKg] = useState(85);
  const [tempReq, setTempReq] = useState('-18°C Frozen Deep Chill');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onRequestTransfer({
        senderMart,
        senderLocation,
        tempDegC,
        warningReason,
        items: [{ name: itemName, quantityKg, tempRequirement: tempReq }],
        urgencyLevel: tempDegC > 4 ? 'critical' : 'high',
      });
      setSuccessMsg('Cold chain emergency transfer initiated! Reefer EV van auto-assigned.');
      setShowCreateModal(false);
    } catch (err: any) {
      alert(err.message || 'Error creating transfer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-r from-[#0c1c10] via-[#1d0e1d] to-[#1c2e12] p-6 sm:p-8 shadow-xl shadow-pink-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-pink-400">
              <ThermometerSnowflake className="h-4 w-4 text-pink-400" />
              <span className="bg-pink-500/15 text-pink-300 px-2.5 py-0.5 rounded-md border border-pink-500/30">
                COLD CHAIN RESILIENCE & INTER-MART BALANCING
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Zero Fridge Exchange
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Marts with constrained or at-risk cold storage (freezer capacity full, compressor alerts, or power disruptions) rapidly offload chilled & frozen inventory to regional mega-marts with surplus cold storage tanks, preventing catastrophic dairy and frozen spoilage.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black transition-all shadow-lg shadow-emerald-500/25 hover:scale-[1.02] cursor-pointer self-start md:self-auto shrink-0 border border-emerald-300/70"
          >
            <PlusCircle className="h-4 w-4 text-slate-950 stroke-[2.5]" />
            <span>Request Emergency Cold Transfer</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-950/80 border border-yellow-400/30 p-4 text-xs text-yellow-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-yellow-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white font-bold ml-4 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Live Cold Storage Exchange Monitor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
          <div className="text-xs font-bold text-yellow-300">
            Active Cold-Chain Transfer Operations
          </div>
          <div className="text-xs text-emerald-300/70 font-mono">
            Automated Reefer Van Integration Active
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {transfers.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-emerald-800/50 bg-[#0e1f13]/90 p-6 space-y-5 shadow-lg shadow-emerald-950/40"
            >
              {/* Header: Urgency and warning */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/60 pb-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-3.5 w-3.5 rounded-full animate-pulse shadow-sm ${
                      item.urgencyLevel === 'critical' ? 'bg-yellow-400 shadow-yellow-400' : 'bg-emerald-400 shadow-emerald-400'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-white font-mono">{item.id}</span>
                      <span aria-hidden="true" className="text-emerald-700">·</span>
                      <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider">
                        {item.urgencyLevel} Urgency
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200/70 mt-0.5">{item.warningReason}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="rounded-xl bg-[#09140c] px-3 py-1 text-yellow-300 border border-emerald-800/60">
                    Chiller Temp: <span className="font-bold">{item.tempDegC}°C</span>
                  </div>
                  <div className="rounded-xl bg-[#09140c] px-3 py-1 text-emerald-200 border border-emerald-800/60">
                    Status: <span className="text-yellow-400 font-bold capitalize">{item.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Mart Flow Transfer Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sender Small Mart */}
                <div className="rounded-xl bg-[#09140c] p-4 border border-yellow-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400/80 font-bold">ORIGINATING MART (CAPACITY LIMIT)</span>
                    <span className="text-yellow-400 font-mono font-extrabold">
                      {item.currentFridgeCapacityPercent}% Full
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.senderMart}</h4>
                  <p className="text-xs text-emerald-200/70">{item.senderLocation}</p>

                  <div className="w-full bg-[#122415] h-2 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-yellow-400 h-full rounded-full"
                      style={{ width: `${item.currentFridgeCapacityPercent}%` }}
                    />
                  </div>
                </div>

                {/* Recipient Mega Hub */}
                <div className="rounded-xl bg-[#09140c] p-4 border border-emerald-700/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400/80 font-bold">DESTINATION COLD STORAGE HUB</span>
                    <span className="text-emerald-300 font-mono font-extrabold">
                      {item.targetHubFreezerCapacityPercent}% Utilized
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.targetHubMart}</h4>
                  <p className="text-xs text-emerald-200/70">{item.targetHubLocation}</p>

                  <div className="w-full bg-[#122415] h-2 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                      style={{ width: `${item.targetHubFreezerCapacityPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Transfer Cargo Lots */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-yellow-300">
                  Perishable Cargo Batches Under Transfer:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {item.items.map((cargo, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-[#09140c] p-3 border border-emerald-800/60 text-xs space-y-1"
                    >
                      <div className="font-bold text-white truncate">{cargo.name}</div>
                      <div className="flex items-center justify-between text-emerald-200/70 font-mono text-[11px]">
                        <span>Weight: {cargo.quantityKg} kg</span>
                        <span className="text-yellow-300 font-semibold">{cargo.tempRequirement}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Logistics bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-emerald-200/70 border-t border-emerald-900/60">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-yellow-400 shrink-0" />
                  <span>
                    Vehicle:{' '}
                    <strong className="text-white">
                      {item.vehicleAssigned || 'Insulated Reefer EV #KA-01-EV-4412 (Assigned)'}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-yellow-300 font-medium">
                  <ShieldCheck className="h-4 w-4 text-yellow-400" />
                  <span>Telemetry Verified Cold Chain Transfer</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-yellow-500/30 bg-[#0d1e12] p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-emerald-900/60 pb-4">
              <div>
                <span className="text-xs font-bold text-yellow-400">ZERO FRIDGE COLD BALANCING</span>
                <h2 className="text-lg font-bold text-white mt-1">Initiate Cold Storage Offload</h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-emerald-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTransfer} className="space-y-4 text-xs">
              <div>
                <label className="block text-emerald-200 font-medium mb-1">
                  Originating Mart Name (Small/Medium Outlet)
                </label>
                <input
                  type="text"
                  required
                  value={senderMart}
                  onChange={(e) => setSenderMart(e.target.value)}
                  className="w-full rounded-xl border border-emerald-800/80 bg-[#071109] px-3.5 py-2 text-white focus:border-yellow-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-emerald-200 font-medium mb-1">
                  Mart Address / Location
                </label>
                <input
                  type="text"
                  required
                  value={senderLocation}
                  onChange={(e) => setSenderLocation(e.target.value)}
                  className="w-full rounded-xl border border-emerald-800/80 bg-[#071109] px-3.5 py-2 text-white focus:border-yellow-400 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-200 font-medium mb-1">
                    Current Chiller Temp (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={tempDegC}
                    onChange={(e) => setTempDegC(Number(e.target.value))}
                    className="w-full rounded-xl border border-emerald-800/80 bg-[#071109] px-3.5 py-2 text-white font-mono focus:border-yellow-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-emerald-200 font-medium mb-1">
                    Total Cargo Weight (kg)
                  </label>
                  <input
                    type="number"
                    required
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(Number(e.target.value))}
                    className="w-full rounded-xl border border-emerald-800/80 bg-[#071109] px-3.5 py-2 text-white font-mono focus:border-yellow-400 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-200 font-medium mb-1">
                  Perishable Items Description
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. 50kg Paneer slabs, 40 tubs ice cream"
                  className="w-full rounded-xl border border-emerald-800/80 bg-[#071109] px-3.5 py-2 text-white focus:border-yellow-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-emerald-200 font-medium mb-1">
                  Reason for Transfer
                </label>
                <input
                  type="text"
                  required
                  value={warningReason}
                  onChange={(e) => setWarningReason(e.target.value)}
                  className="w-full rounded-xl border border-emerald-800/80 bg-[#071109] px-3.5 py-2 text-white focus:border-yellow-400 focus:outline-hidden"
                />
              </div>

              <div className="rounded-xl bg-[#09140c] p-3.5 border border-yellow-500/20 text-emerald-200 space-y-1">
                <div className="font-bold text-yellow-300">Auto-Matched Regional Hub:</div>
                <div className="text-white font-semibold">Mega Cold-Chain Hub Central (Singasandra)</div>
                <div className="text-[11px] text-emerald-300/70">
                  Target hub has 65% surplus freezer volume. Instant Reefer dispatch ticket will be emitted to AI logistics queue.
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-emerald-800 text-emerald-200 hover:bg-emerald-900/60 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-500/25 border border-emerald-300/60"
                >
                  {isSubmitting ? 'Dispatching...' : 'Confirm Emergency Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
