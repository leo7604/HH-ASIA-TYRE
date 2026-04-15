-- ============================================
-- PART 1: CREATE ALL TABLES
-- Run this FIRST
-- ============================================

-- 1. BRANCHES TABLE
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

-- 2. CUSTOMERS TABLE
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

-- 3. VEHICLES TABLE
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

-- 4. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    confirmation_number VARCHAR(50),
    branch_id INTEGER REFERENCES branches(id) ON DELETE RESTRICT,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(20) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending',
    services JSONB NOT NULL,
    other_services TEXT,
    bay_id INTEGER,
    bay_name VARCHAR(50),
    assigned_admin_id INTEGER,
    customer_concern TEXT,
    admin_notes TEXT,
    cancellation_reason TEXT,
    source VARCHAR(50) DEFAULT 'website',
    how_did_you_hear VARCHAR(100),
    estimated_cost DECIMAL(10, 2),
    final_cost DECIMAL(10, 2),
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    payment_status VARCHAR(30) DEFAULT 'unpaid',
    payment_method VARCHAR(50),
    api_booking_id VARCHAR(100),
    api_success BOOLEAN DEFAULT false,
    confirmed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. BRANCH ADMINS TABLE
CREATE TABLE IF NOT EXISTS branch_admins (
    id SERIAL PRIMARY KEY,
    admin_reference VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    branch_id INTEGER REFERENCES branches(id) ON DELETE RESTRICT,
    role VARCHAR(50) DEFAULT 'branch_admin',
    can_approve_bookings BOOLEAN DEFAULT true,
    can_reject_bookings BOOLEAN DEFAULT true,
    can_delete_bookings BOOLEAN DEFAULT false,
    can_edit_bookings BOOLEAN DEFAULT true,
    can_view_analytics BOOLEAN DEFAULT true,
    can_manage_bays BOOLEAN DEFAULT true,
    can_export_data BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_by INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. SUPER ADMINS TABLE
CREATE TABLE IF NOT EXISTS super_admins (
    id SERIAL PRIMARY KEY,
    admin_reference VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'super_admin',
    level INTEGER DEFAULT 1,
    can_manage_branches BOOLEAN DEFAULT true,
    can_manage_admins BOOLEAN DEFAULT true,
    can_view_all_bookings BOOLEAN DEFAULT true,
    can_delete_any_booking BOOLEAN DEFAULT true,
    can_view_analytics BOOLEAN DEFAULT true,
    can_export_all_data BOOLEAN DEFAULT true,
    can_manage_services BOOLEAN DEFAULT true,
    can_manage_pricing BOOLEAN DEFAULT true,
    can_access_system_settings BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    user_type VARCHAR(50),
    user_id INTEGER,
    user_email VARCHAR(255),
    user_name VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    description TEXT,
    ip_address VARCHAR(50),
    user_agent TEXT,
    branch_id INTEGER REFERENCES branches(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. SERVICE BAYS TABLE
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

-- Verify tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('branches', 'customers', 'vehicles', 'bookings', 'branch_admins', 'super_admins', 'audit_logs', 'service_bays')
ORDER BY table_name;
