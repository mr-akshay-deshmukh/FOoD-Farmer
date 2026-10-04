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

export interface DispatchVehicle {
  id: string;
  vehicleId: string;
  vehicleType: string;
  driverName: string;
  currentLocation: string;
  stops: {
    type: string;
    location: string;
    payload: string;
    priority: string;
    status: string;
  }[];
  status: string;
  etaMins: number;
  co2SavedPerRunKg: number;
}

export interface SustainabilityMetrics {
  totalFoodSavedKg: number;
  mealsProvidedToNeedy: number;
  co2PreventedKg: number;
  waterConservedM3: number;
  landfillDiversionPercent: number;
  financialLossAvoidedRs: number;
  registeredOutletsCount: number;
  registeredNgosCount: number;
  activeBadgesIssued: number;
}

export interface QRVerificationRecord {
  id: string;
  tokenCode: string;
  itemType: 'surplus_food' | 'fmcg_food' | 'budget_deal' | 'cold_storage_transfer';
  title: string;
  sourceEntity: string;
  destinationEntity: string;
  verifiedAt: string;
  quantityInfo: string;
  status: 'valid' | 'expired_warning' | 'temperature_alert' | 'already_redeemed';
  statusLabel: string;
  temperatureLog?: string;
  expiryDate?: string;
  safetyScore: number;
  intakeOperator: string;
  intakeNotes?: string;
  intakeStatus: 'pending_intake' | 'intake_verified' | 'quarantined';
  manifestId?: string;
}

export interface IntegrationService {
  id: string;
  name: string;
  category: 'cloud_sync' | 'messaging' | 'erp_pos' | 'iot_sensors' | 'logistics' | 'compliance';
  description: string;
  status: 'connected' | 'configured' | 'available';
  icon: string;
  syncFrequency: string;
  lastSyncedAt?: string;
  endpointUrl?: string;
  authMethod: 'OAuth 2.0' | 'HMAC Signature' | 'API Key Bearer' | 'MQTT Broker';
  metrics: {
    label: string;
    value: string;
  };
}

export interface WebhookLogRecord {
  id: string;
  eventType: string;
  targetEndpoint: string;
  timestamp: string;
  statusCode: number;
  latencyMs: number;
  payloadSnippet: string;
  status: 'success' | 'failed' | 'retrying';
}

export interface IoTTelemetryNode {
  nodeId: string;
  facility: string;
  temperatureDegC: number;
  targetRangeDegC: string;
  humidityPercent: number;
  powerSource: 'Mains Grid' | 'Diesel Backup Generator' | 'Solar Cold-Inverter';
  status: 'optimal' | 'warning' | 'critical';
  lastPing: string;
}

