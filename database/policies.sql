-- ========================================================
-- Automated Poultry Farm Management System (APFMS)
-- Row Level Security (RLS) Policies for Supabase
-- ========================================================

-- Enable Row Level Security on all core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE poultry_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE flocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortality_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. USERS POLICIES
CREATE POLICY "Admins can manage all users" ON users
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- 2. POULTRY HOUSES POLICIES
CREATE POLICY "Authenticated users can view houses" ON poultry_houses
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and Managers can insert/update houses" ON poultry_houses
    FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'manager'));

-- 3. FLOCKS POLICIES
CREATE POLICY "Authenticated users can view flocks" ON flocks
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and Managers can manage flocks" ON flocks
    FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'manager'));

-- 4. DAILY ACTIVITIES & OPERATIONAL POLICIES
CREATE POLICY "Workers, Managers, Admins can view and insert daily activities" ON daily_activities
    FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'manager', 'worker'));

CREATE POLICY "Workers, Managers, Admins can log mortality" ON mortality_records
    FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'manager', 'worker'));

CREATE POLICY "Workers, Managers, Admins can log egg production" ON egg_production
    FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'manager', 'worker'));

-- 5. FINANCIALS POLICIES (Sales & Expenses)
CREATE POLICY "Admins, Managers, Finance can view and write sales" ON sales
    FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'manager', 'finance'));

CREATE POLICY "Admins, Managers, Finance can view and write expenses" ON expenses
    FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'manager', 'finance'));

-- 6. INVENTORY & EQUIPMENT POLICIES
CREATE POLICY "All authenticated users can view inventory" ON inventory
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and Managers can modify inventory" ON inventory
    FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'manager'));

-- 7. NOTIFICATIONS POLICIES
CREATE POLICY "All users can view notifications" ON notifications
    FOR SELECT USING (auth.role() = 'authenticated');
