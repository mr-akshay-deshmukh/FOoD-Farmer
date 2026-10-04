import React, { useState } from 'react';
import { FMCGFoodItem } from '../types';
import { ShoppingBag, Search, AlertTriangle, Clock, TrendingDown, ShoppingBasket, Store, CheckCircle } from 'lucide-react';

interface EatInADayMartProps {
  items: FMCGFoodItem[];
  onBuyItem: (id: string, qty: number, buyerName: string) => Promise<any>;
}

export const EatInADayMart: React.FC<EatInADayMartProps> = ({ items, onBuyItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'critical' | 'moderate'>('all');
  const [selectedItem, setSelectedItem] = useState<FMCGFoodItem | null>(null);
  const [orderQty, setOrderQty] = useState(10);
  const [dealerName, setDealerName] = useState('Sri Balaji Kirana & Discount Mart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (urgencyFilter === 'critical') return item.daysToExpiry <= 4;
    if (urgencyFilter === 'moderate') return item.daysToExpiry > 4;
    return true;
  });

  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setIsProcessing(true);
    try {
      await onBuyItem(selectedItem.id, orderQty, dealerName);
      setOrderSuccess(`Order confirmed! ${orderQty} units of ${selectedItem.productName} booked for liquidation delivery.`);
      setSelectedItem(null);
    } catch (err: any) {
      alert(err.message || 'Error processing purchase');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Feature Hero Banner */}
      <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-r from-[#0c1c10] via-[#1d0e1c] to-[#1e2e12] p-6 sm:p-8 shadow-xl shadow-pink-950/30">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-400">
            <TrendingDown className="h-4 w-4 text-pink-400" />
            <span className="bg-pink-500/15 text-pink-300 px-2.5 py-0.5 rounded-md border border-pink-500/30">
              FMCG FOOD LIQUIDATION EXCHANGE · ZERO LANDFILL RECOVERY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center p-1.5 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/40">
              <ShoppingBasket className="h-6 w-6 stroke-[2.2]" />
            </span>
            Eat in a Day Mart
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Fast-moving consumer goods (Maaza, Maggi, dairy milk, biscuits, beverages) approaching best-before dates. Local kirana stores, discount marts, and dealers acquire bulk cartons at <span className="text-pink-400 font-extrabold underline decoration-yellow-400 underline-offset-2">70%–85% liquidation discounts</span>, preventing landfill waste while maximizing fast inventory velocity.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-emerald-900/40 pb-4">
        <div className="flex items-center gap-2 bg-[#0b1b0f] px-3.5 py-2.5 rounded-xl border border-emerald-800/60 flex-1 max-w-md focus-within:border-yellow-400/80">
          <Search className="h-4 w-4 text-yellow-400 shrink-0" />
          <input
            type="text"
            placeholder="Search Maaza, Maggi, Amul milk, biscuits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-emerald-300/50 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#0b1b0f] p-1 rounded-xl border border-emerald-800/50 self-start sm:self-auto">
          {[
            { id: 'all', label: 'All Lots' },
            { id: 'critical', label: 'Urgent (1–4 Days)' },
            { id: 'moderate', label: '5–10 Days Left' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setUrgencyFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                urgencyFilter === tab.id
                  ? 'bg-emerald-600 text-white font-bold border border-emerald-400/60 shadow-xs'
                  : 'text-emerald-200/60 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Success Notification */}
      {orderSuccess && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-950/80 border border-yellow-400/30 p-4 text-xs text-yellow-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-yellow-400 shrink-0" />
            <span>{orderSuccess}</span>
          </div>
          <button onClick={() => setOrderSuccess(null)} className="text-emerald-400 hover:text-white font-bold ml-4 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Grid of FMCG Lots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const isUrgent = item.daysToExpiry <= 4;
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-emerald-800/50 bg-[#0e1f13]/90 p-5 flex flex-col justify-between hover:border-yellow-400/50 hover:shadow-lg hover:shadow-emerald-950/60 transition-all"
            >
              <div className="space-y-3">
                {/* Expiry Header */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-300">{item.brand}</span>
                  <div
                    className={`flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded-full border ${
                      isUrgent
                        ? 'text-pink-300 bg-pink-500/20 border-pink-500/40'
                        : 'text-emerald-300 bg-emerald-400/10 border-emerald-400/30'
                    }`}
                  >
                    <Clock className={`h-3.5 w-3.5 ${isUrgent ? 'text-pink-400' : 'text-emerald-400'}`} />
                    <span>{item.daysToExpiry} Days Left</span>
                  </div>
                </div>

                {/* Product Name */}
                <h3 className="text-base font-bold text-white line-clamp-2">
                  {item.productName}
                </h3>

                {/* Pricing comparison */}
                <div className="rounded-xl bg-[#09140c] p-3.5 border border-emerald-800/60 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-emerald-400/70">Retail MRP:</span>
                    <span className="text-xs text-emerald-200/60 line-through font-mono">₹{item.mrp}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-yellow-300">Rescue Rate:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-black text-white font-mono">₹{item.rescuePrice}</span>
                      <span className="text-xs font-black text-pink-300 bg-pink-500/25 px-2 py-0.5 rounded-md border border-pink-400/50 shadow-xs">
                        {item.discountPercent}% OFF
                      </span>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between text-[11px] text-emerald-200/70 pt-1 border-t border-emerald-900/60">
                    <span>Dealer Resell Margin:</span>
                    <span className="font-mono text-yellow-300 font-bold">+₹{item.mrp - item.rescuePrice} / unit</span>
                  </div>
                </div>

                {/* Batch & Inventory Info */}
                <div className="space-y-1 text-xs text-emerald-200/70">
                  <div className="flex items-center justify-between">
                    <span>Batch Code:</span>
                    <span className="font-mono text-emerald-200">{item.batchCode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Expiry Date:</span>
                    <span className="font-mono text-pink-300 font-semibold">{item.expiryDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Available Stock:</span>
                    <span className="font-mono font-bold text-white">{item.quantityUnits} units/cases</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-300/60 pt-1">
                    <Store className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                    <span className="truncate">{item.sellerMart}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-emerald-900/60">
                <button
                  disabled={item.quantityUnits <= 0}
                  onClick={() => {
                    setSelectedItem(item);
                    setOrderQty(Math.min(item.quantityUnits, 10));
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition-transform hover:scale-[1.02] cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-500/25 border border-emerald-300/70"
                >
                  <ShoppingBag className="h-4 w-4 text-slate-950" />
                  <span>{item.quantityUnits > 0 ? 'Buy Bulk Clearance Lot' : 'Sold Out'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Purchase Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-yellow-500/30 bg-[#0d1e12] p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-emerald-900/60 pb-4">
              <div>
                <span className="text-xs font-bold text-yellow-400">DEALER WHOLESALE CLEARANCE BOOKING</span>
                <h2 className="text-lg font-bold text-white mt-1">Book Eat-in-a-Day Lot</h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-emerald-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl bg-[#09140c] p-4 border border-emerald-800/60 space-y-2 text-xs">
              <p className="font-bold text-yellow-200 text-sm">{selectedItem.productName}</p>
              <div className="flex items-center justify-between text-emerald-200/70">
                <span>Seller: {selectedItem.sellerMart}</span>
                <span className="font-mono text-yellow-300">Expires: {selectedItem.expiryDate}</span>
              </div>
            </div>

            <form onSubmit={handleBuySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-emerald-200 font-medium mb-1">
                  Local Dealer / Mart / Kirana Name
                </label>
                <input
                  type="text"
                  required
                  value={dealerName}
                  onChange={(e) => setDealerName(e.target.value)}
                  className="w-full rounded-xl border border-emerald-800/80 bg-[#071109] px-3.5 py-2 text-white focus:border-yellow-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-emerald-200 font-medium mb-1">
                  Quantity Units (Available: {selectedItem.quantityUnits})
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedItem.quantityUnits}
                  value={orderQty}
                  onChange={(e) => setOrderQty(Number(e.target.value))}
                  className="w-full rounded-xl border border-emerald-800/80 bg-[#071109] px-3.5 py-2 text-white font-mono focus:border-yellow-400 focus:outline-hidden"
                />
              </div>

              <div className="rounded-xl bg-[#09140c] p-3.5 border border-emerald-800/60 space-y-1.5 text-xs">
                <div className="flex justify-between text-emerald-200/70">
                  <span>Unit Rescue Rate:</span>
                  <span className="font-mono text-white">₹{selectedItem.rescuePrice} (MRP ₹{selectedItem.mrp})</span>
                </div>
                <div className="flex justify-between font-bold text-white border-t border-emerald-900/60 pt-1.5">
                  <span>Total Liquidation Cost:</span>
                  <span className="font-mono text-yellow-400 text-sm">₹{orderQty * selectedItem.rescuePrice}</span>
                </div>
                <div className="flex justify-between text-emerald-300 text-[11px]">
                  <span>Your Net Resell Upside:</span>
                  <span className="font-mono text-yellow-300 font-bold">₹{orderQty * (selectedItem.mrp - selectedItem.rescuePrice)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl border border-emerald-800 text-emerald-200 hover:bg-emerald-900/60 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-500/25 border border-emerald-300/60"
                >
                  {isProcessing ? 'Processing Order...' : 'Confirm Bulk Clearance Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
