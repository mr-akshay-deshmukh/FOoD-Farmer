import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OneRupeeOutlet } from './components/OneRupeeOutlet';
import { EatInADayMart } from './components/EatInADayMart';
import { BudgetDeal } from './components/BudgetDeal';
import { ZeroFridgeExchange } from './components/ZeroFridgeExchange';
import { QRCodeScanner } from './components/QRCodeScanner';
import { LogisticsOptimizer } from './components/LogisticsOptimizer';
import { InefficiencyDetector } from './components/InefficiencyDetector';
import { SustainabilityAnalytics } from './components/SustainabilityAnalytics';
import { ProductionPlanner } from './components/ProductionPlanner';
import { ListSurplusModal } from './components/ListSurplusModal';
import { LoginGateway } from './components/LoginGateway';
import { RescueMapsGrounding } from './components/RescueMapsGrounding';
import { UserRescueLedgerModal } from './components/UserRescueLedgerModal';
import { IntegrationCenter } from './components/IntegrationCenter';
import { 
  auth, 
  logOut, 
  saveUserClaimToFirestore, 
  saveUserListingToFirestore, 
  saveUserIntakeToFirestore 
} from './firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  FoodListing,
  FMCGFoodItem,
  BudgetDealItem,
  ZeroFridgeTransfer,
  InefficiencyLog,
  ProductionPlan,
  SustainabilityMetrics,
} from './types';
import { Wheat } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<string>('rupee_outlet');
  const [foodListings, setFoodListings] = useState<FoodListing[]>([]);
  const [fmcgFoodItems, setFmcgFoodItems] = useState<FMCGFoodItem[]>([]);
  const [budgetDealItems, setBudgetDealItems] = useState<BudgetDealItem[]>([]);
  const [zeroFridgeTransfers, setZeroFridgeTransfers] = useState<ZeroFridgeTransfer[]>([]);
  const [inefficiencyLogs, setInefficiencyLogs] = useState<InefficiencyLog[]>([]);
  const [productionPlans, setProductionPlans] = useState<ProductionPlan[]>([]);
  const [dispatchQueue, setDispatchQueue] = useState<any[]>([]);
  const [sustainabilityMetrics, setSustainabilityMetrics] = useState<SustainabilityMetrics>({
    totalFoodSavedKg: 18450,
    mealsProvidedToNeedy: 36900,
    co2PreventedKg: 38745,
    waterConservedM3: 94200,
    landfillDiversionPercent: 94.2,
    financialLossAvoidedRs: 2480000,
    registeredOutletsCount: 142,
    registeredNgosCount: 68,
    activeBadgesIssued: 84,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);

  // Monitor Google Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  // Initial fetch
  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        if (data.foodListings) setFoodListings(data.foodListings);
        if (data.fmcgFoodItems) setFmcgFoodItems(data.fmcgFoodItems);
        if (data.budgetDealItems) setBudgetDealItems(data.budgetDealItems);
        if (data.zeroFridgeTransfers) setZeroFridgeTransfers(data.zeroFridgeTransfers);
        if (data.inefficiencyLogs) setInefficiencyLogs(data.inefficiencyLogs);
        if (data.productionPlans) setProductionPlans(data.productionPlans);
        if (data.dispatchQueue) setDispatchQueue(data.dispatchQueue);
        if (data.sustainabilityMetrics) setSustainabilityMetrics(data.sustainabilityMetrics);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Data load error:', err);
        setIsLoading(false);
      });
  }, []);

  // Claim ₹1 Outlet batch and sync to Firestore
  const handleClaimListing = async (listingId: string, ngoName: string, portions: number) => {
    const res = await fetch('/api/claim-one-rupee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId, ngoName, portionsRequested: portions }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to claim listing');

    setFoodListings((prev) =>
      prev.map((item) => (item.id === listingId ? data.listing : item))
    );
    if (data.sustainabilityMetrics) {
      setSustainabilityMetrics(data.sustainabilityMetrics);
    }

    // Persist claim in user's Firestore ledger
    if (currentUser) {
      try {
        await saveUserClaimToFirestore(currentUser.uid, {
          id: data.token || `CLAIM-${Date.now()}`,
          listingId,
          title: data.listing?.title || 'Surplus Cooked Batch',
          sourceName: data.listing?.sourceName || ngoName,
          portionsClaimed: portions,
          token: data.token || 'VERIFIED-TOKEN',
          status: 'confirmed',
        });
      } catch (e) {
        console.warn('Could not persist claim to Firestore:', e);
      }
    }

    return data;
  };

  // Buy Eat in a Day or Budget Deal Item
  const handleBuyDeal = async (type: 'fmcg' | 'budget', id: string, qty: number, buyerName: string) => {
    const res = await fetch('/api/buy-deal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id, quantity: qty, buyerName }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to purchase deal');

    if (type === 'fmcg') {
      setFmcgFoodItems((prev) =>
        prev.map((item) => (item.id === id ? data.item : item))
      );
    } else {
      setBudgetDealItems((prev) =>
        prev.map((item) => (item.id === id ? data.item : item))
      );
    }
    return data;
  };

  // Request Zero Fridge Cold Storage Emergency Transfer
  const handleRequestTransfer = async (transferData: any) => {
    const res = await fetch('/api/zero-fridge/request-transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transferData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to request cold transfer');

    setZeroFridgeTransfers((prev) => [data.transfer, ...prev]);
    return data;
  };

  const handleListingCreated = async (newListing: FoodListing) => {
    setFoodListings((prev) => [newListing, ...prev]);

    // Persist listing to user's Firestore ledger
    if (currentUser) {
      try {
        await saveUserListingToFirestore(currentUser.uid, {
          id: newListing.id,
          sourceName: newListing.sourceName,
          title: newListing.title,
          portions: newListing.portions,
          location: newListing.location,
          contactPerson: newListing.contactPerson,
          phone: newListing.phone,
          isVegetarian: newListing.isVegetarian,
        });
      } catch (e) {
        console.warn('Could not persist listing to Firestore:', e);
      }
    }
  };

  // Persist verified intake to user's Firestore ledger
  const handleIntakeSuccess = async (record: any) => {
    if (currentUser && record) {
      try {
        await saveUserIntakeToFirestore(currentUser.uid, {
          id: record.id || `INTAKE-${Date.now()}`,
          tokenCode: record.tokenCode || 'CODE',
          title: record.title || 'Intake Lot',
          manifestId: record.manifestId || 'MANIFEST-VERIFIED',
          status: record.status || 'intake_verified',
        });
      } catch (e) {
        console.warn('Could not persist intake to Firestore:', e);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setCurrentUser(null);
  };

  // 1. Initial Auth Checking State
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#071309] text-emerald-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-emerald-400 to-yellow-400 p-0.5 animate-pulse shadow-lg shadow-emerald-500/30">
            <div className="h-full w-full rounded-[14px] bg-[#071309] flex items-center justify-center">
              <Wheat className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-300 font-medium">
            <div className="h-4 w-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            <span>Verifying Google authentication status...</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Gatekeeper: Not authenticated -> Require Google Login to enter software
  if (!currentUser) {
    return (
      <LoginGateway
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    );
  }

  // 3. Authenticated Google User -> Enter Software Platform
  return (
    <div className="min-h-screen bg-[#09130b] text-emerald-50 flex flex-col font-sans">
      {/* Universal Top Bar with User Profile and Logout */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenListModal={() => setIsListModalOpen(true)}
        onOpenLedgerModal={() => setIsLedgerModalOpen(true)}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Quick Live System Telemetry Strip with Pink, Yellow & Green styling */}
      <div className="no-print border-b border-emerald-950/80 bg-gradient-to-r from-[#0c180e] via-[#12130e] to-[#140f12] px-4 py-2">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-[11px] text-emerald-200/80">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400"></span>
              FOOD FARMER Grid Active
            </span>
            <span aria-hidden="true" className="text-emerald-800">·</span>
            <span>
              ₹1 Surplus Batches: <strong className="text-yellow-300 font-mono">{foodListings.filter(f => f.status === 'available').length}</strong>
            </span>
            <span aria-hidden="true" className="text-emerald-800">·</span>
            <span>
              Near-Expiry Lots: <strong className="text-pink-400 font-mono font-bold">{fmcgFoodItems.filter(f => f.status === 'available').length}</strong>
            </span>
            <span aria-hidden="true" className="text-emerald-800">·</span>
            <span>
              Zero-Fridge Cold Balance: <strong className="text-emerald-300 font-mono">{zeroFridgeTransfers.length}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-emerald-200/90">
            <span>Saved: <strong className="text-yellow-300">{sustainabilityMetrics.totalFoodSavedKg.toLocaleString()} kg</strong></span>
            <span aria-hidden="true" className="text-emerald-800">·</span>
            <span>CO₂e Avoided: <strong className="text-emerald-400">{sustainabilityMetrics.co2PreventedKg.toLocaleString()} kg</strong></span>
            <span aria-hidden="true" className="text-emerald-800">·</span>
            <span>Discounts: <strong className="text-pink-400">Up to 85% OFF</strong></span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-emerald-300">
              <div className="h-4 w-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"></div>
              <span>Connecting to <strong className="text-emerald-400 font-bold">FOOD FARMER</strong> Rescue Network...</span>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'rupee_outlet' && (
              <OneRupeeOutlet
                listings={foodListings}
                onClaimListing={handleClaimListing}
                onOpenListModal={() => setIsListModalOpen(true)}
              />
            )}

            {activeTab === 'eat_in_day' && (
              <EatInADayMart
                items={fmcgFoodItems}
                onBuyItem={(id, qty, buyer) => handleBuyDeal('fmcg', id, qty, buyer)}
              />
            )}

            {activeTab === 'budget_deal' && (
              <BudgetDeal
                items={budgetDealItems}
                onBuyItem={(id, qty, buyer) => handleBuyDeal('budget', id, qty, buyer)}
              />
            )}

            {activeTab === 'zero_fridge' && (
              <ZeroFridgeExchange
                transfers={zeroFridgeTransfers}
                onRequestTransfer={handleRequestTransfer}
              />
            )}

            {activeTab === 'maps_grounding' && (
              <RescueMapsGrounding
                onSelectDestination={(hub) => {
                  setActiveTab('logistics');
                }}
              />
            )}

            {activeTab === 'qr_scanner' && (
              <QRCodeScanner onIntakeSuccess={handleIntakeSuccess} />
            )}

            {activeTab === 'logistics' && (
              <LogisticsOptimizer dispatchQueue={dispatchQueue} />
            )}

            {activeTab === 'inefficiency' && (
              <InefficiencyDetector logs={inefficiencyLogs} />
            )}

            {activeTab === 'sustainability' && (
              <SustainabilityAnalytics metrics={sustainabilityMetrics} />
            )}

            {activeTab === 'production' && (
              <ProductionPlanner />
            )}

            {activeTab === 'integrations' && (
              <IntegrationCenter
                onListingCreated={(newListing) => {
                  setFoodListings((prev) => [newListing, ...prev]);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Modal for listing surplus */}
      <ListSurplusModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onListingCreated={handleListingCreated}
      />

      {/* Live Firestore User Rescue Ledger Modal */}
      <UserRescueLedgerModal
        isOpen={isLedgerModalOpen}
        onClose={() => setIsLedgerModalOpen(false)}
        currentUser={currentUser}
      />

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-emerald-950 bg-[#061208] py-6 text-xs text-emerald-300/70">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-black text-emerald-400 text-sm tracking-wide">FOOD FARMER</span>
            <span className="text-emerald-700">|</span>
            <span className="text-emerald-200/80">Zero Food Wastage & Perishable Inventory Liquidation Platform</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-400/80 font-mono text-[11px]">
            <span>FSSAI Safe Food Handover Standard</span>
            <span aria-hidden="true" className="text-emerald-800">·</span>
            <span className="text-yellow-400/90 font-bold">UN SDG 2 & 12 Oriented</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
