import React, { useState, useEffect } from 'react';
import { 
  Network, 
  FileSpreadsheet, 
  MessageSquare, 
  Webhook, 
  Cpu, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  RefreshCw, 
  Send, 
  Download, 
  ExternalLink, 
  Terminal, 
  Play, 
  Radio, 
  AlertTriangle, 
  Sliders, 
  Key, 
  Globe, 
  Copy, 
  Check, 
  Plus,
  Flame,
  ArrowRight
} from 'lucide-react';
import type { IntegrationService, WebhookLogRecord, IoTTelemetryNode } from '../types';

interface IntegrationCenterProps {
  onListingCreated?: (listing: any) => void;
}

export const IntegrationCenter: React.FC<IntegrationCenterProps> = ({ onListingCreated }) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'webhooks' | 'google_sheets' | 'whatsapp' | 'iot_sensors'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [integrations, setIntegrations] = useState<IntegrationService[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLogRecord[]>([]);
  const [iotNodes, setIotNodes] = useState<IoTTelemetryNode[]>([]);
  const [stats, setStats] = useState({
    activeIntegrations: 6,
    uptimePercent: 99.98,
    avgLatencyMs: 39,
    totalEventsProcessed: 3280,
  });

  // Webhook Tester State
  const [testEventType, setTestEventType] = useState('surplus.batch_listed');
  const [testTargetUrl, setTestTargetUrl] = useState('https://webhook.site/foodfarmer-test-endpoint');
  const [testSecretKey, setTestSecretKey] = useState('ff_sec_8a39d8fe01c8');
  const [isDispatchingWebhook, setIsDispatchingWebhook] = useState(false);
  const [webhookResult, setWebhookResult] = useState<any | null>(null);

  // Inbound POS Simulator State
  const [inboundTitle, setInboundTitle] = useState('Buffet Surplus: Paneer Butter Masala & Naan');
  const [inboundPortions, setInboundPortions] = useState(65);
  const [inboundCategory, setInboundCategory] = useState<'cooked_meals' | 'rice_gravy' | 'bakery' | 'packed_thali'>('cooked_meals');
  const [isInbounding, setIsInbounding] = useState(false);
  const [inboundSuccess, setInboundSuccess] = useState<string | null>(null);

  // WhatsApp Broadcast Simulator State
  const [waBatchTitle, setWaBatchTitle] = useState('Fresh Dum Biryani (50 Portions)');
  const [waPortions, setWaPortions] = useState(50);
  const [waLocation, setWaLocation] = useState('Koramangala Community Kitchen, Bengaluru');
  const [waPhone, setWaPhone] = useState('+91 98450 11223');
  const [isSendingWa, setIsSendingWa] = useState(false);
  const [waResult, setWaResult] = useState<any | null>(null);

  // IoT Cold Storage Simulator State
  const [isUpdatingIot, setIsUpdatingIot] = useState(false);
  const [iotFeedback, setIotFeedback] = useState<string | null>(null);

  // Copy helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchOverview = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/integrations/overview');
      const data = await res.json();
      if (data.success) {
        setIntegrations(data.integrations || []);
        setWebhookLogs(data.webhookLogs || []);
        setIotNodes(data.iotNodes || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load integrations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleCopy = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Dispatch Test Outbound Webhook
  const handleTestWebhookDispatch = async () => {
    setIsDispatchingWebhook(true);
    setWebhookResult(null);
    try {
      const res = await fetch('/api/integrations/test-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: testEventType,
          targetUrl: testTargetUrl,
          secretKey: testSecretKey,
        }),
      });
      const data = await res.json();
      setWebhookResult(data);
      if (data.log) {
        setWebhookLogs((prev) => [data.log, ...prev]);
      }
    } catch (err) {
      console.error('Error dispatching test webhook:', err);
    } finally {
      setIsDispatchingWebhook(false);
    }
  };

  // Inbound POS ERP Ingestion
  const handleInboundPosIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInbounding(true);
    setInboundSuccess(null);
    try {
      const res = await fetch('/api/integrations/inbound-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: { name: 'Petpooja POS Terminal #3', type: 'kitchen' },
          title: inboundTitle,
          foodCategory: inboundCategory,
          portions: inboundPortions,
          location: 'Indiranagar 100ft Road, Bengaluru',
          contactPerson: 'Chef Anand (POS Auto)',
          phone: '+91 99002 88410',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInboundSuccess(`Success! Ingested batch ${data.listing.id} (${data.listing.portions} portions) directly into the ₹1 Outlet catalog.`);
        if (onListingCreated && data.listing) {
          onListingCreated(data.listing);
        }
        fetchOverview();
      }
    } catch (err) {
      console.error('Inbound ingest error:', err);
    } finally {
      setIsInbounding(false);
    }
  };

  // Dispatch WhatsApp Emergency Broadcast
  const handleSendWhatsAppAlert = async () => {
    setIsSendingWa(true);
    setWaResult(null);
    try {
      const res = await fetch('/api/integrations/whatsapp-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchTitle: waBatchTitle,
          portions: waPortions,
          location: waLocation,
          recipientPhone: waPhone,
          safeUntil: '3 Hours Remaining',
        }),
      });
      const data = await res.json();
      setWaResult(data);
      fetchOverview();
    } catch (err) {
      console.error('WhatsApp dispatch error:', err);
    } finally {
      setIsSendingWa(false);
    }
  };

  // Simulate Temperature Spike or Normalization on IoT Sensor
  const handleIotTemperatureChange = async (nodeId: string, temp: number) => {
    setIsUpdatingIot(true);
    setIotFeedback(null);
    try {
      const res = await fetch('/api/integrations/iot-telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeId,
          temperatureDegC: temp,
          humidityPercent: Math.floor(80 + Math.random() * 10),
          status: temp > 5.0 ? 'critical' : 'optimal',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIotNodes(data.allNodes || []);
        setIotFeedback(
          temp > 5.0
            ? `Critical Alert Triggered on ${nodeId}: Temperature reached ${temp}°C. Outbound warning webhook dispatched to Zero-Fridge transfer network!`
            : `Node ${nodeId} successfully normalized to ${temp}°C.`
        );
        fetchOverview();
      }
    } catch (err) {
      console.error('IoT telemetry error:', err);
    } finally {
      setIsUpdatingIot(false);
    }
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileSpreadsheet': return FileSpreadsheet;
      case 'MessageSquare': return MessageSquare;
      case 'Webhook': return Webhook;
      case 'Cpu': return Cpu;
      case 'ShieldCheck': return ShieldCheck;
      case 'Truck': return Truck;
      default: return Network;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner with Green Aesthetic */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-[#07170b] via-[#0d2212] to-[#0a1c10] p-6 sm:p-8 shadow-xl shadow-emerald-950/40">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Network className="h-4 w-4 text-emerald-400" />
            <span className="bg-emerald-500/15 text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-500/30 font-mono text-[10px] tracking-wider uppercase">
              FOOD FARMER INTEGRATION HUB · API, WEBHOOKS & IOT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Network className="h-6 w-6 stroke-[2.2]" />
            </span>
            Connected Integrations Center
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Real-time synchronization bridges connecting <strong className="text-emerald-300 font-bold">FOOD FARMER</strong> with Google Sheets, emergency WhatsApp rescue broadcasts, restaurant POS/ERP webhooks (Tally/Marg/Petpooja), cold-chain wireless IoT sensors, and on-demand delivery fleets.
          </p>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-emerald-900/60 font-mono">
          <div className="rounded-xl border border-emerald-800/60 bg-[#061409] p-3 text-left">
            <span className="text-[10px] uppercase tracking-wider text-emerald-400/80 font-bold">Active Connectors</span>
            <div className="text-xl font-black text-emerald-300 flex items-center gap-1.5 mt-0.5">
              <span>{stats.activeIntegrations} Services</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400" />
            </div>
          </div>
          <div className="rounded-xl border border-emerald-800/60 bg-[#061409] p-3 text-left">
            <span className="text-[10px] uppercase tracking-wider text-emerald-400/80 font-bold">Uptime Reliability</span>
            <div className="text-xl font-black text-emerald-300 mt-0.5">{stats.uptimePercent}%</div>
          </div>
          <div className="rounded-xl border border-emerald-800/60 bg-[#061409] p-3 text-left">
            <span className="text-[10px] uppercase tracking-wider text-emerald-400/80 font-bold">Average Latency</span>
            <div className="text-xl font-black text-emerald-300 mt-0.5">{stats.avgLatencyMs} ms</div>
          </div>
          <div className="rounded-xl border border-emerald-800/60 bg-[#061409] p-3 text-left">
            <span className="text-[10px] uppercase tracking-wider text-emerald-400/80 font-bold">Total Events Synced</span>
            <div className="text-xl font-black text-emerald-300 mt-0.5">{stats.totalEventsProcessed.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs with Green Styling */}
      <div className="flex flex-wrap items-center gap-2 border-b border-emerald-900/60 pb-3">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 font-black shadow-md shadow-emerald-500/20 border border-emerald-300/80'
              : 'border border-emerald-800/60 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 hover:text-white'
          }`}
        >
          <Network className="h-4 w-4" />
          <span>Active Integrations ({integrations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('webhooks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'webhooks'
              ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 font-black shadow-md shadow-emerald-500/20 border border-emerald-300/80'
              : 'border border-emerald-800/60 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 hover:text-white'
          }`}
        >
          <Webhook className="h-4 w-4" />
          <span>Webhooks & ERP POS Simulator</span>
        </button>

        <button
          onClick={() => setActiveSubTab('google_sheets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'google_sheets'
              ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 font-black shadow-md shadow-emerald-500/20 border border-emerald-300/80'
              : 'border border-emerald-800/60 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 hover:text-white'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Google Sheets & CSV Export</span>
        </button>

        <button
          onClick={() => setActiveSubTab('whatsapp')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'whatsapp'
              ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 font-black shadow-md shadow-emerald-500/20 border border-emerald-300/80'
              : 'border border-emerald-800/60 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 hover:text-white'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>WhatsApp Emergency Broadcast</span>
        </button>

        <button
          onClick={() => setActiveSubTab('iot_sensors')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'iot_sensors'
              ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 font-black shadow-md shadow-emerald-500/20 border border-emerald-300/80'
              : 'border border-emerald-800/60 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 hover:text-white'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>Zero-Fridge IoT Sensors</span>
        </button>
      </div>

      {/* SUB-TAB 1: OVERVIEW INTEGRATIONS GRID */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((svc) => {
              const IconComponent = getServiceIcon(svc.icon);
              return (
                <div
                  key={svc.id}
                  className="rounded-2xl border border-emerald-800/60 bg-[#09180e] p-5 flex flex-col justify-between hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-950/40 transition-all space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <IconComponent className="h-5 w-5 stroke-[2.2]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white leading-tight">
                            {svc.name}
                          </h3>
                          <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">
                            {svc.authMethod}
                          </span>
                        </div>
                      </div>

                      <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-700/60">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        <span>Connected</span>
                      </span>
                    </div>

                    <p className="text-xs text-emerald-100/80 leading-relaxed min-h-[48px]">
                      {svc.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-emerald-900/60 text-[11px] font-mono">
                      <div className="flex items-center justify-between text-emerald-300/80">
                        <span>Sync Frequency:</span>
                        <strong className="text-white">{svc.syncFrequency}</strong>
                      </div>
                      <div className="flex items-center justify-between text-emerald-300/80">
                        <span>{svc.metrics.label}:</span>
                        <strong className="text-emerald-300">{svc.metrics.value}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-emerald-900/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        if (svc.id === 'google_sheets_drive') setActiveSubTab('google_sheets');
                        else if (svc.id === 'whatsapp_alerts') setActiveSubTab('whatsapp');
                        else if (svc.id === 'erp_pos_webhook') setActiveSubTab('webhooks');
                        else if (svc.id === 'iot_cold_chain') setActiveSubTab('iot_sensors');
                        else setActiveSubTab('webhooks');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black cursor-pointer shadow-md shadow-emerald-500/20 border border-emerald-300/70 transition-transform hover:scale-[1.01]"
                    >
                      <span>Configure & Test</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-950" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Integration Docs and API Key Guide */}
          <div className="rounded-2xl border border-emerald-800/60 bg-[#07150b] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span>Standard Developer Ingestion Webhook Endpoint</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-400/80 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                POST /api/integrations/inbound-webhook
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Third-party hotel management systems (Opera, IDS Next), supermarket POS (Petpooja, Marg, Tally), and industrial cloud kitchens can emit JSON payloads directly to this endpoint with HMAC-SHA256 authentication to instantly seed surplus batches without manual entry.
            </p>

            <div className="relative rounded-xl border border-emerald-800/80 bg-[#040e07] p-3 text-xs font-mono text-emerald-300 overflow-x-auto">
              <button
                onClick={() =>
                  handleCopy(
                    `curl -X POST https://foodfarmer.app/api/integrations/inbound-webhook \\\n  -H "Content-Type: application/json" \\\n  -H "X-FoodFarmer-Signature-256: sha256=ff_sec_8a39d8fe01c8" \\\n  -d '{"title":"Veg Biryani","portions":50,"foodCategory":"cooked_meals"}'`,
                    'curl-code'
                  )
                }
                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-950/90 text-emerald-300 hover:text-white border border-emerald-700/60 text-[10px] cursor-pointer"
              >
                {copiedKey === 'curl-code' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedKey === 'curl-code' ? 'Copied' : 'Copy cURL'}</span>
              </button>
              <pre className="text-[11px] leading-relaxed">
{`curl -X POST https://foodfarmer.app/api/integrations/inbound-webhook \\
  -H "Content-Type: application/json" \\
  -H "X-FoodFarmer-Signature-256: sha256=ff_sec_8a39d8fe01c8" \\
  -d '{
    "source": { "name": "Grand Sheraton Banquet", "type": "hotel" },
    "title": "50 Portions Cooked Saffron Pulao & Dal Makhani",
    "foodCategory": "cooked_meals",
    "portions": 50,
    "location": "Malleshwaram, Bengaluru"
  }'`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: WEBHOOK DISPATCHER & INBOUND SIMULATOR */}
      {activeSubTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tool A: Outbound Webhook Test Dispatcher */}
            <div className="rounded-2xl border border-emerald-800/60 bg-[#09180e] p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Send className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Outbound Webhook Dispatcher</h3>
                    <p className="text-[11px] text-emerald-300/70">Test sending signed event payloads to an external NGO/Partner URL</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  HMAC-SHA256
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                    Event Topic / Trigger
                  </label>
                  <select
                    value={testEventType}
                    onChange={(e) => setTestEventType(e.target.value)}
                    className="w-full rounded-xl border border-emerald-800 bg-[#061208] px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="surplus.batch_listed">surplus.batch_listed (New ₹1 surplus food published)</option>
                    <option value="claim.token_verified">claim.token_verified (NGO successfully claimed batch)</option>
                    <option value="cold_chain.temperature_spike">cold_chain.temperature_spike (Zero-Fridge emergency alert)</option>
                    <option value="fmcg.near_expiry_warning">fmcg.near_expiry_warning (48-hour shelf life alert)</option>
                    <option value="sheets.eod_sync">sheets.eod_sync (Google Sheets summary update)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                    Destination Webhook URL
                  </label>
                  <input
                    type="text"
                    value={testTargetUrl}
                    onChange={(e) => setTestTargetUrl(e.target.value)}
                    className="w-full rounded-xl border border-emerald-800 bg-[#061208] px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-400 font-mono"
                    placeholder="https://your-api.com/webhook"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                    Signing Secret (Used to generate X-FoodFarmer-Signature-256)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={testSecretKey}
                      onChange={(e) => setTestSecretKey(e.target.value)}
                      className="flex-1 rounded-xl border border-emerald-800 bg-[#061208] px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-400 font-mono"
                    />
                    <button
                      onClick={() => handleCopy(testSecretKey, 'secret-btn')}
                      className="px-3 py-2 rounded-xl border border-emerald-700 bg-emerald-950 text-emerald-300 hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      {copiedKey === 'secret-btn' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleTestWebhookDispatch}
                    disabled={isDispatchingWebhook}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-emerald-500/25 border border-emerald-300/80 transition-transform hover:scale-[1.01] disabled:opacity-50"
                  >
                    {isDispatchingWebhook ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                        <span>Dispatching Signed Webhook...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 text-slate-950 stroke-[2.5]" />
                        <span>Test Dispatch Outbound Webhook</span>
                      </>
                    )}
                  </button>
                </div>

                {webhookResult && (
                  <div className="rounded-xl border border-emerald-700/60 bg-[#051408] p-3 space-y-2 mt-3 text-xs font-mono">
                    <div className="flex items-center justify-between text-emerald-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        HTTP 200 OK Response
                      </span>
                      <span>{webhookResult.headers?.['X-FoodFarmer-Delivery']}</span>
                    </div>
                    <div className="text-[11px] text-emerald-200/80 space-y-1">
                      <div>Latency: <strong>{webhookResult.responsePayload?.responseTimeMs}ms</strong></div>
                      <div>Signature: <span className="truncate block text-emerald-400">{webhookResult.headers?.['X-FoodFarmer-Signature-256']}</span></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tool B: Inbound POS/ERP Ingestion Simulator */}
            <div className="rounded-2xl border border-emerald-800/60 bg-[#09180e] p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Webhook className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Inbound POS / Kitchen Webhook Simulator</h3>
                    <p className="text-[11px] text-emerald-300/70">Simulate excess batch push from Petpooja / Marg / Tally ERP</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  AUTO-INVENTORY
                </span>
              </div>

              <form onSubmit={handleInboundPosIngest} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                    Dish / Food Surplus Title
                  </label>
                  <input
                    type="text"
                    value={inboundTitle}
                    onChange={(e) => setInboundTitle(e.target.value)}
                    required
                    className="w-full rounded-xl border border-emerald-800 bg-[#061208] px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                      Excess Portions (Portions)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={1000}
                      value={inboundPortions}
                      onChange={(e) => setInboundPortions(Number(e.target.value))}
                      className="w-full rounded-xl border border-emerald-800 bg-[#061208] px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                      Food Category
                    </label>
                    <select
                      value={inboundCategory}
                      onChange={(e) => setInboundCategory(e.target.value as any)}
                      className="w-full rounded-xl border border-emerald-800 bg-[#061208] px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-400 cursor-pointer"
                    >
                      <option value="cooked_meals">Cooked Meals & Curries</option>
                      <option value="rice_gravy">Rice & Gravy</option>
                      <option value="packed_thali">Packed Thali Box</option>
                      <option value="bakery">Bakery & Breads</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-800/60 bg-[#051307] p-3 text-[11px] font-mono text-emerald-300/80">
                  <span>Source Terminal: </span>
                  <strong className="text-white">Petpooja POS v4.2 - Indiranagar Kitchen</strong>
                  <br />
                  <span>Target Catalog: </span>
                  <strong className="text-emerald-300">₹1 Surplus Outlet (Immediate NGO Visibility)</strong>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isInbounding}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-emerald-500/25 border border-emerald-300/80 transition-transform hover:scale-[1.01] disabled:opacity-50"
                  >
                    {isInbounding ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                        <span>Simulating ERP POS Ingestion...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 text-slate-950 fill-current" />
                        <span>Simulate Inbound POS Ingestion to ₹1 Catalog</span>
                      </>
                    )}
                  </button>
                </div>

                {inboundSuccess && (
                  <div className="rounded-xl border border-emerald-500/60 bg-emerald-950/80 p-3 text-xs text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{inboundSuccess}</span>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Real-time Webhook Activity Logs Table */}
          <div className="rounded-2xl border border-emerald-800/60 bg-[#09180e] p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
                <span>Recent Webhook Stream Activity ({webhookLogs.length} Events)</span>
              </h3>
              <button
                onClick={fetchOverview}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-700 bg-emerald-950/60 text-emerald-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Stream</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-emerald-800/80 text-[11px] text-emerald-400/80">
                    <th className="pb-2">Delivery ID</th>
                    <th className="pb-2">Event Topic</th>
                    <th className="pb-2">Target Endpoint</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Latency</th>
                    <th className="pb-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/80 text-emerald-200">
                  {webhookLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-emerald-950/40">
                      <td className="py-2.5 font-bold text-white">{log.id}</td>
                      <td className="py-2.5 text-emerald-300">{log.eventType}</td>
                      <td className="py-2.5 text-emerald-400/80 max-w-[200px] truncate">{log.targetEndpoint}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {log.statusCode} OK
                        </span>
                      </td>
                      <td className="py-2.5 text-emerald-300">{log.latencyMs} ms</td>
                      <td className="py-2.5 text-emerald-400/70 text-[11px]">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GOOGLE SHEETS & CSV EXPORT */}
      {activeSubTab === 'google_sheets' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-800/60 bg-[#09180e] p-6 space-y-4 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Google Sheets & Cloud Drive Ledger Sync</h2>
                    <p className="text-xs text-emerald-300/80">Continuous real-time export of all ₹1 claims, near-expiry lots, and ESG analytics</p>
                  </div>
                </div>
              </div>

              {/* Direct CSV Download Button */}
              <a
                href="/api/integrations/export-csv"
                download="foodfarmer-live-cloud-sync.csv"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-emerald-500/25 border border-emerald-300/80 transition-transform hover:scale-[1.02]"
              >
                <Download className="h-4 w-4 text-slate-950 stroke-[2.5]" />
                <span>Export Now to Google Sheets / CSV</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-emerald-900/60 font-mono text-xs">
              <div className="rounded-xl border border-emerald-800/60 bg-[#061409] p-3.5 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">Sync Schedule</span>
                <p className="text-white font-bold">Real-time on Every Claim</p>
                <span className="text-[10px] text-emerald-400/80">Next automated sync: 12 mins</span>
              </div>
              <div className="rounded-xl border border-emerald-800/60 bg-[#061409] p-3.5 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">Connected Spreadsheet</span>
                <p className="text-emerald-300 font-bold truncate">FOOD_FARMER_Master_Ledger_2026</p>
                <span className="text-[10px] text-emerald-400/80">Google Workspace Drive Integration</span>
              </div>
              <div className="rounded-xl border border-emerald-800/60 bg-[#061409] p-3.5 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">Format Compliance</span>
                <p className="text-white font-bold">RFC-4180 UTF-8 CSV</p>
                <span className="text-[10px] text-emerald-400/80">Compatible with Excel, Sheets, BigQuery</span>
              </div>
            </div>

            {/* Live Sheets Data Preview Grid */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Live Synchronized Sheet Grid (Sample Rows)</span>
                <span className="font-mono text-[11px] text-emerald-400/70">1,428 Rows in Cloud Sheet</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-emerald-800 bg-[#051208] p-1">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="bg-emerald-950/80 text-[10px] text-emerald-300 border-b border-emerald-800">
                      <th className="p-2">Batch_ID</th>
                      <th className="p-2">Catalog_Type</th>
                      <th className="p-2">Item_Title</th>
                      <th className="p-2">Source_Donor</th>
                      <th className="p-2">Portions</th>
                      <th className="p-2">CO2_Prevented_Kg</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950/70 text-[11px] text-emerald-100">
                    <tr className="hover:bg-emerald-950/30">
                      <td className="p-2 text-emerald-300 font-bold">RUPEE-101</td>
                      <td className="p-2">1_Rupee_Outlet</td>
                      <td className="p-2 font-sans font-medium">Wedding Buffet: Saffron Pulao & Gravy</td>
                      <td className="p-2">Grand Imperial Banquet</td>
                      <td className="p-2">180</td>
                      <td className="p-2 text-emerald-400 font-bold">95.4 kg</td>
                      <td className="p-2"><span className="text-emerald-400 font-bold">AVAILABLE</span></td>
                    </tr>
                    <tr className="hover:bg-emerald-950/30">
                      <td className="p-2 text-emerald-300 font-bold">RUPEE-102</td>
                      <td className="p-2">1_Rupee_Outlet</td>
                      <td className="p-2 font-sans font-medium">Buffet Surplus: Veg Biryani & Gulab Jamun</td>
                      <td className="p-2">Royal Dawat Caterers</td>
                      <td className="p-2">120</td>
                      <td className="p-2 text-emerald-400 font-bold">64.8 kg</td>
                      <td className="p-2"><span className="text-emerald-400 font-bold">AVAILABLE</span></td>
                    </tr>
                    <tr className="hover:bg-emerald-950/30">
                      <td className="p-2 text-emerald-300 font-bold">FMCG-201</td>
                      <td className="p-2">Eat_In_A_Day</td>
                      <td className="p-2 font-sans font-medium">Maaza Mango Pulp Juice Tetra Pack (24 units)</td>
                      <td className="p-2">Reliance Fresh Hub</td>
                      <td className="p-2">45 cases</td>
                      <td className="p-2 text-emerald-400 font-bold">81.0 kg</td>
                      <td className="p-2"><span className="text-emerald-400 font-bold">AVAILABLE</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: WHATSAPP EMERGENCY BROADCAST */}
      {activeSubTab === 'whatsapp' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-emerald-800/60 bg-[#09180e] p-5 space-y-4 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Emergency WhatsApp Broadcast Gateway</h3>
                  <p className="text-[11px] text-emerald-300/70">Fires 2-hour cooked surplus alerts to registered NGO rescue teams</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                    Select Surplus Batch
                  </label>
                  <input
                    type="text"
                    value={waBatchTitle}
                    onChange={(e) => setWaBatchTitle(e.target.value)}
                    className="w-full rounded-xl border border-emerald-800 bg-[#061208] px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                      Available Portions
                    </label>
                    <input
                      type="number"
                      value={waPortions}
                      onChange={(e) => setWaPortions(Number(e.target.value))}
                      className="w-full rounded-xl border border-emerald-800 bg-[#061208] px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                      Recipient NGO / Field Phone
                    </label>
                    <input
                      type="text"
                      value={waPhone}
                      onChange={(e) => setWaPhone(e.target.value)}
                      className="w-full rounded-xl border border-emerald-800 bg-[#061208] px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                    Pickup Location / Hub
                  </label>
                  <input
                    type="text"
                    value={waLocation}
                    onChange={(e) => setWaLocation(e.target.value)}
                    className="w-full rounded-xl border border-emerald-800 bg-[#061208] px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-400"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSendWhatsAppAlert}
                    disabled={isSendingWa}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-emerald-500/25 border border-emerald-300/80 transition-transform hover:scale-[1.01] disabled:opacity-50"
                  >
                    {isSendingWa ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                        <span>Sending WhatsApp Broadcast...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 text-slate-950 stroke-[2.5]" />
                        <span>Send Emergency WhatsApp Broadcast</span>
                      </>
                    )}
                  </button>
                </div>

                {waResult && (
                  <div className="rounded-xl border border-emerald-500/60 bg-emerald-950/80 p-3 text-xs text-emerald-200 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-emerald-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Broadcast Delivered: {waResult.dispatchId}</span>
                    </div>
                    <div className="text-[11px] text-emerald-400/80 font-mono">Recipient: {waResult.recipient}</div>
                  </div>
                )}
              </div>
            </div>

            {/* WhatsApp Template Visualizer */}
            <div className="rounded-2xl border border-emerald-800/60 bg-[#09180e] p-5 space-y-4 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-emerald-400" />
                  <span>Verified FSSAI WhatsApp Template Preview</span>
                </h3>
                <p className="text-xs text-emerald-300/70 mb-4">
                  Registered volunteers receive this interactive notification with 1-click claim button and real-time pickup navigation.
                </p>

                <div className="rounded-2xl border border-emerald-700/50 bg-[#06150a] p-4 text-xs font-sans text-emerald-50 space-y-2 shadow-inner">
                  <div className="flex items-center justify-between border-b border-emerald-900 pb-2 text-[11px] font-mono text-emerald-400">
                    <span>FOOD FARMER OFFICIAL BOT</span>
                    <span>12:44 PM</span>
                  </div>
                  <p className="font-bold text-emerald-300">🍲 FOOD FARMER RESCUE ALERT (FSSAI Verified)</p>
                  <p className="text-white">⚡ <strong>{waPortions} Portions Available Immediately!</strong></p>
                  <p className="text-emerald-100">📍 <strong>Location:</strong> {waLocation}</p>
                  <p className="text-emerald-100">🥘 <strong>Item:</strong> {waBatchTitle}</p>
                  <p className="text-yellow-300 font-bold">⏳ Safe Window: 3 Hours Remaining</p>
                  <div className="pt-2 border-t border-emerald-900/60">
                    <div className="inline-block px-3 py-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 font-mono text-[10px] border border-emerald-500/40">
                      👉 Claim Now for ₹1: https://foodfarmer.app/claim
                    </div>
                  </div>
                  <p className="text-[10px] text-emerald-400/70 italic pt-1">
                    Good Samaritan Food Donation Act Protection Enforced.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-900/60 text-[11px] text-emerald-300/70 font-mono">
                Average NGO Claim Acceptance Time: <strong className="text-emerald-300">7 Minutes</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: IOT SENSORS & ZERO-FRIDGE TELEMETRY */}
      {activeSubTab === 'iot_sensors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="h-5 w-5 text-emerald-400" />
                <span>Zero-Fridge Wireless Cold-Chain IoT Sensor Grid</span>
              </h2>
              <p className="text-xs text-emerald-300/80">
                Continuous temperature & power telemetry monitoring to protect perishables from freezer failure
              </p>
            </div>
            <button
              onClick={fetchOverview}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-700 bg-emerald-950/60 text-emerald-300 hover:text-white text-xs font-semibold cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Poll Sensors</span>
            </button>
          </div>

          {iotFeedback && (
            <div className="rounded-xl border border-emerald-500/60 bg-emerald-950/90 p-3.5 text-xs text-emerald-100 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{iotFeedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {iotNodes.map((node) => {
              const isWarning = node.temperatureDegC > 4.5;
              return (
                <div
                  key={node.nodeId}
                  className={`rounded-2xl border p-5 space-y-3 shadow-lg transition-all ${
                    isWarning
                      ? 'border-yellow-500/50 bg-[#161208]'
                      : 'border-emerald-800/60 bg-[#09180e]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                          isWarning
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        <Cpu className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{node.facility}</h4>
                        <span className="text-[10px] font-mono text-emerald-400">{node.nodeId}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isWarning
                          ? 'bg-yellow-950/90 text-yellow-300 border-yellow-500/50'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                      }`}
                    >
                      {isWarning ? 'TEMP SPIKE ALERT' : 'OPTIMAL'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-900/60 text-xs font-mono">
                    <div className="rounded-lg bg-[#061208] p-2 text-center">
                      <span className="text-[9px] text-emerald-400 uppercase">Current Temp</span>
                      <div className={`text-base font-black ${isWarning ? 'text-yellow-400' : 'text-emerald-300'}`}>
                        {node.temperatureDegC}°C
                      </div>
                    </div>
                    <div className="rounded-lg bg-[#061208] p-2 text-center">
                      <span className="text-[9px] text-emerald-400 uppercase">Target Range</span>
                      <div className="text-xs font-bold text-white">{node.targetRangeDegC}</div>
                    </div>
                    <div className="rounded-lg bg-[#061208] p-2 text-center">
                      <span className="text-[9px] text-emerald-400 uppercase">Power Source</span>
                      <div className="text-[11px] font-medium text-emerald-200 truncate">{node.powerSource}</div>
                    </div>
                  </div>

                  {/* Simulator Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleIotTemperatureChange(node.nodeId, 6.2)}
                      disabled={isUpdatingIot}
                      className="flex-1 py-1.5 px-2.5 rounded-xl border border-emerald-700/60 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Simulate Temp Spike (6.2°C)
                    </button>
                    <button
                      onClick={() => handleIotTemperatureChange(node.nodeId, 2.1)}
                      disabled={isUpdatingIot}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black cursor-pointer shadow-xs border border-emerald-300/80 transition-transform"
                    >
                      Normalize (2.1°C)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
