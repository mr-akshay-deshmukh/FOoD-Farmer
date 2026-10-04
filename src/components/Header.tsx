import React from 'react';
import { 
  PlusCircle, 
  Wheat, 
  Coins, 
  IndianRupee,
  ShoppingBasket, 
  Boxes, 
  Refrigerator, 
  Truck, 
  PackageX, 
  Award, 
  ChefHat,
  QrCode,
  LogOut,
  LogIn,
  User as UserIcon,
  MapPin,
  Database,
  Network
} from 'lucide-react';
import type { User } from 'firebase/auth';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenListModal: () => void;
  onOpenLedgerModal?: () => void;
  currentUser: User | null;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenListModal,
  onOpenLedgerModal,
  currentUser,
  onSignOut,
}) => {
  const navItems = [
    { 
      id: 'rupee_outlet', 
      label: '1 Outlet', 
      sub: 'Cooked Surplus', 
      icon: IndianRupee 
    },
    { 
      id: 'eat_in_day', 
      label: 'Eat in a Day Mart', 
      sub: 'Perishable Food FMCG', 
      icon: ShoppingBasket 
    },
    { 
      id: 'budget_deal', 
      label: 'Budget Deals', 
      sub: 'Near-Expiry Non-Food', 
      icon: Boxes 
    },
    { 
      id: 'zero_fridge', 
      label: 'Zero Fridge', 
      sub: 'Cold Storage Exchange', 
      icon: Refrigerator 
    },
    { 
      id: 'maps_grounding', 
      label: 'Rescue Maps', 
      sub: 'Google Maps Grounding', 
      icon: MapPin 
    },
    { 
      id: 'qr_scanner', 
      label: 'QR Intake Scanner', 
      sub: 'Scan & Verify Intake', 
      icon: QrCode 
    },
    { 
      id: 'logistics', 
      label: 'AI Logistics', 
      sub: 'Smart Route Dispatch', 
      icon: Truck 
    },
    { 
      id: 'inefficiency', 
      label: 'Zero Inventory', 
      sub: 'Machine & Pantry Loss', 
      icon: PackageX 
    },
    { 
      id: 'sustainability', 
      label: 'ESG Badges', 
      sub: 'Impact & Certificates', 
      icon: Award 
    },
    { 
      id: 'production', 
      label: 'Kitchen Planning', 
      sub: 'Portion & BOM Yield', 
      icon: ChefHat 
    },
    { 
      id: 'integrations', 
      label: 'Integrations', 
      sub: 'APIs, Webhooks & ERP', 
      icon: Network 
    },
  ];

  return (
    <header className="no-print sticky top-0 z-40 w-full border-b border-emerald-900/60 bg-[#08150a]/95 backdrop-blur-md shadow-lg shadow-black/40">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Software Title in Vibrant Green with Pink and Yellow Accents */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('rupee_outlet')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            {/* Unique Food & Harvest Emblem with Green, Pink, and Yellow */}
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 via-emerald-400 to-yellow-400 p-0.5 shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#071309] border border-emerald-400/40">
                <Wheat className="h-6 w-6 text-emerald-400 group-hover:text-yellow-300 transition-colors" />
              </div>
            </div>

            <div>
              {/* Software title in Green with Pink badge and Green subtitle */}
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-2xl text-emerald-400 group-hover:text-emerald-300 transition-colors drop-shadow-[0_0_14px_rgba(52,211,153,0.45)]">
                  FOOD FARMER
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-xs">
                  Zero Leftover
                </span>
              </div>
              <p className="hidden sm:block text-[11px] font-medium text-emerald-300/90 -mt-0.5 tracking-wide">
                Food Wastage Limitation & Inventory Rescue Platform
              </p>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links with Green palette */}
        <nav className="hidden 2xl:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800/80 text-emerald-100 font-bold shadow-md shadow-emerald-950 border border-emerald-400/70 ring-1 ring-emerald-400/40'
                    : 'text-emerald-100/80 hover:text-emerald-200 hover:bg-emerald-900/40'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-emerald-300' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: CTA Buttons with Quick Scan, List Surplus & Google Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setActiveTab('qr_scanner')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'qr_scanner'
                ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 font-black shadow-lg shadow-emerald-500/30'
                : 'border border-emerald-500/50 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 hover:text-white'
            }`}
          >
            <QrCode className="h-4 w-4" />
            <span className="hidden sm:inline">Scan QR Intake</span>
            <span className="sm:hidden">Scan</span>
          </button>

          <button
            onClick={onOpenListModal}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 px-3.5 py-2 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap cursor-pointer border border-emerald-300/80"
          >
            <PlusCircle className="h-4 w-4 text-slate-950 stroke-[2.5]" />
            <span className="hidden md:inline">List Surplus Food</span>
            <span className="md:hidden">List</span>
          </button>

          {/* Google User Profile or Sign In Button */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-emerald-800/60">
              <div className="flex items-center gap-2" title={`Signed in as ${currentUser.displayName || currentUser.email}`}>
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Google User'}
                    className="h-8 w-8 rounded-full border border-emerald-400/60 object-cover shadow-sm ring-1 ring-yellow-400/40"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-pink-500 to-emerald-400 flex items-center justify-center font-bold text-xs text-slate-950 ring-1 ring-yellow-400">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs font-bold text-emerald-200 truncate max-w-[120px]">
                    {currentUser.displayName || 'Authorized User'}
                  </span>
                  <span className="text-[10px] text-emerald-400/80 font-mono truncate max-w-[120px]">
                    {currentUser.email}
                  </span>
                </div>
              </div>

              {onOpenLedgerModal && (
                <button
                  onClick={onOpenLedgerModal}
                  title="View your real-time Firestore rescue ledger"
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/50 bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 hover:text-white px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-xs hover:border-emerald-400"
                >
                  <Database className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="hidden lg:inline">Cloud Ledger</span>
                </button>
              )}

              <button
                onClick={onSignOut}
                title="Log out of Google"
                className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/50 hover:bg-emerald-800/60 text-emerald-300 hover:text-white px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-xs hover:border-emerald-400"
              >
                <LogOut className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Secondary Navigation Scroll for screens below 2XL */}
      <div className="flex 2xl:hidden overflow-x-auto border-t border-emerald-900/60 bg-[#061208] px-3 py-2 gap-1.5 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                isActive
                  ? 'bg-emerald-800 text-emerald-100 font-bold border border-emerald-400/60 shadow-xs'
                  : 'text-emerald-200/70 hover:text-white bg-emerald-950/40'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-emerald-300' : 'text-emerald-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
