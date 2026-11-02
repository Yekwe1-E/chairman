const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
let isMockMode = false;

// Check if credentials are placeholders or present
if (
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase') && 
  !supabaseAnonKey.includes('your-supabase')
) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
    console.log('✅ Connected to Supabase Cloud PostgreSQL Database');
  } catch (err) {
    console.warn('⚠️ Could not connect to Supabase Cloud. Falling back to local data store.', err.message);
    isMockMode = true;
  }
} else {
  console.log('ℹ️ Supabase environment variables not configured. Running with embedded high-performance local database engine.');
  isMockMode = true;
}

// In-Memory Database engine loaded with seed data for offline / local mode
const mockDb = {
  users: [
    { id: 'a0000000-0000-0000-0000-000000000001', full_name: 'Chief Dr. Emmanuel Okafor', email: 'admin@farm.com', password_hash: '$2a$10$aXwdKHJXFX1lO2wTD6.xK.fPhoJC0pQSk8Mwy2kbso6GmrJTLQNo2', phone: '+2348031234567', role: 'admin', status: 'active', created_at: new Date().toISOString() },
    { id: 'a0000000-0000-0000-0000-000000000002', full_name: 'Babatunde Adeleke', email: 'manager@farm.com', password_hash: '$2a$10$aXwdKHJXFX1lO2wTD6.xK.fPhoJC0pQSk8Mwy2kbso6GmrJTLQNo2', phone: '+2348029876543', role: 'manager', status: 'active', created_at: new Date().toISOString() },
    { id: 'a0000000-0000-0000-0000-000000000003', full_name: 'Aisha Bello', email: 'worker@farm.com', password_hash: '$2a$10$aXwdKHJXFX1lO2wTD6.xK.fPhoJC0pQSk8Mwy2kbso6GmrJTLQNo2', phone: '+2348145551234', role: 'worker', status: 'active', created_at: new Date().toISOString() },
    { id: 'a0000000-0000-0000-0000-000000000004', full_name: 'Chinedu Eze', email: 'finance@farm.com', password_hash: '$2a$10$aXwdKHJXFX1lO2wTD6.xK.fPhoJC0pQSk8Mwy2kbso6GmrJTLQNo2', phone: '+2347068889900', role: 'finance', status: 'active', created_at: new Date().toISOString() }
  ],
  poultry_houses: [
    { id: 'h0000000-0000-0000-0000-000000000001', house_name: 'House Alpha - Layer Unit 1', location: 'North Wing', capacity: 2500, current_population: 2150, house_type: 'Battery Cage', status: 'active', description: 'Automated battery cage system for egg laying birds', created_at: new Date().toISOString() },
    { id: 'h0000000-0000-0000-0000-000000000002', house_name: 'House Beta - Broiler Pen 1', location: 'East Wing', capacity: 2000, current_population: 1850, house_type: 'Deep Litter', status: 'active', description: 'Deep litter floor system for meat broilers', created_at: new Date().toISOString() },
    { id: 'h0000000-0000-0000-0000-000000000003', house_name: 'House Gamma - Brooder House', location: 'South Wing', capacity: 1500, current_population: 1250, house_type: 'Brooder House', status: 'active', description: 'Temperature controlled brooder pen for day-old chicks', created_at: new Date().toISOString() }
  ],
  flocks: [
    { id: 'f0000000-0000-0000-0000-000000000001', batch_number: 'FL-2026-001', breed: 'ISA Brown', bird_type: 'Layers', initial_quantity: 2200, current_quantity: 2150, male_quantity: 0, female_quantity: 2150, date_acquired: '2026-01-15', date_placed: '2026-01-15', poultry_house_id: 'h0000000-0000-0000-0000-000000000001', poultry_house_name: 'House Alpha - Layer Unit 1', supplier_name: 'Zartech Hatcheries Ibadan', cost_per_bird: 850, total_acquisition_cost: 1870000, status: 'active', notes: 'High yield ISA Brown layer flock' },
    { id: 'f0000000-0000-0000-0000-000000000002', batch_number: 'FL-2026-002', breed: 'Cobb 500', bird_type: 'Broilers', initial_quantity: 1900, current_quantity: 1850, male_quantity: 950, female_quantity: 900, date_acquired: '2026-05-10', date_placed: '2026-05-10', poultry_house_id: 'h0000000-0000-0000-0000-000000000002', poultry_house_name: 'House Beta - Broiler Pen 1', supplier_name: 'CHI Farms Ogun', cost_per_bird: 720, total_acquisition_cost: 1368000, status: 'active', notes: 'Cobb 500 fast-growing broiler batch' },
    { id: 'f0000000-0000-0000-0000-000000000003', batch_number: 'FL-2026-003', breed: 'Bovan Nera', bird_type: 'Chicks', initial_quantity: 1300, current_quantity: 1250, male_quantity: 50, female_quantity: 1200, date_acquired: '2026-07-20', date_placed: '2026-07-20', poultry_house_id: 'h0000000-0000-0000-0000-000000000003', poultry_house_name: 'House Gamma - Brooder House', supplier_name: 'Amo Byng Farms', cost_per_bird: 650, total_acquisition_cost: 845000, status: 'active', notes: 'Day-old chicks in brooding stage' }
  ],
  daily_activities: [
    { id: 'd0000000-0000-0000-0000-000000000001', activity_date: '2026-08-10', flock_id: 'f0000000-0000-0000-0000-000000000001', batch_number: 'FL-2026-001', feed_consumed_kg: 240.5, water_consumed_liters: 480, mortality_count: 2, eggs_collected: 1890, notes: 'Normal feed consumption and egg production', recorded_by_name: 'Aisha Bello' },
    { id: 'd0000000-0000-0000-0000-000000000002', activity_date: '2026-08-11', flock_id: 'f0000000-0000-0000-0000-000000000001', batch_number: 'FL-2026-001', feed_consumed_kg: 245, water_consumed_liters: 490, mortality_count: 3, eggs_collected: 1910, notes: 'Optimal layer performance observed', recorded_by_name: 'Aisha Bello' },
    { id: 'd0000000-0000-0000-0000-000000000003', activity_date: '2026-08-12', flock_id: 'f0000000-0000-0000-0000-000000000001', batch_number: 'FL-2026-001', feed_consumed_kg: 248, water_consumed_liters: 500, mortality_count: 1, eggs_collected: 1940, notes: 'Morning egg collection routine completed', recorded_by_name: 'Aisha Bello' }
  ],
  mortality_records: [
    { id: 'm0000000-0000-0000-0000-000000000001', record_date: '2026-08-07', flock_id: 'f0000000-0000-0000-0000-000000000001', batch_number: 'FL-2026-001', poultry_house_name: 'House Alpha - Layer Unit 1', quantity: 4, cause_of_death: 'Heat Stress', remarks: 'Ventilation fans checked and boosted', recorded_by_name: 'Aisha Bello' },
    { id: 'm0000000-0000-0000-0000-000000000002', record_date: '2026-08-10', flock_id: 'f0000000-0000-0000-0000-000000000002', batch_number: 'FL-2026-002', poultry_house_name: 'House Beta - Broiler Pen 1', quantity: 3, cause_of_death: 'Ascites / Water Belly', remarks: 'Isolating affected birds', recorded_by_name: 'Aisha Bello' }
  ],
  egg_production: [
    { id: 'e0000000-0000-0000-0000-000000000001', production_date: '2026-08-10', flock_id: 'f0000000-0000-0000-0000-000000000001', batch_number: 'FL-2026-001', total_eggs: 1890, good_eggs: 1850, broken_eggs: 25, damaged_eggs: 15, cracked_eggs: 10, marketable_eggs: 1850, remarks: 'Cracked eggs sent to staff kitchen', recorded_by_name: 'Aisha Bello' },
    { id: 'e0000000-0000-0000-0000-000000000002', production_date: '2026-08-11', flock_id: 'f0000000-0000-0000-0000-000000000001', batch_number: 'FL-2026-001', total_eggs: 1910, good_eggs: 1875, broken_eggs: 20, damaged_eggs: 15, cracked_eggs: 8, marketable_eggs: 1875, remarks: 'Clean eggs crated into 62 trays', recorded_by_name: 'Aisha Bello' },
    { id: 'e0000000-0000-0000-0000-000000000003', production_date: '2026-08-12', flock_id: 'f0000000-0000-0000-0000-000000000001', batch_number: 'FL-2026-001', total_eggs: 1940, good_eggs: 1910, broken_eggs: 18, damaged_eggs: 12, cracked_eggs: 5, marketable_eggs: 1910, remarks: 'High production yield today', recorded_by_name: 'Aisha Bello' }
  ],
  feed_inventory: [
    { id: 'fd000000-0000-0000-0000-000000000001', feed_name: 'Vital Feed Layer Mash 25kg', feed_type: 'Layer', unit: 'bags', quantity_purchased: 200, quantity_consumed: 85, current_stock: 115, reorder_level: 30, unit_price: 14500, supplier_name: 'Grand Cereals Jos', expiry_date: '2026-11-30', storage_location: 'Feed Store A' },
    { id: 'fd000000-0000-0000-0000-000000000002', feed_name: 'TopFeed Broiler Finisher 25kg', feed_type: 'Finisher', unit: 'bags', quantity_purchased: 150, quantity_consumed: 90, current_stock: 60, reorder_level: 25, unit_price: 16200, supplier_name: 'Premier Feeds Ibadan', expiry_date: '2026-10-15', storage_location: 'Feed Store B' },
    { id: 'fd000000-0000-0000-0000-000000000003', feed_name: 'Chikun Chick Starter 25kg', feed_type: 'Starter', unit: 'bags', quantity_purchased: 100, quantity_consumed: 75, current_stock: 25, reorder_level: 30, unit_price: 15800, supplier_name: 'OLAM Animal Feeds', expiry_date: '2026-09-20', storage_location: 'Feed Store A' }
  ],
  medications: [
    { id: 'md000000-0000-0000-0000-000000000001', name: 'Vitalyte Multivitamin Sachet', type: 'Vitamin', current_stock: 45, unit: 'sachets', minimum_stock: 10, unit_cost: 1200, supplier: 'Tufac Vet Services', expiry_date: '2027-04-15', description: 'Essential water-soluble anti-stress multivitamins' },
    { id: 'md000000-0000-0000-0000-000000000002', name: 'Oxytet 20% Soluble Powder', type: 'Antibiotic', current_stock: 12, unit: 'tins', minimum_stock: 5, unit_cost: 4500, supplier: 'Animal Health Ltd', expiry_date: '2026-12-10', description: 'Broad-spectrum antibiotic for bacterial infection prevention' },
    { id: 'md000000-0000-0000-0000-000000000003', name: 'Piperazine Dewormer 500g', type: 'Dewormer', current_stock: 4, unit: 'packs', minimum_stock: 5, unit_cost: 3800, supplier: 'Vetraco Nig Ltd', expiry_date: '2026-08-30', description: 'Flock deworming treatment' }
  ],
  vaccinations: [
    { id: 'v0000000-0000-0000-0000-000000000001', vaccine_name: 'Lasota Newcastle Vaccine', flock_id: 'f0000000-0000-0000-0000-000000000001', batch_number: 'FL-2026-001', date_administered: '2026-06-01', next_due_date: '2026-09-01', dosage: '1000 doses in drinking water', administered_by: 'Dr. Alabi Vet Clinic', status: 'completed', notes: 'Boosted immunity against Newcastle disease' },
    { id: 'v0000000-0000-0000-0000-000000000002', vaccine_name: 'Gumboro (IBD) Vaccine', flock_id: 'f0000000-0000-0000-0000-000000000003', batch_number: 'FL-2026-003', date_administered: '2026-07-28', next_due_date: '2026-08-18', dosage: '2 drops ocular', administered_by: 'Babatunde Adeleke', status: 'scheduled', notes: 'Second dose for day-old chick flock' }
  ],
  inventory: [
    { id: 'inv00000-0000-0000-0000-000000000001', item_name: 'Vital Feed Layer Mash 25kg', category: 'Feed', quantity: 115, unit: 'bags', min_threshold: 30, unit_price: 14500, location: 'Feed Store A', status: 'in_stock' },
    { id: 'inv00000-0000-0000-0000-000000000002', item_name: 'Egg Crates (Plastic Trays)', category: 'Packaging Materials', quantity: 450, unit: 'pcs', min_threshold: 100, unit_price: 650, location: 'Store B', status: 'in_stock' },
    { id: 'inv00000-0000-0000-0000-000000000003', item_name: 'Piperazine Dewormer 500g', category: 'Medication', quantity: 4, unit: 'packs', min_threshold: 5, location: 'Pharmacy Cabinet', status: 'low_stock' }
  ],
  equipment: [
    { id: 'eq000000-0000-0000-0000-000000000001', name: 'Lister Petter 25kVA Diesel Generator', category: 'Generators', quantity: 1, purchase_date: '2025-03-10', purchase_price: 4200000, condition: 'Good', location: 'Power House', last_maintenance_date: '2026-07-01', next_maintenance_date: '2026-09-01', status: 'Operational', description: 'Backup power supply for farm ventilation & lighting' },
    { id: 'eq000000-0000-0000-0000-000000000002', name: 'Automated Bell Drinkers', category: 'Drinkers', quantity: 120, purchase_date: '2025-05-15', purchase_price: 600000, condition: 'Good', location: 'House Alpha & Beta', last_maintenance_date: '2026-06-15', next_maintenance_date: '2026-09-15', status: 'Operational', description: 'Poultry drinking water distribution units' }
  ],
  customers: [
    { id: 'c0000000-0000-0000-0000-000000000001', name: 'Mrs. Blessing Okoro (Blessing Supermarket)', phone: '+2348039991122', email: 'blessing@supermarket.ng', address: '15 Commercial Avenue, Ikeja, Lagos', customer_type: 'Wholesale', total_purchases: 3450000, outstanding_balance: 150000, notes: 'Major buyer of fresh crate eggs' },
    { id: 'c0000000-0000-0000-0000-000000000002', name: 'Mr. Alhassan Ibrahim (Kano Coldstore)', phone: '+2348023334455', email: 'ibrahim@kanocold.com', address: '44 Sabon Gari Market, Kano', customer_type: 'Distributor', total_purchases: 5200000, outstanding_balance: 0, notes: 'Bulk buyer of live broilers' }
  ],
  suppliers: [
    { id: 's0000000-0000-0000-0000-000000000001', company_name: 'Grand Cereals Limited', contact_person: 'Engr. Yusuf Mohammed', phone: '+2348051112233', email: 'sales@grandcereals.com', address: 'Km 12 Jos-Bukuru Road, Plateau State', products_supplied: 'Vital Feeds, Premixes', total_purchases: 8400000 },
    { id: 's0000000-0000-0000-0000-000000000002', company_name: 'Zartech Hatcheries Ltd', contact_person: 'Dr. Samuel Akpan', phone: '+2348034445566', email: 'orders@zartech.com', address: 'Oluyole Industrial Estate, Ibadan', products_supplied: 'Day-Old Chicks (DOC), Pullets', total_purchases: 6100000 }
  ],
  expenses: [
    { id: 'ex000000-0000-0000-0000-000000000001', expense_date: '2026-08-02', category: 'Feed', description: 'Purchase of 100 bags Layer Mash', amount: 1450000, payment_method: 'Bank Transfer', receipt_number: 'REC-2026-088', supplier_name: 'Grand Cereals Limited', recorded_by_name: 'Chinedu Eze' },
    { id: 'ex000000-0000-0000-0000-000000000002', expense_date: '2026-08-08', category: 'Electricity', description: 'Diesel fuel purchase for farm backup generator (300 Liters)', amount: 390000, payment_method: 'POS', receipt_number: 'REC-2026-104', supplier_name: 'NIPCO Filling Station', recorded_by_name: 'Chinedu Eze' },
    { id: 'ex000000-0000-0000-0000-000000000003', expense_date: '2026-08-10', category: 'Medication', description: 'Vaccine supplies and multivitamins', amount: 125000, payment_method: 'Bank Transfer', receipt_number: 'REC-2026-112', supplier_name: 'Tufac Vet Services', recorded_by_name: 'Chinedu Eze' }
  ],
  sales: [
    { id: 'sl000000-0000-0000-0000-000000000001', invoice_number: 'INV-2026-001', sale_date: '2026-08-09', customer_id: 'c0000000-0000-0000-0000-000000000001', customer_name: 'Mrs. Blessing Okoro (Blessing Supermarket)', sale_type: 'Eggs', flock_id: 'f0000000-0000-0000-0000-000000000001', batch_number: 'FL-2026-001', quantity: 120, unit_price: 3200, total_amount: 384000, payment_status: 'Paid', payment_method: 'Bank Transfer', recorded_by_name: 'Chinedu Eze' },
    { id: 'sl000000-0000-0000-0000-000000000002', invoice_number: 'INV-2026-002', sale_date: '2026-08-11', customer_id: 'c0000000-0000-0000-0000-000000000002', customer_name: 'Mr. Alhassan Ibrahim (Kano Coldstore)', sale_type: 'Birds', flock_id: 'f0000000-0000-0000-0000-000000000002', batch_number: 'FL-2026-002', quantity: 300, unit_price: 4500, total_amount: 1350000, payment_status: 'Paid', payment_method: 'Bank Transfer', recorded_by_name: 'Chinedu Eze' },
    { id: 'sl000000-0000-0000-0000-000000000003', invoice_number: 'INV-2026-003', sale_date: '2026-08-12', customer_id: 'c0000000-0000-0000-0000-000000000001', customer_name: 'Mrs. Blessing Okoro (Blessing Supermarket)', sale_type: 'Eggs', flock_id: 'f0000000-0000-0000-0000-000000000001', batch_number: 'FL-2026-001', quantity: 80, unit_price: 3200, total_amount: 256000, payment_status: 'Pending', payment_method: 'Bank Transfer', recorded_by_name: 'Chinedu Eze' }
  ],
  notifications: [
    { id: 'n0000000-0000-0000-0000-000000000001', title: 'Low Feed Warning', message: 'Chikun Chick Starter 25kg has reached reorder level (25 bags remaining).', type: 'warning', is_read: false, target_role: 'all', created_at: new Date().toISOString() },
    { id: 'n0000000-0000-0000-0000-000000000002', title: 'Upcoming Vaccination', message: 'Gumboro (IBD) vaccine due for day-old chick flock FL-2026-003.', type: 'info', is_read: false, target_role: 'all', created_at: new Date().toISOString() }
  ],
  audit_logs: [
    { id: 'al000000-0000-0000-0000-000000000001', user_email: 'admin@farm.com', action: 'System Initialization', module: 'System', record_id: 'N/A', created_at: new Date().toISOString() }
  ]
};

module.exports = {
  supabase,
  isMockMode,
  mockDb
};
