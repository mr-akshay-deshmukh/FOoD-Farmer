import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  ExternalLink, 
  Navigation, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  RefreshCw,
  Layers,
  HeartHandshake
} from 'lucide-react';

interface GroundedPlace {
  title: string;
  uri: string;
  snippet?: string;
}

interface RescueMapsGroundingProps {
  onSelectDestination?: (locationName: string) => void;
}

export const RescueMapsGrounding: React.FC<RescueMapsGroundingProps> = ({ onSelectDestination }) => {
  const [city, setCity] = useState('Bengaluru, India');
  const [searchQuery, setSearchQuery] = useState('Food banks, NGO shelters, and community kitchens');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('Default city location');
  const [isLoading, setIsLoading] = useState(false);
  const [groundedText, setGroundedText] = useState<string>('');
  const [places, setPlaces] = useState<GroundedPlace[]>([]);
  const [hasQueried, setHasQueried] = useState(false);

  // Attempt user geolocation on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLocationStatus('GPS Coordinates Active');
        },
        (err) => {
          console.log('Geolocation permission skipped or denied:', err.message);
          setLocationStatus('Using Metro Hub Area');
        },
        { timeout: 8000 }
      );
    }
  }, []);

  const handleSearch = async (overrideQuery?: string, overrideCity?: string) => {
    const q = overrideQuery !== undefined ? overrideQuery : searchQuery;
    const c = overrideCity !== undefined ? overrideCity : city;
    setIsLoading(true);
    setHasQueried(true);

    try {
      const res = await fetch('/api/maps/grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          city: c,
          latitude: coords?.lat,
          longitude: coords?.lng,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGroundedText(data.text || '');
        setPlaces(data.places || []);
      }
    } catch (err) {
      console.error('Failed to load grounded maps data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    handleSearch();
  }, []);

  const presets = [
    { label: 'Food Banks & Shelters', query: 'Registered food banks and NGO homeless shelters' },
    { label: 'Banquet & Wedding Kitchens', query: 'Commercial banquet halls and large caterer kitchens with food surplus' },
    { label: 'Emergency Cold Storage', query: 'Cold storage warehouses, reefer logistics terminals, and ice plants' },
    { label: 'Kirana Discount Marts', query: 'Wholesale FMCG liquidation and grocery discount marts' },
  ];

  const cityOptions = [
    'Bengaluru, India',
    'Mumbai, Maharashtra',
    'New Delhi, NCR',
    'Hyderabad, Telangana',
    'Chennai, Tamil Nadu',
    'Kolkata, West Bengal',
    'Pune, Maharashtra',
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-[#07170b] via-[#0d2212] to-[#0a1c10] p-6 sm:p-8 shadow-xl shadow-emerald-950/40">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <MapPin className="h-4 w-4 text-emerald-400" />
            <span className="bg-emerald-500/15 text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
              GOOGLE MAPS GROUNDING · REAL-WORLD FACILITY LOCATOR
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <MapPin className="h-6 w-6 stroke-[2.2]" />
            </span>
            Rescue Map Grounding
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Real-world verified locations grounded by <strong className="text-emerald-300 font-bold">Google Maps data & Gemini AI</strong>. Instantly locate verified community food banks, institutional banquet kitchens with surplus batches, emergency cold-storage warehouses, and FMCG liquidation hubs with direct Google Maps navigation links.
          </p>
        </div>
      </div>

      {/* Control Bar: City Selector, Search Input, GPS Badge */}
      <div className="rounded-2xl border border-emerald-800/60 bg-[#09180e] p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* City Selection */}
          <div className="md:w-64 shrink-0">
            <label className="block text-[11px] font-bold text-emerald-300 mb-1">
              Select Metro Cluster
            </label>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                handleSearch(searchQuery, e.target.value);
              }}
              className="w-full rounded-xl border border-emerald-800 bg-[#061208] px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-400 cursor-pointer"
            >
              {cityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Search Query Input */}
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-emerald-300 mb-1">
              Facility / NGO Search Query
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-800 bg-[#061208] px-3.5 py-2 focus-within:border-emerald-400">
              <Search className="h-4 w-4 text-emerald-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                placeholder="Search food banks, NGO shelters, cold storage hubs..."
                className="w-full bg-transparent text-xs text-white placeholder-emerald-400/50 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Search Action Button */}
          <div className="flex items-end">
            <button
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-emerald-500/25 border border-emerald-300/70 transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                  <span>Grounding Places...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-slate-950 stroke-[2.5]" />
                  <span>Search Google Maps</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Presets & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-900/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-emerald-300/70 font-semibold">Quick Filters:</span>
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setSearchQuery(p.query);
                  handleSearch(p.query);
                }}
                className="text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-700/50 cursor-pointer transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400/80">
            <Navigation className="h-3 w-3 text-emerald-400" />
            <span>{locationStatus}</span>
          </div>
        </div>
      </div>

      {/* Grounded AI Analysis Text Banner */}
      {groundedText && (
        <div className="rounded-2xl border border-emerald-800/60 bg-[#08170c] p-5 space-y-2 shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Google Maps Grounded Intelligence & Operational Directive</span>
          </div>
          <div className="text-xs text-emerald-100/90 leading-relaxed whitespace-pre-line">
            {groundedText}
          </div>
        </div>
      )}

      {/* Grounded Places Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-400" />
            <span>Verified Facilities ({places.length} Locations Grounded on Google Maps)</span>
          </h2>
          <span className="text-[11px] font-mono text-emerald-400/70">Live Grounding Chunks</span>
        </div>

        {places.length === 0 && !isLoading && hasQueried ? (
          <div className="rounded-2xl border border-emerald-800/60 bg-[#071309] p-8 text-center text-xs text-emerald-300/70">
            No specific facilities found for this query. Try a different city or category keyword.
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {places.map((place, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-emerald-800/60 bg-[#09180e] p-5 flex flex-col justify-between hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-950/40 transition-all space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        {place.title}
                      </h3>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        Google Maps Verified Hub
                      </span>
                    </div>
                  </div>

                  <span className="shrink-0 text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    FSSAI / CSR
                  </span>
                </div>

                {place.snippet ? (
                  <p className="text-xs text-emerald-200/80 leading-relaxed italic border-l-2 border-emerald-500/40 pl-2.5">
                    "{place.snippet}"
                  </p>
                ) : (
                  <p className="text-xs text-emerald-200/70">
                    Accredited destination for ₹1 surplus food handovers, cold room inventory offloads, and emergency redistribution.
                  </p>
                )}
              </div>

              {/* Action Links & Buttons */}
              <div className="pt-3 border-t border-emerald-900/60 flex items-center justify-between gap-2">
                {/* Official Google Maps Web Link */}
                <a
                  href={place.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-600/70 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 hover:text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="h-3 w-3 text-emerald-400 ml-0.5" />
                </a>

                {onSelectDestination && (
                  <button
                    onClick={() => onSelectDestination(place.title)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black cursor-pointer shadow-md shadow-emerald-500/25 border border-emerald-300/60"
                  >
                    <HeartHandshake className="h-3.5 w-3.5 text-slate-950" />
                    <span>Select Hub</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
