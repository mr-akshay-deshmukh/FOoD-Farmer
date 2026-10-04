import React, { useState } from 'react';
import { FoodListing } from '../types';
import { Clock, MapPin, Phone, ShieldCheck, CheckCircle2, HeartHandshake, AlertCircle, Sparkles, IndianRupee } from 'lucide-react';

interface OneRupeeOutletProps {
  listings: FoodListing[];
  onClaimListing: (id: string, ngoName: string, portions: number) => Promise<any>;
  onOpenListModal: () => void;
}

export const OneRupeeOutlet: React.FC<OneRupeeOutletProps> = ({
  listings,
  onClaimListing,
  onOpenListModal,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  const [ngoName, setNgoName] = useState('Robin Hood Army / Feeding Bengaluru');
  const [ngoRegId, setNgoRegId] = useState('NGO-KAR-2024-8842');
  const [portionsClaiming, setPortionsClaiming] = useState<number>(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimReceipt, setClaimReceipt] = useState<{
    token: string;
    portions: number;
    title: string;
    source: string;
  } | null>(null);

  const filtered = listings.filter((item) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'veg') return item.isVegetarian;
    return item.sourceType === filterCategory;
  });

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;
    setIsSubmitting(true);
    try {
      const res = await onClaimListing(selectedListing.id, ngoName, portionsClaiming);
      setClaimReceipt({
        token: res.token || 'CLAIM-AUTH-OK',
        portions: portionsClaiming,
        title: selectedListing.title,
        source: selectedListing.sourceName,
      });
      setSelectedListing(null);
    } catch (err: any) {
      alert(err.message || 'Error claiming batch');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Explanation */}
      <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-r from-[#0c1c10] via-[#1c0f1d] to-[#1c2e12] p-6 sm:p-8 shadow-xl shadow-pink-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-pink-400">
              <Sparkles className="h-4 w-4 text-pink-400" />
              <span className="bg-pink-500/15 text-pink-300 px-2 py-0.5 rounded-md border border-pink-500/30">
                COMMUNITY RESCUE INITIATIVE · 1 OUTLET ZERO-WASTE RECOVERY
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center p-1.5 rounded-xl bg-yellow-400/20 text-yellow-400 border border-yellow-400/40">
                <IndianRupee className="h-6 w-6 stroke-[2.5]" />
              </span>
              <span>1 Outlet</span>
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Wholesome surplus food from commercial banquet kitchens, wedding convention halls, caterers, and food banks disbursed to verified NGOs and shelter homes at a nominal <span className="text-yellow-400 font-extrabold underline decoration-pink-400/60 underline-offset-2">₹1 token fee</span> to honor dignity and maintain chain-of-custody safety.
            </p>
          </div>

          <div className="flex flex-row md:flex-col items-start sm:items-end gap-3 shrink-0">
            <button
              onClick={onOpenListModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black transition-all shadow-lg shadow-emerald-500/25 hover:scale-[1.02] cursor-pointer border border-emerald-300/70"
            >
              + List Kitchen Surplus
            </button>
            <div className="text-xs text-emerald-300/80 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-4 w-4 text-pink-400" />
              <span>FSSAI & HACCP Thermal Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar (Segmented Controls) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-900/40 pb-4">
        <div className="flex items-center gap-1 bg-[#0b1b0f] p-1 rounded-xl border border-emerald-800/50">
          {[
            { id: 'all', label: 'All Listings' },
            { id: 'function_hall', label: 'Wedding / Banquets' },
            { id: 'kitchen', label: 'Institutional Kitchens' },
            { id: 'caterer', label: 'Catering Events' },
            { id: 'food_bank', label: 'Food Banks' },
            { id: 'veg', label: 'Pure Veg Only' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterCategory === tab.id
                  ? 'bg-emerald-600 text-white font-bold shadow-sm border border-emerald-400/60'
                  : 'text-emerald-200/60 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-emerald-300/80">
          Showing <span className="text-yellow-300 font-mono font-bold">{filtered.length}</span> live batches ready for NGO pickup
        </div>
      </div>

      {/* Grid of Food Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => {
          const isAvailable = item.status === 'available' && item.portions > 0;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                isAvailable
                  ? 'border-emerald-800/50 bg-[#0e1f13]/90 hover:border-yellow-400/50 hover:shadow-lg hover:shadow-emerald-950/60'
                  : 'border-emerald-950/60 bg-[#0a150d]/40 opacity-75'
              }`}
            >
              <div className="space-y-3">
                {/* Source & Expiry countdown line */}
                <div className="flex items-center justify-between text-xs text-emerald-200/70">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-yellow-200">{item.sourceName}</span>
                    <span aria-hidden="true" className="text-emerald-700">·</span>
                    <span className="capitalize text-emerald-300/80">{item.sourceType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-pink-300 bg-pink-500/15 px-2.5 py-0.5 rounded-full border border-pink-500/30">
                    <Clock className="h-3.5 w-3.5 text-pink-400" />
                    <span>{item.safeUntil}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-yellow-300 transition-colors">
                  {item.title}
                </h3>

                {/* Metadata row with clean unboxed text */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-200/80 border-y border-emerald-900/50 py-2.5">
                  <div>
                    <span className="text-emerald-400/80">Available: </span>
                    <span className="font-mono font-bold text-yellow-300 tabular-nums">
                      {item.portions} / {item.initialPortions} portions
                    </span>
                  </div>
                  <span aria-hidden="true" className="text-emerald-800">·</span>
                  <div>
                    <span className="text-emerald-400/80">Hold Temp: </span>
                    <span className="font-mono text-emerald-200">{item.temperatureAtListing}</span>
                  </div>
                  <span aria-hidden="true" className="text-emerald-800">·</span>
                  <div>
                    <span className="text-emerald-400/80">Carbon Saved: </span>
                    <span className="font-mono text-emerald-200">{item.co2SavedKg} kg CO₂e</span>
                  </div>
                </div>

                {/* Location & Contact info */}
                <div className="space-y-1 text-xs text-emerald-200/70">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-pink-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{item.contactPerson} ({item.phone})</span>
                  </div>
                </div>
              </div>

              {/* Action Button & ₹1 Price Token */}
              <div className="mt-5 pt-3 border-t border-emerald-900/50 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-300/70">Fixed NGO Token:</span>
                  <div className="text-xl font-black text-yellow-400 font-mono">₹1 <span className="text-xs text-emerald-200/60 font-normal">/ Batch lot</span></div>
                </div>

                {isAvailable ? (
                  <button
                    onClick={() => {
                      setSelectedListing(item);
                      setPortionsClaiming(item.portions);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition-transform hover:scale-[1.02] cursor-pointer shadow-md shadow-emerald-500/25 border border-emerald-300/70"
                  >
                    <HeartHandshake className="h-4 w-4 text-slate-950" />
                    <span>Claim for ₹1</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Claimed by {item.claimedByNgo || 'Verified NGO'}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Claim Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-yellow-500/30 bg-[#0d1e12] p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-emerald-900/60 pb-4">
              <div>
                <span className="text-xs font-bold text-yellow-400">NGO SURPLUS DISPATCH DISBURSEMENT</span>
                <h2 className="text-lg font-bold text-white mt-1">Claim for ₹1 Nominal Token</h2>
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="text-emerald-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl bg-[#09140c] p-4 border border-emerald-800/60 space-y-2 text-xs">
              <p className="font-bold text-yellow-200">{selectedListing.title}</p>
              <p className="text-emerald-200/70">Source: {selectedListing.sourceName} · {selectedListing.location}</p>
              <div className="flex items-center gap-3 text-yellow-400 font-mono pt-1">
                <span>Hold Temp: {selectedListing.temperatureAtListing}</span>
                <span>·</span>
                <span>Safe Window: {selectedListing.safeUntil}</span>
              </div>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-emerald-200 font-medium mb-1">
                  Verified NGO / Relief Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={ngoName}
                  onChange={(e) => setNgoName(e.target.value)}
                  className="w-full rounded-xl border border-emerald-800/80 bg-[#071109] px-3.5 py-2 text-white focus:border-yellow-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-emerald-200 font-medium mb-1">
                  NGO Registration / Darpan ID
                </label>
                <input
                  type="text"
                  required
                  value={ngoRegId}
                  onChange={(e) => setNgoRegId(e.target.value)}
                  className="w-full rounded-xl border border-emerald-800/80 bg-[#071109] px-3.5 py-2 text-white focus:border-yellow-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-emerald-200 font-medium mb-1">
                  Portions to Claim (Max available: {selectedListing.portions})
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedListing.portions}
                  value={portionsClaiming}
                  onChange={(e) => setPortionsClaiming(Number(e.target.value))}
                  className="w-full rounded-xl border border-emerald-800/80 bg-[#071109] px-3.5 py-2 text-white font-mono focus:border-yellow-400 focus:outline-hidden"
                />
              </div>

              <div className="rounded-xl bg-emerald-950/50 border border-yellow-500/20 p-3.5 text-emerald-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>Nominal CSR Token Fee:</span>
                  <span className="font-mono text-yellow-400 text-base">₹1.00</span>
                </div>
                <p className="text-[11px] text-emerald-300/70">
                  Payment is recorded as ₹1 statutory token for FSSAI CSR compliance. An instant digital pickup gate pass and AI delivery route will be queued.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedListing(null)}
                  className="px-4 py-2 rounded-xl border border-emerald-800 text-emerald-200 hover:bg-emerald-900/60 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-500/25 border border-emerald-300/60"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm ₹1 Claim & Generate Pass'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Claim Success Receipt Modal */}
      {claimReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-yellow-400/40 bg-[#0d1e12] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">₹1 Rescue Claim Confirmed!</h3>
                <p className="text-xs text-yellow-300 font-medium">Digital Handover Pass Generated</p>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-yellow-400/50 bg-[#08120a] p-4 space-y-2 text-center">
              <div className="text-xs text-emerald-300 font-semibold tracking-wider">PRESENT AT KITCHEN GATE</div>
              <div className="text-2xl font-black font-mono tracking-widest text-yellow-300">
                {claimReceipt.token}
              </div>
              <p className="text-xs text-emerald-100 font-medium">{claimReceipt.title}</p>
              <div className="text-xs text-emerald-300/80">
                {claimReceipt.portions} Portions · From {claimReceipt.source}
              </div>
            </div>

            <p className="text-xs text-emerald-200/80 leading-relaxed text-center">
              Our AI Dispatch has added this pickup to the optimized refrigerated EV route. Drivers and kitchen managers will verify this token prior to cargo loading.
            </p>

            <button
              onClick={() => setClaimReceipt(null)}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 py-2.5 text-xs font-black text-slate-950 hover:from-emerald-400 hover:to-teal-300 cursor-pointer shadow-md shadow-emerald-500/25 border border-emerald-300/60"
            >
              Done / Return to Outlets
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
