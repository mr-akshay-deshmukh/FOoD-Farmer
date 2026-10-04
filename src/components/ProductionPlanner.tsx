import React, { useState } from 'react';
import { ChefHat, Calendar, Users, CloudRain, Calculator, ShieldCheck, Sparkles, TrendingDown } from 'lucide-react';

export const ProductionPlanner: React.FC = () => {
  const [eventType, setEventType] = useState('Corporate Annual Buffet & Dining');
  const [headcount, setHeadcount] = useState(450);
  const [eventDate, setEventDate] = useState('2026-10-02');
  const [weatherCondition, setWeatherCondition] = useState('Moderate Rain (Historical 14% WFH Turnout Drop)');
  const [dietarySplit, setDietarySplit] = useState('65% Veg, 35% Non-Veg');
  const [isGenerating, setIsGenerating] = useState(false);
  const [forecast, setForecast] = useState<any | null>(null);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/production-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          bookedHeadcount: headcount,
          eventDate,
          weatherCondition,
          dietarySplit,
        }),
      });
      const data = await res.json();
      if (data.success && data.forecast) {
        setForecast(data.forecast);
      }
    } catch (err: any) {
      alert('Error generating forecast: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentForecast = forecast || {
    optimizedPortions: 388,
    portionReductionVsUnplanned: 62,
    wasteAvoidedKg: 28,
    costSavingsRs: 11470,
    menuBOM: [
      {
        dishName: 'Royal Saffron Basmati Pulao',
        portionSizeGrams: 160,
        totalPreparedKg: 62.0,
        safetyBufferPortions: 15,
        primaryIngredients: 'Aged Basmati, Whole Spices, Ghee, Caramelized Onions',
      },
      {
        dishName: 'Paneer Butter Masala (Malai Cottage Cheese)',
        portionSizeGrams: 140,
        totalPreparedKg: 54.3,
        safetyBufferPortions: 12,
        primaryIngredients: 'Fresh Malai Paneer, Cashew Paste, Tomato Coulis',
      },
      {
        dishName: 'Dal Makhani Slow Simmered',
        portionSizeGrams: 120,
        totalPreparedKg: 46.5,
        safetyBufferPortions: 15,
        primaryIngredients: 'Black Urad Dal, Farm Butter, Cream',
      },
      {
        dishName: 'Artisan Breads (Roti & Naan)',
        portionSizeGrams: 90,
        totalPreparedKg: 35.0,
        safetyBufferPortions: 20,
        primaryIngredients: 'Whole Wheat Atta & Sharbati Flour',
      },
    ],
    batchCookingSchedule: [
      {
        timeSlot: 'T-Minus 3 Hours (10:00 AM)',
        activity: 'Base gravy and parboiled rice prep for 70% of base capacity (270 portions).',
        justInTimeBuffer: 'Zero risk lock-in.',
      },
      {
        timeSlot: 'T-Minus 45 Mins (12:15 PM)',
        activity: 'Verify live hall gate check-in count via FOOD FARMER IoT entrance monitor.',
        justInTimeBuffer: 'Adjust final batch simmering.',
      },
      {
        timeSlot: 'Service Hour (01:15 PM)',
        activity: 'Flash-cook remaining 20% flatbreads only as chafing dishes dip below 25%.',
        justInTimeBuffer: 'Cook-to-demand prevents buffet post-service surplus.',
      },
    ],
    chefTips: [
      'Employ shallow 2.5-inch hotel pan inserts rather than deep 4-inch chafing trays to minimize hot-holding crusting.',
      'Keep raw paneer chilled in whey liquid until dish integration to prevent moisture leaching and spoilage.',
      'Any untouched sealed backup cambros are pre-designated for 1 NGO Outlet pickup at 03:30 PM.',
    ],
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-r from-[#0c1c10] via-[#1d0e1c] to-[#1c2e12] p-6 sm:p-8 shadow-xl shadow-pink-950/30">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-400">
            <ChefHat className="h-4 w-4 text-pink-400" />
            <span className="bg-pink-500/15 text-pink-300 px-2.5 py-0.5 rounded-md border border-pink-500/30">
              INSTITUTIONAL KITCHEN DEMAND FORECASTING & BOM YIELD CALCULATOR
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Smart Production Planning
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Eliminates food surplus before raw ingredients hit the stove. Predicts accurate guest attendance using weather attrition models and calculates exact recipe ingredient yields down to grams for corporate dining, college canteens, and banquet caterers.
          </p>
        </div>
      </div>

      {/* Input Parameters Configurator */}
      <div className="rounded-2xl border border-emerald-800/50 bg-[#0a180e] p-6 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-emerald-200/80 font-semibold mb-1">Service / Event Type</label>
            <input
              type="text"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full rounded-xl border border-emerald-800/70 bg-[#061208] px-3.5 py-2 text-white focus:outline-hidden focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-emerald-200/80 font-semibold mb-1">Gross RSVP / Booked Headcount</label>
            <input
              type="number"
              value={headcount}
              onChange={(e) => setHeadcount(Number(e.target.value))}
              className="w-full rounded-xl border border-emerald-800/70 bg-[#061208] px-3.5 py-2 text-yellow-400 font-bold font-mono focus:outline-hidden focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-emerald-200/80 font-semibold mb-1">Weather & Attendance Drift</label>
            <select
              value={weatherCondition}
              onChange={(e) => setWeatherCondition(e.target.value)}
              className="w-full rounded-xl border border-emerald-800/70 bg-[#061208] px-3.5 py-2 text-white focus:outline-hidden focus:border-yellow-400"
            >
              <option value="Moderate Rain (Historical 14% WFH Turnout Drop)">Moderate Rain (14% Attrition)</option>
              <option value="Severe Downpour / Storm (24% Attrition)">Severe Downpour (24% Attrition)</option>
              <option value="Clear Skies / Friday Social (+4% Buffer)">Clear Skies / Friday Social</option>
            </select>
          </div>

          <div>
            <label className="block text-emerald-200/80 font-semibold mb-1">Dietary Preference Split</label>
            <select
              value={dietarySplit}
              onChange={(e) => setDietarySplit(e.target.value)}
              className="w-full rounded-xl border border-emerald-800/70 bg-[#061208] px-3.5 py-2 text-white focus:outline-hidden focus:border-yellow-400"
            >
              <option value="65% Veg, 35% Non-Veg">65% Veg, 35% Non-Veg</option>
              <option value="100% Pure Vegetarian">100% Pure Vegetarian</option>
              <option value="50% Veg, 50% Non-Veg">50% Veg, 50% Non-Veg</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-emerald-800/40">
          <button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/25 cursor-pointer disabled:opacity-50 border border-emerald-300/70"
          >
            <Sparkles className="h-4 w-4 text-slate-950" />
            <span>{isGenerating ? 'Calculating Smart Yields...' : 'Generate Smart AI Production Plan'}</span>
          </button>
        </div>
      </div>

      {/* Outcome Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="rounded-2xl border border-emerald-800/40 bg-[#0d1d11] p-4 shadow-sm">
          <span className="text-emerald-200/70 font-medium">Target Cooked Portions</span>
          <div className="text-2xl font-black font-mono text-yellow-400 mt-1">
            {currentForecast.optimizedPortions} <span className="text-xs font-normal text-emerald-300/60">/ {headcount}</span>
          </div>
          <p className="text-[11px] text-emerald-400/60 mt-1">Dynamic attrition buffer applied</p>
        </div>

        <div className="rounded-2xl border border-pink-500/30 bg-[#120f13] p-4 shadow-sm">
          <span className="text-pink-300/80 font-medium">Surplus Overproduction Avoided</span>
          <div className="text-2xl font-black font-mono text-pink-400 mt-1">
            -{currentForecast.portionReductionVsUnplanned} portions
          </div>
          <p className="text-[11px] text-pink-400/60 mt-1">Prevented before cooking starts</p>
        </div>

        <div className="rounded-2xl border border-emerald-800/40 bg-[#0d1d11] p-4 shadow-sm">
          <span className="text-emerald-200/70 font-medium">Food Waste Avoided</span>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            {currentForecast.wasteAvoidedKg} kg
          </div>
          <p className="text-[11px] text-emerald-400/60 mt-1">Landfill decomposition prevented</p>
        </div>

        <div className="rounded-2xl border border-emerald-800/40 bg-[#0d1d11] p-4 shadow-sm">
          <span className="text-emerald-200/70 font-medium">Kitchen Cost Savings</span>
          <div className="text-2xl font-black font-mono text-yellow-300 mt-1">
            ₹{currentForecast.costSavingsRs?.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-400/60 mt-1">Raw material budget saved</p>
        </div>
      </div>

      {/* Recipe BOM (Bill of Materials) Table */}
      <div className="rounded-2xl border border-emerald-800/50 bg-[#0a180e] p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Calculated Recipe Bill of Materials (BOM)</h3>
            <p className="text-xs text-emerald-200/70 mt-0.5">
              Exact batch weight quotas down to grams to satisfy 100% of attendance without surplus.
            </p>
          </div>
          <div className="text-xs font-mono text-yellow-400/80 font-semibold">
            FSSAI Standard Portion Matrix
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-emerald-100">
            <thead className="border-b border-emerald-800/80 bg-[#061208] text-emerald-300/80">
              <tr>
                <th className="py-3 px-4 font-bold">Menu Dish</th>
                <th className="py-3 px-4 font-bold">Portion Size</th>
                <th className="py-3 px-4 font-bold">Batch Net Yield</th>
                <th className="py-3 px-4 font-bold">Safety Buffer</th>
                <th className="py-3 px-4 font-bold">Key Requisition Ingredients</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-800/40">
              {currentForecast.menuBOM?.map((dish: any, idx: number) => (
                <tr key={idx} className="hover:bg-emerald-950/40">
                  <td className="py-3 px-4 font-bold text-white">{dish.dishName}</td>
                  <td className="py-3 px-4 font-mono text-emerald-200/90">{dish.portionSizeGrams}g</td>
                  <td className="py-3 px-4 font-mono font-black text-yellow-400">{dish.totalPreparedKg} kg</td>
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-300">+{dish.safetyBufferPortions} portions</td>
                  <td className="py-3 px-4 text-emerald-200/70 text-[11px]">{dish.primaryIngredients}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staggered Just-In-Time Cooking Schedule & Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-emerald-800/50 bg-[#0a180e] p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-yellow-400" />
            <span>Just-in-Time Staggered Cooking Schedule</span>
          </h3>

          <div className="space-y-3 text-xs">
            {currentForecast.batchCookingSchedule?.map((sched: any, idx: number) => (
              <div key={idx} className="rounded-xl bg-[#061208] p-3.5 border border-emerald-800/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-yellow-400">{sched.timeSlot}</span>
                  <span className="text-[11px] text-emerald-300/80 font-mono">{sched.justInTimeBuffer}</span>
                </div>
                <p className="text-emerald-100/90">{sched.activity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-800/50 bg-[#0a180e] p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-yellow-400" />
            <span>Master Chef Anti-Waste Protocols</span>
          </h3>

          <ul className="space-y-2.5 text-xs text-emerald-100/90">
            {currentForecast.chefTips?.map((tip: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2.5 rounded-xl bg-[#061208] p-3.5 border border-emerald-800/40">
                <span className="text-yellow-400 font-bold shrink-0">•</span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
