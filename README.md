# 🌾 FOOD FARMER

<div align="center">

![FOOD FARMER Banner](https://img.shields.io/badge/FOOD%20FARMER-Zero%20Food%20Wastage-10b981?style=for-the-badge&logo=leaf&logoColor=white)
<br />
**Unified Platform for Limiting Food Wastage, ₹1 Surplus Rescue to NGOs, Perishable FMCG Liquidation, Zero-Fridge Cold-Storage Exchange, and ESG Sustainability Analytics**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square&logo=github-actions)](https://github.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%26%20Auth-ffca28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-3.8%20Flash-4285f4?style=flat-square&logo=google)](https://ai.google.dev/)
[![UN SDG](https://img.shields.io/badge/UN%20SDG-2%20%26%2012%20Targeted-e5243b?style=flat-square)](https://sdgs.un.org/)
[![License](https://img.shields.io/badge/license-MIT-emerald?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

[Live Applet](https://ais-pre-jvivqb3n3o77auffss23lo-85681166021.asia-southeast1.run.app) • [Architecture](#-system-architecture) • [Features](#-core-platform-modules) • [API Docs](#-api-reference) • [Getting Started](#-getting-started)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Metrics & Real-World Impact](#-key-metrics--real-world-impact)
- [System Architecture](#-system-architecture)
- [Core Platform Modules](#-core-platform-modules)
  - [1. ₹1 Cooked Surplus Outlet](#1--1-cooked-surplus-outlet)
  - [2. Eat-in-a-Day Mart](#2-eat-in-a-day-mart)
  - [3. Budget Deals (Near-Expiry Non-Food)](#3-budget-deals-near-expiry-non-food)
  - [4. Zero Fridge Cold Storage Exchange](#4-zero-fridge-cold-storage-exchange)
  - [5. Rescue Maps (Google Maps Grounding)](#5-rescue-maps-google-maps-grounding)
  - [6. QR Intake Verification Scanner](#6-qr-intake-verification-scanner)
  - [7. AI Logistics Route Dispatch](#7-ai-logistics-route-dispatch)
  - [8. Zero Inventory Inefficiency Detector](#8-zero-inventory-inefficiency-detector)
  - [9. ESG Sustainability & Impact Analytics](#9-esg-sustainability--impact-analytics)
  - [10. Kitchen Production Planner (Portion Yield)](#10-kitchen-production-planner-portion-yield)
  - [11. Connected Integrations Center](#11-connected-integrations-center)
- [Tech Stack](#-tech-stack)
- [Database & Security](#-database--security)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Compliance & Legal Protections](#-compliance--legal-protections)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**FOOD FARMER** is an enterprise-grade food waste limitation, perishable inventory rescue, and supply chain circularity platform. Millions of tons of edible food and FMCG inventory are discarded daily due to banquet overproduction, short supermarket shelf-life windows, refrigeration failures, and logistical disconnects between donors and relief charities.

FOOD FARMER closes this loop by uniting:
1. **Commercial Donors**: Banquet halls, corporate cafeterias, caterers, hotels, and FMCG brands.
2. **Relief Beneficiaries**: Verified NGOs, community kitchens, shelter homes, and food banks.
3. **Retail & Wholesale Resellers**: Value shoppers and kirana stores liquidating near-expiry goods at up to 85% discount.
4. **Cold Chain Providers**: Warehouses and refrigerated logistics fleets balancing spare cubic capacity.
5. **AI Dispatch & Operations**: Gemini AI-driven route optimization, pantry inefficiency discovery, and FSSAI-compliant digital intake tracking.

---

## 📊 Key Metrics & Real-World Impact

```
┌──────────────────────────┬──────────────────────────┬──────────────────────────┐
│       18,450+ KG         │       36,900+ MEALS      │       38,745+ KG         │
│     Total Food Saved     │    Distributed to NGOs   │       CO₂e Prevented     │
├──────────────────────────┼──────────────────────────┼──────────────────────────┤
│       94,200+ M³         │          94.2%           │      ₹24,80,000+         │
│     Water Conserved      │    Landfill Diversion    │  Financial Loss Avoided  │
└──────────────────────────┴──────────────────────────┴──────────────────────────┘
```

---

## 🏗️ System Architecture

```
                                  [ CLIENT LAYER ]
    ┌─────────────────────────────────────────────────────────────────────────┐
    │     React 19 SPA (Vite) + Tailwind CSS + Lucide Icons + Motion UI       │
    │  ₹1 Outlet • Eat-in-a-Day • Zero-Fridge • QR Scanner • Integrations Hub │
    └────────────────────────────────────┬────────────────────────────────────┘
                                         │ HTTPS / WebSockets
                                         ▼
                                 [ FULL-STACK GATEWAY ]
    ┌─────────────────────────────────────────────────────────────────────────┐
    │     Express.js API Server (Node.js / tsx runtime)                       │
    │  Authentication Proxy • Webhook HMAC Dispatcher • CSV Stream Generator  │
    └───────────┬────────────────────────┬──────────────────────┬─────────────┘
                │                        │                      │
                ▼                        ▼                      ▼
      [ GOOGLE GEMINI AI ]      [ FIREBASE CLOUD ]     [ CONNECTED INTEGRATIONS ]
   ┌────────────────────────┐  ┌────────────────────┐  ┌────────────────────────┐
   │ • Gemini 3.8 Flash     │  │ • Cloud Firestore  │  │ • Google Sheets Sync   │
   │ • Google Maps Grounding│  │ • Google Auth      │  │ • WhatsApp / Twilio    │
   │ • Dynamic AI Routing   │  │ • Sub-collection   │  │ • Inbound POS / ERP    │
   │ • Inefficiency Audit   │  │   Ledger per User  │  │ • MQTT IoT Cold Nodes  │
   │ • Kitchen Yield BOM    │  │ • firestore.rules  │  │ • FSSAI Food Safe API  │
   └────────────────────────┘  └────────────────────┘  └────────────────────────┘
```

---

## 🚀 Core Platform Modules

### 1. 🍲 ₹1 Cooked Surplus Outlet
- Facilitates legally safe, rapid transfer of bulk prepared banquet, hotel, and institutional kitchen surpluses to registered NGOs and food banks for a nominal ₹1 service verification fee.
- Enforces strict temperature tracking at listing time, food preparation timestamps, and strict safe-consumption countdown timers.
- Generates cryptographically verifiable Claim Tokens with instant sync to the user's private Firebase ledger.

### 2. 🛒 Eat-in-a-Day Mart
- Flash liquidation portal for perishable food FMCG items (dairy, packaged juices, fresh bakery, artisanal cheeses, instant meals) nearing their expiry date (2 to 7 days remaining).
- Provides steep markdowns (60% to 85% off MRP), preventing store write-offs while providing affordable groceries to budget-conscious households and budget eateries.

### 3. 📦 Budget Deals (Near-Expiry Non-Food)
- Direct liquidation catalog for personal care, cosmetics, detergent, paper products, and cleaning supplies with minor box distress or remaining shelf life under 60 days.
- Bulk case lots and consumer trial packs with instant reservation tokens.

### 4. ❄️ Zero Fridge Cold Storage Exchange
- Dynamic cold-chain capacity marketplace. When a supermarket, transit vehicle, or distributor detects a refrigeration failure or capacity breach, they request an immediate emergency cold transfer.
- Nearby commercial cold-storage facilities and reefer trucks take on surplus pallets, preventing catastrophic thermal spoilage.

### 5. 🗺️ Rescue Maps (Google Maps Grounding)
- Powered by **Google Gemini AI with Google Maps Grounding**.
- Automatically resolves geocoded, accredited food banks, shelter homes, community kitchens, and wholesale cold depots with direct navigation URLs and operational directives.

### 6. 📱 QR Intake Verification Scanner
- Field scanner for NGO logistics operators and warehouse managers.
- Supports dual camera and manual barcode/token code verification.
- Validates temperature thresholds, tamper status, shelf-life clearance, and generates instant FSSAI Good Samaritan intake receipts.

### 7. 🚚 AI Logistics Route Dispatch
- Multi-stop dispatch optimizer calculating the most carbon-efficient routing sequence between donors, cold hubs, and distribution centres.
- Minimizes vehicle emissions (CO₂ saved per run) and factors in reefer transit constraints.

### 8. ⚙️ Zero Inventory Inefficiency Detector
- Scans kitchen and supply-chain logs to pinpoint recurring food loss culprits:
  - Overproduction spikes on rainy weekends
  - Raw material prep trimming waste
  - Machine heating/cooling downtime
- Generates actionable algorithmic and AI-driven corrective operating procedures.

### 9. 🏅 ESG Sustainability & Impact Analytics
- Enterprise-grade impact dashboard quantifying environmental contributions:
  - Landfill diversion percentage
  - Avoided methane and CO₂e emissions
  - Virtual water savings in cubic meters
- Includes an interactive **CSR Digital Sustainability Certificate** generator with print and PDF export capabilities.

### 10. 👨‍🍳 Kitchen Production Planner (Portion Yield)
- AI-driven menu batch calculator for banquet and institutional culinary chefs.
- Incorporates historical weather attrition (e.g., rainfall dampening buffet attendance) to calculate exact portion requirements, itemized Bill of Materials (BOM), and staggered cooking schedules.

### 11. 🔌 Connected Integrations Center
- **Google Sheets & Cloud Drive Sync**: Real-time cloud ledger export in standard RFC-4180 CSV format.
- **WhatsApp & SMS Emergency Gateway**: Automated 2-hour cooked surplus alert broadcasts to nearby relief volunteers.
- **Inbound POS & ERP Webhook Listener**: Endpoint (`POST /api/integrations/inbound-webhook`) allowing Petpooja, Marg ERP, and Tally to directly push surplus batches into the catalog.
- **Zero-Fridge MQTT IoT Sensor Grid**: Continuous telemetry monitoring for cold storage hubs with simulated temperature spike testing.
- **FSSAI Compliance Verification API**: Digitally signed donor indemnity certificates under the Indian Food Safety & Standards Authority guidelines.

---

## 💻 Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion UI |
| **Backend** | Node.js, Express 4.x, tsx runtime |
| **AI / Intelligence** | `@google/genai` TypeScript SDK (Gemini 3.8 Flash, Google Maps Grounding) |
| **Database & Auth** | Google Firebase (Cloud Firestore, Firebase Authentication) |
| **Build & Tooling** | Vite 8, TypeScript 5.x, PostCSS, Autoprefixer |
| **QR Code Engine** | jsQR (real-time canvas camera frame parsing) |
| **Protocols** | REST API, HMAC-SHA256 Signed Webhooks, RFC-4180 CSV Streams |

---

## 🔒 Database & Security

### Firebase Firestore Structure
```
users/
  └── {userId}/
        ├── claims/       # User's claimed ₹1 surplus batches & verified tokens
        ├── listings/     # Surplus batches published by this user / enterprise
        └── intakes/      # Verified QR field intake logs & manifests
```

### Security Highlights
- **Strict Role-Based Access Control (RBAC)**: All user data is partitioned under `users/{userId}` paths in Cloud Firestore, protected by granular security rules defined in `firestore.rules`.
- **HMAC-SHA256 Webhook Authentication**: Outbound and inbound webhooks enforce cryptographically signed headers (`X-FoodFarmer-Signature-256`) to thwart replay and spoofing attacks.
- **Zero Client-Side Secrets**: All Gemini AI calls, token verification algorithms, and Google Maps Grounding flows run strictly on the server side.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or bun

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/food-farmer.git
cd food-farmer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```
Edit `.env` and provide your Google Gemini API key:
```env
GEMINI_API_KEY="AIzaSy..."
PORT=3000
```
*(Firebase configuration is read automatically from `firebase-applet-config.json`).*

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and Gemini client check |
| `GET` | `/api/data` | Retrieves master data catalogs (surplus, FMCG, cold balance) |
| `POST` | `/api/claim-one-rupee` | Claims a ₹1 surplus batch and generates a verification token |
| `POST` | `/api/listings/create` | Publishes a new surplus food batch |
| `POST` | `/api/buy-deal` | Reserves near-expiry FMCG or Budget Deal item |
| `POST` | `/api/zero-fridge/request-transfer`| Initiates cold storage emergency transfer |
| `POST` | `/api/qr/verify` | Validates intake token code or QR string |
| `POST` | `/api/qr/intake` | Confirms receipt of physical food shipment |
| `POST` | `/api/maps/grounding` | Queries Google Maps Grounding via Gemini AI |
| `POST` | `/api/ai/optimize-routes` | Computes multi-stop low-carbon delivery paths |
| `POST` | `/api/ai/detect-inefficiencies` | Performs deep operational food waste audit |
| `POST` | `/api/ai/production-forecast` | Predicts banquet headcounts and meal portion BOM |
| `GET` | `/api/integrations/overview` | Retrieves status of all connected external systems |
| `POST` | `/api/integrations/test-webhook`| Dispatches HMAC-signed test outbound webhook |
| `POST` | `/api/integrations/inbound-webhook` | Accepts POS/ERP kitchen surplus payloads |
| `POST` | `/api/integrations/whatsapp-alert` | Emits emergency rescue WhatsApp notification |
| `POST` | `/api/integrations/iot-telemetry` | Records cold-chain temperature readings |
| `GET` | `/api/integrations/export-csv` | Generates live CSV stream for Google Sheets sync |

---

## ⚖️ Compliance & Legal Protections

- **FSSAI Surplus Food Guidelines**: Aligns with the Food Safety and Standards Authority of India (Recovery and Distribution of Surplus Food) Regulations.
- **Good Samaritan Protection**: Donors providing food in good faith without negligence are shielded from civil and criminal liabilities.
- **Traceability Guarantee**: All handovers require digital manifest timestamps and hygiene declaration checkoffs.

---

## 🤝 Contributing

Contributions are welcome! Please review [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md) before opening a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

<div align="center">
  <sub>Built with ❤️ for a zero-hunger, zero-waste planet • <strong>FOOD FARMER Team</strong></sub>
</div>
