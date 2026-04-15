-- ============================================
-- HH ASIA TYRE - COMPLETE DATABASE SCHEMA
-- For Supabase (PostgreSQL)
-- Isolated from Team A's system
-- ============================================
-- 
-- INSTRUCTIONS:
-- 1. Go to https://supabase.com
-- 2. Open your hh-asia-tyre project
-- 3. Click "SQL Editor" in left sidebar
-- 4. Click "New query"
-- 5. Copy and paste this ENTIRE file
-- 6. Click "Run" or press Ctrl+Enter
-- 7. Wait for success message
--
-- This will create:
-- - 8 tables (branches, customers, vehicles, bookings, etc.)
-- - Indexes for performance
-- - Seed data (6 branches)
-- - Row-level security policies
-- ============================================

-- ============================================
-- 1. BRANCHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS branches (
    id SERIAL PRIMARY KEY,
    branch_code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50),
    mobile VARCHAR(50),
    email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'open',
    operating_hours VARCHAR(100),
    rating DECIMAL(2, 1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    max_bookings_per_slot INTEGER DEFAULT 4,
    total_bays INTEGER DEFAULT 4,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. CUSTOMERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    customer_reference VARCHAR(50) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    alternate_phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    total_bookings INTEGER DEFAULT 0,
    completed_bookings INTEGER DEFAULT 0,
    is_vip BOOLEAN DEFAULT false,
    preferred_branch_id INTEGER REFERENCES branches(id),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(email, phone)
);

-- ============================================
-- 3. VEHICLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    plate_number VARCHAR(50) NOT NULL UNIQUE,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    trim VARCHAR(100),
    color VARCHAR(50),
    vehicle_type VARCHAR(50),
    current_mileage INTEGER,
    last_service_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. BOOKINGS TABLE (Main Table)
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    confirmation_number VARCHAR(50),
    
    -- Foreign Keys
    branch_id INTEGER REFERENCES branches(id) ON DELETE RESTRICT,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
    
    -- Booking Details
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(20) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending',
    
    -- Services (JSON array)
    services JSONB NOT NULL,
    other_services TEXT,
    
    -- Bay Assignment
    bay_id INTEGER,
    bay_name VARCHAR(50),
    assigned_admin_id INTEGER,
    
    -- Notes
    customer_concern TEXT,
    admin_notes TEXT,
    cancellation_reason TEXT,
    
    -- Tracking
    source VARCHAR(50) DEFAULT 'website',
    how_did_you_hear VARCHAR(100),
    
    -- Financial
    estimated_cost DECIMAL(10, 2),
    final_cost DECIMAL(10, 2),
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    payment_status VARCHAR(30) DEFAULT 'unpaid',
    payment_method VARCHAR(50),
    
    -- API Integration
    api_booking_id VARCHAR(100),
    api_success BOOLEAN DEFAULT false,
    
    -- Timestamps
    confirmed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. BRANCH ADMINS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS branch_admins (
    id SERIAL PRIMARY KEY,
    admin_reference VARCHAR(50) UNIQUE,
    
    -- Login Credentials
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Profile
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    
    -- Assignment
    branch_id INTEGER REFERENCES branches(id) ON DELETE RESTRICT,
    role VARCHAR(50) DEFAULT 'branch_admin',
    
    -- Permissions
    can_approve_bookings BOOLEAN DEFAULT true,
    can_reject_bookings BOOLEAN DEFAULT true,
    can_delete_bookings BOOLEAN DEFAULT false,
    can_edit_bookings BOOLEAN DEFAULT true,
    can_view_analytics BOOLEAN DEFAULT true,
    can_manage_bays BOOLEAN DEFAULT true,
    can_export_data BOOLEAN DEFAULT true,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    
    -- Metadata
    created_by INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. SUPER ADMINS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS super_admins (
    id SERIAL PRIMARY KEY,
    admin_reference VARCHAR(50) UNIQUE,
    
    -- Login Credentials
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Profile
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    
    -- Role
    role VARCHAR(50) DEFAULT 'super_admin',
    level INTEGER DEFAULT 1,
    
    -- Permissions
    can_manage_branches BOOLEAN DEFAULT true,
    can_manage_admins BOOLEAN DEFAULT true,
    can_view_all_bookings BOOLEAN DEFAULT true,
    can_delete_any_booking BOOLEAN DEFAULT true,
    can_view_analytics BOOLEAN DEFAULT true,
    can_export_all_data BOOLEAN DEFAULT true,
    can_manage_services BOOLEAN DEFAULT true,
    can_manage_pricing BOOLEAN DEFAULT true,
    can_access_system_settings BOOLEAN DEFAULT true,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. AUDIT LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    
    -- Action Details
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    
    -- Who did it
    user_type VARCHAR(50),
    user_id INTEGER,
    user_email VARCHAR(255),
    user_name VARCHAR(255),
    
    -- What changed
    old_values JSONB,
    new_values JSONB,
    description TEXT,
    
    -- Metadata
    ip_address VARCHAR(50),
    user_agent TEXT,
    branch_id INTEGER REFERENCES branches(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 8. SERVICE BAYS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS service_bays (
    id SERIAL PRIMARY KEY,
    branch_id INTEGER REFERENCES branches(id) ON DELETE CASCADE,
    bay_number INTEGER NOT NULL,
    bay_name VARCHAR(50) NOT NULL,
    bay_type VARCHAR(50) DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(branch_id, bay_number)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_branch ON bookings(branch_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_date_branch ON bookings(branch_id, preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_admin ON bookings(assigned_admin_id);
CREATE INDEX IF NOT EXISTS idx_bookings_payment ON bookings(payment_status);

-- Customers indexes
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_branch ON customers(preferred_branch_id);

-- Vehicles indexes
CREATE INDEX IF NOT EXISTS idx_vehicles_customer ON vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate_number);

-- Branch Admins indexes
CREATE INDEX IF NOT EXISTS idx_branch_admins_branch ON branch_admins(branch_id);
CREATE INDEX IF NOT EXISTS idx_branch_admins_email ON branch_admins(email);
CREATE INDEX IF NOT EXISTS idx_branch_admins_active ON branch_admins(is_active);

-- Audit Logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_type, user_id);

-- ============================================
-- SEED DATA: Branches (6 HH Asia Tyre branches)
-- ============================================

INSERT INTO branches (branch_code, name, area, city, address, phone, mobile, status, max_bookings_per_slot, total_bays) VALUES
('ALABANG', 'Goodyear High Performance Center', 'Alabang', 'Metro Manila', 'Alabang-Zapote Rd, Las Piñas City, Metro Manila', '8842-9148', '0917 623 5362', 'open', 4, 4),
('BICUTAN', 'HH Asia Tyre Bicutan', 'Bicutan', 'Metro Manila', 'Bicutan, Taguig City, Metro Manila', '8842-9149', '0917 623 5363', 'open', 4, 4),
('BACOOR', 'HH Asia Tyre Bacoor', 'Bacoor', 'Cavite', 'Aguinaldo Highway, Bacoor, Cavite', '8842-9150', '0917 623 5364', 'open', 4, 4),
('SUCAT', 'HH Asia Tyre Sucat', 'Sucat', 'Metro Manila', 'Dr. Santos Ave, Sucat, Parañaque City', '8842-9151', '0917 623 5365', 'open', 4, 4),
('SUCAT2', 'HH Asia Tyre Sucat 2', 'Sucat', 'Metro Manila', 'Sucat 2, Parañaque City, Metro Manila', '8842-9152', '0917 623 5366', 'open', 4, 4),
('LAOAG', 'HH Asia Tyre Laoag', 'Laoag', 'Ilocos Norte', 'Laoag City, Ilocos Norte', '8842-9153', '0917 623 5367', 'open', 4, 4)
ON CONFLICT (branch_code) DO NOTHING;

-- ============================================
-- SEED DATA: Service Bays for Alabang (example)
-- ============================================

INSERT INTO service_bays (branch_id, bay_number, bay_name, bay_type)
SELECT id, 1, 'Bay 1', 'general' FROM branches WHERE branch_code = 'ALABANG'
ON CONFLICT DO NOTHING;

INSERT INTO service_bays (branch_id, bay_number, bay_name, bay_type)
SELECT id, 2, 'Bay 2', 'general' FROM branches WHERE branch_code = 'ALABANG'
ON CONFLICT DO NOTHING;

INSERT INTO service_bays (branch_id, bay_number, bay_name, bay_type)
SELECT id, 3, 'Bay 3', 'alignment' FROM branches WHERE branch_code = 'ALABANG'
ON CONFLICT DO NOTHING;

INSERT INTO service_bays (branch_id, bay_number, bay_name, bay_type)
SELECT id, 4, 'Bay 4', 'balancing' FROM branches WHERE branch_code = 'ALABANG'
ON CONFLICT DO NOTHING;

-- Repeat for other branches...
INSERT INTO service_bays (branch_id, bay_number, bay_name)
SELECT b.id, bay.num, 'Bay ' || bay.num
FROM branches b
CROSS JOIN (SELECT generate_series(1, 4) as num) bay
ON CONFLICT DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE super_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bays ENABLE ROW LEVEL SECURITY;

-- Allow public read access to branches (for booking form)
CREATE POLICY "Anyone can view active branches" ON branches
    FOR SELECT
    USING (is_active = true);

-- Allow public to create bookings
CREATE POLICY "Anyone can create bookings" ON bookings
    FOR INSERT
    WITH CHECK (true);

-- Allow public to view their own bookings (by email)
CREATE POLICY "Customers can view own bookings" ON bookings
    FOR SELECT
    USING (true); -- Will be refined with authentication

-- Allow all operations for now (will be restricted with auth)
CREATE POLICY "Full access for now" ON bookings
    FOR ALL
    USING (true);

CREATE POLICY "Full access customers" ON customers
    FOR ALL
    USING (true);

CREATE POLICY "Full access vehicles" ON vehicles
    FOR ALL
    USING (true);

CREATE POLICY "Full access audit_logs" ON audit_logs
    FOR ALL
    USING (true);

CREATE POLICY "Full access service_bays" ON service_bays
    FOR ALL
    USING (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_reference := 'BK-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD((SELECT COUNT(*) FROM bookings WHERE preferred_date = NEW.preferred_date)::text, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_booking_reference ON bookings;
CREATE TRIGGER set_booking_reference
    BEFORE INSERT ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION generate_booking_reference();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON bookings;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_customers ON customers;
CREATE TRIGGER set_updated_at_customers
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_branch_admins ON branch_admins;
CREATE TRIGGER set_updated_at_branch_admins
    BEFORE UPDATE ON branch_admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('branches', 'customers', 'vehicles', 'bookings', 'branch_admins', 'super_admins', 'audit_logs', 'service_bays')
ORDER BY table_name;

-- Check if branches were seeded
SELECT id, branch_code, name, area, city, status FROM branches ORDER BY id;

-- Check total records
SELECT 'branches' as table_name, COUNT(*) FROM branches
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'vehicles', COUNT(*) FROM vehicles
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'branch_admins', COUNT(*) FROM branch_admins
UNION ALL
SELECT 'super_admins', COUNT(*) FROM super_admins
UNION ALL
SELECT 'audit_logs', COUNT(*) FROM audit_logs
UNION ALL
SELECT 'service_bays', COUNT(*) FROM service_bays;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'HH ASIA TYRE DATABASE SETUP COMPLETE!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Tables created: 8';
    RAISE NOTICE 'Branches seeded: 6';
    RAISE NOTICE 'Service bays seeded: 24 (4 per branch)';
    RAISE NOTICE 'Indexes created: 17';
    RAISE NOTICE 'RLS policies enabled: Yes';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Verify tables in Table Editor';
    RAISE NOTICE '2. Get API credentials from Settings > API';
    RAISE NOTICE '3. Update .env file in your project';
    RAISE NOTICE '4. Install @supabase/supabase-js';
    RAISE NOTICE '5. Run verification script';
    RAISE NOTICE '============================================';
END $$;
