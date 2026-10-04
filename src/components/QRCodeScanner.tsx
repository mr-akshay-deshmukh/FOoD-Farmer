import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { 
  Camera, 
  CameraOff, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  Thermometer, 
  Clock, 
  Package, 
  Building2, 
  Printer, 
  Sparkles, 
  Layers, 
  Zap, 
  CheckCircle,
  FileCheck2,
  ArrowRight
} from 'lucide-react';
import { QRVerificationRecord } from '../types';

interface QRCodeScannerProps {
  onIntakeSuccess?: (record: QRVerificationRecord) => void;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onIntakeSuccess }) => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [manualCode, setManualCode] = useState<string>('');
  const [scanningRole, setScanningRole] = useState<'food_bank' | 'retail_mart' | 'cold_hub'>('food_bank');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [scannedRecord, setScannedRecord] = useState<QRVerificationRecord | null>(null);
  const [intakeHistory, setIntakeHistory] = useState<QRVerificationRecord[]>([]);
  const [operatorName, setOperatorName] = useState<string>('Officer Amit Sen (Senior Intake Mgr)');
  const [intakeNotes, setIntakeNotes] = useState<string>('');
  const [isProcessingIntake, setIsProcessingIntake] = useState<boolean>(false);
  const [successReceipt, setSuccessReceipt] = useState<{ manifestId: string; title: string } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Fetch recent intakes on mount
  useEffect(() => {
    fetchRecentIntakes();
  }, []);

  const fetchRecentIntakes = async () => {
    try {
      const res = await fetch('/api/qr/recent-intakes');
      const data = await res.json();
      if (data.success && data.records) {
        setIntakeHistory(data.records);
      }
    } catch (err) {
      console.error('Failed to load recent intakes', err);
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsCameraActive(true);
        scanFrame();
      }
    } catch (err: any) {
      console.warn('Camera error:', err.message);
      setCameraError('Camera access unavailable or blocked. You can still use the 1-click Test QRs or manual token entry below.');
      setIsCameraActive(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Switch Camera Lens
  const toggleCameraFacing = () => {
    stopCamera();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Continuous frame analysis loop
  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.height = videoRef.current.videoHeight;
        canvas.width = videoRef.current.videoWidth;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          stopCamera();
          handleVerifyCode(code.data);
          return;
        }
      }
    }

    animationFrameId.current = requestAnimationFrame(scanFrame);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle QR / Barcode Verification via API
  const handleVerifyCode = async (rawCode: string) => {
    if (!rawCode.trim()) return;
    setIsVerifying(true);
    setSuccessReceipt(null);
    try {
      const res = await fetch('/api/qr/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: rawCode, scanningRole }),
      });
      const data = await res.json();
      if (data.success && data.record) {
        setScannedRecord(data.record);
      } else {
        alert(data.error || 'Failed to verify QR code');
      }
    } catch (err: any) {
      alert('Verification network error: ' + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  // Process Official Inventory Intake
  const handleConfirmIntake = async (action: 'accept' | 'quarantine') => {
    if (!scannedRecord) return;
    setIsProcessingIntake(true);
    try {
      const res = await fetch('/api/qr/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          record: scannedRecord,
          operatorName,
          intakeNotes,
          action,
        }),
      });
      const data = await res.json();
      if (data.success && data.intakeRecord) {
        setSuccessReceipt({
          manifestId: data.manifestId,
          title: scannedRecord.title,
        });
        setIntakeHistory((prev) => [data.intakeRecord, ...prev]);
        if (onIntakeSuccess) {
          onIntakeSuccess(data.intakeRecord);
        }
        setScannedRecord(null);
        setIntakeNotes('');
      }
    } catch (err: any) {
      alert('Intake submission error: ' + err.message);
    } finally {
      setIsProcessingIntake(false);
    }
  };

  // File Upload image scanning
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleVerifyCode(code.data);
          } else {
            alert('No clear QR code detected in this image. Please try another file or select a sample token below.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Sample tokens for instant 1-click testing
  const sampleTokens = [
    {
      code: 'CLAIM-7B8A91',
      label: '₹1 Surplus Biryani Cambro',
      type: 'Hot Food (Food Bank)',
      tag: '1 Outlet',
      color: 'border-yellow-400/50 text-yellow-300',
    },
    {
      code: 'MZ-B902-BLR',
      label: 'Maaza 24x Mango Cases',
      type: 'Near-Expiry Beverage',
      tag: 'Eat in a Day',
      color: 'border-pink-500/50 text-pink-300',
    },
    {
      code: 'MG-IN-8831',
      label: 'Maggi 12x Masala Packs',
      type: 'Dry Pantry Lots',
      tag: 'Eat in a Day',
      color: 'border-pink-500/50 text-pink-300',
    },
    {
      code: 'ZF-401',
      label: 'Cold Storage Reefer Salvage',
      type: 'Chilled Milk & Peas',
      tag: 'Zero Fridge',
      color: 'border-emerald-400/50 text-emerald-300',
    },
    {
      code: 'MK-EYE-441',
      label: 'Waterproof Eyeliner Crate',
      type: 'Clearance Cosmetics',
      tag: 'Budget Deal',
      color: 'border-pink-400/50 text-pink-300',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Pink, Yellow, and Green palette */}
      <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-r from-[#0c1c10] via-[#1c0e1d] to-[#1c2e12] p-6 sm:p-8 shadow-xl shadow-pink-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-pink-400">
              <QrCode className="h-4 w-4 text-pink-400" />
              <span className="bg-pink-500/15 text-pink-300 px-2.5 py-0.5 rounded-md border border-pink-500/30">
                BARCODE & QR INTAKE SCANNER · REAL-TIME VERIFICATION
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Instant Inventory Intake Scanner
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Equips food banks, NGO shelters, and retail marts with live optical scanning to instantly verify FSSAI thermal food safety tokens, check manufacturer expiry dates, confirm tamper seals, and log items into the active inventory ledger.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-[#071309] p-1.5 rounded-xl border border-emerald-800/60 flex items-center gap-1 text-xs">
              <span className="text-[11px] text-emerald-300/70 font-semibold px-2">Role:</span>
              <button
                onClick={() => setScanningRole('food_bank')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  scanningRole === 'food_bank'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-200/70 hover:text-white'
                }`}
              >
                Food Bank / NGO
              </button>
              <button
                onClick={() => setScanningRole('retail_mart')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  scanningRole === 'retail_mart'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-200/70 hover:text-white'
                }`}
              >
                Retail Mart / Kirana
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Scanner Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Camera & Scanner Viewfinder (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-emerald-800/60 bg-[#071309] p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${isCameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-600'}`}></div>
                <h3 className="text-sm font-bold text-white">
                  {isCameraActive ? 'Live Camera Feed Active' : 'Optical QR & Barcode Viewfinder'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {isCameraActive ? (
                  <>
                    <button
                      onClick={toggleCameraFacing}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 hover:text-white cursor-pointer"
                    >
                      Flip Lens
                    </button>
                    <button
                      onClick={stopCamera}
                      className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900/60 cursor-pointer"
                    >
                      <CameraOff className="h-3.5 w-3.5" />
                      <span>Stop</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={startCamera}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black cursor-pointer shadow-md shadow-emerald-500/25 border border-emerald-300/70"
                  >
                    <Camera className="h-4 w-4 text-slate-950" />
                    <span>Launch Camera</span>
                  </button>
                )}
              </div>
            </div>

            {/* Viewfinder Window */}
            <div className="relative aspect-4/3 w-full rounded-xl bg-black overflow-hidden flex items-center justify-center border border-emerald-900/60">
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder Graphic Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                {/* Viewfinder Target Box */}
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 border-2 border-dashed border-emerald-400/40 rounded-2xl flex items-center justify-center">
                  {/* Glowing Pink Corner Brackets */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-pink-500 rounded-tl-lg"></div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-pink-500 rounded-tr-lg"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-pink-500 rounded-bl-lg"></div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-pink-500 rounded-br-lg"></div>

                  {/* Animated Yellow Laser Scanning Line */}
                  <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-[0_0_8px_#facc15] animate-pulse"></div>

                  {!isCameraActive && (
                    <div className="text-center p-4 space-y-2 pointer-events-auto">
                      <QrCode className="h-12 w-12 text-emerald-400/50 mx-auto animate-pulse" />
                      <p className="text-xs text-emerald-300 font-semibold">
                        Point camera at box QR or token code
                      </p>
                      <p className="text-[11px] text-emerald-400/60 max-w-xs">
                        Or click one of the quick test batches below to simulate an immediate scan!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Camera Error Banner */}
              {cameraError && (
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-pink-950/90 border border-pink-500/50 text-[11px] text-pink-200 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-pink-400 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}
            </div>

            {/* Manual Code Input & Image Upload Bar */}
            <div className="mt-4 pt-3 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center gap-3 text-xs">
              <div className="flex-1 w-full flex items-center gap-2 bg-[#09150b] px-3 py-2 rounded-xl border border-emerald-800/80 focus-within:border-yellow-400">
                <QrCode className="h-4 w-4 text-yellow-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter Token or Batch Code (e.g. CLAIM-7B8A91, MZ-B902-BLR)..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleVerifyCode(manualCode);
                  }}
                  className="w-full bg-transparent text-white placeholder-emerald-400/50 focus:outline-hidden font-mono"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleVerifyCode(manualCode)}
                  disabled={isVerifying || !manualCode.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black cursor-pointer disabled:opacity-50 transition-all shrink-0 shadow-md shadow-emerald-500/25 border border-emerald-300/60"
                >
                  {isVerifying ? 'Verifying...' : 'Verify Token'}
                </button>

                <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-600/70 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 hover:text-white cursor-pointer transition-all shrink-0">
                  <Upload className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Upload QR</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Quick-Scan Simulation Chips */}
          <div className="rounded-2xl border border-emerald-800/60 bg-[#09150c] p-4 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-yellow-400" />
                <span>Simulate Instant Scans (1-Click Presets for Intake Testing)</span>
              </span>
              <span className="text-[10px] text-emerald-400/70 font-mono">FSSAI / FMCG Live DB</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {sampleTokens.map((t) => (
                <button
                  key={t.code}
                  onClick={() => {
                    setManualCode(t.code);
                    handleVerifyCode(t.code);
                  }}
                  className={`flex flex-col text-left p-2.5 rounded-xl border bg-[#061208] hover:scale-[1.02] transition-transform cursor-pointer space-y-1 ${t.color}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-[11px] font-bold">{t.code}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800/50 text-emerald-300">
                      {t.tag}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-white truncate">{t.label}</span>
                  <span className="text-[10px] text-emerald-400/80">{t.type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Verification Result Manifest & Intake Workflow (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Successful Intake Alert if just submitted */}
          {successReceipt && (
            <div className="rounded-2xl border border-emerald-500/50 bg-[#092211] p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>Inventory Intake Officially Completed!</span>
              </div>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Item <strong className="text-white">"{successReceipt.title}"</strong> has been checked, approved by quality protocol, and recorded into your active facility ledger.
              </p>
              <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-emerald-800/60">
                <span className="text-emerald-400/80">Gate Pass Manifest:</span>
                <span className="text-yellow-400 font-black">{successReceipt.manifestId}</span>
              </div>
            </div>
          )}

          {/* Active Scanned Record Manifest Card */}
          {scannedRecord ? (
            <div className="rounded-2xl border-2 border-yellow-500/40 bg-[#09150b] p-6 shadow-2xl space-y-5">
              <div className="flex items-start justify-between border-b border-emerald-900/60 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-md border border-yellow-400/30">
                    SCAN RESULT: {scannedRecord.tokenCode}
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">{scannedRecord.title}</h3>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-black text-yellow-400 font-mono">{scannedRecord.safetyScore}%</div>
                  <div className="text-[9px] text-emerald-400/80">Safety Score</div>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`p-3 rounded-xl flex items-center gap-2.5 text-xs font-bold ${
                scannedRecord.status === 'valid'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40'
                  : scannedRecord.status === 'temperature_alert'
                  ? 'bg-pink-950/80 text-pink-300 border border-pink-500/50'
                  : 'bg-yellow-950/80 text-yellow-300 border border-yellow-500/50'
              }`}>
                {scannedRecord.status === 'valid' ? (
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-pink-400 shrink-0" />
                )}
                <span>{scannedRecord.statusLabel}</span>
              </div>

              {/* Verified Item Metrics */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#061208] border border-emerald-900/50">
                  <span className="text-emerald-400/80">Source Facility:</span>
                  <span className="text-white font-semibold text-right truncate max-w-[200px]">{scannedRecord.sourceEntity}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-[#061208] border border-emerald-900/50">
                  <span className="text-emerald-400/80">Batch Quantity:</span>
                  <span className="text-yellow-300 font-mono font-bold">{scannedRecord.quantityInfo}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-[#061208] border border-emerald-900/50">
                  <span className="text-emerald-400/80 flex items-center gap-1.5">
                    <Thermometer className="h-3.5 w-3.5 text-pink-400" />
                    <span>Thermal Probe Reading:</span>
                  </span>
                  <span className="text-pink-300 font-mono font-bold">{scannedRecord.temperatureLog}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-[#061208] border border-emerald-900/50">
                  <span className="text-emerald-400/80 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-yellow-400" />
                    <span>Safe Shelf Window:</span>
                  </span>
                  <span className="text-yellow-300 font-mono font-bold">{scannedRecord.expiryDate}</span>
                </div>
              </div>

              {/* Intake Operator Form */}
              <div className="space-y-3 pt-2 border-t border-emerald-900/60 text-xs">
                <div>
                  <label className="block text-emerald-200/80 font-semibold mb-1">Receiving Officer / Operator</label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="w-full rounded-xl border border-emerald-800/80 bg-[#061208] px-3 py-2 text-white text-xs focus:border-yellow-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-emerald-200/80 font-semibold mb-1">Intake Inspection Notes (Optional)</label>
                  <input
                    type="text"
                    value={intakeNotes}
                    onChange={(e) => setIntakeNotes(e.target.value)}
                    placeholder="e.g. Tamper tape verified, Cambro warm at touch, lot placed in Aisle 3"
                    className="w-full rounded-xl border border-emerald-800/80 bg-[#061208] px-3 py-2 text-white text-xs focus:border-yellow-400 focus:outline-hidden placeholder-emerald-400/40"
                  />
                </div>
              </div>

              {/* Intake Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => handleConfirmIntake('accept')}
                  disabled={isProcessingIntake}
                  className="w-full flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs cursor-pointer shadow-lg shadow-emerald-500/25 border border-emerald-300/70 transition-transform hover:scale-[1.02] disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4 text-slate-950" />
                  <span>{isProcessingIntake ? 'Logging Intake...' : 'Accept & Add to Inventory'}</span>
                </button>

                <button
                  onClick={() => handleConfirmIntake('quarantine')}
                  disabled={isProcessingIntake}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl border border-emerald-700/70 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 text-xs font-bold cursor-pointer transition-all disabled:opacity-50"
                >
                  Flag Quarantine
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-800/60 bg-[#071309] p-6 text-center space-y-4 shadow-sm">
              <div className="h-16 w-16 rounded-2xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center mx-auto text-emerald-400">
                <QrCode className="h-8 w-8 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">No Item Scanned Yet</h4>
                <p className="text-xs text-emerald-200/70 max-w-sm mx-auto leading-relaxed">
                  Scan a QR code from a food cambro, FMCG food case, or cold storage transfer to inspect batch safety, authenticate credentials, and approve intake.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    handleVerifyCode('CLAIM-7B8A91');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-300 text-xs font-bold border border-emerald-400/50 cursor-pointer shadow-xs"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Try Sample 1 Outlet Intake</span>
                </button>
              </div>
            </div>
          )}

          {/* Scanned Intakes History Audit Log */}
          <div className="rounded-2xl border border-emerald-800/60 bg-[#071309] p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2.5">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileCheck2 className="h-4 w-4 text-emerald-400" />
                <span>Recent Intake Audit Manifests</span>
              </h4>
              <span className="text-[10px] font-mono text-emerald-400/70">
                {intakeHistory.length} Recorded
              </span>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {intakeHistory.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-emerald-900/50 bg-[#061208] p-3 text-xs space-y-1.5 hover:border-yellow-400/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-yellow-400 text-[11px]">{item.manifestId || item.tokenCode}</span>
                    <span className="text-[10px] text-emerald-400/70">{item.verifiedAt}</span>
                  </div>
                  <div className="text-white font-bold truncate">{item.title}</div>
                  <div className="flex items-center justify-between text-[11px] text-emerald-200/70">
                    <span className="truncate max-w-[180px]">By: {item.intakeOperator}</span>
                    <span className="font-mono font-semibold text-emerald-300">{item.quantityInfo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
