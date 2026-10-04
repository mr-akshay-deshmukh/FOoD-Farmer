import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini client server-side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-Memory Database for demonstration with rich authentic data
export interface FoodListing {
  id: string;
  sourceType: 'function_hall' | 'kitchen' | 'food_bank' | 'caterer' | 'hotel';
  sourceName: string;
  title: string;
  foodCategory: 'cooked_meals' | 'rice_gravy' | 'bakery' | 'packed_thali' | 'dessert';
  portions: number;
  initialPortions: number;
  preparedAt: string;
  safeUntil: string;
  temperatureAtListing: string;
  location: string;
  contactPerson: string;
  phone: string;
  isVegetarian: boolean;
  hygieneCertified: boolean;
  status: 'available' | 'claimed' | 'in_transit';
  claimedByNgo?: string;
  claimToken?: string;
  co2SavedKg: number;
}

export interface FMCGFoodItem {
  id: string;
  brand: string;
  productName: string;
  category: string;
  quantityUnits: number;
  mrp: number;
  rescuePrice: number;
  discountPercent: number;
  manufacturingDate: string;
  expiryDate: string;
  daysToExpiry: number;
  batchCode: string;
  sellerMart: string;
  sellerLocation: string;
  status: 'available' | 'reserved' | 'sold';
}

export interface BudgetDealItem {
  id: string;
  brand: string;
  productName: string;
  category: 'cosmetics' | 'skincare' | 'personal_care' | 'hygiene' | 'cleaning';
  quantityUnits: number;
  mrp: number;
  rescuePrice: number;
  discountPercent: number;
  shelfLifeRemaining: string;
  batchCode: string;
  condition: 'Mint Box' | 'Minor Outer Scuff' | 'Display Stock Clearance';
  sellerName: string;
  sellerLocation: string;
  status: 'available' | 'reserved' | 'sold';
}

export interface ZeroFridgeTransfer {
  id: string;
  senderMart: string;
  senderLocation: string;
  currentFridgeCapacityPercent: number;
  warningReason: string;
  tempDegC: number;
  targetHubMart: string;
  targetHubLocation: string;
  targetHubFreezerCapacityPercent: number;
  items: { name: string; quantityKg: number; tempRequirement: string }[];
  status: 'requested' | 'accepted' | 'dispatched' | 'safely_stored';
  urgencyLevel: 'critical' | 'high' | 'moderate';
  vehicleAssigned?: string;
}

export interface InefficiencyLog {
  id: string;
  facility: string;
  type: 'overproduction' | 'raw_material_loss' | 'machine_downtime' | 'excessive_energy';
  metric: string;
  impactScore: 'High' | 'Medium' | 'Critical';
  lossEstimateRs: number;
  detectedAt: string;
  aiDiagnosis: string;
  actionTaken: boolean;
}

export interface ProductionPlan {
  id: string;
  date: string;
  facilityName: string;
  mealService: 'Lunch Banquet' | 'Dinner Buffet' | 'Institutional Canteen' | 'Corporate Dining';
  expectedHeadcount: number;
  weatherFactor: string;
  recommendedPortions: number;
  historicalSurplusRatio: number;
  predictedWasteAvoidedKg: number;
  bomIngredients: { item: string; exactQuantityKg: number; costSavingsRs: number }[];
}

// Initial seed data
let foodListings: FoodListing[] = [
  {
    id: 'RUPEE-101',
    sourceType: 'function_hall',
    sourceName: 'Shree Krishna Grand Convention Hall',
    title: 'Wedding Feast: Basmati Pulao, Paneer Butter Masala & Dal Tadka',
    foodCategory: 'cooked_meals',
    portions: 180,
    initialPortions: 180,
    preparedAt: '2 hours ago',
    safeUntil: '3.5 hours left',
    temperatureAtListing: '68°C (Hot Hold)',
    location: 'Sector 14, Outer Ring Road, Bengaluru',
    contactPerson: 'Master Chef Rajeshwar',
    phone: '+91 98450 12345',
    isVegetarian: true,
    hygieneCertified: true,
    status: 'available',
    co2SavedKg: 95.4,
  },
  {
    id: 'RUPEE-102',
    sourceType: 'caterer',
    sourceName: 'Royal Dawat Caterers & Banquets',
    title: 'Buffet Surplus: Veg Biryani, Chana Masala, Rotis & Gulab Jamun',
    foodCategory: 'cooked_meals',
    portions: 120,
    initialPortions: 120,
    preparedAt: '1.5 hours ago',
    safeUntil: '4 hours left',
    temperatureAtListing: '71°C (Thermal Cans)',
    location: 'Andheri West Industrial Hub, Mumbai',
    contactPerson: 'Vikram Joshi',
    phone: '+91 98200 45678',
    isVegetarian: true,
    hygieneCertified: true,
    status: 'available',
    co2SavedKg: 64.8,
  },
  {
    id: 'RUPEE-103',
    sourceType: 'kitchen',
    sourceName: 'TechPark Central Institutional Cafeteria',
    title: 'Daily Lunch Pack: Steamed Sona Masoori Rice, Sambar, Subzi',
    foodCategory: 'packed_thali',
    portions: 95,
    initialPortions: 95,
    preparedAt: '1 hour ago',
    safeUntil: '5 hours left',
    temperatureAtListing: '65°C (Insulated Trays)',
    location: 'Electronic City Phase 1, Bengaluru',
    contactPerson: 'Suresh Kumar (Admin)',
    phone: '+91 99001 22334',
    isVegetarian: true,
    hygieneCertified: true,
    status: 'available',
    co2SavedKg: 47.5,
  },
  {
    id: 'RUPEE-104',
    sourceType: 'food_bank',
    sourceName: 'City Seva Community Kitchen',
    title: 'Fortified Khichdi & Mixed Vegetable Porridge',
    foodCategory: 'rice_gravy',
    portions: 250,
    initialPortions: 250,
    preparedAt: '45 mins ago',
    safeUntil: '6 hours left',
    temperatureAtListing: '74°C (Sealed Vats)',
    location: 'Lajpat Nagar Central, New Delhi',
    contactPerson: 'Ananya Deshmukh',
    phone: '+91 98110 33445',
    isVegetarian: true,
    hygieneCertified: true,
    status: 'available',
    co2SavedKg: 130.0,
  },
];

let fmcgFoodItems: FMCGFoodItem[] = [
  {
    id: 'FMCG-201',
    brand: 'Coca-Cola / Maaza',
    productName: 'Maaza Mango Pulp Juice Tetra Pack (250ml x 24 units/case)',
    category: 'Beverages & Juices',
    quantityUnits: 45, // cases
    mrp: 960,
    rescuePrice: 190,
    discountPercent: 80,
    manufacturingDate: '2026-03-10',
    expiryDate: '2026-10-04',
    daysToExpiry: 4,
    batchCode: 'MZ-B902-BLR',
    sellerMart: 'Reliance Fresh Super Hub - Peenya',
    sellerLocation: 'Peenya Industrial Area, Bengaluru',
    status: 'available',
  },
  {
    id: 'FMCG-202',
    brand: 'Nestlé / Maggi',
    productName: 'Maggi 2-Minute Masala Noodles Pack of 12 (70g each)',
    category: 'Instant Noodles & Pasta',
    quantityUnits: 80, // packs
    mrp: 180,
    rescuePrice: 38,
    discountPercent: 79,
    manufacturingDate: '2026-04-15',
    expiryDate: '2026-10-06',
    daysToExpiry: 6,
    batchCode: 'MG-IN-8831',
    sellerMart: 'Spencers Daily Mart - Koramangala',
    sellerLocation: 'Koramangala 5th Block, Bengaluru',
    status: 'available',
  },
  {
    id: 'FMCG-203',
    brand: 'Amul',
    productName: 'Amul Taaza Homogenised Toned Milk 1L Brick',
    category: 'Dairy & Beverages',
    quantityUnits: 120, // bricks
    mrp: 74,
    rescuePrice: 18,
    discountPercent: 76,
    manufacturingDate: '2026-07-01',
    expiryDate: '2026-10-02',
    daysToExpiry: 2,
    batchCode: 'AM-TZ-290',
    sellerMart: 'Nilgiris Gourmet Mart - Indiranagar',
    sellerLocation: '100ft Road, Indiranagar, Bengaluru',
    status: 'available',
  },
  {
    id: 'FMCG-204',
    brand: 'Britannia',
    productName: 'Good Day Butter Cookies Family Pack (600g)',
    category: 'Biscuits & Bakery',
    quantityUnits: 65,
    mrp: 140,
    rescuePrice: 30,
    discountPercent: 78,
    manufacturingDate: '2026-05-12',
    expiryDate: '2026-10-08',
    daysToExpiry: 8,
    batchCode: 'BR-GD-109',
    sellerMart: 'Metro Cash & Carry - Yeshwantpur',
    sellerLocation: 'Yeshwantpur, Bengaluru',
    status: 'available',
  },
  {
    id: 'FMCG-205',
    brand: 'Kissan',
    productName: 'Kissan Fresh Tomato Ketchup Glass Bottle (950g)',
    category: 'Condiments & Sauces',
    quantityUnits: 35,
    mrp: 165,
    rescuePrice: 42,
    discountPercent: 75,
    manufacturingDate: '2026-01-20',
    expiryDate: '2026-10-05',
    daysToExpiry: 5,
    batchCode: 'KS-KT-552',
    sellerMart: 'D-Mart Super Center - Thane',
    sellerLocation: 'Ghodbunder Road, Thane',
    status: 'available',
  },
];

let budgetDealItems: BudgetDealItem[] = [
  {
    id: 'BDG-301',
    brand: 'Lakmé',
    productName: 'Eyeconic Liquid Waterproof Eyeliner Deep Black (4.5ml)',
    category: 'cosmetics',
    quantityUnits: 140,
    mrp: 290,
    rescuePrice: 58,
    discountPercent: 80,
    shelfLifeRemaining: '18 days before retail shelf rotation',
    batchCode: 'LK-EY-4401',
    condition: 'Mint Box',
    sellerName: 'Nykaa Warehouse Clearance Outlet',
    sellerLocation: 'Bhiwandi Logistics Hub, Maharashtra',
    status: 'available',
  },
  {
    id: 'BDG-302',
    brand: 'Nivea',
    productName: 'Nivea Body Milk Nourishing Lotion with Deep Moisture (400ml)',
    category: 'skincare',
    quantityUnits: 95,
    mrp: 450,
    rescuePrice: 99,
    discountPercent: 78,
    shelfLifeRemaining: '25 days before distributor lot recall',
    batchCode: 'NV-LOT-782',
    condition: 'Minor Outer Scuff',
    sellerName: 'Apollo Pharmacy Central Distribution',
    sellerLocation: 'Bommasandra Industrial Zone, Bengaluru',
    status: 'available',
  },
  {
    id: 'BDG-303',
    brand: "L'Oréal Paris",
    productName: 'Total Repair 5 Restoring Shampoo & Conditioner Combo (650ml)',
    category: 'personal_care',
    quantityUnits: 60,
    mrp: 699,
    rescuePrice: 175,
    discountPercent: 75,
    shelfLifeRemaining: '30 days packaging revision transition',
    batchCode: 'LOR-TR-903',
    condition: 'Display Stock Clearance',
    sellerName: 'Health & Glow Regional Store Hub',
    sellerLocation: 'Whitefield, Bengaluru',
    status: 'available',
  },
  {
    id: 'BDG-304',
    brand: 'Dettol',
    productName: 'Disinfectant Multi-Surface Spray & Floor Cleaner (1.2L)',
    category: 'cleaning',
    quantityUnits: 110,
    mrp: 320,
    rescuePrice: 65,
    discountPercent: 79,
    shelfLifeRemaining: '22 days distributor return lot',
    batchCode: 'DT-SP-112',
    condition: 'Mint Box',
    sellerName: 'Star Bazaar Hypermarket Clearance',
    sellerLocation: 'Sarjapur Road, Bengaluru',
    status: 'available',
  },
];

let zeroFridgeTransfers: ZeroFridgeTransfer[] = [
  {
    id: 'ZF-401',
    senderMart: 'Subzi & Dairy Corner Express (Mini Mart)',
    senderLocation: 'HSR Layout Sector 2, Bengaluru',
    currentFridgeCapacityPercent: 96,
    warningReason: 'Primary Chiller Compressor Thermal Overload (Risk of Spoilage in 4h)',
    tempDegC: 4.8,
    targetHubMart: 'Mega Cold-Chain Hub Central (Cold Storage Bay B)',
    targetHubLocation: 'Singasandra Industrial Cold Storage, Bengaluru',
    targetHubFreezerCapacityPercent: 38, // plenty of space
    items: [
      { name: 'Mother Dairy Paneer Bricks (1kg x 40)', quantityKg: 40, tempRequirement: '2°C to 4°C' },
      { name: 'Kwality Wall’s Ice Cream Bulk Tubs (4L x 15)', quantityKg: 60, tempRequirement: '-18°C' },
      { name: 'Safal Green Frozen Peas (500g x 70 bags)', quantityKg: 35, tempRequirement: '-18°C' },
      { name: 'Greek Yogurt & Cheese Slabs', quantityKg: 25, tempRequirement: '3°C' },
    ],
    status: 'requested',
    urgencyLevel: 'critical',
  },
  {
    id: 'ZF-402',
    senderMart: 'GreenGrocers Local Mart - Bandra',
    senderLocation: 'Pali Hill, Bandra West, Mumbai',
    currentFridgeCapacityPercent: 91,
    warningReason: 'Scheduled 6-hour power feeder maintenance tomorrow morning',
    tempDegC: 3.2,
    targetHubMart: 'Godrej Agrovet Chilled Distribution Terminal',
    targetHubLocation: 'Vikhroli West, Mumbai',
    targetHubFreezerCapacityPercent: 44,
    items: [
      { name: 'Amul Butter Slabs (500g x 80)', quantityKg: 40, tempRequirement: '4°C' },
      { name: 'Imported Frozen Berries & Purees', quantityKg: 30, tempRequirement: '-16°C' },
    ],
    status: 'accepted',
    urgencyLevel: 'high',
    vehicleAssigned: 'Insulated Reefer EV Van #KA-01-EV-4412',
  },
];

let inefficiencyLogs: InefficiencyLog[] = [
  {
    id: 'INEFF-501',
    facility: 'Central Kitchen - Grand Palace Banquets',
    type: 'overproduction',
    metric: '38% surplus cooked (Prep: 520 portions, Consumed: 320 portions)',
    impactScore: 'Critical',
    lossEstimateRs: 48500,
    detectedAt: 'Today at 02:30 PM',
    aiDiagnosis: 'Headcount buffer formula in catering ERP was set to +35% without rain-adjusted attendance discounting.',
    actionTaken: false,
  },
  {
    id: 'INEFF-502',
    facility: 'Walk-In Chiller #3 - Whitefield Distribution Hub',
    type: 'machine_downtime',
    metric: 'Compressor cycling 14 times/hour (Norm: 4-6 times/hour)',
    impactScore: 'High',
    lossEstimateRs: 18200,
    detectedAt: 'Today at 08:15 AM',
    aiDiagnosis: 'Magnetic door gasket seal leak detected on lower left corner; cold air escaping, driving up power load.',
    actionTaken: true,
  },
  {
    id: 'INEFF-503',
    facility: 'Raw Ingredient Store - Marathahalli Processing Unit',
    type: 'raw_material_loss',
    metric: '42 kg onions & 28 kg tomatoes discarded due to shelf rotting',
    impactScore: 'Medium',
    lossEstimateRs: 6400,
    detectedAt: 'Yesterday at 06:00 PM',
    aiDiagnosis: 'FIFO (First-In, First-Out) crate rotation protocol bypassed during Wednesday supplier unboxing.',
    actionTaken: false,
  },
  {
    id: 'INEFF-504',
    facility: 'SuperMart Cold Island Display - Indiranagar',
    type: 'excessive_energy',
    metric: 'Power draw 18.4 kWh above seasonal baseline (34% excess energy)',
    impactScore: 'Medium',
    lossEstimateRs: 9200,
    detectedAt: 'Today at 11:45 AM',
    aiDiagnosis: 'Condenser coils clogged with ambient dust; heat exchange efficiency reduced by 29%. Scheduled coil wash.',
    actionTaken: false,
  },
];

let productionPlans: ProductionPlan[] = [
  {
    id: 'PROD-601',
    date: '2026-10-01',
    facilityName: 'Apex Corporate Dining & Kitchens',
    mealService: 'Lunch Banquet',
    expectedHeadcount: 450,
    weatherFactor: 'Scattered Showers (WFH probability: 14%)',
    recommendedPortions: 385,
    historicalSurplusRatio: 19.4,
    predictedWasteAvoidedKg: 32.5,
    bomIngredients: [
      { item: 'Basmati Rice', exactQuantityKg: 38.5, costSavingsRs: 2800 },
      { item: 'Paneer / Cottage Cheese', exactQuantityKg: 28.8, costSavingsRs: 5200 },
      { item: 'Tomatoes & Onion Base', exactQuantityKg: 32.0, costSavingsRs: 1950 },
      { item: 'Cooking Oil & Spices', exactQuantityKg: 6.2, costSavingsRs: 1100 },
    ],
  },
];

// Logistics state
let dispatchQueue = [
  {
    id: 'DISP-701',
    vehicleId: 'EV-REEFER-01',
    vehicleType: 'Electric Insulated Reefer Van (Temp-Controlled)',
    driverName: 'Ramesh Patel (+91 98451 90812)',
    currentLocation: 'Koramangala 4th Block',
    stops: [
      { type: 'Pickup', location: 'Shree Krishna Grand Hall', payload: '180 Portions Hot Meals (₹1 Outlet)', priority: 'Urgent', status: 'Completed' },
      { type: 'Pickup', location: 'Subzi & Dairy Corner Express', payload: '160kg Chilled Batches (Zero Fridge)', priority: 'Critical', status: 'In Progress' },
      { type: 'Dropoff', location: 'Asha Deep Orphanage & Shelter', payload: '180 Portions Meals Handover', priority: 'Urgent', status: 'Pending' },
      { type: 'Dropoff', location: 'Mega Cold-Chain Hub Central', payload: 'Chilled Storage Transfer', priority: 'High', status: 'Pending' },
    ],
    status: 'en_route',
    etaMins: 22,
    co2SavedPerRunKg: 42.6,
  },
  {
    id: 'DISP-702',
    vehicleId: 'EV-CARGO-02',
    vehicleType: 'Eco Electric Cargo Delivery Truck',
    driverName: 'Mohammed Zaid (+91 98221 66723)',
    currentLocation: 'Peenya Industrial Dock',
    stops: [
      { type: 'Pickup', location: 'Reliance Fresh Super Hub', payload: '45 Cases Maaza (Eat in a Day Mart)', priority: 'Standard', status: 'Completed' },
      { type: 'Pickup', location: 'Apollo Pharmacy Central', payload: '95 Units Lotions (Budget Deal)', priority: 'Standard', status: 'In Progress' },
      { type: 'Dropoff', location: 'Local Kirana Federation Hub', payload: 'Wholesale Redistribution', priority: 'Standard', status: 'Pending' },
    ],
    status: 'en_route',
    etaMins: 38,
    co2SavedPerRunKg: 28.3,
  },
];

// Sustainability Aggregate Ledger
let sustainabilityMetrics = {
  totalFoodSavedKg: 18450,
  mealsProvidedToNeedy: 36900,
  co2PreventedKg: 38745,
  waterConservedM3: 94200,
  landfillDiversionPercent: 94.2,
  financialLossAvoidedRs: 2480000,
  registeredOutletsCount: 142,
  registeredNgosCount: 68,
  activeBadgesIssued: 84,
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), hasGeminiKey: !!apiKey });
});

app.get('/api/data', (req, res) => {
  res.json({
    foodListings,
    fmcgFoodItems,
    budgetDealItems,
    zeroFridgeTransfers,
    inefficiencyLogs,
    productionPlans,
    dispatchQueue,
    sustainabilityMetrics,
    hasGeminiKey: !!apiKey,
  });
});

// Claim ₹1 Food Batch by NGO
app.post('/api/claim-one-rupee', (req, res) => {
  const { listingId, ngoName, contactPhone, portionsRequested } = req.body;
  const listing = foodListings.find((item) => item.id === listingId);

  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  if (listing.status === 'claimed' || listing.portions <= 0) {
    return res.status(400).json({ error: 'This batch has already been fully claimed.' });
  }

  const claimCount = portionsRequested ? Math.min(portionsRequested, listing.portions) : listing.portions;
  listing.portions -= claimCount;

  if (listing.portions === 0) {
    listing.status = 'claimed';
  }
  listing.claimedByNgo = ngoName || 'Verified Community NGO';
  const token = `CLAIM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  listing.claimToken = token;

  // Update sustainability metrics
  const kgEstimated = claimCount * 0.45; // ~450g per meal portion
  sustainabilityMetrics.totalFoodSavedKg += Math.round(kgEstimated);
  sustainabilityMetrics.mealsProvidedToNeedy += claimCount;
  sustainabilityMetrics.co2PreventedKg += Math.round(kgEstimated * 2.2);

  res.json({
    success: true,
    message: `Successfully reserved ${claimCount} portions for ₹1 token fee!`,
    token,
    listing,
    sustainabilityMetrics,
  });
});

// Create new ₹1 Food Listing
app.post('/api/listings/create', (req, res) => {
  const { sourceType, sourceName, title, foodCategory, portions, location, contactPerson, phone, isVegetarian } = req.body;

  if (!sourceName || !title || !portions) {
    return res.status(400).json({ error: 'Missing required listing information' });
  }

  const newListing: FoodListing = {
    id: `RUPEE-${Math.floor(100 + Math.random() * 900)}`,
    sourceType: sourceType || 'kitchen',
    sourceName,
    title,
    foodCategory: foodCategory || 'cooked_meals',
    portions: Number(portions),
    initialPortions: Number(portions),
    preparedAt: 'Just now (Fresh)',
    safeUntil: '4.5 hours remaining',
    temperatureAtListing: '65°C - 70°C (Food Safe Temp)',
    location: location || 'Central Metro Hub',
    contactPerson: contactPerson || 'Kitchen Supervisor',
    phone: phone || '+91 99000 11111',
    isVegetarian: isVegetarian !== undefined ? isVegetarian : true,
    hygieneCertified: true,
    status: 'available',
    co2SavedKg: Math.round(Number(portions) * 0.52 * 10) / 10,
  };

  foodListings.unshift(newListing);
  res.json({ success: true, listing: newListing });
});

// Buy FMCG / Budget Deal Batch
app.post('/api/buy-deal', (req, res) => {
  const { type, id, quantity, buyerName, buyerRole } = req.body;

  if (type === 'fmcg') {
    const item = fmcgFoodItems.find((i) => i.id === id);
    if (!item) return res.status(404).json({ error: 'FMCG item not found' });
    const qty = quantity || item.quantityUnits;
    item.quantityUnits = Math.max(0, item.quantityUnits - qty);
    if (item.quantityUnits === 0) item.status = 'sold';

    sustainabilityMetrics.financialLossAvoidedRs += qty * (item.mrp - item.rescuePrice);
    sustainabilityMetrics.totalFoodSavedKg += Math.round(qty * 1.8);

    return res.json({ success: true, message: `Purchased ${qty} units of ${item.productName}`, item });
  } else if (type === 'budget') {
    const item = budgetDealItems.find((i) => i.id === id);
    if (!item) return res.status(404).json({ error: 'Budget item not found' });
    const qty = quantity || item.quantityUnits;
    item.quantityUnits = Math.max(0, item.quantityUnits - qty);
    if (item.quantityUnits === 0) item.status = 'sold';

    sustainabilityMetrics.financialLossAvoidedRs += qty * (item.mrp - item.rescuePrice);
    return res.json({ success: true, message: `Purchased ${qty} units of ${item.productName}`, item });
  }

  res.status(400).json({ error: 'Invalid deal type' });
});

// Create Zero Fridge Emergency Transfer
app.post('/api/zero-fridge/request-transfer', (req, res) => {
  const { senderMart, senderLocation, warningReason, tempDegC, items, urgencyLevel } = req.body;

  const newTransfer: ZeroFridgeTransfer = {
    id: `ZF-${Math.floor(400 + Math.random() * 599)}`,
    senderMart: senderMart || 'QuickMart Express Branch 4',
    senderLocation: senderLocation || 'Main Commercial Road',
    currentFridgeCapacityPercent: 95,
    warningReason: warningReason || 'Capacity limit exceeded / Chiller maintenance alert',
    tempDegC: tempDegC || 4.2,
    targetHubMart: 'Mega Cold-Chain Hub Central (Cold Storage Bay B)',
    targetHubLocation: 'Industrial Cold Storage Logistics Park',
    targetHubFreezerCapacityPercent: 35,
    items: items || [
      { name: 'Dairy & Cheese Crates', quantityKg: 50, tempRequirement: '2°C to 4°C' },
      { name: 'Frozen Goods & Ice Creams', quantityKg: 40, tempRequirement: '-18°C' },
    ],
    status: 'requested',
    urgencyLevel: urgencyLevel || 'critical',
  };

  zeroFridgeTransfers.unshift(newTransfer);

  // Add auto-dispatch task to queue
  dispatchQueue.unshift({
    id: `DISP-${Math.floor(700 + Math.random() * 200)}`,
    vehicleId: 'EV-REEFER-03',
    vehicleType: 'Electric Insulated Reefer Van (Temp-Controlled)',
    driverName: 'Kiran Deep (+91 99120 44556)',
    currentLocation: senderLocation || 'Main Commercial Road',
    stops: [
      { type: 'Pickup', location: newTransfer.senderLocation, payload: `Zero Fridge Salvage (${newTransfer.items.length} lots)`, priority: 'Critical', status: 'In Progress' },
      { type: 'Dropoff', location: newTransfer.targetHubLocation, payload: 'Reefer Storage Offload', priority: 'Critical', status: 'Pending' },
    ],
    status: 'en_route',
    etaMins: 15,
    co2SavedPerRunKg: 34.0,
  });

  res.json({ success: true, transfer: newTransfer });
});

// In-Memory QR Intake Ledger
let qrIntakeRecords: any[] = [
  {
    id: 'INTAKE-901',
    tokenCode: 'CLAIM-7B8A91',
    itemType: 'surplus_food',
    title: 'Hyderabadi Veg Dum Biryani & Mirchi Ka Salan (150 Portions)',
    sourceEntity: 'Grand Palace Convention Center',
    destinationEntity: 'Feeding India Community Shelter (Koramangala)',
    verifiedAt: 'Today at 01:15 PM',
    quantityInfo: '150 Meal Portions (Sealed Cambros)',
    status: 'valid',
    statusLabel: 'FSSAI Verified & Food-Safe',
    temperatureLog: '68.2°C (Optimal Safe Range)',
    expiryDate: 'Safe for 3.5 Hours',
    safetyScore: 99,
    intakeOperator: 'Ramesh Kumar (Food Bank Lead)',
    intakeNotes: 'Digital thermo-probe checked; tamper-evident security tape intact.',
    intakeStatus: 'intake_verified',
    manifestId: 'MANIFEST-FF-9021',
  },
  {
    id: 'INTAKE-902',
    tokenCode: 'MZ-B902-BLR',
    itemType: 'fmcg_food',
    title: 'Maaza Mango Pulp Juice Tetra Pack (250ml x 24 units/case)',
    sourceEntity: 'Reliance Fresh Super Hub - Peenya',
    destinationEntity: 'Annapurna Discount Mart #4',
    verifiedAt: 'Today at 10:45 AM',
    quantityInfo: '20 Cases (480 Tetra Bricks)',
    status: 'valid',
    statusLabel: 'Authentic FMCG Lot Verified',
    temperatureLog: 'Ambient 22.4°C (Dry Storage)',
    expiryDate: '2026-10-04 (4 Days Left)',
    safetyScore: 98,
    intakeOperator: 'Sunil Rao (Mart Inventory Mgr)',
    intakeNotes: 'Barcode scanned and checked against manufacturer batch registry.',
    intakeStatus: 'intake_verified',
    manifestId: 'MANIFEST-FF-9018',
  },
  {
    id: 'INTAKE-903',
    tokenCode: 'ZF-401',
    itemType: 'cold_storage_transfer',
    title: 'Emergency Reefer Salvage (Ice Cream Tubs & Frozen Peas)',
    sourceEntity: 'DailyNeeds SuperMart - Indiranagar',
    destinationEntity: 'Metro Cash & Carry Cold Logistics Hub',
    verifiedAt: 'Today at 08:30 AM',
    quantityInfo: '120 kg Chilled & Deep-Freeze Cargo',
    status: 'valid',
    statusLabel: 'Cold-Chain Intact (-18.4°C)',
    temperatureLog: '-18.4°C (Continuous Data Logger)',
    expiryDate: 'Cold Storage Extended (60 Days)',
    safetyScore: 100,
    intakeOperator: 'Kavita Hegde (Cold Storage Sup.)',
    intakeNotes: 'Reefer EV van docked at Bay 4. No temperature breach detected.',
    intakeStatus: 'intake_verified',
    manifestId: 'MANIFEST-FF-9014',
  },
];

// QR Verification Endpoint
app.post('/api/qr/verify', (req, res) => {
  const { code, scanningRole } = req.body;
  const rawCode = (code || '').trim();

  if (!rawCode) {
    return res.status(400).json({ error: 'No barcode or QR code payload provided' });
  }

  // 1. Check in ₹1 Food Listings
  const foodMatch = foodListings.find(
    (item) => item.id.toLowerCase() === rawCode.toLowerCase() || 
              (item.claimToken && item.claimToken.toLowerCase() === rawCode.toLowerCase())
  );
  if (foodMatch) {
    const isAvailable = foodMatch.status === 'available' || foodMatch.status === 'claimed';
    return res.json({
      success: true,
      record: {
        id: `INTAKE-${Math.floor(1000 + Math.random() * 9000)}`,
        tokenCode: foodMatch.claimToken || foodMatch.id,
        itemType: 'surplus_food',
        title: foodMatch.title,
        sourceEntity: foodMatch.sourceName,
        destinationEntity: foodMatch.claimedByNgo || (scanningRole === 'food_bank' ? 'Authorized Food Bank Shelter' : 'Community Kitchen Partner'),
        verifiedAt: 'Just now',
        quantityInfo: `${foodMatch.portions} Meals (Fresh Cooked Batch)`,
        status: isAvailable ? 'valid' : 'already_redeemed',
        statusLabel: isAvailable ? 'Verified FSSAI Safe Food Batch' : 'Batch Already Disbursed',
        temperatureLog: foodMatch.temperatureAtListing || '67.5°C (Food Safe Temp)',
        expiryDate: foodMatch.safeUntil || '4 Hours Remaining',
        safetyScore: 98,
        intakeOperator: 'Active Intake Specialist',
        intakeStatus: 'pending_intake',
      },
    });
  }

  // 2. Check in FMCG Food Items
  const fmcgMatch = fmcgFoodItems.find(
    (item) => item.id.toLowerCase() === rawCode.toLowerCase() || 
              item.batchCode.toLowerCase() === rawCode.toLowerCase()
  );
  if (fmcgMatch) {
    const isCritical = fmcgMatch.daysToExpiry <= 2;
    return res.json({
      success: true,
      record: {
        id: `INTAKE-${Math.floor(1000 + Math.random() * 9000)}`,
        tokenCode: fmcgMatch.batchCode || fmcgMatch.id,
        itemType: 'fmcg_food',
        title: `${fmcgMatch.brand} - ${fmcgMatch.productName}`,
        sourceEntity: fmcgMatch.sellerMart,
        destinationEntity: scanningRole === 'food_bank' ? 'Food Bank Dry Ration Depot' : 'Local Mart Intake Bay',
        verifiedAt: 'Just now',
        quantityInfo: `${fmcgMatch.quantityUnits} Units/Cases (Wholesale Lot)`,
        status: isCritical ? 'expired_warning' : 'valid',
        statusLabel: isCritical ? 'Urgent Liquidation (Within 48h)' : 'Verified Near-Expiry FMCG Food Lot',
        temperatureLog: 'Ambient (21°C - 24°C)',
        expiryDate: `${fmcgMatch.expiryDate} (${fmcgMatch.daysToExpiry} days left)`,
        safetyScore: isCritical ? 85 : 97,
        intakeOperator: 'Inventory Receiving Officer',
        intakeStatus: 'pending_intake',
      },
    });
  }

  // 3. Check in Budget Deals
  const budgetMatch = budgetDealItems.find(
    (item) => item.id.toLowerCase() === rawCode.toLowerCase() || 
              item.batchCode.toLowerCase() === rawCode.toLowerCase()
  );
  if (budgetMatch) {
    return res.json({
      success: true,
      record: {
        id: `INTAKE-${Math.floor(1000 + Math.random() * 9000)}`,
        tokenCode: budgetMatch.batchCode || budgetMatch.id,
        itemType: 'budget_deal',
        title: `${budgetMatch.brand} - ${budgetMatch.productName}`,
        sourceEntity: budgetMatch.sellerName,
        destinationEntity: 'Retail Mart Receiving Bay',
        verifiedAt: 'Just now',
        quantityInfo: `${budgetMatch.quantityUnits} Units (${budgetMatch.condition})`,
        status: 'valid',
        statusLabel: 'Verified Non-Food Clearance Inventory',
        temperatureLog: 'Dry Ambient Store',
        expiryDate: budgetMatch.shelfLifeRemaining,
        safetyScore: 96,
        intakeOperator: 'Warehouse Receiver',
        intakeStatus: 'pending_intake',
      },
    });
  }

  // 4. Check in Zero Fridge
  const zeroFridgeMatch = zeroFridgeTransfers.find(
    (item) => item.id.toLowerCase() === rawCode.toLowerCase()
  );
  if (zeroFridgeMatch) {
    const isCritical = zeroFridgeMatch.tempDegC > 5;
    return res.json({
      success: true,
      record: {
        id: `INTAKE-${Math.floor(1000 + Math.random() * 9000)}`,
        tokenCode: zeroFridgeMatch.id,
        itemType: 'cold_storage_transfer',
        title: `Cold Storage Transfer (${zeroFridgeMatch.items.map(i => i.name).join(', ')})`,
        sourceEntity: zeroFridgeMatch.senderMart,
        destinationEntity: zeroFridgeMatch.targetHubMart,
        verifiedAt: 'Just now',
        quantityInfo: `${zeroFridgeMatch.items.reduce((acc, curr) => acc + curr.quantityKg, 0)} kg Chilled Inventory`,
        status: isCritical ? 'temperature_alert' : 'valid',
        statusLabel: isCritical ? 'Chilled Temperature Alert (>5°C)' : 'Verified Cold-Chain Handover',
        temperatureLog: `${zeroFridgeMatch.tempDegC}°C (IoT Sensor Validated)`,
        expiryDate: 'Continuous Reefer Storage Required',
        safetyScore: isCritical ? 78 : 99,
        intakeOperator: 'Cold Storage Terminal Operator',
        intakeStatus: 'pending_intake',
      },
    });
  }

  // 5. Fallback for generic or custom scanned codes
  res.json({
    success: true,
    record: {
      id: `INTAKE-${Math.floor(1000 + Math.random() * 9000)}`,
      tokenCode: rawCode.toUpperCase(),
      itemType: rawCode.toLowerCase().includes('food') || rawCode.toLowerCase().includes('rupee') ? 'surplus_food' : 'fmcg_food',
      title: `Verified Supply Batch #${rawCode.toUpperCase()}`,
      sourceEntity: 'Accredited Food Farmer Partner Facility',
      destinationEntity: scanningRole === 'food_bank' ? 'Community Food Relief Vault' : 'Authorized Mart Receiving Bay',
      verifiedAt: 'Just now',
      quantityInfo: 'Standard Sealed Intake Lot',
      status: 'valid',
      statusLabel: 'FSSAI Chain-of-Custody Verified',
      temperatureLog: '65.8°C / 4.2°C Validated Sensor Probe',
      expiryDate: 'Active Window Verified',
      safetyScore: 95,
      intakeOperator: 'Intake Inspector',
      intakeStatus: 'pending_intake',
    },
  });
});

// Process Official Intake Confirmation
app.post('/api/qr/intake', (req, res) => {
  const { record, operatorName, targetFacility, intakeNotes, action } = req.body;

  if (!record) {
    return res.status(400).json({ error: 'No record provided for intake' });
  }

  const manifestId = `MANIFEST-FF-${Math.floor(1000 + Math.random() * 9000)}`;
  const intakeRecord = {
    ...record,
    id: `INTAKE-${Math.floor(1000 + Math.random() * 9000)}`,
    intakeOperator: operatorName || 'Registered Intake Officer',
    destinationEntity: targetFacility || record.destinationEntity,
    intakeNotes: intakeNotes || (action === 'quarantine' ? 'Flagged for quality quarantine re-inspection' : 'Verified, temperature checked and logged into inventory.'),
    intakeStatus: action === 'quarantine' ? 'quarantined' : 'intake_verified',
    manifestId,
    verifiedAt: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  qrIntakeRecords.unshift(intakeRecord);

  // Increment sustainability impact if verified intake
  if (action !== 'quarantine') {
    sustainabilityMetrics.totalFoodSavedKg += 45;
    sustainabilityMetrics.co2PreventedKg += 95;
    sustainabilityMetrics.mealsProvidedToNeedy += 30;
  }

  res.json({
    success: true,
    intakeRecord,
    manifestId,
    sustainabilityMetrics,
    message: action === 'quarantine' ? 'Item flagged and quarantined for secondary audit.' : 'Intake successfully logged! Inventory updated.',
  });
});

// Get recent intake verification records
app.get('/api/qr/recent-intakes', (req, res) => {
  res.json({ success: true, records: qrIntakeRecords });
});

// Live Google Maps Grounded Places & Rescue Hubs
app.post('/api/maps/grounding', async (req, res) => {
  const { query: userQueryParam, latitude, longitude, city } = req.body;
  const userQuery = (userQueryParam || '').trim() || 'Food banks, hunger relief community kitchens, NGOs, and cold storage facilities';
  const cityName = city || 'Bengaluru, India';
  
  if (ai) {
    try {
      const prompt = `Find up-to-date and accurate real-world locations for: "${userQuery}" near ${cityName}.
For each location, provide the official name, address or landmark, type of facility (Food Bank, Banquet Kitchen, Cold Storage, NGO Shelter, or FMCG Clearance), and operational insights for food rescue pickup and donation dropoffs.`;

      const config: any = {
        tools: [{ googleMaps: {} }],
      };

      if (latitude && longitude && !isNaN(Number(latitude)) && !isNaN(Number(longitude))) {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: Number(latitude),
              longitude: Number(longitude),
            }
          }
        };
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config,
      });

      const text = response.text || '';
      const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      const places: Array<{ title: string; uri: string; snippet?: string }> = [];
      for (const chunk of rawChunks) {
        if (chunk.maps) {
          const title = chunk.maps.title || 'Verified Food Partner Hub';
          const uri = chunk.maps.uri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title + ' ' + cityName)}`;
          let snippet = '';
          const reviewSnippets = chunk.maps.placeAnswerSources?.reviewSnippets;
          if (Array.isArray(reviewSnippets) && reviewSnippets.length > 0) {
            snippet = reviewSnippets.map((s: any) => s.snippet || '').filter(Boolean).join(' · ');
          }
          places.push({
            title,
            uri,
            snippet,
          });
        }
      }

      return res.json({
        success: true,
        aiGenerated: true,
        text,
        places,
        query: userQuery,
        city: cityName,
      });
    } catch (err: any) {
      console.warn('Google Maps Grounding error, falling back to curated verified locations:', err.message);
    }
  }

  // Fallback authentic locations with valid Google Maps links
  const fallbackPlaces = [
    {
      title: 'Robin Hood Army & Feeding India Hub',
      uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Feeding India Hub ' + cityName)}`,
      snippet: 'Active community grain & cooked food collection depot with rapid distribution networks.',
    },
    {
      title: 'Akshaya Patra Mega Central Kitchen',
      uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Akshaya Patra Kitchen ' + cityName)}`,
      snippet: 'State-of-the-art steam cooking facility with HACCP certified hot meal Cambro loading bays.',
    },
    {
      title: 'Industrial Cold-Chain Reefer Terminal',
      uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Cold Storage Logistics Park ' + cityName)}`,
      snippet: 'Multi-temperature sub-zero and chilled chambers for emergency dairy and perishables offload.',
    },
    {
      title: 'Community Relief Shelter & Food Bank',
      uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Food Bank Shelter ' + cityName)}`,
      snippet: 'Registered NGO providing daily ₹1 meal distributions to migrant and homeless communities.',
    }
  ];

  res.json({
    success: true,
    aiGenerated: false,
    text: `Verified food recovery hubs and logistics points in ${cityName} supporting ₹1 cooked surplus dispatch, emergency cold-chain offload, and wholesale inventory clearance.`,
    places: fallbackPlaces,
    query: userQuery,
    city: cityName,
  });
});

// AI-based Logistics Route Optimization
app.post('/api/ai/optimize-routes', async (req, res) => {
  const { activePicks, vehicleType, trafficLevel } = req.body;

  if (ai) {
    try {
      const prompt = `You are an expert AI logistics dispatch controller for a multi-stream food rescue & perishable cargo network.
We have 4 active streams:
1. "₹1 Rupees Outlet" hot cooked surplus food (requires pickup and NGO delivery within 90 minutes before temperature drops below 60°C).
2. "Zero Fridge" cold perishables (dairy, paneer, ice creams) transferred between marts before chiller spoilage.
3. "Eat in a Day Mart" FMCG food cartons near expiry (Maaza, Maggi).
4. "Budget Deal" non-food clearance goods (lotions, eyeliner).

Vehicle configuration: ${vehicleType || 'Electric Insulated Reefer EV Van'}
Traffic conditions: ${trafficLevel || 'Moderate city traffic'}
Requested Waypoints: ${JSON.stringify(activePicks || foodListings.slice(0, 2))}

Generate an optimized dispatch itinerary. Output MUST be valid JSON format matching this schema:
{
  "routeTitle": string,
  "totalDistanceKm": number,
  "estimatedDurationMins": number,
  "co2ReductionKg": number,
  "coldChainIntegrityScore": string,
  "summary": string,
  "waypoints": [
    {
      "sequence": number,
      "type": "PICKUP" | "DROPOFF",
      "location": string,
      "cargo": string,
      "stream": "₹1 Outlet" | "Zero Fridge" | "Eat in a Day" | "Budget Deal",
      "timeWindow": string,
      "temperatureMonitoring": string,
      "instructions": string
    }
  ],
  "driverDirectives": [string]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, aiGenerated: true, plan: parsed });
    } catch (err: any) {
      console.warn('Gemini optimization fallback triggered:', err.message);
    }
  }

  // Algorithmic Fallback Optimizer
  const fallbackPlan = {
    routeTitle: 'Dynamic Eco-Loop: Urgent Hot Food & Zero-Fridge Chilled Consolidation',
    totalDistanceKm: 18.4,
    estimatedDurationMins: 38,
    co2ReductionKg: 46.8,
    coldChainIntegrityScore: '99.4% (Active Dual-Zone Reefer)',
    summary: 'Consolidated urgent cooked meal rescue with cold storage inter-mart balancing to prevent dead mileage and maintain HACCP thermal integrity.',
    waypoints: [
      {
        sequence: 1,
        type: 'PICKUP',
        location: 'Shree Krishna Grand Hall, Sector 14',
        cargo: '180 Portions Basmati Pulao & Paneer Butter Masala (Thermal Cambros)',
        stream: '₹1 Outlet',
        timeWindow: 'Next 25 mins',
        temperatureMonitoring: '68.5°C (Upper Insulated Bay)',
        instructions: 'Check tamper-evident seals and digital temperature probes before signing handover token.',
      },
      {
        sequence: 2,
        type: 'PICKUP',
        location: 'Subzi & Dairy Corner Express, HSR Layout',
        cargo: '160kg Chilled Paneer, Butter & Frozen Ice Cream Tubs',
        stream: 'Zero Fridge',
        timeWindow: 'Next 45 mins',
        temperatureMonitoring: '-18°C / 4°C (Lower Cold Reefer Bay)',
        instructions: 'Transfer crates directly from failing chiller to onboard -18°C freezer compartment.',
      },
      {
        sequence: 3,
        type: 'DROPOFF',
        location: 'Asha Deep Children Home & Community Shelter',
        cargo: '180 Hot Meals Handover for Dinner Distribution',
        stream: '₹1 Outlet',
        timeWindow: 'Within 60 mins',
        temperatureMonitoring: '64.2°C at delivery',
        instructions: 'Scan NGO verification QR code and disburse hot meals in stainless banquet trays.',
      },
      {
        sequence: 4,
        type: 'DROPOFF',
        location: 'Mega Cold-Chain Hub Central (Singasandra)',
        cargo: '160kg Chilled Inventory Intake',
        stream: 'Zero Fridge',
        timeWindow: 'Within 80 mins',
        temperatureMonitoring: '3.8°C / -18.2°C verified',
        instructions: 'Offload to Cold Storage Bay B racks. Update inter-mart transfer ledger.',
      },
    ],
    driverDirectives: [
      'Maintain thermal divider curtain between Hot Food Cambro zone and -18°C freezer bay.',
      'Use regenerative braking mode along Ring Road elevated corridor to save 12% EV battery.',
      'Notify recipient NGO 10 minutes prior to arrival via automated AnnaSetu SMS ping.',
    ],
  };

  res.json({ success: true, aiGenerated: false, plan: fallbackPlan });
});

// AI Inefficiency Anomaly Detection & Diagnosis
app.post('/api/ai/detect-inefficiencies', async (req, res) => {
  const { facilityType, inputTelemetry } = req.body;

  if (ai) {
    try {
      const prompt = `You are a certified Lean Food Operations & Industrial Energy Auditor.
Analyze this food production & cold storage facility telemetry:
Facility: ${facilityType || 'Institutional Banquet Kitchen & Cold Mart'}
Telemetry Data: ${JSON.stringify(inputTelemetry || inefficiencyLogs)}

Identify the core operational inefficiencies across:
1. Overproduction & recipe yield mismatch
2. Raw material pantry spoilage & FIFO failure
3. Cold storage machine cycling / compressor downtime
4. HVAC / refrigeration excessive electrical consumption

Output strictly JSON:
{
  "overallHealthIndex": number, // 0 to 100
  "primaryLossVector": string,
  "monthlyLossExposureRs": number,
  "co2WastageKg": number,
  "insights": [
    {
      "category": "Overproduction" | "Raw Material Loss" | "Machine Downtime" | "Energy Excess",
      "severity": "Critical" | "High" | "Medium",
      "observedAnomaly": string,
      "rootCause": string,
      "preventiveAction": string,
      "expectedSavingsRs": number
    }
  ],
  "operationalDirectives": [string]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, aiGenerated: true, diagnosis: parsed });
    } catch (err: any) {
      console.warn('Gemini inefficiency analysis fallback:', err.message);
    }
  }

  // Algorithmic Fallback
  const fallbackDiagnosis = {
    overallHealthIndex: 74,
    primaryLossVector: 'Institutional Buffet Over-Preparation & Chiller Door Infiltration',
    monthlyLossExposureRs: 124000,
    co2WastageKg: 1820,
    insights: [
      {
        category: 'Overproduction',
        severity: 'Critical',
        observedAnomaly: 'Kitchen prepared 520 portions when actual guest check-in was 320 (38% surplus).',
        rootCause: 'Static +35% catering buffer used instead of dynamic weather and RSVP RSVP regression modeling.',
        preventiveAction: 'Deploy AnnaSetu Smart Production Forecast to adjust buffer dynamically down to +8% with real-time attendance polling.',
        expectedSavingsRs: 48500,
      },
      {
        category: 'Machine Downtime',
        severity: 'High',
        observedAnomaly: 'Walk-In Chiller #3 compressor short-cycling 14 times per hour.',
        rootCause: 'Worn perimeter silicone gasket allowing ambient 28°C humid air infiltration.',
        preventiveAction: 'Replace magnetic door sweep gasket immediately (Cost: ₹1,800 vs ₹18,000 monthly motor wear).',
        expectedSavingsRs: 18200,
      },
      {
        category: 'Energy Excess',
        severity: 'Medium',
        observedAnomaly: 'Condenser coils running 34% above rated wattage during afternoon peak tariff.',
        rootCause: 'Dust and particulate buildup on external fin coils lowering heat rejection efficiency.',
        preventiveAction: 'Execute bi-weekly pressurized coil wash and optimize defrost cycles to off-peak tariff hours (01:00 AM - 05:00 AM).',
        expectedSavingsRs: 9200,
      },
      {
        category: 'Raw Material Loss',
        severity: 'Medium',
        observedAnomaly: '70kg bulk root vegetables discarded due to pantry bottom-crate rot.',
        rootCause: 'Suppliers unloading new crates on top of older crates, creating chronic FIFO bypass.',
        preventiveAction: 'Enforce AnnaSetu QR batch bin stickers with auto-flagging on crates older than 48 hours.',
        expectedSavingsRs: 6400,
      },
    ],
    operationalDirectives: [
      'Standardize banquet portioning scoops for high-cost proteins (Paneer, Dairy).',
      'Install automated IoT door contact sensors on all walk-in cold rooms (>90s door open buzzer).',
      'Schedule quarterly heat-pump thermal efficiency audits.',
    ],
  };

  res.json({ success: true, aiGenerated: false, diagnosis: fallbackDiagnosis });
});

// AI Smart Production Planning & Recipe BOM Calculator
app.post('/api/ai/production-forecast', async (req, res) => {
  const { eventType, bookedHeadcount, eventDate, weatherCondition, dietarySplit } = req.body;

  if (ai) {
    try {
      const prompt = `You are an AI culinary production planner for commercial banquet kitchens and institutional catering.
Inputs:
Event Type: ${eventType || 'Corporate Annual Gala & Buffet'}
Booked Headcount: ${bookedHeadcount || 350}
Event Date: ${eventDate || 'Tomorrow'}
Weather Forecast: ${weatherCondition || 'Rainy / Overcast (18% turnout attrition historical probability)'}
Dietary Split: ${dietarySplit || '65% Vegetarian, 35% Non-Veg'}

Calculate smart production plan to eliminate food waste while maintaining 100% guest satisfaction.
Output strictly JSON:
{
  "optimizedPortions": number,
  "portionReductionVsUnplanned": number,
  "wasteAvoidedKg": number,
  "costSavingsRs": number,
  "menuBOM": [
    {
      "dishName": string,
      "portionSizeGrams": number,
      "totalPreparedKg": number,
      "safetyBufferPortions": number,
      "primaryIngredients": string
    }
  ],
  "batchCookingSchedule": [
    {
      "timeSlot": string,
      "activity": string,
      "justInTimeBuffer": string
    }
  ],
  "chefTips": [string]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, aiGenerated: true, forecast: parsed });
    } catch (err: any) {
      console.warn('Gemini production forecast fallback:', err.message);
    }
  }

  // Algorithmic Fallback
  const count = Number(bookedHeadcount) || 350;
  const attritionFactor = weatherCondition?.toLowerCase().includes('rain') ? 0.88 : 0.94;
  const optimizedPortions = Math.round(count * attritionFactor);
  const diffPortions = count - optimizedPortions;
  const wasteKg = Math.round(diffPortions * 0.45);
  const savings = Math.round(diffPortions * 185);

  const fallbackForecast = {
    optimizedPortions,
    portionReductionVsUnplanned: diffPortions,
    wasteAvoidedKg: wasteKg,
    costSavingsRs: savings,
    menuBOM: [
      {
        dishName: 'Royal Saffron Pulao & Jeera Rice',
        portionSizeGrams: 160,
        totalPreparedKg: Math.round(optimizedPortions * 0.16),
        safetyBufferPortions: 15,
        primaryIngredients: 'Aged Basmati, Whole Spices, Ghee, Crispy Onions',
      },
      {
        dishName: 'Shahi Paneer Tikka Masala',
        portionSizeGrams: 140,
        totalPreparedKg: Math.round(optimizedPortions * 0.14),
        safetyBufferPortions: 12,
        primaryIngredients: 'Fresh Malai Paneer, Cashew Puree, Tomato Coulis',
      },
      {
        dishName: 'Dal Makhani Slow Simmered',
        portionSizeGrams: 120,
        totalPreparedKg: Math.round(optimizedPortions * 0.12),
        safetyBufferPortions: 15,
        primaryIngredients: 'Whole Black Lentils, Butter, Cream',
      },
      {
        dishName: 'Artisan Assorted Breads (Naan/Roti)',
        portionSizeGrams: 90,
        totalPreparedKg: Math.round(optimizedPortions * 0.1),
        safetyBufferPortions: 20,
        primaryIngredients: 'Whole Wheat Atta & Sharbati Flour',
      },
    ],
    batchCookingSchedule: [
      {
        timeSlot: 'T-Minus 3 Hours (10:00 AM)',
        activity: 'Base gravies and parboiled rice prep for 70% of base capacity (220 portions).',
        justInTimeBuffer: 'Zero risk lock-in.',
      },
      {
        timeSlot: 'T-Minus 45 Mins (12:15 PM)',
        activity: 'Verify live banquet hall gate check-in count via AnnaSetu IoT entrance monitor.',
        justInTimeBuffer: 'Adjust batch 2 finishing.',
      },
      {
        timeSlot: 'Service Hour (01:15 PM)',
        activity: 'Flash-cook remaining 20% naan breads and final rice steaming only as chafing dishes dip to 25%.',
        justInTimeBuffer: 'Cook-to-demand prevents post-buffet surplus.',
      },
    ],
    chefTips: [
      'Employ staggered chafing dish refilling (shallow 2.5 inch inserts rather than deep 4 inch trays) to prevent food dry-out and unserved leftovers.',
      'Keep base curries separated from paneer cubes until dish loading to preserve leftover reuse shelf-life.',
      'Surplus pristine kitchen batches are tagged directly for ₹1 NGO Outlet pickup at 03:30 PM.',
    ],
  };

  res.json({ success: true, aiGenerated: false, forecast: fallbackForecast });
});

// ==========================================
// INTEGRATIONS CENTER: WEBHOOKS, ERP, IOT, SHEETS & ALERTS
// ==========================================

interface WebhookLogRecord {
  id: string;
  eventType: string;
  targetEndpoint: string;
  timestamp: string;
  statusCode: number;
  latencyMs: number;
  payloadSnippet: string;
  status: 'success' | 'failed' | 'retrying';
}

interface IoTTelemetryNode {
  nodeId: string;
  facility: string;
  temperatureDegC: number;
  targetRangeDegC: string;
  humidityPercent: number;
  powerSource: 'Mains Grid' | 'Diesel Backup Generator' | 'Solar Cold-Inverter';
  status: 'optimal' | 'warning' | 'critical';
  lastPing: string;
}

let webhookLogs: WebhookLogRecord[] = [
  {
    id: 'WH-8841',
    eventType: 'surplus.batch_listed',
    targetEndpoint: 'https://webhook.site/foodfarmer-ngo-alert-bus',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    statusCode: 200,
    latencyMs: 38,
    payloadSnippet: '{"batchId":"RUPEE-101","portions":180,"hub":"Yeshwantpur"}',
    status: 'success',
  },
  {
    id: 'WH-8840',
    eventType: 'claim.token_verified',
    targetEndpoint: 'https://api.robinhoodarmy.org/webhooks/intake-event',
    timestamp: new Date(Date.now() - 44 * 60 * 1000).toISOString(),
    statusCode: 200,
    latencyMs: 51,
    payloadSnippet: '{"token":"CLAIM-VERIFIED-982","ngo":"Robin Hood Army"}',
    status: 'success',
  },
  {
    id: 'WH-8839',
    eventType: 'cold_chain.temperature_spike',
    targetEndpoint: 'https://iot-telemetry.foodfarmer.in/reefer-alert',
    timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    statusCode: 200,
    latencyMs: 29,
    payloadSnippet: '{"nodeId":"IOT-COLD-04","facility":"Reefer Truck #4","temp":5.8}',
    status: 'success',
  },
  {
    id: 'WH-8838',
    eventType: 'sheets.eod_sync',
    targetEndpoint: 'https://script.google.com/macros/s/foodfarmer-sync/exec',
    timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    statusCode: 200,
    latencyMs: 142,
    payloadSnippet: '{"syncedRecords":142,"esgCo2Kg":38745}',
    status: 'success',
  },
];

let iotNodes: IoTTelemetryNode[] = [
  {
    nodeId: 'IOT-COLD-01',
    facility: 'Central Metro Hub - Peenya Cold Deck',
    temperatureDegC: 2.4,
    targetRangeDegC: '1°C to 4°C',
    humidityPercent: 88,
    powerSource: 'Solar Cold-Inverter',
    status: 'optimal',
    lastPing: '2 mins ago',
  },
  {
    nodeId: 'IOT-COLD-02',
    facility: 'Indiranagar Quick-Chill Depot',
    temperatureDegC: 3.1,
    targetRangeDegC: '0°C to 4°C',
    humidityPercent: 84,
    powerSource: 'Mains Grid',
    status: 'optimal',
    lastPing: 'Just now',
  },
  {
    nodeId: 'IOT-COLD-03',
    facility: 'Whitefield Commercial Walk-In Freezer',
    temperatureDegC: -17.8,
    targetRangeDegC: '-18°C to -15°C',
    humidityPercent: 92,
    powerSource: 'Diesel Backup Generator',
    status: 'optimal',
    lastPing: '1 min ago',
  },
  {
    nodeId: 'IOT-COLD-04',
    facility: 'Rapid Reefer Transit Van #4',
    temperatureDegC: 4.8,
    targetRangeDegC: '1°C to 4°C',
    humidityPercent: 79,
    powerSource: 'Mains Grid',
    status: 'warning',
    lastPing: '4 mins ago',
  },
];

// 1. Get Integration Hub Overview
app.get('/api/integrations/overview', (req, res) => {
  const integrations = [
    {
      id: 'google_sheets_drive',
      name: 'Google Sheets & Drive Sync',
      category: 'cloud_sync',
      description: 'Continuous cloud sync of ₹1 surplus claims, liquidation ledger, and ESG impact certificates directly to Google Drive spreadsheet.',
      status: 'connected',
      icon: 'FileSpreadsheet',
      syncFrequency: 'Real-time on transaction',
      lastSyncedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      endpointUrl: 'https://docs.google.com/spreadsheets/d/1FoodFarmerLiveRescueGrid',
      authMethod: 'OAuth 2.0',
      metrics: {
        label: 'Rows Synced',
        value: '1,428 Records',
      },
    },
    {
      id: 'whatsapp_alerts',
      name: 'WhatsApp & SMS Urgent Broadcast',
      category: 'messaging',
      description: 'Automated 2-hour cooked surplus broadcast to verified NGO rescue teams and community kitchens within 5km radius.',
      status: 'connected',
      icon: 'MessageSquare',
      syncFrequency: 'Event-driven instant trigger',
      lastSyncedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      endpointUrl: 'https://api.twilio.com/2010-04-01/Accounts/AC_FOODFARMER/Messages',
      authMethod: 'API Key Bearer',
      metrics: {
        label: 'Broadcasts Delivered',
        value: '382 Alerts Sent (99.4%)',
      },
    },
    {
      id: 'erp_pos_webhook',
      name: 'ERP & POS Inbound Webhook (Tally / SAP / Marg)',
      category: 'erp_pos',
      description: 'Inbound HTTP webhook listener for banquet kitchens, supermarket POS, and hotels to automatically publish surplus batches without manual entry.',
      status: 'connected',
      icon: 'Webhook',
      syncFrequency: 'Inbound Webhook Listener',
      lastSyncedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      endpointUrl: '/api/integrations/inbound-webhook',
      authMethod: 'HMAC Signature',
      metrics: {
        label: 'Inbound Ingestions',
        value: '94 Batches Ingested',
      },
    },
    {
      id: 'iot_cold_chain',
      name: 'Zero-Fridge MQTT Cold Chain IoT',
      category: 'iot_sensors',
      description: 'Real-time telemetry stream from wireless temperature sensors in refrigerated vans, cold rooms, and blast chillers.',
      status: 'connected',
      icon: 'Cpu',
      syncFrequency: 'Every 30 seconds',
      lastSyncedAt: new Date(Date.now() - 30 * 1000).toISOString(),
      endpointUrl: 'mqtt://broker.foodfarmer.internal:1883/telemetry/cold-chain',
      authMethod: 'MQTT Broker',
      metrics: {
        label: 'Active Sensor Nodes',
        value: '4 Nodes Active (0.2°C Precision)',
      },
    },
    {
      id: 'fssai_compliance',
      name: 'FSSAI Food Safety & Indemnity API',
      category: 'compliance',
      description: 'Automated regulatory verification, batch shelf-life safety scores, and digital donor Good Samaritan indemnity certificate signing.',
      status: 'connected',
      icon: 'ShieldCheck',
      syncFrequency: 'On claim verification',
      lastSyncedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      endpointUrl: 'https://foscos.fssai.gov.in/api/v2/safe-surplus-verify',
      authMethod: 'API Key Bearer',
      metrics: {
        label: 'Certificates Signed',
        value: '100% Regulatory Pass',
      },
    },
    {
      id: 'logistics_fleet',
      name: 'On-Demand Reefer Delivery Fleet',
      category: 'logistics',
      description: 'Automated dispatch webhook integration with temperature-controlled 3-wheeler & van delivery logistics partners (Porter, Shadowfax).',
      status: 'connected',
      icon: 'Truck',
      syncFrequency: 'Dynamic On-Demand',
      lastSyncedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
      endpointUrl: 'https://api.porter.in/v1/deliveries/food-rescue',
      authMethod: 'API Key Bearer',
      metrics: {
        label: 'Fleet Pickups',
        value: '18 Active Van Dispatches',
      },
    },
  ];

  res.json({
    success: true,
    stats: {
      activeIntegrations: 6,
      uptimePercent: 99.98,
      avgLatencyMs: 39,
      totalEventsProcessed: 3280,
    },
    integrations,
    webhookLogs: webhookLogs.slice(0, 10),
    iotNodes,
  });
});

// 2. Test Dispatch Webhook Tool (Simulates outbound dispatch with HMAC header)
app.post('/api/integrations/test-webhook', (req, res) => {
  const { eventType, targetUrl, secretKey, customPayload } = req.body;

  const event = eventType || 'surplus.batch_listed';
  const url = targetUrl || 'https://webhook.site/foodfarmer-test-endpoint';
  const secret = secretKey || 'ff_sec_8a39d8fe01c8';
  
  const payloadData = customPayload || {
    event,
    timestamp: new Date().toISOString(),
    platform: 'FOOD FARMER',
    data: {
      batchId: `RUPEE-${Math.floor(100 + Math.random() * 900)}`,
      category: 'cooked_meals',
      title: 'Dum Biryani & Veg Gravy Surplus',
      portions: 85,
      temperatureLog: '68°C',
      donor: 'Metro Banquet Hall',
      safeUntilHoursRemaining: 3.5,
    },
  };

  const payloadString = JSON.stringify(payloadData);
  const hmacSignature = crypto
    .createHmac('sha256', secret)
    .update(payloadString)
    .digest('hex');

  const latency = Math.floor(25 + Math.random() * 40);
  const logId = `WH-${Math.floor(1000 + Math.random() * 9000)}`;

  const logEntry: WebhookLogRecord = {
    id: logId,
    eventType: event,
    targetEndpoint: url,
    timestamp: new Date().toISOString(),
    statusCode: 200,
    latencyMs: latency,
    payloadSnippet: payloadString.slice(0, 95) + '...',
    status: 'success',
  };

  webhookLogs.unshift(logEntry);
  if (webhookLogs.length > 50) webhookLogs.pop();

  res.json({
    success: true,
    message: `Webhook successfully dispatched to ${url}`,
    log: logEntry,
    headers: {
      'X-FoodFarmer-Event': event,
      'X-FoodFarmer-Signature-256': `sha256=${hmacSignature}`,
      'X-FoodFarmer-Delivery': logId,
      'Content-Type': 'application/json',
    },
    responsePayload: {
      acknowledged: true,
      httpStatus: 200,
      responseTimeMs: latency,
    },
  });
});

// 3. Inbound POS/ERP Ingestion Webhook (Receives surplus from external POS)
app.post('/api/integrations/inbound-webhook', (req, res) => {
  const { source, title, foodCategory, portions, location, contactPerson, phone } = req.body;

  if (!title || !portions) {
    return res.status(400).json({
      error: 'Missing required parameters: title and portions are required',
    });
  }

  const newId = `RUPEE-${Math.floor(200 + Math.random() * 800)}`;
  const co2Estimate = Math.round(Number(portions) * 0.52 * 10) / 10;

  const newListing: FoodListing = {
    id: newId,
    sourceType: (source?.type as any) || 'kitchen',
    sourceName: source?.name || 'Automated ERP Kitchen Sync',
    title,
    foodCategory: foodCategory || 'cooked_meals',
    portions: Number(portions),
    initialPortions: Number(portions),
    preparedAt: 'Just Now (ERP Ingested)',
    safeUntil: '4 hours left',
    temperatureAtListing: '68°C (Automated Ingest)',
    location: location || 'Whitefield Central Logistics, Bengaluru',
    contactPerson: contactPerson || 'POS Auto-Bridge',
    phone: phone || '+91 98000 00000',
    isVegetarian: true,
    hygieneCertified: true,
    status: 'available',
    co2SavedKg: co2Estimate,
  };

  foodListings.unshift(newListing);

  // Log inbound webhook event
  webhookLogs.unshift({
    id: `WH-IN-${Math.floor(1000 + Math.random() * 9000)}`,
    eventType: 'inbound.pos_inventory_sync',
    targetEndpoint: '/api/integrations/inbound-webhook',
    timestamp: new Date().toISOString(),
    statusCode: 201,
    latencyMs: 18,
    payloadSnippet: `Ingested ${portions} portions: ${title.slice(0, 30)}`,
    status: 'success',
  });

  res.status(201).json({
    success: true,
    message: `Batch ingested via ERP POS webhook into ₹1 Outlet catalog`,
    listing: newListing,
    totalAvailableListings: foodListings.filter((f) => f.status === 'available').length,
  });
});

// 4. WhatsApp & SMS Urgent Broadcast Dispatcher
app.post('/api/integrations/whatsapp-alert', (req, res) => {
  const { batchTitle, portions, location, safeUntil, recipientPhone } = req.body;

  const phone = recipientPhone || '+91 98450 11223';
  const dispatchId = `WA-MSG-${Math.floor(100000 + Math.random() * 900000)}`;

  const messageTemplate = `🍲 *FOOD FARMER RESCUE ALERT* (FSSAI Verified)\n` +
    `⚡ *${portions || 80} Portions Available Immediately!*\n` +
    `📍 Location: ${location || 'Koramangala Community Center'}\n` +
    `🥘 Item: ${batchTitle || 'Freshly Packed Veg Khichdi & Gravy'}\n` +
    `⏳ Safe Window: ${safeUntil || '3.5 Hours Remaining'}\n` +
    `👉 Claim Now for ₹1: https://foodfarmer.app/claim/${dispatchId}\n` +
    `_Good Samaritan Food Donation Act Protection Enforced._`;

  // Log event
  webhookLogs.unshift({
    id: `WH-WA-${Math.floor(1000 + Math.random() * 9000)}`,
    eventType: 'whatsapp.emergency_broadcast',
    targetEndpoint: `Twilio/WhatsApp Gateway (${phone})`,
    timestamp: new Date().toISOString(),
    statusCode: 200,
    latencyMs: 44,
    payloadSnippet: `Broadcasted to ${phone}: ${batchTitle}`,
    status: 'success',
  });

  res.json({
    success: true,
    dispatchId,
    recipient: phone,
    deliveredAt: new Date().toISOString(),
    status: 'delivered',
    messagePreview: messageTemplate,
  });
});

// 5. IoT Cold Chain Telemetry Updates
app.post('/api/integrations/iot-telemetry', (req, res) => {
  const { nodeId, temperatureDegC, humidityPercent, status } = req.body;

  const node = iotNodes.find((n) => n.nodeId === nodeId);
  if (node) {
    if (temperatureDegC !== undefined) node.temperatureDegC = Number(temperatureDegC);
    if (humidityPercent !== undefined) node.humidityPercent = Number(humidityPercent);
    if (status !== undefined) node.status = status;
    node.lastPing = 'Just now';

    // If temp spike detected, record warning log
    if (node.temperatureDegC > 5.0) {
      node.status = 'critical';
      webhookLogs.unshift({
        id: `WH-IOT-${Math.floor(1000 + Math.random() * 9000)}`,
        eventType: 'iot.cold_room_temperature_alert',
        targetEndpoint: 'ZeroFridge Dispatch Bus',
        timestamp: new Date().toISOString(),
        statusCode: 200,
        latencyMs: 12,
        payloadSnippet: `Critical temp spike: ${node.facility} reached ${node.temperatureDegC}°C`,
        status: 'success',
      });
    }
  }

  res.json({ success: true, updatedNode: node, allNodes: iotNodes });
});

// 6. Google Sheets / CSV Direct Cloud Export
app.get('/api/integrations/export-csv', (req, res) => {
  const headers = [
    'Batch_ID',
    'Catalog_Type',
    'Item_Title',
    'Source_Donor',
    'Portions_or_Units',
    'Location',
    'Status',
    'CO2_Prevented_Kg',
    'Prepared_or_Expiry',
    'Hygiene_Certified',
  ];

  const rows: string[] = [];
  rows.push(headers.join(','));

  // 1 Rupee listings
  foodListings.forEach((f) => {
    rows.push([
      `"${f.id}"`,
      `"1_Rupee_Outlet"`,
      `"${f.title.replace(/"/g, '""')}"`,
      `"${f.sourceName.replace(/"/g, '""')}"`,
      f.portions,
      `"${f.location.replace(/"/g, '""')}"`,
      `"${f.status}"`,
      f.co2SavedKg,
      `"${f.preparedAt}"`,
      f.hygieneCertified ? '"Yes"' : '"No"',
    ].join(','));
  });

  // FMCG Items
  fmcgFoodItems.forEach((item) => {
    rows.push([
      `"${item.id}"`,
      `"Eat_In_A_Day_Mart"`,
      `"${item.productName.replace(/"/g, '""')}"`,
      `"${item.brand.replace(/"/g, '""')}"`,
      item.quantityUnits,
      `"${item.sellerLocation.replace(/"/g, '""')}"`,
      `"${item.status}"`,
      (item.quantityUnits * 1.8).toFixed(1),
      `"${item.expiryDate}"`,
      '"Yes"',
    ].join(','));
  });

  const csvContent = rows.join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="foodfarmer-live-cloud-sync.csv"');
  res.status(200).send(csvContent);
});

// Vite Middleware for Development / Static serving for Production
if (!isProd) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AnnaSetu Server listening on http://0.0.0.0:${PORT}`);
});
