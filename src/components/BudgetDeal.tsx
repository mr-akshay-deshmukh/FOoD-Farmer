import React, { useState } from 'react';
import { BudgetDealItem } from '../types';
import { Tag, Sparkles, ShieldAlert, CheckCircle, Package } from 'lucide-react';

interface BudgetDealProps {
  items: BudgetDealItem[];
  onBuyItem: (id: string, qty: number, buyerName: string) => Promise<any>;
}

export const BudgetDeal: React.FC<BudgetDealProps> = ({ items, onBuyItem }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<BudgetDealItem | null>(null);
  const [orderQty, setOrderQty] = useState<number>(10);
  const [buyerName, setBuyerName] = useState('Urban Glow Beauty Salon & Retail');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filtered = items.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setIsProcessing(true);
    try {
      await onBuyItem(selectedItem.id, orderQty, buyerName);
      setSuccessMsg(`Budget Deal secured: ${orderQty} units of ${selectedItem.productName} dispatched for delivery.`);
      setSelectedItem(null);
    } catch (err: any) {
      alert(err.message || 'Error processing purchase');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-r from-[#0c1c10] via-[#1d0e1c] to-[#1a2d13] p-6 sm:p-8 shadow-xl shadow-pink-950/30">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-400">
            <Tag className="h-4 w-4 text-pink-400" />
            <span className="bg-pink-500/15 text-pink-300 px-2.5 py-0.5 rounded-md border border-pink-500/30">
              NON-FOOD FMCG INVENTORY RESCUE · CIRCULAR RETAIL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Budget Deal
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Cosmetics, skincare lotions, waterproof eyeliners, shampoos, and household hygiene inventory near shelf-life clearance or packaging redesign. Secondary dealers, neighborhood marts, and beauty salons acquire pristine warehouse stock at wholesale liquidation rates.
          </p>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-900/40 pb-4">
        <div className="flex items-center gap-1 bg-[#0b1b0f] p-1 rounded-xl border border-emerald-800/50">
          {[
            { id: 'all', label: 'All Non-Food FMCG' },
            { id: 'cosmetics', label: 'Cosmetics & Eyeliner' },
            { id: 'skincare', label: 'Lotions & Creams' },
            { id: 'personal_care', label: 'Shampoos & Haircare' },
            { id: 'cleaning', label: 'Hygiene & Cleaners' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white font-bold border border-emerald-400/60 shadow-xs'
                  : 'text-emerald-200/60 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-emerald-300/80">
          Available Wholesale Lots: <span className="font-mono text-yellow-300 font-bold">{filtered.length}</span>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-950/80 border border-yellow-400/30 p-4 text-xs text-yellow-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-yellow-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white font-bold ml-4 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Grid of Budget Deals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-emerald-800/50 bg-[#0e1f13]/90 p-5 flex flex-col justify-between hover:border-yellow-400/50 hover:shadow-lg hover:shadow-emerald-950/60 transition-all"
          >
            <div className="space-y-3">
              {/* Category & Condition */}
              <div className="flex items-center justify-between text-xs text-emerald-300/80">
                <span className="font-bold text-pink-300 uppercase tracking-wider text-[10px] bg-pink-500/20 px-2 py-0.5 rounded border border-pink-500/40">
                  {item.category.replace('_', ' ')}
                </span>
                <span className="text-emerald-300 font-mono text-[11px]">{item.condition}</span>
              </div>

              {/* Product */}
              <div>
                <span className="text-xs font-bold text-emerald-400">{item.brand}</span>
                <h3 className="text-base font-bold text-white mt-0.5 line-clamp-2">
                  {item.productName}
                </h3>
              </div>

              {/* Shelf-Life Remaining */}
              <div className="text-xs text-emerald-200/80 flex items-center gap-1.5 font-mono">
                <ShieldAlert className="h-3.5 w-3.5 text-pink-400 shrink-0" />
                <span>{item.shelfLifeRemaining}</span>
              </div>

              {/* Pricing Grid */}
              <div className="rounded-xl bg-[#09140c] p-3.5 border border-emerald-800/60 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-emerald-400/70">Retail MRP:</span>
                  <span className="text-xs text-emerald-200/60 line-through font-mono">₹{item.mrp}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-yellow-300">Budget Clearance:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-black text-white font-mono">₹{item.rescuePrice}</span>
                    <span className="text-xs font-black text-pink-300 bg-pink-500/25 px-2 py-0.5 rounded-md border border-pink-400/50 shadow-xs">
                      {item.discountPercent}% OFF
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline justify-between text-[11px] text-emerald-200/70 pt-1 border-t border-emerald-900/60">
                  <span>Gross Resell Margin:</span>
                  <span className="font-mono text-yellow-300 font-bold">+₹{item.mrp - item.rescuePrice} / unit</span>
                </div>
              </div>

              {/* Warehouse info */}
              <div className="space-y-1 text-xs text-emerald-200/70">
                <div className="flex items-center justify-between">
                  <span>Batch Code:</span>
                  <span className="font-mono text-emerald-200">{item.batchCode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Lot Quantity:</span>
                  <span className="font-mono font-bold text-white">{item.quantityUnits} Units</span>
                </div>
                <div className="text-[11px] text-emerald-300/60 truncate pt-1">
                  Warehouse: {item.sellerName} ({item.sellerLocation})
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="mt-5 pt-3 border-t border-emerald-900/60">
              <button
                disabled={item.quantityUnits <= 0}
                onClick={() => {
                  setSelectedItem(item);
                  setOrderQty(Math.min(item.quantityUnits, 10));
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition-transform hover:scale-[1.02] cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-500/25 border border-emerald-300/70"
              >
                <Package className="h-4 w-4 text-slate-950" />
                <span>{item.quantityUnits > 0 ? 'Claim Wholesale Lot' : 'Sold Out'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Purchase Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-yellow-500/30 bg-[#0d1e12] p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-emerald-900/60 pb-4">
              <div>
                <span className="text-xs font-bold text-yellow-400">NON-FOOD CLEARANCE INVENTORY</span>
                <h2 className="text-lg font-bold text-white mt-1">Book Budget Deal Batch</h2>
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
                <span>Warehouse: {selectedItem.sellerName}</span>
                <span className="font-mono text-emerald-200">Condition: {selectedItem.condition}</span>
              </div>
            </div>

            <form onSubmit={handleBuySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-emerald-200 font-medium mb-1">
                  Purchaser / Mart / Salon / Store Name
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
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
                  <span>Clearance Unit Rate:</span>
                  <span className="font-mono text-white">₹{selectedItem.rescuePrice} (MRP ₹{selectedItem.mrp})</span>
                </div>
                <div className="flex justify-between font-bold text-white border-t border-emerald-900/60 pt-1.5">
                  <span>Total Purchase Cost:</span>
                  <span className="font-mono text-yellow-400 text-sm">₹{orderQty * selectedItem.rescuePrice}</span>
                </div>
                <div className="flex justify-between text-emerald-300 text-[11px]">
                  <span>Your Profit Spread:</span>
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
                  {isProcessing ? 'Processing Order...' : 'Confirm Wholesale Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
