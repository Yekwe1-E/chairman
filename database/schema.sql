-- ========================================================
-- Automated Poultry Farm Management System (APFMS)
-- Database Schema (PostgreSQL / Supabase compatible)
-- ========================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'worker' CHECK (role IN ('admin', 'manager', 'worker', 'finance')),
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. POULTRY HOUSES TABLE
CREATE TABLE IF NOT EXISTS poultry_houses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    house_name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    current_population INT DEFAULT 0 CHECK (current_population >= 0),
    house_type VARCHAR(50) NOT NULL CHECK (house_type IN ('Deep Litter', 'Battery Cage', 'Free Range', 'Brooder House', 'Hatchery')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive', 'cleaning')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. BREEDS TABLE
CREATE TABLE IF NOT EXISTS breeds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Broilers', 'Layers', 'Cockerels', 'Pullets', 'Chicks', 'Dual Purpose')),
    expected_lay_rate_pct NUMERIC(5,2) DEFAULT 85.00,
    average_weight_kg NUMERIC(4,2) DEFAULT 2.50,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. FLOCKS TABLE
CREATE TABLE IF NOT EXISTS flocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number VARCHAR(50) UNIQUE NOT NULL,
    breed_id UUID REFERENCES breeds(id) ON DELETE SET NULL,
    bird_type VARCHAR(50) NOT NULL CHECK (bird_type IN ('Broilers', 'Layers', 'Cockerels', 'Pullets', 'Chicks')),
    initial_quantity INT NOT NULL CHECK (initial_quantity > 0),
    current_quantity INT NOT NULL CHECK (current_quantity >= 0),
    male_quantity INT DEFAULT 0 CHECK (male_quantity >= 0),
    female_quantity INT DEFAULT 0 CHECK (female_quantity >= 0),
    date_acquired DATE NOT NULL,
    date_placed DATE NOT NULL,
    poultry_house_id UUID REFERENCES poultry_houses(id) ON DELETE SET NULL,
    supplier_name VARCHAR(100),
    cost_per_bird NUMERIC(12,2) DEFAULT 0.00 CHECK (cost_per_bird >= 0),
    total_acquisition_cost NUMERIC(12,2) DEFAULT 0.00 CHECK (total_acquisition_cost >= 0),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'culled', 'quarantined')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. DAILY ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS daily_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    flock_id UUID REFERENCES flocks(id) ON DELETE CASCADE,
    poultry_house_id UUID REFERENCES poultry_houses(id) ON DELETE SET NULL,
    feed_consumed_kg NUMERIC(8,2) DEFAULT 0.00 CHECK (feed_consumed_kg >= 0),
    water_consumed_liters NUMERIC(8,2) DEFAULT 0.00 CHECK (water_consumed_liters >= 0),
    mortality_count INT DEFAULT 0 CHECK (mortality_count >= 0),
    eggs_collected INT DEFAULT 0 CHECK (eggs_collected >= 0),
    notes TEXT,
    recorded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. MORTALITY RECORDS TABLE
CREATE TABLE IF NOT EXISTS mortality_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    flock_id UUID REFERENCES flocks(id) ON DELETE CASCADE,
    poultry_house_id UUID REFERENCES poultry_houses(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    cause_of_death VARCHAR(100) NOT NULL,
    remarks TEXT,
    recorded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. EGG PRODUCTION TABLE
CREATE TABLE IF NOT EXISTS egg_production (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    production_date DATE NOT NULL DEFAULT CURRENT_DATE,
    flock_id UUID REFERENCES flocks(id) ON DELETE CASCADE,
    poultry_house_id UUID REFERENCES poultry_houses(id) ON DELETE SET NULL,
    total_eggs INT NOT NULL CHECK (total_eggs >= 0),
    good_eggs INT NOT NULL CHECK (good_eggs >= 0),
    broken_eggs INT DEFAULT 0 CHECK (broken_eggs >= 0),
    damaged_eggs INT DEFAULT 0 CHECK (damaged_eggs >= 0),
    cracked_eggs INT DEFAULT 0 CHECK (cracked_eggs >= 0),
    marketable_eggs INT GENERATED ALWAYS AS (total_eggs - (broken_eggs + damaged_eggs)) STORED,
    recorded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. FEED INVENTORY TABLE
CREATE TABLE IF NOT EXISTS feed_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feed_name VARCHAR(100) NOT NULL,
    feed_type VARCHAR(50) NOT NULL CHECK (feed_type IN ('Starter', 'Grower', 'Finisher', 'Layer', 'Breeder')),
    unit VARCHAR(20) DEFAULT 'kg',
    quantity_purchased NUMERIC(10,2) DEFAULT 0.00 CHECK (quantity_purchased >= 0),
    quantity_consumed NUMERIC(10,2) DEFAULT 0.00 CHECK (quantity_consumed >= 0),
    current_stock NUMERIC(10,2) NOT NULL CHECK (current_stock >= 0),
    reorder_level NUMERIC(10,2) DEFAULT 100.00,
    unit_price NUMERIC(12,2) DEFAULT 0.00 CHECK (unit_price >= 0),
    supplier_name VARCHAR(100),
    expiry_date DATE,
    storage_location VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. MEDICATIONS TABLE
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Antibiotic', 'Vitamin', 'Dewormer', 'Disinfectant', 'Supplement', 'Vaccine')),
    current_stock NUMERIC(10,2) NOT NULL CHECK (current_stock >= 0),
    unit VARCHAR(20) DEFAULT 'bottles',
    minimum_stock NUMERIC(10,2) DEFAULT 5.00,
    unit_cost NUMERIC(12,2) DEFAULT 0.00,
    supplier VARCHAR(100),
    expiry_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. VACCINATIONS TABLE
CREATE TABLE IF NOT EXISTS vaccinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vaccine_name VARCHAR(100) NOT NULL,
    flock_id UUID REFERENCES flocks(id) ON DELETE CASCADE,
    date_administered DATE NOT NULL,
    next_due_date DATE,
    dosage VARCHAR(50),
    administered_by VARCHAR(100),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('scheduled', 'completed', 'overdue', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. GENERAL INVENTORY TABLE
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Feed', 'Medication', 'Vaccines', 'Equipment', 'Farm Supplies', 'Packaging Materials', 'Other')),
    quantity NUMERIC(10,2) NOT NULL CHECK (quantity >= 0),
    unit VARCHAR(20) DEFAULT 'pcs',
    min_threshold NUMERIC(10,2) DEFAULT 10.00,
    unit_price NUMERIC(12,2) DEFAULT 0.00,
    location VARCHAR(100),
    status VARCHAR(20) DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. EQUIPMENT TABLE
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Feeders', 'Drinkers', 'Incubators', 'Generators', 'Fans', 'Brooders', 'Water Pumps', 'Egg Trays', 'Other')),
    quantity INT NOT NULL CHECK (quantity >= 0),
    purchase_date DATE,
    purchase_price NUMERIC(12,2) DEFAULT 0.00,
    condition VARCHAR(50) DEFAULT 'Good' CHECK (condition IN ('New', 'Good', 'Fair', 'Needs Repair', 'Scrapped')),
    location VARCHAR(100),
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    status VARCHAR(20) DEFAULT 'Operational' CHECK (status IN ('Operational', 'Under Maintenance', 'Broken', 'Decommissioned')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    customer_type VARCHAR(50) DEFAULT 'Wholesale' CHECK (customer_type IN ('Retail', 'Wholesale', 'Distributor', 'Hotel/Restaurant')),
    total_purchases NUMERIC(12,2) DEFAULT 0.00,
    outstanding_balance NUMERIC(12,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. SUPPLIERS TABLE
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    products_supplied TEXT,
    total_purchases NUMERIC(12,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. SALES TABLE
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    sale_type VARCHAR(50) NOT NULL CHECK (sale_type IN ('Birds', 'Eggs', 'Manure', 'Other')),
    flock_id UUID REFERENCES flocks(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
    payment_status VARCHAR(20) DEFAULT 'Paid' CHECK (payment_status IN ('Paid', 'Pending', 'Partial', 'Overdue')),
    payment_method VARCHAR(50) DEFAULT 'Bank Transfer' CHECK (payment_method IN ('Cash', 'Bank Transfer', 'POS', 'Cheque')),
    recorded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Feed', 'Medication', 'Vaccination', 'Labour', 'Transportation', 'Electricity', 'Water', 'Equipment', 'Repairs', 'Bird Purchase', 'Other')),
    description TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50) DEFAULT 'Bank Transfer' CHECK (payment_method IN ('Cash', 'Bank Transfer', 'POS', 'Cheque')),
    receipt_number VARCHAR(50),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    recorded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'danger', 'success')),
    is_read BOOLEAN DEFAULT FALSE,
    target_role VARCHAR(50) DEFAULT 'all',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    record_id VARCHAR(100),
    previous_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_flocks_house ON flocks(poultry_house_id);
CREATE INDEX IF NOT EXISTS idx_daily_act_date ON daily_activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_mortality_flock ON mortality_records(flock_id);
CREATE INDEX IF NOT EXISTS idx_eggs_flock ON egg_production(flock_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
