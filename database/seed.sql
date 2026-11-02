-- ========================================================
-- Automated Poultry Farm Management System (APFMS)
-- Seed Data SQL Script (Nigerian Poultry Farm Demo)
-- UUID NOTE: All IDs use valid hex characters only (0-9, a-f)
-- ========================================================

-- Insert Roles
INSERT INTO roles (id, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'admin',   'System Administrator with full access'),
('22222222-2222-2222-2222-222222222222', 'manager', 'Farm Manager overseeing daily operations'),
('33333333-3333-3333-3333-333333333333', 'worker',  'Farm Worker recording daily flock logs'),
('44444444-4444-4444-4444-444444444444', 'finance', 'Accountant handling sales & expenses')
ON CONFLICT (name) DO NOTHING;

-- Insert Seed Users (Password for all demo accounts: "Password123!")
-- Pre-computed bcrypt hash for "Password123!": $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO users (id, full_name, email, password_hash, phone, role, role_id, status) VALUES
('a0000000-0000-0000-0000-000000000001', 'Chief Dr. Emmanuel Okafor', 'admin@farm.com',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+2348031234567', 'admin',   '11111111-1111-1111-1111-111111111111', 'active'),
('a0000000-0000-0000-0000-000000000002', 'Babatunde Adeleke',         'manager@farm.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+2348029876543', 'manager', '22222222-2222-2222-2222-222222222222', 'active'),
('a0000000-0000-0000-0000-000000000003', 'Aisha Bello',               'worker@farm.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+2348145551234', 'worker',  '33333333-3333-3333-3333-333333333333', 'active'),
('a0000000-0000-0000-0000-000000000004', 'Chinedu Eze',               'finance@farm.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+2347068889900', 'finance', '44444444-4444-4444-4444-444444444444', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert Poultry Houses  (old prefix h→ 0a)
INSERT INTO poultry_houses (id, house_name, location, capacity, current_population, house_type, status, description) VALUES
('0a000000-0000-0000-0000-000000000001', 'House Alpha - Layer Unit 1', 'North Wing', 2500, 2150, 'Battery Cage',  'active', 'Automated battery cage system for egg laying birds'),
('0a000000-0000-0000-0000-000000000002', 'House Beta - Broiler Pen 1', 'East Wing',  2000, 1850, 'Deep Litter',   'active', 'Deep litter floor system for meat broilers'),
('0a000000-0000-0000-0000-000000000003', 'House Gamma - Brooder House','South Wing', 1500, 1250, 'Brooder House', 'active', 'Temperature controlled brooder pen for day-old chicks')
ON CONFLICT (id) DO NOTHING;

-- Insert Breeds  (b is valid hex — unchanged)
INSERT INTO breeds (id, name, category, expected_lay_rate_pct, average_weight_kg) VALUES
('b0000000-0000-0000-0000-000000000001', 'ISA Brown', 'Layers',       92.50, 1.95),
('b0000000-0000-0000-0000-000000000002', 'Cobb 500',  'Broilers',      0.00, 3.20),
('b0000000-0000-0000-0000-000000000003', 'Bovan Nera','Layers',        90.00, 2.05),
('b0000000-0000-0000-0000-000000000004', 'Noiler',    'Dual Purpose',  65.00, 2.80)
ON CONFLICT (id) DO NOTHING;

-- Insert Flocks  (f is valid hex — unchanged; poultry_house_id refs updated to 0a)
INSERT INTO flocks (id, batch_number, breed_id, bird_type, initial_quantity, current_quantity, male_quantity, female_quantity, date_acquired, date_placed, poultry_house_id, supplier_name, cost_per_bird, total_acquisition_cost, status, notes) VALUES
('f0000000-0000-0000-0000-000000000001', 'FL-2026-001', 'b0000000-0000-0000-0000-000000000001', 'Layers',  2200, 2150,   0, 2150, '2026-01-15', '2026-01-15', '0a000000-0000-0000-0000-000000000001', 'Zartech Hatcheries Ibadan', 850.00, 1870000.00, 'active', 'High yield ISA Brown layer flock'),
('f0000000-0000-0000-0000-000000000002', 'FL-2026-002', 'b0000000-0000-0000-0000-000000000002', 'Broilers', 1900, 1850, 950,  900, '2026-05-10', '2026-05-10', '0a000000-0000-0000-0000-000000000002', 'CHI Farms Ogun',            720.00, 1368000.00, 'active', 'Cobb 500 fast-growing broiler batch'),
('f0000000-0000-0000-0000-000000000003', 'FL-2026-003', 'b0000000-0000-0000-0000-000000000003', 'Chicks',  1300, 1250,  50, 1200, '2026-07-20', '2026-07-20', '0a000000-0000-0000-0000-000000000003', 'Amo Byng Farms',            650.00,  845000.00, 'active', 'Day-old chicks in brooding stage')
ON CONFLICT (id) DO NOTHING;

-- Insert Daily Activities  (d is valid hex — unchanged; poultry_house_id refs updated to 0a)
INSERT INTO daily_activities (id, activity_date, flock_id, poultry_house_id, feed_consumed_kg, water_consumed_liters, mortality_count, eggs_collected, notes, recorded_by) VALUES
('d0000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', 'f0000000-0000-0000-0000-000000000001', '0a000000-0000-0000-0000-000000000001', 240.50, 480.00, 2, 1890, 'Normal feed consumption and egg production',    'a0000000-0000-0000-0000-000000000003'),
('d0000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '1 day',  'f0000000-0000-0000-0000-000000000001', '0a000000-0000-0000-0000-000000000001', 245.00, 490.00, 3, 1910, 'Optimal layer performance observed',             'a0000000-0000-0000-0000-000000000003'),
('d0000000-0000-0000-0000-000000000003', CURRENT_DATE,                      'f0000000-0000-0000-0000-000000000001', '0a000000-0000-0000-0000-000000000001', 248.00, 500.00, 1, 1940, 'Morning egg collection routine completed',        'a0000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- Insert Mortality Records  (old prefix m → 0b)
INSERT INTO mortality_records (id, record_date, flock_id, poultry_house_id, quantity, cause_of_death, remarks, recorded_by) VALUES
('0b000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '5 days', 'f0000000-0000-0000-0000-000000000001', '0a000000-0000-0000-0000-000000000001', 4, 'Heat Stress',         'Ventilation fans checked and boosted', 'a0000000-0000-0000-0000-000000000003'),
('0b000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '2 days', 'f0000000-0000-0000-0000-000000000002', '0a000000-0000-0000-0000-000000000002', 3, 'Ascites / Water Belly','Isolating affected birds',             'a0000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- Insert Egg Production Records  (e is valid hex — unchanged; poultry_house_id refs updated to 0a)
INSERT INTO egg_production (id, production_date, flock_id, poultry_house_id, total_eggs, good_eggs, broken_eggs, damaged_eggs, cracked_eggs, remarks, recorded_by) VALUES
('e0000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', 'f0000000-0000-0000-0000-000000000001', '0a000000-0000-0000-0000-000000000001', 1890, 1850, 25, 15, 10, 'Cracked eggs sent to staff kitchen',  'a0000000-0000-0000-0000-000000000003'),
('e0000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '1 day',  'f0000000-0000-0000-0000-000000000001', '0a000000-0000-0000-0000-000000000001', 1910, 1875, 20, 15,  8, 'Clean eggs crated into 62 trays',     'a0000000-0000-0000-0000-000000000003'),
('e0000000-0000-0000-0000-000000000003', CURRENT_DATE,                      'f0000000-0000-0000-0000-000000000001', '0a000000-0000-0000-0000-000000000001', 1940, 1910, 18, 12,  5, 'High production yield today',          'a0000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- Insert Feed Inventory  (fd: both f and d are valid hex — unchanged)
INSERT INTO feed_inventory (id, feed_name, feed_type, unit, quantity_purchased, quantity_consumed, current_stock, reorder_level, unit_price, supplier_name, expiry_date, storage_location) VALUES
('fd000000-0000-0000-0000-000000000001', 'Vital Feed Layer Mash 25kg',    'Layer',    'bags', 200, 85, 115, 30, 14500.00, 'Grand Cereals Jos',    '2026-11-30', 'Feed Store A'),
('fd000000-0000-0000-0000-000000000002', 'TopFeed Broiler Finisher 25kg', 'Finisher', 'bags', 150, 90,  60, 25, 16200.00, 'Premier Feeds Ibadan', '2026-10-15', 'Feed Store B'),
('fd000000-0000-0000-0000-000000000003', 'Chikun Chick Starter 25kg',    'Starter',  'bags', 100, 75,  25, 30, 15800.00, 'OLAM Animal Feeds',    '2026-09-20', 'Feed Store A')
ON CONFLICT (id) DO NOTHING;

-- Insert Medications  (old prefix md → 0c)
INSERT INTO medications (id, name, type, current_stock, unit, minimum_stock, unit_cost, supplier, expiry_date, description) VALUES
('0c000000-0000-0000-0000-000000000001', 'Vitalyte Multivitamin Sachet', 'Vitamin',    45, 'sachets', 10, 1200.00, 'Tufac Vet Services', '2027-04-15', 'Essential water-soluble anti-stress multivitamins'),
('0c000000-0000-0000-0000-000000000002', 'Oxytet 20% Soluble Powder',   'Antibiotic', 12, 'tins',     5, 4500.00, 'Animal Health Ltd',  '2026-12-10', 'Broad-spectrum antibiotic for bacterial infection prevention'),
('0c000000-0000-0000-0000-000000000003', 'Piperazine Dewormer 500g',     'Dewormer',   4, 'packs',    5, 3800.00, 'Vetraco Nig Ltd',    '2026-08-30', 'Flock deworming treatment')
ON CONFLICT (id) DO NOTHING;

-- Insert Vaccinations  (old prefix v → 0d)
INSERT INTO vaccinations (id, vaccine_name, flock_id, date_administered, next_due_date, dosage, administered_by, status, notes) VALUES
('0d000000-0000-0000-0000-000000000001', 'Lasota Newcastle Vaccine', 'f0000000-0000-0000-0000-000000000001', '2026-06-01', '2026-09-01', '1000 doses in drinking water', 'Dr. Alabi Vet Clinic', 'completed', 'Boosted immunity against Newcastle disease'),
('0d000000-0000-0000-0000-000000000002', 'Gumboro (IBD) Vaccine',    'f0000000-0000-0000-0000-000000000003', '2026-07-28', '2026-08-18', '2 drops ocular',               'Babatunde Adeleke',    'scheduled', 'Second dose for day-old chick flock')
ON CONFLICT (id) DO NOTHING;

-- Insert Equipment  (old prefix eq → 0e)
INSERT INTO equipment (id, name, category, quantity, purchase_date, purchase_price, condition, location, last_maintenance_date, next_maintenance_date, status, description) VALUES
('0e000000-0000-0000-0000-000000000001', 'Lister Petter 25kVA Diesel Generator', 'Generators', 1,   '2025-03-10', 4200000.00, 'Good', 'Power House',         '2026-07-01', '2026-09-01', 'Operational', 'Backup power supply for farm ventilation & lighting'),
('0e000000-0000-0000-0000-000000000002', 'Automated Bell Drinkers',               'Drinkers',   120, '2025-05-15',  600000.00, 'Good', 'House Alpha & Beta', '2026-06-15', '2026-09-15', 'Operational', 'Poultry drinking water distribution units')
ON CONFLICT (id) DO NOTHING;

-- Insert Customers  (c is valid hex — unchanged)
INSERT INTO customers (id, name, phone, email, address, customer_type, total_purchases, outstanding_balance, notes) VALUES
('c0000000-0000-0000-0000-000000000001', 'Mrs. Blessing Okoro (Blessing Supermarket)', '+2348039991122', 'blessing@supermarket.ng', '15 Commercial Avenue, Ikeja, Lagos', 'Wholesale',   3450000.00, 150000.00, 'Major buyer of fresh crate eggs'),
('c0000000-0000-0000-0000-000000000002', 'Mr. Alhassan Ibrahim (Kano Coldstore)',      '+2348023334455', 'ibrahim@kanocold.com',     '44 Sabon Gari Market, Kano',         'Distributor', 5200000.00,      0.00, 'Bulk buyer of live broilers')
ON CONFLICT (id) DO NOTHING;

-- Insert Suppliers  (old prefix s → 0f)
INSERT INTO suppliers (id, company_name, contact_person, phone, email, address, products_supplied, total_purchases) VALUES
('0f000000-0000-0000-0000-000000000001', 'Grand Cereals Limited', 'Engr. Yusuf Mohammed', '+2348051112233', 'sales@grandcereals.com', 'Km 12 Jos-Bukuru Road, Plateau State', 'Vital Feeds, Premixes',          8400000.00),
('0f000000-0000-0000-0000-000000000002', 'Zartech Hatcheries Ltd','Dr. Samuel Akpan',     '+2348034445566', 'orders@zartech.com',      'Oluyole Industrial Estate, Ibadan',    'Day-Old Chicks (DOC), Pullets', 6100000.00)
ON CONFLICT (id) DO NOTHING;

-- Insert Expenses  (old prefix ex → aa)
INSERT INTO expenses (id, expense_date, category, description, amount, payment_method, receipt_number, supplier_id, recorded_by) VALUES
('aa000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '10 days', 'Feed',       'Purchase of 100 bags Layer Mash',                         1450000.00, 'Bank Transfer', 'REC-2026-088', '0f000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004'),
('aa000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '4 days',  'Electricity','Diesel fuel purchase for farm backup generator (300 Liters)', 390000.00, 'POS',           'REC-2026-104', NULL,                                   'a0000000-0000-0000-0000-000000000004'),
('aa000000-0000-0000-0000-000000000003', CURRENT_DATE - INTERVAL '2 days',  'Medication', 'Vaccine supplies and multivitamins',                         125000.00, 'Bank Transfer', 'REC-2026-112', NULL,                                   'a0000000-0000-0000-0000-000000000004')
ON CONFLICT (id) DO NOTHING;

-- Insert Sales  (old prefix sl → ab)
INSERT INTO sales (id, invoice_number, sale_date, customer_id, sale_type, flock_id, quantity, unit_price, total_amount, payment_status, payment_method, recorded_by) VALUES
('ab000000-0000-0000-0000-000000000001', 'INV-2026-001', CURRENT_DATE - INTERVAL '3 days', 'c0000000-0000-0000-0000-000000000001', 'Eggs',  'f0000000-0000-0000-0000-000000000001', 120, 3200.00,  384000.00, 'Paid',    'Bank Transfer', 'a0000000-0000-0000-0000-000000000004'),
('ab000000-0000-0000-0000-000000000002', 'INV-2026-002', CURRENT_DATE - INTERVAL '1 day',  'c0000000-0000-0000-0000-000000000002', 'Birds', 'f0000000-0000-0000-0000-000000000002', 300, 4500.00, 1350000.00, 'Paid',    'Bank Transfer', 'a0000000-0000-0000-0000-000000000004'),
('ab000000-0000-0000-0000-000000000003', 'INV-2026-003', CURRENT_DATE,                      'c0000000-0000-0000-0000-000000000001', 'Eggs',  'f0000000-0000-0000-0000-000000000001',  80, 3200.00,  256000.00, 'Pending', 'Bank Transfer', 'a0000000-0000-0000-0000-000000000004')
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Notifications  (old prefix n → ac)
INSERT INTO notifications (id, title, message, type, is_read, target_role) VALUES
('ac000000-0000-0000-0000-000000000001', 'Low Feed Warning',    'Chikun Chick Starter 25kg has reached reorder level (25 bags remaining).', 'warning', false, 'all'),
('ac000000-0000-0000-0000-000000000002', 'Upcoming Vaccination','Gumboro (IBD) vaccine due for day-old chick flock FL-2026-003.',           'info',    false, 'all')
ON CONFLICT (id) DO NOTHING;
