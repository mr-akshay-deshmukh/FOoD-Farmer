import React, { useState } from 'react';
import { FoodListing } from '../types';

interface ListSurplusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingCreated: (newListing: FoodListing) => void;
}

export const ListSurplusModal: React.FC<ListSurplusModalProps> = ({
  isOpen,
  onClose,
  onListingCreated,
}) => {
  const [sourceType, setSourceType] = useState<'kitchen' | 'function_hall' | 'food_bank' | 'caterer'>('function_hall');
  const [sourceName, setSourceName] = useState('');
  const [title, setTitle] = useState('');
  const [portions, setPortions] = useState(100);
  const [location, setLocation] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/listings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceType,
          sourceName,
          title,
          portions,
          location,
          contactPerson,
          phone,
          isVegetarian,
        }),
      });
      const data = await res.json();
      if (data.success && data.listing) {
        onListingCreated(data.listing);
        onClose();
      }
    } catch (err: any) {
      alert('Error creating listing: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-pink-500/30 bg-[#09150b] p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between border-b border-emerald-800/60 pb-4">
          <div>
            <span className="text-xs font-bold text-pink-300 uppercase tracking-wider bg-pink-500/15 px-2 py-0.5 rounded-md border border-pink-500/30">
              SURPLUS RESCUE NETWORK
            </span>
            <h2 className="text-lg font-bold text-white mt-1">List Surplus Food for 1 Outlet</h2>
          </div>
          <button onClick={onClose} className="text-emerald-300 hover:text-white text-lg font-bold cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-emerald-200/80 font-semibold mb-1">Source Facility Type</label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as any)}
                className="w-full rounded-xl border border-emerald-800/70 bg-[#061208] px-3.5 py-2 text-white focus:outline-hidden focus:border-yellow-400"
              >
                <option value="function_hall">Function Hall / Banquet</option>
                <option value="kitchen">Institutional Kitchen</option>
                <option value="caterer">Catering Service</option>
                <option value="food_bank">Food Bank / NGO Kitchen</option>
              </select>
            </div>

            <div>
              <label className="block text-emerald-200/80 font-semibold mb-1">Total Portions</label>
              <input
                type="number"
                min="10"
                required
                value={portions}
                onChange={(e) => setPortions(Number(e.target.value))}
                className="w-full rounded-xl border border-emerald-800/70 bg-[#061208] px-3.5 py-2 text-yellow-400 font-bold font-mono focus:outline-hidden focus:border-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-emerald-200/80 font-semibold mb-1">Hall / Kitchen Name</label>
            <input
              type="text"
              required
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="e.g. Royal Palace Banquet Hall"
              className="w-full rounded-xl border border-emerald-800/70 bg-[#061208] px-3.5 py-2 text-white focus:outline-hidden focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-emerald-200/80 font-semibold mb-1">Food Description / Dishes</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Pulao, Paneer Masala, Rotis, Dal"
              className="w-full rounded-xl border border-emerald-800/70 bg-[#061208] px-3.5 py-2 text-white focus:outline-hidden focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-emerald-200/80 font-semibold mb-1">Pickup Location Address</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Outer Ring Road, Mahadevapura, Bengaluru"
              className="w-full rounded-xl border border-emerald-800/70 bg-[#061208] px-3.5 py-2 text-white focus:outline-hidden focus:border-yellow-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-emerald-200/80 font-semibold mb-1">Contact Person</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Kitchen Supervisor Name"
                className="w-full rounded-xl border border-emerald-800/70 bg-[#061208] px-3.5 py-2 text-white focus:outline-hidden focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-emerald-200/80 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98XXX XXXXX"
                className="w-full rounded-xl border border-emerald-800/70 bg-[#061208] px-3.5 py-2 text-white focus:outline-hidden focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="vegCheck"
              checked={isVegetarian}
              onChange={(e) => setIsVegetarian(e.target.checked)}
              className="rounded border-emerald-800 bg-[#061208] text-yellow-400 focus:ring-0"
            />
            <label htmlFor="vegCheck" className="text-emerald-200 font-medium cursor-pointer">
              100% Pure Vegetarian Preparation
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-emerald-800 text-emerald-300 hover:bg-emerald-900/40 cursor-pointer font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black cursor-pointer shadow-md shadow-emerald-500/25 disabled:opacity-50 border border-emerald-300/60"
            >
              {isSubmitting ? 'Publishing...' : 'Publish to 1 Outlet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
