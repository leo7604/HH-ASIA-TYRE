-- ============================================
-- PART 2: CREATE INDEXES, SEED DATA, AND TRIGGERS
-- Run this AFTER Part 1 completes successfully
-- ============================================

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
-- SEED DATA: Service Bays (4 per branch = 24 total)
-- ============================================

INSERT INTO service_bays (branch_id, bay_number, bay_name, bay_type)
SELECT b.id, bay.num, 'Bay ' || bay.num, 
       CASE 
           WHEN bay.num = 3 THEN 'alignment'
           WHEN bay.num = 4 THEN 'balancing'
           ELSE 'general'
       END
FROM branches b
CROSS JOIN (SELECT generate_series(1, 4) as num) bay
ON CONFLICT (branch_id, bay_number) DO NOTHING;

-- ============================================
-- TRIGGERS
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
-- VERIFICATION
-- ============================================

-- Check branches
SELECT id, branch_code, name, area, city, status FROM branches ORDER BY id;

-- Check service bays count
SELECT branch_id, COUNT(*) as bay_count FROM service_bays GROUP BY branch_id ORDER BY branch_id;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'PART 2 COMPLETE!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Indexes created: 17';
    RAISE NOTICE 'Branches seeded: 6';
    RAISE NOTICE 'Service bays seeded: 24';
    RAISE NOTICE 'Triggers created: 4';
    RAISE NOTICE '============================================';
END $$;
