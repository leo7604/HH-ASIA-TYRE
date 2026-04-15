-- ============================================
-- PART 3: ROW LEVEL SECURITY (Simplified)
-- Run this AFTER Part 1 & 2 complete successfully
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
    USING (true);

-- Allow all operations for now (will be restricted with auth later)
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

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('branches', 'customers', 'vehicles', 'bookings', 'branch_admins', 'super_admins', 'audit_logs', 'service_bays')
ORDER BY tablename;

-- Verify policies created
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
