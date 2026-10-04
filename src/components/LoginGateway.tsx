import React, { useState } from 'react';
import { 
  Wheat, 
  ShieldCheck, 
  IndianRupee, 
  ShoppingBasket, 
  Refrigerator, 
  QrCode, 
  Sparkles, 
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { signInWithGoogle } from '../firebase';
import type { User } from 'firebase/auth';

interface LoginGatewayProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({ 
  onLoginSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      onLoginSuccess(user);
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completion. Please try again.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('Sign-in was cancelled. Please click the button to try again.');
      } else {
        setError(err.message || 'Failed to authenticate with Google. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071309] text-emerald-50 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient glowing orbs with pink, yellow, and green */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Card */}
        <div className="rounded-3xl border border-emerald-500/30 bg-[#0a1a0d]/90 p-8 shadow-2xl shadow-black/80 backdrop-blur-xl">
          {/* Header & Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-pink-500 via-emerald-400 to-yellow-400 p-1 shadow-xl shadow-emerald-500/25 mb-4">
              <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-[#071309] border border-emerald-400/40">
                <Wheat className="h-8 w-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-1">
              <h1 className="text-3xl font-black tracking-tight text-emerald-400 drop-shadow-[0_0_16px_rgba(52,211,153,0.45)]">
                FOOD FARMER
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-pink-500/20 text-pink-300 border border-pink-500/40">
                Zero Leftover
              </span>
            </div>
            
            <p className="text-xs font-semibold text-emerald-300/80 tracking-wide mt-1">
              Food Wastage Limitation & Inventory Rescue Platform
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
              <span>Enter Portal Authorization</span>
            </div>
          </div>

          {/* Value Prop Highlights */}
          <div className="space-y-2.5 mb-8 bg-emerald-950/40 rounded-2xl p-4 border border-emerald-900/60">
            <div className="flex items-center gap-3 text-xs text-emerald-200">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-yellow-400/20 text-yellow-400">
                <IndianRupee className="h-3.5 w-3.5" />
              </div>
              <span><strong>1 Outlet:</strong> Surplus cooked food for needy NGOs</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-emerald-200">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-pink-500/20 text-pink-400">
                <ShoppingBasket className="h-3.5 w-3.5" />
              </div>
              <span><strong>Eat in a Day Mart:</strong> Perishables at up to 85% discount</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-emerald-200">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-400/20 text-emerald-400">
                <Refrigerator className="h-3.5 w-3.5" />
              </div>
              <span><strong>Zero Fridge Exchange:</strong> Dynamic cold room sharing</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-emerald-200">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-pink-400/20 text-pink-300">
                <QrCode className="h-3.5 w-3.5" />
              </div>
              <span><strong>QR Intake Verification:</strong> Camera barcode scanner</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-950/40 p-3.5 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <div>
                <p className="font-bold text-red-300">Sign-in Encountered an Issue</p>
                <p className="mt-0.5 text-red-200/90">{error}</p>
              </div>
            </div>
          )}

          {/* Primary Google Login Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black px-5 py-3.5 text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group border border-emerald-300/80"
          >
            {loading ? (
              <div className="flex items-center gap-2 text-slate-950 font-bold">
                <div className="h-4 w-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                <span>Authenticating with Google...</span>
              </div>
            ) : (
              <>
                {/* Official Google 'G' SVG Logo with white circle backdrop */}
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-xs shrink-0">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <span className="font-black tracking-tight text-slate-950">Sign in with Google to enter</span>
                <ArrowRight className="h-4 w-4 ml-1 text-slate-950 group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
              </>
            )}
          </button>

          {/* Trust Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-emerald-400/60 font-mono">
            <Lock className="h-3 w-3 text-emerald-400" />
            <span>Encrypted Firebase OAuth2 Authentication</span>
          </div>
        </div>

        {/* Bottom microcopy */}
        <p className="mt-6 text-center text-xs text-emerald-500/70">
          FOOD FARMER · Unified Food Rescue & Circular Waste Network
        </p>
      </div>
    </div>
  );
};
