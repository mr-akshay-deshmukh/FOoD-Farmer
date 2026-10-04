import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  FileText, 
  HeartHandshake, 
  QrCode, 
  ShieldCheck, 
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  subscribeUserClaims, 
  subscribeUserListings, 
  subscribeUserIntakes 
} from '../firebase';
import type { User } from 'firebase/auth';

interface UserRescueLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const UserRescueLedgerModal: React.FC<UserRescueLedgerModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'claims' | 'listings' | 'intakes'>('claims');
  const [claims, setClaims] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [intakes, setIntakes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !currentUser) return;

    setIsLoading(true);

    const unsubClaims = subscribeUserClaims(currentUser.uid, (data) => {
      setClaims(data);
      setIsLoading(false);
    });

    const unsubListings = subscribeUserListings(currentUser.uid, (data) => {
      setListings(data);
      setIsLoading(false);
    });

    const unsubIntakes = subscribeUserIntakes(currentUser.uid, (data) => {
      setIntakes(data);
      setIsLoading(false);
    });

    return () => {
      unsubClaims();
      unsubListings();
      unsubIntakes();
    };
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl border border-emerald-500/40 bg-[#09170d] p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-emerald-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400">FIRESTORE CLOUD DATABASE</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Live Synced
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-white mt-0.5">
                My Food Farmer Rescue Ledger
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-emerald-400 hover:text-white text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Selectors */}
        <div className="flex items-center gap-2 border-b border-emerald-900/60 pb-2">
          <button
            onClick={() => setActiveTab('claims')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'claims'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-300/70 hover:text-white hover:bg-emerald-950/60'
            }`}
          >
            <HeartHandshake className="h-3.5 w-3.5" />
            <span>₹1 Claims ({claims.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'listings'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-300/70 hover:text-white hover:bg-emerald-950/60'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>My Surplus Listings ({listings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('intakes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'intakes'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-300/70 hover:text-white hover:bg-emerald-950/60'
            }`}
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>Verified Intakes ({intakes.length})</span>
          </button>
        </div>

        {/* Body content */}
        <div className="max-h-80 overflow-y-auto pr-1 space-y-2.5 text-xs">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-emerald-300">
              <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
              <span>Syncing with Firestore database...</span>
            </div>
          ) : null}

          {activeTab === 'claims' && (
            <>
              {claims.length === 0 ? (
                <div className="py-10 text-center text-emerald-300/70 space-y-1">
                  <p>No ₹1 surplus food claims stored in Firestore yet.</p>
                  <p className="text-[11px] text-emerald-400/60">Claim any hot meal batch to generate an encrypted handover pass.</p>
                </div>
              ) : (
                claims.map((claim) => (
                  <div
                    key={claim.id}
                    className="rounded-xl border border-emerald-800/60 bg-[#061409] p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-emerald-300 font-bold">{claim.token}</span>
                      <span className="text-[11px] text-emerald-400/70">{claim.claimedAt?.substring(0, 10)}</span>
                    </div>
                    <div className="font-bold text-white text-sm">{claim.title}</div>
                    <div className="flex items-center justify-between text-emerald-200/70 text-[11px]">
                      <span>Source: {claim.sourceName}</span>
                      <span className="font-bold text-emerald-300">{claim.portionsClaimed} Portions</span>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'listings' && (
            <>
              {listings.length === 0 ? (
                <div className="py-10 text-center text-emerald-300/70 space-y-1">
                  <p>No surplus food listings created by your account yet.</p>
                  <p className="text-[11px] text-emerald-400/60">Use the "+ List Surplus Food" button to add batches to the network.</p>
                </div>
              ) : (
                listings.map((l) => (
                  <div
                    key={l.id}
                    className="rounded-xl border border-emerald-800/60 bg-[#061409] p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{l.title}</span>
                      <span className="text-xs font-mono font-bold text-emerald-300">{l.portions} Portions</span>
                    </div>
                    <div className="text-emerald-200/70 text-[11px]">
                      {l.sourceName} · {l.location}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-emerald-400/70 font-mono pt-1 border-t border-emerald-900/60">
                      <span>Contact: {l.contactPerson} ({l.phone})</span>
                      <span>{l.isVegetarian ? 'Pure Veg' : 'Standard'}</span>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'intakes' && (
            <>
              {intakes.length === 0 ? (
                <div className="py-10 text-center text-emerald-300/70 space-y-1">
                  <p>No QR intake scans recorded yet.</p>
                  <p className="text-[11px] text-emerald-400/60">Scan food batches or FMCG cases with the QR intake scanner.</p>
                </div>
              ) : (
                intakes.map((it) => (
                  <div
                    key={it.id}
                    className="rounded-xl border border-emerald-800/60 bg-[#061409] p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-emerald-400 font-bold">{it.manifestId || it.tokenCode}</span>
                      <span className="text-[11px] text-emerald-300 uppercase px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                        {it.status}
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm">{it.title}</div>
                    <div className="text-[11px] text-emerald-200/60">
                      Verified at: {it.verifiedAt}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-emerald-800/60">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Backed by Cloud Firestore security rules</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-emerald-500/25 border border-emerald-300/60"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
